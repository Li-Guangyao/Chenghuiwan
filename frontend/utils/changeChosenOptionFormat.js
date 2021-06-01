export default function changeChosenOptionFormat(optionArray) {
	var changedOptionArray = new Array()
	var priceDiff = 0

	for (var i = 0; i < optionArray.length; i++) {
		for (var j = 0; j < optionArray[i].attribute.length; j++) {
			if(optionArray[i].attribute[j].isChosen == true){

				changedOptionArray.push(optionArray[i].attribute[j].name)
				priceDiff = priceDiff + optionArray[i].attribute[j].price
			}
		}
	}

	return {
		'changedOptionArray': changedOptionArray,
		'priceDiff': priceDiff,
	}
}