function check() {
	var pass = true;
		console.log("✔ Skill sheet translated");
	if(require('./pull.js').listNew().length > 0) {
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
	// post();
}

var wikia = require('./wikia.js');

function post() {	
	wikia.login(() => {
		var idList = process.argv[2].split(',');
		var eventName = process.argv[3];

		var updates = {};
		var updatePages = ['princeList', 'eventVersions', 'skillsAll'];
		for(var i of updatePages) {
			updates[i] = '';
		}

		for(var id of idList) {

			var title = require('./y.js').getTitle(id);
			wikia.post(
				title,
				require('./profile.js').wikiaCharacterPage(id, eventName)
			);
			wikia.post(
				title + '/Quotes',
				require('./voice.js').wikiaQuotePage(id)
			);
			
			// fs.writeFile('./update/' + title + '.txt', require('./profile.js').wikiaCharacterPage(id, eventName))
			// fs.writeFile('./update/' + title + ' Quotes.txt', require('./voice.js').wikiaQuotePage(id))
			
			for(var i of updatePages) {
				updates[i] += require('./profile.js').wikiaUpdatePages(id, eventName)[i];
			}
			
		}

		fs.writeFile('./public/updates.json', JSON.stringify(updates));
	});
}

function skills() {	
	wikia.login(() => {
		wikia.post(
			'Skills/All',
			require('./profile.js').wikiaSkillsPage()
		);
	});
}

if(process.argv[2] == "skills") { skills(); }
else if(check() == true) { start(); }