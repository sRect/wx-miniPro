//获取应用实例
const app = getApp()

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持  
  }, 
  properties: {
  },
  data: {
    score: '', // 点击的分数
    agencyOrderid: ''
  },
  methods: {
    getScore: function(e) {
      const self = this;
      let score = e.currentTarget.dataset.index;
      var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
      var currentPage = pages[pages.length - 1]  // 获取当前页面
      var prevPage = pages[pages.length - 2]    //获取上一个页面


      setTimeout(function() {
        console.log(currentPage.data.selectID)
        wx.showModal({
          title: '提示',
          content: `您确定要给此条订单评${score}星吗？`,
          success: function (res) {
            if (res.confirm) {
              let arg = {
                url: 'https://www.jzwms.com/hnMiniApp/agency/orderEvaluate',
                data: {
                  agencyOrderID: currentPage.data.selectID,
                  orderScore: score
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
                        wx.showToast({
                          title: '评分成功',
                          icon: 'success',
                          duration: 1500,
                          success: function () {
                            currentPage.getOrderTop();
                          }
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
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }, 500)
      

    },
    handleClick(id) {
      const self = this;
      
      self.setData({
        agencyOrderid: id
      })

      
    }
  }
})