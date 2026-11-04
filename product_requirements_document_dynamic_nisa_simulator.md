# Product Requirements Document (PRD)

## Dynamic NISA Simulator (New NISA Scenario Planner)

| **Document Version** | 1.0.0 | 
| ----- | ----- | 
| **Status** | Approved / Ready for Engineering | 
| **Owner** | Senior Technical Product Manager | 
| **Target Launch** | Q1 2027 | 
| **Target Platform** | Client-Side SPA (Static Hosting via Cloudflare Pages) | 

## 1. Document History & Executive Summary

### 1.1 Revision History

| Version | Date | Author | Description of Changes | 
| ----- | ----- | ----- | ----- | 
| `v0.1.0` | 2026-10-15 | Lead Technical PM | Initial Draft & Mathematical Ledger Model | 
| `v0.8.0` | 2026-10-24 | Lead Technical PM | Added State Serialization Specs & Quota Recapture Specs | 
| `v1.0.0` | 2026-11-04 | Lead Technical PM | Finalized Mobile UI specs, Compliance & Affiliate IA | 

### 1.2 Executive Summary

Japan's revised tax-free investment program (新NISA / New NISA, enacted January 2024) significantly increased lifetime and annual contribution ceilings, permitted indefinite tax-free holding periods, and introduced **book-value quota restoration (簿価復活)** upon asset liquidation. However, retail investors face complex planning bottlenecks:

1. Simulating mid-journey capital withdrawals (e.g., home down payments, tuition) and tracking when and how the liquidated book-value space becomes re-usable.

2. Managing the concurrent limits of the **Tsumitate Quota (つみたて投資枠)** and **Growth Quota (成長投資枠)** alongside aggregate caps.

3. Overcoming language and UI hurdles: Domestic Japanese broker calculators are fragmented, mobile-unfriendly, and lack English localization, while Western FIRE tools do not account for Japanese tax and quota rules.

**Dynamic NISA Simulator** is a deterministic, zero-backend, client-side web utility targeting technical domestic retail investors and the international English-speaking community in Japan (e.g., `r/JapanFinance`). The application persists full planning scenarios via compressed URL hash fragments (`#state=...`), ensuring zero data retention risk, instantaneous performance, and frictionless link sharing. Monetization is handled through high-trust, contextual editorial affiliate disclosures and reference guides, maintaining a self-sustaining indie profile (target: ¥500–¥5,000/month).

## 2. User Personas & Core Use Cases

### 2.1 User Personas

#### Persona A: "Tokyo Tech Expat" (Marcus, 33)

* **Profile:** Software engineer living in Minato-ku on a Highly Skilled Professional visa.

* **Financial literacy:** High. Invests in eMAXIS Slim All-Country via SBI or Rakuten Securities.

* **Pain Point:** Wants to purchase a condominium in Tokyo in 7 years. Needs to know: *"If I liquidate ¥6,000,000 of market value from my Growth Quota to pay the 20% down payment, how much book value is refunded on January 1st of Year 8, and how many years will it take to top up my aggregate ¥18M lifetime cap given the ¥3.6M annual limit?"*

* **Primary Platform:** Desktop Chrome and Mobile Safari (via Reddit/r/JapanFinance links).

#### Persona B: "Pragmatic Domestic Planner" (Yuki, 28)

* **Profile:** Corporate employee in Tokyo; dual-language speaker (JA/EN).

* **Financial literacy:** Intermediate. Maxing out ¥100,000/month in Tsumitate via credit card payments (`tsumitate tate`).

* **Pain Point:** Wants to visualize whether to split spare bonus cash into the Growth Quota or keep cash reserves, and needs a responsive tool to review on the train during commutes.

* **Primary Platform:** Mobile iOS (Safari).

### 2.2 Core Use Cases

```
┌─────────────────────────────────────────────────────────────┐
│                       User Journey                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │ 1. Configure Initial Parameters      │
            │    (Age, Current Holdings, Cashflow)│
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │ 2. Set Up Routine Allocations       │
            │    (Tsumitate vs. Growth Monthly)   │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │ 3. Schedule Milestone Liquidations  │
            │    (e.g., Year 7 Down Payment)      │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │ 4. Run Deterministic Ledger Engine  │
            │    - Book vs. Market Calculation    │
            │    - Quota Recovery at Jan 1 (Y+1)  │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │ 5. Review & Share                   │
            │    - Milestone Drawer / Impact Card │
            │    - Copy URL with LZ-String Hash   │
            └─────────────────────────────────────┘

```

1. **Deterministic Multi-Decade Wealth Projections:** Projecting portfolio trajectory up to 40 years with user-specified expected annualized return ($r$) and compound frequency (monthly).

2. **Quota Reconstitution Visualization:** Modeling capital extraction at Year $T$, calculating the realized book value vs. capital gains, and tracking the annual reinjection of the freed quota under the ¥3.6M annual cap from Year $T+1$ onward.

3. **Scenario Forking & Sharing:** Exporting a plan directly via a URL hash to ask for advice on discussion forums without leaking PII or relying on user logins.

## 3. Technical Architecture & Constraints

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           Client-Side Browser                             │
│                                                                           │
│   ┌─────────────────┐       ┌─────────────────┐    ┌──────────────────┐   │
│   │  React 19 / TS  │ ────> │  Zustand Store  │ <─ │   LZ-String      │   │
│   │  UI Components  │       │ (State Manager) │    │ De/Serialization │   │
│   └────────┬────────┘       └────────┬────────┘    └────────▲─────────┘   │
│            │                         │                      │             │
│            │                         ▼                      │             │
│            │             ┌───────────────────────┐          │             │
│            └───────────> │  NISA Ledger Engine   │          │             │
│                          │  (Deterministic Math) │          │             │
│                          └───────────┬───────────┘          │             │
│                                      │                      │             │
│                                      ▼                      │             │
│                          ┌───────────────────────┐          │             │
│                          │  Timeline Projection  │          │             │
│                          │  Dataset Generator    │          │             │
│                          └───────────┬───────────┘          │             │
│                                      │                      │             │
│                                      ▼                      │             │
│                          ┌───────────────────────┐          │             │
│                          │   Window URL Hash     │ ─────────┘             │
│                          │   (#state=v1...)      │                        │
│                          └───────────────────────┘                        │
└───────────────────────────────────────────────────────────────────────────┘
                                       ▲
                                       │ HTTP GET (Static Assets Only)
                                       │
                         ┌───────────────────────────┐
                         │   Cloudflare Pages Edge   │
                         │   (Zero Compute / DB)     │
                         └───────────────────────────┘

```

### 3.1 Architecture Overview

* **Deployment & Hosting:** Cloudflare Pages (Static JAMstack).

* **Core Framework:** React 19 + TypeScript (Strict Mode).

* **State Management:** Zustand with middleware synchronization to `window.location.hash`.

* **CSS / Styling:** Tailwind CSS + Radix UI primitives (unstyled, accessible).

* **Chart Visualizations:** Lightweight SVG-based chart library (e.g., Visx or custom optimized SVG path renderer) to minimize bundle overhead (target: total JS `< 100 KB` gzipped).

* **Zero-Backend Constraint:** Strictly no databases (NoSQL, SQL), no serverless functions executing state transformations, and no user tracking/analytics telemetry capturing financial inputs.

### 3.2 State Serialization Specification

To enable URL sharing without backend storage, all simulator inputs must be serialized into a compact payload, compressed, and encoded into the URL fragment.

#### 3.2.1 Data Schema Definition (TypeScript)

```
export interface MilestoneWithdrawal {
  id: string;
  yearIndex: number; // 1 to 40
  targetBucket: 'growth' | 'tsumitate' | 'proportional';
  amount: number; // Raw JPY amount to liquidate
  label: string;
}

export interface NisaPlanStateV1 {
  v: 1; // Schema version flag
  age: number; // Current age (e.g., 30)
  horizonYears: number; // Duration (e.g., 30)
  expectedReturnRate: number; // e.g., 0.05 for 5%
  tsumitateMonthly: number; // Monthly contribution (JPY)
  growthMonthly: number; // Monthly contribution (JPY)
  growthAnnualLumpSum: number; // One-off annual contribution (JPY)
  initialHoldings: {
    tsumitateBook: number;
    tsumitateMarket: number;
    growthBook: number;
    growthMarket: number;
  };
  withdrawals: MilestoneWithdrawal[];
}

```

#### 3.2.2 Compression & URL Hash Lifecycle

1. **Serialization:** State object $\rightarrow$ Minified JSON string (keys minified using a predefined token map if payload exceeds length thresholds) $\rightarrow$ `LZ-String.compressToEncodedURIComponent(jsonStr)`.

2. **URL Construction:** `https://nisa-simulator.pages.dev/#v=1&data=${compressedString}`

3. **Deserialization Pipeline:**

   * On `DOMContentLoaded` or `hashchange` event: Extract hash token.

   * Run `LZ-String.decompressFromEncodedURIComponent(data)`.

   * Validate payload against a strict **Zod Schema**.

   * If validation fails or schema version is unsupported: Gracefully fall back to `DEFAULT_STATE` and present a non-blocking toast warning (`"Failed to load shared scenario: configuration corrupted or deprecated"`).

4. **Debounced URL Replacement:** Updating the URL on every slider change causes excessive browser history pollution. State changes must update the browser hash via `window.history.replaceState` debounced at $300\text{ ms}$.

## 4. Detailed Functional Requirements & Ledger Mathematics

### 4.1 Statutory New NISA Constraints & Global Parameters

The calculation engine strictly implements the regulatory framework established by Japan's Financial Services Agency (FSA / 金融庁):

| Parameter | Identifier | Value (JPY) | Statutory Basis | 
| ----- | ----- | ----- | ----- | 
| Annual Aggregate Max | $C_{\text{ann\_agg}}$ | ¥3,600,000 | Article 37-14 of Act on Special Measures Concerning Taxation | 
| Annual Tsumitate Max | $C_{\text{ann\_tsu}}$ | ¥1,200,000 | Statutory Tsumitate limit | 
| Annual Growth Max | $C_{\text{ann\_gro}}$ | ¥2,400,000 | Statutory Growth investment limit | 
| Lifetime Aggregate Max | $C_{\text{life\_agg}}$ | ¥18,000,000 | Aggregate book-value cap | 
| Lifetime Growth Sub-Max | $C_{\text{life\_gro}}$ | ¥12,000,000 | Growth bucket lifetime book-value cap | 

### 4.2 Mathematical Engine Specification

The simulation steps chronologically through months $m = 1, 2, \dots, 12 \times Y$, where year index $y = \lfloor (m - 1) / 12 \rfloor + 1$.

#### 4.2.1 State Variables Tracked per Bucket ($b \in \{\text{tsumitate}, \text{growth}\}$):

* $B_b(m)$: Cumulative Book Value (Acquisition Cost / 簿価) at the end of month $m$.

* $M_b(m)$: Total Market Value (時価) at the end of month $m$.

* $A_b(y)$: Cumulative contributions applied in calendar year $y$.

* $R_b(y)$: Quota restored and available for re-use at the start of calendar year $y$.

#### 4.2.2 Monthly Investment Contribution Logic

Let $I_{\text{target, tsu}}(m)$ and $I_{\text{target, gro}}(m)$ be the user-requested cash injections for month $m$.

##### Step 1: Check Lifetime Remaining Space

The available lifetime book-value space across the portfolio is:

$$
S_{\text{life\_agg}}(m) = C_{\text{life\_agg}} - (B_{\text{tsu}}(m-1) + B_{\text{gro}}(m-1))
$$

The available lifetime space for the growth bucket specifically is:

$$
S_{\text{life\_gro}}(m) = C_{\text{life\_gro}} - B_{\text{gro}}(m-1)
$$

##### Step 2: Check Calendar-Year Remaining Space

Let $m_{\text{start}}$ be the first month of year $y$.
Annual contributions applied so far in year $y$:

$$
A_{\text{agg}}(y, m) = \sum_{k=m_{\text{start}}}^{m-1} \left( \Delta B_{\text{tsu}}(k) + \Delta B_{\text{gro}}(k) \right)
$$

$$
A_{\text{tsu}}(y, m) = \sum_{k=m_{\text{start}}}^{m-1} \Delta B_{\text{tsu}}(k), \quad A_{\text{gro}}(y, m) = \sum_{k=m_{\text{start}}}^{m-1} \Delta B_{\text{gro}}(k)
$$

The annual remaining headroom:

$$
S_{\text{ann\_agg}}(y, m) = C_{\text{ann\_agg}} - A_{\text{agg}}(y, m)
$$

$$
S_{\text{ann\_tsu}}(y, m) = C_{\text{ann\_tsu}} - A_{\text{tsu}}(y, m)
$$

$$
S_{\text{ann\_gro}}(y, m) = C_{\text{ann\_gro}} - A_{\text{gro}}(y, m)
$$

##### Step 3: Clamp Actual Allowed Contribution

For Tsumitate:

$$
\Delta B_{\text{tsu}}(m) = \min \left( I_{\text{target, tsu}}(m), S_{\text{life\_agg}}(m), S_{\text{ann\_tsu}}(y, m), S_{\text{ann\_agg}}(y, m) \right)
$$

For Growth (accounting for any aggregate space consumed by Tsumitate this month):

$$
S'_{\text{ann\_agg}}(y, m) = S_{\text{ann\_agg}}(y, m) - \Delta B_{\text{tsu}}(m)
$$

$$
S'_{\text{life\_agg}}(m) = S_{\text{life\_agg}}(m) - \Delta B_{\text{tsu}}(m)
$$

$$
\Delta B_{\text{gro}}(m) = \min \left( I_{\text{target, gro}}(m), S'_{\text{life\_agg}}(m), S_{\text{life\_gro}}(m), S_{\text{ann\_gro}}(y, m), S'_{\text{ann\_agg}}(y, m) \right)
$$

#### 4.2.3 Market Growth Step

Compounding is calculated at an effective monthly rate derived from annual expected return $r$:

$$
r_{\text{monthly}} = (1 + r)^{1/12} - 1
$$

At month $m$, market growth is applied **after** contributions:

$$
M_b(m) = \left( M_b(m-1) + \Delta B_b(m) \right) \times (1 + r_{\text{monthly}})
$$

$$
B_b(m) = B_b(m-1) + \Delta B_b(m)
$$

#### 4.2.4 Liquidation & Quota Restoration Mechanics (Mid-Journey Withdrawals)

When a user defines a withdrawal of amount $W$ from bucket $b$ at month $m_w$:

```
        Withdrawal Event: Month m_w
     ┌───────────────────────────────┐
     │  User Liquidates Amount: W    │
     └──────────────┬────────────────┘
                    │
                    ▼
     ┌───────────────────────────────┐
     │ Calculate Book Value Consumed:│
     │      W_book = W * (B / M)     │
     └──────────────┬────────────────┘
                    │
                    ▼
     ┌───────────────────────────────┐
     │ Decrement Current Balances:   │
     │      M(m_w) = M - W           │
     │      B(m_w) = B - W_book      │
     └──────────────┬────────────────┘
                    │
                    ▼
     ┌───────────────────────────────┐
     │ January 1, Calendar Year Y+1: │
     │  Quota Restored = W_book      │
     │  (Subject to Annual ¥3.6M Cap)│
     └───────────────────────────────┘

```

##### 1. Proportional Book-Value Consumption

Under statutory accounting, an investor cannot liquidate "gains only" or "principal only". Liquidating a market value $W$ liquidates book value proportionally to the bucket's current average cost ratio:

$$
\rho_b(m_w) = \frac{B_b(m_w)}{M_b(m_w)}
$$

$$
W_{\text{book}, b}(m_w) = \min \left( B_b(m_w), W \times \rho_b(m_w) \right)
$$

The balances immediately after liquidation:

$$
M_b(m_w) \leftarrow M_b(m_w) - W
$$

$$
B_b(m_w) \leftarrow B_b(m_w) - W_{\text{book}, b}(m_w)
$$

##### 2. Quota Reconstitution Timing (Strict Rule)

* **Zero In-Year Restoration:** The liquidated book-value space $W_{\text{book}, b}$ **cannot** be reused during the current calendar year $y$.

* **Next Calendar Year Reinstatement:** On **January 1st of year** $y+1$, the lifetime capacity increases by $W_{\text{book}, b}$.

* **Annual Inflow Clamp:** Even though $W_{\text{book}, b}$ is restored to lifetime capacity, total contributions in year $y+1$ remain strictly clamped to the annual ceilings:
  

  $$
  \text{Max Inflow}(y+1) \le C_{\text{ann\_agg}} = ¥3,600,000
  $$

##### 3. Corner Case: Downward Market Liquidation ($M_b(m_w) \le B_b(m_w)$)

If an asset is sold at a loss ($M < B$), then $\rho_b(m_w) \ge 1.0$. The user can only withdraw up to the current market value $M_b(m_w)$.
If $W = M_b(m_w)$, the entire bucket is closed, and:

$$
W_{\text{book}, b}(m_w) = B_b(m_w)
$$


The book value restored in year $y+1$ equals the full original cost basis $B_b(m_w)$, not the depreciated market value.

## 5. UI/UX & Mobile-First Design Specifications

To avoid common pitfalls of financial tooling—such as wide, unreadable data tables that truncate on mobile viewports—the simulator adheres to a **Vertical-Card Architecture**.

```
┌───────────────────────────────────────────────┐
│ [ EN | JA ]      Dynamic NISA      [ Share ⎘ ]│
├───────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ Portfolio Trajectory (SVG Chart)          │ │
│ │ [¥34,250,000] Market  [¥18,000,000] Book  │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ Lifetime Quota Tracker                    │ │
│ │ [████████████████████] 100% (¥18M / ¥18M) │ │
│ │ Growth: ¥12M/¥12M | Tsumitate: ¥6M/¥6M    │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ Milestone Drawer: Year 7 Withdrawal       │ │
│ │ • Liquidated: ¥5,000,000 (Market)         │ │
│ │ • Book Quota Restored: ¥3,120,000         │ │
│ │ • Re-investment Complete: Year 9          │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ Input Parameters (Collapsible Accordion)  │ │
│ │ - Monthly Tsumitate: [ ¥100,000 ]         │ │
│ │ - Monthly Growth:    [ ¥200,000 ]         │ │
│ │ - Expected Return:   [ 5.0%     ]         │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘

```

### 5.1 Screen Layout & Component Breakdown

#### Component 1: Sticky Snapshot Header

* Displays current scenario totals: **Total Market Value**, **Total Book Value**, and **Tax Saved** (calculated as: $\max(0, \text{Market} - \text{Book}) \times 20.315\%$).

* Contains the instant **"Share Scenario"** button with dynamic copy feedback ("URL Copied!").

#### Component 2: Interactive SVG Trajectory Visualizer

* Pure client-side SVG curve rendering showing:

  * Stacked area for **Tsumitate Book Value** and **Growth Book Value**.

  * Solid top curve for **Aggregate Market Value**.

* Touch scrub interactions (`onTouchMove` / pointer events): Scrubbing across years displays a sticky tool-tip with the year's exact metrics.

#### Component 3: Milestone & Liquidation Drawer

* Rather than a standard horizontal schedule, major lifecycle events are organized into **Vertical Milestone Cards**:

  * **Milestone Addition:** A prominent "+ Add Liquidation / Event" button triggering a bottom sheet (iOS) or modal.

  * **Re-investment Payback Indicator:** Automatically computes and displays:

    > *"Your Year 7 withdrawal frees up ¥3.2M of book space on Jan 1, Year 8. Under your current cash flow, this quota will be fully re-saturated by Year 9."*

#### Component 4: Touch-Friendly Input Cards

* Stepper controls (`-` / `+`) paired with native range sliders.

* Preset chips for rapid input:

  * Tsumitate: `¥33,333/mo` (Old NISA carryover), `¥50,000/mo`, `¥100,000/mo` (Max statutory).

  * Growth: `¥0`, `¥100,000/mo`, `¥2,400,000 lump sum`.

## 6. Information Architecture & Compliance Hub

To ensure strict adherence to Japanese financial regulations, prevent regulatory classification as an unregistered Financial Instruments Business (金融商品取引業者), and maintain eligibility for high-yield affiliate programs, the site incorporates a dedicated static content and legal architecture.

```
/ (Root Simulator)
│
├── /guides/
│   ├── /new-nisa-basics-2024
│   ├── /book-value-quota-restoration-explained
│   ├── /tsumitate-vs-growth-allocation-strategies
│   ├── /japan-exit-tax-and-nisa-rules-for-foreigners
│   └── /mortgage-downpayment-nisa-liquidation-guide
│
├── /legal/
│   ├── /disclaimer (免責事項)
│   ├── /operator (運営者情報)
│   └── /affiliate-disclosure (PR表記・ステルスマーケティング規制方針)

```

### 6.1 Static Editorial Reference Guides (SEO & Lead-Gen Ingress)

1. **Guide 1: "The New NISA Mechanics Bible (2024+ Edition)"**

   * Focus: Deep dive into the lifetime ¥18M cap, rollover abolition, and indefinite tax-free periods.

2. **Guide 2: "Understanding 簿価復活 (Book-Value Quota Restoration)"**

   * Focus: Clear breakdowns of liquidation math and the January 1st reset rule.

3. **Guide 3: "Optimal Capital Allocation: Tsumitate vs. Growth"**

   * Focus: Choosing between identical index mutual funds (Toushin) vs. foreign ETFs (VOO/VTI) and managing dividend drag.

4. Guide 4: "Japan Exit Tax, Visas, and **NISA for Foreign Residents"**

   * Focus: What happens to NISA assets upon leaving Japan, permanent residency considerations, and US Taxpayer (PFIC) constraints.

5. **Guide 5: "Liquidating NISA for a Home Down Payment: Strategic Playbook"**

   * Focus: Comparing low mortgage interest rates ($<1\%$) against NISA expected returns ($5\text{--}7\%$) and replenishment roadmaps.

### 6.2 Regulatory Compliance & Legal Disclaimers

#### 6.2.1 Statutory Investment Disclaimer (免責事項)

The disclaimer must appear persistently in the footer of every page and in a collapsible notice under the simulation results:

> **Japanese Standard Text:**
> 「当シミュレーターは、新NISA制度（少額投資非課税制度）の理解を深めるための情報提供および概算試算を目的としており、金融商品の売買その他の取引の勧誘や特定の投資手法を推奨するものではありません。計算結果は入力された仮定条件に基づく試算であり、将来の運用成果や税制改正後の適用を保証するものではありません。実際の投資判断および口座開設のお手続きは、ご自身の判断と責任において行っていただきますようお願い申し上げます。当サイトの利用により生じたいかなる損害についても、運営者は一切の責任を負いません。」
>
> **English Translation:** *"This simulator is intended solely for educational purposes and scenario estimation to facilitate understanding of Japan's New NISA system. It does not constitute investment advice, financial planning services, or solicitation to engage in financial transactions. All calculations are hypothetical projections based on user-provided inputs and do not guarantee future returns or tax treatment. Users must make their own independent investment decisions. The operator accepts no liability for actions taken based on this tool."*