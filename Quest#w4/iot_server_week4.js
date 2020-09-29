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

app.get ('/week4/graph', function (req, res) {
	console.log ("got app.get('/graph')");
	
	var html = fs.readFile('./graph.html', function (err, html) {
		html = " "+ html
		console.log('read file');

		if (req.query.view == "temp") {
			console.log ("temperature graph\n");

			var qstr = 'select time,temp from temp_activity where time >= NOW() - INTERVAL 24 HOUR';
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
					data += comma + "[new Date (" + year + "," + r.time.getMonth() + "," + r.time.getDate() + "," + hour + "," + r.time.getMinutes() + "," + r.time.getSeconds() + "),"+ r.temp + "]";
					comma = ",";
				}

				var header = "['Date/Time', 'Temp']";
				html = html.replace("<%HEADER%>", header);
				html = html.replace("<%DATA%>", data);

				res.writeHeader(200, {"Content-Type": "text/html"});
				res.write(html);
				res.end();
			});
		}
		else if (req.query.view == "activity") {
			console.log ("activity graph\n");

			var qstr = 'select time, activity from temp_activity where time >= NOW() - INTERVAL 24 HOUR';
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
					data += comma + "[new Date (" + year + "," + r.time.getMonth() + "," + r.time.getDate() + "," + hour + "," + r.time.getMinutes() + "," + r.time.getSeconds() + ")," + r.activity +"]";
					comma = ",";
				}

				var header = "['Date/Time', 'Activity']";
				html = html.replace("<%HEADER%>", header);
				html = html.replace("<%DATA%>", data);

				res.writeHeader(200, {"Content-Type": "text/html"});
				res.write(html);
				res.end();

			});

		}
		else { // default : temp & activity
			console.log ("temp, activity graph\n");

			var qstr = 'select * from temp_activity where time >= NOW() - INTERVAL 24 HOUR';
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
					data += comma + "[new Date (" + year + "," + r.time.getMonth() + "," + r.time.getDate() + "," + hour + "," + r.time.getMinutes() + "," + r.time.getSeconds() + "),"+ r.temp + "," + r.activity +"]";
					comma = ",";
				}

				var header = "['Date/Time', 'Temp', 'Activity']";
				html = html.replace("<%HEADER%>", header);
				html = html.replace("<%DATA%>", data);

				res.writeHeader(200, {"Content-Type": "text/html"});
				res.write(html);
				res.end();
			});
		}
	});
});

app.get ('/week4/update', function (req, res) {
	r = req.query;
	console.log (`update : ${JSON.stringify(r)}`);

	temp = r.temp;
	activity = r.activity;

	now = new Date();
	time = now.getFullYear() + "-" + (1 + now.getMonth()) + "-" +  now.getDate() + " " + (9 + now.getHours()) + " : " + now.getMinutes();

	connection.query (`insert into temp_activity (temp, activity) values (${temp}, ${activity})`, function (err, rows, cols) {
		if (err) {
			console.error (err);
			process.exit();
		}
		else console.log (`current temp : ${temp} activity : ${activity}`);
	});
	
	res.send (`temp = ${temp} activity = ${activity} at time = ${time}`);
});

app.get ('/week4/data', function (req, res) {
	var qstr = 'select * from temp_activity where time >= NOW() - INTERVAL 24 HOUR order by time desc';
	connection.query(qstr, function(err, rows, cols) {
		if (err) {
			console.error (err);
			process.exit();
		}

		console.log (rows.length + " records");
		html = "";

		for (var i=0; i< rows.length ; i++) {
			r = rows[i];
			r.time.setHours (r.time.getHours() + 9);
			html += JSON.stringify (r) + '<br>';
		}

		res.send (html);
	});
	
});

var server = app.listen (8000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log ('listening at http://%s:%s', host, port);
});
