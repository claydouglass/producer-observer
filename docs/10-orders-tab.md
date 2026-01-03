# Orders Tab Specification

**Real-time order management and intelligence for producers receiving orders through Vervana**

---

## Overview

The Orders tab is the producer's command center for incoming orders. Every order flows through Vervana, creating a single source of truth that eliminates the chaos of emails, texts, phone calls, and spreadsheets. Producers see orders in real-time, can analyze patterns, and take action instantly.

**Philosophy:** Orders are the heartbeat of your business. When you can see them clearly, analyze them intelligently, and act on them instantly, you win.

---

## The Vervana Advantage

### Before Vervana (The Old Way)
```
┌─────────────────────────────────────────────────────────────┐
│ HOW ORDERS COME IN TODAY                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📧 Email: "Hey can you send 24 of those purple ones?"      │
│ 📱 Text: "need more of that fire u had last week"          │
│ 📞 Phone: "I'll take... hold on... 12 of the... wait..."   │
│ 📋 Portal A: Login, navigate, download CSV                  │
│ 📋 Portal B: Different login, different format              │
│ 📋 Portal C: Yet another system                             │
│ 🤷 Fax: Yes, some still use fax                            │
│                                                             │
│ Result: Orders scattered across 7+ channels                 │
│ Errors: Wrong products, wrong quantities, missed orders    │
│ Time: Hours spent reconciling and entering into systems    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### With Vervana (The New Way)
```
┌─────────────────────────────────────────────────────────────┐
│ HOW ORDERS COME IN WITH VERVANA                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔔 Real-time notification: New order from Nectar Portland  │
│                                                             │
│ One place. Every order. Instant visibility.                │
│                                                             │
│ • Structured data (no more "those purple ones")            │
│ • Validated against your catalog                           │
│ • Automatic inventory check                                 │
│ • Payment terms attached                                    │
│ • Delivery preferences included                             │
│ • History with this retailer visible                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Order Inbox

Real-time stream of incoming orders:

```
┌─────────────────────────────────────────────────────────────┐
│ ORDERS                                          Filter ▼    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔴 NEW  Nectar Portland                    Just now        │
│   $1,840 · 48 units · Flower, Pre-Rolls                    │
│   Requested delivery: Tomorrow                              │
│   [View] [Accept] [Issue]                                  │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ 🟡 CONFIRMED  Smooth Roots                 2 hours ago     │
│   $2,120 · 62 units · Full catalog                         │
│   Scheduled delivery: Friday                                │
│   [View] [Ready to Ship]                                   │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ 🟢 SHIPPED  Green Valley                   Yesterday       │
│   $960 · 28 units · Flower only                            │
│   In transit · ETA 2:30 PM                                 │
│   [Track] [Mark Delivered]                                 │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ ✅ DELIVERED  Mountain High                2 days ago      │
│   $1,540 · 44 units                                        │
│   Delivered Jan 1 · Payment due Jan 15                     │
│   [View Invoice]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Order Statuses

| Status | Meaning | Actions Available |
|--------|---------|-------------------|
| **NEW** | Just received, awaiting review | Accept, Reject, Request Changes |
| **CONFIRMED** | Accepted, in queue for fulfillment | Edit, Cancel, Mark Packing |
| **PACKING** | Being assembled | Mark Ready, Flag Issue |
| **READY** | Packed, awaiting pickup/delivery | Assign Driver, Mark Shipped |
| **SHIPPED** | In transit | Track, Mark Delivered |
| **DELIVERED** | Received by retailer | Confirm, Handle Returns |
| **INVOICED** | Payment pending | View Invoice, Record Payment |
| **PAID** | Complete | View History |
| **ISSUE** | Problem flagged | Resolve, Contact Retailer |

### 2. Order Detail View

Full order information with context:

```
┌─────────────────────────────────────────────────────────────┐
│ ORDER #VRV-2026-0103-001                                   │
│ Nectar - 510 NW 11th Ave, Portland                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STATUS: NEW                              RECEIVED: Just now │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ RETAILER CONTEXT                                        ││
│ │                                                         ││
│ │ Relationship Health: 78/100 (Healthy, Growing)         ││
│ │ Journey Stage: Established Partner (18 months)         ││
│ │ Avg Order: $1,420 · This Order: $1,840 (+30%)         ││
│ │ Payment History: Always on time, Net 15                ││
│ │ Last Order: 12 days ago                                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ LINE ITEMS                                                  │
│ ─────────────────────────────────────────────────────────  │
│ Product                  Qty    Unit     Extended          │
│ OG Kush 3.5g (Indica)    24    $18.00   $432.00     ✓     │
│ Blue Dream 1g PR         24    $8.00    $192.00     ✓     │
│ GSC 3.5g (Hybrid)        12    $18.00   $216.00     ✓     │
│ Gelato Cart 1g           12    $22.00   $264.00     ⚠ Low │
│ New: Purple Punch 3.5g   24    $20.00   $480.00     ✓     │
│ ─────────────────────────────────────────────────────────  │
│ Subtotal                               $1,584.00           │
│ Volume Discount (10%)                  -$158.40            │
│ ORDER TOTAL                            $1,425.60           │
│                                                             │
│ ⚠ Gelato Cart 1g: Only 8 in stock (ordered 12)            │
│   [Partial Fill] [Substitute] [Contact Retailer]          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ DELIVERY REQUEST                                            │
│ Requested: Tomorrow, Jan 4 (Morning preferred)             │
│ Address: 510 NW 11th Ave, Portland OR 97209                │
│ Contact: Mike (Buyer) - 503-555-0123                       │
│ Notes: "Please use side entrance"                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ PAYMENT TERMS                                               │
│ Net 15 · Due: Jan 18, 2026                                 │
│ Payment Method: ACH on file                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Reject Order]  [Request Changes]  [✓ Accept Order]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Order Analytics

Understand your order patterns:

```
┌─────────────────────────────────────────────────────────────┐
│ ORDER ANALYTICS                           Last 30 Days     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ VOLUME                                                      │
│ ────────────────────────                                   │
│ Total Orders: 147                                          │
│ Total Units: 4,280                                         │
│ Total Value: $89,420                                       │
│                                                             │
│ DAILY ORDER VOLUME                                          │
│ ▃▅▇█▆▄▅▇▅▃▂▄▆▇█▅▄▃▅▇█▆▄▅▆▇█▅▄▃                           │
│ Mon        Wed        Fri        Mon        Wed            │
│                                                             │
│ Peak days: Tuesday, Friday                                 │
│ Avg daily: 4.9 orders                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ BY PRODUCT CATEGORY                 BY RETAILER TYPE       │
│ ──────────────────────────          ──────────────────     │
│ Flower         42%  ████████        Urban          58%     │
│ Pre-Rolls      24%  █████           Suburban       28%     │
│ Cartridges     18%  ████            Rural          14%     │
│ Concentrates   12%  ██                                     │
│ Edibles         4%  █                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ORDER SIZE DISTRIBUTION                                     │
│ ──────────────────────────────────────────────────────     │
│ <$500         ████████████ 34 orders (23%)                 │
│ $500-$1000    ████████████████████ 52 orders (35%)         │
│ $1000-$2000   ██████████████ 38 orders (26%)               │
│ >$2000        ████████ 23 orders (16%)                     │
│                                                             │
│ Avg Order Size: $608                                        │
│ Median: $520 · Largest: $4,200 (Nectar bulk order)        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ FULFILLMENT PERFORMANCE                                     │
│ ──────────────────────────────────────────────────────     │
│ Fill Rate:        94.2%  ████████████████████░░            │
│ On-Time Rate:     91.8%  ███████████████████░░░            │
│ Error Rate:        2.1%  █░░░░░░░░░░░░░░░░░░░░             │
│                                                             │
│ Avg Time to Ship: 1.4 days                                 │
│ Avg Time to Deliver: 2.1 days                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Smart Alerts & Recommendations

Proactive intelligence:

```
┌─────────────────────────────────────────────────────────────┐
│ 🔔 ALERTS & INSIGHTS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️  INVENTORY ALERT                                         │
│ Gelato Cart 1g down to 8 units. 3 pending orders need 28.  │
│ [View Inventory] [Notify Affected Retailers]               │
│                                                             │
│ 📈 TREND SPOTTED                                            │
│ Purple Punch orders up 340% this week. Consider restocking │
│ above normal levels.                                        │
│ [View Product] [Adjust Forecast]                           │
│                                                             │
│ 🔄 REORDER PREDICTION                                       │
│ Nectar Portland usually orders every 12 days. Last order   │
│ was 14 days ago. Expect order soon or check in.           │
│ [Contact Retailer] [View History]                          │
│                                                             │
│ 💰 OPPORTUNITY                                              │
│ 8 retailers haven't tried your new Indica line yet.        │
│ Combined potential: $12,400/month.                         │
│ [View List] [Send Samples]                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Order Workflow

### Receiving an Order

```
Retailer places order via Vervana
         ↓
┌─────────────────────┐
│ Order validated     │ ← Check against catalog
│ Inventory checked   │ ← Flag if insufficient
│ Terms attached      │ ← Payment, delivery prefs
│ History pulled      │ ← Relationship context
└─────────────────────┘
         ↓
Producer notified instantly
         ↓
Producer reviews in Orders tab
         ↓
┌─────────────────────┐
│ Accept              │ → Move to Confirmed
│ Request Changes     │ → Back to retailer
│ Reject              │ → Notify retailer why
└─────────────────────┘
```

### Fulfilling an Order

```
CONFIRMED order in queue
         ↓
Producer clicks "Start Packing"
         ↓
┌─────────────────────┐
│ Generate pick list  │
│ Print labels        │
│ Compliance docs     │
│ Manifest created    │
└─────────────────────┘
         ↓
Producer clicks "Ready to Ship"
         ↓
Assigned to route in Delivery tab
         ↓
Driver marks "Shipped"
         ↓
Driver marks "Delivered"
         ↓
Invoice generated automatically
         ↓
Payment tracked until complete
```

---

## Integration Points

### With Other Tabs

| Tab | Integration |
|-----|-------------|
| **Catalog** | Orders validate against available products |
| **Delivery** | Confirmed orders feed route builder |
| **Retail** | Order patterns inform demand forecasts |
| **Partnership** | Order fulfillment metrics track promises |
| **Production** | Order volume drives production planning |

### With External Systems

**What Vervana Replaces or Integrates:**
- Order entry systems (LeafLink, Apex, etc.)
- Email/text order chaos
- Spreadsheet tracking
- Manual invoicing
- Payment tracking

**The Vision:** One interface that either links to or replaces their entire tech stack. Like Stripe - you can use their Atlas to set up a company, or just use payments. We give them the on-ramp, then deliver so much value they never leave.

---

## Data Model

### Order Object

```javascript
{
  id: "VRV-2026-0103-001",
  retailer: {
    id: "050-3041",
    name: "Nectar",
    location: "510 NW 11th Ave, Portland",
    healthScore: 78,
    journeyStage: "established",
  },
  status: "new",
  timestamps: {
    placed: "2026-01-03T14:30:00Z",
    confirmed: null,
    packed: null,
    shipped: null,
    delivered: null,
    invoiced: null,
    paid: null,
  },
  lineItems: [
    {
      productId: "SKU-001",
      name: "OG Kush 3.5g",
      category: "Flower",
      type: "Indica",
      quantity: 24,
      unitPrice: 18.00,
      extended: 432.00,
      inStock: true,
    },
    // ...
  ],
  totals: {
    subtotal: 1584.00,
    discount: 158.40,
    discountReason: "Volume 10%",
    total: 1425.60,
  },
  delivery: {
    requestedDate: "2026-01-04",
    preferredTime: "morning",
    address: "510 NW 11th Ave, Portland OR 97209",
    contact: "Mike",
    phone: "503-555-0123",
    notes: "Please use side entrance",
  },
  payment: {
    terms: "Net 15",
    dueDate: "2026-01-18",
    method: "ACH",
    status: "pending",
  },
  flags: {
    hasInventoryIssue: true,
    isUrgent: false,
    isFirstOrder: false,
    isLargeOrder: true,
  },
}
```

---

## VP Integration

The VP can help with orders:

```
Rep: "What orders came in today?"

VP: "You've got 6 new orders today totaling $4,280:

1. Nectar Portland - $1,840 (your largest today)
   Note: They ordered the new Purple Punch for first time
   
2. Smooth Roots - $920
   Standard reorder, same as usual

3. Green Valley - $640
   ⚠️ Heads up: Their health score dropped to 52
   
4-6. Three smaller orders from rural accounts

One issue: The Nectar order wants 12 Gelato Carts but you 
only have 8. Want me to draft a message to Mike about it?"
```

---

## Success Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Order Processing Time | <2 hours | Speed wins customers |
| Fill Rate | >95% | Don't disappoint retailers |
| On-Time Delivery | >95% | Keep promises |
| Order Error Rate | <1% | Trust through accuracy |
| Time Saved | 10+ hrs/week | ROI of the system |

---

## The Bigger Picture

This isn't just an order management system. It's the beginning of **infrastructure for the industry**.

Like Stripe didn't just process payments - they built the financial infrastructure for the internet. Vervana builds the operational infrastructure for cannabis.

**Why others can't do this:**
- They do a little piece and can't imagine more
- It would break their business model
- They don't have the resources
- They're not producers/retailers - they don't feel the pain

**Why we can:**
- We ARE producers and retailers
- We know the problems intimately
- We can build at velocity
- We deliver overwhelming value
- We have the vision to systematize everything

**The end state:** Real-time shared source of truth for the entire industry. Intel, context, and action. The new interface.

---

[← Back to Delivery Tab](./09-delivery-tab.md) | [Next: Catalog Tab →](./11-catalog-tab.md)
