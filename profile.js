var fs = require('fs');
var y = require('./y.js');

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
	+ '\n== Awakening =='
	+ '\n{{Choice\n}}'
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
		+ '== Stats =='
		+ '\n{{Infobox'
		+ '\n|no = ' + y.getNo(id)
		+ '\n|name = ' + y.getName(id)
		+ '\n|name_jp = ' + mCard[id].name
		+ '\n|attribute = ' + attribute(mCard[id].attr)
		+ '\n|skill_class = ' + require('./skill.js').classification(id)
		+ wikiaRouteStats(id)
		+ ( mCard[y.getSunId(id)] ? wikiaRouteStats(y.getSunId(id)) : '' )
		+ ( mCard[y.getMoonId(id)] ? wikiaRouteStats(y.getMoonId(id)) : '' )
		+ '\n}}'
		+ '\n== Profile =='
		+ '\n{{Profile'
		+ '\n|desc = ' + mCard[id].detail
		+ '\n|bg = ' + mCard[id].backgroundStory
		+ (function() {
			if(y.isEvent(id) == true) {
				return ''
				+ '\n|event = ' + eventName;
			} else {
				return ''
				+ '\n|origin = ' + mCard[id].detail.split('の王子')[0]
				+ '\n|age = ' + mCard[id].age
				+ '\n|birth = '
				+ '\n|policy = '
				+ '\n|likes = '
				+ '\n|dislikes = ';
			}
		})()
		+ '\n}}';
	if(mCard[y.getSunId(id)]) {
		t += ''
		+ wikiaAwakeningReqs(id)
		+ '\n\n== Story =='
		+ '\n{{Still|text=Sun Still|img=Still_' + y.getNo(id) + 's.jpg}}'
		+ '\n{{Still|text=Moon Still|img=Still_' + y.getNo(id) + 'm.jpg}}'
	}
	t += '\n\n{{ShowQuotes}}';
	return t;
}

function wikiaCharacterStats(id) {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	return ''
                + '\n|no = ' + y.getNo(id)
                + '\n|name = ' + y.getName(id)
                + '\n|name_jp = ' + mCard[id].name
                + '\n|attribute = ' + attribute(mCard[id].attr)
                + wikiaRouteStats(id)
                + ( mCard[y.getSunId(id)] ? wikiaRouteStats(y.getSunId(id)) : '' )
                + ( mCard[y.getMoonId(id)] ? wikiaRouteStats(y.getMoonId(id)) : '' )
}

function wikiaUpdatePages(id, eventName) {
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	var skills = require('./public/skills.json');

	function skillsSet(route, all, affix) {
		if( skills[y.getNo(id)][route] != undefined ) {
			return ''
			+ '\n|-'
			+ '\n|' + y.getNo(id)
			+ (all==false ? '\n|[[File:' + y.getNo(id) + affix + '_t.png|65px]]' : '')
			+ '\n|[[' + y.getTitle(id) + ']]<br /><p class=\"jp\">' + mCard[id].name + '</p>'
			+ (all==true ? '\n|' + attribute(mCard[id].attr) : '')
			+ '\n|' + route
			+ '\n|' + skills[y.getNo(id)][route].LSkill
			+ '\n|' + skills[y.getNo(id)][route].Skill;
		}
		else {
			return '';
		}
	}

	var princeList = ''
		+ '\n|-'
		+ '\n|' + y.getNo(id)
		+ '\n|[[File:' + y.getNo(id) + '_t.png|65px]]'
		+ '\n|[[' + y.getName(id) + ']]<br /><p class=\"jp\">' + mCard[id].name + '</p>'
		+ '\n|' + getCv(id).cvName + '(' + getCv(id).cvKanaName + ')'
		+ '\n|?<br /><p class=\"jp\">' + mCard[id].detail.split('の王子')[0] + '</p>'
		+ '\n|data-sort-value=\"' + mCard[id].rare + '\"|{{Rarity|' + mCard[id].rare + '}}'
		+ '\n|' + attribute(mCard[id].attr);
	var eventVersions = ''
		+ '\n|-'
		+ '\n|' + y.getNo(id)
		+ '\n|[[File:' + y.getNo(id) + '_t.png|65px]]'
		+ '\n|[[' + y.getTitle(id) + '|' + y.getName(id) + ']]<br /><p class=\"jp\">' + mCard[id].name + '</p>'
		+ '\n|' + eventName + '<br /><p class=\"jp\">' + mCard[id].shortDetail + '</p>'
		+ '\n|data-sort-value=\"' + mCard[id].rare + '\"|{{Rarity|' + mCard[id].rare + '}}'
		+ '\n|' + attribute(mCard[id].attr);
	var skillsAll = skillsSet('Before',true,null) + skillsSet('Sun',true,null) + skillsSet('Moon',true,null);
	var skillsAttr = skillsSet('Before',false,'') + skillsSet('Sun',false,'s') + skillsSet('Moon',false,'m');
	var skillClassification =  ' • [[' + y.getTitle(id) + ']]' + require('./skill.js').classification(id) + ' ';
	return {
		princeList: (y.isEvent(id)? '' : princeList),
		eventVersions: (y.isEvent(id)? eventVersions : ''),
		skillsAll: skillsAll,
		skillsAttr: skillsAttr,
		skillClassification: skillClassification
	};
}

function wikiaSkillsPage() {
	var translatedSkills = require('./public/skills.json');
	var mCard = JSON.parse(fs.readFileSync('./api/MCard'));
	var t = '{|class="sortable filterable"' + 
		'\n!style="white-space:nowrap;" class="unfilterable"|No.' + 
		'\n!style="white-space:nowrap;" class="unfilterable"|Name' + 
		'\n!style="white-space:nowrap;" class="unsortable"|Attribute' + 
		'\n!style="white-space:nowrap;" class="unfilterable unsortable"|Route' + 
		'\n!style="white-space:nowrap;" class="unfilterable"|Leader Skill' + 
		'\n!style="white-space:nowrap;" class="unfilterable"|Skill' + 
		'\n|-';
	for(var i of Object.keys(translatedSkills)) {

		var id = y.getId(i);
			t += "" +
			"\n|" + i +
			"\n|[[" + y.getTitle(id) + "]]<br /><p class=\"jp\">" + mCard[id].name + "</p>" +
			"\n|" + attribute(mCard[id].attr) +
			"\n|Before" +
			"\n|" + translatedSkills[i]["Before"].LSkill +
			"\n|" + translatedSkills[i]["Before"].Skill +
			"\n|-"
		if( mCard[y.getSunId(id)] ) {
			t += "" +
			"\n|" + i +
			"\n|[[" + y.getTitle(id) + "]]<br /><p class=\"jp\">" + mCard[id].name + "</p>" +
			"\n|" + attribute(mCard[y.getSunId(id)].attr) +
			"\n|Sun" +
			"\n|" + translatedSkills[i]["Sun"].LSkill +
			"\n|" + translatedSkills[i]["Sun"].Skill +
			"\n|-"
		}
		if( mCard[y.getSunId(id)] ) {
			t += "" +
			"\n|" + i +
			"\n|[[" + y.getTitle(id) + "]]<br /><p class=\"jp\">" + mCard[id].name + "</p>" +
			"\n|" + attribute(mCard[y.getMoonId(id)].attr) +
			"\n|Moon" +
			"\n|" + translatedSkills[i]["Moon"].LSkill +
			"\n|" + translatedSkills[i]["Moon"].Skill +
			"\n|-"
		}
	}
	t += "\n|}"
	return t;
}

module.exports = {
	wikiaCharacterPage: wikiaCharacterPage,
	wikiaUpdatePages: wikiaUpdatePages,
	wikiaCharacterStats: wikiaCharacterStats,
	wikiaSkillsPage: wikiaSkillsPage
}
