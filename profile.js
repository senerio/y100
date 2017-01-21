fs = require('fs');
y = require('./y.js');

function getCv (id) {
	var map = JSON.parse(fs.readFileSync('./api/MCvInside'));
	var list = JSON.parse(fs.readFileSync('./api/MCv'));
	for(var k in map) {
		if(id == map[k].cardId) {
			return list[map[k].cvId]; // cvId, cvName, cvKanaName, cvDetail
		}
	}
}

function attribute (attr) {
	switch(attr) {
		case "1": return "Passion";
		case "2": return "Cool";
		case "3": return "Gentle";
		case "4": return "Cute";
		case "5": return "Sexy";
	}
}

function wikiaAwakeningReqs (id) {
	var sacrifice = JSON.parse(fs.readFileSync('./api/MEvolutionSacrifice'));
	var gold = JSON.parse(fs.readFileSync('./api/MCardEvolution'));
	return ''
	+ '\n== Awakening Requirements =='
	+ '\n{{Awakening'
	+ '\n|gold = ' + gold[id+',SUN'].evolutionNeedGold
	+ (function() {
		var t = '';
		for(var k of [',SUN,',',MOON,']) {
			var affix = 's'; if(k == ',MOON,') { affix = 'm'; }
			k = id + k;
			for(var i = 1; i <= 8; i++) {
				if(sacrifice[k+i.toString()] != undefined) {
					t += '\n|' + affix + i + 'count = ' + sacrifice[k+i].sacrificeCount;
					t += '\n|' + affix + i + 'fairy = ' + y.getTitle(sacrifice[k+i].sacrificeCardId);
				}
			}
		}
		return t;
	})()
	+ '\n}}';
}

function wikiaRouteStats(id) {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	var skills = require('./public/skills.json');
	var skill = require('./skill.js');
	var affix = y.getAffix(id);
	var route = y.getRoute(id);
	return t = ''
	+ '\n<!-- ' + route + ' -->'
	+ '\n|rarity' + affix + ' = ' + mCard[id].rare
	+ '\n|cost' + affix + ' = ' + mCard[id].cost
	+ '\n|lvmax' + affix + ' = ' + mCard[id].baseMaxLevel
	+ '\n|hp_base' + affix + ' = ' + mCard[id].baseHp
	+ '\n|hp_max' + affix + ' = ' + mCard[id].maxHp
	+ '\n|hp_break' + affix + ' = ' + mCard[id].limitBreakMaxHp
	+ '\n|atk_base' + affix + ' = ' + mCard[id].baseAttackPoint
	+ '\n|atk_max' + affix + ' = ' + mCard[id].maxAttackPoint
	+ '\n|atk_break' + affix + ' = ' + mCard[id].limitBreakMaxAttackPoint
	+ '\n|rp_base' + affix + ' = ' + mCard[id].baseRecoveryPoint
	+ '\n|rp_max' + affix + ' = ' + mCard[id].maxRecoveryPoint
	+ '\n|rp_break' + affix + ' = ' + mCard[id].limitBreakMaxRecoveryPoint
	+ '\n|lskill_name' + affix + ' = ' + skill.details(id).leader.name
	+ '\n|lskill_desc' + affix + ' = ' + skills[y.getNo(y.getBaseId(id))][route].LSkill
	+ '\n|skill_name' + affix + ' = ' + skill.details(id).main.name
	+ '\n|skill_desc' + affix + ' = ' + skills[y.getNo(y.getBaseId(id))][route].Skill
	+ '\n|activation_max' + affix + ' = ' + skill.activationMax(id)
	+ '\n|activation_min' + affix + ' = ' + skill.activationMin(id)
	+ '\n|gold' + affix + ' = ' + mCard[id].baseSaleGold
	+ '\n|ring' + affix + ' = ' + mCard[id].saleGrantItemNum;
}

function wikiaCharacterPage (id, eventName) {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	var t = ''
		+ '== Status=='
		+ '\n{{Infobox'
		+ '\n|no = ' + y.getNo(id)
		+ '\n|name = ' + y.getName(id)
		+ '\n|name_jp = ' + mCard[id].name
		+ '\n|attribute = ' + attribute(mCard[id].attr)
		+ wikiaRouteStats(id)
		+ wikiaRouteStats(y.getSunId(id))
		+ wikiaRouteStats(y.getMoonId(id))
		+ '\n}}'
		+ '\n== Profile =='
		+ '\n{{Profile'
		+ '\n|desc = ' + mCard[id].detail
		+ '\n|bg = ' + mCard[id].backgroundStory
		+ (function() {
			if(y.isEvent(id) == true) {
				return ''
				+ '\n|original = [[' + y.getName(id) + ']]'
				+ '\n|event = ' + eventName;
			} else {
				return ''
				+ '\n|versions = '
				+ '\n|va = ' + getCv(id).cvName + '(' + getCv(id).cvKanaName + ')'
				+ '\n|origin = ' + mCard[id].detail.split('の王子')[0]
				+ '\n|age = ' + mCard[id].age
				+ '\n|birth = '
				+ '\n|policy = '
				+ '\n|likes = '
				+ '\n|dislikes = ';
			}
		})()
		+ '\n}}'
		+ '\n== Story =='
		+ '\n{{Still|text=Sun Still|img=Still_' + y.getNo(id) + 's.jpg}}'
		+ '\n{{Still|text=Moon Still|img=Still_' + y.getNo(id) + 'm.jpg}}'
		+ wikiaAwakeningReqs(id)
		+ '\n\n{{:' + y.getTitle(id) + '/Quotes}}';
	return t;

}

module.exports = {
	wikiaCharacterPage: wikiaCharacterPage
}