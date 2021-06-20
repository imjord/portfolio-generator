const inquirer = require('inquirer');
const { writeFile, copyFile } = require('./utils/generate-site');
const generatePage = require('./src/page-template');


const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?(Required)',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('please enter your name!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'github',
      message: 'Enter your GitHub Username(Required!)',
      validate: githubInput => {
        if (githubInput) {
          return true;
        } else {
          console.log('please enter a github username!');
          return false;
        }
      }
    },
    {
      type: 'confirm',
      name: 'confirmAbout',
      message: 'Would you like to enter some info about yourself for an "about" section?',
      default: true
    },
    {
      type: 'input',
      name: 'about',
      message: 'Provide some information about yourself:',
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      }
    }
  ]);
};

const promptProject = portfolioData => {
  console.log(`
  ==================
  Add a New Project
  ==================
  `);

  if(!portfolioData.projects) {
    portfolioData.projects = [];
  }

  return inquirer.prompt ([
    {
      type: 'input',
      name: 'name',
      message: 'what is project name?(required)',
      validate: projectName => {
        if (projectName) {
          return true;
        } else {
          console.log('Enter a project name please!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Provide a descption of the project (required)',
      validate: projectDes => {
        if (projectDes) {
          return true;
        } else {
          console.log('Enter a project description please!');
          return false;
        }
      }
    },
    {
      type: 'checkbox',
      name: 'languages',
      message: 'What did you build this project with (Check all that apply)',
      choices: ['Javascript', 'html', 'css', 'es6', 'jquery', 'bootstrap', 'node']
    },
    {
      type: 'input',
      name: 'link',
      message: 'Enter the GitHub link to your project. (required)',
      validate: projectLink => {
        if (projectLink) {
          return true;
        } else {
          console.log('Enter a project description please!');
          return false;
        }
      }
    },
    {
      type: 'confirm',
      name: 'feature',
      message: 'would you like to feature this project?',
      default: false
    },
    {
      type: 'confirm',
      name: 'confirmAddProject',
      message: 'Would you like to enter another project?',
      default: false
    }
  ])
  .then(projectData => {
  portfolioData.projects.push(projectData);
    if (projectData.confirmAddProject) {
    return promptProject(portfolioData);
    } else {
    return portfolioData;
    }
  })
}


promptUser()
  .then(promptProject)
  .then(portfolioData => {
    return generatePage(portfolioData);
  })
  .then(pageHTML => {
    return writeFile(pageHTML);
  })
  .then(writeFileResponse => {
    console.log(writeFileResponse);
    return copyFile();
  })
  .then(copyFileResponse => {
    console.log(copyFileResponse);
  })
  .catch(err => {
    console.log(err);
  });



