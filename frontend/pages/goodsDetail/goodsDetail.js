const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goods: {},

		isCollected: false,

		// 用于初始化整个页面的高度
		pageHeight: null,
	},

	onLoad: function (e) {
		//根据底部下单区域的高矮，来初始化页面的大小
		var query = wx.createSelectorQuery()
		query.select('.goods-action-icon').boundingClientRect()
		query.exec(res => {
			console.log(res)
			this.setData({
				pageHeight: res[0].top
			})
		})

		//从post-display组件中直接跳转过来，传递这个帖子的_id
		//下次优化，可以使用JSON.parse，前端使用data-index绑定index，后端用JSON传递对象
		console.log(e)
		db.collection('t_goods').doc(e.goodsId).get().then(e => {
			this.setData({
				goods: e.data,
			})
		})

	},

	// onShow: async function () {
	// 	console.log('onshow')
	// 	// 初始化page大小
	// 	await this.setPageHeight();
	// },

	// async setPageHeight() {
	// 	console.log('setPageHeight')
	// 	// 除去状态栏和导航栏的页面高度，也称可用页面高度
	// 	var windowHeight;
	// 	// 底部购买栏的顶部，距离窗口顶部的距离
	// 	var iconTop;
	// 	// 整个窗口的高度
	// 	var screenHeight;

	// 	//根据底部下单区域的高矮，来初始化页面的大小
	// 	var query = wx.createSelectorQuery()
	// 	query.select('.goods-action-icon').boundingClientRect()
	// 	query.exec(res => {
	// 		console.log(res)
	// 		iconTop = res[0].top
	// 	})

	// 	wx.getSystemInfo({
	// 		success: (res) => {
	// 			// 状态栏+导航栏的高度
	// 			screenHeight = res.screenHeight;
	// 			// 购买栏到底部的距离
	// 			windowHeight = res.windowHeight;
	// 		},
	// 	})

	// 	console.log(windowHeight)
	// 	console.log(iconTop)
	// 	console.log(screenHeight)

	// 	this.setData({
	// 		pageHeight: windowHeight + iconTop - screenHeight
	// 	})

	// },

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

	},

	previewImage(e) {
		wx.previewImage({
			urls: this.data.goods.display_photo,
			current: this.data.goods.display_photo[e.currentTarget.dataset.index],
			showmenu: true,
		})
	},

	tapCollection() {
		console.log("shoucang")
	},

	tapService() {
		wx.navigateTo({
			url: '../customerService/customerService',
		})
	},

	tapBuy() {
		wx.navigateTo({
			url: '../orderGenerate/orderGenerate',
		})
	}
})