// pages/orders/orders.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderType: null,
		orderList: []
	},

	onLoad: async function (e) {

		wx.showLoading({
			title: '加载中',
		})

		this.setData({
			orderType: Number(e.orderType)
		})

		await wx.cloud.callFunction({
			name: 'getOrder',
			data: {
				orderType: Number(e.orderType)
			}
		}).then(res => {
			console.log(res)
			if (res.result.data) {
				console.log(res)
				this.setData({
					orderList: res.result.data
				})
			} else {
				wx.showToast({
					icon: 'error',
					title: '空空如也',
				})
			}
		})

		wx.hideLoading({})
	},

	// 点击订单，跳转
	clickOrder(e) {
		var order = JSON.stringify(this.data.orderList[e.currentTarget.dataset.index])
		wx.navigateTo({
			url: '../orderDetail/orderDetail?order=' + order,
		})
	},

	// 取消订单
	cancelOrder(e) {
		wx.showModal({
			title: '确定取消订单？',
			showCancel: true
		}).then(res => {
			if (res.confirm) {
				// cancel
				wx.cloud.callFunction({
					name: 'cancelOrder',
					data: {
						orderId: this.data.orderList[e.currentTarget.dataset.index]._id
					}
				})
			} else {}
		})
	},

	// 支付
	payOrder(){
		wx.showModal({
			title: '确定支付订单',
			showCancel: true
		}).then(res => {
			if (res.confirm) {
				// cancel
				wx.cloud.callFunction({
					name: 'payOrder',
					data: {
						orderId: this.data.orderList[e.currentTarget.dataset.index]._id
					}
				})
			} else {}
		})
	},

	// 催促发货
	urgeSending(e) {
		wx.showModal({
			title: '已经提醒卖家快点发货',
			showCancel: false
		})
	},

	// 查询快递
	expressStatus(e){
		wx.showModal({
			title: '查询快递信息',
			showCancel: false
		})
	},

	// 确认收货
	confirmReceiving(e){
		wx.cloud.callFunction({
			name: 'confirmReceiving',
			data: {
				orderId: this.data.orderList[e.currentTarget.dataset.index]._id
			}
		})
	},

	// 去评价商品的页面
	toComment(e){
		var order = JSON.stringify(this.data.orderList[e.currentTarget.dataset.index])
		wx.navigateTo({
		  url: '../commentOrder/commentOrder?order='+ order,
		})
	}

})