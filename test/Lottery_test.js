const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

contract('Lottery', (accounts) => {
  const Lottery = artifacts.require('Lottery');
  const VRFCoordinatorMock = artifacts.require('MockV3Aggregator');
  const MockPriceFeed = artifacts.require('MockV3Aggregator');
  const { LinkToken } = artifacts.require(
    '@chainlink/contracts/truffle/v0.4/LinkToken',
  );

  const defaultAccount = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];
  const player3 = accounts[3];

  let lottery, vrfCoordinatorMock, seed, link, keyhash, fee, mockPriceFeed;

  describe('requests a random number', () => {
    let price = '200000000000'; //2000 usd

    beforeEach(async () => {
      keyhash =
        '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4';
      fee = '100000000000000000'; // 0.1
      seed = 123;

      link = await LinkToken.new({ from: defaultAccount });
      mockPriceFeed = await MockPriceFeed.new(8, price, {
        from: defaultAccount,
      });
      vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, {
        from: defaultAccount,
      });
      lottery = await Lottery.new(
        mockPriceFeed.address,
        vrfCoordinatorMock.address,
        link.address,
        keyhash,
        { from: defaultAccount },
      );
    });

    it('starts in a closed state', async () => {
      assert((await lottery.lotteryState()) == 1);
    });
  });
});
