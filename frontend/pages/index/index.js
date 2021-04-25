Page({
    data: {
        tabs: ["推荐", "数码", "ACG", "玩具", "美术", "乐器", "运动", "手工", "生活", "其他"],
        keys: ["random", "digit", "ACG", "toy", "art", "music", "sport", "craft", "life", "others"],
        chosenTabIndex: 0,
        tabWidth: 0,
        scrollLeft: 0,
        swiperHeight: 0,

        postList: {},
    },

    onLoad: function () {
        wx.getSystemInfo({
            success: (res) => {
                var tabWidth = res.windowWidth / 4.5; //设置tab的宽度
                this.setData({
                    tabWidth: tabWidth,
                    swiperHeight: res.windowHeight
                })
            }
        })

        wx.cloud.callFunction({
            name: 'getRandomPost',
        }).then(res => {
            this.setData({
                'postList.random': res.result.data
            })
        })

    },

    onReachBottom: function () {
        console.log("index页面触底")
    },

    onPullDownRefresh: function () {
        console.log("index下拉刷新")
    },

    // 点击tab某个选项
    handleTabTap: function (e) {
        this.changeSwiper(e.currentTarget.dataset.index)
    },

    // 滑动改变swiper某个选项
    handleSwiperChange: function (e) {
        this.changeSwiper(e.detail.current)
    },

    async changeSwiper(chosenTabIndex) {
        this.setData({
            chosenTabIndex: chosenTabIndex,
            scrollLeft: (chosenTabIndex - 2) * this.data.tabWidth
        })

        var chosenTabName = this.data.keys[chosenTabIndex]
        if (chosenTabIndex == 0) {} else {
            await wx.cloud.callFunction({
                name: 'getCatedPost',
                data: {
                    cateName: chosenTabName
                }
            }).then(res => {
                var item = 'postList.' + chosenTabName
                console.log(item)
                this.setData({
                    [item]: res.result.data
                })

            })
        }

    }

})