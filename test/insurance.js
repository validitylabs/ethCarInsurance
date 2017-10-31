/**
 * Contract artifacts
 */
const CarInsurance = artifacts.require("./CarInsurance");

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

/**
 * Expect exception throw above call of assertJump()
 *
 * @param {string} error
 */
function assertJump(error) {
  assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
}

// Increases testrpc time by the passed duration in seconds
function increaseTime(duration) {
  const id = Date.now()

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}

contract('CarInsurance', function(accounts) {
  let insuranceInstance;
  
  beforeEach(async function () {
    insuranceInstance   = await CarInsurance.deployed();
  });
    
  it('insures user', async () => {
    let insured               = await insuranceInstance.isInsured(accounts[0]);
    assert.isFalse(insured, 'User should not be insured');

    let tx                    = await insuranceInstance.underwrite({ value: 1e17 });
    insured                   = await insuranceInstance.isInsured(accounts[0]);
    assert.isTrue(insured, 'User should now be insured');
  });

  it('pays premium', async () => {
    let contractBalanceBefore = await web3.eth.getBalance(insuranceInstance.address);

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: insuranceInstance.address,
      value: 1e17
    });

    let contractBalanceAfter = await web3.eth.getBalance(insuranceInstance.address);

    let b = contractBalanceBefore.toNumber();
    let a = contractBalanceAfter.toNumber();

    contractBalanceBefore.plus(1e17).should.be.bignumber.equal(contractBalanceAfter);
  });

  it('pays premium for', async () => {
    for (var payments = 0; payments < 10; payments++) {
      await insuranceInstance.payPremiumFor(accounts[0], { value: 1e17 });
    }

    let insured               = await insuranceInstance.isInsured(accounts[0]);
    assert.isTrue(insured, 'User should still be insured');
  });
/*
  it('initiates claim process', async () => {
    let customer = await insuranceInstance.insuranceTakers(accounts[0]);
    let numAccidents = customer[3].toNumber();

    assert.equal(numAccidents, 0, 'User should have 0 accidents before first claim');

    await insuranceInstance.claim();

    customer = await insuranceInstance.insuranceTakers(accounts[0]);
    numAccidents = customer[3].toNumber();

    assert.equal(numAccidents, 1, 'User should have 1 accident after claim');
  });
*/
  it('does not pay premium in time', async () => {
    let insured               = await insuranceInstance.isInsured(accounts[0]);
    assert.isTrue(insured, 'User should still be insured');
    
    await increaseTime(31*24*60*60);

    insured                   = await insuranceInstance.isInsured(accounts[0]);

    assert.isFalse(insured, 'User should not be insured anymore after paying premium too late');    
  });

  it('pays premium too late', async () => {
    try {
      await insuranceInstance.payPremiumFor(accounts[0], { value: 1e17 });
      assert.fail('should have thrown before');
    } catch(error) {
      assertJump(error);
    }    
  });

});