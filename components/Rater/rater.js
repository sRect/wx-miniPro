//获取应用实例
const app = getApp()

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持  
  }, 
  properties: {
  },
  data: {
    score: '' // 点击的分数
  },
  methods: {
    getScore: function(e) {
      let score = e.currentTarget.dataset.index;
      this.setData({
        score: score
      })
    },
    handleClick(agencyOrderID) {
      const self = this;

      wx.showModal({
        title: '提示',
        content: `您确定要给此条订单评${Number.parseInt(self.data.score)}星吗？`,
        success: function (res) {
          if (res.confirm) {
            let arg = {
              url: 'https://www.jzwms.com/hnMiniApp/agency/orderEvaluate',
              data: {
                agencyOrderID: agencyOrderID,
                orderScore: self.data.score
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
                      console.log(myData)

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
    }
  }
})