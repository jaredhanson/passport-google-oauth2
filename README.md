# passport-google-oauth20

[Passport](https://www.passportjs.org/) strategy for authenticating with
[Google](https://www.google.com/) using OAuth 2.0.

This module lets you authenticate using Google in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](https://github.com/senchalabs/connect#readme)-style middleware,
including [Express](https://expressjs.com/).

---

<p align="center">
  <sup>Advertisement</sup>
  <br>
  <a href="https://click.linksynergy.com/link?id=D*o7yui4/NM&offerid=507388.922484&type=2&murl=https%3A%2F%2Fwww.udemy.com%2Fcourse%2Fthe-complete-nodejs-developer-course-2%2F&u1=21vl3Skt2fz9CZkPcetSToKITTB1Zqdi0ZpnMwjAMqG7p2N3J2BC5">The Complete Node.js Developer Course</a><br>Learn Node. js by building real-world applications with Node, Express, MongoDB, Jest, and more!
</p>

---

## Install

```sh
$ npm install passport-google-oauth20
```

#### TypeScript support

```sh
$ npm install @types/passport-google-oauth20
```

## Usage

#### Create an Application

Before using `passport-google-oauth20`, you must register an application with
Google.  If you have not already done so, a new project can be created in the
[Google Developers Console](https://console.developers.google.com/).
Your application will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to configure a redirect URI which
matches the route in your application.

#### Configure Strategy

The Google authentication strategy authenticates users using a Google account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Google profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```javascript
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'google'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  ```

## Examples

* [express-4.x-google-oauth2-example](https://github.com/passport/express-4.x-google-oauth2-example)

  Illustrates how to use the Google strategy within an [Express](https://expressjs.com)
  application.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2021 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
