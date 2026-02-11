#!/usr/bin/env node

/**
 * Karakoram Alpine Web - Image Download Helper
 *
 * This script helps you download and organize high-quality 4K images
 * for the website from free sources like Unsplash and Pexels.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function print(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function header(text) {
  print('\n' + '='.repeat(60), 'cyan');
  print(text, 'bright');
  print('='.repeat(60), 'cyan');
}

const imagesList = [
  {
    name: 'K2 Mountain (Hero Background)',
    filename: 'hero_sky.jpg',
    description: 'Dramatic K2 summit shot with clear sky',
    sources: [
      'https://unsplash.com/s/photos/k2-mountain',
      'https://www.pexels.com/search/k2%20mountain/',
      'https://www.wallpaperflare.com/search?wallpaper=k2'
    ],
    tips: 'Look for: Wide shot, summit visible, dramatic lighting, minimal clouds'
  },
  {
    name: 'Lady Finger Peak (Who We Are)',
    filename: 'who_we_are.jpg',
    description: 'Sharp, pointed Lady Finger peak from Hunza Valley',
    sources: [
      'https://unsplash.com/s/photos/hunza',
      'https://www.pexels.com/search/hunza%20valley/',
      'https://commons.wikimedia.org/wiki/Category:Hunza_Valley'
    ],
    tips: 'Look for: Distinctive finger/spire shape, Hunza Valley view, golden hour'
  },
  {
    name: 'Passu Cones #1 (Events section)',
    filename: 'passu_1.jpg',
    description: 'Passu Cathedral jagged peaks - frontal view',
    sources: [
      'https://www.pexels.com/search/passu%20cones/',
      'https://commons.wikimedia.org/wiki/Category:Passu_Cones',
      'https://unsplash.com/s/photos/passu'
    ],
    tips: 'Look for: Cathedral-like spires, multiple peaks in row, glacier visible'
  }
];

async function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function showImageLinks() {
  header('📸 STEP 1: DOWNLOAD IMAGES FROM FREE SOURCES');

  print('\nI\'ll show you the best free sources for each image.', 'cyan');
  print('Open these links in your browser and download the highest resolution.\n');

  for (let i = 0; i < imagesList.length; i++) {
    const img = imagesList[i];
    print(`\n${i + 1}. ${img.name}`, 'bright');
    print(`   File needed: ${img.filename}`, 'yellow');
    print(`   Description: ${img.description}`);
    print(`   💡 Tip: ${img.tips}`, 'green');
    print('\n   📥 Download from any of these sources:');

    img.sources.forEach((source, idx) => {
      print(`      ${idx + 1}. ${source}`, 'blue');
    });

    print('\n   → Save as: ' + img.filename, 'cyan');
    print('   ' + '-'.repeat(55));
  }

  print('\n\n🎯 QUICK DOWNLOAD GUIDE:', 'bright');
  print('  1. Click on each link above');
  print('  2. Find the best image (high resolution, good composition)');
  print('  3. Click "Download" or "Download Free"');
  print('  4. Select "Original Size" or highest resolution');
  print('  5. Save to your Downloads folder');
}

async function checkDownloads() {
  header('✅ STEP 2: VERIFY DOWNLOADS');

  const downloadsPath = path.join(require('os').homedir(), 'Downloads');
  print(`\nChecking your Downloads folder: ${downloadsPath}\n`, 'cyan');

  const files = fs.readdirSync(downloadsPath);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (imageFiles.length === 0) {
    print('⚠️  No image files found in Downloads folder.', 'yellow');
    print('Please download the images first, then run this script again.\n');
    return false;
  }

  print(`Found ${imageFiles.length} image(s) in Downloads:\n`, 'green');
  imageFiles.slice(0, 10).forEach((file, idx) => {
    print(`  ${idx + 1}. ${file}`);
  });

  const answer = await question('\n📝 Have you downloaded all required images? (yes/no): ');
  return answer.toLowerCase().startsWith('y');
}

async function optimizeInstructions() {
  header('🔧 STEP 3: OPTIMIZE IMAGES');

  print('\nBefore adding images to your project, optimize them for web:', 'cyan');
  print('\n🌐 Option 1: Online (Recommended - Easiest)');
  print('  1. Go to: https://tinypng.com');
  print('  2. Drag all your downloaded images');
  print('  3. Wait for compression (keeps 4K quality!)');
  print('  4. Click "Download All"');
  print('  5. Extract the ZIP file\n');

  print('💻 Option 2: Using this project (requires sharp package)');
  print('  1. Install: npm install sharp');
  print('  2. Run: node optimize-images.js');
  print('  3. Images will be auto-optimized\n');

  const answer = await question('Have you optimized the images? (yes/no): ');
  return answer.toLowerCase().startsWith('y');
}

async function moveImages() {
  header('📁 STEP 4: ADD IMAGES TO PROJECT');

  const publicPath = path.join(__dirname, 'public');

  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  print(`\nYour project's public folder: ${publicPath}\n`, 'cyan');

  print('📋 MANUAL STEPS:', 'bright');
  print('  1. Open your Downloads folder (or optimized folder)');
  print('  2. Rename your images to match these names:');

  imagesList.forEach((img, idx) => {
    print(`     ${idx + 1}. Rename to: ${img.filename}`, 'yellow');
  });

  print(`\n  3. Copy all renamed images to: ${publicPath}`);
  print('  4. Replace existing placeholder images\n');

  const answer = await question('Copy images now and press Enter when done...');

  // Verify images exist
  print('\n🔍 Verifying images in public folder...\n', 'cyan');

  let allFound = true;
  imagesList.forEach(img => {
    const imagePath = path.join(publicPath, img.filename);
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      print(`  ✅ ${img.filename} (${sizeMB} MB)`, 'green');
    } else {
      print(`  ❌ ${img.filename} - NOT FOUND`, 'yellow');
      allFound = false;
    }
  });

  return allFound;
}

async function createOptimizeScript() {
  header('💾 CREATING OPTIMIZATION SCRIPT');

  const optimizeScript = `// Image Optimization Script
// Install: npm install sharp
// Run: node optimize-images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  'hero_sky.jpg',
  'who_we_are.jpg',
  'passu_1.jpg'
];

async function optimizeImage(filename) {
  const inputPath = path.join(__dirname, 'downloads', filename);
  const outputPath = path.join(__dirname, 'public', filename);

  if (!fs.existsSync(inputPath)) {
    console.log(\`❌ \${filename} not found in downloads folder\`);
    return;
  }

  try {
    await sharp(inputPath)
      .resize(3840, 2160, {
        fit: 'cover',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const saved = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(\`✅ \${filename} - Saved \${saved}%\`);
  } catch (error) {
    console.error(\`❌ Error optimizing \${filename}:\`, error.message);
  }
}

async function main() {
  console.log('🔧 Optimizing images...\\n');

  // Create downloads and public folders if they don't exist
  ['downloads', 'public'].forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });

  for (const filename of imagesToOptimize) {
    await optimizeImage(filename);
  }

  console.log('\\n✅ Done! Images are ready in /public folder');
}

main();
`;

  fs.writeFileSync('optimize-images.js', optimizeScript);
  print('\n✅ Created optimize-images.js', 'green');
  print('   To use: npm install sharp && node optimize-images.js\n');
}

async function showSummary() {
  header('🎉 ALL DONE!');

  print('\n✅ Your high-quality Pakistani mountain images are ready!\n', 'green');

  print('📸 Images added:', 'bright');
  print('  • K2 Mountain → Hero background');
  print('  • Lady Finger Peak → Who We Are section');
  print('  • Passu Cones → Events and other sections\n');

  print('🚀 Next steps:', 'cyan');
  print('  1. Start dev server: npm run dev');
  print('  2. Visit: http://localhost:5173');
  print('  3. Check that images look amazing! 🏔️');
  print('  4. Build for production: npm run build');
  print('  5. Deploy to Vercel: Follow ROADMAP.md\n');

  print('💡 Tip: If images look too large or load slowly:', 'yellow');
  print('   - Optimize further with TinyPNG');
  print('   - Target: 300-800KB per image');
  print('   - Hero can be up to 1.5MB\n');
}

async function main() {
  print('\n🏔️  Karakoram Alpine Web - Image Setup Helper\n', 'bright');
  print('This script will guide you through downloading and adding');
  print('high-quality 4K images of K2, Lady Finger Peak, and Passu Cones.\n');

  const start = await question('Ready to start? (yes/no): ');
  if (!start.toLowerCase().startsWith('y')) {
    print('\n👋 Come back when you\'re ready!\n');
    rl.close();
    return;
  }

  // Step 1: Show links
  await showImageLinks();
  await question('\n\nPress Enter when you\'ve opened the links...');

  // Step 2: Check downloads
  print('\n\n');
  const hasDownloads = await checkDownloads();
  if (!hasDownloads) {
    print('\n💡 Download the images first, then run: node download-images.js\n', 'cyan');
    rl.close();
    return;
  }

  // Step 3: Optimize
  const optimized = await optimizeInstructions();

  // Create optimize script for later
  await createOptimizeScript();

  // Step 4: Move to project
  const moved = await moveImages();

  // Summary
  if (moved) {
    await showSummary();
  } else {
    print('\n⚠️  Some images are missing. Please:', 'yellow');
    print('  1. Make sure images are renamed correctly');
    print('  2. Copy them to the public folder');
    print('  3. Run this script again to verify\n');
  }

  rl.close();
}

main();
