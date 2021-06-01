import changeOptionFormat from "../../utils/changeOptionFormat"
import changeChosenOptionFormat from "../../utils/changeChosenOptionFormat"

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
		chosenGoodsOption: [],

		// 选项对商品造成的差价
		priceDiff: 0,

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
		wx.showNavigationBarLoading()
		this.initPageContent()

		//隐藏导航条加载动画
		wx.hideNavigationBarLoading()
		//停止下拉刷新
		wx.stopPullDownRefresh()
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

		// 返回一个商品的基本信息，这个商品的购买选项，和用户是否收藏这个商品，以及买家的评论
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
				goodsOption: changeOptionFormat(res.result.goodsOption)
			})
		})

		wx.hideLoading({
			success: (res) => {},
		})
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

	// 在首页点击“立即购买”
	tapInstantBuy() {
		// 如果这个商品有选项
		if (this.data.goods.pk_goods_option) {
			this.showPopup()
		} else {
			this.tapBuy()
		}
	},

	// 点击购买按键
	tapBuy() {
		var goods = JSON.stringify(this.data.goods)
		var chosenGoodsOption = JSON.stringify(this.data.chosenGoodsOption)
		var price = this.data.priceDiff + this.data.goods.price

		if (this.isAllOptionChosen()) {
			wx.navigateTo({
				url: '../orderGenerate/orderGenerate?goods=' + encodeURIComponent(goods) + '&option=' + chosenGoodsOption + '&price=' + price
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
				chosenNum: this.data.chosenNum - 1
			})
		} else {
			// 先把价格恢复，之后再把这个option的所有isChosen改为false
			for (var i = 0; i < optionItemAttr.length; i++) {
				if (optionItemAttr[i].isChosen == true) {
					// 点击了其他项，要减去之前点击的项，价格的影响
					this.setData({
						chosenNum: this.data.chosenNum - 1
					})
				}
				optionItemAttr[i].isChosen = false
			}

			// 选中了
			optionItemAttr[l2idx].isChosen = true

			// 把这个属性整体的所有内容赋值回去
			var item = 'goodsOption[' + l1idx + '].attribute'
			this.setData({
				[item]: optionItemAttr,
				chosenNum: this.data.chosenNum + 1
			})
		}
		this.isAllOptionChosen()
	},

	// 检验是否所有的option都被选中，如果是，就把tempChangedPrice赋值给changedPrice
	// 如果否，就把商品原始的价格赋值给changedPrice
	isAllOptionChosen() {
		if (this.data.goodsOption.length == 0) {
			return true
		} else if (this.data.chosenNum == this.data.goodsOption.length) {
			var res = changeChosenOptionFormat(this.data.goodsOption)
			this.setData({
				priceDiff: res.priceDiff,
				chosenGoodsOption: res.changedOptionArray
			})
			return true
		} else {
			this.setData({
				priceDiff: 0,
				chosenGoodsOption: []
			})
			return false
		}
	}
})