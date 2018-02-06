const express = require("express");
const bodyParser = require('body-parser');
const {ObjectID} = require("mongodb");
const _ = require("lodash");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

const port = process.env.PORT || 3000

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

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]) // This disallows the user to change the completedAt because we don't include it

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => res.status(404).send());
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = {app};
