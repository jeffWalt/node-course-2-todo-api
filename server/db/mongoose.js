var mongoose = require("mongoose");

mongoose.Promise = global.Promise // Sets it so we can use promises for mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp");

module.exports = {mongoose};
