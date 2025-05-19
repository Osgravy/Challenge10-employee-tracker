// test.js - Updated verification script
const inquirer = require('inquirer');

console.log('Inquirer version:', require('inquirer/package.json').version);
console.log('Inquirer methods:', Object.keys(inquirer).filter(k => typeof inquirer[k] === 'function'));

inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Test prompt',
      choices: ['Option 1', 'Option 2']
    }
  ])
  .then(answers => {
    console.log('Success! Received:', answers);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });