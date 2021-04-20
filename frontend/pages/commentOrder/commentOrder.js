import date from '../../utils/date'
import judgeImageFormat from '../../utils/judgeImageFormat'
import uploadImage from '../../utils/uploadImage'

Page({
	data: {
		order: null,
		// 晒单照片
		fileList: [],
		// 评分项
		descRate: 0,
		expressRate: 0,
		serviceRate: 0
	},

	onLoad: function (e) {
		var order = JSON.parse(e.order)
		this.setData({
			order: order
		})
	},

	chosenImage(e) {
		// console.log(e)
		const openId = wx.getStorageSync('openId')
		var fileList = e.detail.file
		var oldArrayLength = this.data.fileList.length
		var newArrayLength = fileList.length
		// console.log(fileLis)

		if (oldArrayLength + newArrayLength > 9) {
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
		if (this.data.title == '') {
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
						var uploadedFileList = await uploadImage()

						wx.cloud.callFunction({
							name: saveOrderComment,
							data:{

							}
						})

						db.collection('t_order_comment').add({
							data: {
								title: this.data.title,
								content: this.data.content,
								created_at: date(),
								post_photo: uploadedFileList,
								like_amount: 0,
								is_deleted: false,
							}
						})
					} else {}
				}
			})
		}
	},

	// 界面改变评分，data改变
	rateChange(){

	}
})