# auth-all

## logging in user with facebook
- call `/fb?clientId=&callback=` to get redirected
- will return to `...#/access_tkn=jwtToken`

## admin features
- header: `Authorization: Bearer <jwt token>`
- `/signin`: redirected to the app page after signin
- `/getSites`: return list of sites
- `/addSite?domain=`: add domain to our account
- `/delSite?site=secret=`: delete a particular site

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
