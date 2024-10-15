#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const CONFIG_CONTENT = `
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
`

const ACTIONS_WORKFLOW_CONTENT = `name: 'Check Dependabot'

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14' # Specify the Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run Dependabot
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
          git push origin main # Make sure to specify the correct branch`

// Function to check if package.json exists and has dependencies
const hasDependencies = () => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    const hasDeps =
      (packageJson.dependencies &&
        Object.keys(packageJson.dependencies).length > 0) ||
      (packageJson.devDependencies &&
        Object.keys(packageJson.devDependencies).length > 0)

    return hasDeps
  } catch (error) {
    console.error('Error reading package.json:', error.message)
    return false
  }
}

// Function to create the dependabot.yml file
const createDependabotConfig = () => {
  const dir = path.join(process.cwd(), '.github/workflows')
  const file = path.join(dir, 'dependabot.yml')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (fs.existsSync(file)) {
    console.log('Dependabot configuration already exists.')
  } else {
    fs.writeFileSync(file, CONFIG_CONTENT.trim())
    console.log(
      'Dependabot configuration file created at .github/workflows/dependabot.yml'
    )
  }
}

// Function to create the GitHub Actions workflow for checking dependabot.yml
const createGitHubAction = () => {
  const dir = path.join(process.cwd(), '.github/workflows')
  const file = path.join(dir, 'dependabot.yml')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (fs.existsSync(file)) {
    console.log(
      'GitHub Actions workflow for checking dependabot already exists.'
    )
  } else {
    fs.writeFileSync(file, ACTIONS_WORKFLOW_CONTENT.trim())
    console.log(
      'GitHub Actions workflow created at .github/workflows/dependabot.yml'
    )
  }
}

// Main function
const main = () => {
  console.log('Checking for dependencies...')
  if (hasDependencies()) {
    console.log('Dependencies detected. Adding Dependabot configuration...')
    createDependabotConfig()
    createGitHubAction()
  } else {
    console.log(
      'No dependencies found in package.json. Skipping Dependabot setup.'
    )
  }
}

main()
