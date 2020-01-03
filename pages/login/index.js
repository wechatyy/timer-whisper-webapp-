
import { API_HOST, API_LOGIN, API_BIND_FRIEND} from '../../utils/config.js'

Page({
  data: {
    userId:null
  },

  async onGetUserInfo(e) {
    console.log(e);
    let userData = e.detail
    let res = await wx.$login()
    console.log(res);
    if (res.code) {
      this.postLogin(res.code,userData)
    }
  },

  postLogin(code, userData) {
    let _this = this
    const { avatarUrl, gender, nickName } = userData.userInfo;
    wx.request({
      url: `${API_HOST}${API_LOGIN}?code=${code}`,
      method: "POST",
      data: {
        username: nickName,
        avatarUrl: avatarUrl,
        gender: gender
      },
      success: res => {
        wx.setStorageSync('token', res.data.token.token)
        wx.setStorageSync('userId', res.data.token.userId)
        if (_this.data.userId){
          _this.bindFriendFc(res.data.token.token)
        }
        wx.navigateBack()
      }
    })
  },
  onLoad: function (options) {
    if (options){
      this.setData({
        userId: options.userId
      })
    }
  },
  //绑定好友
  bindFriendFc(token){
    wx.request({
      url: `${API_HOST}${API_BIND_FRIEND}`,
      method: "POST",
      header: {
        token: token
      },
      data: {
        friendId: this.data.userId
      },
      success: res => {
        console.log(res)
      }
    })
  }
  

})
