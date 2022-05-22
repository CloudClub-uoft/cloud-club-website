/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');

const routePath = path.resolve(__dirname);

exports.boot = (app, db, s3Client) => {
  const routefiles = fs.readdirSync(routePath)
  console.log(`Mounting ${routefiles.length-1} routes:`)
  routefiles.forEach((file) => {
    if (file !== 'routing.js') {
    // routes/filename, slicing off '.js'
      const cleanPath = `${routePath}/${file.substr(0, file.indexOf('.'))}`;
      const route = path.resolve(cleanPath);
      console.log(`- ${route}`);
      // load the route
      require(route)(app, db, s3Client);
    }
  });
};
