"use strict";

const mongoose = require("mongoose");

let dbConnected = false;

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      dbConnected = true;
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.error(
        "The API will return errors until MONGO_URI is configured correctly.",
      );
    });
} else {
  console.warn("MONGO_URI environment variable is not set.");
  console.warn("The Issue Tracker API requires MongoDB to function.");
  console.warn("Please set MONGO_URI in your environment variables.");
}

const IssueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  open: Boolean,
  created_on: Date,
  updated_on: Date,
  project: String,
});

const Issue = mongoose.model("Issue", IssueSchema);

function checkDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "database unavailable",
      message:
        "MongoDB is not connected. Please configure MONGO_URI environment variable.",
    });
  }
  next();
}

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    // GET ----------------------------------------------------------------------
    .get(checkDatabaseConnection, async function (req, res) {
      let project = req.params.project;
      let filter = req.query;
      filter.project = project;

      try {
        let issues = await Issue.find(filter).select("-__v");
        res.json(issues);
      } catch (err) {
        res.status(500).json({ error: "database error", message: err.message });
      }
    })

    // POST ---------------------------------------------------------------------
    .post(checkDatabaseConnection, async function (req, res) {
      let project = req.params.project;

      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const issue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        project,
      });

      try {
        let saved = await issue.save();
        res.json({
          _id: saved._id,
          issue_title: saved.issue_title,
          issue_text: saved.issue_text,
          created_by: saved.created_by,
          assigned_to: saved.assigned_to,
          status_text: saved.status_text,
          open: saved.open,
          created_on: saved.created_on,
          updated_on: saved.updated_on,
        });
      } catch (err) {
        res.status(500).json({ error: "database error", message: err.message });
      }
    })

    // PUT -----------------------------------------------------------------------
    .put(checkDatabaseConnection, async function (req, res) {
      const { _id, ...fields } = req.body;

      if (!_id) return res.json({ error: "missing _id" });
      if (!mongoose.Types.ObjectId.isValid(_id))
        return res.json({ error: "could not update", _id });

      let updateFields = {};
      Object.keys(fields).forEach((k) => {
        if (fields[k] !== "") updateFields[k] = fields[k];
      });

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: "no update field(s) sent", _id });
      }

      updateFields.updated_on = new Date();

      try {
        let updated = await Issue.findByIdAndUpdate(_id, updateFields, {
          new: true,
        });
        if (!updated) return res.json({ error: "could not update", _id });

        res.json({ result: "successfully updated", _id });
      } catch (err) {
        res.json({ error: "could not update", _id });
      }
    })

    // DELETE --------------------------------------------------------------------
    .delete(checkDatabaseConnection, async function (req, res) {
      const { _id } = req.body;

      if (!_id) return res.json({ error: "missing _id" });
      if (!mongoose.Types.ObjectId.isValid(_id))
        return res.json({ error: "could not delete", _id });

      try {
        const deleted = await Issue.findByIdAndDelete(_id);
        if (!deleted) return res.json({ error: "could not delete", _id });

        res.json({ result: "successfully deleted", _id });
      } catch (err) {
        res.json({ error: "could not delete", _id });
      }
    });
};
