var express = require('express');
var app = express();
fs = require('fs');

mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

app.get ('/graph', function (req, res) {
	console.log ("got app.get('/graph')");
	
	var html = fs.readFile('./graph.html', function (err, html) {
		html = " "+ html
		console.log('read file');

		var qstr = 'select * from temperature';
		connection.query(qstr, function(err, rows, cols) {
			if (err) {
				console.error (err);
				processs.exit();
			}

			var data = "";
			var comma = "";
			var time;
			for (var i=0; i< rows.length ; i++) {
				r = rows[i];
				year = r.time.getYear() + 1900;
				hour = r.time.getHours() + 9;
				data += comma + "[new Date (" + year + "," + r.time.getMonth() + "," + r.time.getDate() + "," + hour + "," + r.time.getMinutes() + "," + r.time.getSeconds() + "),"+ r.temp +"]";
				comma = ",";
			}

			var header = "['Date/Time', 'Temp']";
			html = html.replace("<%HEADER%>", header);
			html = html.replace("<%DATA%>", data);

			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(html);
			res.end();
		});
	});
});

app.get ('/update', function (req, res) {
	r = req.query;
	console.log (`update : ${JSON.stringify(r)}`);

	temp = r.temp;
	now = new Date();
	time = now.getFullYear() + "-" + (1 + now.getMonth()) + "-" +  now.getDate() + " " + (9 + now.getHours()) + " : " + now.getMinutes();

	connection.query (`insert into temperature (temp) values (${temp})`, function (err, rows, cols) {
		if (err) {
			console.error (err);
			processs.exit();
		}
		else console.log (`current temp : ${temp}`);
	});
	
	res.send (`temp = ${temp} at time = ${time}`);
});

app.get ('/data', function (req, res) {
	var qstr = 'select * from temperature';
	connection.query(qstr, function(err, rows, cols) {
		if (err) {
			console.error (err);
			processs.exit();
		}

		console.log (rows.length + " records");
		html = "";

		var end;
		if (rows.length > 100) {
			console.log ("print recent 100 records");
			end = rows.length - 100;
		}
		else {
			console.log ("print all records");
			end = 0;
		}
		for (var i = rows.length - 1 ; i >= end ; i--) {
			html += JSON.stringify (rows[i]) + '<br>';
		}

		res.send (html);
	});
	
});

var server = app.listen (8000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log ('listening at http://%s:%s', host, port);
});
