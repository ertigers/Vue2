<template>
  <el-dialog title="路径预览" :visible.sync="dialogVisible" width="1040px" >
    <div id="AmapPolylineContainer"></div>
    <!-- <div id="polylineInfo">
      <div><span>起点:</span> {{pathInfo.start.address}}</div>
      <div><span>途经点:</span> {{pathInfo.start.address}}</div>
      <div><span>终点:</span> {{pathInfo.end.address}}</div>
      <div class="distance"><span>总里程:</span> {{pathInfo.distance | distanceFilter }}</div>
    </div> -->
    <span slot="footer" class="dialog-footer">
      <div class="distance">
        <span>总里程: </span> {{pathInfo.distance | distanceFilter }}
        <span>出行方式: </span> {{pathInfo.type | typeFilter }}
      </div>

      <el-button @click="handlePolyline">绘制</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
AMapLoader.reset();

window._AMapSecurityConfig = {
  securityJsCode: 'bf1162f5479fe7bff9fa9d4c2c4cd464',
};
let AMap = null;

export default {
  data() {
    return {
      dialogVisible: false,
      pathInfo: {},
      map: null
    };
  },
  filters: {
    distanceFilter(val) {
      return (val/1000).toFixed(2) + 'km'
    },

    typeFilter(val) {
      let type = ''
      switch (val) {
        case 'driving':
          type = '驾车'
          break;
      
          case 'walking':
          type = '步行'
          break;
      
          case 'cycling':
          type = '骑行'
          break;
      
        default:
          break;
      }

      return type
    }
  },
  watch: {
    dialogVisible(value) {
      if (value) {
        this.$nextTick(() => this.initMap());
      }
    },
  },
  mounted() {
    AMapLoader.load({
        key: 'cb6900ff49ab9292789ced38f7769a4e',
        version: '1.4.15',
        plugins: [
          'AMap.Geocoder',
          'AMap.Driving',
          'AMap.Walking',
          'AMap.Riding',
          'AMap.Autocomplete'
        ]
      }).then((obj) => {
        AMap = obj;

        
      }).catch((error) => {
        console.log(error);
      });

  },
  methods: {
    // 初始化地图
    initMap() {
      this.map = new AMap.Map('AmapPolylineContainer', {
        resizeEnable: true,
        zoom: 15, // 缩放级别
        center: [117.1355, 31.837], // 中心点
      });
      this.handlePolyline()
      this.handleMapMarker()
      this.map.setFitView()
    },
    handlePolyline() {
      console.log(this.pathInfo);
      // 创建折线实例
      var polyline = new AMap.Polyline({
          path: this.pathInfo.paths,  
          lineJoin: 'round' // 折线拐点连接处样式
      });
      this.map.add(polyline);
    },
    // 添加标记点
    handleMapMarker() {
      let startMarker = new AMap.Marker({
        position: [ this.pathInfo.start.lng, this.pathInfo.start.lat ],
        icon: 'image/marker_s.png',
        offset: new AMap.Pixel(-15, -35)
      })
      this.map.add(startMarker)
      
      let endMarker = new AMap.Marker({
        position: [ this.pathInfo.end.lng, this.pathInfo.end.lat ],
        icon: 'image/marker_e.png',
        offset: new AMap.Pixel(-15, -35)
      })
      this.map.add(endMarker)

      if(this.pathInfo.via.length) {
        this.pathInfo.via.forEach(item => {
          let endMarker = new AMap.Marker({
            position: [ item.lng, item.lat ],
            icon: 'image/marker_v.png',
            offset: new AMap.Pixel(-15, -35)
          })
          this.map.add(endMarker)
        });
      }
    }
  },
};
</script>

<style scoped lang="scss">
#AmapPolylineContainer {
  width: 1000px;
  height: 400px;
}
#polylineInfo {
  width: 200px;
  height: 200px;
  background-color: #FCF9F2;
  position: absolute;
  top: 60px;
  right: 20px;
}
.distance {
  position: absolute;
  bottom: 20px;
  left: 30px;
    > span {
      font-weight: 700;
      font-size: 18px;
    }

    >span:nth-child(2) {
      margin-left: 20px;
    }
  }
</style>
