# auth-all

## basic login details
- clientId obtainable from `/app`
- callback must start with `https`

## logging in user with facebook
- GET `/login?clientId=&callback=` to show simple form
- call `/fb?clientId=&callback=` to get redirected
- will return to `${callback_url}#/access_tkn=jwtToken`

## logging in user with email
### logging in
- GET `/login?clientId=&callback=` to show simple form
- POST `/mail?clientId=&callback=&email=&pass=`
- will return to `${callback_url}#/access_tkn=jwtToken`

### creating new acct
- GET `/login?clientId=&callback=` to show simple form
- POST `/mail?clientId=&callback=&email=&newacct=` => ok
- email sent for password setup

### resetting password
- GET `/login?clientId=&callback=` to show simple form
- POST `/mail?email=&reset=reset` => "check email notification"
- GET `/login?reset=xxx` to show simple form
- POST `/mail?email=&pass=&reset=xxx` => "password changed"

## admin features
- header: `Authorization: Bearer <jwt token>`
- `/signin`: redirected to the app page after signin
- `/getSites`: return list of sites
- `/addSite?domain=`: add domain to our account
- `/delSite?site=secret=`: delete a particular site
- `/genSecret?site=secret=`: generate a new secret

## jwt tokens
```
{
    iss: "dateideassg.com",
    sub: "fb_123456",
    iat: 12341211,
    exp: 12341234
}
```

## sites
```
{
    id: "clientId",
    secret: "clientSecret",
    domain: "activeDomain",
    acct_id: tied_to_which_acc
}
```

## setting up
fill in the `process.env` values in `.sample.env`
