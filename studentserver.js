//studentserver.js

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));

/**
 * Takes in data about a student, and saves it to a folder in a json file type..
 * @constructor
 * @param {folder} - Holds the location of where the json data where be stored
 * @param {function(req, re)} - Takes in the request of the API, and returns the data depending on the type of request.
 */
app.post('/students', function(req, res) {
  var record_id = new Date().getTime();

  var obj = {};
  obj.record_id = record_id;
  obj.first_name = req.body.first_name;
  obj.last_name = req.body.last_name;
  obj.gpa = req.body.gpa;
  obj.enrolled = req.body.enrolled;

  var str = JSON.stringify(obj, null, 2);

  fs.writeFile("students/" + record_id + ".json", str, function(err) {
    var rsp_obj = {};
    if(err) {
      rsp_obj.record_id = -1;
      rsp_obj.message = 'error - unable to create resource';
      return res.status(200).send(rsp_obj);
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'successfully created';
      return res.status(201).send(rsp_obj);
    }
  }); //end writeFile method
  
}); //end post method

/**
 * This particuar function is a get request, in which the API requests information based on a certain parameter in the JSON file.
 * For this get request, we will just be returning the json data based on the record id of each student.
 * @constructor
 * @param {/students/:record_id} - The location of the record IDS, which is the variable that we will be retrieving 
 * information from.
 * @param {function(req, re)} - Takes in the request of the API, and returns the data depending on the type of request.
 */
app.get('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;

  fs.readFile("students/" + record_id + ".json", "utf8", function(err, data) {
    if (err) {
      var rsp_obj = {};
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    } else {
      return res.status(200).send(data);
    }
  });
}); 

function readFiles(files,arr,res) {
  fname = files.pop();
  if (!fname)
    return;
  fs.readFile(fname, "utf8", function(err, data) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    } else {
      arr.push(JSON.parse(data));
      if (files.length == 0) {
        var obj = {};
        obj.students = arr;
        return res.status(200).send(obj);
      } else {
        readFiles(files,arr,res);
      }
    }
  });  
}

/**
 * This get function is similar to the prior one, except instead of returning data based on a certain parameter, 
 * we return all the data that belongs to a folder. In this case, we are returning all the JSON data stored in the students folder.
 * @constructor
 * @param {/students} - The location of the folder where the json data is stored
 * information from.
 * @param {function(req, re)} - Takes in the request of the API, and returns the data depending on the type of request.
 */
app.get('/students', function(req, res) {
  var obj = {};
  var arr = [];
  filesread = 0;

  glob("students/*.json", null, function (err, files) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    }
    readFiles(files,[],res);
  });

});

/**
 * In this put request function, we will be grabbing a certain students information based on their record ID.
 * After their information is grabbed, we will be able to change each and every parameter of their information, including
 * their first name, last name, and GPAs.
 * @constructor
 * @param {/students/:record_id} - The location of the record IDS, which is the variable that we will be changing.
 * information from.
 * @param {function(req, re)} - Takes in the request of the API, and returns the data depending on the type of request.
 */
app.put('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;
  var fname = "students/" + record_id + ".json";
  var rsp_obj = {};
  var obj = {};

  obj.record_id = record_id;
  obj.first_name = req.body.first_name;
  obj.last_name = req.body.last_name;
  obj.gpa = req.body.gpa;
  obj.enrolled = req.body.enrolled;

  var str = JSON.stringify(obj, null, 2);

  //check if file exists
  fs.stat(fname, function(err) {
    if(err == null) {

      //file exists
      fs.writeFile("students/" + record_id + ".json", str, function(err) {
        var rsp_obj = {};
        if(err) {
          rsp_obj.record_id = record_id;
          rsp_obj.message = 'error - unable to update resource';
          return res.status(200).send(rsp_obj);
        } else {
          rsp_obj.record_id = record_id;
          rsp_obj.message = 'successfully updated';
          return res.status(201).send(rsp_obj);
        }
      });
      
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    }

  });

}); //end put method

/**
 * In this delete function, we will be deleting data stored in JSON files by retrieving each file by its record ID.
 * @constructor
 * @param {/students/:record_id} - The location of the record IDS, which is the variable that we will use to identify
 * data to be deleted.
 * information from.
 * @param {function(req, re)} - Takes in the request of the API, and returns the data depending on the type of request.
 */
app.delete('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;
  var fname = "students/" + record_id + ".json";

  fs.unlink(fname, function(err) {
    var rsp_obj = {};
    if (err) {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'record deleted';
      return res.status(200).send(rsp_obj);
    }
  });

}); //end delete method

app.listen(5678); //start the server
console.log('Server is running...');