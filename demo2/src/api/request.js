/**
 * 封装Axios
 * 处理请求、响应错误信息
 */
import { Message } from "element-ui"; //引用饿了么UI消息组件
import axios from "axios"; //引用axios
import {checkMsg} from '@/utils/errno';

// create an axios instance
const request = axios.create({
  baseURL: "/api",
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
});

// request interceptor
// request.interceptors.request.use(
//   (config) => {
//     let adminToken = localStorage.getItem("admin_token");
//     if (adminToken) {
//       config.headers.Authorization = `${adminToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     // do something with request error
//     console.log(error); // for debug
//     return Promise.reject(error);
//   }
// );

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const res = response.data; //res is my own data
      if (res.code === 0) {
        return res;
      } else {
        Message({
          message: checkMsg(res.code) || res.message || "未知错误",
          type: "error",
          duration: 2 * 1000,
        });
        if (res.code === 401) {
          location.href = `/login?redirect=${location.pathname}`;
        }
        return Promise.reject(new Error(res.error || "Error"));
      }
    } else {
      Message({
        message: `请求错误，状态码${response.status}`,
        type: "error",
        duration: 2 * 1000,
      });
      return Promise.reject(new Error("Error"));
    }
  },
  (error) => {
    console.log("响应失败" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export { request }