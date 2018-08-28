/** server.js * */
const express = require('express');

const admin = require('./libs/server_admin.js');
const service = require('./libs/service.js');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/app', express.static('app/build'));
app.use('/login', express.static('login/build'));

function errFn(res, err) {
  let msg = err;
  if (!process.env.DEBUG || !err) {
    msg = 'woah, watch out there';
  }

  res.status(400);
  res.send(msg);
}

/** fb authentication * */
app.get('/fb', (req, res) => {
  const { code, state } = req.query;
  const { clientId: siteId } = req.query;
  const { callback: callbackURL } = req.query;

  if (!code || !state) {
    if (!siteId || !callbackURL) {
      res.status(400);
      return res.send('woah, watch out right there.');
    }

    return service.fbIntiate(siteId, callbackURL)
      .then(url => res.redirect(url))
      .catch(err => errFn(err, res));
  }
  return service.fbComplete(code, state)
    .then(url => res.redirect(url))
    .catch(err => errFn(res, err));
});

/** mail authentication **/
app.post('/mail', (req, res) => {
  const { clientId: siteId } = req.body;
  const { callback: callbackURL } = req.body;
  const { email, pass } = req.body;
  const { newacct, reset } = req.body;

  if (!siteId || !callbackURL || !email) {
    res.status(400);
    return res.send('woah, watch out right there.');
  }

  if (newacct !== undefined) {
  } else if (reset !== undefined) {
    res.send('right, check you email for the next instruction');
  } else {
    res.send('normal login');
  }
});

/** admin endpoints * */
function extractJwt(req) {
  return req.get('Authorization').split('Bearer ')[1];
}

app.get('/signin', (req, res) => {
  admin.signin(`https://${process.env.HOST}/app`)
    .then(url => res.redirect(url));
});

app.get('/getSites', (req, res) => {
  admin.getSites(extractJwt(req))
    .then(sites => res.send(JSON.stringify(sites)))
    .catch(err => errFn(res, err));
});

app.get('/addSite', (req, res) => {
  const { domain } = req.query;
  if (!domain) { return errFn(res); }

  return admin.addSite(extractJwt(req), domain)
    .then(site => res.send(JSON.stringify(site)))
    .catch(err => errFn(res, err));
});

app.get('/delSite', (req, res) => {
  const { site: siteid, secret } = req.query;
  if (!siteid || !secret) { return errFn(res); }

  return admin.delSite(extractJwt(req), siteid, secret)
    .then(() => res.send(JSON.stringify({})))
    .catch(err => errFn(res, err));
});

app.get('/genSecret', (req, res) => {
  const { site: siteid, secret } = req.query;
  if (!siteid || !secret) { return errFn(res); }

  return admin.genSecret(extractJwt(req), siteid, secret)
    .then(() => res.send(JSON.stringify({})))
    .catch(err => errFn(res, err));
});

const listener = app.listen(3000, () => {
  console.log(`running on port ${listener.address().port}`);
});
