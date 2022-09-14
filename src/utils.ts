import { ethers, getEthersProvider } from "forta-agent";
import { Contract } from "ethers";
import LRU from "lru-cache";
import { providers } from "ethers";
import { daiAbi } from "./abis/dai";

export const OPTIMISM_L1_ESCROW = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
export const ARBITRUM_L1_ESCROW = "0xA10c7CE4b876998858b1a9E12b10092229539400";
export const TRANSFER_EVENT = "event Transfer(address indexed src, address indexed dst, uint wad)";
export const L1_DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const L2_DAI_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

class BridgeInfo {
  readonly daiAddress: string;
  readonly daiContract: Contract;
  readonly provider: providers.Provider;
  static balanceCache: LRU<string, number> = new LRU<string, number>({ max: 100 });
  static supplyCache: LRU<string, number> = new LRU<string, number>({ max: 100 });

  constructor(daiAddress: string, provider: providers.Provider) {
    this.provider = provider;
    this.daiContract = new ethers.Contract(daiAddress, daiAbi, this.provider);
    this.daiAddress = daiAddress;
  }

  async balanceOf(address: string) {
    // Meant to be used with L1 to fetch balance of DAI Escrows

    // Check if balance is present in Cache
    const blockNumber = await this.provider.getBlockNumber();
    if (BridgeInfo.balanceCache.has(address.concat(blockNumber.toString()))) {
      return BridgeInfo.balanceCache.get(address.concat(blockNumber.toString())) as number;
    }

    // Balance not present in Cachce, adding new balance to Cache
    let balance: number;

    try {
      balance = await this.daiContract.balanceOf(address);
    } catch {
      throw new Error("Invalid Dai Contract");
    }

    BridgeInfo.balanceCache.set(address.concat(blockNumber.toString()), balance);
    return balance;
  }

  async totalSupply() {
    // Meant to be used with L2 for fetching total Dai balance

    const blockNumber = await this.provider.getBlockNumber();
    const key = JSON.stringify(this.provider).concat(blockNumber.toString());

    // Check if totalSupply present in supplyCache
    if (BridgeInfo.supplyCache.has(key)) return BridgeInfo.supplyCache.get(key) as number;

    // Value not present for key, adding
    let totalSupply: number;

    try {
      totalSupply = await this.daiContract.totalSupply();
    } catch {
      throw new Error("Invalid Dai Contract");
    }

    BridgeInfo.supplyCache.set(key, totalSupply);
    return totalSupply;
  }
}

export async function getDaiBalance(escrowAddress: string) {
  const contract = new BridgeInfo(L1_DAI_ADDRESS, getEthersProvider());
  const balance = await contract.balanceOf(escrowAddress);
  return balance;
}

export async function getL2TotalSupply(provider: providers.Provider) {
  const contract = new BridgeInfo(L2_DAI_ADDRESS, provider);
  const totalSupply = await contract.totalSupply();

  return totalSupply;
}
