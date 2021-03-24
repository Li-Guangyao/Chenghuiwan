import requestUrl from '../../utils/requestUrl.js'
const db = wx.cloud.database();

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    handleGetUserInfo: function (e) {//点击的“拒绝”或者“允许
        if (e.detail.userInfo) {//点击了“允许”按钮，
            var userInfo = e.detail.userInfo
            var openId = wx.getStorageSync('openId')
            wx.setStorageSync('userInfo', userInfo)
            db.collection('t_user').doc(openId).update({
                // data 字段表示需新增的 JSON 数据
                data: {
                  nickname: userInfo.nickname,
                  gender: userInfo.gender,
                  avatarUrl: userInfo.avatarUrl,
                  country: userInfo.country,
                  province: userInfo.province,
                  city: userInfo.city,
                  language: userInfo.language,
                  introduction: '',
                }
              }).then(res => {
                console.log(res)
            // 这一步我设置的是当进入tabBar页面（除了首页)获取授权后会停留在当前界面；而进入到某个详情页面也就是除了tabBar页面授权之后会返回上一页。
                let pages = getCurrentPages();
                if (pages.length) {
                    if (pages.length == 1) {
                        wx.switchTab({
							url: '../my/my', // 个人中心页面为my，名字随便起
                        })
                    }else {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                }
            }).catch((errorMsg) => {
                console.log(errorMsg)
            })
        } else {//点了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您拒绝授权，将无法查看个人主页，请授权之后再进入',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    if (res.confirm) {
                    }
                }
            })
        }
    }
})
