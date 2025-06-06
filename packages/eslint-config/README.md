# @ubeswap/eslint-config

DBCSwap ESLint config to enforce coding standards and best practices.
This is forked from `@uniswap/eslint-config`

- TypeScript and Jest support
- Seamless Prettier integration
- Separate environments for Node.js and React

## Installation

It's already in the monorepo, just add to package.json devDependencies:

```
  "@ubeswap/eslint-config": "workspace:^"
```

## Usage

For react-native based apps and packages:

```js
module.exports = {
  extends: ['@ubeswap/eslint-config/native'],
}
```

For web-only apps:

Make sure to include `require('@ubeswap/eslint-config/load')` at the top of your ESLint config. This loads a `@rushstack/eslint-patch/modern-module-resolution` patch so that ESLint loads any plugins installed by this package. 

```js
require('@ubeswap/eslint-config/load')

module.exports = {
  extends: '@ubeswap/eslint-config/node'
}
```

or:

```js
require('@ubeswap/eslint-config/load')

module.exports = {
  extends: '@ubeswap/eslint-config/react'
}
```

#### VSCode

If you're a VSCode user, consider installing the official [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and copying [`./.vscode/settings.json`](.vscode/settings.json#L1-L6) to your own `.vscode/settings.json` configuration file. This will automatically run `eslint --fix` on save.
