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
    content: '',
    todoList: [],
    todoTotal: 0,
    submitLoading: false,
    timer: null,
    hasResults: false, // 请求有返回了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTodoList();

    // console.log('代办事项ID', options.id);
    this.setData({
      id: options.id,
    });
    this.updateTaskReadTime(Number(this.data.id));
  },

  // 获取待办事项
  getTodoList() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryUserToDoBusiness`,
      data: {
        pageNo: 1,
        pageSize: 10,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        // console.log('待办事项', info.data);
        if (info.code === 200) {
          that.setData({
            todoList: info.data.page.records,
            todoTotal: info.data.page.total,
          });
          if (!!that.data.todoTotal) {
            that.data.todoList.forEach((item) => {
              if (Number(item.id) === Number(that.data.id)) {
                that.setData({
                  realName: item.realName,
                  nodeName: item.nodeName,
                  reminder: item.reminder,
                  content: item.content,
                });
              }
            });
          }
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
          that.setData({
            todoList: [],
            todoTotal: 0,
          });
          wx.showToast({
            title: info.message || '待办事项信息获取失败',
            icon: 'none',
            duration: 3000,
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '待办事项信息获取失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
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
              url: '/pages/wechat-login/wechat-login',
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
            title: '办理成功',
            icon: 'success',
            duration: 2000,
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
              url: '/pages/wechat-login/wechat-login',
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
