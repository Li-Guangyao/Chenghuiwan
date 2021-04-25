Page({
	data: {
		option1: [{
				text: '默认',
				value: 0
			},
			{
				text: '好评排序',
				value: 1
			},
		],
		option2: [{
				text: '价格',
				value: 'a'
			},
			{
				text: '从高到底',
				value: 'b'
			},
			{
				text: '从低到高',
				value: 'c'
			},
		],
		option3: [{
				text: '销量',
				value: 'A'
			},
			{
				text: '从高到底',
				value: 'B'
			},
			{
				text: '从低到高',
				value: 'C'
			},
		],
		value1: 0,
		value2: 'a',
		value3: 'A',

		// 搜索的内容
		keyWords: '',
		goodsList: [],
		isEmpty: false
	},

	onLoad: async function (e) {
		this.setData({
			keyWords: e.keyWords
		})

		wx.showLoading({
			title: '搜索中',
		})

		await wx.cloud.callFunction({
			name: 'searchGoods',
			data: {
				keyWords: this.data.keyWords
			},
		}).then(res => {
			this.setData({
				goodsList: res.result.data
			})
		})

		this.judgeIsEmpty()

		wx.hideLoading({
			success: (res) => {},
		})
	},

	judgeIsEmpty() {
		if (this.data.goodsList.length == 0) {
			this.setData({
				isEmpty: true
			})
		} else {
			this.setData({
				isEmpty: false
			})
		}
	},

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

	onUnload: function () {

	},

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

	},

	viewGoods() {
		wx.navigateTo({
			url: '../goodsDetail/goodsDetail',
		})
	}
})