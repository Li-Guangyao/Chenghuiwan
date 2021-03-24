// pages/goodsList/goodsList.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		option1: [
		  { text: '默认', value: 0 },
		  { text: '好评排序', value: 1 },
		],
		option2: [
		  { text: '价格', value: 'a' },
		  { text: '从高到底', value: 'b' },
		  { text: '从低到高', value: 'c' },
		],
		option3: [
			{ text: '销量', value: 'A' },
			{ text: '从高到底', value: 'B' },
			{ text: '从低到高', value: 'C' },
		  ],
		value1: 0,
		value2: 'a',
		value3: 'A'
	  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})