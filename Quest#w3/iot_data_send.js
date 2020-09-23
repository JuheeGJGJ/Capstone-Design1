var express = require ('express');
var app = express();
var xml2js = require('xml2js');
var request = require('request');
var parser = new xml2js.Parser();

var url = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1168060000';

mysql = require ('mysql');
var connection = mysql.createConnection ({
	host: 'localhost',
	user: 'me',
	password: 'mypassword',
	database: 'mydb'
});
connection.connect();

function doit () {
	request (url, function (err, res, body) {
		if (err) {
			console.error (err);
		}
		else {
			parser.parseString (body, function(err,res) {
				if (err) {
					console.error (err);
				}
				else {
					var temp = JSON.parse(res.rss.channel[0].item[0].description[0].body[0].data[0].temp);
					var query = connection.query (`insert into temperature (temp) values (${temp})`, function (err, rows, cols) {
						if (err) {
							console.error (err);
							processs.exit();
						}
						else console.log (`current temp : ${temp}`);
					});
				}
			});
		}
	});

	setTimeout(doit, 600000);
}

console.log ('get temperature start!');
doit();
