export enum messageCode {
  no_element = 1001,
  un_bind_wx,
  login_server_error,
  socket_error,
  socket_connect_error,
}

export enum message {
  no_element = '请传入elementId',
  un_bind_wx = '未绑定微信',
  login_server_error = '桩桩login服务错误',
  socket_error = 'socket初始化失败，请重试',
  socket_connect_error = 'socket链接失败，请稍后',
}
