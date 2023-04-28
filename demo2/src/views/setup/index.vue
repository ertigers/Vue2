<template>
  <el-container>
    <el-main style="padding: 200px 5px 5px 0">
      <el-row>
        <el-col :span="24">
          <el-tag>用户名称:</el-tag>
          <el-input v-model="user.userid" size="small" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>显示名称:</el-tag>
          <el-input v-model="user.showname" size="small" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>用户类型:</el-tag>
          <el-input v-model="user.usertype" size="small" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>用户描述:</el-tag>
          <el-input v-model="user.description" size="small" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>订阅地址:</el-tag>
          <el-input
            v-model="user.subscribeurl"
            size="small"
            disabled
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>用户公钥:</el-tag>
          <el-input v-model="user.publickey" size="small" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>用户秘钥:</el-tag>
          <el-input v-model="user.privatekey" size="small" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="openDialog()">修改密码</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="logoutCurrent">退出登录</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      title="修改密码"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="原密码" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            size="small"
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="npassword">
          <el-input
            type="password"
            v-model="form.npassword"
            size="small"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpassword">
          <el-input
            type="password"
            v-model="form.cpassword"
            size="small"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit" size="small"
          >确定</el-button
        >
        <el-button type="warning" @click="closeDialog" size="small"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { getUser ,setPassword} from "@/api/user";
import { logout } from "@/api/login";
import md5 from 'js-md5';

export default {
  name: "",
  components: {},
  data() {
    return {
      user: {
        userid: "",
        showname: "",
        usertype: 1,
        description: "",
        subscribeurl: "",
        privatekey: "",
        publickey: "",
      },
      form: {
        index: "",
        password: "",
        npassword: "",
        cpassword: "",
      },
      dialog: false,
      rules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        npassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入新密码"));
              } else {
                if (this.form.cpassword) {
                  this.$refs.form.validateField("cpassword");
                }
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        cpassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.form.npassword) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.user.userid = localStorage.getItem("USERID");
    this.getUserCurrent(this.user.userid);
  },
  watch: {},
  methods: {
    getUserCurrent(userid) {
      if (!this.user.userid) return;
      getUser({ userid })
        .then((result) => {
          this.user = result.rows[0];
          this.user.usertype = this.user.usertype == 0 ? "管理员" : "订阅用户";
        })
        .catch((err) => {
          // this.$notify.error(err.message);
        });
    },
    logoutCurrent() {
      this.$confirm("确定注销！", "注意", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        logout().then((result) => {
          if (result.code == 0) {
            this.$notify.success("退出成功");
            this.$router.push("/login");
          }
        });
      });
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    onSubmit() {
      this.$refs.form.validate((result) => {
        if (result) {
          setPassword({
            index: this.user.index,
            password: md5(this.form.password),
            npassword: md5(this.form.npassword),
          }).then(() => {
            this.$notify.success("密码修改成功,请重新登录");
            this.$router.push("/login");
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-input {
  width: 60%;
  margin-bottom: 20px;
}
</style>
