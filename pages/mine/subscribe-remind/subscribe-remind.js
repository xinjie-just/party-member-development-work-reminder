// pages/subscribe-remind.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('tmplId', 'AMMS8pdsuRjk7e77kZWPyTYWHT4vE3x5sPNJ_74Pi7Q');
  },

  subscribe() {
    wx.requestSubscribeMessage({
      tmplIds: ['AMMS8pdsuRjk7e77kZWPyTYWHT4vE3x5sPNJ_74Pi7Q'],
      success(res) {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          wx.setStorageSync(wx.getStorageSync('tmplId'), 'accept');

          wx.showToast({
            title: '订阅成功',
            icon: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            wx.switchTab({
              url: '../mine',
            });
          }, 2000);
        }
      },
      fail(res) {
        wx.showToast({
          title: '订阅失败！' + res.errMsg,
          icon: 'none',
          duration: 2000,
        });
        setTimeout(() => {
          wx.switchTab({
            url: '../mine',
          });
        }, 2000);
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
