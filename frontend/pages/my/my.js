const db = wx.cloud.database()

Page({
    data: {
        userInfo: {},

        // 本来想以数字作为key，没想到前端识别不了orderNum.0这种格式
        // 所以在订单状态数字前面加上个status
        
        orderNum: {
            status0: null,
            status1: null,
            status2: null,
            status3: null
        },
        test: {
            1:33
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //     wx.getSetting({
        //         success: (res) => {
        //             console.log('my login')
        //             console.log(res)
        //             if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
        //                 console.log('用户已授权获取用户信息')

        //                 wx.getUserInfo({
        //                     success: (res) => {
        //                         console.log('获取用户数据成功')
        //                     }
        //                 })

        //                 // wx.getUserProfile({
        //                 //     lang: 'zh_CN',
        //                 //     desc: '仅用于用户主页信息',
        //                 //     success(e) {
        //                 //         console.log(e)
        //                 //     }
        //                 // })

        //             } else { //未授权，跳到授权页面
        //                 wx.redirectTo({
        //                     url: '../authorize/authorize', //授权页面
        //                 })
        //             }
        //         }
        //     })

        // wx.getUserProfile({
        //     desc: '仅用于用户主页信息',
        //     success(e) {

        //         // 前端弃用getUserInfo功能，js在调用的时候也没办法像以前一样设置scope.userInfo
        //         // scope.userInfo不会自动更新，所以此处仍待解决
        //         wx.authorize({
        //             scope: 'scope.userInfo',
        //             success() {
        //                 console.log('授权了获取用户信息')
        //             },
        //             fail() {
        //                 console.log('授权获取用户信息失败')
        //             }
        //         })

        //         console.log('获取用户数据成功')
        //         var userInfo = e.userInfo
        //         var openId = wx.getStorageSync('openId')
        //         wx.setStorageSync('userInfo', userInfo)
        //         db.collection('t_user').doc(openId).update({
        //             // data 字段表示需新增的 JSON 数据
        //             data: {
        //                 nickname: userInfo.nickname,
        //                 gender: userInfo.gender,
        //                 avatarUrl: userInfo.avatarUrl,
        //                 country: userInfo.country,
        //                 province: userInfo.province,
        //                 city: userInfo.city,
        //                 language: userInfo.language,
        //                 introduction: '',
        //             }
        //         })
        //     },
        //     fail(e) {
        //         console.log('获取用户信息失败')
        //         wx.redirectTo({
        //             url: '../authorize/authorize', //授权页面
        //         })
        //     }
        // })

        var openId = wx.getStorageSync('openId')
        db.collection('t_user').where({
            _openid: openId
        }).get({
            success: (e) => {
                if (e.data.length == 0) {
                    wx.redirectTo({
                        url: '../authorize/authorize', //授权页面
                    })
                } else {
                    this.setData({
                        userInfo: e.data[0]
                    })
                    //每次加载完都设置一次
                    wx.setStorageSync('userInfo', e.data[0])
                }
            },
        })

        wx.cloud.callFunction({
            name: 'getOrderNum'
        }).then(res => {
            console.log(res)
            for (var i in res.result.list) {
                console.log(i)
                var item = 'orderNum.status'+res.result.list[i]._id
                console.log(item)
                this.setData({
                    [item]: res.result.list[i].count,
                })
            }
        })

        // var userInfo = wx.getStorageSync('userInfo')
        // console.log(userInfo)
        // console.log(this.data.userInfo)
        // if (typeof (userInfo) == "undefined") {
        //     wx.redirectTo({
        //         url: '../authorize/authorize', //授权页面
        //     })
        // } else {
        //     console.log(userInfo)
        // }


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
        // var userInfo = wx.getStorageSync('userInfo')
        // this.setData({
        //     userInfo: userInfo
        // })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    tapOrders(e) {
        wx.navigateTo({
            url: '../orders/orders?orderType=' + e.currentTarget.dataset.ordertype,
            // success: (res) => {
            //     console.log(res)
            //     console.log(e)
            //     res.eventChannel.emit('acceptDataFromOpenerPage', {
            //         data: e.currentTarget.dataset.ordertype
            //     })
            // }
        })
    }
})