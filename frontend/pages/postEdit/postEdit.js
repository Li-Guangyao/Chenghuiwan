const db = wx.cloud.database()

//获取标准的时间格式yyyy-mm-dd hh:mm，而非时间戳
import date from '../../utils/date'
import judgeImageFormat from '../../utils/judgeImageFormat'

Page({
	data: {
		title: '',
		content: '',
		location: '',
		topic: [],
		fileList: [],
	},

	onLoad() {
		console.log(date())
	},

	titleInput(e) {
		this.setData({
			title: e.detail.value
		})
	},

	contentInput(e) {
		this.setData({
			content: e.detail.text
		})
	},

	// upload选择完会触发这个函数，把所有选择的图片生成临时地址
	chosenImage(e) {
		// console.log(e)
		const openId = wx.getStorageSync('openId')
		var fileList = e.detail.file
		var oldArrayLength = this.data.fileList.length
		var newArrayLength = fileList.length

		if (oldArrayLength + newArrayLength > 9) {
			wx.showModal({
				showCancel: false,
				cancelColor: 'cancelColor',
				content: '最多上传9张图片'
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
	
	//删除点击的图片
	removeImage(e) {
		this.data.fileList.splice(e.detail.index, 1)
		//然后赋值回去，更新前端
		this.setData({
			fileList: this.data.fileList
		})
	},

	//editor组件无法使用model:value来直接修改，所以需要使用DOM来操作
	onEditorReady() {
		const that = this
		wx.createSelectorQuery().select('.content-input').context(function (res) {
			that.editorCtx = res.context
		}).exec()
	},

	//editor组件无法使用model:value来直接修改，所以需要使用DOM来操作
	clearContentExecute() {
		this.setData({
			title: '',
			content: '',
			location: '',
			topic: [],
			fileList: [],
		})
		this.editorCtx.clear({
			success: function (res) {
				console.log("clear success")
			}
		})
	},

	clearContent() {
		wx.showModal({
			content: '确定要清空吗？',
			success: e => {
				if (e.confirm) {
					// 用户点击了确定 可以调用删除方法了
					this.clearContentExecute()
				} else if (e.cancel) {
					console.log('用户点击取消')
				}
			}
		})

	},

	publishPost() {
		if (this.data.title == '') {
			wx.showToast({
				title: '标题不能为空！',
				icon: 'none'
			});
		} else {
			wx.showModal({
				content: '确定要发布吗？',
				success: async (e) => {
					if (e.confirm) {
						// 用户点击了确定
						var uploadedFileList = await this.uploadImage()

						await wx.cloud.callFunction({
							name: 'saveNewPost',
							data: {
								title: this.data.title,
								content: this.data.content,
								createdAt: date(),
								postPhoto: uploadedFileList,
								likeAmount: 0,
								isDeleted: false,
							}
						})

						// 保存内容之后删除该页的数据
						this.clearContentExecute()
					} else if (e.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
	},

	//上传图片至云存储
	async uploadImage() {
		const fileList = this.data.fileList;
		if (!fileList.length) {
			wx.showToast({
				title: '请选择至少一张图片',
				icon: 'none'
			});
		} else {
			const uploadTasks = fileList.map(file => this.uploadFilePromise(file))
			// uploadTasks是若干Promise对象的集合，此时已经上传成功
			// 用下面的方法，data就是提取出来的返回结果
			return Promise.all(uploadTasks)
				.then(data => {
					wx.showToast({
						title: '发布笔记成功',
						icon: 'none'
					});
					// console.log(data)
					//上传成功后，返回一个列表，fileID为图片的固定地址
					var uploadedFileList = []
					for (var i = 0; i < data.length; i++) {
						uploadedFileList.push(data[i].fileID)
					}
					//把固定地址返回，保存进数据库
					return uploadedFileList;
				})
				.catch(e => {
					wx.showToast({
						title: '上传失败',
						icon: 'none'
					});
					console.log(e);
				});
		}
	},

	uploadFilePromise(file) {
		return wx.cloud.uploadFile({
			cloudPath: 'postPhoto/' + file.name,
			filePath: file.url
		});
	}
});