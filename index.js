#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Common shell configuration files
const SHELL_FILES = {
  bash: ['.bashrc', '.bash_profile'],
  zsh: ['.zshrc'],
  fish: ['.config/fish/config.fish']
};

// Function to detect shell and get relevant config files
async function getShellConfigFiles() {
  const homeDir = os.homedir();
  const shell = process.env.SHELL || '';
  
  let configFiles = [];
  
  if (shell.includes('zsh')) {
    configFiles = SHELL_FILES.zsh;
  } else if (shell.includes('bash')) {
    configFiles = SHELL_FILES.bash;
  } else if (shell.includes('fish')) {
    configFiles = SHELL_FILES.fish;
  }

  // Filter existing files
  const existingFiles = [];
  for (const file of configFiles) {
    const fullPath = path.join(homeDir, file);
    try {
      await fs.access(fullPath);
      existingFiles.push(fullPath);
    } catch {
      // File doesn't exist, skip
    }
  }
  
  return existingFiles;
}

// Function to add folder to PATH
async function addToPath(folderPath) {
  try {
    // Resolve absolute path and verify it exists
    const absolutePath = path.resolve(folderPath);
    await fs.access(absolutePath);

    const configFiles = await getShellConfigFiles();
    
    if (configFiles.length === 0) {
      console.error('No supported shell configuration files found');
      process.exit(1);
    }

    for (const configFile of configFiles) {
      const isFish = configFile.includes('fish');
      
      // Read existing content
      let content = await fs.readFile(configFile, 'utf-8');
      
      // Prepare PATH modification
      const exportLine = isFish
        ? `fish_add_path ${absolutePath}`
        : `export PATH="$PATH:${absolutePath}"`;
      
      // Check if path is already added
      if (content.includes(absolutePath)) {
        console.log(`Path ${absolutePath} already in ${configFile}`);
        continue;
      }
      
      // Add the export line
      const marker = '# Added by add-to-path';
      const newContent = content.includes(marker)
        ? content.replace(marker, `${marker}\n${exportLine}`)
        : `${content}\n\n${marker}\n${exportLine}`;
      
      // Write back to file
      await fs.writeFile(configFile, newContent);
      console.log(`Added ${absolutePath} to PATH in ${configFile}`);
    }
    
    console.log('PATH updated successfully. Please restart your terminal or source the modified files.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Main execution
(async () => {
  const folderPath = process.argv[2];
  
  if (!folderPath) {
    console.error('Please provide a folder path as an argument');
    console.error('Usage: npx radekstepan/add-to-path <folder_path>');
    process.exit(1);
  }
  
  await addToPath(folderPath);
})();
