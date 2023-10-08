const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const ether = await ethers;

    return { game, ether};
  }
  it('should be a winner', async function () {
    const { game, ether } = await loadFixture(deployContractAndSetVariables);

    let signer;
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    
   for (let i = 0; i < 10; i++) {
    const add = await ether.getSigner(i);
    const signerAddress = await add.getAddress();
    console.log(`Signer ${i}: ${signerAddress}`);

    if (ethers.BigNumber.from(signerAddress) < ethers.BigNumber.from(threshold)) {
      signer = await ether.getSigner(i);
      console.log(`Selected signer: ${await signer.getAddress()}`);
      break;
    }
  }

  // good luck
  await game.connect(signer);
  try {
    await game.win();
  } catch (error) {
    console.log(`Transaction reverted with reason: ${error.message}`);
  }
    // await game.win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
