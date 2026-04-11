Page({
  data: {
    records: [],
    totalRecords: 0,
    recentRecords: []
  },
  onLoad() {
    // 页面加载时获取数据
    this.loadRecords();
  },
  onShow() {
    // 页面显示时重新获取数据
    this.loadRecords();
  },
  loadRecords() {
    const records = wx.getStorageSync('emotionRecords') || [];
    const totalRecords = records.length;
    // 获取最近5条记录
    const recentRecords = records.slice(-5).reverse();
    
    this.setData({
      records: records,
      totalRecords: totalRecords,
      recentRecords: recentRecords
    });
    
    // 绘制情绪分布图表
    this.drawEmotionChart();
  },
  drawEmotionChart() {
    const records = this.data.records;
    // 统计各情绪出现次数
    const emotionCount = {
      happy: 0,
      sad: 0,
      angry: 0,
      anxious: 0,
      calm: 0,
      excited: 0
    };
    
    records.forEach(record => {
      if (emotionCount.hasOwnProperty(record.emotion)) {
        emotionCount[record.emotion]++;
      }
    });
    
    const ctx = wx.createCanvasContext('emotionChart');
    const width = wx.getSystemInfoSync().windowWidth - 60;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    // 颜色配置
    const colors = {
      happy: '#FFD700',
      sad: '#1E90FF',
      angry: '#FF6347',
      anxious: '#FF8C00',
      calm: '#98FB98',
      excited: '#FF69B4'
    };
    
    // 情绪文本
    const emotionText = {
      happy: '开心',
      sad: '难过',
      angry: '愤怒',
      anxious: '焦虑',
      calm: '平静',
      excited: '兴奋'
    };
    
    // 计算总数量
    const total = Object.values(emotionCount).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      // 无数据时显示提示
      ctx.setFontSize(24);
      ctx.setFillStyle('#999');
      ctx.setTextAlign('center');
      ctx.fillText('暂无数据', centerX, centerY);
      ctx.draw();
      return;
    }
    
    // 绘制饼图
    let startAngle = 0;
    Object.entries(emotionCount).forEach(([emotion, count]) => {
      const sliceAngle = (count / total) * 2 * Math.PI;
      
      // 绘制扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.setFillStyle(colors[emotion]);
      ctx.fill();
      
      // 绘制文本
      const textAngle = startAngle + sliceAngle / 2;
      const textX = centerX + (radius + 30) * Math.cos(textAngle);
      const textY = centerY + (radius + 30) * Math.sin(textAngle);
      ctx.setFontSize(20);
      ctx.setFillStyle('#333');
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(`${emotionText[emotion]}: ${count}`, textX, textY);
      
      startAngle += sliceAngle;
    });
    
    ctx.draw();
  },
  formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  },
  getEmotionText(emotion) {
    const emotionMap = {
      happy: '开心',
      sad: '难过',
      angry: '愤怒',
      anxious: '焦虑',
      calm: '平静',
      excited: '兴奋'
    };
    return emotionMap[emotion] || emotion;
  }
})