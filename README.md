# CloudClub Website
Website for the UofT CloudClub.

# Development

## Requirements

- git [(Download)](https://git-scm.com/downloads) or GitHub Desktop [(Download)](https://desktop.github.com/)
- Node.JS + npm [(Download)](https://nodejs.org/en/download/)
- XAMPP [(Download Here)](https://www.apachefriends.org/)
- Environment variables and MySQL configuration scripts.

## Installation and Startup

1. Either clone this repository using GitHub Desktop (or related software), download as a ZIP and extract, or run `git clone https://github.com/CloudClub-uoft/cloud-club-website` using the terminal and enter your credentials.
2. Install Node.JS dependencies by navigating to the folder using a terminal and executing `npm install`.
3. Launch MySQL instance. (Jump to the database setup section for help with this section.)
4. Create an empty file called `.env`at the root of the cloned repository. The file should be named exactly as .env (pronounced dotenv) and paste in it the environment variables shared by the project administrator.
5. Start the server by executing `node .` in the terminal at the root of the repository.
6. View the webpage by navigating to `localhost:PORT` in your browser. Here `PORT` is a placeholder for the port number specified by the "PORT" variable in the .env file.

## Database setup

[Click Here](./docs/DATABASE.md)

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
