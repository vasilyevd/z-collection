const fs = require('fs');
const path = require('path')
const jsonServer = require('json-server')
// const opts = process.argv.slice(2);

/**
 * Process source
 */
const source = '_db.js'; // by default use automated logic

// jsonServer router can get path to json
let data = path.join(__dirname, source);
// but if is JS - resolve it
if(/\.js$/.test(source)) {
  delete require.cache[data];
  const dataFn = require(data);
  data = dataFn();
}

const foreignKeySuffix = '_id';
const server = jsonServer.create()
server.use(jsonServer.defaults())
const router = jsonServer.router(data, {
  foreignKeySuffix
})

// configure routes
const routes = JSON.parse(fs.readFileSync(__dirname + '/_routes.json'));
server.use(jsonServer.rewriter(routes));

server.db = router.db;
server.use(router);

// customize response
router.render = function (req, res) {
  let {method, params, body, headers, statusCode} = req;
  // console.log({method, params, body, headers, statusCode});
  // console.log(res.locals.data);
  let count = (Array.isArray(res.locals.data)) ? Array(res.locals.data).length : undefined;
  let send = {
    data: res.locals.data
  }
  if (res.statusCode === 404) {
    send = {
      status: 'ERROR'
    }
    res.statusCode = 200;
  }
  res.jsonp(send);
}


server.listen(3002, () => {
  console.log('JSON Server is running')
})

