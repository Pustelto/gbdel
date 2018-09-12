#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const exec = require('child-process-promise').exec;

function ignoreBranches(branchList) {
  return branchList.split(',').map(b => `-e ^${b}$`).join(' ')
}

const blacklist = ignoreBranches(process.env.GIT_BRANCH_CLEANER_BLACKLIST || 'master')
const mergedBase = process.env.GIT_BRANCH_CLEANER_MERGED_BASE || 'master'

const localBranches = exec(`git branch -v | awk -F' *' '{print $2}' | grep -v ${blacklist}`)
const mergedBranches = exec(`git branch --merged ${mergedBase} | awk -F' *' '{print $2}' | grep -v ${blacklist}`)

Promise.all([localBranches, mergedBranches])
  .then(([localResult, mergedResult]) => {
    const branches = localResult.stdout
    const merged = mergedResult.stdout

    const mergedArray = merged.split('\n')

    return Promise.resolve(branches.split('\n').filter(Boolean).map(b => ({value: b, name: `${b} ${mergedArray.includes(b) ? chalk.blue('<MERGED>') : ''}`})))
  })
  .then(choices =>
    inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select branches to delete',
          name: 'branches',
          pageSize: process.env.GIT_BRANCH_CLEANER_PAGESIZE || 25,
          choices,
        }
      ])
  )
  .then(answers => {
    console.log('Deleting selected branches...\n');
    const deletes = answers.branches.map(branch => {

      return exec(`git branch -D ${branch}`)
    })

    return Promise.all(deletes)
  })
  .then((res) => {
    res.forEach(result => {
      console.log(result.stdout.trim());
    })

    console.log(chalk.green('Branches deleted successfully'))
    process.exit(0);
  })
  .catch(error => {
    console.error(chalk.red('There has been error: ', error))
    process.exit(1);
  })
