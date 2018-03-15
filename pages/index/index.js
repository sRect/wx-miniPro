//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    agencyCode: '', // 门店编号
    agencyName: '', // 门店名
    telephone: '', // 联系人电话
    linkName: '', // 联系人
    agencyOrderID: null, // 系统订单id
    resultCountArr: [0, 0, 0, 0],
    totalCount: 0, // 下单总金额
    pickerText: '请选择:',  // 下拉框初始文字
    selectFlag: true, // 下拉框选择控制
    arr: [{ name: '十三香', id: 100 }, { name: '十三香2', id: 101 }], // 下拉框内容
    orderArr: [] // 首页近10日订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.getOrderTop();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  calling: function () { // 拨打电话
    wx.makePhoneCall({
      phoneNumber: this.data.telephone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  getData: function () { // 获取门店、商品数据
    const self = this;
    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/agency/agencyDetail',
      data: {
        'agencyID': app.globalData.agencyID
      }
    }
    app.handleRequest(arg, function (data) {
      if (JSON.stringify(data) !== "{}") {
        let result = data.data;
        if (JSON.stringify(result) !== "{}") {
          let status = result.status;
          switch (status) {
            case 'success':
              let myData = result.data;
              self.setData({
                agencyCode: myData.agencyInfo.agencyCode == null ? "--" : myData.agencyInfo.agencyCode,
                agencyName: myData.agencyInfo.agencyName == null ? "--" : myData.agencyInfo.agencyName,
                linkName: myData.agencyInfo.linkName == null ? "--" : myData.agencyInfo.linkName,
                telephone: myData.agencyInfo.telephone == null ? "" : myData.agencyInfo.telephone
              })
              break;
            case 'failure':
              wx.showToast({
                title: result.info,
                icon: 'none',
                duration: 2000
              })
              break;
            default:
              break;
          }

        } else {
          wx.showToast({
            title: '返回数据错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      } else {
        wx.showToast({
          title: '返回数据错误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    })
  },
  getOrderTop: function () { // 获取门店10天内已付订单
    const self = this;
    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/agency/agencyOrderTop',
      data: {
        agencyID: app.globalData.agencyID
      }
    }

    app.handleRequest(arg, data => {
      if (JSON.stringify(data) !== "{}") {
        let result = data.data;
        if (JSON.stringify(result) !== "{}") {
          let status = result.status;
          switch (status) {
            case 'success':
              let myData = result.data;
              self.setData({
                orderArr: myData
              })
              break;
            case 'failure':
              wx.showToast({
                title: result.info,
                icon: 'none',
                duration: 2000
              })
              break;
            default:
              break;
          }

        } else {
          wx.showToast({
            title: '返回数据错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      } else {
        wx.showToast({
          title: '返回数据错误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    })
  },
  handleSelectInput: function () { // 判断下拉框有没有选择产品
    if (this.data.pickerText === "请选择:") {
      wx.showToast({
        title: '请先选择产品',
        icon: 'none',
        duration: 2000
      })
      return '';
    } else {
      this.setData({
        selectFlag: false
      })
    }
  },
  bindPickerChange: function (e) { // 下拉框选择
    var index = e.detail.value;
    var currentId = this.data.arr[index].id; // 这个id就是选中项的id
    console.log('picker发送选择改变，携带值为', currentId)

    this.setData({
      pickerText: '',
      index: e.detail.value
    })
  },
  handleInput: function (e) { // 金额计算
    // console.log(e)
    let type = e.currentTarget.dataset.type,
      price = e.currentTarget.dataset.price,
      value = e.detail.value,
      totalcount = 0;

    switch (type) {
      case '1':
        let up = "resultCountArr[" + 0 + "]";
        this.setData({
          [up]: value * price
        })
        // this.data.resultCountArr.splice(0, 1, value*price);
        break;
      case '2':
        let up1 = "resultCountArr[" + 1 + "]";
        this.setData({
          [up1]: value * price
        })
        // this.data.resultCountArr.splice(1, 1, value * price);
        break;
      case '3':
        let up2 = "resultCountArr[" + 2 + "]";
        this.setData({
          [up2]: value * price
        })
        // this.data.resultCountArr.splice(2, 1, value * price);
        break;
      case '4':
        let up3 = "resultCountArr[" + 3 + "]";
        this.setData({
          [up3]: value * price
        })
        // this.data.resultCountArr.splice(3, 1, value * price);
        break;
      default:
        break;
    }

    totalcount = this.data.resultCountArr.reduce(function (a, b) {
      return a + b;
    })

    this.setData({ // 设置总金额
      totalCount: totalcount
    })
  },
  getAgencyOrderID: function () { // 获取系统订单
    const self = this;

    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/agency/placeAnOrder',
      data: {
        agencyID: '1',
        // orderAmount: self.data.totalCount,
        orderAmount: 0.02,
        list: JSON.stringify([
          {
            poductType: '1',
            orderPrice: 25,
            orderCount: 1
          }
        ])
      }
    }

    return new Promise((resolve, reject) => {
      if (self.data.totalCount === 0) {
        wx.showToast({
          title: '下单总金额不能为0元',
          icon: 'none',
          duration: 2500
        })
        reject("error:下单总金额不能为0元");
        return;
      }else{
        app.handleRequest(arg, function (data) {
          console.log(data)
          if (JSON.stringify(data) !== "{}") {
            let result = data.data;
            if (JSON.stringify(result) !== "{}") {
              let status = result.status;
              switch (status) {
                case 'success':
                  let agencyOrderID = result.agencyOrderID;
                  self.setData({
                    agencyOrderID: agencyOrderID
                  })
                  resolve(agencyOrderID);
                  break;
                case 'failure':
                  wx.showToast({
                    title: result.info,
                    icon: 'none',
                    duration: 2000
                  })
                  reject(result.info)
                  break;
                default:
                  break;
              }

            } else {
              wx.showToast({
                title: '返回数据错误',
                icon: 'none',
                duration: 2000
              })
              return;
            }
          } else {
            wx.showToast({
              title: '返回数据错误',
              icon: 'none',
              duration: 2000
            })
            return;
          }
        })
      }
    })
  },
// getOpenId: function () { //获取openid
  //   var that = this;

  //   return new Promise((resolve, reject) => {
  //     if (app.globalData.code) {
  //       wx.request({
  //         url: 'https://www.jzwms.com/hnMiniApp/GetOpenId',
  //         method: 'POST',
  //         header: {
  //           'content-type': 'application/x-www-form-urlencoded'
  //         },
  //         data: { 'code': app.globalData.code },
  //         success: function (res) {
  //           console.log(res)
  //           var openId = res.data.openid;
  //           resolve(res.data.openid);
  //         },
  //         fail: function (err) {
  //           reject(err.message)
  //         }
  //       })
  //     } else {
  //       wx.showToast({
  //         title: '登录code获取失败,请重新登录',
  //         icon: 'none',
  //         duration: 3000
  //       })
  //     }
  //   })

// },
  getPrepay_id: function (agencyOrderID) { // 获取prepay_id 
    const self = this;
    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/xiadan',
      data: {
        "openid": app.globalData.openid,
        "agencyOrderID": agencyOrderID
      }
    }

    return new Promise((resolve, reject) => {
      app.handleRequest(arg, function (data) {
        if (JSON.stringify(data) !== "{}") {
          let result = data.data;
          if (JSON.stringify(result) !== "{}") {
            console.log(result)
            let status = result.status.toLowerCase();
            switch (status) {
              case 'success':
                let prepay_id = result.prepay_id;
                // resolve(prepay_id)
                resolve(prepay_id)
                break;
              case 'failure':
                wx.showToast({
                  title: result.info,
                  icon: 'none',
                  duration: 2000
                })
                reject(result.info)
                break;
              default:
                wx.showToast({
                  title: '获取prepay_id：' + result.info,
                  icon: 'none',
                  duration: 2000
                })
                reject(result.info)
                break;
            }

          } else {
            wx.showToast({
              title: '返回数据错误',
              icon: 'none',
              duration: 2000
            })
            return;
          }
        } else {
          wx.showToast({
            title: '返回数据错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      });
    })
  },
  getSign: function (repay_id) { // 获取支付签名
    const self = this;
    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/sign',
      data: {
        "repay_id": repay_id
      }
    }

    return new Promise((resolve, reject) => {
      app.handleRequest(arg, function (data) {
        if (JSON.stringify(data) !== "{}") {
          let result = data.data;
          if (JSON.stringify(result) !== "{}") {
            let status = result.status.toLowerCase();
            switch (status) {
              case 'success':
                let signObj = {
                  "timeStamp": result.timeStamp,
                  "nonceStr": result.nonceStr,
                  "package": result.package,
                  "signType": result.signType,
                  "paySign": result.paySign
                }

                resolve(signObj)
                break;
              case 'failure':
                wx.showToast({
                  title: result.info,
                  icon: 'none',
                  duration: 2000
                })
                reject(result.info)
                break;
              default:
                wx.showToast({
                  title: '获取签名错误：' + result.info,
                  icon: 'none',
                  duration: 2000
                })
                reject(result.info)
                break;
            }

          } else {
            wx.showToast({
              title: '返回数据错误',
              icon: 'none',
              duration: 2000
            })
            return;
          }
        } else {
          wx.showToast({
            title: '返回数据错误',
            icon: 'none',
            duration: 2000
          })
          return;
        }

      })
    })
  },
  paySuccess: function() { // 支付成功后调用
    const self =this;
    let arg = {
      url: "https://www.jzwms.com/hnMiniApp/agency/paySuccess",
      data: {
        "agencyOrderID": self.data.agencyOrderID
      }
    }

    app.handleRequest(arg, data => {
      console.log(data);
    })
  },
  requestPayment: function (obj) { // 发起微信支付
    const self = this;

    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        console.log(res)
        if (res.errMsg === "requestPayment:ok") {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 3000,
            success: function() {
              self.getOrderTop();
              self.paySuccess();
            }
          })
        }
      },
      'fail': function (res) {
        console.log(res)
        if (res.errMsg === "requestPayment:fail cancel") {
          wx.showToast({
            title: '您已取消支付',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  handleorder: function () { // 下单支付
    const self = this;

    // Promise.all([
    //   self.getAgencyOrderID(),
    //   self.getOpenId()
    // ]).then(([agencyOrderID, openid]) => {
    //   self.getPrepay_id(agencyOrderID, openid)
    // })

    self.getAgencyOrderID()
      .then(self.getPrepay_id)
      .then(self.getSign)
      .then(data => {
        self.requestPayment(data);
      }).catch(err => {
        console.log(err)
      })

  },
  gotoDetail: function (e) { // 跳转详情
    let agencyOrderID = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../detail/detail?agencyOrderID=' + agencyOrderID ,
    })
  }
})
