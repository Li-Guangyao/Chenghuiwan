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

	clickOrder(e) {
		wx.navigateTo({
			url: '../orderDetail/orderDetail?goods=' + this.data.orderList[e.currentTarget.dataset.index].goods,
		})
	},

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

	expressStatus(e){
		wx.showModal({
			title: '查询快递信息',
			showCancel: false
		})
	},

	confirmReceiving(e){
		wx.cloud.callFunction({
			name: 'confirmReceiving',
			data: {
				orderId: this.data.orderList[e.currentTarget.dataset.index]._id
			}
		})
	}

})