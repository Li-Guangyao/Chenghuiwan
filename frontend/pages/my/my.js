const db = wx.cloud.database()

Page({
    data: {
        userInfo: null,

        // 本来想以数字作为key，没想到前端识别不了orderNum.0这种格式
        // 所以在订单状态数字前面加上个status
        orderNum: {
            status0: null,
            status1: null,
            status2: null,
            status3: null,
        },
    },

    onLoad: function (options) {
        this.getUser()
        this.getOrderNum()
    },

    onReady: function () {

    },

    onShow: function () {
        //每次载入刷新
        this.getOrderNum()
    },

    // 从云端获得用户信息
    getUser() {
        wx.cloud.callFunction({
            name: 'getUser',
            success: (res) => {
                this.setData({
                    userInfo: res.result
                })
                wx.setStorageSync('userInfo', res.result)
            }
        })
    },

    // 如果是新用户，就需要授权获取
	getUserInfo() {
		wx.getUserProfile({
			desc: '获取用户信息',
			success: (res) => {
				this.setData({
					userInfo: res.userInfo
				})
				wx.setStorageSync('userInfo', res.userInfo)
				wx.cloud.callFunction({
					name: 'saveUser',
					data: {
						userInfo: this.data.userInfo
					},
				})
			},
			fail: res => {
				console.log(res)
			}
		})
	},

    // 点击订单
    tapOrders(e) {
        wx.navigateTo({
            url: '../orderList/orderList?orderType=' + e.currentTarget.dataset.ordertype,
        })
    },

    // 获取每种订单的数量，用于显示在小图标上
    getOrderNum() {
        wx.cloud.callFunction({
            name: 'getOrderNum'
        }).then(res => {
            console.log(res)
            // 每次重置，因为从后端获得数据之后，只改变某些对应的值
            this.setData({
                orderNum: {}
            })
            // 返回对象
            for (var i in res.result.list) {
                var item = res.result.list[i]
                var itemId = 'orderNum.status' + item._id
                this.setData({
                    [itemId]: res.result.list[i].count,
                })
            }
        })
    }
})