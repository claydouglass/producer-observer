# Delivery Tab Specification

**Route optimization, rep intelligence, and world-class sales preparation for Oregon cannabis distributors**

---

## Overview

The Delivery tab is more than logistics—it's a **sales intelligence command center** that ensures every rep walks into every retailer fully briefed, confident, and prepared. It combines route optimization with relationship intelligence, stock visibility, and AI-powered preparation tools.

**Philosophy:** The best reps don't just deliver product. They deliver value. This system ensures every visit strengthens the relationship.

---

## The VP of Retailer Relationships

### Concept

Every rep is the **President of Great Relationships** with their retailers. The system acts as their **VP**—an always-available, always-informed executive assistant that:

- Knows every retailer's history, preferences, and pain points
- Tracks performance down to the SKU level
- Listens when they walk out of a store
- Speaks back like a real conversation (ChatGPT Voice-style)
- Never forgets context, never drops the ball

### The VP Persona

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "Hey Sarah, before you walk into Nectar—quick heads up.   │
│   Their Pre-Roll inventory is critical, down to 3 units.   │
│   Mike mentioned last time he wanted to try the new        │
│   Indica. And remember, they're opening that NE Portland   │
│   location in March. Good chance to lock in both stores."  │
│                                                             │
│                           — Your VP                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### VP Capabilities

| Capability | Description |
|------------|-------------|
| **Pre-Visit Briefing** | Proactively shares what you need to know before each stop |
| **Real-Time Answers** | Ask anything about the account, get instant answers |
| **Post-Visit Capture** | Listens to your voice notes, extracts action items |
| **Performance Analysis** | Breaks down what's working/not working by product |
| **Relationship Alerts** | Flags accounts that need attention before they churn |
| **Strategic Suggestions** | Recommends talking points, upsell opportunities |

### Voice-First Interaction

The VP communicates like a real person using voice:

**Inbound (VP → Rep):**
- Morning audio brief for the day's route
- Per-stop briefings as you approach each retailer
- Alerts when something needs attention

**Outbound (Rep → VP):**
- Post-visit voice notes captured and transcribed
- Questions answered in real-time conversation
- Natural dialogue, not button pressing

**Technology:** OpenAI Realtime API, ElevenLabs, or similar for natural voice conversation

---

## Data Sources

### OLCC Cannabis Business Licenses
- **File:** `docs/OLCC Cannabis Business Licenses Endorsements.csv`
- **Records:** 771 licensed recreational retailers in Oregon
- **Key Fields:**
  - `License Number` - Unique identifier
  - `Business Name` - Retailer trade name
  - `PhysicalAddress` - Full street address with city, state, ZIP
  - `County` - Oregon county (for regional grouping)
  - `Status` - License status (ACTIVE, etc.)
  - `Endorsement` - Includes "Marijuana Home Delivery" flag

### Order/Demand Data (Future Integration)
- Pending orders from retailers
- Historical order frequency and volume
- Delivery promises and SLAs
- Inventory availability at distribution center

---

## Rep Assignment & Territory Management

### Regional Structure

Oregon divided into territories, each assigned to a sales rep:

| Region | Counties | Rep Assignment |
|--------|----------|----------------|
| **Portland Metro** | Multnomah, Washington, Clackamas | Primary territory - highest density |
| **Willamette Valley** | Marion, Lane, Linn, Benton, Polk | Wine country corridor |
| **Southern Oregon** | Jackson, Josephine, Douglas | Craft cannabis hub |
| **Central Oregon** | Deschutes, Jefferson, Crook | Tourism + local market |
| **Coast** | Lincoln, Tillamook, Coos, Curry | Seasonal tourism |
| **Eastern Oregon** | Harney, Malheur, Umatilla, etc. | Low density, long routes |

### Rep Dashboard View

Each rep sees only their territory by default:

```
┌─────────────────────────────────────────────────────────────┐
│ SARAH'S TERRITORY: Southern Oregon                         │
│ 47 Active Retailers | 12 Visits This Week | 3 Urgent       │
├─────────────────────────────────────────────────────────────┤
│ Today's Route: 6 stops | 89 miles | ~5.5 hours             │
│                                                             │
│ [Map showing Jackson/Josephine counties with route]        │
│                                                             │
│ Relationship Health:                                        │
│   ● 38 Healthy (81%)  ● 6 Needs Attention  ● 3 At Risk    │
└─────────────────────────────────────────────────────────────┘
```

### Territory Metrics (Per Rep)

- Total retailers in territory
- Active customers vs prospects
- Visit frequency compliance
- Revenue per territory
- Relationship health distribution

---

## Retailer Relationship Health

### Health Score (0-100)

Every retailer gets a relationship health score based on:

| Factor | Weight | Calculation |
|--------|--------|-------------|
| **Order Recency** | 25% | Days since last order (lower = better) |
| **Order Frequency** | 20% | Orders per month vs expected |
| **Order Value Trend** | 20% | Growing, stable, or declining |
| **Fill Rate** | 15% | % of orders we fulfilled completely |
| **Promise Kept** | 10% | On-time delivery rate to this retailer |
| **Engagement** | 10% | Rep visit frequency, responsiveness |

### Health Categories

```
THRIVING (80-100)     Growing relationship, expanding orders
   ● Strong reorder rate
   ● Trying new products
   ● Reliable payment

HEALTHY (60-79)       Stable, meeting expectations
   ● Consistent orders
   ● No complaints
   ● Standard engagement

NEEDS ATTENTION (40-59)   Early warning signs
   ● Order frequency dropping
   ● Hasn't tried new SKUs
   ● Missed last visit

AT RISK (20-39)       Relationship deteriorating
   ● Significant order decline
   ● Complaints or returns
   ● Competitor gaining share

CHURNED (0-19)        Lost or nearly lost
   ● No orders in 60+ days
   ● Stopped responding
   ● Switched to competitor
```

### Health Alerts

System generates alerts for rep action:

- "Nectar Portland hasn't ordered in 3 weeks (usually weekly)"
- "Smooth Roots order value down 40% vs last quarter"
- "New competitor (Brand X) spotted at 3 of your accounts"

---

## Performance by Product, Category & Type

### Per-Retailer Performance Dashboard

See exactly what's selling (and what's not) at each account:

```
┌─────────────────────────────────────────────────────────────┐
│ PERFORMANCE AT: Nectar - 510 NW 11th Ave                   │
│ Period: Last 90 Days                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ BY CATEGORY                                                 │
│ ──────────────────────────────────────────────────────────  │
│ Category      Units    Wholesale    Trend     vs Avg       │
│ Flower        156      $4,680       ↗ +12%    Above avg    │
│ Pre-Rolls     89       $1,335       → Flat    Average      │
│ Cartridges    34       $1,700       ↘ -8%     Below avg    │
│ Edibles       0        $0           —         NOT CARRIED  │
│ Concentrates  12       $720         ↗ +25%    New!         │
│                                                             │
│ BY TYPE (Flower + Pre-Rolls)                               │
│ ──────────────────────────────────────────────────────────  │
│ Type          Units    Wholesale    Trend     Share        │
│ Indica        142      $3,408       ↗ +18%    58% ████████ │
│ Hybrid        67       $1,608       ↘ -5%     27% ████     │
│ Sativa        36       $999         → Flat    15% ██       │
│                                                             │
│ TOP PRODUCTS                                                │
│ ──────────────────────────────────────────────────────────  │
│ Product                    Units   Trend    Status         │
│ 1. OG Kush 3.5g (Indica)   48     ↗ +22%   ⭐ Best seller │
│ 2. Blue Dream 1g PR        36     → Flat   Consistent     │
│ 3. GSC 3.5g (Hybrid)       28     ↘ -15%   ⚠ Declining   │
│ 4. Durban 1g Cart          18     ↘ -20%   🔴 At risk     │
│ 5. Gelato 3.5g (Indica)    24     ↗ +30%   🚀 Growing     │
│                                                             │
│ DECLINING PRODUCTS (Action Needed)                          │
│ ──────────────────────────────────────────────────────────  │
│ • GSC 3.5g Hybrid: Down 15% — consider promo or swap       │
│ • Durban 1g Cart: Down 20% — competitor cart gaining       │
│ • Jack Herer Pre-Roll: No orders in 45 days — discontinue? │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Performance Indicators

| Indicator | Meaning | Action |
|-----------|---------|--------|
| ⭐ **Best Seller** | Top 20% by velocity | Protect stock, ensure no stockouts |
| 🚀 **Growing** | +15% or more vs prior period | Expand facings, suggest larger orders |
| → **Stable** | Within ±10% | Maintain current approach |
| ⚠ **Declining** | -10% to -25% | Investigate cause, consider promo |
| 🔴 **At Risk** | -25% or worse, or no orders 30+ days | Urgent conversation needed |
| ❌ **Lost** | No orders 60+ days | Win-back campaign or delist |

### Rollup Views

**Territory Performance:** See patterns across all accounts
```
Your Territory: Product Performance Summary

GROWING FAST (capitalize):
• Indica Flower overall +18% — lean into this trend
• Concentrates +25% — new category gaining traction

DECLINING (investigate):
• Cartridges -12% territory-wide — competitor issue?
• Sativa Pre-Rolls -8% — seasonal or permanent shift?

OPPORTUNITY:
• 12 accounts don't carry Edibles — $28,800/mo potential
• 8 accounts under-indexed on Concentrates
```

---

## Declining & At-Risk Visibility

### At-Risk Dashboard

Proactive view of relationships and products in danger:

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  AT-RISK ACCOUNTS                              3 total  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔴 Green Valley Dispensary          Health: 34/100         │
│    Last order: 42 days ago (was every 2 weeks)             │
│    Issue: Order value dropped 60% over 3 months            │
│    Intel: Competitor "Peak" now has 6 SKUs on shelf        │
│    → Action: Schedule urgent visit, bring pricing proposal │
│                                                             │
│ 🔴 Mountain High                    Health: 38/100         │
│    Last order: 28 days ago (was weekly)                    │
│    Issue: Buyer Mike left, new buyer unknown               │
│    Intel: Need to build new relationship from scratch      │
│    → Action: Intro meeting with new buyer ASAP             │
│                                                             │
│ 🔴 Ashland Organics                 Health: 41/100         │
│    Last order: 21 days ago                                 │
│    Issue: Complained about last delivery (2 days late)     │
│    Intel: Owner mentioned "exploring options"              │
│    → Action: Apology + make-good offer, manager call       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ⚠️  DECLINING ACCOUNTS (not yet at-risk)          6 total  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Rogue Cannabis Co.        Health: 58/100 (was 71)          │
│ Trend: Order value -30% over 60 days                       │
│                                                             │
│ Cascade Wellness          Health: 62/100 (was 74)          │
│ Trend: Skipped last expected order                         │
│                                                             │
│ [View all 6...]                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 🔴 AT-RISK PRODUCTS (across territory)           8 SKUs    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Durban Poison 1g Cart     -35% velocity, 4 accounts lost   │
│ Jack Herer 1g Pre-Roll    No movement at 6 accounts        │
│ Blue Cheese 3.5g          -28% velocity, customer feedback │
│                                                             │
│ [View all 8...]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Early Warning System

The VP proactively alerts before accounts go critical:

| Warning Level | Trigger | VP Action |
|---------------|---------|-----------|
| **Yellow** | 1 missed expected order | "Heads up: Rogue Cannabis usually orders Tuesdays, nothing yet" |
| **Orange** | 2 missed orders OR -20% value | "Rogue Cannabis is trending down. Want me to add them to this week's route?" |
| **Red** | 3+ missed OR -40% value | "Critical: Rogue Cannabis at risk of churning. I've drafted a win-back plan." |

---

## Post-Visit Voice Capture

### Walk-Out-and-Talk

After every visit, the rep talks to their VP:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎙️ POST-VISIT NOTE                                         │
│ Nectar - 510 NW 11th Ave | Jan 3, 2026 @ 11:45 AM         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Recording...]  ●  2:34                                    │
│                                                             │
│ Sarah: "Just walked out of Nectar. Great visit. Mike       │
│ placed a bigger order than usual—$1,800, up from their     │
│ typical $1,200. He took 24 units of the new Indica, loved  │
│ the sample I left last time.                               │
│                                                             │
│ He's definitely interested in edibles now. Asked me to     │
│ bring samples next week—specifically gummies, not          │
│ chocolates. Said their customers ask for gummies.          │
│                                                             │
│ Oh, and the NE Portland location got pushed to March.      │
│ Permit delays. But he said we're definitely their first    │
│ call when it opens. I should follow up mid-February.       │
│                                                             │
│ One thing—he mentioned a new rep from Green Peak came by   │
│ last week. Didn't switch anything but worth watching."     │
│                                                             │
│ [Stop Recording]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Extraction

The VP listens and automatically extracts:

```
┌─────────────────────────────────────────────────────────────┐
│ ✅ EXTRACTED FROM VOICE NOTE                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ORDER PLACED                                                │
│ • $1,800 total (+50% vs typical)                           │
│ • 24 units new Indica                                       │
│ • Updated order history ✓                                  │
│                                                             │
│ ACTION ITEMS CREATED                                        │
│ □ Bring gummy samples to Nectar (next visit)               │
│ □ Follow up re: NE Portland location (mid-February)        │
│                                                             │
│ CONTEXT UPDATED                                             │
│ • Product preference: Gummies > Chocolates                 │
│ • NE location: Pushed to March (permit delays)             │
│ • Competitive intel: Green Peak rep visited                │
│                                                             │
│ RELATIONSHIP HEALTH                                         │
│ • Score: 72 → 78 (+6 points)                               │
│ • Reason: Large order, trying new products                 │
│                                                             │
│ [Edit Extraction]  [Confirm & Save]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Voice Note Best Practices

The VP coaches reps on what to capture:

1. **Order details** - What they bought, quantities, anything unusual
2. **Product feedback** - What's selling, what's not, why
3. **Opportunities** - New products they want, expansion plans
4. **Competitive intel** - Other reps visiting, products they're considering
5. **Relationship notes** - Key contacts, preferences, personal details
6. **Follow-ups** - Anything you promised to do or bring next time

---

## Real-Time Voice Conversation

### Talk to Your VP

Full voice conversation, not just commands:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎙️ TALKING TO VP                                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                             │
│ Sarah: "Hey, I'm about 10 minutes out from Rogue Cannabis. │
│         What do I need to know?"                           │
│                                                             │
│ VP: "Rogue Cannabis—this one needs some attention. Their   │
│      health score dropped from 71 to 58 over the past two  │
│      months. Order value is down 30%.                      │
│                                                             │
│      Looking at the product breakdown, their Cartridge     │
│      orders fell off completely—they used to order 20      │
│      units a month, now zero. But their Flower orders      │
│      are actually up 15%.                                  │
│                                                             │
│      Last visit note from November says the buyer, James,  │
│      mentioned they're 'simplifying their cart selection.' │
│      Might be worth asking what happened there—did they    │
│      switch to a competitor or just exit the category?     │
│                                                             │
│      Also, they haven't tried our Concentrates yet.        │
│      That could be a $400/month opportunity based on       │
│      similar stores in the area."                          │
│                                                             │
│ Sarah: "Got it. What's James like? I haven't met him."     │
│                                                             │
│ VP: "James took over as buyer in September—he replaced     │
│      Maria who you worked with before. Note from your      │
│      October visit says he's 'numbers-focused, wants to    │
│      see velocity data before trying new SKUs.' Different  │
│      style than Maria who went more on gut feel.           │
│                                                             │
│      Oh, and he apparently prefers afternoon visits.       │
│      You're arriving at 2pm so that's good."               │
│                                                             │
│ Sarah: "Perfect. Thanks."                                   │
│                                                             │
│ VP: "Good luck. Let me know how it goes."                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Conversation Capabilities

The VP can discuss:

| Topic | Example Questions |
|-------|-------------------|
| **Account Status** | "How's my relationship with Nectar?" |
| **Performance** | "What's selling best at Mountain High?" |
| **History** | "When did we last visit Ashland Organics?" |
| **Trends** | "Which accounts are declining this month?" |
| **Products** | "What's the margin on our new Indica?" |
| **Competition** | "Where have we lost share to Green Peak?" |
| **Planning** | "What should I prioritize this week?" |
| **Follow-ups** | "What did I promise to bring to Nectar?" |

### Voice Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│ VOICE ARCHITECTURE                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Speech-to-Text:     OpenAI Whisper / Deepgram              │
│ LLM Processing:     Claude / GPT-4 with RAG                │
│ Text-to-Speech:     ElevenLabs / OpenAI TTS                │
│ Real-time Voice:    OpenAI Realtime API / LiveKit          │
│                                                             │
│ Latency Target:     <500ms response time                   │
│ Wake Word:          "Hey VP" or push-to-talk               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Pre-Visit Intelligence Brief

### The Rep Brief

Before every visit, the rep gets a comprehensive one-page brief:

```
┌─────────────────────────────────────────────────────────────┐
│ VISIT BRIEF: Nectar - 510 NW 11th Ave, Portland            │
│ Scheduled: Jan 3, 2026 @ 10:30 AM                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ RELATIONSHIP HEALTH: 72/100 (Healthy)                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ Trending: Stable                     │
│                                                             │
│ JOURNEY STAGE: Established Partner (18 months)             │
│ Last Visit: Dec 15 (Sarah) - "Interested in new Indica"    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ CURRENT STOCK (Our Products at This Location)              │
│                                                             │
│ Product              On Hand    Velocity    Days Left      │
│ Flower 3.5g Indica      24      8/week         21 ✓       │
│ Flower 3.5g Hybrid      6       6/week          7 ⚠       │
│ Pre-Roll 1g             3      12/week          2 🔴       │
│ Cartridge 1g           18       4/week         32 ✓       │
│                                                             │
│ RESTOCK RECOMMENDATION: Pre-Rolls (urgent), Hybrid Flower  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ORDER HISTORY                                               │
│                                                             │
│ Last 3 Orders:                                              │
│ • Dec 28: $1,240 (Flower, Pre-Rolls)                       │
│ • Dec 14: $890 (Flower only)                               │
│ • Nov 30: $1,680 (Full restock)                            │
│                                                             │
│ Avg Order: $1,270 | Frequency: Every 2 weeks               │
│ YTD Total: $31,400 | Rank: #12 of 47 in territory         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ OPPORTUNITIES                                               │
│                                                             │
│ • They don't carry our Edibles - $2,400/mo potential      │
│ • Competitor "Green Peak" has 3 SKUs here                  │
│ • Their Indica sells 2x faster than Hybrid                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ NOTES & CONTEXT                                             │
│                                                             │
│ Buyer: Mike (works Tue-Sat, prefers morning visits)        │
│ Decision Maker: Owner Lisa (in-store Wednesdays)           │
│ Pain Points: Had stock-out issue in October (we fixed)     │
│ Wins: They featured us in their 4/20 promo                 │
│                                                             │
│ Last Visit Notes (Dec 15):                                  │
│ "Mike mentioned they're expanding to a second location     │
│  in NE Portland. Opening Feb 2026. Get on their radar."   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SUGGESTED TALKING POINTS                                    │
│                                                             │
│ 1. Pre-Roll restock - they're almost out                   │
│ 2. Ask about the new NE location timeline                  │
│ 3. Intro our new Indica strain (matches their sales data)  │
│ 4. Offer Edibles sample pack (gap opportunity)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Brief Components

1. **Relationship Summary** - Health score, trend, journey stage
2. **Stock Status** - What they have, velocity, days until stockout
3. **Order History** - Recent orders, trends, YTD value
4. **Opportunities** - Gaps, competitor presence, growth potential
5. **Notes & Context** - Key contacts, preferences, history
6. **Talking Points** - AI-generated suggestions for this visit

---

## AI Chat Companion

### Pre-Visit Conversation

Reps can chat with AI to prepare for visits:

```
┌─────────────────────────────────────────────────────────────┐
│ 💬 Prepare for Visit: Nectar Portland                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Rep: "What should I know before this visit?"               │
│                                                             │
│ AI: "Three things to focus on:                             │
│                                                             │
│ 1. URGENT: They have only 3 Pre-Rolls left and sell 12/   │
│    week. Bring extra stock or they'll run out by Friday.  │
│                                                             │
│ 2. OPPORTUNITY: Mike mentioned interest in our new Indica  │
│    last visit. Their Indica sales are 2x their Hybrid.    │
│    Bring samples of the new strain.                        │
│                                                             │
│ 3. RELATIONSHIP: They're opening a second location in     │
│    February. This is your chance to be their supplier     │
│    from day one. Ask about their timeline and needs."     │
│                                                             │
│ Rep: "What's their payment history like?"                  │
│                                                             │
│ AI: "Excellent. They pay within terms (Net 15) every time.│
│ No late payments in 18 months. They're one of your most   │
│ reliable accounts."                                        │
│                                                             │
│ Rep: "Any issues I should be aware of?"                    │
│                                                             │
│ AI: "One thing: In October, we had a stock-out on their   │
│ order—took 5 extra days to fulfill. Mike was              │
│ understanding but mentioned it. We've been on-time since. │
│ Might be worth acknowledging we've improved."             │
│                                                             │
│ [Type your question...]                          [Send]    │
└─────────────────────────────────────────────────────────────┘
```

### Chat Capabilities

- Answer questions about retailer history
- Suggest talking points and approaches
- Surface relevant data on demand
- Role-play difficult conversations
- Generate follow-up email drafts
- Summarize competitive intelligence

---

## Audio Brief (Podcast-Style)

### On-the-Road Preparation

Generate audio briefs reps can listen to while driving:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎧 AUDIO BRIEF: Today's Route - Southern Oregon            │
│                                                             │
│ Duration: 12 minutes                                        │
│ Generated: Jan 3, 2026 @ 6:15 AM                           │
│                                                             │
│ [▶️ Play] [⏸️ Pause] [⏭️ Skip to Next Stop]                │
│                                                             │
│ ━━━━━━━━━━●━━━━━━━━━━━━━━━━━━ 3:24 / 12:00                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ CHAPTERS                                                    │
│                                                             │
│ 0:00  Today's Overview (6 stops, 89 miles)                 │
│ 1:30  Stop 1: Nectar Medford - Pre-roll restock urgency    │
│ 3:15  Stop 2: Green Valley - Relationship repair needed    │
│ 5:00  Stop 3: Rogue Cannabis - Growth opportunity          │
│ 6:45  Stop 4: Ashland Organics - New buyer introduction    │
│ 8:30  Stop 5: Mountain High - Standard restock             │
│ 10:15 Stop 6: Grants Pass Dispensary - Competitor threat   │
│ 11:30 Key Themes & Priorities for Today                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Audio Content

AI-generated spoken brief covering:

1. **Route Overview** - Stops, timing, total value
2. **Per-Stop Briefing** - 60-90 seconds each
   - Relationship health and recent history
   - Stock situation and recommendations
   - Key talking points
   - Watch-outs or opportunities
3. **Daily Themes** - Patterns across visits (e.g., "3 accounts need Indica restock")
4. **Motivational Close** - Total potential value, goals for the day

### Voice Options

- Professional narrator voice
- Conversational/casual tone
- Text-to-speech via ElevenLabs, OpenAI TTS, or similar

---

## Retailer Journey Tracking

### Journey Stages

Track where each retailer is in their relationship with you:

```
PROSPECT → FIRST ORDER → TRIAL → GROWING → ESTABLISHED → CHAMPION
    │           │          │        │           │            │
    │           │          │        │           │            └─ Advocates for you
    │           │          │        │           └─ Consistent partner
    │           │          │        └─ Increasing orders
    │           │          └─ Evaluating your products
    │           └─ Just placed first order
    └─ Not yet a customer
```

### Journey Stage Definitions

| Stage | Criteria | Rep Focus |
|-------|----------|-----------|
| **Prospect** | In OLCC database, never ordered | Outreach, sampling, intro meeting |
| **First Order** | 1 order placed | Ensure great first experience |
| **Trial** | 2-3 orders, <3 months | Build trust, expand SKUs |
| **Growing** | Order value increasing MoM | Nurture growth, protect relationship |
| **Established** | 6+ months, stable orders | Maintain, look for expansion |
| **Champion** | Recommends you to others | Leverage for referrals, case studies |

### Journey Metrics

- Days in current stage
- Velocity through stages (fast vs slow)
- Stage regression alerts (moving backward)
- Cohort analysis (Q1 prospects vs Q2, etc.)

### Journey Visualization

```
Your Territory Journey Distribution:

CHAMPION     ████ 4 retailers
ESTABLISHED  ████████████████ 16 retailers  
GROWING      ████████████ 12 retailers
TRIAL        ████████ 8 retailers
FIRST ORDER  ████ 4 retailers
PROSPECT     ██████ 6 retailers (not yet customers)
             ─────────────────────────────────────
             47 total retailers in territory
```

---

## Core Features

### 1. Packlist Generation

Generate delivery manifests based on pending orders:

```
┌─────────────────────────────────────────────────────────────┐
│ PACKLIST - Route #12 - Jan 3, 2026                         │
├─────────────────────────────────────────────────────────────┤
│ Stop 1: Nectar (510 NW 11th Ave, Portland)                 │
│   □ 24x Flower 3.5g (Indica)     □ 12x Pre-Roll 1g         │
│   □ 6x Cartridge 1g              Total Units: 42           │
├─────────────────────────────────────────────────────────────┤
│ Stop 2: Smooth Roots (3005 SW Multnomah Blvd, Portland)    │
│   □ 18x Flower 3.5g (Hybrid)     □ 8x Edibles 100mg        │
│   Total Units: 26                                           │
└─────────────────────────────────────────────────────────────┘
```

**Packlist Fields:**
- Retailer name and address
- Products by category/type
- Unit counts and wholesale value
- Special handling notes
- Delivery window/promise

### 2. Route Optimization

Minimize total drive time and fuel costs using route optimization:

**Algorithm Approach:**
1. **Cluster stops by region** - Group deliveries by county/area
2. **Traveling Salesman Problem (TSP)** - Optimize stop order within cluster
3. **Time windows** - Respect retailer receiving hours
4. **Vehicle capacity** - Don't exceed weight/unit limits per run

**Optimization Goals:**
- Minimize total drive time
- Minimize miles driven
- Maximize deliveries per route
- Respect delivery promises

### 3. Map Visualization

Interactive map showing:
- Retailer locations (all 771 OLCC-licensed)
- Current customers (highlighted)
- Planned delivery routes
- Driver real-time position (future)

**Recommended Mapping Library: Leaflet.js**

Why Leaflet over Google Maps:
- Free and open source (no API costs)
- Works with OpenStreetMap tiles (free)
- Lightweight (~42KB)
- Good React integration via `react-leaflet`
- No usage limits or billing concerns

Alternative: **MapLibre GL JS** (Ukrainian-founded, open source)
- Vector tiles for smoother zooming
- Better performance for large datasets
- Free alternative to Mapbox GL JS

### 4. Priority & Urgency System

Visual indicators for delivery urgency:

| Priority | Criteria | Visual |
|----------|----------|--------|
| **URGENT** | Promise due today, low stock alert | Red badge, top of list |
| **HIGH** | Promise due tomorrow, large order | Orange badge |
| **NORMAL** | Scheduled delivery within SLA | No badge |
| **LOW** | Flexible delivery window | Gray text |

**Auto-Priority Rules:**
- Orders past promise date → URGENT
- Orders due within 24 hours → HIGH
- Retailers with 3+ unfulfilled orders → Escalate priority
- First-time customers → Bump to HIGH (relationship building)

### 5. Re-routing Logic

Dynamic route adjustment when conditions change:

**Triggers for Re-route:**
- New urgent order added
- Vehicle breakdown/delay
- Retailer closed unexpectedly
- Traffic conditions (future)

**Re-route Algorithm:**
1. Remove affected stop from current route
2. Re-insert at optimal position OR defer to next route
3. Notify driver of route change
4. Update ETAs for remaining stops

---

## UI Components

### DeliveryTab.jsx Structure

```
DeliveryTab
├── DeliveryHeader
│   ├── Date selector
│   ├── Driver filter
│   └── "Optimize Routes" button
├── DeliveryMap
│   ├── Leaflet map component
│   ├── Retailer markers (color-coded by priority)
│   ├── Route polylines
│   └── Click-to-select interaction
├── RouteList
│   ├── Route cards (collapsible)
│   │   ├── Summary: stops, miles, time, value
│   │   ├── Stop list with ETAs
│   │   └── Packlist preview
│   └── Unassigned orders section
└── DeliverySidebar
    ├── Selected retailer details
    ├── Order history
    └── Quick actions (Add to route, Mark urgent)
```

### Map Interaction

- **Click retailer marker** → Show popup with name, address, pending orders
- **Click "Add to Route"** → Append to selected route, re-optimize
- **Drag stop in list** → Manual reorder, recalculate times
- **Draw region** → Select multiple retailers for bulk route creation

---

## Implementation Phases

### Phase 1: Static Map with Retailer Locations
- Parse OLCC CSV and geocode addresses
- Display all retailers on Leaflet map
- Color-code by county or license type
- Click for retailer details

### Phase 2: Manual Route Creation
- Select retailers to add to route
- Display route polyline on map
- Calculate total distance/time (using OSRM or similar)
- Generate printable packlist

### Phase 3: Auto-Optimization
- Implement TSP solver (e.g., `tsp-js` library)
- Add time window constraints
- Optimize button for automatic ordering
- Compare manual vs optimized routes

### Phase 4: Priority & Urgency
- Connect to order/promise data
- Auto-calculate priority levels
- Urgent delivery alerts
- Re-routing on priority changes

### Phase 5: Live Operations
- Real-time driver tracking
- Delivery confirmation workflow
- Exception handling (returns, refused)
- Performance analytics (on-time %, route efficiency)

---

## Technical Dependencies

### NPM Packages
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@turf/turf": "^6.5.0",
  "papaparse": "^5.4.1"
}
```

### External Services (Optional)
- **OSRM** (Open Source Routing Machine) - Free self-hosted routing
- **OpenRouteService** - Free API with generous limits
- **Nominatim** - Free geocoding from OpenStreetMap

### Data Processing
- Geocode OLCC addresses → lat/lng coordinates
- Cache geocoded results to avoid repeated lookups
- Pre-calculate distance matrix for Oregon retailers

---

## Promise Fulfillment Rules

The system ensures retailer promises are kept:

1. **Visibility** - All pending promises shown on dashboard
2. **Alerts** - Proactive warning when promise at risk
3. **Prioritization** - At-risk deliveries automatically elevated
4. **Accountability** - Track promise vs actual delivery dates
5. **Recovery** - When late, flag for relationship repair

**Promise Tracking Fields:**
- `promisedDate` - When we told retailer to expect delivery
- `actualDate` - When delivery occurred
- `onTime` - Boolean (actual <= promised)
- `daysVariance` - Days early (negative) or late (positive)

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| On-time delivery rate | >95% | Actual vs promised date |
| Route efficiency | >85% | Actual miles vs optimal |
| Deliveries per route | 8-12 stops | Average stops per driver run |
| Drive time per delivery | <25 min | Total route time / stops |
| Promise visibility | 100% | All promises tracked in system |

---

## Sample User Flows

### Flow 1: Rep Morning Preparation
1. Sarah (Southern Oregon rep) opens Delivery tab at 6 AM
2. Sees today's route: 6 stops, 89 miles, ~5.5 hours
3. Clicks "Generate Audio Brief" → Listens while getting ready
4. Notices Stop 3 (Rogue Cannabis) flagged "Needs Attention"
5. Opens chat: "What's going on with Rogue Cannabis?"
6. AI explains: Order value down 30%, competitor gained shelf space
7. Sarah adds talking points to her notes, loads truck

### Flow 2: Pre-Visit Deep Dive
1. Sarah arrives 10 min early at Nectar Medford
2. Opens Visit Brief on phone
3. Reviews: Health 72/100, Pre-Rolls critically low, Mike prefers mornings
4. Checks notes: "Interested in new Indica, expanding to NE Portland"
5. Chats with AI: "What's our new Indica's THC content and price?"
6. AI provides product specs instantly
7. Sarah walks in prepared, mentions NE expansion, closes a larger order

### Flow 3: At-Risk Account Recovery
1. Manager reviews territory health dashboard
2. Sees 3 accounts moved from "Healthy" to "Needs Attention" this week
3. Drills into one: Ashland Organics
4. Journey shows regression: Established → now Needs Attention
5. Notes reveal: Competitor offered 5% better margin
6. Manager schedules call with Sarah to plan win-back strategy
7. Creates task: "Visit Ashland with new pricing proposal"

### Flow 4: New Rep Onboarding
1. New rep Jake joins, assigned to Willamette Valley
2. System generates "Territory Handoff Brief" - audio overview of all 52 accounts
3. For each account: relationship history, key contacts, product preferences
4. Jake listens to 45-minute brief during first day driving territory
5. Before each visit, uses chat: "Quick summary of this account?"
6. AI provides instant context even though Jake has no personal history
7. Retailers impressed Jake "already knows" their business

### Flow 5: Route Optimization with Priorities
1. System generates tomorrow's routes overnight
2. Flags: 2 urgent restocks, 1 at-risk relationship needing visit
3. Urgent stops auto-placed first in route
4. At-risk account inserted even though no pending order
5. Rep sees note: "Relationship visit - bring samples, no hard sell"
6. Route optimized around priority stops, not just geography

### Flow 6: Post-Visit Notes & Learning
1. Sarah completes visit to Nectar Medford
2. Opens app, taps "Log Visit"
3. Voice-to-text: "Mike loved the new Indica, ordering 24 units. Asked about edibles again - send samples next week. NE location opening pushed to March."
4. System auto-updates:
   - Journey stage: remains "Established"
   - Health score: +3 points (order placed)
   - Notes: Adds NE Portland update
   - Tasks: Creates "Send edible samples to Nectar"
5. Next rep visiting sees all context

### Flow 7: Podcast Brief Generation
1. Manager clicks "Generate Weekly Territory Podcast"
2. System creates 20-minute audio covering:
   - Territory performance vs goals
   - Accounts to celebrate (new Champion!)
   - Accounts needing attention
   - Competitive intel from the week
   - Upcoming opportunities
3. All reps listen during Monday morning drive
4. Team aligned before weekly standup

---

## Integration Points

### Existing Tabs
- **Forecast Tab** - Predicted demand informs delivery planning
- **Simulate Tab** - Production decisions affect available inventory
- **Partnership Tab** - Promise fulfillment metrics

### Future Systems
- Order management system (inbound orders)
- Inventory management (what's available to ship)
- Driver mobile app (route execution)
- Customer portal (delivery tracking)

---

[← Back to Implementation Roadmap](./05-implementation-roadmap.md)
