fs = require('fs')
level = JSON.parse(fs.readFileSync('./api/MCardSkillLevel'))
detail = JSON.parse(fs.readFileSync('./api/MCardSkill'))
map = JSON.parse(fs.readFileSync('./api/MCardHaveSkill'));

function skillIds (id) {
	var main, leader, hidden;
	for(var i in map) {
		if(id == map[i].cardId) {
			switch(map[i].seqNo) {
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

function getMiscSkillDetails (id) {
	skillId = skillIds(id);
	r = "";
	if(skillId.main != undefined) {
		r += detail[skillId.main].classificationId;
	}
	r += '\t';
	if(skillId.hidden != undefined) {
		r += detail[skillId.hidden].skillDetail;
	} else {
		r += 'None';
	}
	return r;
}

function getDetails (id) {
	skillId = skillIds(id);
	return {
		main : {
			name : detail[skillId.main].skillName,
			desc : detail[skillId.main].skillDetail
		},
		leader : {
			name : detail[skillId.leader].skillName,
			desc : detail[skillId.leader].skillDetail
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
		spreadsheetId: '1Id_h2r4wLy9r5HioGXDO68UMg4P_vXRyy99FciFvfOk'
	}
	fs = require('fs');
	https = require('https');
	https.get('https://sheets.googleapis.com/v4/spreadsheets/' + sheets.spreadsheetId + '/values/A:G?key=' + sheets.key, (res) => {
		var data = "";
		res.on('data', (chunk) => { data += chunk; });
		res.on('end', () => {
			var json = JSON.parse(data).values;
			var skills = {};
			for(var row of json) {
				(function (i) {
			        if(skills[i[0]] == null) {
			            skills[i[0]] = {};
			        }
			        skills[i[0]][i[2]] = {};
			        skills[i[0]][i[2]].LSkill = i[4];
			        skills[i[0]][i[2]].Skill = i[6];
			    })(row);
			}
			fs.writeFile('./public/skills.json', JSON.stringify(skills,null,'\t'), callback);
		});
	});
}

module.exports = {
	activationMin: getSkillActivationMin,
	activationMax: getSkillActivationMax,
	misc: getMiscSkillDetails,
	details: getDetails,
	getSkillsToSheets : getSkillsToSheets,
	getSkillsFromSheets: getSkillsFromSheets
}