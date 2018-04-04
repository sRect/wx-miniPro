//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    creatTime: '', // 订单时间
    orderAmount: '', // 	订单总金额
    // poductTypeArr: ["十三香", "蒜泥 ", "麻辣 ", "生虾", "冻虾"],
    isLogisticsArr: ["配货", "运输中", "运输完毕","", "退货中", "退货完毕"],
    agencyOrderID: null, // 订单id
    detailArr: [], // 订单详情arr
    recordArr: [], // 维护记录arr
    tuikuanFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      agencyOrderID: options.agencyOrderID
    })

    this.getOrderInfo(options.agencyOrderID);
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
  getOrderInfo: function (agencyOrderID) {
    const self = this;
    let arg = {
      url: "https://www.jzwms.com/hnMiniApp/agency/orderInfo",
      data: {
        "agencyOrderID": self.data.agencyOrderID || agencyOrderID
      }
    }

    app.handleRequest(arg, data => {
      console.log(data)
      if (JSON.stringify(data) !== "{}") {
        let result = data.data;
        if (JSON.stringify(result) !== "{}") {
          let status = result.status;
          switch (status) {
            case 'success':
              let myData = result.data;
              self.setData({
                creatTime: myData.orderInfo2.creatTime,
                orderAmount: myData.orderInfo2.orderAmount,
                detailArr: myData.orderInfo,
              })
              break;
            case 'failure':
              wx.showToast({
                title: result.info,
                icon: 'none',
                duration: 2500
              })
              break;
            default:
              break;
          }

        } else {
          wx.showToast({
            title: '返回数据错误',
            icon: 'warn',
            duration: 2000
          })
          return;
        }
      } else {
        wx.showToast({
          title: '返回数据错误',
          icon: 'warn',
          duration: 2000
        })
        return;
      }
    });
  },
  handleTuikuan: function (e) { // 申请退款
    const self = this
    let agencyOrderDetailID = e.currentTarget.dataset.id, // 子订单ID
      refund = e.currentTarget.dataset.count, // 退款金额
      orderStatus = e.currentTarget.dataset.orderstatus, // 订单状态
      url = orderStatus === 0 ? "https://www.jzwms.com/hnMiniApp/tuikuan" : "https://www.jzwms.com/hnMiniApp/agency/applicationRefund",
      arg = {
        url: url,
        data: {
          agencyOrderID: self.data.agencyOrderID,
          refund: refund,
          // refund: 0.01,
          agencyOrderDetailID: agencyOrderDetailID
        }
      }

    if (self.data.tuikuanFlag) {
      self.setData({
        tuikuanFlag: false
      })
      app.handleRequest(arg, data => {
        if (JSON.stringify(data) !== "{}") {
          let result = data.data;
          if (JSON.stringify(result) !== "{}") {
            let status = result.status.toLowerCase();
            console.log(status)
            switch (status) {
              case 'success':
                console.log(result)
                wx.showToast({
                  title: orderStatus === 0 ? "退款成功" : "申请退货成功",
                  icon: 'success',
                  duration: 2500,
                  success: function () {
                    self.getOrderInfo();
                    self.setData({
                      tuikuanFlag: true
                    })
                  }
                })
                break;
              case 'failure':
                wx.showToast({
                  title: "退款失败,请重试",
                  icon: 'none',
                  duration: 3000
                })
                self.setData({
                  tuikuanFlag: true
                })
                break;
              case 'fail':
                wx.showToast({
                  title: result.err_code_des,
                  icon: 'none',
                  duration: 3000
                })
                self.setData({
                  tuikuanFlag: true
                })
                break;
              case 'null':
                wx.showToast({
                  title: '退款无效',
                  icon: 'none',
                  duration: 3000
                })
                self.setData({
                  tuikuanFlag: true
                })
                break;
              default:
                wx.showToast({
                  title: "退款操作异常,请重试",
                  icon: 'none',
                  duration: 3000
                })
                self.setData({
                  tuikuanFlag: true
                })
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
            icon: 'warn',
            duration: 2000
          })
          return;
        }
      })
    }

  }
})