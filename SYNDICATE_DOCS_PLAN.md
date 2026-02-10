# Syndicate Integration Documentation Plan

## Overview
This document outlines the plan for creating comprehensive integration documentation for the Syndicate system in LayerCover.

**Target File:** `packages/docs-site/content/v2/en/technical-reference/syndicate-system.mdx`
**Target URL:** `/technical-reference/syndicate-system`

## Goals
1.  Provide a clear architectural overview of the Syndicate system.
2.  Document the core smart contracts and their interactions.
3.  Guide developers on how to integrate with Syndicates (Deposit, Withdraw, Allocate).
4.  Explain advanced features like Intents, Locks, and Salvage.

## Proposed Structure

### 1. Introduction
-   **What is a Syndicate?**
    -   Definition: Specialized ERC4626 vault for underwriting.
    -   Role in LayerCover: Capital aggregation, risk delegation, yield optimization.
-   **Key Features:**
    -   Managed capital allocation.
    -   Performance fees & High-Water Mark.
    -   Withdrawal queues & locking.
    -   Intent-based reservations.

### 2. Architecture
-   **Diagram:** Visualizing the relationship between `Syndicate`, `SyndicateFactory`, `UnderwriterManager`, `CapitalPool`, and `Strategies`.
-   **Core Components:**
    -   **Vault (Syndicate.sol):** Main entry point for LPs.
    -   **Strategy (SyndicateStrategy):** Logic delegate for complex operations.
    -   **Managers:** RoleManager, ReservationManager, DurationManager.

### 3. Core Concepts & Lifecycle

#### 3.1 Capital Allocation
-   **Auto-Allocation:** How deposits are automatically routed to pools.
-   **Manual Allocation:** Curator controls for rebalancing.
-   **Passthrough to PAM:** Interaction with `PoolAllocationManager`.

#### 3.2 Yield & Fees
-   **Sources of Yield:** Premium payments + Underlying asset yield (e.g., Aave).
-   **Performance Fees:**
    -   Calculation (HWM).
    -   Distribution to Curator/Guardian.
-   **Yield Boosting:** Multipliers for long-term stakers.

#### 3.3 Duration Management (Locks)
-   **Deposit Locks:** `depositWithLock` mechanics.
-   **Withdrawal Delays:** Request -> Queue -> Finalize flow.
-   **Lock Multipliers:** Incentives for locking capital.

#### 3.4 Intents & Reservations
-   **Concept:** Off-chain matching for instant liquidity or specific coverage.
-   **Flow:** Sign Intent -> Matcher submits -> Capital Reserved.
-   **Integration:** `reserveIntent`, `consumeReservation`.

### 4. Integration Guide

#### 4.1 For Liquidity Providers (LPs)
-   **Depositing:**
    -   Standard `deposit()` / `mint()`.
    -   `depositWithLock()` for boosted yield.
-   **Withdrawing:**
    -   `depositWithWithdrawalIntent()` (Atomic request).
    -   `requestWithdrawal()` -> Wait -> `executeWithdrawal()`.
-   **Reading State:**
    -   `balanceOf()`, `totalAssets()`.
    -   `pendingYield()`.
    -   `activeLockedSharesOf()`.

#### 4.2 For Curators (Managers)
-   **Managing Roles:** `setRoleManager`, `setAllocator`.
-   **Allocating Capital:** `allocateToPools`, `depositAndAllocate`.
-   **Harvesting:** `harvestYield`, `claimYield`.
-   **Configuration:** `setFeeModel`, `configureYieldBoost`.

### 5. Smart Contract Reference
*Detailed API documentation for key contracts.*

-   **Syndicate.sol**
    -   `initialize`
    -   `deposit` / `withdraw` overrides
    -   `depositWithLock`
    -   `allocateToPools`
-   **SyndicateFactory.sol**
    -   `createSyndicate`
-   **ISyndicateStrategy**
    -   Key logic delegates.

### 6. Events & Errors
-   **Key Events:** `Deposit`, `Withdrawn`, `Allocated`, `YieldHarvested`.
-   **Common Errors:** `DepositCapExceeded`, `MinWithdrawalDelayNotMet`.

## Implementation Steps
1.  **Create Directory:** `packages/docs-site/content/v2/en/technical-reference` (if not exists).
2.  **Draft Content:** Write `syndicate-system.mdx` following the structure above.
3.  **Code Snippets:** Extract relevant code snippets from `Syndicate.sol` and tests.
4.  **Review:** Verify against current contract implementation.
