/**
 * Truffle configuration
 *
 * @see https://github.com/trufflesuite/truffle-config/blob/master/index.js
 * @see https://github.com/trufflesuite/truffle/releases
 */
module.exports = {
    mocha: {
        useColors: true
    },
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        }
    }
};
