const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testId;

suite("Functional Tests", function () {
  // POST FULL --------------------------------------------------------------
  test("Create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "title",
        issue_text: "text",
        created_by: "creator",
        assigned_to: "assignee",
        status_text: "status",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(res.body.created_by, "creator");
        assert.equal(res.body.assigned_to, "assignee");
        assert.equal(res.body.status_text, "status");
        testId = res.body._id;
        done();
      });
  });

  // POST REQUIRED ONLY ----------------------------------------------------
  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "only title",
        issue_text: "only text",
        created_by: "only creator",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "only title");
        assert.equal(res.body.issue_text, "only text");
        assert.equal(res.body.created_by, "only creator");
        done();
      });
  });

  // POST MISSING REQUIRED --------------------------------------------------
  test("Create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "",
        issue_text: "",
        created_by: "",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  // GET ALL ---------------------------------------------------------------
  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.isArray(res.body);
        done();
      });
  });

  // GET WITH FILTER --------------------------------------------------------
  test("View issues with a filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .query({ created_by: "creator" })
      .end(function (err, res) {
        assert.isArray(res.body);
        done();
      });
  });

  // GET WITH MULTIPLE FILTERS ----------------------------------------------
  test("View issues with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .query({
        created_by: "creator",
        status_text: "status",
      })
      .end(function (err, res) {
        assert.isArray(res.body);
        done();
      });
  });

  // PUT UPDATE ONE FIELD ---------------------------------------------------
  test("Update one field on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: testId,
        issue_text: "updated text",
      })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, testId);
        done();
      });
  });

  // PUT MULTIPLE FIELDS ----------------------------------------------------
  test("Update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: testId,
        issue_text: "upd 1",
        issue_title: "upd 2",
      })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });

  // PUT MISSING _ID --------------------------------------------------------
  test("Update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        issue_title: "fail",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  // PUT NO FIELDS ----------------------------------------------------------
  test("Update an issue with no fields sent", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: testId })
      .end(function (err, res) {
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });

  // PUT INVALID _ID --------------------------------------------------------
  test("Update an issue with invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "123456789012",
        issue_text: "test",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not update");
        done();
      });
  });

  // DELETE SUCCESS ---------------------------------------------------------
  test("Delete an issue", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: testId })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully deleted");
        done();
      });
  });

  // DELETE INVALID _ID -----------------------------------------------------
  test("Delete an issue with invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: "123456789012" })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not delete");
        done();
      });
  });

  // DELETE MISSING _ID -----------------------------------------------------
  test("Delete an issue with missing _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({})
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
