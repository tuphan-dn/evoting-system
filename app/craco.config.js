require("dotenv-cra").config();

const CracoWasm = require("./plugins/craco-wasm");
const CracoSilence = require("./plugins/craco-silence");
const CracoCompatibility = require("./plugins/craco-compatibility");

module.exports = {
  plugins: [
    {
      plugin: CracoCompatibility
    },
    {
      plugin: CracoWasm
    },
    {
      plugin: CracoSilence
    }
  ]
};
