<template>
  <el-container class="main">
    <el-header >
      <search-tools
        :page.sync="page"
        :rows.sync="rows"
        :total="total"
        @refresh-table="refreshTable"
      >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="openDialog()"
          size="small"
        >添加用户
        </el-button>
        <el-select v-model="state" placeholder="请选择" size="small">
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          v-model="searchText"
          placeholder="搜索名称"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-tooltip slot="append" content="搜索">
            <el-button
              icon="el-icon-search"
              @click="refreshTable()"
            ></el-button>
          </el-tooltip>
        </el-input>
      </search-tools>
    </el-header>
    <el-main style="padding: 0" :style="{height: clientHeight - 70 + 'px'}">
      <el-table
        :data="tableList"
        height="100%"
      >
        <el-table-column
          v-for="item in columnList"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.format"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="公钥秘钥" width="150">
          <template v-slot="prop">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="showKey(prop.row)"
            >查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="prop">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openDialog(prop.row)"
            >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="onDelete(prop.row)"
              v-if="prop.row.deletable"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog
      :title="dialogTitle"
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
            :rules="rules"
            label-width="100px"
          > 
            <el-form-item label="用户名称" prop="userid">
              <el-input v-model="form.userid" size="small" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" prop="showname">
              <el-input v-model="form.showname" size="small" placeholder="请输入显示名称"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!form.index">
              <el-input v-model="form.password" size="small" placeholder="请输入用户密码"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.description" size="small" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item v-if="form.index" label="订阅地址" >
              <el-input v-model="form.subscribeurl" size="small" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="form.index" label="重置密码">
              <el-input v-model="password" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item v-if="form.index" label="公钥">
              <el-input v-model="form.publickey" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="form.index" label="秘钥">
              <el-input v-model="form.privatekey" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="usertype">
              <el-radio-group v-model="form.usertype">
                <el-radio :label="0">系统管理员</el-radio>
                <el-radio :label="1">订阅用户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer">
        <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
        <el-button type="warning" @click="closeDialog" size="small">取消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import SearchTools from '@/components/SearchTools';
import {getUser,setUser,addUser,delUser,resetPassword } from '@/api/user';
import md5 from 'js-md5';

export default {
  name: "",
  components: {
    SearchTools
  },
  data() {
    return {
      page:1,
      rows:20,
      total:0,
      searchText:'',
      password:'',
      state:0,
      stateList:[{value:0,label:'显示名称'},{value:1,label:'用户名称'}],
      tableList:[],
      columnList:[
        {
          prop: 'userid',
          label: '用户名称',
          format: val => val.userid                                                                                                                                                                                                                                                               
        },
        {
          prop: 'showname',
          label: '显示名称',
          format: val=> val.showname
        },{
          prop: 'usertype',
          label: '用户类型',
          format: val => {
            if (val.usertype === 0) {
              return '系统管理员';
            } else if (val.usertype === 1) {
              return '订阅用户';
            }
            return '未知';
          }
        },{
          prop: 'description',
          label: '描述',
          format: val=> val.description
        },{
          prop: 'subscribeurl',
          label: '订阅地址',
          format: val=> val.subscribeurl
        }
      ],
      form:{
        userid:'',
        showname:'',
        password:'',
        usertype:1,
        description:"",
      },
      rules:{
        userid: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {max: 50, message: '长度最多为50字符', trigger: 'blur'}
        ],
        showname: [
          {required: true, message: '请输入显示名称', trigger: 'blur'},
          {max: 50, message: '长度最多为50字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {max: 50, message: '长度最多为50字符', trigger: 'blur'}
        ],
        usertype: [{required: true, trigger: 'change'}],
        // subscribeurl:[{
        //   required: false,
        //   pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
        //   message: '请输入正确的网站',
        //   trigger: 'blur'
        // }]
              

      },
      dialog:false,
      dialogTitle:'',
      clientHeight:document.body.clientHeight,
    };
  },
  mounted(){
    if(!this.tableList.length){
      this.refreshTable();
    }

  },
  watch: {
    page(){
      this.refreshTable();
    },
    rows(){
      this.page = 1;
      this.refreshTable();
    },
  },
  methods:{
    async refreshTable(){
      this.tableList = await this.getTableList();
    },
    getTableList () {
      let query = {
        page: this.page,
        rows: this.rows,
        showname: this.searchText,
      }
      if(this.state == 1){
        query = {
          page: this.page,
          rows: this.rows,
          userid: this.searchText,
        }
      }
      return getUser(query).then(result=>{
        this.total = result.total;
        return result.rows;
      }).
        catch((err) => {
          // this.$notify.error(err.message);
        });
    },
    showKey(val) {
      this.$alert(
        `<div>公钥:${val.publickey}</div>
        <div>秘钥:${val.privatekey}</div>`, 
        '用户公钥秘钥', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
        });
    },
    openDialog(val){
      this.dialog = true;
      if(!val){
        this.dialogTitle = '添加用户'
      }else{
        this.dialogTitle = '修改用户'
        this.form = val
      }
    },
    closeDialog(){
      this.dialog = false;
      this.form = {
        userid:'',
        showname:'',
        password:'',
        usertype:1,
        description:"",
      };
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    onSubmit(){
      this.$refs.form.validate((result) => {
        if (result) {
          //如果是添加用户
          if (!this.form.index) {
            //发送请求
            addUser({
              ...this.form,
              password:md5(this.form.password)
            }).then(() => {
              this.$notify.success('添加用户成功');
              this.refreshTable();
              this.closeDialog();
            }).
              catch((err) => {
                // this.$notify.error(err.message);
              });
          } else { //如果是修改
            setUser(this.form).then(() => {
              this.$notify.success('修改用户成功');
              this.refreshTable();
              this.closeDialog();
            }).
              catch((err) => {
                // this.$notify.error(err.message);
              }).
              finally(() => {
                this.password = '';
              });
            if (this.password) {
              resetPassword({
                index: this.form.index,
                npassword: md5(this.password)
              }).then(() => {
                this.$notify.success('密码重置成功');
              }).
                catch((err) => {
                  // this.$notify.error(err.message);
                });
            }
          }
        }
      });
    },
    onDelete(val){
      this.$confirm('确定删除！', '注意', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({index: val.index}).then(() => {
          this.$notify.success('删除成功');
          this.refreshTable();
        }).
          catch((err) => {
            // this.$notify.error(err.message);
          });
      }).
        catch(() => false);
    },
  }
};
</script>

<style scoped lang="scss">
.main{
  padding: 10px;
  >.el-header{
    height: 50px;
    padding: 10px 0;
    .el-select {
      width: 100px;
      margin-left: 10px;
    }
  }
}
</style>