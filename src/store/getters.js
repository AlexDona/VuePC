
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  orgId: state => state.user.orgId,
  orgType: state => state.user.orgType,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  msgTotal: state => state.user.msgTotal, // 未读消息数量
  platformType: state => state.user.platformType, // 平台方类型
  addProductParams: state => state.productMaintain.addProductParams, // 获取参数
  validateProductResult: state => state.productMaintain.validateProductResult // 保存每个tabs检验结果

}
export default getters
