Page({
  data: {
    // 页面数据
  },
  onLoad() {
    // 页面加载时执行
    console.log('设置页面加载');
  },
  toggleDarkMode(e) {
    const value = e.detail.value;
    console.log('深色模式:', value);
    // 这里可以添加深色模式的切换逻辑
  },
  toggleNotification(e) {
    const value = e.detail.value;
    console.log('推送通知:', value);
    // 这里可以添加推送通知的切换逻辑
  },
  toggleAutoSave(e) {
    const value = e.detail.value;
    console.log('自动保存:', value);
    // 这里可以添加自动保存的切换逻辑
  },
  exportData() {
    // 导出数据逻辑
    const records = wx.getStorageSync('emotionRecords') || [];
    const userAudios = wx.getStorageSync('userAudios') || [];
    const exportData = {
      records: records,
      userAudios: userAudios,
      exportTime: new Date().toISOString()
    };
    
    const exportJson = JSON.stringify(exportData, null, 2);
    wx.setClipboardData({
      data: exportJson,
      success: () => {
        wx.showToast({
          title: '数据已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },
  importData() {
    // 导入数据逻辑
    wx.showModal({
      title: '导入数据',
      content: '请将导出的JSON数据粘贴到输入框中',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          try {
            const importData = JSON.parse(res.content);
            if (importData.records) {
              wx.setStorageSync('emotionRecords', importData.records);
            }
            if (importData.userAudios) {
              wx.setStorageSync('userAudios', importData.userAudios);
            }
            wx.showToast({
              title: '数据导入成功',
              icon: 'success'
            });
          } catch (e) {
            wx.showToast({
              title: '数据格式错误',
              icon: 'none'
            });
          }
        }
      }
    });
  },
  clearData() {
    // 清空数据逻辑
    wx.showModal({
      title: '清空数据',
      content: '确定要清空所有数据吗？此操作不可恢复',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '数据已清空',
            icon: 'success'
          });
        }
      }
    });
  }
})