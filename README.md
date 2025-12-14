# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/YuliaEnik/nodejs2025Q4-service.git


```
## Installing NPM modules

```
**Standard installation** (use if `npm install` works without errors):

npm install

```

**Alternative installation** (use if the standard command fails with a version conflict error):

npm install --legacy-peer-deps

*Note: The `--legacy-peer-deps` flag is used to bypass strict version checking and is suitable for this project. For more details on this flag, see the [npm documentation](https://docs.npmjs.com/cli/v10/commands/npm-install).*

## Copy environment template:

cp .env.example .env

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

Application is running on: http://localhost:4000;
OpenAPI documentation: http://localhost:4000/doc;
OpenAPI spec saved to: doc/api.json;
