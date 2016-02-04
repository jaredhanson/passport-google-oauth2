var Profile = require('../../lib/profile/openid')
  , fs = require('fs')


describe('OpenIDProfile.parse', function() {
    
  describe('profile with profile scope', function() {
    var profile;
    
    before(function(done) {
      fs.readFile('test/fixtures/userinfo/userinfo-with-profile.json', 'utf8', function(err, data) {
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
      expect(profile.photos).to.have.length(1);
      expect(profile.emails).to.be.undefined;
      expect(profile.photos[0].value).to.equal('https://lh3.googleusercontent.com/-XxXXxxXxXXX/AAAAAAAAAAI/AAAAAAAAAAA/0000xxxxx0X/photo.jpg');
    });
  });
  
});