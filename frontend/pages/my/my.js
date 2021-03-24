Page({
    data: {
        userInfo: wx.getStorageSync('userInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
                    wx.getUserInfo({
                        success: (res) => {}
                    })
                } else { //未授权，跳到授权页面
                    wx.redirectTo({
                        url: '../authorize/authorize', //授权页面
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    }
})