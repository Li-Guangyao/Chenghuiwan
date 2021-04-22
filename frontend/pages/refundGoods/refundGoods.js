import date from '../../utils/date'
import judgeImageFormat from '../../utils/judgeImageFormat'
import uploadImage from '../../utils/uploadImage'

Page({
	data: {
		order: null,
		// 0直接退款，1退货退款
		refundType: null,
		// 退款理由选择
		showPopup: false,
		// 退款理由index
		radio: 0,
		refundReason: [
			"七天无理由退换货",
			"卖家发错货",
			"商品描述与实物不符",
			"质量问题",
			"包装破损",
			"物流太慢"
		],
		detailedRefundReason: '',
		// 上传图片凭证
		fileList: []
	},

	onLoad: function (e) {
		var order = JSON.parse(e.order)
		var refundType = e.refundType
		this.setData({
			order: order,
			refundType: refundType
		})
	},

	showPopup() {
		console.log('showPopup')
		this.setData({
			showPopup: true
		})
	},

	closePopup() {
		this.setData({
			showPopup: false
		})
	},

	// 退货原因选择
	pickerChange(e) {
		this.setData({
			radio: e.detail.index
		})
	},

	// 输入详细退款信息
	detailedReasonChange(e) {
		this.setData({
			detailedRefundReason: e.detail
		})
	},

	// 在文件列表中选择图片之后
	chosenImage(e) {
		const openId = wx.getStorageSync('openId')
		var fileList = e.detail.file
		var oldArrayLength = this.data.fileList.length
		var newArrayLength = fileList.length

		if (oldArrayLength + newArrayLength > 4) {
			wx.showModal({
				showCancel: false,
				cancelColor: 'cancelColor',
				content: '最多上传4张图片'
			})
		} else {
			for (var i = oldArrayLength, len = oldArrayLength + newArrayLength; i < len; i++) {
				var item = 'fileList[' + i + ']'
				var imageFormat = judgeImageFormat(fileList[i - oldArrayLength].url)
				this.setData({
					[item]: {
						url: fileList[i - oldArrayLength].url,
						name: openId + '-' + Date.now() + '-' + i + '.' + imageFormat,
						isImage: true,
					}
				})
			}
		}
	},

	// 点击图片右上角的叉号
	removeImage(e) {
		this.data.fileList.splice(e.detail.index, 1)
		this.setData({
			fileList: this.data.fileList
		})
	},

	// 点击保存按钮
	submit() {
		wx.showModal({
			content: '确定保存',
			success: async (e) => {
				if (e.confirm) {
					wx.showLoading({
						title: '保存退货信息',
					})

					// 用户点击了确定
					var uploadedFileList = await uploadImage(this.data.fileList, 'refundReason')

					await wx.cloud.callFunction({
						name: 'saveRefund',
						data: {
							orderId: this.data.order._id,
							refundType: this.data.refundType,
							refundReason: this.refundReason[this.data.radio],
							fileList: uploadedFileList,
							detailedRefundReason: this.data.detailedRefundReason,
							createdAt: date()
						}
					}).then(res => {
						wx.showToast({
							title: '保存成功',
							icon: 'none'
						});

						wx.hideLoading()

						wx.navigateBack({
							delta: 2,
						})
					}).catch(err => {
						wx.hideLoading()
					})

				} else {}
			},

		})
	}
})