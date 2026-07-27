const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvPath = path.join(__dirname, '../data/products.csv');
const jsonPath = path.join(__dirname, '../data/products-data.json');

if (!fs.existsSync(csvPath)) {
  console.log('No products.csv found, skipping.');
  process.exit(0);
}

const csvContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    const rawData = results.data;
    const now = new Date();

    const processed = rawData.map(item => {
      // Parse cost
      let costStr = item['Product Price'] || 'US $0.00';
      costStr = costStr.replace('US $', '').replace(',', '');
      let cost = parseFloat(costStr);
      if (isNaN(cost)) cost = 0;

      // Parse original price just in case
      let originalStr = item['Product Original Price'] || 'US $0.00';
      originalStr = originalStr.replace('US $', '').replace(',', '');
      let originalPrice = parseFloat(originalStr);
      if (isNaN(originalPrice)) originalPrice = cost;

      // Apply logic
      let price = cost;
      if (cost < 5) {
        price = cost * 2.3;
      } else if (cost <= 10) {
        price = cost * 1.9;
      } else {
        price = cost * 1.6;
      }
      price = Number(price.toFixed(2));

      // Category logic
      const title = (item['Product Title'] || '').toLowerCase();
      let category = 'Individuals';

      if (title.includes('blue')) {
        category = 'Blue';
      } else if (title.includes('pink')) {
        category = 'Pink';
      } else if (title.includes('red') || title.includes('strawberry') || title.includes('watermelon') || title.includes('cherry') || title.includes('apple')) {
        category = 'Red';
      } else if (title.includes('yellow') || title.includes('banana') || title.includes('lemon') || title.includes('cheese') || title.includes('mango') || title.includes('chick') || title.includes('butter') || title.includes('durian')) {
        category = 'Yellow';
      } else if (title.includes('purple')) {
        category = 'Purple';
      } else if (title.includes('green') || title.includes('matcha') || title.includes('pickle') || title.includes('avocado')) {
        category = 'Green';
      } else if (title.includes('white') || title.includes('ice') || title.includes('milk') || title.includes('toast') || title.includes('bread') || title.includes('dumpling') || title.includes('bao')) {
        category = 'White';
      } else if (title.includes('multicolor') || title.includes('colorful') || title.includes('color-changing') || title.includes('swirl') || title.includes('rainbow') || title.includes('glitter') || title.includes('aurora')) {
        category = 'Multicolor';
      } else if (title.includes('bundle') || title.includes('2pcs') || title.includes('3pcs') || title.includes('4pcs') || title.includes('5pcs') || title.includes('6pcs') || title.includes('10pcs') || title.includes('pack') || title.includes('set') || title.includes('pcs') || title.includes('blind box') || title.includes('mystery box') || title.includes('kit')) {
        category = 'Bundles';
      }

      // Image fallback
      let image = item['Product Image'];
      try {
        new URL(image);
      } catch (e) {
        image = 'https://picsum.photos/400/400';
      }

      // Sold count (raw cumulative count from listing)
      const soldCountRaw = item['Sold Count'];
      let soldCount = null;
      if (soldCountRaw && soldCountRaw !== 'Not Available') {
        const parsed = parseFloat(soldCountRaw.replace(/,/g, ''));
        if (!isNaN(parsed)) soldCount = parsed;
      }

      // Launch date
      const launchTimeRaw = item['Launch Time'];
      let launchDate = null;
      let daysSinceLaunch = null;
      if (launchTimeRaw) {
        const parsedDate = new Date(launchTimeRaw);
        if (!isNaN(parsedDate.getTime())) {
          launchDate = parsedDate.toISOString();
          daysSinceLaunch = Math.max(1, (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
        }
      }

      // Estimated units sold in the last 30 days
      // (cumulative sold count / days since launch) * 30 — a rate-based estimate,
      // not exact day-by-day sales data, since the CSV only has cumulative totals.
      let salesLast30 = null;
      if (soldCount !== null && daysSinceLaunch !== null) {
        salesLast30 = Math.round((soldCount / daysSinceLaunch) * 30);
      }

      return {
        id: item['id'],
        title: item['Product Title'],
        originalPrice,
        cost,
        price,
        url: item['Product URL'],
        image,
        category,
        salesLast30,
        launchDate
      };
    });

    fs.writeFileSync(jsonPath, JSON.stringify(processed, null, 2));
    console.log(`Processed ${processed.length} products to products-data.json`);
  }
});