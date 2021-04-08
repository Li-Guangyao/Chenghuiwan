//app.js
App({
  onLaunch: function () {
    this.checkout();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    this.globalData = {}
  },

  //检验code
  checkout: function () {
    /*通过 wx.login 接口获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。
    反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。
    开发者只需要调用 wx.checkSession 接口检测当前用户登录态是否有效。*/
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("用户登录态未过期")
      },
      fail: function () {
        //session_key 已经失效，需要重新执行登录流程
        console.log("用户登录态过期了")
        /**登录态过期后开发者可以再调用 wx.login 获取新的用户登录态。
         */
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // 需要传输该项目的appid和secret
            if (res.code) {
              var appId = 'wx05707d575cb2685c'
              var secret = '9445ab27d7547e1d2cbc9a1f0d20b683'
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
                success: (res) => {
                  wx.setStorageSync('openId', res.data.openid);
                  wx.setStorageSync('sessionKey', res.data.session_key);
                },
                fail: (res) => {
                  console.log('向后台请求openid出错' + errorMsg)
                }
              })
            }
          }
        })
      }
    })
  },

  globalData: {
    userInfo: "",//用户信息
    openId: "",//登录用户的唯一标识
    appid: '',//appid
    AppSecret: '',//secret秘钥
},
})