# Catalog Tab Specification

**Your product catalog as a living, intelligent sales tool - where the retailer's VP comes to buy**

---

## Overview

The Catalog tab transforms your product list from a static spreadsheet into a dynamic sales engine. But here's what makes it different: **the retailer's VP uses this to buy**. Just like your reps have a VP to help them sell, retailers have a VP to help them buy intelligently.

The Catalog is fed by Production. Production is informed by Retail demand and Consumer behavior. It's a complete feedback loop: **Intel → Context → Action**.

**Philosophy:** Your catalog is your storefront. The retailer's VP is the smartest buyer they've ever had. Together, they create frictionless commerce.

---

## The Feedback Loop

```
┌─────────────────────────────────────────────────────────────┐
│                  THE VERVANA FEEDBACK LOOP                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     ┌──────────┐                      ┌──────────┐         │
│     │  RETAIL  │ ──── demand ────→   │PRODUCTION│         │
│     │   TAB    │       signals        │   TAB    │         │
│     └──────────┘                      └──────────┘         │
│           ↑                                 │               │
│           │                                 │               │
│      consumer                          available            │
│      behavior                          inventory            │
│           │                                 │               │
│     ┌──────────┐                           ↓               │
│     │CONSUMERS │                      ┌──────────┐         │
│     │   TAB    │                      │ CATALOG  │         │
│     └──────────┘                      │   TAB    │         │
│           ↑                                 │               │
│           │                                 │               │
│        what                            retailer             │
│        sold                            VP buys              │
│           │                                 │               │
│           │         ┌──────────┐           │               │
│           └──────── │  ORDERS  │ ←─────────┘               │
│                     │   TAB    │                           │
│                     └──────────┘                           │
│                           │                                 │
│                           ↓                                 │
│                     ┌──────────┐                           │
│                     │ DELIVERY │                           │
│                     │   TAB    │                           │
│                     └──────────┘                           │
│                                                             │
│  INTEL ────→ CONTEXT ────→ ACTION ────→ INTEL (repeat)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### How It Flows

1. **Retail Tab** shows what's selling at retailers (demand signals)
2. **Consumers Tab** shows who's buying and what they want
3. **Production Tab** uses these signals to plan what to grow/make
4. **Catalog Tab** reflects what's available from production
5. **Retailer's VP** uses the catalog to make smart buying decisions
6. **Orders Tab** captures what retailers buy
7. **Delivery Tab** fulfills those orders
8. → And the cycle repeats, each loop getting smarter

---

## The Problem We're Solving

### Before Vervana
```
┌─────────────────────────────────────────────────────────────┐
│ HOW PRODUCERS SHARE CATALOGS TODAY                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📧 "Hey here's our updated menu" [PDF attached]            │
│    → Retailer downloads, opens, scrolls... closes          │
│                                                             │
│ 📱 "What do you have in stock?"                            │
│    → Producer checks inventory, texts back, back and forth │
│                                                             │
│ 📋 Spreadsheet emailed weekly                               │
│    → Out of date by the time it's received                 │
│                                                             │
│ 🌐 Multiple portals, different logins                       │
│    → Retailers forget passwords, never check               │
│                                                             │
│ 📞 "What's your price on..."                               │
│    → Same question 50 times a day                          │
│                                                             │
│ Result:                                                     │
│ • Retailers don't know what's available                    │
│ • They order what they remember, not what's best           │
│ • New products don't get discovered                        │
│ • You lose sales to friction                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### With Vervana
```
┌─────────────────────────────────────────────────────────────┐
│ HOW IT WORKS NOW                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Retailer sees your catalog in real-time:                   │
│                                                             │
│ ✅ Live inventory levels                                    │
│ ✅ Current wholesale pricing                                │
│ ✅ Their specific pricing tier                              │
│ ✅ When out-of-stock items return                          │
│ ✅ New products highlighted                                 │
│ ✅ Performance data (what's selling)                        │
│ ✅ One-click ordering                                       │
│                                                             │
│ You never email a menu again.                              │
│ You never answer "what do you have?" again.                │
│ Retailers order more because it's effortless.              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Product Catalog Manager

Your full product lineup with intelligent organization:

```
┌─────────────────────────────────────────────────────────────┐
│ CATALOG                                    + Add Product   │
├─────────────────────────────────────────────────────────────┤
│ Filter: [All Categories ▼] [All Types ▼] [In Stock ▼]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🌿 FLOWER                                    24 products ││
│ │                                                         ││
│ │ ┌───────┐ OG Kush 3.5g                                 ││
│ │ │ photo │ Indica · THC: 24.5% · CBD: 0.1%             ││
│ │ └───────┘ Wholesale: $18.00 · MSRP: $35.00            ││
│ │           Stock: 248 units · Selling: 42/week          ││
│ │           [Edit] [View Analytics] [Hide]               ││
│ │                                                         ││
│ │ ┌───────┐ Purple Punch 3.5g              ⭐ NEW        ││
│ │ │ photo │ Indica · THC: 22.8% · CBD: 0.2%             ││
│ │ └───────┘ Wholesale: $20.00 · MSRP: $40.00            ││
│ │           Stock: 180 units · Selling: 28/week          ││
│ │           [Edit] [View Analytics] [Hide]               ││
│ │                                                         ││
│ │ ┌───────┐ Blue Dream 3.5g                              ││
│ │ │ photo │ Sativa · THC: 21.2% · CBD: 0.3%             ││
│ │ └───────┘ Wholesale: $16.00 · MSRP: $32.00            ││
│ │           Stock: 12 units ⚠️ LOW · Restock: Jan 8     ││
│ │           [Edit] [View Analytics] [Hide]               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🔥 PRE-ROLLS                                 12 products ││
│ │ ...                                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 💨 CARTRIDGES                                 8 products ││
│ │ ...                                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Product Detail & Management

Full product information with analytics:

```
┌─────────────────────────────────────────────────────────────┐
│ OG Kush 3.5g                                    [Save]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────┐  BASIC INFO                               │
│ │              │  ─────────────────────────────────        │
│ │   [photo]    │  Name: OG Kush 3.5g                       │
│ │              │  SKU: FLW-OGK-35                          │
│ │  [+ photos]  │  Category: Flower                         │
│ │              │  Type: Indica                              │
│ └──────────────┘  Brand: Oregrown                          │
│                                                             │
│ CANNABINOID PROFILE                                         │
│ ─────────────────────────────────────────────              │
│ THC: 24.5%    CBD: 0.1%    CBN: 0.3%                       │
│ Terpenes: Myrcene, Limonene, Caryophyllene                 │
│                                                             │
│ PRICING                                                     │
│ ─────────────────────────────────────────────              │
│ Base Wholesale:     $18.00                                  │
│ Suggested MSRP:     $35.00 (49% margin for retailer)       │
│                                                             │
│ Tier Pricing:                                               │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Standard:        $18.00  (default)                      ││
│ │ Volume (100+):   $16.50  (-8%)                          ││
│ │ Partner:         $15.50  (-14%)                         ││
│ │ VIP:             $14.50  (-19%)                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ INVENTORY                                                   │
│ ─────────────────────────────────────────────              │
│ Current Stock:    248 units                                 │
│ Reserved:         24 units (pending orders)                 │
│ Available:        224 units                                 │
│ Reorder Point:    50 units                                  │
│ Next Batch:       Jan 15 (est. 500 units)                  │
│                                                             │
│ VISIBILITY                                                  │
│ ─────────────────────────────────────────────              │
│ [✓] Show in catalog                                        │
│ [✓] Allow orders                                           │
│ [✓] Show stock levels to retailers                         │
│ [ ] Featured product                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ PERFORMANCE (Last 30 Days)                                  │
│ ─────────────────────────────────────────────              │
│                                                             │
│ Units Sold:       168                                       │
│ Revenue:          $3,024                                    │
│ Orders:           42                                        │
│ Unique Retailers: 28                                        │
│                                                             │
│ Sales Trend: ▂▃▄▅▆▇█▇▆▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃               │
│              ↗ +18% vs previous 30 days                    │
│                                                             │
│ Top Buyers:                                                 │
│ 1. Nectar Portland (32 units)                              │
│ 2. Green Valley (24 units)                                 │
│ 3. Smooth Roots (18 units)                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Availability Calendar

Show retailers when products will be available:

```
┌─────────────────────────────────────────────────────────────┐
│ AVAILABILITY CALENDAR                                       │
│ What's coming and when                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           January 2026                                      │
│ ┌───┬───┬───┬───┬───┬───┬───┐                             │
│ │Mon│Tue│Wed│Thu│Fri│Sat│Sun│                             │
│ ├───┼───┼───┼───┼───┼───┼───┤                             │
│ │   │   │ 1 │ 2 │ 3●│ 4 │ 5 │  ● Today                   │
│ ├───┼───┼───┼───┼───┼───┼───┤                             │
│ │ 6 │ 7 │ 8○│ 9 │10 │11 │12 │  ○ Blue Dream restock      │
│ ├───┼───┼───┼───┼───┼───┼───┤                             │
│ │13 │14 │15◆│16 │17 │18 │19 │  ◆ New batch OG Kush       │
│ ├───┼───┼───┼───┼───┼───┼───┤                             │
│ │20★│21 │22 │23 │24 │25 │26 │  ★ NEW: Grape Ape launch   │
│ ├───┼───┼───┼───┼───┼───┼───┤                             │
│ │27 │28 │29 │30 │31 │   │   │                             │
│ └───┴───┴───┴───┴───┴───┴───┘                             │
│                                                             │
│ UPCOMING                                                    │
│ ─────────────────────────────────────────────              │
│                                                             │
│ Jan 8  │ Blue Dream 3.5g restock          │ 200 units     │
│ Jan 15 │ OG Kush 3.5g new batch           │ 500 units     │
│ Jan 20 │ 🆕 Grape Ape 3.5g LAUNCH         │ 300 units     │
│ Jan 22 │ Pre-Roll variety pack restock    │ 150 units     │
│                                                             │
│ [Notify retailers about upcoming products]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Pricing Tiers

Manage different pricing for different relationships:

```
┌─────────────────────────────────────────────────────────────┐
│ PRICING TIERS                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STANDARD                                   42 retailers    │
│ ─────────────────────────────────────────────              │
│ Base pricing, no volume discounts                          │
│ Qualification: Default tier                                │
│                                                             │
│ VOLUME                                     18 retailers    │
│ ─────────────────────────────────────────────              │
│ 8% discount on orders 100+ units                          │
│ Qualification: $5,000+ monthly spend                       │
│ Members: Nectar (3 locations), Green Valley, ...          │
│                                                             │
│ PARTNER                                    8 retailers     │
│ ─────────────────────────────────────────────              │
│ 14% discount, priority fulfillment                        │
│ Qualification: 12+ month relationship, $10k+ monthly      │
│ Members: Smooth Roots, Electric Lettuce, ...              │
│                                                             │
│ VIP                                        3 retailers     │
│ ─────────────────────────────────────────────              │
│ 19% discount, priority + early access                     │
│ Qualification: Strategic accounts, invitation only        │
│ Members: Chalice Farms, Serra, Archive                    │
│                                                             │
│ [+ Create New Tier]                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Catalog Analytics

What's getting attention:

```
┌─────────────────────────────────────────────────────────────┐
│ CATALOG INSIGHTS                           Last 7 Days     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ MOST VIEWED                    MOST ORDERED                │
│ ────────────────               ────────────────            │
│ 1. Purple Punch 3.5g (NEW)     1. OG Kush 3.5g             │
│ 2. Grape Ape 3.5g (coming)     2. Blue Dream PR 1g         │
│ 3. OG Kush 3.5g                3. GSC Cart 1g              │
│ 4. Live Resin Cart 1g          4. Purple Punch 3.5g        │
│ 5. Gummy 10pk                  5. Pre-Roll 5pk             │
│                                                             │
│ VIEW-TO-ORDER CONVERSION                                    │
│ ────────────────────────────────────────────────           │
│ Purple Punch:  78% ████████████████████████████░░░         │
│ OG Kush:       65% ██████████████████████░░░░░░░░          │
│ Blue Dream:    52% █████████████████░░░░░░░░░░░░           │
│ Live Resin:    34% ███████████░░░░░░░░░░░░░░░░░░           │
│ Gummy:         28% █████████░░░░░░░░░░░░░░░░░░░░           │
│                                                             │
│ OPPORTUNITY: High views, low conversion                    │
│ ────────────────────────────────────────────────           │
│ • Gummy 10pk - 142 views, 12 orders                       │
│   Suggestion: Price may be too high. Test $18 → $15?      │
│                                                             │
│ • Live Resin Cart - 98 views, 8 orders                    │
│   Suggestion: Add more photos/details. Retailers curious  │
│   but not confident.                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## The Retailer's VP (Buying Intelligence)

Just like your sales reps have a VP to help them sell, retailers have a VP to help them buy. When a retailer views your catalog, their VP is working for them:

### What the Retailer's VP Does

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 RETAILER'S VP - BUYING ASSISTANT                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ "Hey Sarah, I've been looking at Oregrown's catalog.       │
│  Here's what I recommend for your next order:              │
│                                                             │
│  1. RESTOCK URGENT: You're down to 3 OG Kush 3.5g.        │
│     It's your #2 seller. Oregrown has 224 in stock.       │
│     Your price: $15.50 (Partner tier)                      │
│                                                             │
│  2. TRY THIS: Purple Punch 3.5g is new and selling        │
│     fast at similar stores. 78% of buyers reorder.        │
│     Matches your Indica-heavy customer base.               │
│                                                             │
│  3. SKIP THIS: You have 45 days of Sativa stock.          │
│     No need to reorder Blue Dream yet.                     │
│                                                             │
│  4. OPPORTUNITY: You don't carry their Concentrates.      │
│     Stores like yours see $2,400/mo in this category.     │
│                                                             │
│  Want me to build a suggested order?"                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### VP Capabilities for Retailers

| Capability | How It Helps |
|------------|--------------|
| **Inventory Analysis** | Knows what the retailer has, what's selling, what's low |
| **Demand Matching** | Recommends products based on their customer patterns |
| **Price Optimization** | Shows their tier pricing, suggests volume for better rates |
| **Timing Intelligence** | Knows when to reorder based on velocity |
| **New Product Alerts** | Flags relevant new items they should try |
| **Competitive Context** | Shows what similar stores are buying |

### The Conversation

```
Retailer: "What should I order from Oregrown this week?"

VP: "Based on your sales and current inventory:

MUST ORDER (running low):
• OG Kush 3.5g - 24 units ($372 at your tier)
• Blue Dream Pre-Roll 1g - 36 units ($288)

SHOULD TRY (matches your customers):
• Purple Punch 3.5g - 12 units ($206) 
  Similar stores see 40% reorder rate

SKIP FOR NOW:
• Sativa flower - you're stocked for 6 weeks
• Cartridges - slow mover for you, wait until current sells

Total suggested order: $866
This qualifies for free delivery (over $500).

Want me to place this order?"
```

### Why This Matters

**For Retailers:**
- Never run out of best sellers
- Discover products that match their customers
- Stop over-ordering slow movers
- Get better pricing through smart volume

**For Producers:**
- Retailers order more (VP removes friction)
- Better demand forecasting (VP aggregates signals)
- Faster new product adoption (VP recommends)
- Stronger relationships (retailers succeed)

---

## What Retailers See

Your catalog from the retailer's perspective (with their VP helping):

```
┌─────────────────────────────────────────────────────────────┐
│ OREGROWN CATALOG                                           │
│ Your pricing tier: PARTNER (-14%)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🆕 NEW ARRIVALS                                            │
│ ─────────────────────────────────────────────              │
│ ┌───────┐ Purple Punch 3.5g          $17.20 (reg $20)     │
│ │ photo │ Indica · THC: 22.8%        Stock: 180           │
│ └───────┘ [+ Add to Order]                                │
│                                                             │
│ 📦 IN STOCK                                                │
│ ─────────────────────────────────────────────              │
│ ┌───────┐ OG Kush 3.5g               $15.50 (reg $18)     │
│ │ photo │ Indica · THC: 24.5%        Stock: 224           │
│ └───────┘ ⭐ Your customers love this (42 sold last mo)    │
│           [+ Add to Order]                                 │
│                                                             │
│ ⏰ COMING SOON                                              │
│ ─────────────────────────────────────────────              │
│ ┌───────┐ Grape Ape 3.5g             $17.20               │
│ │ photo │ Indica · THC: 23.1%        Available: Jan 20    │
│ └───────┘ [🔔 Notify Me]                                  │
│                                                             │
│ 🔴 TEMPORARILY OUT                                         │
│ ─────────────────────────────────────────────              │
│ ┌───────┐ Blue Dream 3.5g            $13.80               │
│ │ photo │ Sativa · THC: 21.2%        Back: Jan 8          │
│ └───────┘ [🔔 Notify When Available]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Notifications & Communication

### New Product Announcements

```
┌─────────────────────────────────────────────────────────────┐
│ ANNOUNCE NEW PRODUCT                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Product: Grape Ape 3.5g (Indica)                           │
│ Available: January 20, 2026                                │
│ Initial Stock: 300 units                                   │
│                                                             │
│ NOTIFICATION OPTIONS                                        │
│ ─────────────────────────────────────────────              │
│ [✓] All retailers                                          │
│ [ ] Partner tier and above only                            │
│ [ ] Selected retailers only                                │
│                                                             │
│ MESSAGE (auto-generated, editable)                         │
│ ─────────────────────────────────────────────              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ New from Oregrown: Grape Ape 3.5g                       ││
│ │                                                         ││
│ │ Our newest Indica drops January 20th.                   ││
│ │                                                         ││
│ │ • THC: 23.1%                                            ││
│ │ • Terpenes: Myrcene, Pinene, Caryophyllene             ││
│ │ • Your price: $17.20 (Partner tier)                     ││
│ │                                                         ││
│ │ Pre-order now to guarantee allocation.                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Preview] [Schedule for Jan 15] [Send Now]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Restock Alerts

Automatically notify retailers who were interested:

```
🔔 Blue Dream 3.5g is back in stock!

12 retailers requested notification.
[Send Restock Alert to All 12]

Message preview:
"Blue Dream 3.5g is back! 200 units available.
Your price: $13.80 (Partner tier)
Order now - this batch usually sells out in 5 days."
```

---

## Data Model

### Product Object

```javascript
{
  id: "FLW-OGK-35",
  name: "OG Kush 3.5g",
  category: "Flower",
  type: "Indica",
  brand: "Oregrown",
  
  details: {
    thc: 24.5,
    cbd: 0.1,
    cbn: 0.3,
    terpenes: ["Myrcene", "Limonene", "Caryophyllene"],
    description: "Classic OG Kush with earthy, pine notes...",
    effects: ["Relaxing", "Euphoric", "Sleepy"],
  },
  
  pricing: {
    baseWholesale: 18.00,
    msrp: 35.00,
    tiers: {
      standard: 18.00,
      volume: 16.50,
      partner: 15.50,
      vip: 14.50,
    },
  },
  
  inventory: {
    current: 248,
    reserved: 24,
    available: 224,
    reorderPoint: 50,
    nextBatch: {
      date: "2026-01-15",
      quantity: 500,
    },
  },
  
  visibility: {
    showInCatalog: true,
    allowOrders: true,
    showStock: true,
    featured: false,
  },
  
  media: {
    primaryImage: "url...",
    gallery: ["url...", "url..."],
  },
  
  performance: {
    last30Days: {
      unitsSold: 168,
      revenue: 3024,
      orders: 42,
      uniqueRetailers: 28,
    },
    trend: "+18%",
    topBuyers: ["050-3041", "050-6622", "050-3054"],
  },
  
  timestamps: {
    created: "2024-06-15T...",
    updated: "2026-01-02T...",
    lastOrdered: "2026-01-02T...",
  },
}
```

---

## Integration Points

### With Other Tabs

| Tab | Integration |
|-----|-------------|
| **Orders** | Orders validate against catalog; catalog shows order volume |
| **Production** | Production schedule feeds availability calendar |
| **Retail** | Retailer demand data informs what to stock |
| **Delivery** | Catalog determines what can be packed |

### External Integrations

- **Metrc/BioTrack** - Inventory sync
- **Production systems** - Batch tracking
- **Photography services** - Product images
- **Lab results** - COA integration

---

## Success Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Catalog views/week | 500+ | Retailers engaged with products |
| View-to-order rate | >50% | Catalog drives sales |
| New product adoption | 30% in 7 days | Retailers try new items |
| Out-of-stock notifications | <5% | Keep products available |
| Time to update catalog | <5 min | Fast response to changes |

---

## The Vision

The catalog isn't just a product list. It's a **real-time connection** between what you make and what retailers need.

**Old world:** Static PDFs, outdated spreadsheets, endless "what do you have?" calls.

**New world:** Living catalog that retailers check daily because it's always accurate, always relevant, and makes ordering effortless.

This is how Stripe made payments. They didn't just process transactions - they made integration so easy that developers chose them by default. We make catalog management so seamless that producers and retailers choose Vervana by default.

**The end state:** The industry runs on this shared catalog. Every producer, every retailer, one source of truth for what's available, at what price, delivered when.

---

[← Back to Orders Tab](./10-orders-tab.md) | [Next: Delivery Tab →](./09-delivery-tab.md)
