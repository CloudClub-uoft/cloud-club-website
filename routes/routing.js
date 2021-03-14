/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

const routePath = path.resolve(__dirname);

exports.boot = (app, db) => {
  fs.readdirSync(routePath).forEach((file) => {
    if (file !== 'routing.js') {
    // routes/filename, slicing off '.js'
      const cleanPath = `${routePath}/${file.substr(0, file.indexOf('.'))}`;
      const route = path.resolve(cleanPath);
      // load the route
      require(route)(app, db);
    }
  });
};
