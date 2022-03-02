fs = require('fs');
y = require('./y');

quotes = JSON.parse(fs.readFileSync('./api/MCardVoice')); // cardId, voiceType, voiceId
text = JSON.parse(fs.readFileSync('./api/MVoice')); // voiceFileId, voiceText

function exclude (info) { // exclude sun and moon if voice type is same for all routes
	if(y.getRoute(info.cardId) != "Before") {
		switch(info.voiceType) {
			case "1": case "2": case "3": // MAIN_TOP_*_GREETING
			// case "4": case "5": // MAIN_TOP_TOUCH, CARD_DETAIL
			case "6": case "7": case "9": case "10": case "11": case "13": case "14": case "15": // BATTLE_*
			// case "12": case "18": // SKILL_INVOKE, CARD_EVOLUTION
			case "16": case "17": case "19": // CARD_TOP, CARD_ENHANCE, DECK
			case "20": case "21": case "22": case "23": // WELCOME PARTY, BIRTHDAY, GUILD, FRIEND_DETAIL
			case "24": case "25": case "26": // CHAIN_*
			case "27": // RANKING_EVENT_POINT_REWARD
				return true; break;
			default: // the ones that go through here are unique in all routes
				return false;
		}
	}
	return false;
}

function getTypeList (id) {
	typeList = {};
	for (var key of Object.keys(quotes).sort()) {
		var item = quotes[key];
		if (id == y.getBaseId(item.cardId)) {
			if (exclude(item) == false) {
				var type = key.split(",")[1];
				var n = "";
				var main_top_touch;
				var ranking_event_point_reward;
				if (type == "MAIN_TOP_TOUCH") {
					if(main_top_touch == null || main_top_touch == 2) {
						main_top_touch = 1;
					} else {
						main_top_touch++;
					}
					n = "_" + main_top_touch;
				} else if (type == "RANKING_EVENT_POINT_REWARD") {
					if(ranking_event_point_reward == null) {
						ranking_event_point_reward = 1;
					} else {
						ranking_event_point_reward++;
					}
					n = "_" + ranking_event_point_reward;
				}
				typeList[item.voiceId] = y.getNo(id) + "_" + type + y.getAffix(item.cardId) + n;
			}
		}
	}
	return typeList;
}

function getQuote (id, func) { // passes voiceType, voiceFileId, voiceText to func
	typeList = getTypeList(id);
	for (var voiceId in typeList) {
		var voiceFileId = (text[voiceId]==undefined)? null : text[voiceId].voiceFileId
		var voiceText = (text[voiceId]==undefined)? null : text[voiceId].voiceText

		func(
			typeList[voiceId],
			voiceFileId,
			voiceText
		)
	}
}

function toSheets (name) {
	var cardIds = y.getIds(name);
	var typeList = {};
	for (var cardId of cardIds) {
		typeList = Object.assign(typeList, getTypeList(cardId));
	}
	for (var voiceId of Object.keys(text).sort()) {
		if (text[voiceId].voiceFileId.indexOf(name) >= 0) {
			console.log( text[voiceId].voiceFileId + "\t" + typeList[voiceId] + "\t" + text[voiceId].voiceText );
		}
	}
}

function allVoiceText () {
	for (var id of Object.keys(text).sort()) {
		console.log( text[id].voiceFileId + " : " + text[id].voiceText );
	}
}

function renameScript (id) {
	var r = "";
	getQuote(id, function(voiceType, voiceFileId, voiceText) {
		r += "ren " + voiceFileId + ".ogg "
			+ voiceType
			+ ".ogg"
			+ "\n";
	});
	return r;
}

function stripNo(voiceType) {
	return voiceType.substring(voiceType.indexOf('_')+1);
}

function wikiaQuotePage (id) {
	x = '== Quotes =='
		+ '\n{{Quotes'
		+ '\n|no = ' + y.getNo(id);
	getQuote(id, function(voiceType, voiceFileId, voiceText) {
		x += '\n|' + stripNo(voiceType) + '_en = ';
		x += '\n|' + stripNo(voiceType) + '_jp = ' + voiceText;
	});
	return x + '\n}}';
}

module.exports = {
	renameScript: renameScript,
	allVoiceText: allVoiceText,
	toSheets: toSheets,
	wikiaQuotePage: wikiaQuotePage
}