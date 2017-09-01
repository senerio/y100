var fs = require('fs');
var y = require('./y.js');
var s = require('./skill.js');

function attribute (attr) {
	switch(attr) {
		case "1": return "Passion";
		case "2": return "Cool";
		case "3": return "Gentle";
		case "4": return "Cute";
		case "5": return "Sexy";
	}
}

function routeStats(id) {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	return ''
	+ ',' + mCard[id].baseAttackPoint
	+ ',' + mCard[id].maxAttackPoint
	+ ',' + mCard[id].limitBreakMaxAttackPoint
	+ ',' + mCard[id].baseRecoveryPoint
	+ ',' + mCard[id].maxRecoveryPoint
	+ ',' + mCard[id].limitBreakMaxRecoveryPoint
	+ ',' + mCard[id].baseHp
	+ ',' + mCard[id].maxHp
	+ ',' + mCard[id].limitBreakMaxHp
}

function characterStats(id, custom) {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	var skills = require('./public/skills.json');
	var route = y.getRoute(id);
	if(mCard[id] != undefined) {
		return '\n'
		+ y.getTitle(y.getBaseId(id))
		+ routeStats(id) + ','
		+ custom + ','
		+ attribute(mCard[id].attr) + ','
		+ (mCard[id].saleGrantItemNum > 10 ? "gacha" : "free") + ','
		+ mCard[id].rare + ','
		+ s.activationMin(id) + ','
		+ '"' + skills[y.getNo(y.getBaseId(id))][route].LSkill + '",'
		+ '"' + skills[y.getNo(y.getBaseId(id))][route].Skill + '",'
		+ s.classification(id)
	} else {
		return '';
	}
	
}

function printAll() {
	console.log('name,atk,atk_max,atk_mlb,rp,rp_max,rp_mlb,hp,hp_max,hp_mlb,awakened,route,color,type,rarity,activation,ldr_skill,skill,skill_classif')
	for(id in require('./public/list.json')) {
		var data = '';
		if(parseInt(id) < 1000) {
			data += characterStats(id, '0,0')
			data += characterStats(y.getSunId(id), '1,1')
			data += characterStats(y.getMoonId(id), '1,2')
		}
		if(data != '') console.log(data.trim())
	}
}

printAll()