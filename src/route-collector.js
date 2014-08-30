define([
  "route-apps",
  "minivents"
], function(_route_apps, Events) {

var RouteCollector = {};
var _routes = {};

/**
 * Collect all routes asynchronously, then trigger an event when finished.
 */
RouteCollector.collect_routes = function(route_apps) {
  route_apps = typeof route_apps === "undefined" ? _route_apps : route_apps;
  require(route_apps, function() {
    for (var i in arguments) {
      var route_app = arguments[i],
          app_routes = route_app.get_routes();
      for (var j in app_routes) {
        _routes[j] = app_routes[j];
      }
    }
    RouteCollector.event.emit("routes_collected", _routes);
  });
};

RouteCollector.event = new Events();

return RouteCollector;

});
