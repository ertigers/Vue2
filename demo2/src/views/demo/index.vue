<template>
  <div class="container">
    <map-route ref="mapRouteRef" />
    <route-polyline ref="routePolylineRef" />
    <el-button type="primary" @click="handleOpenMap" size="small">选择路径</el-button>

    <div> {{ routeInfo }}</div>

    <div class="route-wrap">
      <div v-if="routeList.length">
        <div class="route" v-for="(route,index) in routeList" :key="index">
          <div @click="handleRoutePolyline(route)"  class="text">{{ route.text }}</div>
          <i @click="handleDelRoute(route)"  class="el-icon-delete"></i> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapRoute from './map-route';
import routePolyline from './route-polyline';

export default {
  name:'',
  components: {
    mapRoute,routePolyline
  },
  data() {
      return {
        routeInfo: {},
        routeList: []
      };
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 打开地图，选择路径规划方案
    handleOpenMap() {
      this.$refs.mapRouteRef.innerVisible = true;
    },
    handleAddRoute(data) {
      let routeInfo = {
        id: this.$moment().valueOf(),
        text: data.start.address + '-->' + data.end.address,
        ...data
      }
      // 取出绘制路径
      let paths = []
      data.steps.forEach((step)=>{
        step.path.forEach((path)=>{
          paths.push([path.lng, path.lat])
        })
      })

      paths.unshift([ data.start.lng, data.start.lat ])
      paths.push([ data.end.lng, data.end.lat ])

      routeInfo.paths = paths
      console.log(routeInfo);

      delete routeInfo.steps

      this.routeList.push(routeInfo)
    },
    handleRoutePolyline(route) {
      this.$refs.routePolylineRef.dialogVisible = true;
      this.$refs.routePolylineRef.pathInfo = route;
    },
    handleDelRoute(route) {
      const index = this.routeList.findIndex( item =>  item.id === route.id);
      console.log(index);
      if(index != -1) this.routeList.splice(index,1);
    }
  },
};
</script>

<style scoped lang="scss">
.route-wrap {
max-height: 140px;
overflow: auto;
margin-bottom: 10px;
.route {
  display: flex;
  align-items: center;
  border: 1px solid #D1D3D9;
  border-radius: 4px;
  padding-left: 10px;
  margin-bottom: 10px;
  .text {
    width: 90%;
    line-height: 1.3;
    font-size: 14px;
    color: #0f44a0;
  }
  .el-icon-delete {
    font-size: 20px;
    color: red;
    margin-left: 10px;
    cursor: pointer;
  }
}
}
</style>
