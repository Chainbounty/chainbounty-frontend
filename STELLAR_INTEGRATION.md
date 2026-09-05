# Stellar SDK Integration

This document explains how ChainBounty integrates with Stellar blockchain and Freighter wallet.

## Architecture

### Components

1. **Freighter Wallet** (`@stellar/freighter-api`)
   - User authentication
   - Transaction signing
   - Network selection

2. **Stellar SDK** (`@stellar/stellar-sdk`)
   - Transaction building
   - Horizon API communication
   - Soroban contract invocation (future)

3. **Soroban Smart Contract** (deployed separately)
   - Escrow management
   - Bounty state machine
   - Dispute resolution

## Transaction Flow

### 1. Post Bounty
```typescript
// User posts a bounty with 500 USDC reward
const result = await postBountyOnChain({
  sourceAddress: userAddress,
  bountyId: 'bounty-123',
  reward: 500,
  token: 'USDC',
  issueUrl: 'https://github.com/org/repo/issues/42'
})
```

**On-chain actions:**
- Transfer reward tokens from poster to escrow contract
- Store bounty metadata (issue URL, milestones)
- Emit `BountyPosted` event

### 2. Claim Bounty
```typescript
const result = await claimBountyOnChain({
  sourceAddress: contributorAddress,
  bountyId: 'bounty-123'
})
```

**On-chain actions:**
- Lock bounty to claimer address
- Update bounty status to `claimed`
- Emit `BountyClaimed` event

### 3. Submit Work
```typescript
const result = await submitWorkOnChain({
  sourceAddress: contributorAddress,
  bountyId: 'bounty-123',
  prUrl: 'https://github.com/org/repo/pull/123',
  ipfsCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
})
```

**On-chain actions:**
- Store submission metadata (PR URL, IPFS CID)
- Update bounty status to `in_review`
- Emit `WorkSubmitted` event

### 4. Approve / Reject
```typescript
// Approve
const result = await approveWorkOnChain({
  sourceAddress: posterAddress,
  bountyId: 'bounty-123',
  feedback: 'Great work!'
})

// Reject
const result = await rejectWorkOnChain({
  sourceAddress: posterAddress,
  bountyId: 'bounty-123',
  feedback: 'Needs changes: ...'
})
```

**On-chain actions (approve):**
- Release escrowed funds to claimer
- Update bounty status to `completed`
- Emit `BountyCompleted` event

**On-chain actions (reject):**
- Update bounty status back to `claimed`
- Emit `WorkRejected` event

### 5. Raise Dispute
```typescript
const result = await raiseDisputeOnChain({
  sourceAddress: claimerAddress,
  bountyId: 'bounty-123',
  reason: 'Work meets requirements but poster is unresponsive',
  evidenceCid: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX'
})
```

**On-chain actions:**
- Create dispute record
- Lock escrow for community arbitration
- Emit `DisputeRaised` event

## Configuration

### Network Settings

```typescript
// src/lib/stellar.ts
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const BOUNTY_CONTRACT_ID = 'CBOUNTY...' // Replace with deployed contract
```

### Environment Variables

Create `.env.local`:
```bash
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_BOUNTY_CONTRACT_ID=CBOUNTY1234567890...
```

## Development Workflow

### 1. Local Testing (Current State)
All transaction functions use **simulation mode** with mock transaction hashes. This allows full UI/UX testing without deploying contracts.

### 2. Testnet Integration
1. Deploy Soroban bounty contract to Stellar testnet
2. Update `BOUNTY_CONTRACT_ID` in `src/lib/stellar.ts`
3. Uncomment real transaction code in modal components
4. Test with testnet XLM from friendbot

### 3. Mainnet Deployment
1. Deploy contract to mainnet
2. Update `NETWORK_PASSPHRASE` to `StellarSdk.Networks.PUBLIC`
3. Update `HORIZON_URL` to `https://horizon.stellar.org`
4. Thorough security audit before launch

## Error Handling

All transaction functions return:
```typescript
{
  txHash: string      // Transaction hash (empty on failure)
  success: boolean    // Whether transaction succeeded
  error?: string      // Human-readable error message
}
```

Use `parseStellarError()` helper to convert SDK errors into user-friendly messages.

## Soroban Contract Interface (Planned)

```rust
pub trait BountyContract {
    fn post_bounty(bounty_id: String, reward: i128, token: Address, issue_url: String);
    fn claim_bounty(bounty_id: String);
    fn submit_work(bounty_id: String, pr_url: String, ipfs_cid: String);
    fn approve(bounty_id: String, feedback: String);
    fn reject(bounty_id: String, feedback: String);
    fn dispute(bounty_id: String, reason: String, evidence_cid: String);
    fn resolve_dispute(bounty_id: String, decision: DisputeDecision);
}
```

## Resources

- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet Docs](https://docs.freighter.app/)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Horizon API Reference](https://developers.stellar.org/api/horizon)
