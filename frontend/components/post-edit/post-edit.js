// components/post-edit/post-edit.js
Component({
	options: {
		styleIsolation: 'shared',
	},
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		// testArea:{
		// 	maxHeight: 6000,
		// 	minHeight: 1000
		// }
		photoList: []
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		afterRead(event) {
			const {
				file
			} = event.detail;
			// // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			// wx.uploadFile({
			//   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
			//   filePath: file.url,
			//   name: 'file',
			//   formData: { user: 'test' },
			//   success(res) {
			// 	// 上传完成需要更新 fileList
			// 	const { fileList = [] } = this.data;
			// 	fileList.push({ ...file, url: res.data });
			// 	this.setData({ fileList });
			//   },
			// });

			console.log(file)
		},

		// 上传图片
		uploadToCloud() {
			wx.cloud.init();
			const {
				fileList
			} = this.data;
			if (!fileList.length) {
				wx.showToast({
					title: '请选择图片',
					icon: 'none'
				});
			} else {
				const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
				Promise.all(uploadTasks)
					.then(data => {
						wx.showToast({
							title: '上传成功',
							icon: 'none'
						});
						const newFileList = data.map(item => {
							url: item.fileID
						});
						this.setData({
							cloudPath: data,
							fileList: newFileList
						});
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
		uploadFilePromise(fileName, chooseResult) {
			return wx.cloud.uploadFile({
			  cloudPath: fileName,
			  filePath: chooseResult.url
			});
		},
	}
})