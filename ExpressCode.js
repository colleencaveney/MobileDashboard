/**
 * Created by colleencaveney on 6/21/16.
 */
var express = require('express');
var app = express();

var mysql = require('node-mysql')
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'across_xilinx',
    password: '',
    database: 'Xilinx_Stage'
});

connection.connect(function(err) {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

app.get('/', function (req, res) {
    res.send('Hello World');
})

var server = app.listen(8081, function() {
    console.log('Server started');
});