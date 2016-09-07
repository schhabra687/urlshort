var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

var base = alphabet.length; // base is the length of the alphabet (58 in this case)

function encode(num){
  console.log("encode called");
  var encoded = '';
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}

function decode(str){
  var decoded = 0;
  while (str){
    var index = alphabet.indexOf(str[0]);
    var power = str.length - 1;
    decoded += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return decoded;
}

var path = require('path');
var express = require('express');
var mysql      = require('mysql');

var bodyParser = require('body-parser');

var auto_int = 100089300;

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'practice'
 });


app = express();
app.use(bodyParser());

app.get('/url',function(req,res)
{
res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/url/*',function(req,res)
{
 var tosearch = req.url.replace('/url/','');
console.log(tosearch);
tosearch = tosearch.toString();
 connection.query('SELECT * from `urldetails` where `value` = ? ',tosearch,function(err, result) {
      if (err) throw err
      else
      {
      console.log("Key Found " + result[0].key);

      response.writeHead(302, {
      'Location': result[0].key.toString()
      //add other headers here...
      });
        res.end();
      }
    });

//res.end("dynamic page");
});

app.post('/url/', function(req, res){
  connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
  })
  var url = req.body.url;
  auto_int = auto_int + 1;
  console.log(auto_int);
  var shorten = encode(auto_int);
  console.log(shorten);
  connection.query('INSERT INTO `urldetails` (`key`,`value`) VALUES (?,?)',[url,shorten], function(err, result) {
      if (err) throw err
      else
        console.log("Record created");
    });
  var html = ' ' + url + ' ' + "localhost:8080/"+shorten;
  res.send(html);
});

app.listen(8080);

