'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { SCHEMA } = require('../roll20/ChatGPTImporter');
fs.writeFileSync(path.join(__dirname, '../docs/character.schema.json'), JSON.stringify(SCHEMA, null, 2) + '\n');
console.log('Wrote docs/character.schema.json');
