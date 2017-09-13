const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  providerId: { type: String },
  passwordHash: { type: String }
});

userSchema.plugin(findOrCreate);

userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

userSchema.methods.validatePassword = function(password){
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.statics.authenticate = function(username, password){
  return(
    User.findOne({ username: username })
    .then(user => {
      if (user && user.validatePassword(password)) {
        return user;
      } else {
        return null;
      }
    })
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
