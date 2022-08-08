# CloudClub Website
Website for the UofT CloudClub.

# Development

## Requirements

- git [(Download)](https://git-scm.com/downloads) or GitHub Desktop [(Download)](https://desktop.github.com/)
- Node.JS + npm [(Download)](https://nodejs.org/en/download/)
- XAMPP [(Download Here)](https://www.apachefriends.org/)
- Environment variables and MySQL configuration scripts.

## Database setup

[Click Here](./docs/DATABASE.md)

## Installation and Startup

1. Either clone this repository using GitHub Desktop (or related software), download as a ZIP and extract, or run `git clone https://github.com/CloudClub-uoft/cloud-club-website` using the terminal and enter your credentials.
2. Install Node.JS dependencies by navigating to the folder using a terminal and executing `npm install`.
3. Launch MySQL instance. (Jump to the database setup section for help with this section.)
4. Start the server by executing `node .` in the terminal.
5. View the webpage by navigating to `localhost` in your browser.

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

## Frontend

### V1

Consistent fonts, color scheme, etc.

- [X] **Header** - Jayden and Lavanya
  - [X] Working Nav links
- [X] **Footer** - Adam and Ansh
  - [X] Social media links
  - [X] Contact emails
- [X] **Home Page Content** - Tamim and Ian
  - [X] "Banner"
  - [X] Introductory paragraph
  - [X] Set up carousel
  - [X] Add game screenshots to carousel
- [ ] **Login and Register** - Tamim and Ian
  - [X] Login page (username and password)
  - [X] Register page (username, first name, last name, email, password, confirm password)
  - [ ] Functionality and login persistence
  - [ ] User/account settings page
- [X] **Team Page Content** - Lavaya and Yunjia
  - [X] Team headshots and bios, grid of "cards" (See Bootstrap's Album example)

### V2
- [ ] Landing Page - Lavanya & Adam
  - [X] Center footer
  - [X] Formatting the project snippets (centering image/title, padding textbox)
  - [X] (Shayshu) Add dungeon crawler snippet + image
- [X] Team page - Jayden
  - [X] Mobile hamburger nav not working
  - [X] Header ("Our Team")
  - [X] Profile images stretch/squish
  - [X] Proper nav tab highlight
- [X] Login and Register - Jayden
  - [X] Register page layout broken
- [X] Project page - Ian
  - [X] Typos?
  - [X] Tiled images - centering? or other fix?
- [ ] Container Page for Dungeon Crawler
  - [ ] Issues/request/feedback on the sidebars


### EJS Transition
- [X] EJS - Matthew and Harsimrat
  - [X] EJS Tutorial(s)
  - [X] Every page needs navbar item to login and register pages
  - [X] Copy Harsimrat's example
    - [X] Header (w/ `active` selection), footer
    - [X] assets directories (CSS, JS)
  - [ ] Build forum page in EJS
    - [ ] Fake data object (faker.js) - JSON array of posts: `[ {'subject' : 'POST 1' } ]) {`
    - [ ] Pass to page via `render`
    - [ ] Build divs from that

### Forum

[Example](https://forums.technicpack.net/forum/7-off-topic-discussion/)

- [ ] Thread
  - [X] Thread title and description - Tamim and Yunjia
  - [X] Post - Bootstrap Table - Ian, Jonathan, Leo
    - [ ] Data
      - [ ] JS API fetch (for now just have a fake object)
      - [ ] For each entry in the JSON object, create a row element in the table DOM
    - [ ] Structure
      - [X] Post subject line/title
      - [X] View count
      - [X] Reply count
      - [X] User who posted
      - [X] Timestamp
      - [X] Posts per page
      - [X] Page selection
      - [X] Sorting (will have to discuss format further, and if doing server-side/client-side processing)
- [X] View Single Post - Leo (Harsimrat)
- [X] New Post - Harsimrat

## Backend

- [X] Static Routing (`public` folder)
  - [X] Create our server `index.js`
  - [X] Import Express, create server (See Express.js Quickstart)
  - [X] Create new folder `public`
  - [X] Static routing ALL to `public` folder (See Express.js Documentation)

- [X] Express.js SQL API
  - [X] Login - POST body has `username`, `password` -> fetch matching credentials from DB, compare, return
  - [ ] Tokens and Persistence - Matt
- [x] Team Members - GET list of CloudClub team members, return
- [x] Registration - POST body has `username`, `password`, `email`, and `fullname`
  - [x] Check DB for existing credentials with matching username or email (code 409 if conflict)
  - [x] Check password validity: minimum length of 8, has lower and uppercase, numbers, and symbols (40X if failed)
  - [x] `INSERT * INTO users ({username}, ... )` [(Reference)](https://www.w3schools.com/sql/sql_insert.asp)
  - [x] Build response: 50X for SQL error, 201 for successful creation
- [X] Forum SQL API
  - [X] Delete Post - Harsimrat
  - [X] Report Post - Harsimrat
  - [X] New Post
    - [X] Create table - Jayden
      - [X] Post ID (internally generated)
      - [X] User ID (token/metadata)
      - [X] Subject line (Plaintext)
      - [X] Body (Markdown text)
      - [X] Timestamp (internally generated)
    - [X] Check auth token (must be logged in to create a new post, if not return 401 forbidden)
    - [X] Check for all necessary data fields and types (see SQL table)
    - [X] Create new table entry, return 201 Created
  - [X] Get All Posts Summary
    - [X] Response
      - [X] Post Title
      - [X] Post ID
      - [X] Post Timestamp
      - [X] User ID
  - [X] Get Single Post by ID
    - [X] Request - query parameters
    - [X] Response
      - [X] Post Body
      - [X] etc.
- [X] Login Session Management - Matt
  - [X] Make sure it works -> pull request
  - [X] Migrate to a server-side session approach, see Harsimrat's resources
  - [X] Build redis cache DB
- [ ] Game High Score API - Jayden
  - [X] Build Table
    - [X] Username
    - [X] Score
    - [X] Date
  - [ ] Get Top N Highest Scores
    - [ ] Check N is reasonable
    - [ ] Get
    - [ ] Return
  - [x] Team Members - GET list of CloudClub team members, return
  - [x] Registration - POST body has `username`, `password`, `email`, and `fullname`
    - [x] Check DB for existing credentials with matching username or email (code 409 if conflict)
    - [x] Check password validity: minimum length of 8, has lower and uppercase, numbers, and symbols (40X if failed)
    - [x] `INSERT * INTO users ({username}, ... )` [(Reference)](https://www.w3schools.com/sql/sql_insert.asp)
    - [x] Build response: 50X for SQL error, 201 for successful creation
- [X] API Documentation

### API Documentation

- API Name: `METHOD-name`, i.e. `GET-post`
- Parameters in API tag: `/name?param=:PLACEHOLDER`, i.e. `/post?id=:POSTID`
- Status codes in parentheses, (Success code defaults to 200)
- Nested return data: organize via variable names on multiple lines, i.e. object `data` has `data.field`
- Pass DB and Redis connection objects to each routing file: module export arrow functions should have ALL parameters. I.e. `module.exports = (app, db, redis) => { ... }` even if the function doesn't use DB or Redis connections. Do `require` in `routing.js` and pass to all imported route files.
