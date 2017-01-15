function check() {
	var pass = true;
		console.log("✔ Skill sheet translated");
	if(require('./pull.js').listNew() > 0) {
		pass = false;
		console.log("✘ List romanization: " + require('./pull.js').listNew());
	} else {
		console.log("✔ List romanization");
	}
	if(process.argv[2] == undefined || process.argv[3] == undefined) {
		pass = false;
		console.log("✘ Card ID list and event name");
		console.log("  -> Usage: node push.js 123,124,125 'Event Name'");
	} else {
		console.log("✔ Card ID list and event name");
	}
	return pass;
}

function start() {
	require('./skill.js').getSkillsFromSheets(post);
}

function post() {
	var wikia = require('./wikia.js');
	for(var id of process.argv[2].split(',')) {
		var title = require('./y.js').getTitle(id);
		wikia.createPage(
			title,
			require('./profile.js').wikiaCharacterPage(id, process.argv[3])
		);
		wikia.createPage(
			title + '/Quotes',
			require('./voice.js').wikiaQuotePage(id)
		);
	}
}

var pass = check();
if(pass == true) { start(); }