const Koa = require('koa');
const http = require('http');
const https = require('https');
const fs = require('fs');
const enforceHttps = require('koa-sslify');
const static = require('koa-static');

var app = new Koa();
// 配置静态web服务的中间件
app.use(static(__dirname + '/web'));
// Force HTTPS on all page
app.use(enforceHttps());



// index page
app.use(ctx => {
  ctx.body = "hello world from " + ctx.request.url;
});

// SSL options
var options = {
  key: fs.readFileSync('./ssl/2_wx.firecloud.club.key'),
  cert: fs.readFileSync('./ssl/1_wx.firecloud.club_bundle.crt')
}

// start the server
http.createServer(app.callback()).listen(80);
https.createServer(options, app.callback()).listen(443);