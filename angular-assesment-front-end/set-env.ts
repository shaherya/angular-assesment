// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();
const {boolean} = require("dotenv-utils");
const fs = require('fs');
const yargs = require('yargs');

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = yargs.argv.environment;
const isProd = environment === 'prod';
const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  apiUrl: "${process.env.API_URL}"
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
