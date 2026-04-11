Page({
  data: {
    selectedEmotion: '',
    content: '',
    password: '',
    showPasswordModal: false,
    modalPassword: '',
    records: []
  },
  onLoad() {
    // 页面加载时获取已存储的记录
    this.loadRecords();
  },
  selectEmotion(e) {
    const emotion = e.currentTarget.dataset.emotion;
    this.setData({
      selectedEmotion: emotion
    });
  },
  bindTextAreaChange(e) {
    this.setData({
      content: e.detail.value
    });
  },
  bindPasswordChange(e) {
    this.setData({
      password: e.detail.value
    });
  },
  bindModalPasswordChange(e) {
    this.setData({
      modalPassword: e.detail.value
    });
  },
  submitEmotion() {
    if (!this.data.selectedEmotion) {
      wx.showToast({
        title: '请选择情绪',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    // 创建新记录
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      emotion: this.data.selectedEmotion,
      content: this.data.content,
      password: this.data.password,
      locked: !!this.data.password
    };
    
    // 存储记录
    const records = [...this.data.records, newRecord];
    wx.setStorageSync('emotionRecords', records);
    
    // 重置表单
    this.setData({
      selectedEmotion: '',
      content: '',
      password: ''
    });
    
    wx.showToast({
      title: '记录保存成功',
      icon: 'success'
    });
  },
  loadRecords() {
    const records = wx.getStorageSync('emotionRecords') || [];
    this.setData({
      records: records
    });
  },
  cancelPassword() {
    this.setData({
      showPasswordModal: false,
      modalPassword: ''
    });
  },
  confirmPassword() {
    // 这里可以添加密码验证逻辑
    this.setData({
      showPasswordModal: false,
      modalPassword: ''
    });
  }
})