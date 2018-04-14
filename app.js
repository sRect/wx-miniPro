//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.showLoading({
      mask: true
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        if (res.code) {
          const self = this;
          let code = res.code;
          this.globalData.code = code;

          wx.request({
            url: 'https://www.jzwms.com/hnMiniApp/GetOpenId',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: { 'code': code },
            success: function (res) {
              // console.log(res)
              let openId = res.data.openid;
              self.globalData.openid = openId;
            },
            fail: function (err) {
              console.log(err)
            }
          })

        } else {
          wx.showToast({
            title: '登录失效',
            icon: 'none',
            duration: 2000
          })
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function() {
    wx.hideLoading();
  },
  globalData: {
    userInfo: null,
    code: null,
    openid: null,
    agencyID: -1,
  },
  debounce: function (method, context){
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
      method.call(context);
    }, 500);
  },
  handleRequest: function (arg, cb) {
    wx.request({
      url: arg.url,
      method: 'POST',
      data: arg.data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        cb(res);
      },
      fail: function (err) {
        console.log(err)
        wx.showToast({
          title: err.errMsg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  }
})