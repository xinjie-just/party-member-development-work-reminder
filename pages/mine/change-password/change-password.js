// pages/change-password/change-password.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPasswordValid: false,
    newPasswordValid: false,
    confirmPasswordValid: false,
    valid: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onInput(evt) {
    const {value} = evt.detail;
    const {name} = evt.currentTarget.dataset;
    if (name === 'oldPassword') {
      this.setData({
        oldPasswordValid: !!value,
      });
      if (this.data.oldPasswordValid) {
        this.setData({
          oldPassword: value
        });
      }
    } else if (name === 'newPassword') {
      this.setData({
        newPasswordValid: !!value,
      });
      if (this.data.newPasswordValid) {
        this.setData({
          newPassword: value
        });
      }
    } else {
      this.setData({
        confirmPasswordValid: !!value,
      });
      if (this.data.confirmPasswordValid) {
        this.setData({
          confirmPassword: value
        });
      }
    }
    const oldPasswordValid = this.data.oldPasswordValid;
    const newPasswordValid = this.data.newPasswordValid;
    const confirmPasswordValid = this.data.confirmPasswordValid;
    this.setData({
      valid: oldPasswordValid && newPasswordValid && confirmPasswordValid
    })
  },

  submit() {
    if (!this.data.valid) {
      return;
    }
    if (this.data.newPassword !== this.data.confirmPassword) {
      wx.showToast({
        title: '两次输入新密码不一致，请重新输入',
        icon: "none",
        duration: 3000
      });
      return;
    }

    // console.log("表单验证通过");
    // console.log("旧密码：", this.data.oldPassword, "--新密码：", this.data.newPassword, "--确认密码：", this.data.confirmPassword);
    const storageUserInfo = wx.getStorageSync('userInfo');
    const idUser = storageUserInfo.idUser;
    wx.request({
      url: `${app.globalData.hostname}/user/modifySelfPassword`,
      data: {
        idUser,
        oldPassword: this.data.oldPassword,
        newPassword: this.data.newPassword,
        confirmNewPassword: this.data.confirmPassword
      },
      method: "POST",
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(value) {
        const info = value.data;
        if (info.code === 200) {
          wx.showToast({
            title: '密码修改成功！',
            icon: "none",
            duration: 2000
          });
          wx.clearStorageSync();
          app.globalData.userInfo = null;
          setTimeout(() => {
            wx.redirectTo({
              url: '../../wechat-login/wechat-login',
            });
          }, 2000);
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          wx.redirectTo({
            url: '../../wechat-login/wechat-login',
          })
        } else {
          wx.showToast({
            title: '密码修改失败！' + info.message,
            icon: "none",
            duration: 3000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: res.error,
          icon: "none",
          duration: 2000
        });
      }
    });
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

  }
})