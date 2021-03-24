Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabbar: [
            {
            id: 0,
            name: "我的关注",
            isChosen: true
            },
            {
                id: 1,
                name: "本地动态",
                isChosen: false
            }
        ],
        chosenTabIndex: 0,
        swiperHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                console.log(res.windowHeight)
                console.log(res.statusBarHeight)
                this.setData({
                    swiperHeight: res.windowHeight
                })
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("community页面触底！")
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    handleTabbarChange(e) {
        //获取点击的tabbar项下标
        const chosenTabIndex = e.detail.index;
        let tabbar = this.data.tabbar;
        //根据获取的下表，改变tabbar
        tabbar.forEach((v, i) => i === chosenTabIndex ? v.isChosen = true : v.isChosen = false);
        // console.log(this)
        this.setData({
            tabbar,
            chosenTabIndex
        });
    },

    handleSwiperChange: function (e) {
        var chosenTabIndex = e.detail.current
        let tabbar = this.data.tabbar;
        //根据获取的下表，改变tabbar
        tabbar.forEach((v, i) => i === chosenTabIndex ? v.isChosen = true : v.isChosen = false);
        this.setData({
            tabbar,
            chosenTabIndex
        })
    }


})