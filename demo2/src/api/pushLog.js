import { request } from "./request";

//查询推送日志
export function getLog(query) {
    return request({
        url: "/common/pushlog",
        method: "get",
        params: query,
    });
}
//添加推送日志
export function addLog(query) {
    return request({
        url: "/common/pushlog/add",
        method: "post",
        data: query,
    });
}
//删除推送日志
export function delLog(query) {
    return request({
        url: "/common/pushlog/del",
        method: "post",
        data: query,
    });
}