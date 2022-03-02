fs = require('fs');

function hashChanged(newHash) {
	if (newHash != null) {
		var hash = fs.readFileSync('./api/hash');
		fs.writeFile('./api/hash', newHash);
		if(hash != newHash) {
			return true;
		}
	}
	return false;
}

function saveData(json) {
	keys = ['MCard', 'MCardSkill', 'MCardHaveSkill', 'MCardSkillLevel', 'MEvolutionSacrifice', 'MCardEvolution', 'MCv', 'MCvInside', 'MCardVoice', 'MVoice', 'MPrinceStyle', 'MMemoryPiece', 'MMemoryPieceLimitBreakSkill']; //'MMasterVersion'
	for(var key of keys) {
		console.log("Writing " + key + "...");
		fs.writeFileSync('./api/' + key, JSON.stringify(json[key].list[0]));
	}
	console.log("Save data done.");
}

function getDiff() {
	mCard = Object.keys(JSON.parse(fs.readFileSync('./api/MCard')));
	list = Object.keys(JSON.parse(fs.readFileSync('./public/list.json')));
	diff = mCard.filter(x => ( list.indexOf(x) < 0 && (x < 1000 || x > 30000) ));
	console.log(''+diff);
	return diff.sort();
}

function updateList() {
	var diff = getDiff();
	if(diff.length > 0) {
		console.log("Updating...");
		appendNew(diff, appendSkills, updateVoiceRename, getNewData);
	} else {
		console.log("Nothing new.");
	}
}

function appendNew(newIds, callback1, callback2, callback3) {
	fs.readFile('./public/list.json', (err, data) => {
		list = JSON.parse(data);
		var lastNo = 0;
		for(var i of Object.keys(list)) {
			if(list[i].no > lastNo && list[i].no < 1000) lastNo = list[i].no;
		}
		mCard = JSON.parse(fs.readFileSync('./api/MCard'));
		console.log("Getting new card data...");
		for(var id of newIds) {
			list[id] = {};
			list[id].no = (function() {
				if(id > 1000) {
					return id;
				} else {
					return ++lastNo;
				}
			})();
			list[id].name = mCard[id].name;
		}
		fs.writeFileSync('./public/list.json', JSON.stringify(list,null,'\t'));
		console.log("List updated.");
		callback1(list); callback2(list); callback3();
	});
}

function listNew() {
	list = JSON.parse(fs.readFileSync('./public/list.json'));
	var regex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/; 
	arr = [];
	for(var id of Object.keys(list)) {
		if(regex.test(list[id].name)) {
			arr.push(id);
		}
	}
	return arr;
}

function appendSkills (list) {
	fs.readFile('./public/skills.json', (err, data) => {
		var skills = JSON.parse(data);
		var y = require('./y.js');
		var skill = require('./skill.js');
		console.log("Getting skills...");
		for(var id of listNew()) {
			if(id > 1000) { continue; }
			skills[list[id].no] = {
				'Before' : { 'LSkill' : '', 'Skill' : '' },
				'Sun' : { 'LSkill' : '', 'Skill' : '' },
				'Moon' : { 'LSkill' : '', 'Skill' : '' }
			}
			detailsBefore = skill.details(id);
			detailsSun = skill.details(y.getSunId(id));
			detailsMoon = skill.details(y.getMoonId(id));
			skills[list[id].no].Before.LSkill = detailsBefore.leader.desc;
			skills[list[id].no].Before.Skill = detailsBefore.main.desc;
			skills[list[id].no].Sun.LSkill = detailsSun.leader.desc;
			skills[list[id].no].Sun.Skill = detailsSun.main.desc;
			skills[list[id].no].Moon.LSkill = detailsMoon.leader.desc;
			skills[list[id].no].Moon.Skill = detailsMoon.main.desc;
		}
		fs.writeFile('./public/skills.json', JSON.stringify(skills,null,'\t'));
		console.log("Skills updated.");
	});
}

function updateVoiceRename (list) {
	var voice = require('./voice.js');
	var r = {};
	console.log("Creating rename file...");
	for(var id in list) {
		if(id < 1000) {
			r[require('./y.js').getNo(id)] = voice.renameScript(id);
		}
	};
	fs.writeFile('./public/rename.json', JSON.stringify(r,null,'\t'));
	console.log("Rename file created.");
}

function getNewData () {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	var newChars = listNew();

	console.log("* Short Detail:");
	for(var id of newChars) {
		console.log( mCard[id].shortDetail )
	}

	skill = require('./skill.js');
	y = require('./y.js');
	list = require('./public/list.json');

	console.log("* Hidden Skill:");
	for(var id of newChars) {
		console.log( mCard[id].name + '\t' + skill.hidden(id) );
	}

	console.log("* Skills:");
	for(var id of newChars) {
		if(id > 1000) { continue; }
		console.log( list[id].no + '\t' + mCard[id].name + '\tBefore\t' + skill.getSkillsToSheets(id) );
		console.log( list[id].no + '\t' + mCard[id].name + '\tSun\t' + skill.getSkillsToSheets(y.getSunId(id)) );
		console.log( list[id].no + '\t' + mCard[id].name + '\tMoon\t' + skill.getSkillsToSheets(y.getMoonId(id)) );
	}
}

function pull() {
	//http = require('http');
	//http.get('http://localhost:8080/masterAll', (res) => {
	// http.get('http://api.yume-100.com/app/load/static/masterAll', (res) => {
	//	var data = "";
	//	res.on('data', (chunk) => data += chunk);
	//	res.on('end', () => {
	fs.readFile('masterAll', 'utf-8', (err,data) => {
			if (err) throw err;
			var json = JSON.parse(data);
			if (json.status == 0) {
				if (hashChanged(json.hashCode)) {
					console.log("Updating...");
					saveData(JSON.parse(json.result).master);
					updateList();
				} else {
					console.log("No updates.");
				}
			} else {
				console.log(json);
			}
		});
	//});
}

if(process.argv[1].indexOf('pull.js') != -1) {
	pull();
}

module.exports = {
	listNew: listNew
}
