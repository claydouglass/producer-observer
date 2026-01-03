const fs = require("fs");

// Parse CSV handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Read CSV
const csv = fs.readFileSync(
  "src/data/Sold Items Miracle Greens Bend 2025-05-01 2025-12-30.csv",
  "utf8",
);
const lines = csv.split("\n").filter((l) => l.trim());
const header = parseCSVLine(lines[0]);

// Find column indices
const cols = {
  brand: header.indexOf("Brand"),
  category: header.indexOf("Category"),
  cost: header.indexOf("Cost"),
  date: header.indexOf("Completed At"),
  customer: header.indexOf("Customer ID"),
  receipt: header.indexOf("Receipt ID"),
  species: header.indexOf("Strain Species"),
  supplier: header.indexOf("Supplier Name"),
  revenue: header.indexOf("Post-Discount, Pre-Tax Total"),
  product: header.indexOf("Product"),
  productType: header.indexOf("Product Type"),
  quantity: header.indexOf("Quantity Sold"),
  weightVolume: header.indexOf("Weight / Volume"),
  unitOfMeasure: header.indexOf("Unit of Measure"),
};

console.log(
  "Weight/Volume col:",
  cols.weightVolume,
  "Unit of Measure col:",
  cols.unitOfMeasure,
);

console.log("Processing", lines.length - 1, "rows...");

// Aggregate by brand
const brands = {};

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  const brand = row[cols.brand];
  if (!brand) continue;

  const cost =
    parseFloat(row[cols.cost]?.replace("$", "").replace(",", "")) || 0;
  const revenue =
    parseFloat(row[cols.revenue]?.replace("$", "").replace(",", "")) || 0;
  const category = row[cols.category] || "Other";
  const species = row[cols.species] || "";
  const supplier = row[cols.supplier] || "";
  const customer = row[cols.customer] || "";
  const receipt = row[cols.receipt] || "";
  const product = row[cols.product] || "";
  const quantity = parseFloat(row[cols.quantity]) || 0;
  const weightVolume = row[cols.weightVolume] || ""; // e.g. "Grams"
  const unitOfMeasure = parseFloat(row[cols.unitOfMeasure]) || 0; // e.g. 1.00, 3.5

  // Parse date for month and full date (MM/DD/YYYY format)
  const dateStr = row[cols.date] || "";
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const monthNum = match ? parseInt(match[1]) : null;
  const day = match ? match[2] : null;
  const year = match ? match[3] : null;
  const fullDate = match ? `${year}-${match[1]}-${day}` : null; // YYYY-MM-DD format
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNum ? monthNames[monthNum - 1] : null;

  // Normalize species to type
  let type = null;
  if (species) {
    const s = species.toLowerCase();
    if (s.includes("indica") && (s.includes("dom") || s.includes("hybrid"))) {
      type = "Indica-dom";
    } else if (s.includes("indica")) {
      type = "Indica";
    } else if (
      s.includes("sativa") &&
      (s.includes("dom") || s.includes("hybrid"))
    ) {
      type = "Sativa-dom";
    } else if (s.includes("sativa")) {
      type = "Sativa";
    } else if (
      s.includes("hybrid") ||
      s.includes("50/50") ||
      s.includes("50-50")
    ) {
      type = "50/50";
    }
  }

  if (!brands[brand]) {
    brands[brand] = {
      name: brand,
      revenue: 0,
      wholesale: 0,
      units: 0,
      transactions: new Set(),
      customers: new Set(),
      suppliers: new Set(),
      byMonth: {},
      byCategory: {},
      byType: {},
      wholesaleByMonth: {},
      wholesaleByCategory: {},
      wholesaleByType: {},
      // Daily granularity for flexible timeframe filtering
      byDate: {}, // { "2024-12-01": { wholesale, units, revenue } }
      categoryByDate: {}, // { "Flower": { "2024-12-01": { wholesale, units, weight, weightUnit } } }
      typeByDate: {}, // { "Indica": { "2024-12-01": wholesale } }
      // Weight tracking by category
      weightByCategory: {}, // { "Flower": { weight: 1000, unit: "Grams" } }
      products: {},
    };
  }

  const b = brands[brand];
  b.revenue += revenue;
  b.wholesale += cost;
  b.units += quantity;
  if (receipt) b.transactions.add(receipt);
  if (customer) b.customers.add(customer);
  if (supplier) b.suppliers.add(supplier);

  if (month) {
    b.byMonth[month] = (b.byMonth[month] || 0) + revenue;
    b.wholesaleByMonth[month] = (b.wholesaleByMonth[month] || 0) + cost;
  }

  // Daily aggregation
  if (fullDate) {
    if (!b.byDate[fullDate]) {
      b.byDate[fullDate] = { wholesale: 0, units: 0, revenue: 0 };
    }
    b.byDate[fullDate].wholesale += cost;
    b.byDate[fullDate].units += quantity;
    b.byDate[fullDate].revenue += revenue;
  }

  b.byCategory[category] = (b.byCategory[category] || 0) + revenue;
  b.wholesaleByCategory[category] =
    (b.wholesaleByCategory[category] || 0) + cost;

  // Weight by category
  if (weightVolume && unitOfMeasure > 0) {
    if (!b.weightByCategory[category]) {
      b.weightByCategory[category] = { weight: 0, unit: weightVolume };
    }
    b.weightByCategory[category].weight += unitOfMeasure;
  }

  // Category by date
  if (fullDate) {
    if (!b.categoryByDate[category]) b.categoryByDate[category] = {};
    if (!b.categoryByDate[category][fullDate]) {
      b.categoryByDate[category][fullDate] = {
        wholesale: 0,
        units: 0,
        weight: 0,
        weightUnit: weightVolume || null,
      };
    }
    b.categoryByDate[category][fullDate].wholesale += cost;
    if (unitOfMeasure > 0) {
      b.categoryByDate[category][fullDate].weight += unitOfMeasure;
      if (!b.categoryByDate[category][fullDate].weightUnit && weightVolume) {
        b.categoryByDate[category][fullDate].weightUnit = weightVolume;
      }
    }
    b.categoryByDate[category][fullDate].units += quantity;
  }

  if (type) {
    b.byType[type] = (b.byType[type] || 0) + revenue;
    b.wholesaleByType[type] = (b.wholesaleByType[type] || 0) + cost;

    // Type by date
    if (fullDate) {
      if (!b.typeByDate[type]) b.typeByDate[type] = {};
      if (!b.typeByDate[type][fullDate]) {
        b.typeByDate[type][fullDate] = { wholesale: 0, units: 0 };
      }
      b.typeByDate[type][fullDate].wholesale += cost;
      b.typeByDate[type][fullDate].units += quantity;
    }
  }

  // Track products
  if (product) {
    if (!b.products[product]) {
      b.products[product] = {
        name: product,
        category,
        species,
        wholesale: 0,
        units: 0,
        weight: 0,
        weightUnit: weightVolume || null,
        transactions: new Set(),
        byDate: {}, // Daily data for products
      };
    }
    b.products[product].wholesale += cost;
    b.products[product].units += quantity;
    if (unitOfMeasure > 0) {
      b.products[product].weight += unitOfMeasure;
      if (!b.products[product].weightUnit && weightVolume) {
        b.products[product].weightUnit = weightVolume;
      }
    }
    if (receipt) b.products[product].transactions.add(receipt);

    // Product by date
    if (fullDate) {
      if (!b.products[product].byDate[fullDate]) {
        b.products[product].byDate[fullDate] = {
          wholesale: 0,
          units: 0,
          weight: 0,
        };
      }
      b.products[product].byDate[fullDate].wholesale += cost;
      b.products[product].byDate[fullDate].units += quantity;
      if (unitOfMeasure > 0) {
        b.products[product].byDate[fullDate].weight += unitOfMeasure;
      }
    }
  }
}

// Convert to array and sort by wholesale
let brandArray = Object.values(brands)
  .map((b) => ({
    id: `brand-${b.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")}`,
    name: b.name,
    revenue: Math.round(b.revenue * 100) / 100,
    wholesale: Math.round(b.wholesale * 100) / 100,
    units: Math.round(b.units),
    transactions: b.transactions.size,
    customers: b.customers.size,
    distributors: Array.from(b.suppliers),
    byMonth: b.byMonth,
    byCategory: b.byCategory,
    byType: Object.keys(b.byType).length > 0 ? b.byType : undefined,
    wholesaleByMonth: b.wholesaleByMonth,
    wholesaleByCategory: b.wholesaleByCategory,
    wholesaleByType:
      Object.keys(b.wholesaleByType).length > 0 ? b.wholesaleByType : undefined,
    // Daily granularity data
    byDate: b.byDate,
    categoryByDate: b.categoryByDate,
    typeByDate: Object.keys(b.typeByDate).length > 0 ? b.typeByDate : undefined,
    // Weight by category
    weightByCategory:
      Object.keys(b.weightByCategory).length > 0
        ? b.weightByCategory
        : undefined,
    products: Object.values(b.products)
      .map((p) => ({
        name: p.name,
        category: p.category,
        species: p.species || undefined,
        wholesale: Math.round(p.wholesale * 100) / 100,
        units: Math.round(p.units),
        weight: Math.round(p.weight * 100) / 100,
        weightUnit: p.weightUnit || undefined,
        transactions: p.transactions.size,
        byDate: p.byDate, // Daily product data
      }))
      .sort((a, b) => b.wholesale - a.wholesale),
  }))
  .sort((a, b) => b.wholesale - a.wholesale);

// Calculate totals and add rank/marketShare
const totalWholesale = brandArray.reduce((s, b) => s + b.wholesale, 0);
brandArray = brandArray.map((b, i) => ({
  ...b,
  rank: i + 1,
  marketShare: Math.round((b.wholesale / totalWholesale) * 10000) / 100,
}));

console.log("Extracted", brandArray.length, "brands");
console.log("Total wholesale: $" + totalWholesale.toFixed(2));
console.log(
  "Top 10:",
  brandArray
    .slice(0, 10)
    .map((b) => `${b.rank}. ${b.name}: $${b.wholesale}`)
    .join("\n"),
);

// Write output
const output = `// Auto-generated from CSV - ${brandArray.length} brands with wholesale cost data
export const brands = ${JSON.stringify(brandArray, null, 2)};
`;

fs.writeFileSync("src/data/brands.js", output);
console.log("\nWritten to src/data/brands.js");
