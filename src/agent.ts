import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent } from "forta-agent";
import { providers } from "ethers";
import {
  L1_DAI_ADDRESS,
  TRANSFER_EVENT,
  ARBITRUM_L1_ESCROW,
  getDaiBalance,
  getL2TotalSupply,
  OPTIMISM_L1_ESCROW,
} from "./utils";

const arbitrumProvider = new providers.JsonRpcProvider("https://rpc.ankr.com/arbitrum");
const optimismProvider = new providers.JsonRpcProvider("https://rpc.ankr.com/optimism");

function provideHandleTransaction(
  transferEvent: string,
  optimismL1Escrow: string,
  arbitrumL1Escrow: string,
  daiAddress: string
): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    // Filter transactions for L1 Escrow's approve events
    const bridgeEventTransactions = txEvent.filterLog(transferEvent, daiAddress);

    for (const transferEvent of bridgeEventTransactions) {
      // Check if captured transfer involves either L1Escrows
      const { src, dst, wad } = transferEvent.args;

      if (src === optimismL1Escrow) {
        // Dai withdrawn from Optimism
        findings.push(
          Finding.fromObject({
            name: "Dai withdrawn from Optimism",
            description: "Dai bridge used to transfer Dai from Optimism to L1",
            alertId: "OPTSM-WTHDRW-1",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            metadata: {
              src: src,
              dst: dst,
              amt: wad,
            },
          })
        );

        const opL1DaiCount = await getDaiBalance(optimismL1Escrow);
        const opL2DaiSupply = await getL2TotalSupply(optimismProvider);

        if (opL1DaiCount < opL2DaiSupply) {
          findings.push(
            Finding.fromObject({
              name: "Optimism Dai bridge invariant violated",
              description: "Optimism L2 Dai supply exceeds L1 Escrow balance",
              alertId: "OPTSM-INVRNT-1",
              severity: FindingSeverity.Critical,
              type: FindingType.Exploit,
              metadata: {
                opL1DaiCount: opL1DaiCount.toString(),
                opL2DaiSupply: opL2DaiSupply.toString(),
              },
            })
          );
        }
      } else if (src === arbitrumL1Escrow) {
        // Dai withdrawn from Arbitrum
        findings.push(
          Finding.fromObject({
            name: "Dai withdrawn from Arbitrum",
            description: "Dai bridge used to transfer Dai from Arbitrum to L1",
            alertId: "ARBTM-WTHDRW-1",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            metadata: {
              src: src,
              dst: dst,
              amt: wad,
            },
          })
        );

        const arL1DaiCount = await getDaiBalance(arbitrumL1Escrow);
        const arL2DaiSupply = await getL2TotalSupply(arbitrumProvider);

        if (arL1DaiCount < arL2DaiSupply) {
          findings.push(
            Finding.fromObject({
              name: "Arbitrum Dai bridge invariant violated",
              description: "Arbitrum L2 Dai supply exceeds L1 Escrow balance",
              alertId: "ARBTM-INVRNT-1",
              severity: FindingSeverity.Critical,
              type: FindingType.Exploit,
              metadata: {
                opL1DaiCount: arL1DaiCount.toString(),
                opL2DaiSupply: arL2DaiSupply.toString(),
              },
            })
          );
        }
      } else if (dst === optimismL1Escrow) {
        // Dai deposited to Optimism
        findings.push(
          Finding.fromObject({
            name: "Dai deposited to Optimism",
            description: "Dai bridge used to transfer Dai from L1 to Optimism",
            alertId: "OPTSM-DPST-1",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            metadata: {
              src: src,
              dst: dst,
              amt: wad,
            },
          })
        );

        const opL1DaiCount = await getDaiBalance(optimismL1Escrow);
        const opL2DaiSupply = await getL2TotalSupply(optimismProvider);

        if (opL1DaiCount < opL2DaiSupply) {
          findings.push(
            Finding.fromObject({
              name: "Optimism Dai bridge invariant violated",
              description: "Optimism L2 Dai supply exceeds L1 Escrow balance",
              alertId: "OPTSM-INVRNT-1",
              severity: FindingSeverity.Critical,
              type: FindingType.Exploit,
              metadata: {
                opL1DaiCount: opL1DaiCount.toString(),
                opL2DaiSupply: opL2DaiSupply.toString(),
              },
            })
          );
        }
      } else if (dst == arbitrumL1Escrow) {
        // Dai deposited to Arbitrum
        findings.push(
          Finding.fromObject({
            name: "Dai deposited to Arbitrum",
            description: "Dai bridge used to transfer Dai from L1 to Arbitrum",
            alertId: "ARBTM-DPST-1",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            metadata: {
              src: src,
              dst: dst,
              amt: wad,
            },
          })
        );

        const arL1DaiCount = await getDaiBalance(arbitrumL1Escrow);
        const arL2DaiSupply = await getL2TotalSupply(arbitrumProvider);

        if (arL1DaiCount < arL2DaiSupply) {
          findings.push(
            Finding.fromObject({
              name: "Arbitrum Dai bridge invariant violated",
              description: "Arbitrum L2 Dai supply exceeds L1 Escrow balance",
              alertId: "ARBTM-INVRNT-1",
              severity: FindingSeverity.Critical,
              type: FindingType.Exploit,
              metadata: {
                opL1DaiCount: arL1DaiCount.toString(),
                opL2DaiSupply: arL2DaiSupply.toString(),
              },
            })
          );
        }
      } else {
        continue;
      }
    }

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(TRANSFER_EVENT, OPTIMISM_L1_ESCROW, ARBITRUM_L1_ESCROW, L1_DAI_ADDRESS),
};
