//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
! function(a, b) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.moment = b()
}(this, function() {
    "use strict";

    function a() {
        return Dc.apply(null, arguments)
    }

    function b(a) {
        Dc = a
    }

    function c(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }

    function d(a) {
        return a instanceof Date || "[object Date]" === Object.prototype.toString.call(a)
    }

    function e(a, b) {
        var c, d = [];
        for (c = 0; c < a.length; ++c) d.push(b(a[c], c));
        return d
    }

    function f(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }

    function g(a, b) {
        for (var c in b) f(b, c) && (a[c] = b[c]);
        return f(b, "toString") && (a.toString = b.toString), f(b, "valueOf") && (a.valueOf = b.valueOf), a
    }

    function h(a, b, c, d) {
        return za(a, b, c, d, !0).utc()
    }

    function i() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function j(a) {
        return null == a._pf && (a._pf = i()), a._pf
    }

    function k(a) {
        if (null == a._isValid) {
            var b = j(a);
            a._isValid = !isNaN(a._d.getTime()) && b.overflow < 0 && !b.empty && !b.invalidMonth && !b.nullInput && !b.invalidFormat && !b.userInvalidated, a._strict && (a._isValid = a._isValid && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour)
        }
        return a._isValid
    }

    function l(a) {
        var b = h(0 / 0);
        return null != a ? g(j(b), a) : j(b).userInvalidated = !0, b
    }

    function m(a, b) {
        var c, d, e;
        if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = j(b)), "undefined" != typeof b._locale && (a._locale = b._locale), Fc.length > 0)
            for (c in Fc) d = Fc[c], e = b[d], "undefined" != typeof e && (a[d] = e);
        return a
    }

    function n(b) {
        m(this, b), this._d = new Date(+b._d), Gc === !1 && (Gc = !0, a.updateOffset(this), Gc = !1)
    }

    function o(a) {
        return a instanceof n || null != a && null != a._isAMomentObject
    }

    function p(a) {
        var b = +a,
            c = 0;
        return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c
    }

    function q(a, b, c) {
        var d, e = Math.min(a.length, b.length),
            f = Math.abs(a.length - b.length),
            g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && p(a[d]) !== p(b[d])) && g++;
        return g + f
    }

    function r() {}

    function s(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function t(a) {
        for (var b, c, d, e, f = 0; f < a.length;) {
            for (e = s(a[f]).split("-"), b = e.length, c = s(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
                if (d = u(e.slice(0, b).join("-"))) return d;
                if (c && c.length >= b && q(e, c, !0) >= b - 1) break;
                b--
            }
            f++
        }
        return null
    }

    function u(a) {
        var b = null;
        if (!Hc[a] && "undefined" != typeof module && module && module.exports) try {
            b = Ec._abbr, require("./locale/" + a), v(b)
        } catch (c) {}
        return Hc[a]
    }

    function v(a, b) {
        var c;
        return a && (c = "undefined" == typeof b ? x(a) : w(a, b), c && (Ec = c)), Ec._abbr
    }

    function w(a, b) {
        return null !== b ? (b.abbr = a, Hc[a] || (Hc[a] = new r), Hc[a].set(b), v(a), Hc[a]) : (delete Hc[a], null)
    }

    function x(a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return Ec;
        if (!c(a)) {
            if (b = u(a)) return b;
            a = [a]
        }
        return t(a)
    }

    function y(a, b) {
        var c = a.toLowerCase();
        Ic[c] = Ic[c + "s"] = Ic[b] = a
    }

    function z(a) {
        return "string" == typeof a ? Ic[a] || Ic[a.toLowerCase()] : void 0
    }

    function A(a) {
        var b, c, d = {};
        for (c in a) f(a, c) && (b = z(c), b && (d[b] = a[c]));
        return d
    }

    function B(b, c) {
        return function(d) {
            return null != d ? (D(this, b, d), a.updateOffset(this, c), this) : C(this, b)
        }
    }

    function C(a, b) {
        return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
    }

    function D(a, b, c) {
        return a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }

    function E(a, b) {
        var c;
        if ("object" == typeof a)
            for (c in a) this.set(c, a[c]);
        else if (a = z(a), "function" == typeof this[a]) return this[a](b);
        return this
    }

    function F(a, b, c) {
        for (var d = "" + Math.abs(a), e = a >= 0; d.length < b;) d = "0" + d;
        return (e ? c ? "+" : "" : "-") + d
    }

    function G(a, b, c, d) {
        var e = d;
        "string" == typeof d && (e = function() {
            return this[d]()
        }), a && (Mc[a] = e), b && (Mc[b[0]] = function() {
            return F(e.apply(this, arguments), b[1], b[2])
        }), c && (Mc[c] = function() {
            return this.localeData().ordinal(e.apply(this, arguments), a)
        })
    }

    function H(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function I(a) {
        var b, c, d = a.match(Jc);
        for (b = 0, c = d.length; c > b; b++) Mc[d[b]] ? d[b] = Mc[d[b]] : d[b] = H(d[b]);
        return function(e) {
            var f = "";
            for (b = 0; c > b; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function J(a, b) {
        return a.isValid() ? (b = K(b, a.localeData()), Lc[b] || (Lc[b] = I(b)), Lc[b](a)) : a.localeData().invalidDate()
    }

    function K(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (Kc.lastIndex = 0; d >= 0 && Kc.test(a);) a = a.replace(Kc, c), Kc.lastIndex = 0, d -= 1;
        return a
    }

    function L(a, b, c) {
        _c[a] = "function" == typeof b ? b : function(a) {
            return a && c ? c : b
        }
    }

    function M(a, b) {
        return f(_c, a) ? _c[a](b._strict, b._locale) : new RegExp(N(a))
    }

    function N(a) {
        return a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
            return b || c || d || e
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function O(a, b) {
        var c, d = b;
        for ("string" == typeof a && (a = [a]), "number" == typeof b && (d = function(a, c) {
                c[b] = p(a)
            }), c = 0; c < a.length; c++) ad[a[c]] = d
    }

    function P(a, b) {
        O(a, function(a, c, d, e) {
            d._w = d._w || {}, b(a, d._w, d, e)
        })
    }

    function Q(a, b, c) {
        null != b && f(ad, a) && ad[a](b, c._a, c, a)
    }

    function R(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function S(a) {
        return this._months[a.month()]
    }

    function T(a) {
        return this._monthsShort[a.month()]
    }

    function U(a, b, c) {
        var d, e, f;
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
            if (e = h([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a)) return d;
            if (c && "MMM" === b && this._shortMonthsParse[d].test(a)) return d;
            if (!c && this._monthsParse[d].test(a)) return d
        }
    }

    function V(a, b) {
        var c;
        return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), R(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a)
    }

    function W(b) {
        return null != b ? (V(this, b), a.updateOffset(this, !0), this) : C(this, "Month")
    }

    function X() {
        return R(this.year(), this.month())
    }

    function Y(a) {
        var b, c = a._a;
        return c && -2 === j(a).overflow && (b = c[cd] < 0 || c[cd] > 11 ? cd : c[dd] < 1 || c[dd] > R(c[bd], c[cd]) ? dd : c[ed] < 0 || c[ed] > 24 || 24 === c[ed] && (0 !== c[fd] || 0 !== c[gd] || 0 !== c[hd]) ? ed : c[fd] < 0 || c[fd] > 59 ? fd : c[gd] < 0 || c[gd] > 59 ? gd : c[hd] < 0 || c[hd] > 999 ? hd : -1, j(a)._overflowDayOfYear && (bd > b || b > dd) && (b = dd), j(a).overflow = b), a
    }

    function Z(b) {
        a.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + b)
    }

    function $(a, b) {
        var c = !0,
            d = a + "\n" + (new Error).stack;
        return g(function() {
            return c && (Z(d), c = !1), b.apply(this, arguments)
        }, b)
    }

    function _(a, b) {
        kd[a] || (Z(b), kd[a] = !0)
    }

    function aa(a) {
        var b, c, d = a._i,
            e = ld.exec(d);
        if (e) {
            for (j(a).iso = !0, b = 0, c = md.length; c > b; b++)
                if (md[b][1].exec(d)) {
                    a._f = md[b][0] + (e[6] || " ");
                    break
                }
            for (b = 0, c = nd.length; c > b; b++)
                if (nd[b][1].exec(d)) {
                    a._f += nd[b][0];
                    break
                }
            d.match(Yc) && (a._f += "Z"), ta(a)
        } else a._isValid = !1
    }

    function ba(b) {
        var c = od.exec(b._i);
        return null !== c ? void(b._d = new Date(+c[1])) : (aa(b), void(b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b))))
    }

    function ca(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 1970 > a && h.setFullYear(a), h
    }

    function da(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 1970 > a && b.setUTCFullYear(a), b
    }

    function ea(a) {
        return fa(a) ? 366 : 365
    }

    function fa(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function ga() {
        return fa(this.year())
    }

    function ha(a, b, c) {
        var d, e = c - b,
            f = c - a.day();
        return f > e && (f -= 7), e - 7 > f && (f += 7), d = Aa(a).add(f, "d"), {
            week: Math.ceil(d.dayOfYear() / 7),
            year: d.year()
        }
    }

    function ia(a) {
        return ha(a, this._week.dow, this._week.doy).week
    }

    function ja() {
        return this._week.dow
    }

    function ka() {
        return this._week.doy
    }

    function la(a) {
        var b = this.localeData().week(this);
        return null == a ? b : this.add(7 * (a - b), "d")
    }

    function ma(a) {
        var b = ha(this, 1, 4).week;
        return null == a ? b : this.add(7 * (a - b), "d")
    }

    function na(a, b, c, d, e) {
        var f, g, h = da(a, 0, 1).getUTCDay();
        return h = 0 === h ? 7 : h, c = null != c ? c : e, f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, {
            year: g > 0 ? a : a - 1,
            dayOfYear: g > 0 ? g : ea(a - 1) + g
        }
    }

    function oa(a) {
        var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == a ? b : this.add(a - b, "d")
    }

    function pa(a, b, c) {
        return null != a ? a : null != b ? b : c
    }

    function qa(a) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function ra(a) {
        var b, c, d, e, f = [];
        if (!a._d) {
            for (d = qa(a), a._w && null == a._a[dd] && null == a._a[cd] && sa(a), a._dayOfYear && (e = pa(a._a[bd], d[bd]), a._dayOfYear > ea(e) && (j(a)._overflowDayOfYear = !0), c = da(e, 0, a._dayOfYear), a._a[cd] = c.getUTCMonth(), a._a[dd] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b) a._a[b] = f[b] = d[b];
            for (; 7 > b; b++) a._a[b] = f[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
            24 === a._a[ed] && 0 === a._a[fd] && 0 === a._a[gd] && 0 === a._a[hd] && (a._nextDay = !0, a._a[ed] = 0), a._d = (a._useUTC ? da : ca).apply(null, f), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[ed] = 24)
        }
    }

    function sa(a) {
        var b, c, d, e, f, g, h;
        b = a._w, null != b.GG || null != b.W || null != b.E ? (f = 1, g = 4, c = pa(b.GG, a._a[bd], ha(Aa(), 1, 4).year), d = pa(b.W, 1), e = pa(b.E, 1)) : (f = a._locale._week.dow, g = a._locale._week.doy, c = pa(b.gg, a._a[bd], ha(Aa(), f, g).year), d = pa(b.w, 1), null != b.d ? (e = b.d, f > e && ++d) : e = null != b.e ? b.e + f : f), h = na(c, d, e, g, f), a._a[bd] = h.year, a._dayOfYear = h.dayOfYear
    }

    function ta(b) {
        if (b._f === a.ISO_8601) return void aa(b);
        b._a = [], j(b).empty = !0;
        var c, d, e, f, g, h = "" + b._i,
            i = h.length,
            k = 0;
        for (e = K(b._f, b._locale).match(Jc) || [], c = 0; c < e.length; c++) f = e[c], d = (h.match(M(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && j(b).unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), k += d.length), Mc[f] ? (d ? j(b).empty = !1 : j(b).unusedTokens.push(f), Q(f, d, b)) : b._strict && !d && j(b).unusedTokens.push(f);
        j(b).charsLeftOver = i - k, h.length > 0 && j(b).unusedInput.push(h), j(b).bigHour === !0 && b._a[ed] <= 12 && b._a[ed] > 0 && (j(b).bigHour = void 0), b._a[ed] = ua(b._locale, b._a[ed], b._meridiem), ra(b), Y(b)
    }

    function ua(a, b, c) {
        var d;
        return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b
    }

    function va(a) {
        var b, c, d, e, f;
        if (0 === a._f.length) return j(a).invalidFormat = !0, void(a._d = new Date(0 / 0));
        for (e = 0; e < a._f.length; e++) f = 0, b = m({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._f = a._f[e], ta(b), k(b) && (f += j(b).charsLeftOver, f += 10 * j(b).unusedTokens.length, j(b).score = f, (null == d || d > f) && (d = f, c = b));
        g(a, c || b)
    }

    function wa(a) {
        if (!a._d) {
            var b = A(a._i);
            a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], ra(a)
        }
    }

    function xa(a) {
        var b, e = a._i,
            f = a._f;
        return a._locale = a._locale || x(a._l), null === e || void 0 === f && "" === e ? l({
            nullInput: !0
        }) : ("string" == typeof e && (a._i = e = a._locale.preparse(e)), o(e) ? new n(Y(e)) : (c(f) ? va(a) : f ? ta(a) : d(e) ? a._d = e : ya(a), b = new n(Y(a)), b._nextDay && (b.add(1, "d"), b._nextDay = void 0), b))
    }

    function ya(b) {
        var f = b._i;
        void 0 === f ? b._d = new Date : d(f) ? b._d = new Date(+f) : "string" == typeof f ? ba(b) : c(f) ? (b._a = e(f.slice(0), function(a) {
            return parseInt(a, 10)
        }), ra(b)) : "object" == typeof f ? wa(b) : "number" == typeof f ? b._d = new Date(f) : a.createFromInputFallback(b)
    }

    function za(a, b, c, d, e) {
        var f = {};
        return "boolean" == typeof c && (d = c, c = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = e, f._l = c, f._i = a, f._f = b, f._strict = d, xa(f)
    }

    function Aa(a, b, c, d) {
        return za(a, b, c, d, !1)
    }

    function Ba(a, b) {
        var d, e;
        if (1 === b.length && c(b[0]) && (b = b[0]), !b.length) return Aa();
        for (d = b[0], e = 1; e < b.length; ++e) b[e][a](d) && (d = b[e]);
        return d
    }

    function Ca() {
        var a = [].slice.call(arguments, 0);
        return Ba("isBefore", a)
    }

    function Da() {
        var a = [].slice.call(arguments, 0);
        return Ba("isAfter", a)
    }

    function Ea(a) {
        var b = A(a),
            c = b.year || 0,
            d = b.quarter || 0,
            e = b.month || 0,
            f = b.week || 0,
            g = b.day || 0,
            h = b.hour || 0,
            i = b.minute || 0,
            j = b.second || 0,
            k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = x(), this._bubble()
    }

    function Fa(a) {
        return a instanceof Ea
    }

    function Ga(a, b) {
        G(a, 0, 0, function() {
            var a = this.utcOffset(),
                c = "+";
            return 0 > a && (a = -a, c = "-"), c + F(~~(a / 60), 2) + b + F(~~a % 60, 2)
        })
    }

    function Ha(a) {
        var b = (a || "").match(Yc) || [],
            c = b[b.length - 1] || [],
            d = (c + "").match(td) || ["-", 0, 0],
            e = +(60 * d[1]) + p(d[2]);
        return "+" === d[0] ? e : -e
    }

    function Ia(b, c) {
        var e, f;
        return c._isUTC ? (e = c.clone(), f = (o(b) || d(b) ? +b : +Aa(b)) - +e, e._d.setTime(+e._d + f), a.updateOffset(e, !1), e) : Aa(b).local();
        return c._isUTC ? Aa(b).zone(c._offset || 0) : Aa(b).local()
    }

    function Ja(a) {
        return 15 * -Math.round(a._d.getTimezoneOffset() / 15)
    }

    function Ka(b, c) {
        var d, e = this._offset || 0;
        return null != b ? ("string" == typeof b && (b = Ha(b)), Math.abs(b) < 16 && (b = 60 * b), !this._isUTC && c && (d = Ja(this)), this._offset = b, this._isUTC = !0, null != d && this.add(d, "m"), e !== b && (!c || this._changeInProgress ? $a(this, Va(b - e, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, a.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? e : Ja(this)
    }

    function La(a, b) {
        return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
    }

    function Ma(a) {
        return this.utcOffset(0, a)
    }

    function Na(a) {
        return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(Ja(this), "m")), this
    }

    function Oa() {
        return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Ha(this._i)), this
    }

    function Pa(a) {
        return a = a ? Aa(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0
    }

    function Qa() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }

    function Ra() {
        if (this._a) {
            var a = this._isUTC ? h(this._a) : Aa(this._a);
            return this.isValid() && q(this._a, a.toArray()) > 0
        }
        return !1
    }

    function Sa() {
        return !this._isUTC
    }

    function Ta() {
        return this._isUTC
    }

    function Ua() {
        return this._isUTC && 0 === this._offset
    }

    function Va(a, b) {
        var c, d, e, g = a,
            h = null;
        return Fa(a) ? g = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = ud.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
            y: 0,
            d: p(h[dd]) * c,
            h: p(h[ed]) * c,
            m: p(h[fd]) * c,
            s: p(h[gd]) * c,
            ms: p(h[hd]) * c
        }) : (h = vd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
            y: Wa(h[2], c),
            M: Wa(h[3], c),
            d: Wa(h[4], c),
            h: Wa(h[5], c),
            m: Wa(h[6], c),
            s: Wa(h[7], c),
            w: Wa(h[8], c)
        }) : null == g ? g = {} : "object" == typeof g && ("from" in g || "to" in g) && (e = Ya(Aa(g.from), Aa(g.to)), g = {}, g.ms = e.milliseconds, g.M = e.months), d = new Ea(g), Fa(a) && f(a, "_locale") && (d._locale = a._locale), d
    }

    function Wa(a, b) {
        var c = a && parseFloat(a.replace(",", "."));
        return (isNaN(c) ? 0 : c) * b
    }

    function Xa(a, b) {
        var c = {
            milliseconds: 0,
            months: 0
        };
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
    }

    function Ya(a, b) {
        var c;
        return b = Ia(b, a), a.isBefore(b) ? c = Xa(a, b) : (c = Xa(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c
    }

    function Za(a, b) {
        return function(c, d) {
            var e, f;
            return null === d || isNaN(+d) || (_(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = Va(c, d), $a(this, e, a), this
        }
    }

    function $a(b, c, d, e) {
        var f = c._milliseconds,
            g = c._days,
            h = c._months;
        e = null == e ? !0 : e, f && b._d.setTime(+b._d + f * d), g && D(b, "Date", C(b, "Date") + g * d), h && V(b, C(b, "Month") + h * d), e && a.updateOffset(b, g || h)
    }

    function _a(a) {
        var b = a || Aa(),
            c = Ia(b, this).startOf("day"),
            d = this.diff(c, "days", !0),
            e = -6 > d ? "sameElse" : -1 > d ? "lastWeek" : 0 > d ? "lastDay" : 1 > d ? "sameDay" : 2 > d ? "nextDay" : 7 > d ? "nextWeek" : "sameElse";
        return this.format(this.localeData().calendar(e, this, Aa(b)))
    }

    function ab() {
        return new n(this)
    }

    function bb(a, b) {
        var c;
        return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Aa(a), +this > +a) : (c = o(a) ? +a : +Aa(a), c < +this.clone().startOf(b))
    }

    function cb(a, b) {
        var c;
        return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Aa(a), +a > +this) : (c = o(a) ? +a : +Aa(a), +this.clone().endOf(b) < c)
    }

    function db(a, b, c) {
        return this.isAfter(a, c) && this.isBefore(b, c)
    }

    function eb(a, b) {
        var c;
        return b = z(b || "millisecond"), "millisecond" === b ? (a = o(a) ? a : Aa(a), +this === +a) : (c = +Aa(a), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))
    }

    function fb(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function gb(a, b, c) {
        var d, e, f = Ia(a, this),
            g = 6e4 * (f.utcOffset() - this.utcOffset());
        return b = z(b), "year" === b || "month" === b || "quarter" === b ? (e = hb(this, f), "quarter" === b ? e /= 3 : "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : fb(e)
    }

    function hb(a, b) {
        var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
            f = a.clone().add(e, "months");
        return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d)
    }

    function ib() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }

    function jb() {
        var a = this.clone().utc();
        return 0 < a.year() && a.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : J(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : J(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }

    function kb(b) {
        var c = J(this, b || a.defaultFormat);
        return this.localeData().postformat(c)
    }

    function lb(a, b) {
        return this.isValid() ? Va({
            to: this,
            from: a
        }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
    }

    function mb(a) {
        return this.from(Aa(), a)
    }

    function nb(a, b) {
        return this.isValid() ? Va({
            from: this,
            to: a
        }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
    }

    function ob(a) {
        return this.to(Aa(), a)
    }

    function pb(a) {
        var b;
        return void 0 === a ? this._locale._abbr : (b = x(a), null != b && (this._locale = b), this)
    }

    function qb() {
        return this._locale
    }

    function rb(a) {
        switch (a = z(a)) {
            case "year":
                this.month(0);
            case "quarter":
            case "month":
                this.date(1);
            case "week":
            case "isoWeek":
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
        }
        return "week" === a && this.weekday(0), "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
    }

    function sb(a) {
        return a = z(a), void 0 === a || "millisecond" === a ? this : this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
    }

    function tb() {
        return +this._d - 6e4 * (this._offset || 0)
    }

    function ub() {
        return Math.floor(+this / 1e3)
    }

    function vb() {
        return this._offset ? new Date(+this) : this._d
    }

    function wb() {
        var a = this;
        return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()]
    }

    function xb() {
        return k(this)
    }

    function yb() {
        return g({}, j(this))
    }

    function zb() {
        return j(this).overflow
    }

    function Ab(a, b) {
        G(0, [a, a.length], 0, b)
    }

    function Bb(a, b, c) {
        return ha(Aa([a, 11, 31 + b - c]), b, c).week
    }

    function Cb(a) {
        var b = ha(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return null == a ? b : this.add(a - b, "y")
    }

    function Db(a) {
        var b = ha(this, 1, 4).year;
        return null == a ? b : this.add(a - b, "y")
    }

    function Eb() {
        return Bb(this.year(), 1, 4)
    }

    function Fb() {
        var a = this.localeData()._week;
        return Bb(this.year(), a.dow, a.doy)
    }

    function Gb(a) {
        return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
    }

    function Hb(a, b) {
        if ("string" == typeof a)
            if (isNaN(a)) {
                if (a = b.weekdaysParse(a), "number" != typeof a) return null
            } else a = parseInt(a, 10);
        return a
    }

    function Ib(a) {
        return this._weekdays[a.day()]
    }

    function Jb(a) {
        return this._weekdaysShort[a.day()]
    }

    function Kb(a) {
        return this._weekdaysMin[a.day()]
    }

    function Lb(a) {
        var b, c, d;
        for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)
            if (this._weekdaysParse[b] || (c = Aa([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a)) return b
    }

    function Mb(a) {
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != a ? (a = Hb(a, this.localeData()), this.add(a - b, "d")) : b
    }

    function Nb(a) {
        var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == a ? b : this.add(a - b, "d")
    }

    function Ob(a) {
        return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
    }

    function Pb(a, b) {
        G(a, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), b)
        })
    }

    function Qb(a, b) {
        return b._meridiemParse
    }

    function Rb(a) {
        return "p" === (a + "").toLowerCase().charAt(0)
    }

    function Sb(a, b, c) {
        return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
    }

    function Tb(a) {
        G(0, [a, 3], 0, "millisecond")
    }

    function Ub() {
        return this._isUTC ? "UTC" : ""
    }

    function Vb() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }

    function Wb(a) {
        return Aa(1e3 * a)
    }

    function Xb() {
        return Aa.apply(null, arguments).parseZone()
    }

    function Yb(a, b, c) {
        var d = this._calendar[a];
        return "function" == typeof d ? d.call(b, c) : d
    }

    function Zb(a) {
        var b = this._longDateFormat[a];
        return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
            return a.slice(1)
        }), this._longDateFormat[a] = b), b
    }

    function $b() {
        return this._invalidDate
    }

    function _b(a) {
        return this._ordinal.replace("%d", a)
    }

    function ac(a) {
        return a
    }

    function bc(a, b, c, d) {
        var e = this._relativeTime[c];
        return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
    }

    function cc(a, b) {
        var c = this._relativeTime[a > 0 ? "future" : "past"];
        return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
    }

    function dc(a) {
        var b, c;
        for (c in a) b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b;
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
    }

    function ec(a, b, c, d) {
        var e = x(),
            f = h().set(d, b);
        return e[c](f, a)
    }

    function fc(a, b, c, d, e) {
        if ("number" == typeof a && (b = a, a = void 0), a = a || "", null != b) return ec(a, b, c, e);
        var f, g = [];
        for (f = 0; d > f; f++) g[f] = ec(a, f, c, e);
        return g
    }

    function gc(a, b) {
        return fc(a, b, "months", 12, "month")
    }

    function hc(a, b) {
        return fc(a, b, "monthsShort", 12, "month")
    }

    function ic(a, b) {
        return fc(a, b, "weekdays", 7, "day")
    }

    function jc(a, b) {
        return fc(a, b, "weekdaysShort", 7, "day")
    }

    function kc(a, b) {
        return fc(a, b, "weekdaysMin", 7, "day")
    }

    function lc() {
        var a = this._data;
        return this._milliseconds = Rd(this._milliseconds), this._days = Rd(this._days), this._months = Rd(this._months), a.milliseconds = Rd(a.milliseconds), a.seconds = Rd(a.seconds), a.minutes = Rd(a.minutes), a.hours = Rd(a.hours), a.months = Rd(a.months), a.years = Rd(a.years), this
    }

    function mc(a, b, c, d) {
        var e = Va(b, c);
        return a._milliseconds += d * e._milliseconds, a._days += d * e._days, a._months += d * e._months, a._bubble()
    }

    function nc(a, b) {
        return mc(this, a, b, 1)
    }

    function oc(a, b) {
        return mc(this, a, b, -1)
    }

    function pc() {
        var a, b, c, d = this._milliseconds,
            e = this._days,
            f = this._months,
            g = this._data,
            h = 0;
        return g.milliseconds = d % 1e3, a = fb(d / 1e3), g.seconds = a % 60, b = fb(a / 60), g.minutes = b % 60, c = fb(b / 60), g.hours = c % 24, e += fb(c / 24), h = fb(qc(e)), e -= fb(rc(h)), f += fb(e / 30), e %= 30, h += fb(f / 12), f %= 12, g.days = e, g.months = f, g.years = h, this
    }

    function qc(a) {
        return 400 * a / 146097
    }

    function rc(a) {
        return 146097 * a / 400
    }

    function sc(a) {
        var b, c, d = this._milliseconds;
        if (a = z(a), "month" === a || "year" === a) return b = this._days + d / 864e5, c = this._months + 12 * qc(b), "month" === a ? c : c / 12;
        switch (b = this._days + Math.round(rc(this._months / 12)), a) {
            case "week":
                return b / 7 + d / 6048e5;
            case "day":
                return b + d / 864e5;
            case "hour":
                return 24 * b + d / 36e5;
            case "minute":
                return 1440 * b + d / 6e4;
            case "second":
                return 86400 * b + d / 1e3;
            case "millisecond":
                return Math.floor(864e5 * b) + d;
            default:
                throw new Error("Unknown unit " + a)
        }
    }

    function tc() {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * p(this._months / 12)
    }

    function uc(a) {
        return function() {
            return this.as(a)
        }
    }

    function vc(a) {
        return a = z(a), this[a + "s"]()
    }

    function wc(a) {
        return function() {
            return this._data[a]
        }
    }

    function xc() {
        return fb(this.days() / 7)
    }

    function yc(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }

    function zc(a, b, c) {
        var d = Va(a).abs(),
            e = fe(d.as("s")),
            f = fe(d.as("m")),
            g = fe(d.as("h")),
            h = fe(d.as("d")),
            i = fe(d.as("M")),
            j = fe(d.as("y")),
            k = e < ge.s && ["s", e] || 1 === f && ["m"] || f < ge.m && ["mm", f] || 1 === g && ["h"] || g < ge.h && ["hh", g] || 1 === h && ["d"] || h < ge.d && ["dd", h] || 1 === i && ["M"] || i < ge.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
        return k[2] = b, k[3] = +a > 0, k[4] = c, yc.apply(null, k)
    }

    function Ac(a, b) {
        return void 0 === ge[a] ? !1 : void 0 === b ? ge[a] : (ge[a] = b, !0)
    }

    function Bc(a) {
        var b = this.localeData(),
            c = zc(this, !a, b);
        return a && (c = b.pastFuture(+this, c)), b.postformat(c)
    }

    function Cc() {
        var a = he(this.years()),
            b = he(this.months()),
            c = he(this.days()),
            d = he(this.hours()),
            e = he(this.minutes()),
            f = he(this.seconds() + this.milliseconds() / 1e3),
            g = this.asSeconds();
        return g ? (0 > g ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
    }
    var Dc, Ec, Fc = a.momentProperties = [],
        Gc = !1,
        Hc = {},
        Ic = {},
        Jc = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        Kc = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        Lc = {},
        Mc = {},
        Nc = /\d/,
        Oc = /\d\d/,
        Pc = /\d{3}/,
        Qc = /\d{4}/,
        Rc = /[+-]?\d{6}/,
        Sc = /\d\d?/,
        Tc = /\d{1,3}/,
        Uc = /\d{1,4}/,
        Vc = /[+-]?\d{1,6}/,
        Wc = /\d+/,
        Xc = /[+-]?\d+/,
        Yc = /Z|[+-]\d\d:?\d\d/gi,
        Zc = /[+-]?\d+(\.\d{1,3})?/,
        $c = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
        _c = {},
        ad = {},
        bd = 0,
        cd = 1,
        dd = 2,
        ed = 3,
        fd = 4,
        gd = 5,
        hd = 6;
    G("M", ["MM", 2], "Mo", function() {
        return this.month() + 1
    }), G("MMM", 0, 0, function(a) {
        return this.localeData().monthsShort(this, a)
    }), G("MMMM", 0, 0, function(a) {
        return this.localeData().months(this, a)
    }), y("month", "M"), L("M", Sc), L("MM", Sc, Oc), L("MMM", $c), L("MMMM", $c), O(["M", "MM"], function(a, b) {
        b[cd] = p(a) - 1
    }), O(["MMM", "MMMM"], function(a, b, c, d) {
        var e = c._locale.monthsParse(a, d, c._strict);
        null != e ? b[cd] = e : j(c).invalidMonth = a
    });
    var id = "Januar_Februar_Mart_April_Maj_Jun_Jul_Avgust_Septembar_Oktobar_Novembar_Decembar".split("_"),
        jd = "Jan_Feb_Mar_Apr_Maj_Jun_Jul_Avg_Sep_Okt_Nov_Dec".split("_"),
        kd = {};
    a.suppressDeprecationWarnings = !1;
    var ld = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        md = [
            ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
            ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
            ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
            ["GGGG-[W]WW", /\d{4}-W\d{2}/],
            ["YYYY-DDD", /\d{4}-\d{3}/]
        ],
        nd = [
            ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/],
            ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
            ["HH:mm", /(T| )\d\d:\d\d/],
            ["HH", /(T| )\d\d/]
        ],
        od = /^\/?Date\((\-?\d+)/i;
    a.createFromInputFallback = $("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""))
    }), G(0, ["YY", 2], 0, function() {
        return this.year() % 100
    }), G(0, ["YYYY", 4], 0, "year"), G(0, ["YYYYY", 5], 0, "year"), G(0, ["YYYYYY", 6, !0], 0, "year"), y("year", "y"), L("Y", Xc), L("YY", Sc, Oc), L("YYYY", Uc, Qc), L("YYYYY", Vc, Rc), L("YYYYYY", Vc, Rc), O(["YYYY", "YYYYY", "YYYYYY"], bd), O("YY", function(b, c) {
        c[bd] = a.parseTwoDigitYear(b)
    }), a.parseTwoDigitYear = function(a) {
        return p(a) + (p(a) > 68 ? 1900 : 2e3)
    };
    var pd = B("FullYear", !1);
    G("w", ["ww", 2], "wo", "week"), G("W", ["WW", 2], "Wo", "isoWeek"), y("week", "w"), y("isoWeek", "W"), L("w", Sc), L("ww", Sc, Oc), L("W", Sc), L("WW", Sc, Oc), P(["w", "ww", "W", "WW"], function(a, b, c, d) {
        b[d.substr(0, 1)] = p(a)
    });
    var qd = {
        dow: 0,
        doy: 6
    };
    G("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), y("dayOfYear", "DDD"), L("DDD", Tc), L("DDDD", Pc), O(["DDD", "DDDD"], function(a, b, c) {
        c._dayOfYear = p(a)
    }), a.ISO_8601 = function() {};
    var rd = $("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function() {
            var a = Aa.apply(null, arguments);
            return this > a ? this : a
        }),
        sd = $("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function() {
            var a = Aa.apply(null, arguments);
            return a > this ? this : a
        });
    Ga("Z", ":"), Ga("ZZ", ""), L("Z", Yc), L("ZZ", Yc), O(["Z", "ZZ"], function(a, b, c) {
        c._useUTC = !0, c._tzm = Ha(a)
    });
    var td = /([\+\-]|\d\d)/gi;
    a.updateOffset = function() {};
    var ud = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
        vd = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
    Va.fn = Ea.prototype;
    var wd = Za(1, "add"),
        xd = Za(-1, "subtract");
    a.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    var yd = $("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(a) {
        return void 0 === a ? this.localeData() : this.locale(a)
    });
    G(0, ["gg", 2], 0, function() {
        return this.weekYear() % 100
    }), G(0, ["GG", 2], 0, function() {
        return this.isoWeekYear() % 100
    }), Ab("gggg", "weekYear"), Ab("ggggg", "weekYear"), Ab("GGGG", "isoWeekYear"), Ab("GGGGG", "isoWeekYear"), y("weekYear", "gg"), y("isoWeekYear", "GG"), L("G", Xc), L("g", Xc), L("GG", Sc, Oc), L("gg", Sc, Oc), L("GGGG", Uc, Qc), L("gggg", Uc, Qc), L("GGGGG", Vc, Rc), L("ggggg", Vc, Rc), P(["gggg", "ggggg", "GGGG", "GGGGG"], function(a, b, c, d) {
        b[d.substr(0, 2)] = p(a)
    }), P(["gg", "GG"], function(b, c, d, e) {
        c[e] = a.parseTwoDigitYear(b)
    }), G("Q", 0, 0, "quarter"), y("quarter", "Q"), L("Q", Nc), O("Q", function(a, b) {
        b[cd] = 3 * (p(a) - 1)
    }), G("D", ["DD", 2], "Do", "date"), y("date", "D"), L("D", Sc), L("DD", Sc, Oc), L("Do", function(a, b) {
        return a ? b._ordinalParse : b._ordinalParseLenient
    }), O(["D", "DD"], dd), O("Do", function(a, b) {
        b[dd] = p(a.match(Sc)[0], 10)
    });
    var zd = B("Date", !0);
    G("d", 0, "do", "day"), G("dd", 0, 0, function(a) {
        return this.localeData().weekdaysMin(this, a)
    }), G("ddd", 0, 0, function(a) {
        return this.localeData().weekdaysShort(this, a)
    }), G("dddd", 0, 0, function(a) {
        return this.localeData().weekdays(this, a)
    }), G("e", 0, 0, "weekday"), G("E", 0, 0, "isoWeekday"), y("day", "d"), y("weekday", "e"), y("isoWeekday", "E"), L("d", Sc), L("e", Sc), L("E", Sc), L("dd", $c), L("ddd", $c), L("dddd", $c), P(["dd", "ddd", "dddd"], function(a, b, c) {
        var d = c._locale.weekdaysParse(a);
        null != d ? b.d = d : j(c).invalidWeekday = a
    }), P(["d", "e", "E"], function(a, b, c, d) {
        b[d] = p(a)
    });
    var Ad = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        Bd = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        Cd = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    G("H", ["HH", 2], 0, "hour"), G("h", ["hh", 2], 0, function() {
        return this.hours() % 12 || 12
    }), Pb("a", !0), Pb("A", !1), y("hour", "h"), L("a", Qb), L("A", Qb), L("H", Sc), L("h", Sc), L("HH", Sc, Oc), L("hh", Sc, Oc), O(["H", "HH"], ed), O(["a", "A"], function(a, b, c) {
        c._isPm = c._locale.isPM(a), c._meridiem = a
    }), O(["h", "hh"], function(a, b, c) {
        b[ed] = p(a), j(c).bigHour = !0
    });
    var Dd = /[ap]\.?m?\.?/i,
        Ed = B("Hours", !0);
    G("m", ["mm", 2], 0, "minute"), y("minute", "m"), L("m", Sc), L("mm", Sc, Oc), O(["m", "mm"], fd);
    var Fd = B("Minutes", !1);
    G("s", ["ss", 2], 0, "second"), y("second", "s"), L("s", Sc), L("ss", Sc, Oc), O(["s", "ss"], gd);
    var Gd = B("Seconds", !1);
    G("S", 0, 0, function() {
        return ~~(this.millisecond() / 100)
    }), G(0, ["SS", 2], 0, function() {
        return ~~(this.millisecond() / 10)
    }), Tb("SSS"), Tb("SSSS"), y("millisecond", "ms"), L("S", Tc, Nc), L("SS", Tc, Oc), L("SSS", Tc, Pc), L("SSSS", Wc), O(["S", "SS", "SSS", "SSSS"], function(a, b) {
        b[hd] = p(1e3 * ("0." + a))
    });
    var Hd = B("Milliseconds", !1);
    G("z", 0, 0, "zoneAbbr"), G("zz", 0, 0, "zoneName");
    var Id = n.prototype;
    Id.add = wd, Id.calendar = _a, Id.clone = ab, Id.diff = gb, Id.endOf = sb, Id.format = kb, Id.from = lb, Id.fromNow = mb, Id.to = nb, Id.toNow = ob, Id.get = E, Id.invalidAt = zb, Id.isAfter = bb, Id.isBefore = cb, Id.isBetween = db, Id.isSame = eb, Id.isValid = xb, Id.lang = yd, Id.locale = pb, Id.localeData = qb, Id.max = sd, Id.min = rd, Id.parsingFlags = yb, Id.set = E, Id.startOf = rb, Id.subtract = xd, Id.toArray = wb, Id.toDate = vb, Id.toISOString = jb, Id.toJSON = jb, Id.toString = ib, Id.unix = ub, Id.valueOf = tb, Id.year = pd, Id.isLeapYear = ga, Id.weekYear = Cb, Id.isoWeekYear = Db, Id.quarter = Id.quarters = Gb, Id.month = W, Id.daysInMonth = X, Id.week = Id.weeks = la, Id.isoWeek = Id.isoWeeks = ma, Id.weeksInYear = Fb, Id.isoWeeksInYear = Eb, Id.date = zd, Id.day = Id.days = Mb, Id.weekday = Nb, Id.isoWeekday = Ob, Id.dayOfYear = oa, Id.hour = Id.hours = Ed, Id.minute = Id.minutes = Fd, Id.second = Id.seconds = Gd, Id.millisecond = Id.milliseconds = Hd, Id.utcOffset = Ka, Id.utc = Ma, Id.local = Na, Id.parseZone = Oa, Id.hasAlignedHourOffset = Pa, Id.isDST = Qa, Id.isDSTShifted = Ra, Id.isLocal = Sa, Id.isUtcOffset = Ta, Id.isUtc = Ua, Id.isUTC = Ua, Id.zoneAbbr = Ub, Id.zoneName = Vb, Id.dates = $("dates accessor is deprecated. Use date instead.", zd), Id.months = $("months accessor is deprecated. Use month instead", W), Id.years = $("years accessor is deprecated. Use year instead", pd), Id.zone = $("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", La);
    var Jd = Id,
        Kd = {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        Ld = {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY LT",
            LLLL: "dddd, MMMM D, YYYY LT"
        },
        Md = "Datum odjave",
        Nd = "%d",
        Od = /\d{1,2}/,
        Pd = {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        Qd = r.prototype;
    Qd._calendar = Kd, Qd.calendar = Yb, Qd._longDateFormat = Ld, Qd.longDateFormat = Zb, Qd._invalidDate = Md, Qd.invalidDate = $b, Qd._ordinal = Nd, Qd.ordinal = _b, Qd._ordinalParse = Od, Qd.preparse = ac, Qd.postformat = ac, Qd._relativeTime = Pd, Qd.relativeTime = bc, Qd.pastFuture = cc, Qd.set = dc, Qd.months = S, Qd._months = id, Qd.monthsShort = T, Qd._monthsShort = jd, Qd.monthsParse = U, Qd.week = ia, Qd._week = qd, Qd.firstDayOfYear = ka, Qd.firstDayOfWeek = ja, Qd.weekdays = Ib, Qd._weekdays = Ad, Qd.weekdaysMin = Kb, Qd._weekdaysMin = Cd, Qd.weekdaysShort = Jb, Qd._weekdaysShort = Bd, Qd.weekdaysParse = Lb, Qd.isPM = Rb, Qd._meridiemParse = Dd, Qd.meridiem = Sb, v("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(a) {
            var b = a % 10,
                c = 1 === p(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), a.lang = $("moment.lang is deprecated. Use moment.locale instead.", v), a.langData = $("moment.langData is deprecated. Use moment.localeData instead.", x);
    var Rd = Math.abs,
        Sd = uc("ms"),
        Td = uc("s"),
        Ud = uc("m"),
        Vd = uc("h"),
        Wd = uc("d"),
        Xd = uc("w"),
        Yd = uc("M"),
        Zd = uc("y"),
        $d = wc("milliseconds"),
        _d = wc("seconds"),
        ae = wc("minutes"),
        be = wc("hours"),
        ce = wc("days"),
        de = wc("months"),
        ee = wc("years"),
        fe = Math.round,
        ge = {
            s: 45,
            m: 45,
            h: 22,
            d: 26,
            M: 11
        },
        he = Math.abs,
        ie = Ea.prototype;
    ie.abs = lc, ie.add = nc, ie.subtract = oc, ie.as = sc, ie.asMilliseconds = Sd, ie.asSeconds = Td, ie.asMinutes = Ud, ie.asHours = Vd, ie.asDays = Wd, ie.asWeeks = Xd, ie.asMonths = Yd, ie.asYears = Zd, ie.valueOf = tc, ie._bubble = pc, ie.get = vc, ie.milliseconds = $d, ie.seconds = _d, ie.minutes = ae, ie.hours = be, ie.days = ce, ie.weeks = xc, ie.months = de, ie.years = ee, ie.humanize = Bc, ie.toISOString = Cc, ie.toString = Cc, ie.toJSON = Cc, ie.locale = pb, ie.localeData = qb, ie.toIsoString = $("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Cc), ie.lang = yd, G("X", 0, 0, "unix"), G("x", 0, 0, "valueOf"), L("x", Xc), L("X", Zc), O("X", function(a, b, c) {
        c._d = new Date(1e3 * parseFloat(a, 10))
    }), O("x", function(a, b, c) {
        c._d = new Date(p(a))
    }), a.version = "2.10.3", b(Aa), a.fn = Jd, a.min = Ca, a.max = Da, a.utc = h, a.unix = Wb, a.months = gc, a.isDate = d, a.locale = v, a.invalid = l, a.duration = Va, a.isMoment = o, a.weekdays = ic, a.parseZone = Xb, a.localeData = x, a.isDuration = Fa, a.monthsShort = hc, a.weekdaysMin = kc, a.defineLocale = w, a.weekdaysShort = jc, a.normalizeUnits = z, a.relativeTimeThreshold = Ac;
    var je = a;
    return je
});