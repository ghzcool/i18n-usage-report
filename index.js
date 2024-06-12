#!/usr/bin/env node

const fs = require("fs");

const args = {
  projectPath: process.env.PROJECT_PATH ?? './',
  translationPath: process.env.TRANSLATION_PATH ?? './locales/en.json',
  singleQuote: process.env.SINGLE_QUOTE ? true : false
};

for (let i = 0; i < process.argv.length; i++) {
  const item = process.argv[i];
  switch (item) {
    case "-P":
      args.projectPath = process.argv[++i];
      break;
    case "-T":
      args.translationPath = process.argv[++i];
      break;
    case "-S":
      args.singleQuote = true;
      break;
    default:
  }
}

const jsonString = fs.readFileSync(args.translationPath, {encoding: "utf8", flag: 'r'});
let json = {};

try {
  json = JSON.parse(jsonString);
} catch(error) {
  console.error(error);
  return;
}

const keys = [];
const usedKeys = {};
let unusedKeys = [];

const processJSONRecursive = (obj, prev) => {
  Object.keys(obj).forEach(part => {
    const key = (prev ? prev + "." : "") + part;
    if (typeof obj[part] === "string") {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    } else {
      processJSONRecursive(obj[part], key);
    }
  });
};

processJSONRecursive(json);

const updateUnusedKeys = () => {
  unusedKeys = [...keys].filter(key => !usedKeys[key]);
};

updateUnusedKeys();

const checkFileContent = (path) => {
  // console.log("checkFileContent", path);
  const content = fs.readFileSync(path, {encoding: "utf8", flag: 'r'});
  let found = false;
  for (const key of unusedKeys) {
    const part = args.singleQuote ? `'${key}'` : `"${key}"`;
    // console.log("test part", part);
    if (content.indexOf(part) !== -1) {
      usedKeys[key] = true;
      found = true;
      // console.log("found");
    }
  }
  if (found) {
    updateUnusedKeys();
  }
};

const checkProjectRecursive = (path) => {
  // console.log("checkProjectRecursive", path);
  const items = fs.readdirSync(path, {withFileTypes: true});
  const directories = [...items].filter(item => item.isDirectory()).map(item => item.name);
  const files = [...items].filter(item => item.isFile()).map(item => item.name);
  files.forEach(file => checkFileContent(path + "/" + file));
  directories.forEach(directory => checkProjectRecursive(path + "/" + directory));
};

checkProjectRecursive(args.projectPath);

console.log(args, {unusedKeys});
