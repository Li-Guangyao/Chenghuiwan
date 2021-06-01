const db = wx.cloud.database()

Page({

    data: {
        // 在my页面，必定会储存userInfo，因为需要授权
        userInfo: wx.getStorageSync('userInfo'),
        postList: [],
        inputIntroFocused: false,

        fanNum: 0,
        followedNum: 0
    },

    queryParams: {
        pagenum: 0,
        pagesize: 20
    },

    onLoad: function(e) { 
        // 不指定data，说明获取自己的帖子
		wx.cloud.callFunction({
			name: 'getHomepage',
			data: {
				openId: this.data.userInfo._openid
			}
		}).then(res => {
			this.setData({
				userInfo: res.result.userInfo,
				postList: res.result.postList,
			})
        })
        
        this.getNum()
    },

    getNum(){
		wx.cloud.callFunction({
			name: 'getFollowedNum',
			data:{
				openId: this.data.userInfo._openid
			}
		}).then(res=>{
			this.setData({
				followedNum: res.result
			})
		})

		wx.cloud.callFunction({
			name: 'getFanNum',
			data:{
				openId: this.data.userInfo._openid
			}
		}).then(res=>{
			this.setData({
				fanNum: res.result
			})
		})
	},

    onReady: function() {

    },

    onReachBottom: function() {
        console.log('person页面触底')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    chosePost: function(e) {
        console.log(e)
    },

    // 点击了自我介绍
    tapIntro(){
        this.setData({
            inputIntroFocused: ! this.data.inputIntroFocused
        })
    },

    inputIntro(e){
        var item = 'userInfo.introduction'
        console.log(e)
        this.setData({
            [item]: e.detail.value
        })
    }
})