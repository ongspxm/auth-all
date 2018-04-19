# auth-all

## logging in user with facebook
- call `/fb?redirect_uri=...` to get redirected
- will return to `...#/access_tkn=jwtToken`

## jwt tokens
```
{
    iss: "dateideassg.com",
    sub: "fb_123456",
    iat: 12341211,
    exp: 12341234
}
```

## setting up
fill in the process.env values in .sample.env
