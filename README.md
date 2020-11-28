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

Consistent fonts, color scheme, etc.

- [ ] **Header** - Adam and Ansh
  - [ ] Team logo
  - [ ] Team name
  - [ ] Navigation bar (use placeholders for now)
  - [ ] Scrolls with page
  - [ ] ...
- [ ] **Footer** - Adam and Ansh
  - [ ] Social media links
  - [ ] Contact emails
  - [ ] ...
- [ ] **Home Page Content** - Tamim and Ian
  - [ ] "Banner"
  - [ ] Introductory paragraph
  - [ ] "Learn more", "get involved", etc. promotional material
  - [ ] ...

## Backend

- [X] Static Routing (`public` folder)
  - [X] Create our server `index.js`
  - [X] Import Express, create server (See Express.js Quickstart)
  - [X] Create new folder `public`
  - [X] Static routing ALL to `public` folder (See Express.js Documentation)

- [X] Express.js SQL API
  - [X] Login - POST body has `username`, `password` -> fetch matching credentials from DB, compare, return
  - [x] Team Members - GET list of CloudClub team members, return

For each of the SQL Route tasks, I recommend taking the following approach. Remember - we're building an API here!

- What **functionality** am I aiming to achieve? (i.e. checking login credentials)
- What kind of **request** is being made? What **data** is included, if any? (i.e. POST request with username and password)
- Where in the API should I put an Express route sub-address (aka "**endpoint**")? (i.e. '/login')
- What kind of **interactions** am I going to have with the SQL database? (i.e. data retrieval for an entry with a given username)
- What SQL **commands** do I use to achieve this? (Check *W3Schools* or another reference)
- Am I making any **comparisons** or decisions with this data? (i.e. comparing given credentials to those in database)
- What is my **response** to the client? (i.e. status code 200 'OK' with user info on success, OR status code 403 'Forbidden' with more error details)
