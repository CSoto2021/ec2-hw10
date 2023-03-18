//studentserver.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoString = process.env.DBURL;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})
database.once('connected', () => {
  console.log('Database Connected');
})

const studentSchema = new mongoose.Schema({
  ID:{
    required: true,
    type: Number
  },
  first_name: {
      required: true,
      type: String
  },
  last_name: {
      required: true,
      type: String
  },
  gpa: {
      required: true,
      type: Number
  },
  enrolled: {
      required: true,
      type: String
  }
})
const Model = mongoose.model('Data', studentSchema)

app.get('/', function(req, res) {
  res.render('index')
}); 
  
app.get('/add', function(req, res) {
  res.render('addStudent')
}); 

app.get('/display', function(req, res) {
  res.render('displayStudent')
});

app.get('/update', function(req, res) {
    res.render('updateStudent')

}); 

app.get('/delete', function(req, res) {
  res.render('deleteStudent')

}); 

app.get('/list', function(req, res) {
  res.render('listStudents')

}); 

app.post('/student', async function(req, res){
  const data = new Model({
    ID: req.body.student_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gpa: req.body.gpa,
    enrolled: req.body.enrolled
})
console.log(data)
try {
  console.log("Worked")
  const dataToSave = await data.save();
  res.status(200).send("Success");
}
catch (error) {
  res.status(400).send("Error");
}
});

app.delete('/delete', async function(req, res){
  console.log(req.body.student_id)
  try {
    console.log("function called");
    const id = req.body.student_id;
    await Model.findOneAndDelete({ID: req.body.student_id});
    res.status(200).send(`Document with ID of ${id} has been deleted..`);
}
catch (error) {
  console.log("Not working");
  res.status(400).send("Error")
}
})

app.get('/getStudent/:student_id', async function(req, res){{
  console.log(req.params.student_id);
  try{
    const data = await Model.findOne({ID: req.params.student_id});
    res.status(200).send(data);
  }
  catch(error){
    console.log("error");
    res.status(400).send("Error");
  }
}});

app.put('/students/:student_id', async function(req, res){
  var fname = req.body.first_name;
  var lname = req.body.last_name;
  var en = JSON.stringify(req.body.enrolled);
  try{
    console.log("Hello")
    await Model.findOneAndUpdate({ID: req.body.student_id},{$set:{first_name: fname, last_name: lname, gpa: req.body.gpa, enrolled: en}});
    res.status(200).send("Success");
  }
  catch(error){
    console.log("error");
    res.status(400).send("Error");
  }
});

app.get('/students', async function(req, res){
  try{
    const data = await Model.find();
    console.log(data);
    res.status(200).send(data);
  }
  catch(error){
    res.status(400).send("Error");
  }
})

app.listen(5678); //start the server
console.log('Server is running...');