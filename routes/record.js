const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  // console.log("Total");
  let collections = String(req.query.resources);
  let db_connect = dbo.getDb("account-system");
  let search = {};
  let where="";
  if(typeof req.query.accountid !== 'undefined')
  {
    where = String(req.query.accountid);
    search = {accountid: where};
  }
  if(typeof req.query.email !== 'undefined')
  {
    where = String(req.query.email);
    let where2 = String(req.query.password);
    search = {email: where, password: where2};

  }
  

  // console.log(search);
  db_connect
    .collection(collections)
    .find(search)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  // console.log("here");
  let collections = String(req.query.resources);
  let db_connect = dbo.getDb("account-system");

  // let db_connect = dbo.getDb();
  let myquery = { accountid: ObjectId( req.params.id )};
  db_connect
      .collection(collections)
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
recordRoutes.route("/record/add/:id/:resources").post(function (req, response) {
  let db_connect = dbo.getDb();
  // let myobj = {
  //   name: req.body.person_name,
  //   position: req.body.person_position,
  //   level: req.body.person_level,
  // };
  let collections = req.params.resources;
  let id = req.params.id;
  let myobj = null;
  if(id !== "0")
  {
    myobj = {accountid: id, expense: req.body};
  }else{
    myobj = req.body;
  }
  console.log(myobj);
  db_connect.collection(collections).insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      person_name: req.body.person_name,
      person_position: req.body.person_position,
      person_level: req.body.person_level,
    },
  };
  db_connect
    .collection("records")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;