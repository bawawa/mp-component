Component({
  properties: {
    width: {
      type: String,
      value: 300,
    },
    height: {
      type: String,
      value: 150
    },
    coverColor: {
      type: String,
      value: "#999"
    },
    prizeName: {
      type: String,
      value: "一等奖"
    },
    diam: {
      type: String,
      value: '20'
    },
    percentage: {
      type: String,
      value: '50'
    }
  },
  data: {
    isClear: false, // 是否已经刮开
    isDrawing: false
  },
  attached: function () {
    const query = this.createSelectorQuery();

    // 获取 canvas 的位置
    query.select('#lottery')
      .fields({
        node: true,
        size: true
      })
      .exec(res => {
        const canvas = res[0].node
        this.context = canvas.getContext('2d');
        this.context.fillStyle = this.properties.coverColor;
        this.context.fillRect(0, 0, 375, 150);
      });
    query.select('#lottery')
      .boundingClientRect((rect) => {
        this.canvasLeft = rect.left;
        this.canvasTop = rect.top;
      })
  },
  methods: {
    touchStart(e) {
      this.setData({
        isDrawing: true
      })
      this.context.beginPath();
      this.draw(e)
    },
    touchEnd(e) {
      this.setData({
        isClear: true,
        isDrawing: false
      });
      const ctx = this.context;
      const width = this.properties.width;
      const height = this.properties.height;
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let count = 0;
      for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] === 0) count++;
      }
      if (count / (width * height) > this.properties.percentage * 0.01) {
        this.triggerEvent("getResult",{});
      }
    },
    draw(event) {
      if (!this.data.isDrawing) return;
      const ctx = this.context;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = this.properties.diam;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const x = event.touches[0].clientX - this.canvasLeft;
      const y = event.touches[0].clientY - this.canvasTop;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  },
});