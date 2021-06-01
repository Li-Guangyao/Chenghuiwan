import changeOptionFormat from "../../utils/changeOptionFormat"
import changeChosenOptionFormat from "../../utils/changeChosenOptionFormat"
import uploadImage from "../../utils/uploadImage"

Page({
	data: {
		order: null,
		changeType: null,

		radio: 0,
		reason: [
			"七天无理由退换货",
			"尺码/型号不合适",
			"卖家发错货",
			"质量问题",
			"其他原因"
		],
		goodsOption: [],
		chosenGoodsOption: [],

		priceDiff: 0,
		chosenNum: 0,

		detailedReason: '',
		// 上传图片凭证
		fileList: []
	},

	onLoad: function (e) {
		var order = JSON.parse(decodeURIComponent(e.order))
		var changeType = e.changeType
		this.setData({
			order: order,
			changeType: changeType
		})
		this.getGoodsOption()
	},

	// 获取商品的选项
	getGoodsOption() {
		wx.cloud.callFunction({
			name: 'getGoodsOption',
			data: {
				goodsOptionId: this.data.order.goods.pk_goods_option
			}
		}).then(res => {
			this.setData({
				goodsOption: changeOptionFormat(res.result)
			})
		})
	},

	showReasonPopup() {
		this.setData({
			showReasonPopup: true
		})
	},

	closeReasonPopup() {
		this.setData({
			showReasonPopup: false
		})
	},

	showOptionPopup() {
		this.setData({
			showOptionPopup: true
		})
	},

	closeOptionPopup() {
		this.setData({
			showOptionPopup: false
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
			detailedReason: e.detail
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
					var uploadedFileList = []
					if(this.data.fileList.length!=0){
						uploadedFileList = await uploadImage(this.data.fileList, 'refundReason')
					}

					await wx.cloud.callFunction({
						name: 'saveChange',
						data: {
							orderId: this.data.order._id,
							refundType: this.data.refundType,
							refundReason: this.data.reason[this.data.radio],
							fileList: uploadedFileList,
							detailedReason: this.data.detailedReason,
						}
					}).then(res => {
						wx.showToast({
							title: '保存成功',
							icon: 'none'
						});

						wx.hideLoading()

						wx.navigateBack({
						  delta:2,
						})
					}).catch(err => {
						wx.showToast({
							title: '保存失败',
							icon: 'none'
						});

						wx.hideLoading()
					})
				} else {}
			},
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
			// 就取消选中
			this.setData({
				[item]: false,
				chosenNum: this.data.chosenNum - 1,
			})
			// 如果之前没有选中
		} else {
			// 把这个option的所有isChosen改为false，再把选择的这一项isChosen设为true
			for (var i = 0; i < optionItemAttr.length; i++) {
				// 找到之前选择的项
				if (optionItemAttr[i].isChosen == true) {
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

	// 检验是否所有的option都被选中
	isAllOptionChosen() {
		if (this.data.chosenNum == this.data.goodsOption.length) {
			var res = changeChosenOptionFormat(this.data.goodsOption)
			this.setData({
				priceDiff: res.priceDiff,
				chosenGoodsOption: res.changedOptionArray
			})
		} else {
			this.setData({
				priceDiff: 0,
				chosenGoodsOption: []
			})
		}
	}
})