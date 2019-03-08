/* global describe, it, before, expect */
/* jshint expr: true */

var GoogleStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  describe('fetched from Google+ API', function() {
    var strategy = new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://www.googleapis.com/plus/v1/people/me'
      }, function() {});
  
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://www.googleapis.com/plus/v1/people/me') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
    
      var body = '{ \
 "kind": "plus#person",\
 "occupation": "Software Engineer",\
 "gender": "male",\
 "emails": [\
  {\
    "value": "example@gmail.com",\
    "type": "account"\
  }\
 ],\
 "urls": [\
  {\
   "value": "http://www.jaredhanson.net/",\
   "type": "otherProfile",\
   "label": "Jared Hanson"\
  }\
 ],\
 "objectType": "person",\
 "id": "111111111111111111111",\
 "displayName": "Jared Hanson",\
 "name": {\
  "familyName": "Hanson",\
  "givenName": "Jared"\
 },\
 "url": "https://plus.google.com/+JaredHanson",\
 "image": {\
  "url": "https://lh5.googleusercontent.com/-AAAAA-AAAAA/AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/photo.jpg?sz=50",\
  "isDefault": false\
 },\
 "organizations": [\
  {\
   "name": "South Dakota School of Mines & Technology",\
   "type": "school",\
   "primary": false\
  }\
 ],\
 "placesLived": [\
  {\
   "value": "Berkeley, CA",\
   "primary": true\
  }\
 ],\
 "isPlusUser": true,\
 "language": "en",\
 "circledByCount": 77,\
 "verified": false\
}';
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('google');
      
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.emails[0].value).to.equal('example@gmail.com');
      expect(profile.emails[0].type).to.equal('account');
      expect(profile.photos[0].value).to.equal('https://lh5.googleusercontent.com/-AAAAA-AAAAA/AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/photo.jpg?sz=50');
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  describe('fetched from OpenID Connect user info endpoint', function() {
    var strategy = new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
  
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://www.googleapis.com/oauth2/v3/userinfo') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
    
      var body = '{\n "sub": "111111111111111111111",\n "name": "Jared Hanson",\n "given_name": "Jared",\n "family_name": "Hanson",\n "picture": "https://lh3.googleusercontent.com/-AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/photo.jpg",\n "email": "example@gmail.com",\n "email_verified": true,\n "locale": "en"\n}\n';
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('google');
      
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.emails[0].value).to.equal('example@gmail.com');
      expect(profile.emails[0].verified).to.equal(true);
      expect(profile.photos[0].value).to.equal('https://lh3.googleusercontent.com/-AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/photo.jpg');
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  describe('error caused by invalid token when using Google+ API', function() {
    var strategy = new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://www.googleapis.com/plus/v1/people/me'
      }, function() {});
    
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://www.googleapis.com/plus/v1/people/me') { return callback(new Error('incorrect url argument')); }
      
      var body = '{\n "error": {\n  "errors": [\n   {\n    "domain": "global",\n    "reason": "authError",\n    "message": "Invalid Credentials",\n    "locationType": "header",\n    "location": "Authorization"\n   }\n  ],\n  "code": 401,\n  "message": "Invalid Credentials"\n }\n}\n';
      callback({ statusCode: 401, data: body });
    };
      
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('invalid-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('GooglePlusAPIError');
      expect(err.message).to.equal("Invalid Credentials");
      expect(err.code).to.equal(401);
    });
  }); // error caused by invalid token when using Google+ API
  
  describe('error caused by invalid token when using user info endpoint', function() {
    var strategy = new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://www.googleapis.com/plus/v1/people/me'
      }, function() {});
    
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://www.googleapis.com/plus/v1/people/me') { return callback(new Error('incorrect url argument')); }
      
      var body = '{\n "error": "invalid_request",\n "error_description": "Invalid Credentials"\n}\n';
      callback({ statusCode: 401, data: body });
    };
      
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('invalid-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('UserInfoError');
      expect(err.message).to.equal("Invalid Credentials");
      expect(err.code).to.equal('invalid_request');
    });
  }); // error caused by invalid token when using user info endpoint
  
  describe('error caused by malformed response', function() {
    var strategy =  new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
  
    strategy._oauth2.get = function(url, accessToken, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    };
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  }); // error caused by malformed response
  
  describe('internal error', function() {
    var strategy =  new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function verify(){});
    
    strategy._oauth2.get = function(url, accessToken, callback) {
      return callback(new Error('something went wrong'));
    }
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
      expect(err.oauthError).to.be.an.instanceOf(Error);
      expect(err.oauthError.message).to.equal('something went wrong');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // internal error
  
});
