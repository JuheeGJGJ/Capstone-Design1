const xml2js = require('xml2js');
const request = require('request');
var parser = new xml2js.Parser();

var url = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1168060000';
i = 0;

function doit () {
	request.get(url, (err, res, body)=> {
		if (err) {
			console.log(`err => ${err}`);
		}
		else {
			parser.parseString (body, function (err, res) {
				var temp = JSON.parse(res['rss']['channel'][0].item[0].description[0].body[0].data[0].temp);
				
				myurl = "https://api.thingspeak.com/update?api_key=VTOMTZQC8ADHFMFW&field4="+ temp;
				
				request(myurl, function(err, res, body) {
					console.log(`current temp : ${temp}, return : ${body}`);
				})

				request.post('http://localhost:3000/', {
					json: {
						temp : temp
					}
				}, (error, res, body) => {
					if (error) {
						console.log('localhost error');
						return;
					}
					console.log(body);
				})

				console.log(`i=${i}`) ;
				if (i++ > 7) return;
				setTimeout(doit, 600000);
			});
		}
	});
}

console.log('ready, start!');
doit();