const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: { // User group level, ex, user, mod, admin, superadmin, owner
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

UserSchema.methods.toJSON = function() { // To override what we get returned back
  var user = this;
  var userObject = user.ToObject
  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {  // Instance methods
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString()

  user.tokens.push({access, token});

  return user.save().then(() => { // returns a promise
    return token; // This will get resolved with the token, resolve(token)
  })
};

var User = mongoose.model("User", UserSchema);


module.exports = {User};
