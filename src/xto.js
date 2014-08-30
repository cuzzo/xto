define([
  "route-collector",
  "app-state-manager",
  "minivents"
], function(RouteCollector, AppStateManager, Events) {

var Xto = {},
    _initialized = false,
    _SPACE_REGEX = /%20/g;

Xto.finally = undefined;
Xto.route = function() {};

Xto.compile_querystring = function(data) {
  var qs = "";
  Object.keys(data).forEach(function(key) {
    var val = data[key];
    qs += encodeURIComponent(key)
        + "="
        + encodeURIComponent(val).replace(_SPACE_REGEX, "+")
        + "&";
  });
  return qs.slice(0, -1);
};

Xto.parse_querystring = function(qs) {
  var b = {};
  if (qs === "") return b;
  if (qs.indexOf("?") === 0) qs = qs.substring(1);
  qs = qs.split("&");
  var b = {};
  for (var i = 0; i < qs.length; ++i)
  {
      var p = qs[i].split("=");
      if (p.length !== 2) continue;
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
};

Xto.change_state = function(state) {
  var res = this;
  AppStateManager.change_state(null, state, function(resp) {
    if (typeof Xto.finally !== "function") return;
    Xto.finally(res, resp);
  });
};

Xto.add_route = function(route, ev_name, app_router) {
  var parse_querystring = route[route.length - 1] === "?";
  route = parse_querystring ? route.substring(0, route.length - 1) : route;
  app_router.get(route, function(req, res) {
    // TODO: figure out what to do with express querystring.
    req.querystring = parse_querystring
        ? Xto.parse_querystring(req.querystring)
        : req.querystring;
    Xto.event.emit(ev_name, req, Xto.change_state.bind(res));
  });
};

/**
 * Instantiate the router, and add each route to the router.
 *
 * @param dictionary routes
 *   Key -> pseduo-regex / route
 *   Value -> event / method name
 * @param start_route
 *   A route at which the router should start.
 */
Xto.init = function(routes, app_router, end) {
  if (_initialized) return;

  Xto.finally = end;
  Xto.route = app_router;

  var routes_list = [];
  for (var rk in routes) {
    routes_list.push(rk);
  }

  routes_list.forEach(function(route) {
    var ev_name = routes[route];
    Xto.add_route(route, ev_name, app_router);
  });

  return _initialized = true;
};

Xto.start = function(app_router, next, end) {
  RouteCollector.event.on("routes_collected", function(routes) {
    Xto.init(routes, app_router, end);
    if (typeof next !== "function") return;
    next();
  });
  RouteCollector.collect_routes();
};

Xto.event = new Events();

return Xto;

});
