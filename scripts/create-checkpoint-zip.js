import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetZipName = 'little-lambs-store-v2-hero-refresh.zip';
const rootDir = path.resolve('.');
const outputPath = path.join(rootDir, targetZipName);

if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

console.log(`Creating checkpoint archive: ${targetZipName}...`);

const powershellCmd = `
$excludeList = @('node_modules', '.next', '.git', '.env', '.env.local', 'test-results', 'little-lambs-store-v2-hero-refresh.zip', 'little-lambs-store-v2-complete-frontend.zip', 'little-lambs-store-v2-storefront.zip');
$files = Get-ChildItem -Path . -Exclude $excludeList;
Compress-Archive -Path $files -DestinationPath .\\${targetZipName} -Force;
`;

try {
  execSync(`powershell -Command "${powershellCmd.replace(/\n/g, ' ')}"`, { cwd: rootDir, stdio: 'inherit' });
  console.log(`Successfully created ${targetZipName}!`);
} catch (err) {
  console.error('Error creating zip:', err);
  process.exit(1);
}
