<template>
  <el-container>
    <el-aside style="width: 100%;overflow: hidden">
      <el-input v-model="filterText" :placeholder="hint" size="small">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <slot slot="append" name="icon"></slot>
      </el-input>
      <el-tree
          ref="tree"
          node-key="id"
          highlight-current
          style="margin-top: 10px;overflow:hidden auto;"
          :style="{height:clientHeight-height+'px'}"
          :props="defaultProps"
          :expand-on-click-node="clickExpand"
          :filter-node-method="filterNode"
          :show-checkbox="showCheckbox"
          :default-expanded-keys="defaultExpandKey"
          :data="treeList"
          :load="load"
          :lazy="lazy"
          @node-click="nodeClick"
          @check="nodeCheck"
          @node-expand="nodeExpand"
      >
        <template v-slot="prop">
          <slot :data="prop.data"></slot>
        </template>
      </el-tree>
    </el-aside>
  </el-container>
</template>

<script>

export default {
    name: "TreeList",
    props: {
        treeList: [], 
        height: null,
        hint: '',
        defaultExpandKey: [],
        clickExpand: true,
        showCheckbox: false,
        lazy: false,
        load:null
    },
    data() {
        return{
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'leaf',
                disabled: 'disabled'
            },
            clientHeight: document.body.clientHeight,
        }
    },
    watch: {
        filterText(val){
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        getCheckedKeys () {
            this.$refs.tree.getCheckedKeys();
        },
        setCheckedKeys (key) {
            this.$refs.tree.setCheckedKeys(key);;
        },
        setCurrentKey (key) {
            this.$refs.tree.setCurrentKey(key);
        },
        filterNode (value, data) {
            if (!value) {
                return true;
            }
            return data.name.indexOf(value) !== -1;
        },

        nodeClick (val) {
            this.$emit('node-click',val)
        },
        nodeCheck (data,obj) {
            this.$emit('check',{data,obj})
        },
        nodeExpand (data,obj,node) {
            this.$emit('node-expand',{data,obj,node})
        }
    }
}
</script>

<style scoped lang="scss">
.el-tree{
    ::v-deep >.el-tree-node{
        margin: 5px;
    }
}
</style>
