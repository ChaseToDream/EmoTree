Page({
  data: {
    builtInAudios: [
      { id: '1', name: '雨声', url: 'https://example.com/rain.mp3' },
      { id: '2', name: '森林', url: 'https://example.com/forest.mp3' },
      { id: '3', name: '海浪', url: 'https://example.com/waves.mp3' },
      { id: '4', name: '冥想', url: 'https://example.com/meditation.mp3' }
    ],
    userAudios: [],
    currentAudio: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    sliderValue: 0,
    audioContext: null
  },
  onLoad() {
    // 页面加载时获取用户音频
    this.loadUserAudios();
    // 创建音频上下文
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.onPlay(() => {
      this.setData({ isPlaying: true });
    });
    this.audioContext.onPause(() => {
      this.setData({ isPlaying: false });
    });
    this.audioContext.onStop(() => {
      this.setData({ isPlaying: false, currentTime: 0, sliderValue: 0 });
    });
    this.audioContext.onEnded(() => {
      this.setData({ isPlaying: false, currentTime: 0, sliderValue: 0 });
    });
    this.audioContext.onTimeUpdate(() => {
      const currentTime = this.audioContext.currentTime;
      const duration = this.audioContext.duration;
      const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;
      this.setData({
        currentTime: currentTime,
        duration: duration,
        sliderValue: sliderValue
      });
    });
  },
  onUnload() {
    // 页面卸载时停止音频
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  },
  loadUserAudios() {
    const userAudios = wx.getStorageSync('userAudios') || [];
    this.setData({ userAudios: userAudios });
  },
  selectAudio(e) {
    const audio = e.currentTarget.dataset.audio;
    this.setData({ currentAudio: audio });
    this.audioContext.src = audio.url;
    this.audioContext.play();
  },
  playPause() {
    if (!this.data.currentAudio) {
      wx.showToast({
        title: '请选择音频',
        icon: 'none'
      });
      return;
    }
    if (this.data.isPlaying) {
      this.audioContext.pause();
    } else {
      this.audioContext.play();
    }
  },
  stop() {
    if (this.data.currentAudio) {
      this.audioContext.stop();
    }
  },
  sliderChange(e) {
    const value = e.detail.value;
    const duration = this.data.duration;
    if (duration > 0) {
      const currentTime = (value / 100) * duration;
      this.audioContext.seek(currentTime);
    }
  },
  uploadAudio() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['.mp3', '.wav', '.m4a'],
      success: (res) => {
        const tempFile = res.tempFiles[0];
        // 这里可以上传文件到服务器，然后获取URL
        // 暂时使用本地临时路径
        const newAudio = {
          id: Date.now().toString(),
          name: tempFile.name,
          url: tempFile.path
        };
        const userAudios = [...this.data.userAudios, newAudio];
        wx.setStorageSync('userAudios', userAudios);
        this.setData({ userAudios: userAudios });
        wx.showToast({
          title: '音频上传成功',
          icon: 'success'
        });
      },
      fail: (res) => {
        console.log('选择文件失败', res);
      }
    });
  },
  formatTime(seconds) {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
})