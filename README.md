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

###### TypeScript support

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
application's OAuth 2.0 redirect endpoint.  If you are using the [example](https://github.com/passport/todos-express-google-oauth2)
app, enter `http://localhost:3000/oauth2/redirect/google`.

9. Click **Create** to create the OAuth client.  The following screen will
display your client ID and secret.  Proceed to [configure the strategy](#configure-strategy).

#### Configure Strategy

Once you've [registered your application](#register-application), the strategy
needs to be configured with your application's client ID and secret, along with
its OAuth 2.0 redirect endpoint.

The strategy takes a `verify` function as an argument, which accepts
`accessToken`, `refreshToken`, and `profile` as arguments.  `accessToken` and
`refreshToken` are used for API access, and are not needed for authentication.
`profile` contains the user's [profile information](https://www.passportjs.org/reference/normalized-profile/)
stored in their Google account.  When authenticating a user, this strategy uses
the OAuth 2.0 protocol to obtain this information via a sequence of redirects
and API requests to Google.

The `verify` function is responsible for determining the user to which the
Google account belongs.  In cases where the account is logging in for the
first time, a new user record is typically created automatically.  On subsequent
logins, the existing user record will be found via its relation to the Google
account.

Because the `verify` function is supplied by the application, the app is free to
use any database of its choosing.  The example below illustrates usage of a SQL
database.

```javascript
var GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://www.example.com/oauth2/redirect/google',
    scope: [ 'profile' ],
    state: true
  },
  function(accessToken, refreshToken, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      'https://accounts.google.com',
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      if (!cred) {
        // The account at Google has not logged in to this app before.  Create a
        // new user record and associate it with the Google account.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }

          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            'https://accounts.google.com',
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The account at Google has previously logged in to the app.  Get the
        // user record associated with the Google account and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
    };
  }
));
```

#### Define Routes

Two routes are needed in order to allow users to log in with their Google
account.  The first route redirects the user to the Google, where they will
authenticate:

```js
app.get('/login/google', passport.authenticate('google'));
```

The second route processes the authentication response and logs the user in,
after Google redirects the user back to the app:

```js
app.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });
```

## Documentation

Refer to [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2/)
for more information on integrating your application with Google APIs using
OAuth 2.0.

## Examples

* [todos-express-google-oauth2](https://github.com/passport/todos-express-google-oauth2)

  Illustrates how to use the Google strategy within an [Express](https://expressjs.com/)
  application.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2022 Jared Hanson <[https://www.jaredhanson.me/](https://www.jaredhanson.me/)>
