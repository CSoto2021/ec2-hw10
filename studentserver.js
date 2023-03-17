//studentserver.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  console.log('why')
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

}); //end put method

app.get('/delete', function(req, res) {
  res.render('deleteStudent')

}); 

app.get('/list', function(req, res) {
  res.render('listStudents')

}); 

app.listen(5678); //start the server
console.log('Server is running...');