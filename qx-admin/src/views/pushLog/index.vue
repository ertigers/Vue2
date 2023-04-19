<template>
  <el-container class="main">
    <el-aside>
      <tree-list
        :tree-list="treeList"
        ref="tree"
        hint="按名称过滤"
        height="100"
        @node-click="nodeClick"
      >
        <template v-slot="prop">
          <div class="custom-tree-node">
            <div class="icon-yhc"></div>
            <el-tooltip :content="prop.data.name+''" placement="top" :open-delay="1000">
              <div class="label">{{ prop.data.name }}</div>
            </el-tooltip>
          </div>
        </template>
      </tree-list>
    </el-aside>

    <el-main >
      <el-header style="padding: 0;height: 40px">
        <search-tools
            :page.sync="page"
            :rows.sync="rows"
            :total="total"
        >
          <div class="search-tools">
            <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :clearable="false"
                size="small"
                style="max-width: 400px;"
            >
            </el-date-picker>
            <el-select v-model="state" placeholder="请选择" size="small">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button
                slot="append"
                icon="el-icon-search"
                size="small"
                @click="refreshTable({page:1})"
            >
            </el-button>
          </div>
        </search-tools>
      </el-header>
      <el-main style="padding: 0;" :style="{height: 'calc(100% - 40px)'}">
        <el-table
            :data="tableList"
            height="100%"
        >
          <el-table-column
              v-for="item in logList"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :formatter="item.format"
              :show-overflow-tooltip="true"
              align="center"
          >
          </el-table-column>
          <el-table-column label="推送状态" width="100">
            <template v-slot="prop">
              <div slot="reference" class="name-wrapper">
                <el-tag 
                effect="plain" 
                :type="prop.row.pushstate?'success':'danger'">
                  {{ prop.row.pushstate?"成功":"失败" }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="感应记录" width="150">
            <template v-slot="prop">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-search"
                @click="openDialog(prop.row)"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-main>

    <el-dialog
      title="感应记录"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-row :style="{'max-height': clientHeight - 150 + 'px'}"
          style="overflow: auto"
          type="flex" justify="center">
        <el-col :span="11" style="width:100%">
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
          > 
            <el-form-item label="传感器MAC" >
              <el-input v-model="form.mac" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="传感器类型" >
              <el-input v-model="form.type" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="上报时间" >
              <el-input v-model="form.time" size="small" ></el-input>
            </el-form-item>
            <el-form-item label="传感内容" >
              <el-input v-model="form.content" size="small" type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer">
        <el-button type="primary" @click="closeDialog" size="small">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import TreeList from '@/components/TreeList';
import SearchTools from '@/components/SearchTools';
import moment from 'moment';
import {getUser} from '@/api/user';
import {getLog} from '@/api/pushLog';
export default {
  name: "",
  components: {
    TreeList,SearchTools
  },
  data() {
    return {
      page:1,
      rows:20,
      total:0,
      state:'',
      stateList:[{value:'',label:'全部状态'},{value:'0',label:'失败'},{value:'1',label:'成功'}],
      dateRange:[
        moment().add(-6, 'days').format("YYYY-MM-DD 00:00:00"),
        moment().format("YYYY-MM-DD 23:59:59")
      ],
      form:{
        time:'',
        mac:'',
        content:''
      },
      treeList:[],
      currentNode:{},
      tableList:[],
      logList: [
        {
          prop: 'userid',
          label: '用户名称',
          format: val=> val.userid
        },
        {
          prop: 'pushtime',
          label: '推送时间',
          format: val=> moment(val.pushtime*1000 ).format("YYYY-MM-DD HH:mm:ss")
        },
        {
          prop: 'mac',
          label: '设备MAC',
          format: val=> val.mac
        },
        {
          prop: 'time',
          label: '上报时间',
          format: val=> moment(val.time*1000 ).format("YYYY-MM-DD HH:mm:ss")
        },
        
        {
          prop: 'errmsg',
          label: '错误信息',
          format: val=> val.errmsg
        }
      ],
      dialog:false,
      clientHeight:document.body.clientHeight,
    };
  },
  async mounted(){
    if(!this.treeList.length){
      this.getTreeList();
    }

  },
  watch: {
    currentNode(){
      this.refreshTable();
    },
    page(){
      this.refreshTable();
    },
    rows(){
      this.refreshTable({page:1});
    },
    dateRange(){
      this.refreshTable({page:1});
    }
  },
  methods:{
    getTreeList(){
      let userid='';
      if(localStorage.getItem("USERTYPE")!=0){
        userid = localStorage.getItem("USERID")
      }
      getUser({page:1,rows:99999,userid}).then((result) => {
        result.rows.forEach(item => {
          Object.assign(item,{
            id:item.index,
            name:item.showname
          })
        });
        this.treeList = result.rows;
        this.$nextTick(()=>{
          this.$refs.tree.setCurrentKey(this.treeList[0].id);
          this.currentNode = this.treeList[0];
        })
      }).catch((err) => {
        // this.$notify.error(err.message);
      });
    },
    nodeClick(val){
      this.currentNode = val;
    },
    async refreshTable(val){
      if(val){
        this.page = val.page
      }
      this.tableList = await this.getTableList();
    },
    openDialog(val) {
      this.dialog = true;
      this.form = JSON.parse(JSON.stringify(val));
      this.form.time = moment(val.time*1000 ).format("YYYY-MM-DD HH:mm:ss")
    },
    closeDialog() {
      this.dialog = false;
      this.form={
        time:'',
        mac:'',
        content:''
      }
    },
    getTableList () {
      // if(this.dateRange[0])
      let query = {
        page:this.page,
        rows:this.rows,
        pushstate:this.state,
        begintime:this.dateRange[0],
        endtime:this.dateRange[1],
        userid:this.currentNode.userid,
        sort:'index',
        order:'desc'
      }
      return getLog(query).then((result)=>{
        this.total = result.total
        return result.rows;
      })
    },
    
  }
};
</script>

<style scoped lang="scss">
.main{
  padding: 0 10px 0 5px;
  height: 100%;
  >.el-aside{
    border-right: 1px solid rgb(220,223,230);
    padding: 10px 5px 10px 0;
    .custom-tree-node{
      ::v-deep .icon-yhc{
        width: 24px;
        height: 24px;
        position: absolute;
        background-image: url("../../assets/icons/yhc.svg");
        background-size: 20px 24px;
        background-repeat:no-repeat;
      }
      ::v-deep .el-tooltip{
        position: relative;
        left: 30px;
      }
    }
  }
  >.el-main{
    padding: 10px 0 10px 5px;
    height: 100%;
    >.el-header{
      .el-select {
        position: relative;
        top: -1px;
        width: 100px;
      }
      .el-button{
        position: relative;
        top: -1px;
      }
    }
  }
}
</style>

<style lang="scss">
.el-aside{
  .el-tree--highlight-current {
    .el-tree-node.is-current {
      >.el-tree-node__content {
            background: linear-gradient(
              90deg,
            rgba(64, 160, 255, 0.8),
            rgba(64, 160, 255, 0)) !important;
      }
    }
  }
}
.el-dialog{
  .el-dialog__body{
    padding: 30px 20px 10px 20px;
  }
}

</style>