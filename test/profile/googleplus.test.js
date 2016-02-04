var Profile = require('../../lib/profile/googleplus')
  , fs = require('fs')


describe('GooglePlusProfile.parse', function() {
  
  describe('profile with plus.login scope only', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/googleplus/me.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('');
      expect(profile.name.familyName).to.equal('');
      expect(profile.name.givenName).to.equal('');
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://lh3.googleusercontent.com/-XxXXxxXxXXX/AAAAAAAAAAI/AAAAAAAAAAA/0000xxxxx0X/photo.jpg?sz=50');
    });
  });
  
  describe('profile with profile scope', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/googleplus/me-with-profile.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://lh3.googleusercontent.com/-XxXXxxXxXXX/AAAAAAAAAAI/AAAAAAAAAAA/0000xxxxx0X/photo.jpg?sz=50');
    });
  });
  
  describe('profile with profile and email scope', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/googleplus/me-with-profile-email.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('example@gmail.com');
      expect(profile.emails[0].type).to.equal('account');
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://lh3.googleusercontent.com/-XxXXxxXxXXX/AAAAAAAAAAI/AAAAAAAAAAA/0000xxxxx0X/photo.jpg?sz=50');
    });
  });
  
  describe('profile without name attribute', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/googleplus/me-no-name.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('');
      expect(profile.name).to.be.undefined;
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('https://lh3.googleusercontent.com/-XxXXxxXxXXX/AAAAAAAAAAI/AAAAAAAAAAA/0000xxxxx0X/photo.jpg?sz=50');
    });
  });
  
  describe('profile without image attribute', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/googleplus/me-no-image.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.id).to.equal('111111111111111111111');
      expect(profile.displayName).to.equal('');
      expect(profile.name.familyName).to.equal('');
      expect(profile.name.givenName).to.equal('');
      expect(profile.emails).to.be.undefined;
      expect(profile.photos).to.be.undefined;
    });
  });
  
});