// Simple setup validation for our plugin

console.log('Validating email performance plugin structure...');

const fs = require('fs');
const path = require('path');

const srcDir = './src';
const expectedDirs = ['components', 'hooks', 'services', 'types', 'utils'];
const expectedFiles = [
  'EmailPerformancePlugin.tsx',
  'types/email.ts',
  'services/emailApi.ts',
  'hooks/useEmailPerformance.ts',
  'utils/formatters.ts'
];

let allTestsPassed = true;

// Check if main directories exist
for (const dir of expectedDirs) {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Missing directory: ${dirPath}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Found directory: ${dirPath}`);
  }
}

// Check for key files
for (const file of expectedFiles) {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${filePath}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Found file: ${filePath}`);
  }
}

// Check that each component has the required files
const components = fs.readdirSync(path.join(srcDir, 'components'));
for (const comp of components) {
  const compPath = path.join(srcDir, 'components', comp);
  if (fs.statSync(compPath).isDirectory()) {
    // Check for main component file and CSS module
    const tsxFile = `${comp}.tsx`;
    const cssFile = `${comp}.module.css`;
    
    if (!fs.existsSync(path.join(compPath, tsxFile))) {
      console.error(`❌ Missing TSX file in component: ${comp}`);
      allTestsPassed = false;
    } else {
      console.log(`✅ Found TSX file for component: ${comp}`);
    }
    
    if (!fs.existsSync(path.join(compPath, cssFile))) {
      console.error(`❌ Missing CSS module for component: ${comp}`);
      allTestsPassed = false;
    } else {
      console.log(`✅ Found CSS module for component: ${comp}`);
    }
  }
}

if (allTestsPassed) {
  console.log('\n🎉 All structure checks passed!');
} else {
  console.error('\n❌ Some structure checks failed.');
  process.exit(1);
}