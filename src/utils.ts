import { ethers, getEthersProvider } from "forta-agent";
import { providers } from "ethers";
import { daiAbi } from "./abis/dai";

export const OPTIMISM_L1_ESCROW = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
export const ARBITRUM_L1_ESCROW = "0xA10c7CE4b876998858b1a9E12b10092229539400";
export const TRANSFER_EVENT = "event Transfer(address indexed src, address indexed dst, uint wad)";
export const L1_DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const L2_DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

export async function getDaiBalance(escrowAddress: string) {
  const daiContract = new ethers.Contract(L1_DAI_ADDRESS, daiAbi, getEthersProvider());

  let balance: number;

  try {
    balance = await daiContract.balanceOf(escrowAddress);
  } catch {
    throw new Error("Invalid Dai Contract");
  }

  return balance;
}

export async function getL2TotalSupply(provider: providers.Provider) {
  const l2DaiContract = new ethers.Contract(L2_DAI_ADDRESS, daiAbi, provider);

  let totalSupply: number;

  try {
    totalSupply = await l2DaiContract.totalSupply();
  } catch {
    throw new Error("Invalid Dai Contract");
  }

  return totalSupply;
}
