const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'content.json');

// Very small write queue so two overlapping saves can't corrupt the file.
let writing = Promise.resolve();

function readContent() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeContent(newContent) {
  writing = writing.then(() => {
    // Basic shape check so a malformed save can't wipe out the file.
    const required = ['hero', 'about', 'experience', 'skills', 'languages', 'education', 'courses', 'contact'];
    const missing = required.filter((key) => !(key in newContent));
    if (missing.length) {
      throw new Error(`Content is missing required section(s): ${missing.join(', ')}`);
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(newContent, null, 2), 'utf-8');
  });
  return writing;
}

module.exports = { readContent, writeContent };
