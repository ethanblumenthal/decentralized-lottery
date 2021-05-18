pragma solidity ^0.6.6;
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";

contract Lottery {
    using SafeMathChainlink for uint256;
    AggregatorV3Interface internal ethUsdPriceFeed;
    uint256 usdEntryFee;

    constructor(address _ethUsdPriceFeed) public {
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
        usdEntryFee = 50;
    }

    function enter() public payable {
        require(msg.value >= getEntranceFee(), "Not enough ETH to enter");
    }

    function getEntranceFee() public view returns(uint256) {
        uint256 precision = 1 * 10 ** 18;
        uint256 price = getLatestEthUsdPrice();
        uint256 costToEnter = (precision / price) * (usdEntryFee * 100000000);
        return costToEnter;
    }

    function getLatestEthUsdPrice() public view returns(uint256) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = ethUsdPriceFeed.latestRoundData();
        return uint256(price);
    }

    // function startLottery() public {}

    // function endLottery() public {}

    // function pickWinner() {}
}