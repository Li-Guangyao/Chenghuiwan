Page({
	data: {
		value: '',
	},
	onChange(e) {
		console.log(e)
		this.setData({
			value: e.detail,
		});
	},
	onSearch() {
		console.log("onsearch")
	},
	onClick() {
		console.log("onclick")
	},
});