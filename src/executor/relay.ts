import axios from 'axios';
import Debug from 'debug';
import { Context } from 'koa';
import { constants } from '../constants';
import { RouteConfig } from '../storage/model';
import { Executor, FuncSet } from './executor';

const debug = Debug('server:relay-stage');

export class RelayStage extends Executor<void, RouteConfig> {

  async execute(ctx: Context): Promise<void> {
    // compose and send requests to other servers
    let responseMap = new Map();
    let runtime = this.ctxRunEnv.getRunTimeEnv();
    let routeName = this.envConf.name;
    let cnt = 0;
    for (let relayConf of this.envConf.relay) {
      let { name, location, method, body, headers, interceptors } = relayConf;
      let sendMethod = method.toUpperCase();
      let axiosConf = {
        method: sendMethod,
        url: location,
        headers: Object.assign({}, headers),
        data: body
      };
      debug(`${ctx.reqId}: processing relay request (${name}) - ${sendMethod} ${location}`);

      // step1, replace template in url, body and header
      let tmplReplaceFuncURL = (<FuncSet>runtime)[constants.RELAY_PROP_TEMPLATE_FUNC_PREFIX +
        routeName + cnt + constants.URL_PROP_SUFFIX];
      let tmplReplaceFuncBody = (<FuncSet>runtime)[constants.RELAY_PROP_TEMPLATE_FUNC_PREFIX +
        routeName + cnt + constants.BODY_PROP_SUFFIX];
      if (typeof tmplReplaceFuncURL === 'function') {
        axiosConf.url = tmplReplaceFuncURL();
      }
      if (body && typeof tmplReplaceFuncBody === 'function') {
        axiosConf.data = tmplReplaceFuncBody();
      }
      if (headers) {
        for (let key in headers) {
          let tmplReplaceFuncHeader = (<FuncSet>runtime)[constants.RELAY_HEADER_TEMPLATE_FUNC_PREFIX + routeName + cnt + key];
          if (typeof tmplReplaceFuncHeader === 'function') {
            axiosConf.headers[key] = tmplReplaceFuncHeader();
          }
        }
      }

      // step2, call interceptors to process request before sending
      if (interceptors) {
        for (let interceptor in interceptors) {
          let interceptorFunc = (<FuncSet>runtime)[constants.RELAY_INTERCEPTOR_FUNC_PREFIX + routeName + cnt + interceptor];
          if (typeof interceptorFunc === 'function') {
            axiosConf = await interceptorFunc(axiosConf, ctx);
          }
        }
      }

      // step3, send request to target server
      if (location !== constants.DUMMY_URL) {
        let resp = await axios(axiosConf);
        responseMap.set(name, resp);
      }
      ctx.responseMap = responseMap;
      cnt++;
    }
    debug(`${ctx.reqId}: finish request relay`);
  }
}