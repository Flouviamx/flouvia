const fs = require('fs');
const glob = require('glob'); // Not available? We can just manually list files, or use child_process
const { execSync } = require('child_process');

const filesStr = execSync('grep -rl "watermark" src/').toString();
const files = filesStr.split('\n').filter(Boolean);

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // Match single line <div> or <span> with 'watermark' in class name
  const regex = /^[ \t]*<(div|span)[^>]*class="[^"]*watermark[^"]*"[^>]*>.*?<\/\1>[ \t]*\r?\n/gm;
  const newC = c.replace(regex, '');
  if (c !== newC) {
    fs.writeFileSync(f, newC);
    console.log(`Modified ${f}`);
  }
});
