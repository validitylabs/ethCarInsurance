/**
 * Contract artifacts
 */
const Insurance = artifacts.require("./Insurance");

/**
 * Expect exception throw above call of assertJump()
 *
 * @param {string} error
 */
function assertJump(error) {
  assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
}

contract('Insurance', function(accounts) {
  
  it('insures user', async () => {
    const insuranceInstance   = await Insurance.deployed();

    let insured               = await insuranceInstance.isInsured(accounts[0]);
    assert.isFalse(insured, 'User should not be insured');

    let tx                    = await insuranceInstance.payIn({ value: 1e17 });
    insured                   = await insuranceInstance.isInsured(accounts[0]);
    assert.isTrue(insured, 'User should now be insured');
    

  });
});
