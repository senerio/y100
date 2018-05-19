var bot = require('nodemw');
var client = new bot({
	protocol: 'http',
	server: 'yume100prince.wikia.com',
	path: '',
	debug: true,
	username: '',
	password: '',
	concurrency: 2
});

function login(callback) {
	client.logIn(function(err) {
		if(err) throw err;
		callback()
	});
}

function post(title, content) {
	client.edit(title, content, 'bot', false, (err) => {
		if(err) throw err;
	});
}

module.exports = {
	login: login,
	post: post
};
