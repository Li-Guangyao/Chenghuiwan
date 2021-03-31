Page({
	data: {
		fileList: [],
	},
	
	chosenImage(e) {
		console.log(e)
		var fileList = e.detail.file
		console.log(fileList)
		fileList.push
	},

	// chosenImage(event) {
	// 	console.log(event)
	// 	console.log("aft")
		// const file = event.detail.file;
		// console.log(file)
		// this.setData({
		// 	fileList: file.url
		// })		
	// },


	uploadToCloud(){
		const fileList = this.data.fileList;
		if(!fileList.length){
			wx.showToast({title:'请选择图片', icon:'none'});
		}else{
			const uploadTasks = fileList.map((file,index)=>this.uploadFilePromise)
		}
	}
});