const inquirer = require('inquirer');
const db = require('./db');
require('console.table');

// Main Menu
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.choice) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                process.exit();
        }
    });
}

// View All Departments
function viewDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

// View All Roles
function viewRoles() {
    const query = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        LEFT JOIN department ON role.department_id = department.id
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

// View All Employees
function viewEmployees() {
    const query = `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
               CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
}

// Add a Department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:'
        }
    ]).then(answer => {
        db.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err) => {
            if (err) throw err;
            console.log('Department added successfully!');
            mainMenu();
        });
    });
}

// Add a Role
function addRole() {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        const deptChoices = departments.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department:',
                choices: deptChoices
            }
        ]).then(answer => {
            db.query(
                'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
                [answer.title, answer.salary, answer.department_id],
                (err) => {
                    if (err) throw err;
                    console.log('Role added successfully!');
                    mainMenu();
                }
            );
        });
    });
}

// Add an Employee
function addEmployee() {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id
        }));
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
            const managerChoices = employees.rows.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }));
            managerChoices.unshift({ name: 'None', value: null });
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the employee\'s first name:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the employee\'s last name:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the employee\'s role:',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the employee\'s manager:',
                    choices: managerChoices
                }
            ]).then(answer => {
                db.query(
                    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                    [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee added successfully!');
                        mainMenu();
                    }
                );
            });
        });
    });
}

// Update Employee Role
function updateEmployeeRole() {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        const employeeChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));
        db.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
            const roleChoices = roles.rows.map(role => ({
                name: role.title,
                value: role.id
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role:',
                    choices: roleChoices
                }
            ]).then(answer => {
                db.query(
                    'UPDATE employee SET role_id = $1 WHERE id = $2',
                    [answer.role_id, answer.employee_id],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                        mainMenu();
                    }
                );
            });
        });
    });
}

// Start the application
mainMenu();