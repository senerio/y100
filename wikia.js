var http = require('http');
var qs = require('querystring');

function post(title, section, content, summary) {

	var editInfo = {
		'action': 'edit',
		'title': title,
		'section': section,
		'summary': '[[User:Senelio|bot]]: ' + summary,
		'text': content,
		'format': 'json',
		'token': '+\\'
	}

	var postDataEdit = qs.stringify(editInfo);

	var options = {
		hostname: 'yume100prince.wikia.com',
		port: 80,
		path: '/api.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postDataEdit)
		}
	}

	var req = http.request(options, (res) => {
		res.setEncoding('utf8');
		var data = "";
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			console.log(data);
		});
	});

	req.on('error', (e) => {
		console.log(new Date().toISOString().substring(0,19).replace("T"," ") + `: Problem with request: ${e.message}`);
	});
	req.write(postDataEdit);
	req.end();

}

function create(title, content) {
	post(title, 1, content, '');
}

module.exports = {
	createPage : create,
	editPage : post
};