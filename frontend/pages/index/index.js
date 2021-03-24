Page({
    data: {
        tabs: ["推荐", "数码", "ACG", "玩具", "美术", "乐器", "运动", "手工", "生活", "其他"],
        chosenTabIndex: 0,
        tabWidth: 0,
        scrollLeft: 0,
        swiperHeight: 0 
    },

    onLoad: function () {
        wx.getSystemInfo({
            success: (res) => {
                console.log("systemInfo:")
                console.log(res)
                var tabWidth = res.windowWidth / 4.5; //设置tab的宽度
                this.setData({
                    tabWidth: tabWidth,
                    swiperHeight: res.windowHeight
                })
            }
        })
    },

    onReachBottom: function () {
        console.log("index页面触底")
    },

    onPullDownRefresh: function(){
        console.log("index下拉刷新")
    },

    handleTabTap: function (e) {
        var chosenTabIndex = e.currentTarget.dataset.index
        this.setData({
            scrollLeft: (chosenTabIndex - 2) * this.data.tabWidth
        })
        if (this.data.chosenTabIndex != chosenTabIndex) {
            this.setData({
                chosenTabIndex: chosenTabIndex
            })
        }

    },

    handleSwiperChange: function (e) {
        var chosenTabIndex = e.detail.current
        this.setData({
            chosenTabIndex: chosenTabIndex,
            scrollLeft: (chosenTabIndex - 2) * this.data.tabWidth
        })
    }


})