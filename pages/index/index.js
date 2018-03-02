//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '18755106666',
    pickerText: '请选择:',
    arr: [{ name: '十三香', id: 100 }, { name: '十三香2', id: 101 }],
    orderArr: [{
      date: '2018/01/01',
      week: '(星期一)',
      detail: '3000元',
      evaluate: 'a哎哎哎哎a哎哎哎哎哎哎哎哎哎啊a哎哎哎哎哎哎哎哎哎啊哎哎哎哎哎啊'
    }, {
      date: '2018/01/01',
      week: '(星期三)',
      detail: '3987元',
      evaluate: 'a哎哎哎哎a哎哎哎哎哎哎哎哎哎啊a哎哎哎哎哎哎哎哎哎啊哎哎哎哎哎啊'
      }, {
        date: '2018/01/01',
        week: '(星期六)',
        detail: '209斤虾',
        evaluate: 'a哎哎哎哎a哎哎哎哎哎哎哎哎哎啊a哎哎哎哎哎哎哎哎哎啊哎哎哎哎哎啊'
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  calling: function() { // 拨打电话
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNum, 
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    }) 
  },
  bindPickerChange: function (e) {
    var index = e.detail.value;
    var currentId = this.data.arr[index].id; // 这个id就是选中项的id
    console.log('picker发送选择改变，携带值为', currentId)

    this.setData({
      pickerText: '',
      index: e.detail.value
    })
  }
})
