# passport-google-oauth20

[Passport](https://www.passportjs.org/) strategy for authenticating with
[Google](https://www.google.com/) using [OAuth 2.0](https://www.passportjs.org/packages/passport-oauth2/).

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

#### Register Application

The Google strategy authenticates users using their Google account.  Before your
application can make use of Google's authentication system, you must first
[register](https://support.google.com/cloud/answer/6158849) your app to use
OAuth 2.0 with Google APIs.  Once registered, a client ID and secret will be
issued which are used by Google to identify your app.  To register, complete the
following steps:

1. Go to the [Google Cloud Platform console](https://console.cloud.google.com/).

2. From the projects list, select a project or create a new one.

3. Navigate to the [APIs & Services](https://console.cloud.google.com/apis) page
and select [Credentials](https://console.cloud.google.com/apis/credentials).

4. If you have an existing application, it will be listed under **OAuth 2.0
Client IDs**.  Click **Edit OAuth client** to obtain the client ID and secret,
and proceed to [configure the strategy](#configure-strategy).  Otherwise,
continue.

5. If you have not already done so, [configure](https://support.google.com/cloud/answer/10311615)
the [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent).
Select **External** to make your application available to any user with a Google
account.  Complete the app registration process by entering the app name,
support email, and developer contact information.

6. Click **Create Credentials**, then select **OAuth client ID**.

7. Select **Web application** as **Application type**.

8. Click **Add URI** under **Authorized Redirect URIs**.  Enter the URL of your
application's OAuth 2.0 redirect endpoint.  If you are using the example app,
enter `http://localhost:3000/oauth2/redirect/accounts.google.com`.

9. Click **Create** to create the OAuth client.  The following screen will
display your client ID and secret.  Proceed to [configure the strategy](#configure-strategy).

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

#### Define Routes

Two routes are needed in order to allow users to log in with their Google
account.  The first route redirects the user to the Google, where they will
authenticate:

```js
app.get('/login/google',
  passport.authenticate('google', { scope: ['profile'] }));
```

The second route processes the authentication response and logs the user in,
after Google redirects the user back to the app:

```js
app.get('/oauth2/redirect/accounts.google.com',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
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
