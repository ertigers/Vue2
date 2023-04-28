<template>
  <el-container class="tools">
    <div>
      <slot></slot>
    </div>
    <div v-if="show">
      <el-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next"
        background
      ></el-pagination>
    </div>
  </el-container>
</template>

<script lang="ts">

export default {
    name:"SearchTools",
    props:{
        page:Number,
        rows:Number,
        total:Number,
        show:{type:Boolean,default:true}
    },
    methods:{
        currentChange (val) {
          this.$emit('update:page',val);
        },
        sizeChange (val) {
          this.$emit('update:rows',val);
        }
    }


}
</script>

<style lang="scss" scoped>
.tools {
  display: flex;
  justify-content: space-between;
}
</style>
