const fs = require('fs');
const path = require('path');

const publicDir = path.resolve('public');
const distDir = path.resolve('dist');

function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Missing public assets directory: ${sourceDir}`);
  }

  fs.cpSync(sourceDir, targetDir, {
    recursive: true,
    force: true
  });
}

function validateManifest() {
  const manifestPath = path.join(distDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('dist/manifest.json was not generated.');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const requiredFiles = [
    manifest.background?.service_worker,
    manifest.action?.default_popup
  ].filter(Boolean);

  requiredFiles.forEach((file) => {
    const outputPath = path.join(distDir, file);
    if (!fs.existsSync(outputPath)) {
      throw new Error(`Manifest points to missing file: ${file}`);
    }
  });
}

function build() {
  console.log('Copying extension static assets...');
  copyDirectory(publicDir, distDir);
  validateManifest();
  console.log('Build completed successfully.');
}

build();
