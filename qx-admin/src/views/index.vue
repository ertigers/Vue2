<template>
  <div class="home">
    <Nav />
    <div class="wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";

export default {
  name: "",
  components: {
    Nav,
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;
}
.wrapper {
  flex: 1;
}
</style>