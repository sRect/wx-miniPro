//index.js
//获取应用实例
const app = getApp()
const until = require("../../utils/util.js")

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
    arr: null, // 下拉框内容
    selectMaterialid: '', // 下拉框选中时的产品id
    selectPrice: '--', // 下拉框单价
    selectCount: '', // 下拉框输入数量
    materialArr: null, // 商品种类arr
    orderList: null, // 下单商品arr
    orderArr: [], // 首页近10日订单
    orderFlag: true, // 下单防重复提交
    selectID: "" // 点击评分的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let agencyID = decodeURIComponent(options.agencyID)
    app.globalData.agencyID = agencyID;

    this.getData();
    this.getGoodsInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得rater组件  
    this.rater = this.selectComponent("#rater")  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderTop();
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
  getData: function () { // 获取门店信息
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
  getGoodsInfo: function() { // 获取商品信息
    const self = this;
    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/agency/materialPrice'
    }

    app.handleRequest(arg, function(data) {
      if (JSON.stringify(data) !== "{}") {
        let result = data.data;
        if (JSON.stringify(result) !== "{}") {
          let status = result.status;
          switch (status) {
            case 'success':
              let myData = result.data;
              let selectArr = [], materialArr = [], showArr = [], orderList = [];

              if (myData.paterialPriceList.length) {
                myData.paterialPriceList.forEach(function(item, index) {
                  if (Number.parseInt(item.materialType) === 1) {
                    selectArr.push(item);
                  }else {
                    materialArr.push(item);
                    orderList.push({
                      "poductType": '',
                      "orderPrice": '',
                      "orderCount": '',
                      "orderAmountSeed": ''
                    })

                    item.parentID === 0 ? item.isShow = true : item.isShow = false;
                  }
                })

                orderList.push({
                  "poductType": '',
                  "orderPrice": '',
                  "orderCount": '',
                  "orderAmountSeed": ''
                })

                materialArr.forEach(function(item, index) {
                  item.val = "";
                })

                self.setData({
                  arr: selectArr,
                  materialArr: materialArr,
                  orderList: orderList,
                  resultCountArr: Array(materialArr.length+1).fill(0)
                })
              }else {
                wx.showToast({
                  title: '返回商品信息错误',
                  icon: 'none',
                  duration: 2000
                })
                return;
              }

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
              console.log(myData)
              if (myData.length) {
                self.setData({
                  orderArr: myData
                })
              }
              
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
    let index = e.detail.value,
      currentId = this.data.arr[index].materialID, // 这个id就是选中项的id
      currentPrice = this.data.arr[index].materialPrice, // 下拉框单价
      up = "resultCountArr[0]",
      up2 = "orderList[0]"
    // console.log('picker发送选择改变，携带值为', currentId)

    this.setData({
      pickerText: '',
      selectPrice: currentPrice,
      index: e.detail.value,
      selectMaterialid: currentId,
      selectCount: '',
      [up]: 0,
      [up2]: {
        "poductType": '',
        "orderPrice": '',
        "orderCount": '',
        "orderAmountSeed": ''
      }
    })
  },
  handleInput: until.debounce2(function (e) { // input金额计算
    const self = this;
    let type = e.currentTarget.dataset.type, 
      price = e.currentTarget.dataset.price,
      value = e.detail.value,
      materialID = e.currentTarget.dataset.materialid,
      parentID = e.currentTarget.dataset.parentid,
      index = e.currentTarget.dataset.index,
      typeNum = parseInt(type),
      totalcount = 0,
      materialtype = e.currentTarget.dataset.materialtype,
      up4 = "orderList[" + typeNum + "]",
      materialtypeTxt = "",
      up = "resultCountArr[" + typeNum + "]";

    if (materialtype === 4) {
      materialtypeTxt = "套";
    } else if (materialtype === 3) {
      materialtypeTxt = "斤";
    } else if (materialtype === 2) {
      materialtypeTxt = "份";
    } else if (materialtype === 1) {
      materialtypeTxt = "斤";
    }else {
      materialtypeTxt = "斤";
    }


    if (value < 30 || value == "") {
      console.log("enter1")
      wx.showToast({
        title: `不可小于30${materialtypeTxt}`,
        icon: 'none',
        duration: 2000,
        success: function() {
          if (index === "-1") {
            let up12 = "resultCountArr[0]",
              up13 = "orderList[0]";
            self.setData({
              [up12]: 0,
              [up13]: {
                "poductType": "",
                "orderPrice": "",
                "orderCount": "",
                "orderAmountSeed": ""
              },
              selectCount: ''
            })

            totalcount = self.data.resultCountArr.reduce(function (a, b) {
              return a + b;
            })

            self.setData({ // 设置总金额
              totalCount: totalcount
            })
            return;
          };
          let up6 = "materialArr[" + index + "].val";

          self.setData({
            [up6]: '',
            [up4]: {
              "poductType": "",
              "orderPrice": "",
              "orderCount": "",
              "orderAmountSeed": ""
            },
            [up]: 0
          })

          // if (!materialArr[0].val) {

          // }

          if (type !== "0") { // 控制子商品显示/隐藏
            self.data.materialArr.forEach(function (item, index) {
              if (item.parentID === materialID) {

                let up2 = "materialArr[" + index + "].isShow",
                  num = Number.parseInt(index) + 1,
                  up3 = "resultCountArr[" + num + "]",
                  up5 = "orderList[" + num + "]";
                
                if (value.length && item.val) {
                  self.setData({
                    [up2]: true
                  })
                } else {
                  self.setData({
                    [up2]: false,
                    [up3]: 0,
                    [up5]: {
                      "poductType": "",
                      "orderPrice": "",
                      "orderCount": "",
                      "orderAmountSeed": ""
                    }
                  })
                }

                if (!self.data.materialArr[0].val) {
                  self.setData({
                    [up2]: false,
                    [up3]: 0,
                    [up5]: {
                      "poductType": "",
                      "orderPrice": "",
                      "orderCount": "",
                      "orderAmountSeed": ""
                    }
                  })
                  
                }

              }
            })
          }

          totalcount = self.data.resultCountArr.reduce(function (a, b) {
            return a + b;
          })

          self.setData({ // 设置总金额
            totalCount: totalcount
          })
        }
      })
      // return;
    }else {
      console.log("enter2")
      if(index === 0) {

        let up7 = "orderList[2]", 
          up8 = self.data.materialArr[1].materialID,
          up9 = self.data.materialArr[1].materialPrice,
          up10 = "materialArr[1].val",
          up11 = "resultCountArr[2]";
  
        self.setData({
          [up7]: {
            "poductType": up8,
            "orderPrice": up9,
            "orderCount": (value / 10).toFixed(0),
            "orderAmountSeed": parseInt((value / 10).toFixed(0)) * up9
          },
          [up10]: (value / 10).toFixed(0),
          [up11]: parseInt((value / 10).toFixed(0)) * up9
        })
      }
    }

    // let up = "resultCountArr[" + typeNum + "]";
    self.setData({
      [up]: parseFloat((value * price).toFixed(1))
    })

    if(type !== "0") { // 控制子商品显示/隐藏
      self.data.materialArr.forEach(function(item, index) {
        if (item.parentID === materialID) {
          let up2 = "materialArr[" + index + "].isShow",
            num = Number.parseInt(index) + 1,
            up3 = "resultCountArr[" + num +"]",
            up5 = "orderList[" + num + "]";

          if(value.length) {
            self.setData({
              [up2]: true
            })
          }else {
            self.setData({
              [up2]: false,
              [up3]: 0,
              [up5]: {
                "poductType": "",
                "orderPrice": "",
                "orderCount": "",
                "orderAmountSeed": ""
              }
            })
          }
          
        }
      })
    }

    self.setData({
      [up4]: {
        "poductType": materialID,
        "orderPrice": price,
        "orderCount": value,
        "orderAmountSeed": value * price
      }
    })

    totalcount = this.data.resultCountArr.reduce(function (a, b) {
      return a + b;
    })

    this.setData({ // 设置总金额
      totalCount: totalcount
    })
  }, 1500),
  getAgencyOrderID: function () { // 获取系统订单
    const self = this;
    let list = [];
    self.data.orderList.forEach(function(item, index) {
      if (item.orderCount) {
        list.push(item)
      }
    })

    let arg = {
      url: 'https://www.jzwms.com/hnMiniApp/agency/placeAnOrder',
      data: {
        agencyID: '1',
        orderAmount: self.data.totalCount,
        // orderAmount: 0.03,
        list: JSON.stringify(list)
      }
    }

    return new Promise((resolve, reject) => {
      if (self.data.totalCount === 0) {
        wx.showToast({
          title: '下单总金额不能为0元',
          icon: 'none',
          duration: 2500,
          success:function() {
            self.setData({
              orderFlag: true
            })
          }
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
      },
      "complete": function() {
        setTimeout(function() {
          self.getOrderTop();
        }, 800)

        self.setData({
          orderFlag: true
        })
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
  requestOrder: function() { // 最终发起支付
    const self = this;
    if (self.data.orderFlag) {
      self.setData({
        orderFlag: false
      })

      app.debounce(this.handleorder, this);
    }
    
  },
  gotoDetail: function (e) { // 跳转详情
    let agencyOrderID = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../detail/detail?agencyOrderID=' + agencyOrderID ,
    })
  },
  requestScore: function(e) { // 发起评分
    let agencyOrderID = e.currentTarget.dataset.agencyorderid;
    // this.rater.handleClick(agencyOrderID)
    
    this.setData({
      selectID: agencyOrderID
    })
  }
})
