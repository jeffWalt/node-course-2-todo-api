const express = require("express");
const bodyParser = require('body-parser');
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();
app.use(bodyParser.json()); //Middleware

app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (error) => {
    res.status(400).send(error);
  });
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    return res.send({todo});
  }, (e) => {
    return res.status(400).send(e);
  }).catch((e) => console.log(e))
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = {app};
