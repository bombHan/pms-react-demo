import Qrious from 'qrious';
import io from './lib/socket.js';
import './lib/wxLogin';
import { messageCode, message } from './messageCode';

type level = 'L' | 'M' | 'Q' | 'H';
type mime = 'image/png';
enum Enum {
  ZHUANG = 1,
  WX,
}

interface IData {
  ticket?: string;
  code?: string;
  openId?: string;
  nickName?: string;
}
interface ISuccess {
  success: boolean;
  data?: IData;
}
interface IError {
  success: boolean;
  errorMsg?: string;
  errorCode?: number;
}
interface IQrcodeProps {
  /**
   * @description elementId
   **/
  elementId: string;
  /// 先不开放相关api
  // /**
  //  * @description 背景色
  //  * @default   white
  //  **/
  // background?: string;
  // /**
  //  * @description 背景透明度
  //  * @default   0
  //  **/
  // backgroundAlpha?: number;
  // /**
  //  * @description 方块色
  //  * @default   white
  //  **/
  // foreground?: string;
  // /**
  //  * @description 方块透明度
  //  * @default  1
  //  **/
  // foregroundAlpha?: number;
  /**
   * @description 轻量模式(只有二维码)
   * @default  false
   **/
  light?: boolean;
  /**
   * @description 图片大小
   * @default 280
   **/
  size?: number;
  /**
   * @description 所需登录软件的名字
   * @default 'XX公司'
   **/
  softName?: string;
  /**
   * @description 支持指定环境, 默认当前域名
   * @default ''
   **/
  host?: string;
  /**
   * @description 扫描的客户端, 目前支持桩桩（1）、微信（2）
   * @default 2
   **/
  client?: 1 | 2;
  /** 初始化成功钩子 */
  onMount?: (qrcode: Qrcode) => void;
  /** 登录成功回调事件 */
  onCallback?: (res: ISuccess & IError) => void;
  /** 失败回调事件 */
  onError?: (res: IError) => void;
}
interface ILoginQrcode {
  code: string;
  appId: string;
  nodejsServer: string;
  redirectUrl: string;
}

export class Qrcode {
  version = '1.0.0';
  background: string;
  backgroundAlpha: number;
  foreground: string;
  foregroundAlpha: number;
  level: level;
  mime: mime;
  size: number;
  client: Enum;
  qrious: Qrious;
  softName: string;
  host: string;
  props: IQrcodeProps;
  light: boolean;
  loginQrcode: ILoginQrcode | undefined;
  iframeStyle: HTMLStyleElement | undefined;
  socket: any;
  constructor(props: IQrcodeProps) {
    this.background = 'white';
    this.backgroundAlpha = 0;
    this.foreground = 'black';
    this.foregroundAlpha = 1;
    this.level = 'H';
    this.mime = 'image/png';
    this.size = props.size || 280;
    this.client = props.client || Enum.WX;
    this.softName = props.softName || 'XX';
    this.light = props.light || false;
    this.host = props.host || '';
    this.props = props;
    this.initialize();
  }

  protected async initialize() {
    await this.initLoginQrcode();
    await this.initSocket();
    this.initLogin();
    this.props.onMount?.(this);
  }

  // 提供绑定微信界面的地址
  get pageUrl() {
    if (this.host)
      return `${this.host}/passport/#/bingAccount?qrCode=${this.loginQrcode?.code}`;
    return `/passport/#/bingAccount?qrCode=${this.loginQrcode?.code}`;
  }

  protected async initLoginQrcode(): Promise<any> {
    try {
      const res = await this.createHttpRequest<{ data: ILoginQrcode }>(
        `${this.host}/api-gateway/login/api/public/common/front/getLoginQrcode.htm?loginType=${this.client}`,
      );
      if (!res.data.nodejsServer.includes('http')) {
        // 手动加上https
        if (res.data.nodejsServer.includes('443')) {
          res.data.nodejsServer = `https://${res.data.nodejsServer}`;
        } else {
          res.data.nodejsServer = `http://${res.data.nodejsServer}`;
        }
      }
      this.loginQrcode = res.data;
    } catch (e) {
      const errorData = {
        errorCode: messageCode.login_server_error,
        errorMsg: message.login_server_error,
        success: false,
      };
      this.props.onError?.(errorData);
      throw errorData;
    }
  }

  protected initSocket() {
    return new Promise(resolve => {
      // 防止重复运行，先关闭原来的链接
      this.socket?.close?.();
      this.socket = io(`${this.loginQrcode?.nodejsServer}/chat`);
      // 因为历史遗留问题，这里需要加个延迟
      setTimeout(() => {
        this.socket.emit('grcode', { code: this.loginQrcode?.code });
        this.socket.on('message', obj => {
          if (obj && obj.itype === 'QRLOGINMSG') {
            const { status, type, ticket, openId, nickName } = obj.payload;
            // 未绑定微信
            if (type === 1 && status === 5) {
              this.props.onCallback?.({
                success: false,
                errorMsg: message.un_bind_wx,
                errorCode: messageCode.un_bind_wx,
                data: {
                  openId: openId,
                  nickName: nickName,
                },
              });
            }
            // 重新连接
            if (type === 1 && status === 2) {
              this.initWxLogin();
            }
            // 登录成功
            if (type === 2 && status === 1) {
              this.props.onCallback?.({
                success: true,
                data: { ticket, code: this.loginQrcode?.code },
              });
            }
          }
        });
        this.socket.on('error', () => {
          this.props.onError?.({
            errorCode: messageCode.socket_error,
            errorMsg: message.socket_error,
            success: false,
          });
        });
        this.socket.on('connect_error', () => {
          this.props.onError?.({
            errorCode: messageCode.socket_connect_error,
            errorMsg: message.socket_connect_error,
            success: false,
          });
        });
      }, 1000);
      resolve(true);
    });
  }

  protected initLogin() {
    if (!this.props.elementId) {
      this.props.onError?.({
        errorCode: messageCode.no_element,
        errorMsg: message.no_element,
        success: false,
      });
      return;
    }
    if (this.client === Enum.WX) {
      this.initWxLogin();
    }
    if (this.client === Enum.ZHUANG) {
      this.initZhuangLogin();
    }
  }

  protected initWxLogin() {
    this.createIframeStyle();
    // @ts-ignore
    new window.WxLogin({
      self_redirect: true,
      id: this.props.elementId,
      appid: this.loginQrcode?.appId,
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent(this.loginQrcode?.redirectUrl ?? ''),
      ...this.createStyle(),
    });
  }

  protected initZhuangLogin() {
    const element = document.getElementById(this.props.elementId);
    const codeElement = this.createCanvas();
    // 因为是异步生成二维码,需要先销毁之前的二维码
    this.destroyElement();
    // 开启轻量模式，只有二维码
    if (this.light) {
      const contentDom = this.createCanvasParent();
      contentDom.appendChild(codeElement);
      element?.appendChild(contentDom);
    } else {
      const { rootDom, contentDom } = this.createRoot();
      contentDom.appendChild(codeElement);
      element?.appendChild(rootDom);
    }
    this.qrious = new Qrious({
      element: codeElement,
      background: this.background,
      backgroundAlpha: this.backgroundAlpha,
      foreground: this.foreground,
      foregroundAlpha: this.foregroundAlpha,
      level: this.level,
      mime: this.mime,
      size: this.size - 10,
      value: this.loginQrcode?.code,
    });
  }

  protected createHttpRequest<T>(url): Promise<T> {
    return new Promise((resolve, reject) => {
      const ajax = new XMLHttpRequest();
      ajax.open('get', url);
      // ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      // ajax.responseType = 'text';
      ajax.send();
      ajax.onreadystatechange = () => {
        if (ajax.readyState === 4) {
          if (ajax.status === 200) {
            const jsonData = JSON.parse(ajax.response);
            resolve(jsonData.data);
          } else {
            reject(message.login_server_error);
          }
        }
      };
    });
  }

  protected createRoot() {
    const rootDom = document.createElement('div');
    rootDom.style.width = `${this.size}px`;

    const titleTag = document.createElement('div');
    titleTag.innerText = '登录';
    titleTag.style.textAlign = 'center';
    titleTag.style.fontSize = '20px';
    titleTag.style.marginBottom = '15px';

    const qrTag = document.createElement('div');
    qrTag.innerText = '使用桩桩app扫一扫登录';
    qrTag.style.textAlign = 'center';
    qrTag.style.marginTop = '10px';
    qrTag.style.fontSize = '13px';

    const softTag = document.createElement('div');
    softTag.innerText = `"${this.softName}"`;
    softTag.style.textAlign = 'center';
    softTag.style.fontSize = '13px';

    const contentDom = this.createCanvasParent();

    rootDom.appendChild(titleTag);
    rootDom.appendChild(contentDom);
    rootDom.appendChild(qrTag);
    rootDom.appendChild(softTag);
    return {
      rootDom,
      contentDom,
    };
  }

  protected createCanvasParent() {
    const contentDom = document.createElement('div');
    contentDom.style.border = '1px solid #ddd';
    contentDom.style.display = 'flex';
    contentDom.style.justifyContent = 'center';
    contentDom.style.alignItems = 'center';
    contentDom.style.width = `${this.size}px`;
    contentDom.style.height = `${this.size}px`;
    return contentDom;
  }

  protected createCanvas() {
    return document.createElement('canvas');
  }

  protected createStyle() {
    // 轻量模式需要去除标题
    if (this.light) {
      const style = window.btoa(`
        .impowerBox .qrcode {width: ${this.size - 2}px; margin-top: 0}
        .impowerBox .title {display: none;}
        .impowerBox .info {display: none;}
        .status_icon {display: none}
        .impowerBox .status {text-align: center;}`);
      return {
        href: `data:text/css;base64,${style}`,
      };
    }
    // 使用者可以控制宽度
    const styleWidth = window.btoa(`
    .impowerBox .qrcode {width: ${this.size - 2}px;}
    .impowerBox .info {width: ${this.size - 2}px;}
    .impowerBox .status {padding: 0;}
    `);
    return {
      href: `data:text/css;base64,${styleWidth}`,
    };
  }

  // 需要调整 微信默认的iframe样式
  protected createIframeStyle() {
    const height = this.light ? this.size : this.size + 100;
    const styleStr = `#${this.props.elementId} iframe {width: ${this.size}px; height: ${height}px`;
    // 重新连接的时候，已经有相关样式，不需要重复加入
    if (this.iframeStyle) {
      this.iframeStyle.innerHTML = styleStr;
      return;
    }
    this.iframeStyle = document.createElement('style');
    this.iframeStyle.innerHTML = styleStr;
    document
      .getElementsByTagName('head')
      ?.item?.(0)
      ?.appendChild?.(this.iframeStyle);
  }

  // 设置不同的客户端进行扫码
  setClient = (type: Enum) => {
    this.client = type;
  };

  onInit = async (type: Enum) => {
    this.setClient(type);
    this.destroy();
    await this.initLoginQrcode();
    await this.initSocket();
    this.initLogin();
  };

  destroy = () => {
    this.socket?.close?.();
    if (this.iframeStyle) this.iframeStyle.innerHTML = '';
    this.destroyElement();
  };

  destroyElement = () => {
    const element = document.getElementById(this.props.elementId);
    if (element && element?.firstChild) {
      element.removeChild?.(element?.firstChild);
    }
  };
}
