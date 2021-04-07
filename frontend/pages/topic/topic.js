Page({
	data: {
		topic: '',
	},

	onChange(e) {
		console.log(e)
		this.setData({
			topic: e.detail,
		});
	},

	searchTopic() {
		console.log("onsearch")
	}
});