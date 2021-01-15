// pages/index/detail/detail.js
//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    realName: '',
    nodeName: '',
    reminder: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('代办事项ID', options.id);
    this.setData({
      id: options.id,
      realName: options.realName,
      nodeName: options.nodeName,
      reminder: options.reminder,
    });
    this.updateTaskReadTime(Number(this.data.id));
  },

  // 更新任务阅读时间
  updateTaskReadTime(id) {
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/updateTaskReadTime`,
      data: {
        id,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          // wx.showToast({
          //   title: info.message || '更新任务阅读时间成功！',
          //   icon: "none",
          //   duration: 3000
          // });
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../../wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: info.message || '更新任务阅读时间失败！',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '更新任务阅读时间失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  // 处理提醒事项
  handleTask() {
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/handleRemindTask`,
      data: {
        id: Number(this.data.id),
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          wx.showToast({
            title: info.message || '代办事项办理成功！',
            icon: 'none',
            duration: 3000,
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
          }, 2000);
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../../wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: info.message || '代办事项办理失败！',
            icon: 'none',
            duration: 3000,
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
          }, 3000);
        }
      },
      fail(res) {
        wx.showToast({
          title: '代办事项办理失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
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
