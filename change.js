var s = require('./skill.js');
var y = require('./y.js');

var translatedSkills = require('./public/skills.json');

ids = ["565"]

for(var id of ids) {
	console.log("\n",y.getNo(id),y.getTitle(id))
	console.log("* Before", "\n",
		translatedSkills[y.getNo(id)]["Before"].LSkill, "\n",
		s.details(id).leader.desc, "\n",
		translatedSkills[y.getNo(id)]["Before"].Skill, "\n",
		s.details(id).main.desc, "\n",
		s.activationMin(id), "->", s.activationMax(id)
	)
	console.log("* Sun", "\n",
		translatedSkills[y.getNo(id)]["Sun"].LSkill, "\n",
		s.details(y.getSunId(id)).leader.desc, "\n",
		translatedSkills[y.getNo(id)]["Sun"].Skill, "\n",
		s.details(y.getSunId(id)).main.desc, "\n",
		s.activationMin(y.getSunId(id)), "->", s.activationMax(y.getSunId(id))
	)
	console.log("* Moon", "\n",
		translatedSkills[y.getNo(id)]["Moon"].LSkill, "\n",
		s.details(y.getMoonId(id)).leader.desc, "\n",
		translatedSkills[y.getNo(id)]["Moon"].Skill, "\n",
		s.details(y.getMoonId(id)).main.desc, "\n",
		s.activationMin(y.getMoonId(id)), "->", s.activationMax(y.getMoonId(id))
	)
}


