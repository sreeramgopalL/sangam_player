const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Sreeram gopal\\Music\\new songs sree';
const destDir = path.join(__dirname, 'temp_music_upload');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  const files = fs.readdirSync(srcDir)
    .filter(file => file.toLowerCase().endsWith('.mp3'))
    .sort(); // sort alphabetically for consistency

  console.log(`Found ${files.length} total mp3 files in source directory.`);
  
  const filesToCopy = files.slice(0, 100);
  console.log(`Copying first 100 files to ${destDir}...`);

  filesToCopy.forEach((file, index) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`[${index + 1}/100] Copied: ${file}`);
  });

  console.log('Successfully copied 100 files!');
} catch (err) {
  console.error('Error during copy:', err);
}
