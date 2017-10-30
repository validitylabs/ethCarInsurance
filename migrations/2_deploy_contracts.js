var CarInsurance = artifacts.require("./CarInsurance.sol");

module.exports = function(deployer) {
  deployer.deploy(CarInsurance);
};
