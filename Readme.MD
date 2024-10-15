# add-dependabot

`add-dependabot` is an npm package that automatically adds a `dependabot.yml` configuration file to your repository if dependencies are detected in `package.json`. This allows Dependabot to keep your npm dependencies up-to-date with minimal effort.

## Features

- Automatically detects dependencies in `package.json` and creates a `.github/dependabot.yml` file.
- Sets up a customizable update schedule for npm dependencies.
- Skips configuration if no dependencies are found in the project.
- Offers user-friendly prompts to configure Dependabot using checkboxes.
- Supports command-line flags for specifying update intervals and modes.

## Usage (To use in repo without adding to package.json)

Once installed, run the following command in the root directory of your project:

```bash
npx add-dependabot
```

This will:

1. Check if your `package.json` contains any dependencies.
2. If dependencies are found, it creates a `.github/dependabot.yml` file based on user input.
3. If the file already exists, it skips creating a new one and logs a message.

### Command-Line Flags

You can also use command-line flags to specify the update interval and mode:

- **Mode Options**:

  - `--local`: Creates a direct `dependabot.yml` file in the `.github` directory.
  - `--action`: Sets up a GitHub Actions workflow for Dependabot updates.

- **Interval Options**:
  - `--daily`: Sets Dependabot to check for updates daily.
  - `--weekly`: Sets Dependabot to check for updates weekly (default).
  - `--monthly`: Sets Dependabot to check for updates monthly.

Example command with flags:

```bash
npx add-dependabot --mode local --interval weekly
```

## Installation

To install `add-dependabot` **globally**, use the following command:

```bash
npm install -g add-dependabot
```

Or add it to your **project** as a dev dependency:

```bash
npm install --save-dev add-dependabot
```

## File Structure

- `.github/`
  - `dependabot.yml` (if applicable)
  - `workflows/`
    - `dependabot-action.yml` (created by the script)

## Example

A typical run might look like:

```bash
$ npx add-dependabot
Checking for dependencies...
Dependencies detected. Adding Dependabot configuration...
Dependabot configuration file created at .github/dependabot.yml
```

If you use command-line flags:

```bash
$ npx add-dependabot --mode action --interval daily
Creating GitHub Actions workflow for checking Dependabot...
GitHub Actions workflow created at .github/workflows/dependabot.yml
```

## Configuration

The generated `.github/dependabot.yml` file will look like this:

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly' # Adjusts based on user input
```

You can manually adjust the update schedule or other settings in the generated file.

## Troubleshooting

- **Dependabot configuration already exists:** If the `.github/dependabot.yml` file already exists, the package will not overwrite it. You can manually edit the file if you need to change the schedule or other settings.
- **No dependencies found:** If the script detects no dependencies in `package.json`, it will skip creating the configuration file.

## Contributing

Contributions are welcome! Please feel free to contact me here - [GitHub](https://github.com/Prathamesh-Shanbhag) to submit a pull request or open an issue if you find a bug or have a feature request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Developed by [Prathamesh Shanbhag](https://www.prathamesh-shanbhag.com/).

### Key Additions

1. **Command-Line Flags Section**: Explained the options for the mode (`local` or `action`) and the intervals (`daily`, `weekly`, `monthly`).
2. **Example with Flags**: Provided an example of how to use the command with flags to clarify usage.
