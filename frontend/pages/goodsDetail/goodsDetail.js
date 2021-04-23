const db = wx.cloud.database()
Page({

	data: {
		goods: {},
		goodsId: null,

		isCollected: false,
		originIsCollected: false,

		showShareSheet: false,
		shareOptions: [{
				name: '微信',
				icon: 'wechat'
			},
			{
				name: '微博',
				icon: 'weibo'
			},
			{
				name: 'QQ',
				icon: 'qq'
			},
			{
				name: '复制链接',
				icon: 'link'
			},
			{
				name: '分享海报',
				icon: 'poster'
			},
			{
				name: '二维码',
				icon: 'qrcode'
			},
		],

		// 用于初始化整个页面的高度
		pageHeight: null,
		// 弹出选择框
		showPopup: false,
		// 商品规格选择
		goodsOption: []
	},

	onLoad: function (e) {
		//保存从商品列表传来的goodsId
		this.setData({
			goodsId: e.goodsId
		})

		this.initPageContent()

		// 虽然goodsOption返回了一个数组，但是数组里面的对象以字符串形式存在
		// 这里把每项都parse然后写回去，使得数组中对象以正常形式存在
		for (var i=0; i < this.data.goodsOption.length; i++) {		
			console.log(i)
			var item = JSON.parse(this.data.goods.goodsOption[i])
			var itemName = 'goodsOption[' + i + ']'
			this.setData({
				[itemName]: item
			})
		}

	},

	onHide: function () {
		console.log('onHide')
	},

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
		query.exec(res => {
			this.setData({
				pageHeight: res[0].top
			})
		})

		//返回一个商品的基本信息，这个商品的购买选项，和用户是否收藏这个商品，以及买家的评论
		await wx.cloud.callFunction({
			name: 'getGoods',
			data: {
				goodsId: this.data.goodsId
			}
		}).then(res => {
			console.log(res)
			this.setData({
				goods: res.result.goods,
				isCollected: res.result.isCollected,
				originIsCollected: res.result.isCollected,
				goodsOption: res.result.goodsOption
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

	// 点击展示图片
	previewImage(e) {
		wx.previewImage({
			urls: this.data.goods.display_photo,
			current: this.data.goods.display_photo[e.currentTarget.dataset.index],
			showmenu: true,
		})
	},

	// 点击商品介绍图片
	previewDetailImage(e) {
		wx.previewImage({
			urls: this.data.goods.detail_photo,
			current: this.data.goods.detail_photo[e.currentTarget.dataset.index],
			showmenu: true,
		})
	},

	// 点击分享按键
	tapShare() {
		console.log(typeof (this.data.goodsOption))
		console.log(typeof (this.data.goodsOption[0]))


		console.log(this.data.goodsOption)
		console.log(JSON.parse(this.data.goodsOption[0]))
		console.log(typeof (JSON.parse(this.data.goodsOption[0])))
		console.log(this.data.goodsOption[0].name)

		this.setData({
			showShareSheet: true
		})
	},

	// 点击客服按键
	tapService() {
		wx.navigateTo({
			url: '../customerService/customerService',
		})
	},

	// 点击购买按键
	tapBuy() {
		wx.navigateTo({
			url: '../orderGenerate/orderGenerate?goodsId=' + this.data.goodsId,
		})
	},

	// 关闭分享面板
	closeShareSheet() {
		this.setData({
			showShareSheet: false
		})
	},

	// 选择某个分享方式
	selectShareOption(e) {
		console.log(e)
	},

	// 点击收藏按钮
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
	},

	// 选择商品规格，弹出选择框
	showPopup() {
		this.setData({
			showPopup: true
		})
	}
})