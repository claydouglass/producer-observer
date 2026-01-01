export const tabs = [
  { id: "forecast", label: "Forecast" },
  { id: "gaps", label: "Market Gaps" },
  { id: "simulate", label: "Simulate" },
  { id: "partnership", label: "Partnership" },
  { id: "report", label: "Intel Report" },
];

export const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "indica", label: "Indica" },
  { value: "sativa", label: "Sativa" },
  { value: "hybrid", label: "Hybrid" },
];

export const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "flower", label: "Flower" },
  { value: "concentrates", label: "Concentrates" },
  { value: "cartridges", label: "Cartridges" },
  { value: "prerolls", label: "Pre-Rolls" },
];

export const kpiData = [
  { label: "Rank", value: "#10", sub: "of 175 brands", delta: "+3" },
  {
    label: "Market Share",
    value: "2.78%",
    sub: "of store revenue",
    delta: "+0.4%",
  },
  { label: "Customers", value: "190", sub: "unique buyers", delta: "+8%" },
  { label: "LTV Index", value: "2.0×", sub: "vs store average", delta: "+12%" },
];

export const typeBreakdown = [
  { name: "Indica", pct: 35, trend: -18, color: "#6366f1", alert: true },
  { name: "Sativa", pct: 40, trend: 12, color: "#10b981" },
  { name: "Hybrid", pct: 25, trend: 8, color: "#f59e0b" },
];

export const categoryBreakdown = [
  { id: "flower", name: "Flower", pct: 31, delta: -12, color: "#10b981" },
  {
    id: "concentrates",
    name: "Concentrates",
    pct: 29,
    delta: 45,
    color: "#8b5cf6",
  },
  {
    id: "cartridges",
    name: "Cartridges",
    pct: 27,
    delta: 38,
    color: "#f59e0b",
  },
  { id: "prerolls", name: "Pre-Rolls", pct: 13, delta: 5, color: "#ec4899" },
];

export const partnershipMetrics = [
  { label: "Fill rate", value: "94.2%", target: "95%", status: "warning" },
  { label: "Forecast accuracy", value: "87.1%", target: "85%", status: "good" },
  { label: "Response time", value: "4.2h", target: "<6h", status: "good" },
  {
    label: "Mutual growth",
    value: "+23%",
    target: "+15%",
    status: "excellent",
  },
];

export const ourPromises = [
  "Share demand signals in real-time",
  "Live forecast updates as data changes",
  "Immediate stockout risk alerts",
  "Transparent performance data",
];

export const theirPromises = [
  "Maintain consistent supply levels",
  "Advance notice on product changes",
  "Share inventory visibility",
  "Responsive communication",
];

export const simulateDecisions = [
  {
    key: "indicaSupply",
    label: "Consistent Indica Supply",
    desc: "Restore Indica to recover #2-3 position",
    impact: "Baseline",
    impactNeg: "-30%",
  },
  {
    key: "launch510LR",
    label: "Launch 510 Thread LR",
    desc: "Enter highest-volume cartridge segment",
    impact: "+$3,000",
  },
  {
    key: "launchGummies",
    label: "Launch Gummies Line",
    desc: "Enter #2 category where customers shop",
    impact: "+$2,500",
  },
  {
    key: "launch1ozDeal",
    label: "Create 1oz Flower Deal",
    desc: "Fill gap with one competitor",
    impact: "+$1,500",
  },
  {
    key: "expandConcentrates",
    label: "Expand Concentrates",
    desc: "Add Live Resin and Cured Resin",
    impact: "+$1,000",
  },
];
