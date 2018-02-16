var bot = require('nodemw');
var client = new bot({
	protocol: 'http',
	server: 'yume100prince.wikia.com',
	path: '',
	debug: true,
	username: 'Senelio',
	password: '082394',
	concurrency: 2
});

function login(callback) {
	client.logIn(function(err) {
		if(err) throw err;
		callback()
	});
}

function post(title, content) {
	client.edit(title, content, 'bot', true, (err) => {
		if(err) throw err;
	});
}

module.exports = {
	login: login,
	post: post
};