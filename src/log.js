import {range} from "d3-arrays";
import {default as linear, rebind} from "./linear";
import nice from "./nice";

function newLog(linear, base, domain) {

  function log(x) {
    return (domain[0] < 0 ? -Math.log(x > 0 ? 0 : -x) : Math.log(x < 0 ? 0 : x)) / Math.log(base);
  }

  function pow(x) {
    return domain[0] < 0 ? -Math.pow(base, -x) : Math.pow(base, x);
  }

  function scale(x) {
    return linear(log(x));
  }

  scale.invert = function(x) {
    return pow(linear.invert(x));
  };

  scale.base = function(x) {
    if (!arguments.length) return base;
    base = +x;
    return scale.domain(domain);
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain.slice();
    domain = x.map(Number);
    linear.domain(domain.map(log));
    return scale;
  };

  scale.nice = function() {
    var x = nice(linear.domain(), 1);
    linear.domain(x);
    domain = x.map(pow);
    return scale;
  };

  scale.ticks = function() {
    var u = domain[0],
        v = domain[domain.length - 1];
    if (v < u) i = u, u = v, v = i;
    var i = Math.floor(log(u)),
        j = Math.ceil(log(v)),
        k,
        t,
        n = base % 1 ? 2 : base,
        ticks = [];

    if (isFinite(j - i)) {
      if (u > 0) {
        for (k = 1, --j; k < n; ++k) if ((t = pow(i) * k) < u) continue; else ticks.push(t);
        while (++i < j) for (k = 1; k < n; ++k) ticks.push(pow(i) * k);
        for (k = 1; k < n; ++k) if ((t = pow(i) * k) > v) break; else ticks.push(t);
      } else {
        for (k = n - 1, ++i; k >= 1; --k) if ((t = pow(i) * k) < u) continue; else ticks.push(t);
        while (++i < j) for (k = n - 1; k >= 1; --k) ticks.push(pow(i) * k);
        for (k = n - 1; k >= 1; --k) if ((t = pow(i) * k) > v) break; else ticks.push(t);
      }
    }

    return ticks;
  };

  scale.tickFormat = function() {
    throw new Error("not yet implemented");
  };

  scale.copy = function() {
    return newLog(linear.copy(), base, domain);
  };

  return rebind(scale, linear);
}

export default function() {
  return newLog(linear(), 10, [1, 10]);
};