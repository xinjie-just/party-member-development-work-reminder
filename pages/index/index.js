//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    noTodoList: false,
    todoList: [],
    selectedId: null,
    userName: ''
  },
  selectTodoItem(e) {
    console.log("evt111", e);
    this.setData({
      selectedId: e.currentTarget.dataset.id
    });
  },
  handleItem() {
    if(!this.data.selectedId) return;
    console.log("selectedId",this.data.selectedId);
    const selectedId = this.data.selectedId;
    let realName = '';
    let nodeName = '';
    this.data.todoList.forEach(item => {
      if(item.id === selectedId) {
        realName = item.realName;
        nodeName = item.nodeName;
      }
    })
    wx.redirectTo({
      url: `./detail/detail?id=${selectedId}&realName=${realName}&nodeName=${nodeName}`,
    })
  },
  onLoad: function () {
    const storageUserInfo = wx.getStorageSync('userInfo');
    this.setData({
      userName: storageUserInfo.realName || storageUserInfo.nickName
    });
    this.getTodoList();
  },
  getTodoList() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryUserToDoBusiness`,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      header: {
        accessSide: "weixin"
      },
      success(res) {
        const info = res.data;
        console.log("待办事项", info.data);
        if (info.code === 200) {
          that.setData({
            todoList: info.data,
            noTodoList: !!info.data.length
          });
        } else {
          that.setData({
            todoList: [],
            noTodoList: true
          });
          wx.showToast({
            title: info.message || '待办事项获取失败',
            icon: "none",
            duration: 3000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '待办事项获取失败！'+ res.error,
          icon: "none",
          duration: 2000
        })
      }
    })
  }
})
