const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --quiet --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx,md,html,css}": "prettier --ignore-unknown --write",
  "*.{js,jsx,ts,tsx}": [
    buildEslintCommand,
    'cspell --relative "{pages,src}/**/*.{ts,tsx,js,jsx}"',
  ],
};
