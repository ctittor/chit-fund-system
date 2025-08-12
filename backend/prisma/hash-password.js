const bcrypt = require('bcrypt');

const saltRounds = 10;
const plainPassword = 'Admin123#';

bcrypt.genSalt(saltRounds, function(err, salt) {
  if (err) throw err;
  bcrypt.hash(plainPassword, salt, function(err, hash) {
    if (err) throw err;
    console.log('Hashed password:', hash);
  });
});
