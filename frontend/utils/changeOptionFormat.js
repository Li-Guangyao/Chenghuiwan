// 虽然goodsOption返回了一个数组，但是数组里面的对象以字符串形式存在
// 这里把每项都parse然后写回去，使得数组中对象以正常形式存在
export default function changeOptionFormat(optionArray) {
	if(optionArray.length==0){
		return []
	}else{
		for (var i = 0; i < optionArray.length; i++) {
			optionArray[i] = JSON.parse(optionArray[i])
		}
		return optionArray
	}
}