// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {},
  
  gotoPage(e){
    let page = e.currentTarget.dataset.page;
    wx.navigateTo({url: `/pages/${page}/${page}`})
  }
  
  
})
