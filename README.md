# quick-website-4rantd

> a quick React boilerplate

## Env Required

- **Node: >=14.x**
- **Webpack: >=5.x**
- **React: current used 0.17.x** (hot loader: not worked,see React docs)

## Usage

### Development

> clone project

```bash
git clone https://github.com/BigerFront/quick-website-4rantd.git website

cd website && yarn install
```

> config locale env

```bash
cp config/.env.development.example config/.env.development.js
cp config/.env.production.example config/.env.production.js
```

> run development mode

```bash
yarn dev -h  # or yarn dev --help :see dev commands arguments
yarn dev -o # open browser
```

### Build production

> used command yarn build <commands>

```bash
yarn build -o

```
