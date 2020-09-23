# TODO List

* 【完成】build.ts的实现，使用https://github.com/paulmillr/chokidar
  * 【完成】自动初始化所有service、controller
  * 【完成】api的参数类型检测，编译controller.json
  * 【完成】填充上下文context，添加service等
  * 【完成】自动生成entities.ts文件
  * 【完成】WxPermission自动添加权限
  * 【完成】WxApiController 自动生成CRUD接口
  * 【完成】生成wxeap.ts文件给client使用
  * 【完成】支持文件夹递归获取Controller，Service和Entity
* 【完成】支持定时任务, @Schedule
  * 【完成】logger
* 【完成】Entity
  * 【完成】静态分析Entity，整理类型
  * 【完成】通过静态分析自动更新Schema
  * 【完成】beforeSave的限制
* 【完成】事务处理，使用/batch的api
* 【完成】API管理/测试
* 【完成】WxTable 开发
* 【完成】WxSelect 开发
* 【完成】Entity管理
  * 【完成】列表
  * 【完成】编辑
* 【完成】 Controller管理
    * 【完成】日志
* 【完成】分离`wxboot`为私有库，编写bin文件
* 【完成】`wxcomponents`封装WxTable等前端组件
* 【完成】pm2多进程启动
* 【完成】构建docker镜像
* 微服务
  * 【完成】日志挂载, 生产环境共用一个volume
  * 【完成】通过MQTT服务去发布Controller.json
  * 【完成】使用KONG网关，wxboot和wxcomponents调整路径
  * 【完成】wxboot网关初始化
  * 实现build打包脚本，根据ENV打包dockerfile和docker-compose.yml
* 【完成】.wxboot文件夹重命名
* 【完成】支持mongodb
* 【完成】支持web启动
* 【完成】重命名wxeap工程为wxeap-admin
* 【完成】日志采集
* 前后端工程分离
* 性能采集
* wxeap-admin docker engine API

* 用户和权限模块的开发
* 版本发布，更新日志
* 菜单管理
* 密码加密
* 文件管理/附件上传
* 附件预览服务
* 扫码登录/验证码登录
* 短信管理

## 前端
* 自动生成表单

## 需要考虑

* 多个工程之间，微服务的调用
* 多工程版本维护
* 


https://github.com/microsoft/TypeScript/issues/19528#issuecomment-339945044
