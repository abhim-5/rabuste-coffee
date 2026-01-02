#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Run this before pushing to GitHub/Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let errors = 0;
let warnings = 0;

// Check 1: Verify critical files exist
console.log('📁 Checking critical files...');
const criticalFiles = [
  'next.config.ts',
  'package.json',
  'tsconfig.json',
  '.gitignore',
  'public/Rabuste logo.png',
  'public/video.mp4',
  'public/about us/coffee.glb',
  'public/manifest.json',
  'public/robots.txt',
];

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    errors++;
  }
});

// Check 2: Verify .env.local (optional but recommended)
console.log('\n🔐 Checking environment files...');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('  ✅ .env.local exists');
} else {
  console.log('  ⚠️  .env.local not found (create if you need env variables)');
  warnings++;
}

// Check 3: Scan for console.log in source files
console.log('\n🐛 Scanning for console.log statements...');
const srcDir = path.join(process.cwd(), 'src');

function scanDirectory(dir, pattern) {
  let found = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      found = found.concat(scanDirectory(filePath, pattern));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.match(pattern) && !line.trim().startsWith('//')) {
          found.push({
            file: filePath.replace(process.cwd(), ''),
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  });
  
  return found;
}

const consoleLogs = scanDirectory(srcDir, /console\.(log|debug|info)\(/);
if (consoleLogs.length > 0) {
  console.log(`  ⚠️  Found ${consoleLogs.length} console.log statements:`);
  consoleLogs.slice(0, 5).forEach(item => {
    console.log(`     ${item.file}:${item.line}`);
  });
  if (consoleLogs.length > 5) {
    console.log(`     ... and ${consoleLogs.length - 5} more`);
  }
  console.log('  ℹ️  These will be removed in production build');
  warnings++;
} else {
  console.log('  ✅ No console.log statements found');
}

// Check 4: Verify package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'lint'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`  ✅ ${script} script exists`);
  } else {
    console.log(`  ❌ ${script} script missing`);
    errors++;
  }
});

// Check 5: Verify .gitignore includes important patterns
console.log('\n🚫 Checking .gitignore...');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
const requiredPatterns = ['.next', 'node_modules', '.env', '.vercel'];

requiredPatterns.forEach(pattern => {
  if (gitignore.includes(pattern)) {
    console.log(`  ✅ ${pattern} is ignored`);
  } else {
    console.log(`  ❌ ${pattern} NOT ignored`);
    errors++;
  }
});

// Check 6: Check for large files that shouldn't be committed
console.log('\n📏 Checking for large files...');
function getFileSize(filePath) {
  const stat = fs.statSync(filePath);
  return stat.size;
}

function findLargeFiles(dir, maxSize = 10 * 1024 * 1024) { // 10MB
  let largeFiles = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      largeFiles = largeFiles.concat(findLargeFiles(filePath, maxSize));
    } else if (stat.isFile() && stat.size > maxSize) {
      largeFiles.push({
        path: filePath.replace(process.cwd(), ''),
        size: (stat.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  });
  
  return largeFiles;
}

const largeFiles = findLargeFiles(process.cwd());
if (largeFiles.length > 0) {
  console.log(`  ⚠️  Found ${largeFiles.length} large files (>10MB):`);
  largeFiles.forEach(file => {
    console.log(`     ${file.path} - ${file.size}`);
  });
  console.log('  ℹ️  Consider optimizing or using CDN');
  warnings++;
} else {
  console.log('  ✅ No large files found');
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! Ready to deploy! 🚀');
  process.exit(0);
} else {
  console.log(`\n⚠️  Found ${errors} error(s) and ${warnings} warning(s)`);
  
  if (errors > 0) {
    console.log('\n❌ Please fix errors before deploying');
    process.exit(1);
  } else {
    console.log('\n⚠️  Warnings found but you can still deploy');
    console.log('✅ Ready to deploy! 🚀');
    process.exit(0);
  }
}
