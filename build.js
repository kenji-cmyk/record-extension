const fs = require('fs');
const path = require('path');

/**
 * Build script to compile TypeScript and prepare extension files
 */

// Copy static files to dist directory
function copyStaticFiles() {
  const staticFiles = [
    'manifest.json',
    'popup.html',
    'offscreen.html',
    'permission.html',
    'permission.js', // Keep existing permission.js as-is for now
    'icons/recording.png',
    'icons/not-recording.png'
  ];

  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Ensure dist/icons directory exists
  if (!fs.existsSync('dist/icons')) {
    fs.mkdirSync('dist/icons', { recursive: true });
  }

  staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const destPath = path.join('dist', file);
      const destDir = path.dirname(destPath);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(file, destPath);
      console.log(`Copied ${file} to ${destPath}`);
    } else {
      console.warn(`Static file not found: ${file}`);
    }
  });
}

// Update manifest.json to point to compiled JS files
function updateManifest() {
  const manifestPath = 'dist/manifest.json';
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Update service worker path
    if (manifest.background && manifest.background.service_worker) {
      manifest.background.service_worker = 'service-worker.js';
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Updated manifest.json with compiled paths');
  }
}

// Main build function
function build() {
  console.log('Starting build process...');
  
  try {
    copyStaticFiles();
    updateManifest();
    console.log('Build completed successfully!');
    console.log('Run "npm run build" to compile TypeScript files');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();