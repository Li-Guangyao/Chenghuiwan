Page({
	data: {
		order: null,

		showPopupChange: false,
		showPopupRefund: false,

		actionsChange: [{
			index: 0,
			name: '未收到货',
		}, {
			index: 1,
			name: '已收到货',
		}, ],

		actionsRefund: [{
			index: 0,
			name: '无需退货，直接退款',
		}, {
			index: 1,
			name: '已收到货，退货退款',
		}],
	},

	onLoad: function (e) {
		var order = JSON.parse(e.order)
		this.setData({
			order: order
		})
	},

	// 退换货
	changeOrRefund() {
		var order = JSON.stringify(this.data.order)
		wx.navigateTo({
			url: '../changeOrRefund/changeOrRefund?order=' + order,
		})
	},

	// 点击换货按钮
	clickChange() {
		this.setData({
			showPopupChange: true
		})
	},

	// 退货按钮
	clickRefund() {
		this.setData({
			showPopupRefund: true
		})
	},

	// 关闭PupupChange
	closePopupChange() {
		this.setData({
			showPopupChange: false
		});
	},

	// 关闭popupRefund
	closePopupRefund() {
		this.setData({
			showPopupRefund: false
		});
	},

	selectPopupChange(e) {
		var order = JSON.stringify(this.data.order)
		console.log(order)
		console.log(typeof(order))
		wx.navigateTo({
			url: '../changeGoods/changeGoods?changeType=' + e.detail.index + '&order=' + order
		})
	},

	selectPopupRefund(e) {
		var order = JSON.stringify(this.data.order)
		wx.navigateTo({
			url: '../refundGoods/refundGoods?refundType=' + e.detail.index + '&order=' + order
		})
	}
})