const inquirer = require('inquirer');
const db = require('./db');
require('console.table');

async function mainMenu() {
  try {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit'
      ]
    });

    switch (action) {
      case 'View All Departments':
        await viewDepartments();
        break;
      // Add other cases...
      case 'Exit':
        db.end();
        process.exit();
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

async function viewDepartments() {
  const res = await db.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
}

// Initialize app
mainMenu();