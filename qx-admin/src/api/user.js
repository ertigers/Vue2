import { request } from "./request";

//查询用户
export function getUser(query) {
    return request({
        url: "/common/user",
        method: "get",
        params: query,
    })
}
//添加用户
export function addUser(query) {
    return request({
        url: "/common/user/add",
        method: "post",
        data: query,
    });
}
//修改用户
export function setUser(query) {
    return request({
        url: "/common/user/set",
        method: "post",
        data: query,
    });
}
//删除用户
export function delUser(query) {
    return request({
        url: "/common/user/del",
        method: "post",
        data: query,
    });
}
//修改密码
export function setPassword(query) {
    return request({
        url: "/common/user/password/set",
        method: "post",
        data: query,
    });
}
//重置密码
export function resetPassword(query) {
    return request({
        url: "/common/user/password/reset",
        method: "post",
        data: query,
    });
}