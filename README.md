# add-to-path

A simple utility to add directories to your shell's PATH environment variable.

## Features

- Automatically detects your current shell (bash, zsh, or fish)
- Updates the appropriate configuration file (.bashrc, .zshrc, etc.)
- Prevents duplicate entries in your PATH
- Cross-platform support

## Installation & Usage

No installation needed! Run directly with npx:

```bash
npx radekstepan/add-to-path /path/to/directory
```

This will add the specified directory to your PATH by modifying the appropriate shell configuration file.

## Examples

Add your current directory to PATH:
```bash
npx radekstepan/add-to-path .
```

Add a specific directory:
```bash
npx radekstepan/add-to-path ~/my-scripts
```

## Supported Shells

- Bash (.bashrc, .bash_profile)
- Zsh (.zshrc)
- Fish (.config/fish/config.fish)

## After Running

After the script makes changes, you'll need to:

1. Restart your terminal, or
2. Source the updated configuration file:
   - Bash/Zsh: `source ~/.bashrc` or `source ~/.zshrc`
   - Fish: `source ~/.config/fish/config.fish`

## Requirements

Node.js 10 or higher

## License

MIT
