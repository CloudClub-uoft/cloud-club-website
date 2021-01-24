# CloudClub Website
Website for the UofT CloudClub.

# Development

## Requirements

- git [(Download)](https://git-scm.com/downloads) or GitHub Desktop [(Download)](https://desktop.github.com/)
- Node.JS + npm [(Download)](https://nodejs.org/en/download/)

## Installation

1. Either clone this repository using GitHub Desktop (or related software), download as a ZIP and extract, or run `git clone https://github.com/CloudClub-uoft/cloud-club-website` using the terminal and enter your credentials.
2. Install Node.JS dependencies by navigating to the folder using a terminal and executing `npm install`.

## Testing

3. Start the server by executing `node .` in the terminal.
4. View the webpage by navigating to `localhost` in your browser.

# Development

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
  - [ ] Game screenshot graphics clarity
  - [ ] Center footer
  - [ ] Formatting the project snippets (centering image/title, padding textbox)
- [X] Team page - Jayden
  - [ ] Mobile hamburger nav not working
  - [X] Header ("Our Team")
  - [X] Profile images stretch/squish
  - [X] Proper nav tab highlight
- [ ] Nav to login and register - Tamim
- [X] Login and Register - Jayden
  - [X] Register page layout broken
- [ ] Project page - Ian
  - [ ] Typos?
  - [ ] Tiled images - centering? or other fix?
- [ ] Transfer all pages to EJS
  - [ ] Header and footer directives

## Backend

- [X] Static Routing (`public` folder)
  - [X] Create our server `index.js`
  - [X] Import Express, create server (See Express.js Quickstart)
  - [X] Create new folder `public`
  - [X] Static routing ALL to `public` folder (See Express.js Documentation)

- [X] Express.js SQL API
  - [X] Login - POST body has `username`, `password` -> fetch matching credentials from DB, compare, return
  - [x] Team Members - GET list of CloudClub team members, return
  - [x] Registration - POST body has `username`, `password`, `email`, and `fullname`
    - [x] Check DB for existing credentials with matching username or email (code 409 if conflict)
    - [x] Check password validity: minimum length of 8, has lower and uppercase, numbers, and symbols (40X if failed)
    - [x] `INSERT * INTO users ({username}, ... )` [(Reference)](https://www.w3schools.com/sql/sql_insert.asp)
    - [x] Build response: 50X for SQL error, 201 for successful creation