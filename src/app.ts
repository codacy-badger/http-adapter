import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import cors from 'koa2-cors';
import { collectDefaultMetrics, register } from 'prom-client';
import { ConfigManager } from './manager/conf-manager';
import { RouterManager } from './manager/route-manager';

const METRICS_TIMEOUT = 5000;
const METRICS_PREFIX = 'http_adapter_';

const app = new Koa();
const router = RouterManager.router;

// init metrics client and register to router
const metricsInterval = collectDefaultMetrics({
  timeout: METRICS_TIMEOUT,
  prefix: METRICS_PREFIX
});
router.get('_metrics', '/_metrics', ctx => {
  ctx.headers['content-type'] = register.contentType;
  ctx.body = register.metrics();
});

// declare middleware
app.use(cors({ credentials: true }));
app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }));
app.use(koaStatic(__dirname + '/public'));
app.use(router.routes());
app.use(router.allowedMethods());

// load existing configurations from directory
ConfigManager.initAllConfAndStartWatch();

console.log('server started.');

export const Application = {
  app, metricsInterval
};
