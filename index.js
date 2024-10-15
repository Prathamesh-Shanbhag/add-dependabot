#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { Command } = require('commander')
const { log } = require('console')
const inquirer = require('inquirer').default

const CONFIG_CONTENT = `
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "%s"
`
const ACTIONS_WORKFLOW_CONTENT = `
name: 'Check Dependabot'

on:
  push:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16' # Specify the Node.js version

      - name: Install dependencies
        run: npm install

      - name: Create dependabot.yml
        run: |
          echo 'version: 2
          updates:
            - package-ecosystem: "npm"
              directory: "/"
              schedule:
                interval: "weekly"' > .github/dependabot.yml

      - name: Commit dependabot.yml
        run: |
          git config --global user.email "github-actions@github.com"
          git config --global user.name "GitHub Actions"
          git add .github/dependabot.yml
          git commit -m "Add dependabot.yml" || echo "No changes to commit"
          git push origin main # Ensure the correct branch is specified
`

// Function to create the dependabot.yml file locally
const createDependabotConfig = (interval) => {
  const dir = path.join(process.cwd(), '.github')
  const file = path.join(dir, 'dependabot.yml')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (fs.existsSync(file)) {
    console.log('Dependabot configuration already exists.')
  } else {
    fs.writeFileSync(file, CONFIG_CONTENT.trim().replace('%s', interval))
    console.log(
      'Dependabot configuration file created at .github/dependabot.yml'
    )
  }
}

// Function to create the GitHub Actions workflow for Dependabot
const createGitHubAction = (interval) => {
  const baseDir = path.join(process.cwd(), '.github')
  const workflowsDir = path.join(baseDir, 'workflows')
  const dependabotFile = path.join(baseDir, 'dependabot.yml')
  const actionFile = path.join(workflowsDir, 'dependabot-action.yml')

  // Check if the base directory exists; create it if it doesn't
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  // Check if the workflows directory exists; create it if it doesn't
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true })
  }

  // Check if the dependabot.yml file already exists in the base directory
  if (fs.existsSync(dependabotFile)) {
    console.log(
      'Dependabot configuration file already exists in .github (Delete if you need to create a GitHub Action)'
    )
    return // Exit the function if the file exists
  }

  // Check if the dependabot-action.yml file already exists in the workflows directory
  if (fs.existsSync(dependabotFile)) {
    console.log(
      'GitHub Actions workflow for checking dependabot already exists in .github/workflows. (Delete if you need to create a GitHub Action)'
    )
    return // Exit the function if the file exists
  }

  // Create the dependabot-action.yml file with the specified interval
  fs.writeFileSync(
    actionFile,
    ACTIONS_WORKFLOW_CONTENT.trim().replace('%s', interval)
  )
  console.log(
    'GitHub Actions workflow created at .github/workflows/dependabot-action.yml'
  )
}

// Main function with inquirer prompts and commander
const main = () => {
  const dependabotFile = path.join(process.cwd(), '.github', 'dependabot.yml') // Declare dependabotFile here
  // const program = new Command()

  // // Define command-line options
  // program
  //   .description('Add Dependabot configuration to a project')
  //   .option('-m, --mode <mode>', 'Choose the mode: local or action')
  //   .option(
  //     '-i, --interval <interval>',
  //     'Set the interval for Dependabot updates (daily, weekly, monthly)'
  //   )

  // // Extract options
  // const { mode, interval } = program.opts()

  // // Validate mode and interval
  // if (!['local', 'action'].includes(mode)) {
  //   console.error('Invalid mode. Use "local" or "action".')
  //   process.exit(1)
  // }

  // if (!['daily', 'weekly', 'monthly'].includes(interval)) {
  //   console.error('Invalid interval. Use "daily", "weekly", or "monthly".')
  //   process.exit(1)
  // }
  // program.parse(process.argv)
  // // INQUIRER PROMPTS
  // // If flags are not provided, prompt user for input
  // if (!program.mode || !program.interval) {
  inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'mode',
        message: 'Choose the mode:',
        choices: [
          { name: 'local', value: 'local' }, // Use 'value' for single selection
          { name: 'action', value: 'action' },
        ],
        validate: (answer) => {
          if (!answer) {
            return 'You must choose a mode.'
          }
          return true
        },
      },
      {
        type: 'rawlist', // Change from 'list' to 'rawlist'
        name: 'interval',
        message: 'Set the interval for Dependabot updates:',
        choices: [
          { name: 'daily', value: 'daily' },
          { name: 'weekly', value: 'weekly' },
          { name: 'monthly', value: 'monthly' },
        ],
        validate: (answer) => {
          if (!answer) {
            return 'You must choose an interval.'
          }
          return true
        },
      },
    ])
    .then((answers) => {
      const selectedMode = answers.mode
      const selectedInterval = answers.interval
      if (fs.existsSync(dependabotFile)) {
        console.log(
          'Dependabot configuration file already exists. Please remove it before proceeding.'
        )
        return // Exit or handle appropriately
      }

      if (selectedMode === 'local') {
        createDependabotConfig(selectedInterval)
      } else if (selectedMode === 'action') {
        createGitHubAction(selectedInterval)
      }

      console.log(
        `Dependabot will update ${selectedInterval} based on your selection.`
      )
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error(
          'Interactive prompts are not supported in this environment.'
        )
      } else {
        console.error('Something else went wrong:', error)
      }
    })
}
// else {
//     console.log('Dependabot configuration file has been generated and added.')
//   }
// }

main()
