list = require('./public/list.json');

function getNo (cardId) {
	return list[cardId].no;
}

function getTitle (cardId) {
	return list[cardId].name;
}

function getName (cardId) {
	return list[cardId].name.split(" (")[0];
}

function getBaseCardId (cardId) {
	return( (cardId % 1000).toString() );
}

function getCardId (no) {
	for (var cardId in list) {
		if (list[cardId].no == no) {
			return cardId;
		}
	}
}

function getRoute (cardId) {
	var i = parseInt(cardId/10000);
	switch(i) {
		case 0: return "Before"; break;
		case 1: return "Sun"; break;
		case 2: return "Moon"; break;
	}
}

function getRouteAffix (cardId) {
	var i = parseInt(cardId/10000);
	switch(i) {
		case 0: return ""; break;
		case 1: return "_s"; break;
		case 2: return "_m"; break;
	}
}

function getIds (name) {
	ids = []
	for(var i in list) {
		if (list[i].name.indexOf(name) >= 0) {
			ids.push(i);
		}
	}
	return ids;
}

function getSunId(id) {
	return (parseInt(id)+10000).toString();
}
function getMoonId(id) {
	return (parseInt(id)+20000).toString();
}

function isEvent(id) {
	return list[id].name.indexOf('(') != -1;
}

module.exports = {
	getRoute: getRoute,
	getAffix: getRouteAffix,
	getTitle: getTitle,
	getBaseId: getBaseCardId,
	getId: getCardId,
	getNo: getNo,
	getName: getName,
	getIds: getIds,
	getSunId: getSunId,
	getMoonId: getMoonId,
	isEvent: isEvent
}