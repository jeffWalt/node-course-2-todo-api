const expect = require("expect");
const request = require("supertest");

var {app} = require("./../server");
var {Todo} = require("./../models/todo");

beforeEach((done) => { // Runs everytime there is a test case called
  Todo.remove({}).then(() => done());
});

describe("POST /todos", () =>{
  it("should create a new todo", (done) => {
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

        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0)
          done()
        }).catch((error) => done(error));
      });
  });
});
