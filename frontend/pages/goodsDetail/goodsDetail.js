const db = wx.cloud.database()
Page({

	data: {
		goodsId: null,
		goods: {},

		isCollected: false,
		originIsCollected: false,

		showShareSheet: false,
		shareOptions: [{
			name: '微信',
			icon: 'wechat'
		}, {
			name: '微博',
			icon: 'weibo'
		}, {
			name: 'QQ',
			icon: 'qq'
		}, {
			name: '复制链接',
			icon: 'link'
		}, {
			name: '分享海报',
			icon: 'poster'
		}, {
			name: '二维码',
			icon: 'qrcode'
		}, ],

		// 用于初始化整个页面的高度
		pageHeight: null,
		// 弹出选择框
		showPopup: false,
		// 商品规格选择
		goodsOption: [],
		// 选择不同规格，改变之后的价格
		changedPrice: null,
		// 临时变量，用于记录选择option时的中间结果，如果满足条件，就把这个值赋给changedPrice，显示到popup中
		tempChangedPrice: null,
		// 记录现在已经选择了几个option，用于判断是否选择完，给出价格
		chosenNum: 0
	},

	onLoad: function (e) {
		//保存从商品列表传来的goodsId
		this.setData({
			goodsId: e.goodsId
		})

		this.initPageContent()

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

		wx.getSystemInfo({
		  success: (result) => {console.log(result)},
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


			this.changeOptionFormat()
			this.setData({
				changedPrice: this.data.goods.price,
				tempChangedPrice: this.data.goods.price
			})

		})

		wx.hideLoading({
			success: (res) => {},
		})
	},

	// 虽然goodsOption返回了一个数组，但是数组里面的对象以字符串形式存在
	// 这里把每项都parse然后写回去，使得数组中对象以正常形式存在
	changeOptionFormat() {
		for (var i = 0; i < this.data.goodsOption.length; i++) {
			var item = JSON.parse(this.data.goodsOption[i])
			var itemName = 'goodsOption[' + i + ']'
			this.setData({
				[itemName]: item
			})
		}
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
		if (this.isAllOptionChosen()) {
			wx.navigateTo({
				url: '../orderGenerate/orderGenerate?goodsId=' + this.data.goodsId,
			})
		} else if (this.data.showPopup == false) {
			this.setData({
				showPopup: true
			})
		} else {}

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
	},

	closePopup() {
		this.setData({
			showPopup: false
		})
	},

	// 选择某个规格
	choseOption(e) {
		var l1idx = e.currentTarget.dataset.l1idx
		var l2idx = e.currentTarget.dataset.l2idx
		// 点击的这个大类，拿出来
		var optionItemAttr = this.data.goodsOption[l1idx].attribute

		// 如果这个本来就被选中了
		if (optionItemAttr[l2idx].isChosen) {
			var item = 'goodsOption[' + l1idx + '].attribute[' + l2idx + '].isChosen'
			this.setData({
				[item]: false,
				tempChangedPrice: this.data.tempChangedPrice - optionItemAttr[l2idx].price,
				chosenNum: this.data.chosenNum - 1
			})
		} else {
			var changedPrice = this.data.tempChangedPrice

			// 先把价格恢复，之后再把这个option的所有isChosen改为false
			for (var i = 0; i < optionItemAttr.length; i++) {
				if (optionItemAttr[i].isChosen == true) {
					// 点击了其他项，要减去之前点击的项，价格的影响
					changedPrice = changedPrice - optionItemAttr[i].price
					this.setData({
						chosenNum: this.data.chosenNum - 1
					})
				}
				optionItemAttr[i].isChosen = false
			}

			// 选中了，并且加上价格
			optionItemAttr[l2idx].isChosen = true
			changedPrice = changedPrice + optionItemAttr[l2idx].price
			if (changedPrice < 0) {
				changedPrice = 0
			}

			// 把这个属性整体的所有内容赋值回去
			var item = 'goodsOption[' + l1idx + '].attribute'
			this.setData({
				[item]: optionItemAttr,
				tempChangedPrice: changedPrice,
				chosenNum: this.data.chosenNum + 1
			})

		}

		this.isAllOptionChosen()
	},

	// 检验是否所有的option都被选中，如果是，就把tempChangedPrice赋值给changedPrice
	// 如果否，就把商品原始的价格赋值给changedPrice
	isAllOptionChosen() {
		if (this.data.chosenNum == this.data.goodsOption.length) {
			this.setData({
				changedPrice: this.data.tempChangedPrice
			})
			return true
		} else {
			this.setData({
				changedPrice: this.data.goods.price
			})
			return false
		}
	}
})