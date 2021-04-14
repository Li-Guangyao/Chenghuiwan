// pages/search/search.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		value: '',
		// history: ['lgy', 'hu', 'nnn', 'ish', 'nhg','ddd','jinguiagjk','fidnagy','nnn'],
		history: wx.getStorageSync('searchHistory')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	onShow: function () {
		this.setData({
			history: wx.getStorageSync('searchHistory')
		})
	},

	handleSearch: function () {
		var inputContent = this.data.value;
		//输入内容为空，不做任何操作
		if (inputContent.length == 0) {} else {
			this.data.history.push(inputContent)
			wx.navigateTo({
				url: '/pages/searchResult/searchResult?searchKeyWords=' + inputContent
			})
			this.setData({
				history: this.data.history
			})
			wx.setStorageSync('searchHistory', this.data.history)
		}

	},

	handleChange(e) {
		console.log(e)
		this.setData({
			value: e.detail,
		});
	},

	handleCancel() {
		wx.navigateTo({
			url: '/pages/index/index',
		})
	},

	// 直接在history小方块中点击
	choseHisItem(e) {
		var inputContent = this.data.history[e.currentTarget.dataset.index]
		wx.navigateTo({
			url: '/pages/searchResult/searchResult?searchKeyWords=' + inputContent
		})
	},

	// 删除搜索历史的某个项
	delHisItem(e) {
		console.log(e);
		// e.currentTarget.dataset.index
		this.data.history.splice(e.currentTarget.dataset.index, 1)
		this.setData({
			history: this.data.history
		})
		wx.setStorageSync('searchHistory', this.data.history)
	}

})