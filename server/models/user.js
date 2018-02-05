var mongoose = require("mongoose");

var User = mongoose.model("User", {
  email: {
    required: true,
    type: String,
    minlength: 1,
    trim: true
  }
});


module.exports = {User};
