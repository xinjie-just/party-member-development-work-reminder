const app = getApp();

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
    confirmPassword: '',
    submitLoading: false,
    hasResults: false, // 请求有返回了
    timer: null,
    oldPasswordVisible: false,
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  passwordIconVisible(evt) {
    const { name } = evt.currentTarget.dataset;
    if (name === 'oldPassword') {
      this.setData({
        oldPasswordVisible: !this.data.oldPasswordVisible,
      });
    } else if (name === 'newPassword') {
      this.setData({
        newPasswordVisible: !this.data.newPasswordVisible,
      });
    } else {
      this.setData({
        confirmPasswordVisible: !this.data.confirmPasswordVisible,
      });
    }
  },

  onInput(evt) {
    const { value } = evt.detail;
    const { name } = evt.currentTarget.dataset;
    if (name === 'oldPassword') {
      this.setData({
        oldPasswordValid: !!value,
      });
      if (this.data.oldPasswordValid) {
        this.setData({
          oldPassword: value,
        });
      }
    } else if (name === 'newPassword') {
      this.setData({
        newPasswordValid: !!value,
      });
      if (this.data.newPasswordValid) {
        this.setData({
          newPassword: value,
        });
      }
    } else {
      this.setData({
        confirmPasswordValid: !!value,
      });
      if (this.data.confirmPasswordValid) {
        this.setData({
          confirmPassword: value,
        });
      }
    }
    const oldPasswordValid = this.data.oldPasswordValid;
    const newPasswordValid = this.data.newPasswordValid;
    const confirmPasswordValid = this.data.confirmPasswordValid;
    this.setData({
      valid: oldPasswordValid && newPasswordValid && confirmPasswordValid,
    });
  },

  submit() {
    if (!this.data.valid) {
      return;
    }
    if (this.data.newPassword !== this.data.confirmPassword) {
      wx.showToast({
        title: '两次输入新密码不一致，请重新输入',
        icon: 'none',
        duration: 3000,
      });
      return;
    }

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
    const storageUserInfo = wx.getStorageSync('userInfo');
    const idUser = storageUserInfo.idUser;
    wx.request({
      url: `${app.globalData.hostname}/user/modifySelfPassword`,
      data: {
        idUser,
        oldPassword: this.data.oldPassword,
        newPassword: this.data.newPassword,
        confirmNewPassword: this.data.confirmPassword,
      },
      method: 'POST',
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(value) {
        const info = value.data;
        if (info.code === 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
          });
          wx.clearStorageSync();
          app.globalData.userInfo = null;
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/wechat-login/wechat-login',
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
              url: '/pages/wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: '密码修改失败！' + info.message,
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: res.error,
          icon: 'none',
          duration: 2000,
        });
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
