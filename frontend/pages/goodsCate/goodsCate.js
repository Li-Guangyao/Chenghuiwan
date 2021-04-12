const db = wx.cloud.database()

Page({

	data: {
		firstLevelCate: wx.getStorageSync('firstLevelCate'),
		secondLevelCate: [],
		goodsCateTrans: wx.getStorageSync('goodsCateTrans'),
		currentIndex: 0,
		currentCateName: ''
	},

	onLoad: function (options) {
		this.setData({
			currentCateName: this.data.firstLevelCate[this.data.currentIndex],
		})
		this.setData({
			secondLevelCate: this.data.goodsCateTrans[this.data.currentCateName]
		})
	},

	handleCateChange(e){
		this.setData({
			currentIndex: e.detail,
			currentCateName: this.data.firstLevelCate[e.detail],
		})
		this.setData({
			secondLevelCate: this.data.goodsCateTrans[this.data.currentCateName]
		})
	}
})