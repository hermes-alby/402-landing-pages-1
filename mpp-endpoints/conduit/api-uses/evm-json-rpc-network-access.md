# Conduit: EVM JSON-RPC Network Access API Uses

## What This Endpoint Group Does

This endpoint group gives paid MPP access to standard EVM JSON-RPC calls on Conduit-hosted networks. The caller selects a network in the path, such as `tempo`, `plume-mainnet-1`, `katana`, or `zora-mainnet-0`, and sends a JSON-RPC body with `jsonrpc`, `id`, `method`, and method-specific `params`.

The practical value is direct onchain state access without running a node or creating a direct Conduit account. It can answer questions about current block height, chain identity, balances, contract reads, logs, receipts, blocks, gas estimates, bytecode, storage, transaction nonces, and traces where the selected network supports them. It can also broadcast signed transactions, but that is a state-changing action that requires explicit user approval and was not performed during this research.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/:network/` | Forward EVM JSON-RPC 2.0 requests to a selected Conduit network. | `network`, `jsonrpc`, `id`, `method`, `params`, `address`, `blockTag`, `transaction`, `filter`, `transactionHash`, `signedTransaction` | method-specific `result`, chain id, block number, balance, ABI return data, logs, receipts, block objects, transaction hashes, JSON-RPC `error`, payment challenge/receipt headers |

## Field Notes

### Inputs

The path input is the Conduit network id. Gateway discovery lists concrete routes including Tempo, Tempo Moderato, Plume, Katana, Zora, Mode, BOB, Aevo, Ancient8, and other networks. The local normalized MPP endpoint uses the template `/:network/`, while the gateway OpenAPI snapshot lists concrete `POST /<network>/` paths.

The body follows JSON-RPC 2.0. The fields are `jsonrpc`, `id`, `method`, and optional or method-specific `params`. Common read methods use positional params: `eth_getBalance` takes an address and optional block tag; `eth_call` takes a transaction call object with fields such as `to`, `from`, `data`, `value`, and `gas`; `eth_getLogs` takes a filter object with `fromBlock`, `toBlock`, `address`, `topics`, and `blockHash`; receipt and transaction lookup methods take a transaction hash.

### Outputs

Successful JSON-RPC responses echo `jsonrpc` and `id` and return a method-specific `result`. Simple status methods return hex strings such as block numbers or chain ids. Balance and gas methods return hex quantities. Contract reads return ABI-encoded hex data. Log queries return arrays with `address`, `topics`, `data`, `blockNumber`, `transactionHash`, `transactionIndex`, `blockHash`, `logIndex`, and `removed`. Receipt queries return transaction status, gas, addresses, block number, logs, and contract creation address where applicable. Block queries return block hash, parent hash, timestamp, gas fields, base fee, miner, and transaction hashes or objects.

JSON-RPC errors may be returned with HTTP 200 and an `error` object containing at least `code` and `message`. MPP payment failures can surface as `402 Payment Required` with a `WWW-Authenticate` challenge. Unknown network paths can return 404.

### Important Constraints Or Gaps

The MPP OpenAPI snapshot does not define detailed request or response schemas; the field list is docs-derived from Conduit's MPP JSON-RPC reference and direct RPC Nodes documentation. The endpoint can forward transaction-broadcast methods such as `eth_sendRawTransaction`, but broadcasting a signed transaction mutates blockchain state and must be handled as an explicit user-approved workflow. Supported networks and per-network method availability can drift. The researched artifacts do not document MPP-specific rate limits, WebSocket support, or whether debug/trace methods are uniformly enabled across networks.

## Use Cases

### Wallet And Treasury Balance Checks Across Conduit Networks

A person can check whether a wallet has native token balance on Tempo, Zora, Plume, Katana, or another Conduit network before deciding whether to bridge, transact, or troubleshoot a failed app flow. A business treasury or operations team can use the same `eth_getBalance`, `eth_chainId`, and `eth_blockNumber` fields to verify that monitored wallets hold enough native gas token on each network and that the RPC target is the expected chain.

The useful fields are the `network` path id, wallet `address`, `blockTag`, and the hex `result` balance. The output supports actions such as topping up gas, pausing a transaction batch, alerting an operator, or reconciling balances before settlement. The limitation is that `eth_getBalance` only returns native token balance; ERC-20 balances require `eth_call` with the token contract's ABI-encoded `balanceOf` call and separate token metadata.

### Contract Read Automation For Apps And Agents

A developer or personal agent can use `eth_call` to read contract state without sending a transaction, for example token balances, allowance, pool state, NFT ownership, bridge contract status, or protocol configuration. A business can wire these reads into product features, support tooling, risk checks, or backend automations across multiple Conduit networks without operating RPC infrastructure.

The important inputs are `transaction.to`, `transaction.data`, optional `transaction.from`, and a freshness choice through `blockTag`. The result is ABI-encoded return data, so the caller must know the contract ABI and decode the result correctly. The endpoint is valuable because it can turn a one-off question about onchain state into a deterministic read, but it does not by itself supply ABI discovery, token metadata, or semantic interpretation.

### Transaction Receipt And User Support Triage

A person can paste a transaction hash and ask whether a transfer, mint, bridge, or contract interaction succeeded. A business support team can use `eth_getTransactionReceipt` and `eth_getTransactionByHash` to triage customer tickets: confirm the transaction was mined, inspect `status`, identify the sender and recipient, read `gasUsed` and `effectiveGasPrice`, and review emitted `logs`.

The fields that matter are `transactionHash`, receipt `status`, `blockNumber`, `from`, `to`, `gasUsed`, `effectiveGasPrice`, `contractAddress`, and `logs`. These outputs help decide whether to tell the user to wait, retry, contact the app team, or inspect a specific contract event. Receipts are not complete business-level explanations; event logs still require ABI/topic decoding, and a successful transaction can still produce an application outcome the user did not expect.

### Event Log Monitoring For Protocol Activity

A personal automation can watch a specific contract for transfer, mint, claim, or marketplace events. A business can run lightweight monitoring for deposits, withdrawals, bridge events, governance actions, NFT mints, or protocol errors by issuing `eth_getLogs` over narrow block ranges on a selected network.

The core fields are `fromBlock`, `toBlock`, `address`, `topics`, and returned log fields such as `transactionHash`, `blockNumber`, `data`, `topics`, and `removed`. These outputs enable alerts, downstream indexing, reconciliation, and anomaly review. The main constraints are block-range cost, potential reorgs signaled by `removed`, and the need to decode topics and data using the relevant event ABI.

### Chain Health And RPC Freshness Checks

A developer, ecosystem operator, or reliability team can call `eth_blockNumber`, `eth_chainId`, `net_version`, `web3_clientVersion`, and `eth_syncing` to verify that the target route is alive, on the expected network, and advancing. A personal user can use the same calls before relying on a less familiar network route in a wallet or script.

The useful fields are the selected `network`, the returned chain id, latest block number, syncing status, and client version. These outputs support decisions such as failing over to another RPC route, delaying a deployment, or flagging stale infrastructure. The endpoint does not publish an uptime SLA through the MPP surface, so production monitoring should combine these checks with Conduit's direct monitoring features or another observability source.

### Gas, Fee, And Nonce Preparation Before User-Approved Transactions

Before sending a user-approved signed transaction, an app or agent can read `eth_gasPrice`, `eth_feeHistory`, `eth_maxPriorityFeePerGas`, `eth_estimateGas`, and `eth_getTransactionCount`. A business transaction service can use these fields to prepare safer transaction parameters and detect nonce conflicts before asking a user or signer to authorize a transaction.

The relevant inputs are the transaction call object, sender address, and block context. Outputs include gas estimates, base fee history, priority fee suggestions, and nonce. This is valuable because it can reduce failed transactions and stuck nonce queues. It still does not authorize transaction broadcast; signing and `eth_sendRawTransaction` are separate, state-changing actions that need explicit approval and policy controls.

### Debugging And Trace-Based Incident Analysis

A developer investigating a failed or unexpectedly expensive transaction can use documented debug and trace methods such as `debug_traceTransaction`, `debug_traceCall`, `trace_transaction`, or `trace_replayTransaction` where the selected Conduit network supports them. A business protocol team can use traces during incident review to understand call paths, reverts, gas hotspots, or state changes that are not obvious from a receipt alone.

The useful inputs are transaction hashes, call objects, block identifiers, and trace method names. The output shape is method-specific and can be large, so downstream tools need trace parsers and storage decisions. Conduit publishes higher direct CU costs for trace and replay methods, and the MPP artifacts do not prove whether every network enables every trace method, so this use case should be treated as an advanced diagnostic workflow rather than a guaranteed baseline.

### Transaction Broadcast For Controlled Automation

The endpoint can forward `eth_sendRawTransaction` with a `signedTransaction` hex payload and return a transaction hash. A personal wallet workflow could broadcast a transaction after the user signs it elsewhere. A business automation system could submit pre-signed transactions from a controlled signer pipeline.

This use case is powerful but materially different from read-only RPC. The input is already a signed transaction, and broadcasting it can move funds, call contracts, create positions, or trigger irreversible onchain effects. It requires explicit user approval, chain-id validation, nonce and gas checks, and post-broadcast receipt monitoring. No transaction-broadcast calls were made during this research.
