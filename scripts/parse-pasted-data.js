const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/Edward/.gemini/antigravity/brain/475e89c6-5713-4933-9953-b2eb2ed8d1c4/.system_generated/logs/transcript_full.jsonl';
const csvOutputPath = path.join(__dirname, '../data/products.csv');
const jsonOutputPath = path.join(__dirname, '../data/products.json');

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

let pastedText = '';

for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i].trim()) continue;
  try {
    const obj = JSON.parse(lines[i]);
    if (obj.type === 'USER_INPUT' || obj.source === 'USER_EXPLICIT') {
      const text = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
      if (text.includes('aliexpress.com/item/')) {
        pastedText = text;
        break;
      }
    }
  } catch (e) {}
}

if (!pastedText) {
  console.error('Could not find pasted products in transcript');
  process.exit(1);
}

// Split into rows
const rows = pastedText.split('\n');
const processedProducts = [];

const headers = [
  "id","Product Title","Product Price","Product Original Price","Product Discount",
  "Product URL","Product Image","Product Rating","Store Name","Store URL",
  "Store ID","Total Sales","Ship From","Store Member ID","Trade Info",
  "Sold Count","Shipping","Launch Time","Company Name"
];

const csvRows = [headers.map(h => `"${h}"`).join(',')];

rows.forEach((row, idx) => {
  const parts = row.split('\t').map(p => p.trim());
  if (parts.length < 5) return;
  
  let rawId = parts[0];
  let title = parts[1] || '';
  let costStr = parts[2] || '0';
  let origPriceStr = parts[3] || '0';
  let discountStr = parts[4] || '';
  let url = parts[5] || '';
  let image = parts[6] || '';
  let rating = parts[7] || '4.9';
  let storeName = parts[8] || 'Not Available';
  let storeUrl = parts[9] || 'Not Available';
  let storeId = parts[10] || 'Not Available';
  let totalSales = parts[11] || 'Not Available';
  let shipFrom = parts[12] || 'US';
  let storeMemberId = parts[13] || 'Not Available';
  let tradeInfo = parts[14] || '';
  let soldCount = parts[15] || '';
  let shipping = parts[16] || 'Free';
  let launchTime = parts[17] || '';
  let companyName = parts[18] || 'Not Available';

  // Fix ID from URL if exponent or weird
  if ((!rawId || rawId.includes('E+') || rawId.length < 10) && url) {
    const match = url.match(/item\/(\d+)\.html/);
    if (match) {
      rawId = match[1];
    }
  }

  // Parse costs
  let costNum = parseFloat(costStr.replace(/US\s*\$/i, '').replace(/,/g, ''));
  if (isNaN(costNum)) costNum = 0;

  let origNum = parseFloat(origPriceStr.replace(/US\s*\$/i, '').replace(/,/g, ''));
  if (isNaN(origNum)) origNum = costNum;

  // Apply markup
  let price = costNum;
  if (costNum < 5) {
    price = costNum * 2.3;
  } else if (costNum <= 10) {
    price = costNum * 1.9;
  } else {
    price = costNum * 1.6;
  }
  price = Number(price.toFixed(2));

  // Determine category
  const titleLower = title.toLowerCase();
  let category = 'Individuals';

  if (titleLower.includes('blue')) {
    category = 'Blue';
  } else if (titleLower.includes('pink')) {
    category = 'Pink';
  } else if (titleLower.includes('red') || titleLower.includes('strawberry') || titleLower.includes('watermelon') || titleLower.includes('cherry') || titleLower.includes('apple')) {
    category = 'Red';
  } else if (titleLower.includes('yellow') || titleLower.includes('banana') || titleLower.includes('lemon') || titleLower.includes('cheese') || titleLower.includes('mango') || titleLower.includes('chick') || titleLower.includes('butter') || titleLower.includes('durian')) {
    category = 'Yellow';
  } else if (titleLower.includes('purple')) {
    category = 'Purple';
  } else if (titleLower.includes('green') || titleLower.includes('matcha') || titleLower.includes('pickle') || titleLower.includes('avocado')) {
    category = 'Green';
  } else if (titleLower.includes('white') || titleLower.includes('ice') || titleLower.includes('milk') || titleLower.includes('toast') || titleLower.includes('bread') || titleLower.includes('dumpling') || titleLower.includes('bao')) {
    category = 'White';
  } else if (titleLower.includes('multicolor') || titleLower.includes('colorful') || titleLower.includes('color-changing') || titleLower.includes('swirl') || titleLower.includes('rainbow') || titleLower.includes('glitter') || titleLower.includes('aurora')) {
    category = 'Multicolor';
  } else if (titleLower.includes('bundle') || titleLower.includes('2pcs') || titleLower.includes('3pcs') || titleLower.includes('4pcs') || titleLower.includes('5pcs') || titleLower.includes('6pcs') || titleLower.includes('10pcs') || titleLower.includes('20pack') || titleLower.includes('80 pack') || titleLower.includes('100 pack') || titleLower.includes('pack') || titleLower.includes('set') || titleLower.includes('pcs') || titleLower.includes('blind box') || titleLower.includes('mystery box') || titleLower.includes('kit')) {
    category = 'Bundles';
  }

  if (rawId && title) {
    processedProducts.push({
      id: String(rawId),
      title,
      originalPrice: origNum,
      cost: costNum,
      price,
      url,
      image,
      category
    });

    const csvRow = [
      rawId, title, costStr, origPriceStr, discountStr,
      url, image, rating, storeName, storeUrl,
      storeId, totalSales, shipFrom, storeMemberId, tradeInfo,
      soldCount, shipping, launchTime, companyName
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    
    csvRows.push(csvRow);
  }
});

// Remove duplicates by ID
const uniqueProducts = [];
const seenIds = new Set();
for (const p of processedProducts) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    uniqueProducts.push(p);
  }
}

fs.writeFileSync(jsonOutputPath, JSON.stringify(uniqueProducts, null, 2));
fs.writeFileSync(csvOutputPath, csvRows.join('\n'));

console.log(`Successfully processed ${uniqueProducts.length} unique products into products.json and products.csv!`);
