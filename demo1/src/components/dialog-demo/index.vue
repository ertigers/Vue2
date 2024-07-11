<template>
  <div class="container">
    <h4>这里管理弹窗的demo</h4>
    <div>
      <el-button type="primary" plain @click="handleOpenDialog('Example1Dialog')">打开弹窗1</el-button>
      <el-button type="primary" plain @click="handleOpenDialog('Example2Dialog')">打开弹窗2</el-button>
    </div>
    <div>
      <example1-dialog ref="Example1Dialog" />
      <example2-dialog ref="Example2Dialog" />
    </div>
  </div>
</template>

<script>
import Example1Dialog from './compos/example1Dialog.vue'
import Example2Dialog from './compos/example2Dialog.vue'

export default {
    name:'',
    components: {
      Example1Dialog,
      Example2Dialog
    },
    data() {
        return {

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
      handleOpenDialog(ref,isEdit) {
        this.$refs[ref].dialog = true
        this.$refs[ref].isEdit = isEdit || false
      }
    },
};
</script>

<style scoped lang="scss">

</style>
