Page({

	data: {
		collectionList:[]
	},

	onLoad: async function (options) {
		wx.showLoading({
		  title: '加载中',
		})

		await wx.cloud.callFunction({
			name: 'getCollection'
		}).then(res=>{
			console.log(res)
			this.setData({
				collectionList: res.result
			})
		})

		wx.hideLoading({
		  success: (res) => {},
		})
		

	},

	buy(e){
		var goods = JSON.stringify(this.data.collectionList[e.currentTarget.dataset.index])
		wx.navigateTo({
		  url: '../orderGenerate/orderGenerate?goods='+ encodeURIComponent(goods),
		})
	}
})