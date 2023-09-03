# CloudClub Website
Website for the UofT CloudClub.

# Development

## General Notes
- if at any point you run into an issue and cannot follow the steps, first look at the Troubleshooting section below. Then, attempt to search up the problem and/or ask the project admin for help :)
- estimated setup time for a total beginner (no experience with web dev, terminal commands, etc.) is 30-45 mins. If you've already spent this much time and are not close to finishing, don't be afraid to ask for help!

## Requirements

- git [(Download)](https://git-scm.com/downloads) or GitHub Desktop [(Download)](https://desktop.github.com/)
  - we recommend using the first option
  - you can leave all the default selections
  - git allows you to clone (download) this repository, make changes, and submit these changes. [Learn more here](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F)
- Node.JS + npm [(Download)](https://nodejs.org/en/download/)
  - you can leave all the default selections
  - Node allows you to run the website server locally and see the changes that you made
- Visual Studio Code [(Download)](https://code.visualstudio.com/)
  - you can leave all the default selections
  - VS Code is a code editor that we recommend you use to make changes to the codebase. It is also the industry standard for professional software engineers.
- XAMPP [(Download Here)](https://www.apachefriends.org/)
  - you can leave all the default selections
  - XAMPP is the database server that allows you to connect the website to a local database for testing
- Environment variables and MySQL configuration scripts.
  - please ask the project admin for this script

## Installation and Startup

**Important: to follow this section first ensure you've installed all requirements in the previous section - git, Node, VS Code, and XAMPP**
1. Either clone this repository using GitHub Desktop (or related software), download as a ZIP and extract, or run `git clone https://github.com/CloudClub-uoft/cloud-club-website` using the terminal and enter your credentials.
   - we recommend using the command line argument `git clone https://github.com/CloudClub-uoft/cloud-club-website`
     1. if you need further guidance for this, go to the Troubleshooting section below
2. Go back to VS Code where you have this project opened. Open up a terminal by clicking on the `Terminal` tab at the top, then `New Terminal`
3. Install Node.JS by typing `npm install` in the terminal, then hit enter
4. Launch MySQL instance using XAMPP. (Jump to the database setup section for help with this section.)
5. Create an empty file called `.env` at the root of the cloned repository (the cloud-club-website folder). The file should be named exactly as .env (pronounced dotenv) and paste in it the environment variables shared by the project administrator.
6. Start the server by executing `node .` in the terminal at the root of the repository.
7. View the webpage by navigating to `localhost:PORT` in your browser. Here `PORT` is a placeholder for the port number specified by the "PORT" variable in the .env file.
   - if you see the CloudClub website - same one as what you see when you navigate to `cloudclub.ca`, then congrats! Your setup is complete
   - Now you can make changes locally and see your changes at `localhost:PORT`
     - for example, in VS Code, go to the file `views/index.ejs`
     - change the line `What is CloudClub?` to `Hello World`, type `Ctrl + S` (Windows) or `Cmd + S` (Mac) to save
     - go to the terminal (recall, it's at the bottom of VS Code) and type `Ctrl + C` (Windows and Mac) to exit
     - use the type `node .` again or use the up-arrow key to restart the server
     - again, navigate to localhost:PORT, but observe this time that the front page heading is changed to `Hello World`
     - follow these steps to undo the changes you made

## Database setup

[Click Here](./docs/DATABASE.md)


## Contributing
**Note:** The sections below will not be necessary for a first-time setup. They will come into play after you start making changes to the website

## Making a Change
- first, make sure your local branch is up-to-date with the remote staging branch
- run `git branch` to verify you are currently on the staging branch
- run `git pull` to update your local branch (this is like "refreshing" your Google Docs to get changes from your teammates)
- run `git checkout -b <branch-name>` to create a new branch and move to that branch
  -  `<branch-name>` should be your name, a verb describing the type of change, and what you're changing, something like `wu_patch_edit_posts`
-  now run `git branch` again to verify you are at this new branch
-  make changes
-  when you are ready to "submit" these changes, do the following:
   -  run `git status` to check the files you've changed. The files you modified should all be in red 
   -  run `git add <file1> <file2> <file3> ...` to stage the files you've changed for commit. Tip: simply copy the files you see from the previous step
   -  run `git commit -m "<your message>"` to commit these files
   -  run `git push` to push the changes to the remote. If you get an error, simply follow the instructions and specify an upstream branch
   -  navigate to https://github.com/CloudClub-uoft/cloud-club-website and create a Pull Request
## Frontend Testing

The Selenium framework for Python is required for frontend testing. During tests a properly configured MySQL instance should be accessible by the website server.

```
python -m pip install selenium
```

__NOTE__: A Selenium webdriver must be accessible via the PATH variable. [Documentation.](https://selenium-python.readthedocs.io/installation.html#drivers)

All frontend tests are stored under the test/frontend directory. A test can be invoked by executing the test script inside one of the test directories.

```
python test_forum.py
```

# Development

## Linting and Coding Standards

Review Code Formatting and Standards Document. [Link](https://docs.google.com/document/d/1XDSY4zko2UkI1lpOo0oyULxdoP_LIxU53pjhIaK3F0g/edit?usp=sharing)

Setup VSCode workspace for linting and formatting. [Link (Slide 12)](https://docs.google.com/presentation/d/1toRJaFMjc6QkshXTYEmDK2pbZYMErbap/edit?usp=sharing&ouid=105420304599598918292&rtpof=true&sd=true)

### API Documentation

- API Name: `METHOD-name`, i.e. `GET-post`
- Parameters in API tag: `/name?param=:PLACEHOLDER`, i.e. `/post?id=:POSTID`
- Status codes in parentheses, (Success code defaults to 200)
- Nested return data: organize via variable names on multiple lines, i.e. object `data` has `data.field`
- Pass DB and Redis connection objects to each routing file: module export arrow functions should have ALL parameters. I.e. `module.exports = (app, db, redis) => { ... }` even if the function doesn't use DB or Redis connections. Do `require` in `routing.js` and pass to all imported route files.

## Archived Readmes

[Click here](./docs/ARCHIVED.md)


### Troubleshooting
1. after running `node .`, I'm getting this redis error:

```
Redis connection failed: Error: Redis connection to redis-17266.c8.us-east-1-2.ec2.cloud.redislabs.com:17266 failed - getaddrinfo ENOTFOUND redis-17266.c8.us-east-1-2.ec2.cloud.redislabs.com
```
- this error exists when the Redis account is deactivated. Please contact the project admin for help.
2. how do I open VS Code?
- click on the serach bar at the bottom of your computer (Windows) or type `command + space bar` (Mac), search for `Visual Studio Code`
- click on the two file button near the top-left of VS Code, then click Open Folder
- navigate to the cloud-club-website folder that you've cloned from GitHub and open
  
3. Where do I run git clone command?
- For both windows and Mac, we run commands in the Terminal (for windows this is sometimes called the Command Prompt)
- For windows:
    1. navigate to the directory you wish to put this repository in
    2. right click a blank space in the directory and click `Open in Terminal`
    3. run the git clone command
    4. if you have VS Code (you should), open it to the folder of the cloud-club-website project that you just cloned
- For Mac:
    1. open the terminal (type `command + space bar` and search for terminal, click enter)
    2. navigate to the directory you wish to put this repository in by using `cd <directory>`. For example, if you wish to put it in the Documents directory you would type `cd Documents`
    3. run the git clone command
    4. if you have VS Code (you should), open it to the folder of the cloud-club-website project that you just cloned
   
4. This error:

```
C:\Users\qingy\OneDrive\Documents\webDev\cloud-club-website\config\sql-db.js:16
        if (err) throw err
                 ^

Error: connect ENOENT 3306
    at PipeConnectWrap.afterConnect [as oncomplete] (net.js:1148:16) {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'connect',
  address: '3306,
  fatal: true
}
```
Make sure XAMPP is enabled!