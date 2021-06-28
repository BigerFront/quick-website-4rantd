import * as Log from 'loglevel';

let LEVEL = Log.levels.WARN;

// eslint-disable-next-line no-undef
export const isDevMode = __QK_DEBUG__;

if (isDevMode) {
  LEVEL = Log.levels.DEBUG;
}

Log.setLevel(LEVEL);
export default Log;
