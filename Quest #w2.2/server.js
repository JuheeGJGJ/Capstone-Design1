const express = require('express')
const app = express()
const port = 3000

var moment = require('moment');
require ('moment-timezone');
moment.tz.setDefault ("Asia/Seoul");
var date = moment().format ('YYYY-MM-DD hh:mm:ss');

var ip = require ('ip');

var field = {
	email: 'juhee_psnal@daum.net', 
	stuno: '20161578', 
	time: date, 
	ip: ip.address()} 

var temp_field;

app.get('/', (req, res) => {
	temp_field = Object.assign (req.query, field);
	console.log (temp_field);
	res.send (temp_field);
});

app.post('/', (req, res) => {
	field.time = moment().format ('YYYY-MM-DD hh:mm:ss');
	
	var body = '';
	req.on ('data', function(data) {
		body += data;
	});
	
	req.on('end', function() {
		temp_field = Object.assign (JSON.parse(body), field);
		console.log (temp_field);
		res.send (temp_field);
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})