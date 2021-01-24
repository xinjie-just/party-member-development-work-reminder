Page({
  /**
   * 页面的初始数据
   */
  data: {
    submitLoading: false,
    hasResults: false, // 请求有返回了
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('tmplId', 'AMMS8pdsuRjk7e77kZWPyTYWHT4vE3x5sPNJ_74Pi7Q');
  },

  subscribe() {
    clearTimeout(this.data.timer);
    const timer = setTimeout(() => {
      if (!this.data.hasResults) {
        this.setData({
          submitLoading: true,
        });
      }
    }, 1000);
    this.setData({
      timer,
    });

    let that = this;
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
              url: '/pages/mine/mine',
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
            url: '/pages/mine/mine',
          });
        }, 2000);
      },
      complete() {
        that.setData({
          submitLoading: false,
          hasResults: true,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearTimeout(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearTimeout(this.data.timer);
  },
});
