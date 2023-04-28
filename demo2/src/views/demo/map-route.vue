<template>
  <el-dialog :visible.sync="innerVisible" :fullscreen="true" :append-to-body="true">
    <div id="AmapContainer"></div>
    <div id="panel"></div>
    <div class="form-wrap">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="出行方式" prop="region">
          <el-select v-model="form.type">
            <el-option label="驾车" value="driving"></el-option>
            <el-option label="步行" value="walking"></el-option>
            <el-option label="骑行" value="cycling"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  v-show="form.type === 'driving'" label="导航方式" prop="region">
          <el-select v-model="form.method">
            <el-option label="高德推荐" :value="32"></el-option>
            <el-option label="速度优先" :value="0"></el-option>
            <el-option label="费用最低" :value="1"></el-option>
            <el-option label="距离最短" :value="2"></el-option>
            <el-option label="高速优先" :value="34"></el-option>
            <el-option label="不走高速" :value="35"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起点" prop="longitude">
          <el-autocomplete ref="startPoint" class="point-style" v-model="form.startPoint" :fetch-suggestions="querySearch"
              @focus="focusPoint = 'start'"
              placeholder="请输入起点名称或在地图中选中位置" :trigger-on-focus="false" @select="handleSelect" style="width:100%;">
              <el-button slot="append" @click="handleDelPoint('start')" icon="el-icon-delete"></el-button>
            </el-autocomplete>
        </el-form-item>
        <el-form-item label="终点" prop="longitude">
          <el-autocomplete ref="endPoint" class="point-style" v-model="form.endPoint" :fetch-suggestions="querySearch"
            @focus="focusPoint = 'end'"
            placeholder="请输入终点名称或在地图中选中位置" :trigger-on-focus="false" @select="handleSelect" style="width:100%;">
            <el-button slot="append" @click="handleDelPoint('end')" icon="el-icon-delete"></el-button>
          </el-autocomplete>
        </el-form-item>
        <div v-show="form.type === 'driving'">
          <el-form-item v-for="point in form.viaPoint" :key="point.id" label="途经点" prop="longitude">
            <el-autocomplete :ref="'viaPoint' + point.id" class="point-style" v-model="point.address" :fetch-suggestions="querySearch"
              @focus="focusPoint = 'via' + point.id"
              placeholder="请输入途经点" :trigger-on-focus="false" @select="handleSelect" style="width:100%;">
              <el-button slot="append" @click="handleDelPoint(point)" icon="el-icon-delete"></el-button>
            </el-autocomplete>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" style="text-align:center">
        <!-- <el-button type="primary" @click="handleGenerateRoute" size="small">生成路径</el-button> -->
        <el-button type="warning" @click="handleDelAllMark" size="small">清空所有标记点</el-button>
        <el-button v-if="form.type === 'driving'" type="primary" @click="handleAddViaRoute" size="small">添加途经点</el-button>
        <el-button type="primary" @click="handleAddRoute" size="small">确定</el-button>
        <el-button type="warning" @click="handleCancel" size="small">取消</el-button>
      </div>
    </div>
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
      innerVisible: false,
      form: {
        type: 'driving',
        method: 32,
        startPoint: '',
        endPoint: '',
        viaPoint: []
      },
      startPointInfo: {},
      endPointInfo: {},
      amapRouting: null,


      focusPoint: 'start',
      location: '',
      route: null,

      map: null
    };
  },
  watch: {
    innerVisible(value) {
      if (value) {
        this.$nextTick(() => this.initMap());
      }
    },
    'form.type': {
      handler() {
        this.handleDelAllMark()
      }
    },
    'form.method': {
      handler() {
        if(!this.startPointInfo.position || !this.endPointInfo.position) return
        this.handleGenerateRoute()
      }
    }
  },
  mounted() {

  },
  methods: {
    handleAddRoute() {
      console.log(this.form);
      console.log(this.route);
      let routeInfo = {
        start: {
          lng: this.startPointInfo.position.R,
          lat: this.startPointInfo.position.Q,
          address: this.form.startPoint,
        },
        end: {
          lng: this.endPointInfo.position.R,
          lat: this.endPointInfo.position.Q,
          address: this.form.endPoint,
        },
        via: [],
        type: this.form.type,
        policy: this.route.policy || '',
        time: this.route.time,
        steps: this.route.steps,
        distance: this.route.distance
      }

      this.form.viaPoint.forEach(item => {
        routeInfo.via.push({lng: item.position.R, lat: item.position.Q, address: item.address })
      })

      console.log(routeInfo);

      this.$parent.handleAddRoute(routeInfo);
      this.handleDelAllMark()
      this.innerVisible = false;
    },
    handleCancel() {
      this.handleDelAllMark()
      this.innerVisible = false
    },

    // 初始化地图
    initMap() {
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
        console.log(AMap);
        console.log(document.getElementById('AmapContainer'));
        this.map = new AMap.Map('AmapContainer', {
          resizeEnable: true,
          zoom: 15, // 缩放级别
          center: [117.1355, 31.837], // 中心点
        });
        console.log(this.map);
        this.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        });
        this.map.on('click', this.handleMapClick);
      }).catch((error) => {
        console.log(error);
      });
    },
    //实现点击地图位置，获取经纬度
    async handleMapClick(e) {
      console.log(this.focusPoint);
      console.log(e);
      if(!this.focusPoint) return 
      if(this.focusPoint === 'start') {

        // 有标记点了就要更新
        if(this.startPointInfo.marker) {
          this.startPointInfo.marker.setPosition([e.lnglat.lng, e.lnglat.lat])
        }else {
          let startMarker = new AMap.Marker({
            position: e.lnglat,
            icon: 'image/marker_s.png',
            offset: new AMap.Pixel(-15, -35)
          })
          this.map.add(startMarker)
          this.startPointInfo.marker = startMarker
        }
        this.startPointInfo.position = e.lnglat


        if(!this.form.endPoint) {
          this.focusPoint = 'end'
          this.$refs.endPoint.focus();
        } else {
          this.focusPoint = ''
        } 

        // 是点击的点,需要逆地址
        if(e.type === "click") {
          let address = await this.getGeocoder(e.lnglat)
          console.log(address);
          this.form.startPoint = address
        }

      }else if(this.focusPoint === 'end') {

        // 有标记点了就要更新
        if(this.endPointInfo.marker) {
          this.endPointInfo.marker.setPosition([e.lnglat.lng, e.lnglat.lat])
        }else {
          let endMarker = new AMap.Marker({
            position: e.lnglat,
            icon: 'image/marker_e.png',
            offset: new AMap.Pixel(-15, -35)
          })
          this.map.add(endMarker)
          this.endPointInfo.marker = endMarker
        }
        this.endPointInfo.position = e.lnglat

        if(!this.form.startPoint) {
          this.focusPoint = 'start'
          this.$refs.startPoint.focus();
        }else {
          this.focusPoint = ''
        }
        // 是点击的点,需要逆地址
        if(e.type === "click") {          
          let address = await this.getGeocoder(e.lnglat)
          console.log(address);
          this.form.endPoint = address
        }
      }else if(this.focusPoint.includes('via')) { // 途经点
        const id = this.focusPoint.split('via')[1]
        const index = this.form.viaPoint.findIndex(item => item.id == id)

        let viaPointItem = this.form.viaPoint[index]
        console.log(viaPointItem);

        if(viaPointItem.marker) {
          viaPointItem.marker.setPosition([e.lnglat.lng, e.lnglat.lat])
        }else {
          let viaMarker = new AMap.Marker({
            position: e.lnglat,
            icon: 'image/marker_v.png',
            offset: new AMap.Pixel(-15, -35)
          })
          this.map.add(viaMarker)
          viaPointItem.marker = viaMarker
        }
        viaPointItem.position = e.lnglat 

        this.focusPoint = ''
        // 是点击的点,需要逆地址
        if(e.type === "click") {          
          let address = await this.getGeocoder(e.lnglat)
          viaPointItem.address = address
        }
      }
      this.handleGenerateRoute()
    },

    handleAddViaRoute() {
      const viaPoint = { id: this.$moment().valueOf(), address: '', marker: null }
      this.form.viaPoint.push(viaPoint)
      this.focusPoint = 'via' + viaPoint.id
      this.$nextTick(()=> {
        console.log(this.$refs[ 'viaPoint' + viaPoint.id ][0]);
        this.$refs[ 'viaPoint' + viaPoint.id ][0].focus();
      })
    },

    handleDelPoint(type) {
      if(type === 'start') {
        if(this.startPointInfo.marker) {
          this.form.startPoint = ''
          this.clearMarker(this.startPointInfo.marker)
          this.startPointInfo = {}
          this.focusPoint = 'start'
          this.$refs.startPoint.focus();
        }
      }else if (type === 'end') {
        if(this.endPointInfo.marker) {
          this.form.endPoint = ''
          this.clearMarker(this.endPointInfo.marker)
          this.endPointInfo = {}
          this.focusPoint = 'end'
          this.$refs.endPoint.focus();
        }
      }else {  // 途经点
        const index = this.form.viaPoint.findIndex( item =>  item.id === type.id);
        if(this.form.viaPoint[index].address) {
          this.clearMarker(this.form.viaPoint[index].marker)
        }
        if(index != -1) this.form.viaPoint.splice(index,1);
        this.focusPoint = ''
      }
      this.handleGenerateRoute();
    },
    // 清除 marker
    clearMarker(marker) {
      this.map.remove(marker);
    },
    // 清空所有标记点
    handleDelAllMark() {
      this.handleDelPoint('end')
      this.handleDelPoint('start')
      this.form.viaPoint.forEach((item) => {
        if(item.address) {
          this.clearMarker(item.marker)
        }
      })
      this.form.viaPoint=[]
      if(this.amapRouting) {
        this.amapRouting.clear()
        this.amapRouting = null
      } 
    },

    getGeocoder(postion) {
      return new Promise(resolve => {
        this.geocoder.getAddress(postion, (status, result) => {
          if (status == 'complete') {
            resolve(result.regeocode.formattedAddress)
          } else {
            resolve('暂无地址');
          }
        })
      })
    },

    //通过高德提示接口，获得输入值所提示的地址
    querySearch(queryString, cb) {
      const autoComplete = new AMap.Autocomplete();
      autoComplete.search(queryString, (status, result) => {
        console.log(status, result);
        if (status == 'complete') {
          let tips = []
          for (let i of result.tips) {
            if (i.location) {
              i.value = i.name
              tips.push(i)
            }
          }
          cb(tips)
        } else {
          this.$notify.warning('请输入正确的地址');
          cb([])
        }
      });
    },
    handleSelect(item) {
      console.log(11111111,item);
      if (item.location) {
        this.map.setZoomAndCenter(15, new AMap.LngLat(item.location.lng, item.location.lat));
        item.lnglat = item.location
      }
      this.handleMapClick(item)
    },
    // 生成路径
    handleGenerateRoute() {
      if(!this.startPointInfo.position || !this.endPointInfo.position) {
        if(this.amapRouting) {
          this.amapRouting.clear()
          this.amapRouting = null
        } 
        return
      }

      if(this.amapRouting) {
        this.amapRouting.clear()
        this.amapRouting = null
      } 

      const startPosition = [ this.startPointInfo.position.R, this.startPointInfo.position.Q ]
      const endPosition = [ this.endPointInfo.position.R, this.endPointInfo.position.Q ]

      console.log(this.form.viaPoint);
      const waypoints = []

      this.form.viaPoint.forEach(item=>{
        waypoints.push([item.position.R, item.position.Q])
      })
 
      console.log(waypoints);

      let amapRouting = null
      if(this.form.type === 'driving') {
        amapRouting = new AMap.Driving({
          policy: this.form.method,
          extensions: 'all',
          map: this.map,
          panel: 'panel',
        })
      } else if(this.form.type === 'walking') {
        amapRouting = new AMap.Walking({
          map: this.map,
          panel: 'panel'
        })
      } else {
        amapRouting = new AMap.Riding({
          map: this.map,
          panel: 'panel'
        })
      }
      if(this.form.type === 'driving') {
        console.log(amapRouting);
        amapRouting.search(
          startPosition,
          endPosition, 
          { waypoints },
          (status, result) => {
            console.log(status, result)
            if (status === 'complete') {
              console.log('绘制驾车路线完成')
              this.route = result.routes[0]

              // 去除标记点,重复了
              this.map.remove(this.startPointInfo.marker);
              this.map.remove(this.endPointInfo.marker);
              this.form.viaPoint.forEach((item) => {
                this.map.remove(item.marker);
              })
            } else {
                console.log('驾车路线数据查询失败' + result)
            }
          }
        )
      }else {
        amapRouting.search(
          startPosition,
          endPosition, 
          (status, result) => {
            console.log(result)
            if (status === 'complete') {
              console.log('绘制驾车路线完成')
              this.route = result.routes[0]
              // 去除标记点,重复了
              this.map.remove(this.startPointInfo.marker);
              this.map.remove(this.endPointInfo.marker);
              this.form.viaPoint.forEach((item) => {
                this.map.remove(item.marker);
              })
            } else {
                console.log('驾车路线数据查询失败' + result)
            }
          }
        )        
      }
      this.amapRouting = amapRouting
    }
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
  width: 600px;
}

#AmapContainer {
  width: 100vw;
  height: 100vh;
}
#panel {
  position: fixed;
  top: 20px;
  right: 20px;
}

::v-deep {
  .el-dialog__header {
    padding: 0 !important;
  }

  .el-dialog__body {
    padding: 0 !important;
  }
 
  .close-btn {
    position: absolute;
    top: -10px;
    right: -4px;
  }
  .point-style {
    input {
      font-size: 12px !important;
    }
  }
}


</style>
