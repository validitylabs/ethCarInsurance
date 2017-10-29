pragma solidity ^0.4.15;

contract Insurance {
    mapping(address => bool) public isInsured;
    mapping(address => uint) public numAccidents;
    mapping(address => uint) public lastPayment;
    mapping(address => bool) public kickedOut;
    
    uint public paymentPeriod = 40 seconds;

    uint public premiumPerAccident = 0.1 ether;
    
    function payIn() public payable {
        require (msg.value >= (numAccidents[msg.sender] + 1) * premiumPerAccident);
        require (!kickedOut[msg.sender]);
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
    
    function amIinsured() public returns (bool) {
        checkStatus();
        return isInsured[msg.sender];
    }
    
    function accident() public {
        numAccidents[msg.sender]++;
    }
    
    function getEtherOut() public {
        msg.sender.transfer(this.balance);
    }
}
