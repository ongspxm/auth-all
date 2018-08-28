/* setup.js */
const dbase = require('./libs/dbase.js');

module.exports = dbase.setup()
  .then(() => dbase.delete('sites', 'acct_id=?', [-1]))
  .then(() => dbase.insert('sites', {
    domain: process.env.HOST,
    id: process.env.APP_ID,
    secret: process.env.APP_SC,
    acct_id: -1,
  }))
  .then(() => console.log('database done'));
