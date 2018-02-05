const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

var {app} = require("./../server");
var {Todo} = require("./../models/todo");

const todos = [
  {_id: new ObjectID, text: "First test todo"},
  {_id: new ObjectID, text: "Second test todo"}
];
beforeEach((done) => { // Runs everytime there is a test case called
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); // This returns a call back so we can chain promises
  }).then(() => {
    done();
  })
});

describe("POST /todos", () =>{
  it("Should create a new todo", (done) => {
    var text = "Test todo text";
    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((error, res) => { // See if request was errored, if not then check if the database has our document that we inputted
        if (error) return done(error) // Will print the error

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it("Should not create todo with invalid data", (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)

      .end((error, res) => {
        if (error) return done(error)

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done()
        }).catch((error) => done(error));
      });
  });
});

describe("GET /todos", () => {
  it("Should get all todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
    .end(done);
  });
});

describe("GET todos/:id/", () => {
  it("Should return todo doc", (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done)
  });

  it("Should return 404 if todo is not found", (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("Should return a 404 for non-object IDS", (done) => {
    request(app)
      .get("/todos/1")
      .expect(404)
      .end(done);
  });
});
