import date from '../../utils/date'
import judgeImageFormat from '../../utils/judgeImageFormat'
import uploadImage from '../../utils/uploadImage'

Page({
	data: {
		order: null,
		content: '',
		// 晒单照片
		fileList: [],
		// 评分项
		descRate: 0,
		expressRate: 0,
		serviceRate: 0,

		pageHeight: null
	},

	onLoad: function (e) {
		var order = JSON.parse(decodeURIComponent(e.order))
		this.setData({
			order: order
		})

		//根据底部下单区域的高矮，来初始化页面的大小
		var query = wx.createSelectorQuery()
		query.select('.fixed-region').boundingClientRect()
		query.exec(res => {
			this.setData({
				pageHeight: res[0].top
			})
		})
	},

	contentInput(e) {
		this.setData({
			content: e.detail.value
		})
	},

	chosenImage(e) {
		const openId = wx.getStorageSync('openId')
		var fileList = e.detail.file
		var oldArrayLength = this.data.fileList.length
		var newArrayLength = fileList.length

		if (oldArrayLength + newArrayLength > 8) {
			wx.showModal({
				showCancel: false,
				cancelColor: 'cancelColor',
				content: '最多上传8张图片'
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

	// 点击保存评论按钮
	saveComment() {
		// 三个都必须评分才能保存
		if (this.data.descRate == 0 || this.data.expressRate == 0 || this.data.serviceRate == 0) {
			wx.showToast({
				title: '您没有评分',
				icon: 'none'
			});
		} else {
			wx.showModal({
				content: '确定保存',
				success: async (e) => {
					if (e.confirm) {
						// 用户点击了确定
						var uploadedFileList = await uploadImage(this.data.fileList, 'orderComment')

						wx.cloud.callFunction({
							name: 'saveOrderComment',
							data: {
								orderId: this.data.order._id,
								goodsId: this.data.order.goods._id,
								content: this.data.content,
								// 晒单照片
								fileList: uploadedFileList,
								// 评分项
								descRate: this.data.descRate,
								expressRate: this.data.expressRate,
								serviceRate: this.data.serviceRate,
								createdAt: date()
							}
						}).then(res => {
							wx.showToast({
								title: '保存成功',
								icon: 'none'
							});

							wx.navigateBack({
								delta: 2,
							})
						})

					} else {}
				}
			})
		}
	}
})