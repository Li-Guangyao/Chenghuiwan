const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goods: {},
		goodsId: null,

		isCollected: false,
		originIsCollected: false,

		// 用于初始化整个页面的高度
		pageHeight: null,
	},

	onLoad: function (e) {
		//保存从商品列表传来的goodsId
		this.setData({
			goodsId: e.goodsId
		})

		this.initPageContent()

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		console.log('onHide')
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		// 判断用户是否（取消）收藏该商品
		if (this.data.isCollected == true && this.data.originIsCollected == false) {
			db.collection('t_collection').add({
				data: {
					_openid: this.data.openId,
					goods_id: this.data.goodsId
				}
			})
		} else if (this.data.isCollected == false && this.data.originIsCollected == true) {
			db.collection('t_collection').where({
				_openid: this.data.openId,
				goods_id: this.data.goodsId
			}).remove()
		} else {
			console.log('else')
		}
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		// wx.showNavigationBarLoading();
		// this.initPageContent().then(res => {
		// 	//隐藏导航条加载动画
		// 	wx.hideNavigationBarLoading();
		// 	//停止下拉刷新
		// 	wx.stopPullDownRefresh();

		// })
	},

	async initPageContent() {
		wx.showLoading({
			title: '获取商品中',
		})

		//根据底部下单区域的高矮，来初始化页面的大小
		var query = wx.createSelectorQuery()
		query.select('.goods-action-icon').boundingClientRect()
		await query.exec(res => {
			this.setData({
				pageHeight: res[0].top
			})
		})

		//从post-display组件中直接跳转过来，传递这个帖子的_id
		//下次优化，可以使用JSON.parse，前端使用data-index绑定index，后端用JSON传递对象
		//返回一个商品的基本信息，和用户是否收藏这个商品，以及买家的评论
		await wx.cloud.callFunction({
			name: 'getGoods',
			data: {
				goodsId: this.data.goodsId
			}
		}).then(res => {
			this.setData({
				goods: res.result.goods,
				isCollected: res.result.isCollected,
				originIsCollected: res.result.isCollected
			})
		})

		wx.hideLoading({
			success: (res) => {},
		})


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
			url: '../orderGenerate/orderGenerate?goodsId='+this.data.goodsId,
		})
	},

	collectGoods() {
		if (this.data.isCollected == false) {
			this.setData({
				isCollected: true
			})
		} else if (this.data.isCollected == true) {
			this.setData({
				isCollected: false
			})
		}
	}
})