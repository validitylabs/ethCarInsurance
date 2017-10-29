/**
 * Truffle configuration
 *
 * @see https://github.com/trufflesuite/truffle-config/blob/master/index.js
 * @see https://github.com/trufflesuite/truffle/releases
 */
var path        = require("path");
var basePath    = process.cwd();

var buildDir            = path.join(basePath, "build");
var buildDirContracts   = path.join(basePath, "build/contracts");
var srcDir              = path.join(basePath, "src/contracts");
var testDir             = path.join(basePath, "test/contracts");
var migrationsDir       = path.join(basePath, "migrations/contracts");

module.exports = {
    mocha: {
        useColors: true
    },
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: 1337
        }
    },
    build_directory: buildDir,
    contracts_build_directory: buildDirContracts,
    migrations_directory: migrationsDir,
    contracts_directory: srcDir,
    test_directory: testDir
};
