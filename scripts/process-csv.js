const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvPath = path.join(__dirname, '../data/products.csv');
const jsonPath = path.join(__dirname, '../data/products.json');

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
      
      if (title.includes('bundle') || title.includes('2pcs') || title.includes('3pcs') || title.includes('pack') || title.includes('set') || title.includes('pcs')) {
        category = 'Bundles';
      } else if (title.includes('blue')) {
        category = 'Blue';
      } else if (title.includes('pink')) {
        category = 'Pink';
      } else if (title.includes('red')) {
        category = 'Red';
      } else if (title.includes('yellow')) {
        category = 'Yellow';
      } else if (title.includes('purple')) {
        category = 'Purple';
      } else if (title.includes('green')) {
        category = 'Green';
      } else if (title.includes('multicolor') || title.includes('colorful') || title.includes('color-changing') || title.includes('swirl') || title.includes('rainbow')) {
        category = 'Multicolor';
      }

      return {
        id: item['id'],
        title: item['Product Title'],
        originalPrice,
        cost,
        price,
        url: item['Product URL'],
        image: item['Product Image'],
        category
      };
    });

    fs.writeFileSync(jsonPath, JSON.stringify(processed, null, 2));
    console.log(`Processed ${processed.length} products to products.json`);
  }
});
