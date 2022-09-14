# MakerDAO bridge invariant bot

## Description

This bot monitors a MakerDAO DAI bridge invariant, and emits alerts for transactions on the bridge

## Supported Chains

- Ethereum
- L2 (Optimism and Arbitrum)

## Alerts

- OPTSM-WTHDRW-1

  - This alert is thrown when DAI is withdrawn from Optimism over the DAI bridge
  - Severity is set to "Info"
  - Type is set to "Info"
  - contains the following metadata:
    - src: Source of transfer (L1 Escrow Optimism)
    - dst: Destination of transfer
    - amt: Amount of transfer

- OPTSM-DPST-1

  - This alert is thrown when DAI is deposited to Optimism over the DAI bridge
  - Severity is set to "Info"
  - Type is set to "Info"
  - contains the following metadata:
    - src: Source of transfer
    - dst: Destination of transfer (L1 Escrow Optimism)
    - amt: Amount of transfer

- ARBTM-WTHDRW-1

  - This alert is thrown when DAI is withdrawn from Arbitrum over the DAI bridge
  - Severity is set to "Info"
  - Type is set to "Info"
  - contains the following metadata:
    - src: Source of transfer (L1 Escrow Arbitrum)
    - dst: Destination of transfer
    - amt: Amount of transfer

- ARBTM-DPST-1

  - This alert is thrown when DAI is deposited to Arbitrum over the DAI bridge
  - Severity is set to "Info"
  - Type is set to "Info"
  - contains the following metadata:
    - src: Source of transfer
    - dst: Destination of transfer (L1 Escrow Arbitrum)
    - amt: Amount of transfer

- OPTSM-INVRNT-1

  - This alert is thrown when the DAI bridge invariant is violated on Optimism
  - Severity is set to "Critical"
  - Type is set to "Exploit"
  - contains the following metadata:
    - opL1DaiCount: Balance of DAI on L1 Escrow
    - opL2DaiSupply: Total supply of DAI on L2

- ARBTM-INVRNT-1

  - This alert is thrown when the DAI bridge invariant is violated on Arbitrum
  - Severity is set to "Critical"
  - Type is set to "Exploit"
  - contains the following metadata:
    - opL1DaiCount: Balance of DAI on L1 Escrow
    - opL2DaiSupply: Total supply of DAI on L2

## Test Data

Optimism DAI transfer:

- [0xb6a97d56226eb6b17981645b103f68a029738eede0d8eae0fc3788f406b0af34](https://etherscan.io/tx/0xb6a97d56226eb6b17981645b103f68a029738eede0d8eae0fc3788f406b0af34)

Arbitrum DAI transfer:

- [0xfd9459c41532644679b146e2b3e2f27fa69cf51845e68bed95e8da8fa23e5678](https://etherscan.io/tx/0xfd9459c41532644679b146e2b3e2f27fa69cf51845e68bed95e8da8fa23e5678)
