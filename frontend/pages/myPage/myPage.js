const db = wx.cloud.database()

Page({

    data: {
        // 在my页面，必定会储存userInfo，因为需要授权
        userInfo: wx.getStorageSync('userInfo'),
        postList: [],
        inputIntroFocused: false
    },

    queryParams: {
        pagenum: 0,
        pagesize: 20
    },

    onLoad: function(e) { 
        // 不指定data，说明获取自己的帖子
        wx.cloud.callFunction({
            name: 'getPost',
            data:{}
        }).then(res=>{
            this.setData({
                postList: res.result.data
            })
        })
    },

    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

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