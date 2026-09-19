const fs = require('fs');
const path = require('path');

const SOURCE_DIR = process.cwd();
const BACKUP_DIR = path.join('C:', 'Users', 'dains', '.gemini', 'antigravity-ide', 'brain', '03b49d05-635c-4f62-86d8-54776188d6da', 'scratch', 'checkpoint_backup');

console.log('Creating safety checkpoint backup to:', BACKUP_DIR);

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    if (['node_modules', '.next', '.git', 'scratch'].includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDirSync(SOURCE_DIR, BACKUP_DIR);
  console.log('Safety checkpoint created successfully!');
} catch (err) {
  console.error('Failed to create safety checkpoint:', err);
  process.exit(1);
}
