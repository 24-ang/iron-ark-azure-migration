const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('prompts/schema.ts');
console.log(`Processing: ${targetFile}`);

if (!fs.existsSync(targetFile)) {
    console.error('File not found');
    process.exit(1);
}

let content = fs.readFileSync(targetFile, 'utf8');

// The file structure is: export const P_DATA_STRUCT = `<...>`;
// We want to escape all backticks strictly INSIDE the outer backticks.

const firstBacktick = content.indexOf('`');
const lastBacktick = content.lastIndexOf('`');

if (firstBacktick === -1 || lastBacktick === -1 || firstBacktick === lastBacktick) {
    console.error('Could not find outer backticks');
    process.exit(1);
}

const pre = content.substring(0, firstBacktick + 1); // Keep the first backtick
const body = content.substring(firstBacktick + 1, lastBacktick);
const post = content.substring(lastBacktick); // Keep the last backtick

// Escape backticks in body, but avoid double escaping if already escaped (simple check)
// Actually, if I see ` it should be \`.
const escapedBody = body.replace(/`/g, '\\`');

const newContent = pre + escapedBody + post;

if (newContent !== content) {
    fs.writeFileSync(targetFile, newContent);
    console.log('Successfully escaped backticks.');
} else {
    console.log('No changes needed.');
}
