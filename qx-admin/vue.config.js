const path = require("path"); //引入path模块

function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title= '石化能源平台'
      return args
    })
    config.resolve.alias
      .set("@", resolve("src"))
      .set("public", resolve("public"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"));
  },
  devServer: {
    host: '0.0.0.0',
    port: 8087,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target:'http://127.0.0.1:9581',
        secure: false,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': 'api'
        }
      }
    }
  }
}