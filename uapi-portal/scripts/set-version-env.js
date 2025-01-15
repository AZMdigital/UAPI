/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

// Read the package.json file
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Get the version from package.json
const version = packageJson.version;

// Create the .env.local file if it doesn't exist and write the version
const envLocalPath = path.resolve(__dirname, "../.env.local");
fs.writeFileSync(envLocalPath, `NEXT_PUBLIC_APP_VERSION=${version}\n`, {
  flag: "w",
});

console.log(`App version ${version} written to .env.local`);
