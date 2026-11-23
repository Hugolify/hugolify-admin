/**
 * CloudCannon Configuration Build Script
 * 
 * This script automates the generation of CloudCannon configuration for Hugolify.
 * It performs the following operations:
 * 
 * 1. Executes the Hugo build command (yarn build)
 * 2. Generates archetypes from the archetypes.json file
 *    - Creates .md files in the /archetypes folder with default fields
 * 3. Copies the generated configuration file to cloudcannon.config.yml
 * 
 * Usage: run from the project root, the script ships with this module (see README):
 *   node <hugolify-admin module dir>/scripts/build-config-cloudcannon.js
 *
 * @requires child_process
 * @requires fs
 * @requires path
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute a shell command
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    const process = exec(command);

    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

// Main function
async function buildAndCopy() {
  try {
    // Step 1: Run the build
    console.log('📦 Starting build...');
    await runCommand('yarn build');
    console.log('✅ Build completed successfully');

    // The project is the working directory: this file lives in the Hugo module cache
    const projectRoot = process.cwd();

    // Step 2: Generate Archetypes
    console.log('\n🏗️ Generating archetypes...');
    const archetypesPath = path.join(projectRoot, 'public', 'admin', 'config', 'archetypes.json');
    if (fs.existsSync(archetypesPath)) {
      const archetypesData = JSON.parse(fs.readFileSync(archetypesPath, 'utf8'));
      const archetypesDir = path.join(projectRoot, 'archetypes');

      if (!fs.existsSync(archetypesDir)) {
        fs.mkdirSync(archetypesDir, { recursive: true });
      }

      for (const [collection, fields] of Object.entries(archetypesData)) {

        const archetypeFile = path.join(archetypesDir, `${collection}.md`);
        let content = '---\n';
        fields.forEach(item => {
          if (item.default !== "") {
            content += `${item.field}: ${item.default}\n`;
          } else {
            content += `${item.field}:\n`;
          }
        });
        content += '---\n';

        fs.writeFileSync(archetypeFile, content);
        console.log(`Created archetype: ${archetypeFile}`);
      }
    } else {
      console.warn(`⚠️ Archetypes JSON not found at ${archetypesPath}`);
    }

    // Step 3: Copy the file
    console.log('\n📋 Copying config.yml file...');
    const sourcePath = path.join(projectRoot, 'public', 'admin', 'config.yml');
    const destPath = path.join(projectRoot, 'cloudcannon.config.yml');

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source file does not exist: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ File copied: ${sourcePath} -> ${destPath}`);

    console.log('\n🎉 Process completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
buildAndCopy();