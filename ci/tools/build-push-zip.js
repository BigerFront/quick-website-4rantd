#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');
const archiver = require('archiver');
const emoji = require('node-emoji');
const path = require('path');
const sh = require('shelljs');

const ERR_TEXT_RED = '#a61d24';
const SUCESS_HEX = '#a9d134';
const ZIP_NAME_REGEX = /^[a-z][a-z0-9\-\_]+(.zip)?$/;
const IPV4_REGEX = new RegExp(
  /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/
);
//^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$) 0-65535
// 20 -65535
const PORT_REGEX = new RegExp(
  /(^[2-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/
);
const DEV_ENV_VALT = 'production';
process.env.BABEL_ENV = DEV_ENV_VALT;
process.env.NODE_ENV = DEV_ENV_VALT;

const { R, dist, distzip, join } = require('../paths');
const env = require('../../config');
const {
  TARGET_TYPE,
  APP_VERSION,
  APP_NAME,
  MAIN_SERVER_HOST,
  MAIN_SERVER_PORT,
  REMOTE_USER,
  REMOTE_DIST,
  SSH_KEY,
} = env;

const DEST_DIR = R(dist, TARGET_TYPE);
const DEST_ZIP_DIR = R(distzip, TARGET_TYPE);

main()
  .then((text) => {})
  .catch((err) => {
    console.log(chalk.redBright('build-zip catch error:\n'));

    if (err && err.message) {
      console.log(err.message);
    }
  });

async function main() {
  showHelp();
  try {
    const commitTag = getCommitTag(APP_VERSION);
    const isPush = getPushZipArgv();

    const zipFilename = handleZipName(commitTag);

    console.log(
      chalk.hex(SUCESS_HEX)(`zip ${zipFilename}.....\n✔ ......\n✔ ......`)
    );
    const fullpath = await buildZip(DEST_DIR, zipFilename);
    console.log(
      chalk.hex(SUCESS_HEX)(`${emoji.emojify('✨✨✨✨✨')} ✔  zip complete.`)
    );
    if (isPush) {
      pushZipToRemote(fullpath)
        .catch((err) => {
          throw err;
        })
        .then((res) => {
          console.log(
            chalk.hex(SUCESS_HEX)(
              `🎉🎉🎉🎉🎉 Push file successful.\n\t ✔ at server path: ${res}`
            )
          );
        });
    }

    // console.log('>>>>>>>>>>', env, zipFilename, commitTag);
  } catch (error) {
    throw error;
  }
}

async function buildZip(src, filename) {
  //   !fs.existsSync(DEST_ZIP_DIR) && fs.mkdirSync(DEST_ZIP_DIR);
  fs.ensureDirSync(DEST_ZIP_DIR);

  const archive = archiver('zip', { zlib: { level: 9 } });

  const fullpath = join(DEST_ZIP_DIR, filename);
  const stream = fs.createWriteStream(fullpath);

  return new Promise((resolve, reject) => {
    archive
      .directory(src, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve(fullpath));
    archive.finalize();
  });
}

async function pushZipToRemote(src) {
  const { host, port, remoteDir = '/', sshKey, user } = await precheck();
  const cmd = buildCommand(sshKey, host, port, src, user, remoteDir);

  return new Promise((resolve, reject) => {
    if (!sh.which('ssh')) {
      return reject(chalk.red('your enviroment need ssh support'));
    }

    sh.exec(
      cmd,
      { async: false, silent: false, encoding: 'utf8' },
      function (code, stdout, stderr) {
        if (stderr && code === 1) {
          console.log(
            chalk.hex(ERR_TEXT_RED)(`Push remote failed.\n ${stderr}`)
          );
          //   return reject(`push remote failed.`);
        } else if (code === 0) {
          //   console.log(chalk.hex(SUCESS_HEX)(`Push remote successed.\n`));
          const remoteFile = cmd.slice((cmd.lastIndexOf(':') || 0) + 1);
          return resolve(remoteFile);
        }
      }
    );
  });
}

function buildCommand(sshKey, host, port, file, user, dest) {
  const remoteFilename = path.parse(file).base;
  return `SCP -i ${sshKey} -P ${port} ${file} ${user}@${host}:${dest}/${remoteFilename}`;
}
async function precheck() {
  const opts = {
    host: MAIN_SERVER_HOST,
    port: MAIN_SERVER_PORT || 22,
    user: REMOTE_USER || 'root',
    remoteDir: REMOTE_DIST,
    sshKey: SSH_KEY,
  };

  let msg = '';

  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;

  originalArgvs = originalArgvs || [];

  let idx = -1;
  let argvLen = originalArgvs.length;

  // remote-host
  idx = originalArgvs.findIndex((n) => n === '--remote-host');
  if (idx > 0 && argvLen > idx + 1) {
    IPV4_REGEX.test(originalArgvs[idx + 1]) &&
      (opts.host = originalArgvs[idx + 1]);
  }

  if (!IPV4_REGEX.test(opts.host)) {
    msg = chalk.hex(ERR_TEXT_RED)(
      `MAIN_SERVER_HOST [${opts.host}] incorrect. your edit your config file or pass by commands[--remote-host].`
    );
    throw new Error(msg);
  }

  // port
  idx = -1;
  idx = originalArgvs.findIndex((n) => n === '--remote-port');
  if (idx > 0 && argvLen > idx + 1) {
    PORT_REGEX.test(originalArgvs[idx + 1]) &&
      (opts.port = originalArgvs[idx + 1]);
  }

  idx = originalArgvs.findIndex((argv) => argv === '-k');
  idx > 0 &&
    argvLen > idx + 1 &&
    originalArgvs[idx + 1] &&
    (opts.sshKey = originalArgvs[idx + 1]);

  idx = originalArgvs.findIndex((argv) => argv === '--ssh-key');
  idx > 0 &&
    argvLen > idx + 1 &&
    originalArgvs[idx + 1] &&
    (opts.sshKey = originalArgvs[idx + 1]);

  // user
  idx = originalArgvs.findIndex((argv) => argv === '-u');
  idx > 0 &&
    argvLen > idx + 1 &&
    originalArgvs[idx + 1] &&
    (opts.user = originalArgvs[idx + 1]);

  idx = originalArgvs.findIndex((argv) => argv === '--remote-user');
  idx > 0 &&
    argvLen > idx + 1 &&
    originalArgvs[idx + 1] &&
    (opts.user = originalArgvs[idx + 1]);

  if (
    process.env.os &&
    process.env.os.toString().toLowerCase().startsWith('window') &&
    opts.sshKey.startsWith('~')
  ) {
    const home = process.env['HOME'];
    opts.sshKey = path.join(home, opts.sshKey.slice(1));
  }

  if (!fs.existsSync(path.resolve(opts.sshKey))) {
    msg = chalk.hex(ERR_TEXT_RED)(`unfound ssh-key file : ${opts.sshKey}`);
    throw new Error(msg);
  }

  return opts;
}

function cmdComments() {
  let c =
    '\n' +
    chalk.hex('#d39021')(`terminal arguments:\n`) +
    chalk.hex('#d39021')(`\t -h or --help : show commands help.\n`) +
    chalk.hex('#d39021')(`\t -p or --push-remote : open push zip to remote\n`) +
    chalk.hex('#d39021')(`\t --remote-host : remote serve host only ipv4\n`) +
    chalk.hex('#d39021')(`\t --remote-port : remote serve port\n`) +
    chalk.hex('#d39021')(`\t --remote-user or -u : remote serve user\n`) +
    chalk.hex('#d39021')(`\t -k or --ssh-key : your ssh-key path.\n`);

  return c;
}

function showHelp() {
  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;
  let idx = originalArgvs.findIndex((argv) => argv === '--help');
  let cidx = originalArgvs.findIndex((argv) => argv === '-h');
  if (idx > 0 || cidx > 0) {
    console.log(cmdComments());
    process.exit(0);
  }
}

function getPushZipArgv() {
  let isPush = false;
  if (process.env.PUSH_REMOTE === 'true') {
    return true;
  }

  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;

  if (originalArgvs && originalArgvs.length) {
    let idx = originalArgvs.findIndex((argv) => argv === '--push-remote');
    let cidx = originalArgvs.findIndex((argv) => argv === '--push-remote=true');
    let sidx = originalArgvs.findIndex((argv) => argv === '-p');

    (idx > 0 || cidx >= 0 || sidx > 0) && (isPush = true);
  }

  return isPush;
}

function handleZipName(commitTag = '') {
  const ARGV_ZIP_NAME = '--zip-name';
  let argvZipName = `${APP_NAME}-${commitTag}.zip`;

  let originalArgvs = process.env.npm_config_argv
    ? JSON.parse(process.env.npm_config_argv).original
    : process.argv;

  if (originalArgvs && originalArgvs.length) {
    let idx = originalArgvs.findIndex((argv) => argv === ARGV_ZIP_NAME);
    if (
      idx > 0 &&
      originalArgvs.length > idx + 1 &&
      new RegExp(ZIP_NAME_REGEX).test(originalArgvs[idx + 1])
    ) {
      argvZipName = originalArgvs[idx + 1].endsWith('.zip')
        ? originalArgvs[idx + 1]
        : `${originalArgvs[idx + 1]}-${commitTag}.zip`;
    }
  }

  return argvZipName;
}

function getCommitTag(version) {
  let gitStatus = require('child_process').execSync('git status -s').toString();

  if (gitStatus || gitStatus !== '' || gitStatus.trim().length > 0) {
    let msg =
      chalk.hex('#cb8')(
        ' ❌ Please commit the following code before build-zip.\n'
      ) + gitStatus;
    throw new Error(msg);
  }

  let commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString();
  const versionTag = `${version}-${
    commitHash.endsWith('\n')
      ? commitHash.substring(0, commitHash.length - 2)
      : commitHash
  }`;

  return versionTag;
}
