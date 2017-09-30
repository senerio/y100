fs = require('fs')
level = JSON.parse(fs.readFileSync('./api/MCardSkillLevel'))
detail = JSON.parse(fs.readFileSync('./api/MCardSkill'))
map = JSON.parse(fs.readFileSync('./api/MCardHaveSkill'));

function skillIds (id) {
	var main, leader, hidden;
	for(var i in map) {
		if(id == map[i].cardId) {
			switch(parseInt(map[i].skillDivision))
			{
				case 1: main = map[i].skillId; break;
				case 2: leader = map[i].skillId; break;
				case 3: hidden = map[i].skillId; break;
			}
		}
	}
	return {
		main: main,
		leader: leader,
		hidden: hidden
	}
}

function getSkillActivationMax (id) {
	return level[skillIds(id).main +',1'].activeConditionNum;
}

function getSkillActivationMin (id) {
	return level[skillIds(id).main +',10'].activeConditionNum;
}

function getHiddenSkill (id) {
	skillId = skillIds(id);
	if(skillId.hidden != undefined) {
		return detail[skillId.hidden].skillDetail;
	} else {
		return 'None';
	}
}

function getSkillClassification (id) {
	skillId = skillIds(id);
	if(skillId.main != undefined) {
		return detail[skillId.main].classificationId;
	} else {
		return 0;
	}
}

function getDetails (id) {
	skillId = skillIds(id);
	return {
		main : {
			name : (detail[skillId.main] != undefined ? detail[skillId.main].skillName : "N/A"),
			desc : (detail[skillId.main] != undefined ? detail[skillId.main].skillDetail : "N/A")
		},
		leader : {
			name : (detail[skillId.leader] != undefined ? detail[skillId.leader].skillName : "N/A"),
			desc : (detail[skillId.leader] != undefined ? detail[skillId.leader].skillDetail : "N/A")
		}
	};
}

function getSkillsToSheets(id) {
	var r = '';
	details = getDetails(id);
	return details.leader.desc + '\tlskill\t' + details.main.desc + '\tskill';
}

function getSkillsFromSheets(callback) {
	var sheets = {
		key: 'AIzaSyBFigFGRlBEAwOshi2jKsP5Ooh4R0YIk4U',
		spreadsheetId: '1gF78PNTX34_kvmdedVE8SSLINuQV6og_VQkOPdYX2z4'
	}
	fs = require('fs');
	https = require('https');
	var req = https.get('https://sheets.googleapis.com/v4/spreadsheets/' + sheets.spreadsheetId + '/values/A:G?key=' + sheets.key, (res) => {
		var data = "";
		res.on('data', (chunk) => { data += chunk; });
		res.on('end', () => {
			var json = JSON.parse(data).values;
			var skills = {};
			for(var row of json) {
				(function (i) {
			        if(skills[i[0]] == undefined) {
			            skills[i[0]] = {};
			        }
			        skills[i[0]][i[2]] = {};
			        skills[i[0]][i[2]].LSkill = i[4];
			        skills[i[0]][i[2]].Skill = i[6];
			    })(row);
			}
			fs.writeFileSync('./public/skills.json', JSON.stringify(skills,null,'\t'));
			callback();
		});
	});
	req.setTimeout(30000);
}

module.exports = {
	activationMin: getSkillActivationMin,
	activationMax: getSkillActivationMax,
	hidden: getHiddenSkill,
	classification: getSkillClassification,
	details: getDetails,
	getSkillsToSheets : getSkillsToSheets,
	getSkillsFromSheets: getSkillsFromSheets
}