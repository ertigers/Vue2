<template>
  <div class="nav-wrapper">
    <aside>
      <ol>
        <li>
          <router-link to="/pushLog" active-class="selected">推送日志</router-link>
          <div class="icon-rz"></div>
        </li> 
        <li>
          <router-link to="/user" active-class="selected" v-if="usertype">用户管理</router-link>
          <div class="icon-yh"></div>
        </li>
        <li>
          <router-link to="/setup" active-class="selected">我的信息</router-link>
          <div class="icon-wd"></div>
        </li>
      </ol>
    </aside>
  </div>
</template>

<script >
export default {
  name: "Nav",
  data(){
    return{
      usertype:localStorage.getItem("USERTYPE")==0?true:false 
    }
  }
};
</script>

<style scoped lang="scss">
.nav-wrapper {
  padding: 10px 5px 10px 10px;
  border-right: 1px solid rgb(220,223,230);
  width: 200px;
  color: rgb(1, 21, 36);
  a {
    display: block;
    height: 60px;
    line-height: 60px;
  }
  li{
    position: relative;
    >div{
      width: 18px;
      height: 18px;
      position: absolute;
      top: 19.5px;
      left: -60px;
      filter: drop-shadow(rgba(0, 0, 0, 0.6) 90px 0);
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .icon-rz {
      background-image: url("../assets/icons/rz.svg");
    }
    .icon-yh {
      background-image: url("../assets/icons/yh.svg");
    }
    .icon-wd {
      background-image: url("../assets/icons/wd.svg");
    }
  }
  li:hover {
    background: linear-gradient(90deg, 
      rgba(84, 92, 100, 0.8),
      rgba(84, 92, 100, 0.4),
      rgba(84, 92, 100, 0)) !important;
  }
  .selected {
    color: rgb(255, 208, 75);
    background: linear-gradient(90deg, 
      rgba(84, 92, 100, 0.8),
      rgba(84, 92, 100, 0.8),
      rgba(84, 92, 100, 0)) !important;
    +div{
      filter: drop-shadow(#ffd04b 90px 0) !important;
    }
  }
}
</style>
