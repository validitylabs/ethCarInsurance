// all but the payIn function are just marked as `payable` so that testing in Remix is easy and we can leave a value for all calls.
contract Insurance {
    mapping(address => bool) isInsured;
    mapping(address => uint) numAccidents;
    mapping(address => bool) incassoTriggered;
    mapping(address => uint) lastPaymentTime;
    
    uint premiumPerAccident = 0.1 ether;
    uint paymentPeriod = 10 seconds;
    address owner;
    
    modifier onlyOwner () {
        if (msg.sender != owner)
            throw;
        _;
    }
    
    function AccidentInsurance() {
        owner = msg.sender;
    }
    
    function payIn() payable {
        if (incassoTriggered[msg.sender])
            throw;
        if (numAccidents[msg.sender] + 1 > msg.value / premiumPerAccident)
            throw;
        isInsured[msg.sender] = true;
    }
    
    function checkPaymentInTime() internal {
        if (isInsured[msg.sender] && lastPaymentTime[msg.sender] < now - paymentPeriod) {
            incassoTriggered[msg.sender] = true;
            isInsured[msg.sender] = false;
            lastPaymentTime[msg.sender] = now;
        }
    }
    
    function accident() payable {
        numAccidents[msg.sender]++;
    }
    
    function amIinsured() payable returns (bool) {
        return isInsured[msg.sender];
    }
}
