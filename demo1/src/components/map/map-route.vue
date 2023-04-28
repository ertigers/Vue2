<template>
  <el-dialog :visible.sync="innerVisible" :fullscreen="true" :append-to-body="true">

    <div id="AmapContainer" ></div>

    <div class="form-wrap">
      <el-form ref="form" :model="form"  label-width="80px" >

        <el-form-item label="出行方式" prop="region">
          <el-select v-model="form.type">
            <el-option label="驾车" value="driving"></el-option>
            <el-option label="步行" value="walking"></el-option>
            <el-option label="骑行" value="cycling"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起点"  prop="longitude">
          <el-input placeholder="请输入起点" v-model="form.startPoint">
            <el-button slot="append" @click="MAP_PlaceSearch(form.startPoint)" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        
        <div v-if="form.type === 'driving'" >
          <el-form-item v-for="(point,index) in  form.viaPoint" :key="index" label="途经点"  prop="longitude">
            <el-input v-model="form.viaPoint" size="small" placeholder="途经点"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="终点"  prop="longitude">
          <el-input v-model="form.endPoint" size="small" placeholder="终点"></el-input>
        </el-form-item>



      </el-form>

      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click="handleAddRoute" size="small">确定</el-button>
        <el-button type="warning" @click="innerVisible = false" size="small">取消</el-button>
      </div>

    </div>



  </el-dialog>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
window._AMapSecurityConfig = {
  securityJsCode: 'bf1162f5479fe7bff9fa9d4c2c4cd464',
};
let AMap = null;

export default {
  data() {
    return {
      innerVisible: false,
      form: {
        type: 'driving',
        startPoint: '',
        endPoint: '',
        viaPoint: []
      },
      location:'',
      routeInfo: {id: 1, text: '安徽省六安市六安二中-安徽省合肥市合肥八中，安徽省六安市六安二中-安徽省合肥市合肥八中，安徽省六安市六安二中-安徽省合肥市合肥八中'},
      map: null
    };
  },
  watch: {
    innerVisible(value) {
      if(value) {
        this.$nextTick(()=>this.initMap());
      }
    },

  },
  mounted() {
    AMapLoader.reset();
    AMapLoader.load({
      key: 'cb6900ff49ab9292789ced38f7769a4e',
      version: '1.4.15',
      plugins: [
        'AMap.MouseTool',
        'AMap.Geocoder',
        'AMap.MarkerCluster',
        'AMap.AutoComplete',
        'AMap.GraspRoad',
        'AMap.moveAnimation',
        'AMap.Driving',
        'AMap.Walking',
        'AMap.Riding',
        'AMap.MoveAnimation',
        'AMap.ToolBar',
        'AMap.Autocomplete'
      ]
    }).then((obj) => {
      AMap = obj;
    }).catch((error) => { 
      console.log(error);
    });
  },
  methods: {
    handleAddRoute() {
      this.$parent.$parent.handleAddRoute(this.routeInfo);
      this.innerVisible = false;
    },
    // 初始化地图
    initMap() {
      console.log(AMap);
      console.log(document.getElementById('AmapContainer'));
      this.map = new AMap.Map('AmapContainer', {
        resizeEnable: true,
        zoom: 15, // 缩放级别
        center: [117.1355, 31.837], // 中心点
      });
      console.log(this.map);
      // this.geocoder = new AMap.Geocoder({
      //   radius: 1000,
      //   extensions: 'all'
      // });
      // this.map.addControl(new AMap.ToolBar());
      // this.map.on('click', this.handleMapClick);
    },

    // 地名搜索    参数:'合肥'
    MAP_PlaceSearch (option) {
      console.log(option);
      const autoComplete = new AMap.Autocomplete();
      //通过高德提示接口，获得输入值所提示的十个地址
      autoComplete.search(option, (status, result) => {
        console.log(status,result);
        if (status == 'complete') {
          for (let i of result.tips) {
            if (i.location) {
              this.map.setZoomAndCenter( 15, new AMap.LngLat(i.location.lng, i.location.lat) );
              break;
            }
          }
        } else {
          this.$notify.warning('请输入正确的地址');
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.form-wrap {
  position: fixed;
  top: 20px;
  left: 20px;
  background: #FFFFFF;
  padding: 20px;
}
#AmapContainer {
  width: 100vw;
  height: 100vh;
}
/deep/ {
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__body {
    padding: 0 !important;
  }  
}


</style>
