const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  // Expect Mongoose Object here
  const sessionObj = {
    passport: {
      user: user._id.toString()
    }
  }
  // Encode session object to a session string
  const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');
  // Create session signature using Keygrip
  const sig = keygrip.sign('session=' + session);
  return( { session, sig });
}