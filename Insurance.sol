pragma solidity ^0.4.11;

// all but the payIn function are just marked as `payable` so that testing in Remix is easy and we can leave a value for all calls.
contract Insurance {
    mapping(address => bool) public isInsured;
    mapping(address => uint) public numAccidents;
    mapping(address => uint) public lastPayment;
    mapping(address => bool) public kickedOut;
    
    uint public paymentPeriod = 20 seconds;
    uint public premiumPerAccident = 0.1 ether;
    
    function payIn() payable {
        if (msg.value < (numAccidents[msg.sender] + 1) * premiumPerAccident)
            throw;
        if (kickedOut[msg.sender])
            throw;
        if (checkStatus()) {
            lastPayment[msg.sender] = now;
            isInsured[msg.sender] = true;
        }
    }
    
    function checkStatus() internal returns (bool) {
        if (isInsured[msg.sender] && lastPayment[msg.sender] < now - paymentPeriod) {
            isInsured[msg.sender] = false;
            kickedOut[msg.sender] = true;
            return false;
        }
        return true;
    }
    
    function amIinsured() payable returns (bool) {
        checkStatus();
        return isInsured[msg.sender];
    }
    
    function accident() payable {
        numAccidents[msg.sender]++;
    }
    
    function getEtherOut() {
        msg.sender.transfer(this.balance);
    }
}
