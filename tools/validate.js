#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const { parse, plan } = require('../roll20/ChatGPTImporter');
const files = process.argv.slice(2);
if (!files.length) {
    console.error('Usage: npm run validate -- path/to/character.json [more.json]');
    process.exitCode = 1;
}
for (const file of files) {
    try {
        const data = parse(fs.readFileSync(file, 'utf8'), false);
        let index = 0;
        const result = plan(data, () => '-check' + ++index);
        console.log(`${file}: valid ${data.type.toUpperCase()} — ${result.name} (${Object.keys(result.attributes).length} attributes)`);
    } catch (error) {
        console.error(`${file}: ${error.message}`);
        process.exitCode = 1;
    }
}
