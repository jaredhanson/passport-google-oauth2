# passport-google-oauth20

[Passport](http://passportjs.org/) strategy for authenticating with [Google](http://www.google.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Google in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

[![npm](https://img.shields.io/npm/v/passport-google-oauth20.svg)](https://www.npmjs.com/package/passport-google-oauth20)
[![build](https://img.shields.io/travis/jaredhanson/passport-google-oauth2.svg)](https://travis-ci.org/jaredhanson/passport-google-oauth2)
[![coverage](https://img.shields.io/coveralls/jaredhanson/passport-google-oauth2.svg)](https://coveralls.io/github/jaredhanson/passport-google-oauth2)
[...](https://github.com/jaredhanson/passport-google-oauth2/wiki/Status)

## Install

```bash
$ npm install passport-google-oauth20
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

In order to add Google-specific authorization parameters to the google authoriztion
URI, the `passport.authenticate` middleware can be given the google options in the 
2nd parameter like so:

```javascript
app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    prompt: 'select-account',
    hd: '',
    loginHint: '',
    accessType: '',
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  ```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and Google
use OAuth 2.0, the code is similar.  Simply replace references to Facebook with
corresponding references to Google.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
