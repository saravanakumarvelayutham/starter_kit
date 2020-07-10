const Token = artifacts.require("./Token.sol");
const EthSwap = artifacts.require("./EthSwap");
const ShareItRide = artifacts.require("./ShareItRide");

//reference from DApp University Tutorial

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy EthSwap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed()

  
  // Deploy ShareIt Ride
  await deployer.deploy(ShareItRide, token.address);
  const shareItRide = await ShareItRide.deployed();

  // Transfer all tokens to EthSwap (1 million)
  await token.transfer(ethSwap.address, '1000000000000000000000000')
};
