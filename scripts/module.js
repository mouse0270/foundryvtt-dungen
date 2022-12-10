class MODULE {
	static ID = 'foundryvtt-dungen';

	static OPTIONS = {
		background: '#7030A0',
		color: '#fff',
		LOG_LEVEL: [
			{ title: 'OFF', background: '#000', color: '#fff' },
			{ title: "ERROR", background: '#F93154', color: '#fff' },
			{ title: "WARN", background: '#FFA900', color: '#fff' },
			{ title: "DEBUG", background: '#B23CFD', color: '#fff' },
			{ title: "INFO", background: '#39C0ED', color: '#fff' },
			{ title: "LOG", background: '#39C0ED', color: '#fff' }
		]
	}

	static get TITLE() {
		return this.localize('title');
	}

	static get API() {
		return 'https://ttrpg.ink/api'
	}

	static localize(stringId, data = {}) {
		return foundry.utils.isEmpty(data.hash ?? {}) ? game.i18n.localize(`${this.ID}.${stringId}`) : game.i18n.format(`${this.ID}.${stringId}`, data);
	}

	static CONSOLE = (LOG_LEVEL, ...args) => {
		try {
			if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID, 'level') >= LOG_LEVEL) {
				console.log(
					`%c${this.TITLE}%c${this.OPTIONS.LOG_LEVEL[LOG_LEVEL].title}`
					, `background-color: ${this.OPTIONS.background}; border-radius: 2px; color: ${this.OPTIONS.color}; padding: 0.15rem 0.25rem;`
					, `background-color: ${this.OPTIONS.LOG_LEVEL[LOG_LEVEL].background}; border-radius: 2px; color: ${this.OPTIONS.LOG_LEVEL[LOG_LEVEL].color}; padding: 0.15rem 0.25rem; margin-left: 0.25rem;${LOG_LEVEL >= 4 ? 'display:none' : ''}`
					, ...args
				);
			}
		}catch (event) {
			console.warn(`${this.TITLE} debug logging failed`, event);
		}
	}

	static log = (...args) => { this.CONSOLE(5, ...args); }
	static info = (...args) => { this.CONSOLE(4, ...args); }
	static debug = (...args) => { this.CONSOLE(3, ...args); }
	static warn = (...args) => { this.CONSOLE(2, ...args); }
	static error = (...args) => { this.CONSOLE(1, ...args); }

	static setting = (...args) => {		
		// Are we registering a new setting
		if (args[0].toLowerCase() == 'register') {
			// Register New Setting
			let setting = args[1]; // This is the name of the setting
			let value = args[2]; // This is the settings of the setting
			let settingDefaults = {
				name: this.localize(`settings.${setting}.name`),
				hint: this.localize(`settings.${setting}.hint`),
				scope: 'client',
				config: true
			};
			let newSetting = foundry.utils.mergeObject(settingDefaults, value, { inplace: false });
			game.settings.register(this.ID, setting, newSetting);

			return newSetting;
		} else {
			let setting = args[0];
			// If only one value is passed in, get setting
			if (typeof args[1] == 'undefined') {
				try {
					return game.settings.get(this.ID, setting);
				}catch{
					MODULE.error(`${setting} is not a registered game setting`);
					return undefined;
				}
			} else { 
				// If two values are passed in, then set setting
				return game.settings.set(this.ID, setting, args[1]);
			}
		}
	}
}var tt = Object.defineProperty;var nt = (e, t, n) => t in e ? tt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;var $$1 = (e, t, n) => (nt(e, typeof t != "symbol" ? t + "" : t, n), n);function st(e, t) {const n = Object.create(null),s = e.split(",");for (let r = 0; r < s.length; r++) n[s[r]] = !0;return t ? r => !!n[r.toLowerCase()] : r => !!n[r];}function de(e) {if (y(e)) {const t = {};for (let n = 0; n < e.length; n++) {const s = e[n],r = N(s) ? it(s) : de(s);if (r) for (const i in r) t[i] = r[i];}return t;} else {if (N(e)) return e;if (S(e)) return e;}}const rt = /;(?![^(]*\))/g,ot = /:(.+)/;function it(e) {const t = {};return e.split(rt).forEach(n => {if (n) {const s = n.split(ot);s.length > 1 && (t[s[0].trim()] = s[1].trim());}}), t;}function me(e) {let t = "";if (N(e)) t = e;else if (y(e)) for (let n = 0; n < e.length; n++) {const s = me(e[n]);s && (t += s + " ");} else if (S(e)) for (const n in e) e[n] && (t += n + " ");return t.trim();}function ct(e, t) {if (e.length !== t.length) return !1;let n = !0;for (let s = 0; n && s < e.length; s++) n = I(e[s], t[s]);return n;}function I(e, t) {if (e === t) return !0;let n = ge(e),s = ge(t);if (n || s) return n && s ? e.getTime() === t.getTime() : !1;if (n = y(e), s = y(t), n || s) return n && s ? ct(e, t) : !1;if (n = S(e), s = S(t), n || s) {if (!n || !s) return !1;const r = Object.keys(e).length,i = Object.keys(t).length;if (r !== i) return !1;for (const c in e) {const o = e.hasOwnProperty(c),l = t.hasOwnProperty(c);if (o && !l || !o && l || !I(e[c], t[c])) return !1;}}return String(e) === String(t);}function G(e, t) {return e.findIndex(n => I(n, t));}const lt = Object.assign,ft = (e, t) => {const n = e.indexOf(t);n > -1 && e.splice(n, 1);},at = Object.prototype.hasOwnProperty,U = (e, t) => at.call(e, t),y = Array.isArray,Y = e => ye(e) === "[object Map]",ge = e => e instanceof Date,N = e => typeof e == "string",Q = e => typeof e == "symbol",S = e => e !== null && typeof e == "object",ut = Object.prototype.toString,ye = e => ut.call(e),pt = e => ye(e).slice(8, -1),X = e => N(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,be = e => {const t = Object.create(null);return n => t[n] || (t[n] = e(n));},ht = /-(\w)/g,dt = be(e => e.replace(ht, (t, n) => n ? n.toUpperCase() : "")),mt = /\B([A-Z])/g,xe = be(e => e.replace(mt, "-$1").toLowerCase()),gt = (e, t) => !Object.is(e, t),ve = e => {const t = parseFloat(e);return isNaN(t) ? e : t;};let yt;function we(e, t) {t = t || yt, t && t.active && t.effects.push(e);}const _e = e => {const t = new Set(e);return t.w = 0, t.n = 0, t;},Ee = e => (e.w & O) > 0,$e = e => (e.n & O) > 0,bt = ({ deps: e }) => {if (e.length) for (let t = 0; t < e.length; t++) e[t].w |= O;},xt = e => {const { deps: t } = e;if (t.length) {let n = 0;for (let s = 0; s < t.length; s++) {const r = t[s];Ee(r) && !$e(r) ? r.delete(e) : t[n++] = r, r.w &= ~O, r.n &= ~O;}t.length = n;}},ee = new WeakMap();let B = 0,O = 1;const te = 30,z = [];let C;const W = Symbol(""),Se = Symbol("");class vt {constructor(t, n = null, s) {this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], we(this, s);}run() {if (!this.active) return this.fn();if (!z.includes(this)) try {return z.push(C = this), $t(), O = 1 << ++B, B <= te ? bt(this) : Oe(this), this.fn();} finally {B <= te && xt(this), O = 1 << --B, ke(), z.pop();const t = z.length;C = t > 0 ? z[t - 1] : void 0;}}stop() {this.active && (Oe(this), this.onStop && this.onStop(), this.active = !1);}}function Oe(e) {const { deps: t } = e;if (t.length) {for (let n = 0; n < t.length; n++) t[n].delete(e);t.length = 0;}}function wt(e, t) {e.effect && (e = e.effect.fn);const n = new vt(e);t && (lt(n, t), t.scope && we(n, t.scope)), (!t || !t.lazy) && n.run();const s = n.run.bind(n);return s.effect = n, s;}function _t(e) {e.effect.stop();}let K = !0;const ne = [];function Et() {ne.push(K), K = !1;}function $t() {ne.push(K), K = !0;}function ke() {const e = ne.pop();K = e === void 0 ? !0 : e;}function F(e, t, n) {if (!St()) return;let s = ee.get(e);s || ee.set(e, s = new Map());let r = s.get(n);r || s.set(n, r = _e()), Ot(r);}function St() {return K && C !== void 0;}function Ot(e, t) {let n = !1;B <= te ? $e(e) || (e.n |= O, n = !Ee(e)) : n = !e.has(C), n && (e.add(C), C.deps.push(e));}function se(e, t, n, s, r, i) {const c = ee.get(e);if (!c) return;let o = [];if (t === "clear") o = [...c.values()];else if (n === "length" && y(e)) c.forEach((l, f) => {(f === "length" || f >= s) && o.push(l);});else switch (n !== void 0 && o.push(c.get(n)), t) {case "add":y(e) ? X(n) && o.push(c.get("length")) : (o.push(c.get(W)), Y(e) && o.push(c.get(Se)));break;case "delete":y(e) || (o.push(c.get(W)), Y(e) && o.push(c.get(Se)));break;case "set":Y(e) && o.push(c.get(W));break;}if (o.length === 1) o[0] && Te(o[0]);else {const l = [];for (const f of o) f && l.push(...f);Te(_e(l));}}function Te(e, t) {for (const n of y(e) ? e : [...e]) (n !== C || n.allowRecurse) && (n.scheduler ? n.scheduler() : n.run());}const kt = st("__proto__,__v_isRef,__isVue"),Ae = new Set(Object.getOwnPropertyNames(Symbol).map(e => Symbol[e]).filter(Q)),Tt = Me(),At = Me(!0),Re = Rt();function Rt() {const e = {};return ["includes", "indexOf", "lastIndexOf"].forEach(t => {e[t] = function (...n) {const s = j(this);for (let i = 0, c = this.length; i < c; i++) F(s, "get", i + "");const r = s[t](...n);return r === -1 || r === !1 ? s[t](...n.map(j)) : r;};}), ["push", "pop", "shift", "unshift", "splice"].forEach(t => {e[t] = function (...n) {Et();const s = j(this)[t].apply(this, n);return ke(), s;};}), e;}function Me(e = !1, t = !1) {return function (s, r, i) {if (r === "__v_isReactive") return !e;if (r === "__v_isReadonly") return e;if (r === "__v_raw" && i === (e ? t ? zt : je : t ? Bt : Ce).get(s)) return s;const c = y(s);if (!e && c && U(Re, r)) return Reflect.get(Re, r, i);const o = Reflect.get(s, r, i);return (Q(r) ? Ae.has(r) : kt(r)) || (e || F(s, "get", r), t) ? o : re(o) ? !c || !X(r) ? o.value : o : S(o) ? e ? Ht(o) : D(o) : o;};}const Mt = Ct();function Ct(e = !1) {return function (n, s, r, i) {let c = n[s];if (!e && !Lt(r) && (r = j(r), c = j(c), !y(n) && re(c) && !re(r))) return c.value = r, !0;const o = y(n) && X(s) ? Number(s) < n.length : U(n, s),l = Reflect.set(n, s, r, i);return n === j(i) && (o ? gt(r, c) && se(n, "set", s, r) : se(n, "add", s, r)), l;};}function jt(e, t) {const n = U(e, t);e[t];const s = Reflect.deleteProperty(e, t);return s && n && se(e, "delete", t, void 0), s;}function Pt(e, t) {const n = Reflect.has(e, t);return (!Q(t) || !Ae.has(t)) && F(e, "has", t), n;}function It(e) {return F(e, "iterate", y(e) ? "length" : W), Reflect.ownKeys(e);}const Nt = { get: Tt, set: Mt, deleteProperty: jt, has: Pt, ownKeys: It },Kt = { get: At, set(e, t) {return !0;}, deleteProperty(e, t) {return !0;} },Ce = new WeakMap(),Bt = new WeakMap(),je = new WeakMap(),zt = new WeakMap();function Dt(e) {switch (e) {case "Object":case "Array":return 1;case "Map":case "Set":case "WeakMap":case "WeakSet":return 2;default:return 0;}}function Vt(e) {return e.__v_skip || !Object.isExtensible(e) ? 0 : Dt(pt(e));}function D(e) {return e && e.__v_isReadonly ? e : Pe(e, !1, Nt, null, Ce);}function Ht(e) {return Pe(e, !0, Kt, null, je);}function Pe(e, t, n, s, r) {if (!S(e) || e.__v_raw && !(t && e.__v_isReactive)) return e;const i = r.get(e);if (i) return i;const c = Vt(e);if (c === 0) return e;const o = new Proxy(e, c === 2 ? s : n);return r.set(e, o), o;}function Lt(e) {return !!(e && e.__v_isReadonly);}function j(e) {const t = e && e.__v_raw;return t ? j(t) : e;}function re(e) {return Boolean(e && e.__v_isRef === !0);}Promise.resolve();let oe = !1;const q = [],Wt = Promise.resolve(),V = e => Wt.then(e),Ie = e => {q.includes(e) || q.push(e), oe || (oe = !0, V(Ft));},Ft = () => {for (const e of q) e();q.length = 0, oe = !1;},qt = /^(spellcheck|draggable|form|list|type)$/,ie = ({ el: e, get: t, effect: n, arg: s, modifiers: r }) => {let i;s === "class" && (e._class = e.className), n(() => {let c = t();if (s) (r == null ? void 0 : r.camel) && (s = dt(s)), ce(e, s, c, i);else {for (const o in c) ce(e, o, c[o], i && i[o]);for (const o in i) (!c || !(o in c)) && ce(e, o, null);}i = c;});},ce = (e, t, n, s) => {if (t === "class") e.setAttribute("class", me(e._class ? [e._class, n] : n) || "");else if (t === "style") {n = de(n);const { style: r } = e;if (!n) e.removeAttribute("style");else if (N(n)) n !== s && (r.cssText = n);else {for (const i in n) le(r, i, n[i]);if (s && !N(s)) for (const i in s) n[i] == null && le(r, i, "");}} else !(e instanceof SVGElement) && t in e && !qt.test(t) ? (e[t] = n, t === "value" && (e._value = n)) : t === "true-value" ? e._trueValue = n : t === "false-value" ? e._falseValue = n : n != null ? e.setAttribute(t, n) : e.removeAttribute(t);},Ne = /\s*!important$/,le = (e, t, n) => {y(n) ? n.forEach(s => le(e, t, s)) : t.startsWith("--") ? e.setProperty(t, n) : Ne.test(n) ? e.setProperty(xe(t), n.replace(Ne, ""), "important") : e[t] = n;},k = (e, t) => {const n = e.getAttribute(t);return n != null && e.removeAttribute(t), n;},T = (e, t, n, s) => {e.addEventListener(t, n, s);},Jt = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,Zt = ["ctrl", "shift", "alt", "meta"],Gt = { stop: e => e.stopPropagation(), prevent: e => e.preventDefault(), self: e => e.target !== e.currentTarget, ctrl: e => !e.ctrlKey, shift: e => !e.shiftKey, alt: e => !e.altKey, meta: e => !e.metaKey, left: e => "button" in e && e.button !== 0, middle: e => "button" in e && e.button !== 1, right: e => "button" in e && e.button !== 2, exact: (e, t) => Zt.some(n => e[`${n}Key`] && !t[n]) },Ke = ({ el: e, get: t, exp: n, arg: s, modifiers: r }) => {if (!s) return;let i = Jt.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);if (s === "vue:mounted") {V(i);return;} else if (s === "vue:unmounted") return () => i();if (r) {s === "click" && (r.right && (s = "contextmenu"), r.middle && (s = "mouseup"));const c = i;i = o => {if (!("key" in o && !(xe(o.key) in r))) {for (const l in r) {const f = Gt[l];if (f && f(o, r)) return;}return c(o);}};}T(e, s, i, r);},Ut = ({ el: e, get: t, effect: n }) => {const s = e.style.display;n(() => {e.style.display = t() ? s : "none";});},Be = ({ el: e, get: t, effect: n }) => {n(() => {e.textContent = ze(t());});},ze = e => e == null ? "" : S(e) ? JSON.stringify(e, null, 2) : String(e),Yt = ({ el: e, get: t, effect: n }) => {n(() => {e.innerHTML = t();});},Qt = ({ el: e, exp: t, get: n, effect: s, modifiers: r }) => {const i = e.type,c = n(`(val) => { ${t} = val }`),{ trim: o, number: l = i === "number" } = r || {};if (e.tagName === "SELECT") {const f = e;T(e, "change", () => {const a = Array.prototype.filter.call(f.options, u => u.selected).map(u => l ? ve(A(u)) : A(u));c(f.multiple ? a : a[0]);}), s(() => {const a = n(),u = f.multiple;for (let p = 0, x = f.options.length; p < x; p++) {const b = f.options[p],v = A(b);if (u) y(a) ? b.selected = G(a, v) > -1 : b.selected = a.has(v);else if (I(A(b), a)) {f.selectedIndex !== p && (f.selectedIndex = p);return;}}!u && f.selectedIndex !== -1 && (f.selectedIndex = -1);});} else if (i === "checkbox") {T(e, "change", () => {const a = n(),u = e.checked;if (y(a)) {const p = A(e),x = G(a, p),b = x !== -1;if (u && !b) c(a.concat(p));else if (!u && b) {const v = [...a];v.splice(x, 1), c(v);}} else c(De(e, u));});let f;s(() => {const a = n();y(a) ? e.checked = G(a, A(e)) > -1 : a !== f && (e.checked = I(a, De(e, !0))), f = a;});} else if (i === "radio") {T(e, "change", () => {c(A(e));});let f;s(() => {const a = n();a !== f && (e.checked = I(a, A(e)));});} else {const f = a => o ? a.trim() : l ? ve(a) : a;T(e, "compositionstart", Xt), T(e, "compositionend", en), T(e, (r == null ? void 0 : r.lazy) ? "change" : "input", () => {e.composing || c(f(e.value));}), o && T(e, "change", () => {e.value = e.value.trim();}), s(() => {if (e.composing) return;const a = e.value,u = n();document.activeElement === e && f(a) === u || a !== u && (e.value = u);});}},A = e => "_value" in e ? e._value : e.value,De = (e, t) => {const n = t ? "_trueValue" : "_falseValue";return n in e ? e[n] : t;},Xt = e => {e.target.composing = !0;},en = e => {const t = e.target;t.composing && (t.composing = !1, tn(t, "input"));},tn = (e, t) => {const n = document.createEvent("HTMLEvents");n.initEvent(t, !0, !0), e.dispatchEvent(n);},Ve = Object.create(null),H = (e, t, n) => He(e, `return(${t})`, n),He = (e, t, n) => {const s = Ve[t] || (Ve[t] = nn(t));try {return s(e, n);} catch (r) {console.error(r);}},nn = e => {try {return new Function("$data", "$el", `with($data){${e}}`);} catch (t) {return console.error(`${t.message} in expression: ${e}`), () => {};}},sn = ({ el: e, ctx: t, exp: n, effect: s }) => {V(() => s(() => He(t.scope, n, e)));},rn = { bind: ie, on: Ke, show: Ut, text: Be, html: Yt, model: Qt, effect: sn },on = (e, t, n) => {const s = e.parentElement,r = new Comment("v-if");s.insertBefore(r, e);const i = [{ exp: t, el: e }];let c, o;for (; (c = e.nextElementSibling) && (o = null, k(c, "v-else") === "" || (o = k(c, "v-else-if")));) s.removeChild(c), i.push({ exp: o, el: c });const l = e.nextSibling;s.removeChild(e);let f,a = -1;const u = () => {f && (s.insertBefore(r, f.el), f.remove(), f = void 0);};return n.effect(() => {for (let p = 0; p < i.length; p++) {const { exp: x, el: b } = i[p];if (!x || H(n.scope, x)) {p !== a && (u(), f = new ue(b, n), f.insert(s, r), s.removeChild(r), a = p);return;}}a = -1, u();}), l;},cn = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,Le = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,ln = /^\(|\)$/g,fn = /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/,an = (e, t, n) => {const s = t.match(cn);if (!s) return;const r = e.nextSibling,i = e.parentElement,c = new Text("");i.insertBefore(c, e), i.removeChild(e);const o = s[2].trim();let l = s[1].trim().replace(ln, "").trim(),f,a = !1,u,p,x = "key",b = e.getAttribute(x) || e.getAttribute(x = ":key") || e.getAttribute(x = "v-bind:key");b && (e.removeAttribute(x), x === "key" && (b = JSON.stringify(b)));let v;(v = l.match(Le)) && (l = l.replace(Le, "").trim(), u = v[1].trim(), v[2] && (p = v[2].trim())), (v = l.match(fn)) && (f = v[1].split(",").map(m => m.trim()), a = l[0] === "[");let pe = !1,R,L,J;const et = m => {const w = new Map(),h = [];if (y(m)) for (let d = 0; d < m.length; d++) h.push(Z(w, m[d], d));else if (typeof m == "number") for (let d = 0; d < m; d++) h.push(Z(w, d + 1, d));else if (S(m)) {let d = 0;for (const g in m) h.push(Z(w, m[g], d++, g));}return [h, w];},Z = (m, w, h, d) => {const g = {};f ? f.forEach((M, E) => g[M] = w[a ? E : M]) : g[l] = w, d ? (u && (g[u] = d), p && (g[p] = h)) : u && (g[u] = h);const P = Ge(n, g),_ = b ? H(P.scope, b) : h;return m.set(_, h), P.key = _, P;},he = (m, w) => {const h = new ue(e, m);return h.key = m.key, h.insert(i, w), h;};return n.effect(() => {const m = H(n.scope, o),w = J;if ([L, J] = et(m), !pe) R = L.map(h => he(h, c)), pe = !0;else {for (let _ = 0; _ < R.length; _++) J.has(R[_].key) || R[_].remove();const h = [];let d = L.length,g,P;for (; d--;) {const _ = L[d],M = w.get(_.key);let E;M == null ? E = he(_, g ? g.el : c) : (E = R[M], Object.assign(E.ctx.scope, _.scope), M !== d && (R[M + 1] !== g || P === g) && (P = E, E.insert(i, g ? g.el : c))), h.unshift(g = E);}R = h;}}), r;},We = ({ el: e, ctx: { scope: { $refs: t } }, get: n, effect: s }) => {let r;return s(() => {const i = n();t[i] = e, r && i !== r && delete t[r], r = i;}), () => {r && delete t[r];};},un = /^(?:v-|:|@)/,pn = /\.([\w-]+)/g;let fe = !1;const Fe = (e, t) => {const n = e.nodeType;if (n === 1) {const s = e;if (s.hasAttribute("v-pre")) return;k(s, "v-cloak");let r;if (r = k(s, "v-if")) return on(s, r, t);if (r = k(s, "v-for")) return an(s, r, t);if ((r = k(s, "v-scope")) || r === "") {const o = r ? H(t.scope, r) : {};t = Ge(t, o), o.$template && hn(s, o.$template);}const i = k(s, "v-once") != null;i && (fe = !0), (r = k(s, "ref")) && ae(s, We, `"${r}"`, t), qe(s, t);const c = [];for (const { name: o, value: l } of [...s.attributes]) un.test(o) && o !== "v-cloak" && (o === "v-model" ? c.unshift([o, l]) : o[0] === "@" || /^v-on\b/.test(o) ? c.push([o, l]) : Je(s, o, l, t));for (const [o, l] of c) Je(s, o, l, t);i && (fe = !1);} else if (n === 3) {const s = e.data;if (s.includes(t.delimiters[0])) {let r = [],i = 0,c;for (; c = t.delimitersRE.exec(s);) {const o = s.slice(i, c.index);o && r.push(JSON.stringify(o)), r.push(`$s(${c[1]})`), i = c.index + c[0].length;}i < s.length && r.push(JSON.stringify(s.slice(i))), ae(e, Be, r.join("+"), t);}} else n === 11 && qe(e, t);},qe = (e, t) => {let n = e.firstChild;for (; n;) n = Fe(n, t) || n.nextSibling;},Je = (e, t, n, s) => {let r, i, c;if (t = t.replace(pn, (o, l) => ((c || (c = {}))[l] = !0, "")), t[0] === ":") r = ie, i = t.slice(1);else if (t[0] === "@") r = Ke, i = t.slice(1);else {const o = t.indexOf(":"),l = o > 0 ? t.slice(2, o) : t.slice(2);r = rn[l] || s.dirs[l], i = o > 0 ? t.slice(o + 1) : void 0;}r && (r === ie && i === "ref" && (r = We), ae(e, r, n, s, i, c), e.removeAttribute(t));},ae = (e, t, n, s, r, i) => {const c = t({ el: e, get: (o = n) => H(s.scope, o, e), effect: s.effect, ctx: s, exp: n, arg: r, modifiers: i });c && s.cleanups.push(c);},hn = (e, t) => {if (t[0] === "#") {const n = document.querySelector(t);e.appendChild(n.content.cloneNode(!0));return;}e.innerHTML = t;},Ze = e => {const t = { delimiters: ["{{", "}}"], delimitersRE: /\{\{([^]+?)\}\}/g, ...e, scope: e ? e.scope : D({}), dirs: e ? e.dirs : {}, effects: [], blocks: [], cleanups: [], effect: n => {if (fe) return Ie(n), n;const s = wt(n, { scheduler: () => Ie(s) });return t.effects.push(s), s;} };return t;},Ge = (e, t = {}) => {const n = e.scope,s = Object.create(n);Object.defineProperties(s, Object.getOwnPropertyDescriptors(t)), s.$refs = Object.create(n.$refs);const r = D(new Proxy(s, { set(i, c, o, l) {return l === r && !i.hasOwnProperty(c) ? Reflect.set(n, c, o) : Reflect.set(i, c, o, l);} }));return Ue(r), { ...e, scope: r };},Ue = e => {for (const t of Object.keys(e)) typeof e[t] == "function" && (e[t] = e[t].bind(e));};class ue {constructor(t, n, s = !1) {$$1(this, "template");$$1(this, "ctx");$$1(this, "key");$$1(this, "parentCtx");$$1(this, "isFragment");$$1(this, "start");$$1(this, "end");this.isFragment = t instanceof HTMLTemplateElement, s ? this.template = t : this.isFragment ? this.template = t.content.cloneNode(!0) : this.template = t.cloneNode(!0), s ? this.ctx = n : (this.parentCtx = n, n.blocks.push(this), this.ctx = Ze(n)), Fe(this.template, this.ctx);}get el() {return this.start || this.template;}insert(t, n = null) {if (this.isFragment) {if (this.start) {let s = this.start,r;for (; s && (r = s.nextSibling, t.insertBefore(s, n), s !== this.end);) s = r;} else this.start = new Text(""), this.end = new Text(""), t.insertBefore(this.end, n), t.insertBefore(this.start, this.end), t.insertBefore(this.template, this.end);} else t.insertBefore(this.template, n);}remove() {if (this.parentCtx && ft(this.parentCtx.blocks, this), this.start) {const t = this.start.parentNode;let n = this.start,s;for (; n && (s = n.nextSibling, t.removeChild(n), n !== this.end);) n = s;} else this.template.parentNode.removeChild(this.template);this.teardown();}teardown() {this.ctx.blocks.forEach(t => {t.teardown();}), this.ctx.effects.forEach(_t), this.ctx.cleanups.forEach(t => t());}}const Ye = e => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"),Qe = e => {const t = Ze();if (e && (t.scope = D(e), Ue(t.scope), e.$delimiters)) {const [s, r] = t.delimiters = e.$delimiters;t.delimitersRE = new RegExp(Ye(s) + "([^]+?)" + Ye(r), "g");}t.scope.$s = ze, t.scope.$nextTick = V, t.scope.$refs = Object.create(null);let n;return { directive(s, r) {return r ? (t.dirs[s] = r, this) : t.dirs[s];}, mount(s) {if (typeof s == "string" && (s = document.querySelector(s), !s)) return;s = s || document.documentElement;let r;return s.hasAttribute("v-scope") ? r = [s] : r = [...s.querySelectorAll("[v-scope]")].filter(i => !i.matches("[v-scope] [v-scope]")), r.length || (r = [s]), n = r.map(i => new ue(i, t, !0)), this;}, unmount() {n.forEach(s => s.teardown());} };},Xe = document.currentScript;Xe && Xe.hasAttribute("init") && Qe().mount();const pVue={template:{cache:new Map,get:async e=>pVue.template.cache.has(e)?pVue.template.cache.get(e):await fetch(e).then(e=>{if(!e.ok)throw Error(e.statusText);return e.text()}).then(t=>(pVue.template.cache.set(e,t),pVue.template.cache.get(e))).catch(e=>(console.error(e),!1)),set:async e=>(pVue.template.cache.has(e)&&pVue.template.cache.delete(e),pVue.template.cache.get(e)),async delete(e){pVue.template.cache.delete(e);}},helpers:{localize:(e,t={})=>(foundry.utils?.isEmpty??foundry.utils?.isObjectEmpty)(t.hash??{})?game.i18n.localize(e):game.i18n.format(e,t),l:(...e)=>pVue.helpers.localize(...e)}};class VueApplication extends Application{constructor(...e){super(...e);}get store(){return this._vue.store}static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{classes:["vue-window-app"],submitOnClose:!1,submitOnInput:!1,autoUpdate:!1})}async _renderInner(e){let t=await pVue.template.get(this.template);if(""===t)throw Error(`No data was returned from template ${this.template}`);let s=Object.assign(document.createElement("div"),{innerHTML:`<div v-scope @vue:mounted="mounted($el)" @vue:unmounted="unmounted($el)">${t}</div>`}),i=D(e);return console.log(i),this._vue={store:i,app:null},$(s.firstChild)}async _activateCoreListeners(e){super._activateCoreListeners(e);let t=e[0];this._vue.app=Qe(mergeObject({store:this._vue.store},mergeObject(pVue.helpers,{mounted:function(e){Hooks.callAll("mountedVueApplication",this,e);},unmounted:function(e){Hooks.callAll("unmountedVueApplication",this,e);}}))).mount(t.querySelector(".window-content > div"));}async close(e={}){let t=this.element[0],s=Application.RENDER_STATES;if(e.force||[s.RENDERED,s.ERROR].includes(this._state)){if(this._state=s.CLOSING,!t)return this._state=s.CLOSED;for(let i of this.constructor._getInheritanceChain())Hooks.call(`close${i.name}`,this,this.element);return await new Promise(e=>{t.addEventListener("transitionend",i=>{this._vue.app.unmount(),this._vue=null,t.remove(),this._element=null,delete ui.windows[this.appId],this._minimized=!1,this._scrollPositions=null,this._state=s.CLOSED,e();},{once:!0}),Object.assign(t.style,{transformOrigin:"top right",transition:"opacity 0.2s ease-in-out, height 0.2s ease-in-out",opacity:0,height:0});})}}}class VueFormApplication extends FormApplication{constructor(...e){super(...e),this._hookIds=[];}static get defaultOptions(){return foundry.utils.mergeObject(super.defaultOptions,{classes:["vue-window-app"],submitOnInput:!1,autoUpdate:!1})}get store(){return this._vue.store}getData(e={}){return {object:this.object?.toObject()??this.object,options:this.options,title:this.title}}async _renderInner(e){let t=await pVue.template.get(this.template);if(""===t)throw Error(`No data was returned from template ${this.template}`);let s=Object.assign(document.createElement("div"),{innerHTML:`<form @vue:mounted="mounted($el)" @vue:unmounted="unmounted($el)">${t}</form>`}),i=D(e.object);return this._vue={store:i,app:Qe({store:i,...{...pVue.helpers,mounted:function(e){Hooks.callAll("mountedVueFormApplication",this,e);},unmounted:function(e){Hooks.callAll("unmountedVueFormApplication",this,e);}}}).mount(s.firstChild)},this.form=s.querySelector("form"),$(s.firstChild)}async _activateCoreListeners(e){if(super._activateCoreListeners(e),this.options.autoSync&&this.object?.update)for(let t of Object.values(this.object.schema.fields)){if(!t?.element?.documentName)continue;let s=["create","update","delete"];s.forEach(e=>{let s=`${e}${t.element.documentName}`;this._hookIds.push([s,Hooks.on(s,(e,t,s,i)=>{e.parent==this.object&&mergeObject(this._vue.store,e.parent.toObject(),{performDeletions:!0});})]);});}}async _updateObject(){this.object?.update&&this._vue.store&&await this.object.update(this._vue.store);}async close(e={}){let t=this.element[0],s=Application.RENDER_STATES,i=e.submit??this.options.submitOnClose;for(let n of(i&&await this.submit({preventClose:!0,preventRender:!0}),this.filepickers))n.close();for(let o of(this.filepickers=[],Object.values(this.editors)))o.mce&&o.mce.destroy();if(this.editors={},e.force||[s.RENDERED,s.ERROR].includes(this._state)){if(this._state=s.CLOSING,!t)return this._state=s.CLOSED;for(let a of this.constructor._getInheritanceChain())Hooks.call(`close${a.name}`,this,this.element);return await new Promise(e=>{t.addEventListener("transitionend",i=>{this._vue.app.unmount(),this._vue=null,t.remove(),this._element=null,delete ui.windows[this.appId],this._minimized=!1,this._scrollPositions=null,this._state=s.CLOSED,e();},{once:!0}),Object.assign(t.style,{transformOrigin:"top right",transition:"opacity 0.2s ease-in-out, height 0.2s ease-in-out",opacity:0,height:0});})}}}/**
* Panzoom for panning and zooming elements using CSS transforms
* Copyright Timmy Willison and other contributors
* https://github.com/timmywil/panzoom/blob/main/MIT-License.txt
*/
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/* eslint-disable no-var */
if (typeof window !== 'undefined') {
  // Support: IE11 only
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  // Support: IE11 only
  // CustomEvent is an object instead of a constructor
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt
    };
  }
}

/**
 * Utilites for working with multiple pointer events
 */
function findEventIndex(pointers, event) {
    var i = pointers.length;
    while (i--) {
        if (pointers[i].pointerId === event.pointerId) {
            return i;
        }
    }
    return -1;
}
function addPointer(pointers, event) {
    var i;
    // Add touches if applicable
    if (event.touches) {
        i = 0;
        for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {
            var touch = _a[_i];
            touch.pointerId = i++;
            addPointer(pointers, touch);
        }
        return;
    }
    i = findEventIndex(pointers, event);
    // Update if already present
    if (i > -1) {
        pointers.splice(i, 1);
    }
    pointers.push(event);
}
function removePointer(pointers, event) {
    // Add touches if applicable
    if (event.touches) {
        // Remove all touches
        while (pointers.length) {
            pointers.pop();
        }
        return;
    }
    var i = findEventIndex(pointers, event);
    if (i > -1) {
        pointers.splice(i, 1);
    }
}
/**
 * Calculates a center point between
 * the given pointer events, for panning
 * with multiple pointers.
 */
function getMiddle(pointers) {
    // Copy to avoid changing by reference
    pointers = pointers.slice(0);
    var event1 = pointers.pop();
    var event2;
    while ((event2 = pointers.pop())) {
        event1 = {
            clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
            clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
        };
    }
    return event1;
}
/**
 * Calculates the distance between two points
 * for pinch zooming.
 * Limits to the first 2
 */
function getDistance(pointers) {
    if (pointers.length < 2) {
        return 0;
    }
    var event1 = pointers[0];
    var event2 = pointers[1];
    return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +
        Math.pow(Math.abs(event2.clientY - event1.clientY), 2));
}

var events = {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup mouseleave'
};
if (typeof window !== 'undefined') {
    if (typeof window.PointerEvent === 'function') {
        events = {
            down: 'pointerdown',
            move: 'pointermove',
            up: 'pointerup pointerleave pointercancel'
        };
    }
    else if (typeof window.TouchEvent === 'function') {
        events = {
            down: 'touchstart',
            move: 'touchmove',
            up: 'touchend touchcancel'
        };
    }
}
function onPointer(event, elem, handler, eventOpts) {
    events[event].split(' ').forEach(function (name) {
        elem.addEventListener(name, handler, eventOpts);
    });
}
function destroyPointer(event, elem, handler) {
    events[event].split(' ').forEach(function (name) {
        elem.removeEventListener(name, handler);
    });
}

var isIE = typeof document !== 'undefined' && !!document.documentMode;
/**
 * Lazy creation of a CSS style declaration
 */
var divStyle;
function createStyle() {
    if (divStyle) {
        return divStyle;
    }
    return (divStyle = document.createElement('div').style);
}
/**
 * Proper prefixing for cross-browser compatibility
 */
var prefixes = ['webkit', 'moz', 'ms'];
var prefixCache = {};
function getPrefixedName(name) {
    if (prefixCache[name]) {
        return prefixCache[name];
    }
    var divStyle = createStyle();
    if (name in divStyle) {
        return (prefixCache[name] = name);
    }
    var capName = name[0].toUpperCase() + name.slice(1);
    var i = prefixes.length;
    while (i--) {
        var prefixedName = "".concat(prefixes[i]).concat(capName);
        if (prefixedName in divStyle) {
            return (prefixCache[name] = prefixedName);
        }
    }
}
/**
 * Gets a style value expected to be a number
 */
function getCSSNum(name, style) {
    return parseFloat(style[getPrefixedName(name)]) || 0;
}
function getBoxStyle(elem, name, style) {
    if (style === void 0) { style = window.getComputedStyle(elem); }
    // Support: FF 68+
    // Firefox requires specificity for border
    var suffix = name === 'border' ? 'Width' : '';
    return {
        left: getCSSNum("".concat(name, "Left").concat(suffix), style),
        right: getCSSNum("".concat(name, "Right").concat(suffix), style),
        top: getCSSNum("".concat(name, "Top").concat(suffix), style),
        bottom: getCSSNum("".concat(name, "Bottom").concat(suffix), style)
    };
}
/**
 * Set a style using the properly prefixed name
 */
function setStyle(elem, name, value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elem.style[getPrefixedName(name)] = value;
}
/**
 * Constructs the transition from panzoom options
 * and takes care of prefixing the transition and transform
 */
function setTransition(elem, options) {
    var transform = getPrefixedName('transform');
    setStyle(elem, 'transition', "".concat(transform, " ").concat(options.duration, "ms ").concat(options.easing));
}
/**
 * Set the transform using the proper prefix
 *
 * Override the transform setter.
 * This is exposed mostly so the user could
 * set other parts of a transform
 * aside from scale and translate.
 * Default is defined in src/css.ts.
 *
 * ```js
 * // This example always sets a rotation
 * // when setting the scale and translation
 * const panzoom = Panzoom(elem, {
 *   setTransform: (elem, { scale, x, y }) => {
 *     panzoom.setStyle('transform', `rotate(0.5turn) scale(${scale}) translate(${x}px, ${y}px)`)
 *   }
 * })
 * ```
 */
function setTransform(elem, _a, _options) {
    var x = _a.x, y = _a.y, scale = _a.scale, isSVG = _a.isSVG;
    setStyle(elem, 'transform', "scale(".concat(scale, ") translate(").concat(x, "px, ").concat(y, "px)"));
    if (isSVG && isIE) {
        var matrixValue = window.getComputedStyle(elem).getPropertyValue('transform');
        elem.setAttribute('transform', matrixValue);
    }
}
/**
 * Dimensions used in containment and focal point zooming
 */
function getDimensions(elem) {
    var parent = elem.parentNode;
    var style = window.getComputedStyle(elem);
    var parentStyle = window.getComputedStyle(parent);
    var rectElem = elem.getBoundingClientRect();
    var rectParent = parent.getBoundingClientRect();
    return {
        elem: {
            style: style,
            width: rectElem.width,
            height: rectElem.height,
            top: rectElem.top,
            bottom: rectElem.bottom,
            left: rectElem.left,
            right: rectElem.right,
            margin: getBoxStyle(elem, 'margin', style),
            border: getBoxStyle(elem, 'border', style)
        },
        parent: {
            style: parentStyle,
            width: rectParent.width,
            height: rectParent.height,
            top: rectParent.top,
            bottom: rectParent.bottom,
            left: rectParent.left,
            right: rectParent.right,
            padding: getBoxStyle(parent, 'padding', parentStyle),
            border: getBoxStyle(parent, 'border', parentStyle)
        }
    };
}

/**
 * Determine if an element is attached to the DOM
 * Panzoom requires this so events work properly
 */
function isAttached(elem) {
    var doc = elem.ownerDocument;
    var parent = elem.parentNode;
    return (doc &&
        parent &&
        doc.nodeType === 9 &&
        parent.nodeType === 1 &&
        doc.documentElement.contains(parent));
}

function getClass(elem) {
    return (elem.getAttribute('class') || '').trim();
}
function hasClass(elem, className) {
    return elem.nodeType === 1 && " ".concat(getClass(elem), " ").indexOf(" ".concat(className, " ")) > -1;
}
function isExcluded(elem, options) {
    for (var cur = elem; cur != null; cur = cur.parentNode) {
        if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * Determine if an element is SVG by checking the namespace
 * Exception: the <svg> element itself should be treated like HTML
 */
var rsvg = /^http:[\w\.\/]+svg$/;
function isSVGElement(elem) {
    return rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';
}

function shallowClone(obj) {
    var clone = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = obj[key];
        }
    }
    return clone;
}

var defaultOptions = {
    animate: false,
    canvas: false,
    cursor: 'move',
    disablePan: false,
    disableZoom: false,
    disableXAxis: false,
    disableYAxis: false,
    duration: 200,
    easing: 'ease-in-out',
    exclude: [],
    excludeClass: 'panzoom-exclude',
    handleStartEvent: function (e) {
        e.preventDefault();
        e.stopPropagation();
    },
    maxScale: 4,
    minScale: 0.125,
    overflow: 'hidden',
    panOnlyWhenZoomed: false,
    pinchAndPan: false,
    relative: false,
    setTransform: setTransform,
    startX: 0,
    startY: 0,
    startScale: 1,
    step: 0.3,
    touchAction: 'none'
};
function Panzoom(elem, options) {
    if (!elem) {
        throw new Error('Panzoom requires an element as an argument');
    }
    if (elem.nodeType !== 1) {
        throw new Error('Panzoom requires an element with a nodeType of 1');
    }
    if (!isAttached(elem)) {
        throw new Error('Panzoom should be called on elements that have been attached to the DOM');
    }
    options = __assign(__assign({}, defaultOptions), options);
    var isSVG = isSVGElement(elem);
    var parent = elem.parentNode;
    // Set parent styles
    parent.style.overflow = options.overflow;
    parent.style.userSelect = 'none';
    // This is important for mobile to
    // prevent scrolling while panning
    parent.style.touchAction = options.touchAction;
    (options.canvas ? parent : elem).style.cursor = options.cursor;
    // Set element styles
    elem.style.userSelect = 'none';
    elem.style.touchAction = options.touchAction;
    // The default for HTML is '50% 50%'
    // The default for SVG is '0 0'
    // SVG can't be changed in IE
    setStyle(elem, 'transformOrigin', typeof options.origin === 'string' ? options.origin : isSVG ? '0 0' : '50% 50%');
    function resetStyle() {
        parent.style.overflow = '';
        parent.style.userSelect = '';
        parent.style.touchAction = '';
        parent.style.cursor = '';
        elem.style.cursor = '';
        elem.style.userSelect = '';
        elem.style.touchAction = '';
        setStyle(elem, 'transformOrigin', '');
    }
    function setOptions(opts) {
        if (opts === void 0) { opts = {}; }
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                options[key] = opts[key];
            }
        }
        // Handle option side-effects
        if (opts.hasOwnProperty('cursor') || opts.hasOwnProperty('canvas')) {
            parent.style.cursor = elem.style.cursor = '';
            (options.canvas ? parent : elem).style.cursor = options.cursor;
        }
        if (opts.hasOwnProperty('overflow')) {
            parent.style.overflow = opts.overflow;
        }
        if (opts.hasOwnProperty('touchAction')) {
            parent.style.touchAction = opts.touchAction;
            elem.style.touchAction = opts.touchAction;
        }
    }
    var x = 0;
    var y = 0;
    var scale = 1;
    var isPanning = false;
    zoom(options.startScale, { animate: false, force: true });
    // Wait for scale to update
    // for accurate dimensions
    // to constrain initial values
    setTimeout(function () {
        pan(options.startX, options.startY, { animate: false, force: true });
    });
    function trigger(eventName, detail, opts) {
        if (opts.silent) {
            return;
        }
        var event = new CustomEvent(eventName, { detail: detail });
        elem.dispatchEvent(event);
    }
    function setTransformWithEvent(eventName, opts, originalEvent) {
        var value = { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
        requestAnimationFrame(function () {
            if (typeof opts.animate === 'boolean') {
                if (opts.animate) {
                    setTransition(elem, opts);
                }
                else {
                    setStyle(elem, 'transition', 'none');
                }
            }
            opts.setTransform(elem, value, opts);
            trigger(eventName, value, opts);
            trigger('panzoomchange', value, opts);
        });
        return value;
    }
    function constrainXY(toX, toY, toScale, panOptions) {
        var opts = __assign(__assign({}, options), panOptions);
        var result = { x: x, y: y, opts: opts };
        if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {
            return result;
        }
        toX = parseFloat(toX);
        toY = parseFloat(toY);
        if (!opts.disableXAxis) {
            result.x = (opts.relative ? x : 0) + toX;
        }
        if (!opts.disableYAxis) {
            result.y = (opts.relative ? y : 0) + toY;
        }
        if (opts.contain) {
            var dims = getDimensions(elem);
            var realWidth = dims.elem.width / scale;
            var realHeight = dims.elem.height / scale;
            var scaledWidth = realWidth * toScale;
            var scaledHeight = realHeight * toScale;
            var diffHorizontal = (scaledWidth - realWidth) / 2;
            var diffVertical = (scaledHeight - realHeight) / 2;
            if (opts.contain === 'inside') {
                var minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale;
                var maxX = (dims.parent.width -
                    scaledWidth -
                    dims.parent.padding.left -
                    dims.elem.margin.left -
                    dims.parent.border.left -
                    dims.parent.border.right +
                    diffHorizontal) /
                    toScale;
                result.x = Math.max(Math.min(result.x, maxX), minX);
                var minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale;
                var maxY = (dims.parent.height -
                    scaledHeight -
                    dims.parent.padding.top -
                    dims.elem.margin.top -
                    dims.parent.border.top -
                    dims.parent.border.bottom +
                    diffVertical) /
                    toScale;
                result.y = Math.max(Math.min(result.y, maxY), minY);
            }
            else if (opts.contain === 'outside') {
                var minX = (-(scaledWidth - dims.parent.width) -
                    dims.parent.padding.left -
                    dims.parent.border.left -
                    dims.parent.border.right +
                    diffHorizontal) /
                    toScale;
                var maxX = (diffHorizontal - dims.parent.padding.left) / toScale;
                result.x = Math.max(Math.min(result.x, maxX), minX);
                var minY = (-(scaledHeight - dims.parent.height) -
                    dims.parent.padding.top -
                    dims.parent.border.top -
                    dims.parent.border.bottom +
                    diffVertical) /
                    toScale;
                var maxY = (diffVertical - dims.parent.padding.top) / toScale;
                result.y = Math.max(Math.min(result.y, maxY), minY);
            }
        }
        if (opts.roundPixels) {
            result.x = Math.round(result.x);
            result.y = Math.round(result.y);
        }
        return result;
    }
    function constrainScale(toScale, zoomOptions) {
        var opts = __assign(__assign({}, options), zoomOptions);
        var result = { scale: scale, opts: opts };
        if (!opts.force && opts.disableZoom) {
            return result;
        }
        var minScale = options.minScale;
        var maxScale = options.maxScale;
        if (opts.contain) {
            var dims = getDimensions(elem);
            var elemWidth = dims.elem.width / scale;
            var elemHeight = dims.elem.height / scale;
            if (elemWidth > 1 && elemHeight > 1) {
                var parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right;
                var parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom;
                var elemScaledWidth = parentWidth / elemWidth;
                var elemScaledHeight = parentHeight / elemHeight;
                if (options.contain === 'inside') {
                    maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight);
                }
                else if (options.contain === 'outside') {
                    minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight);
                }
            }
        }
        result.scale = Math.min(Math.max(toScale, minScale), maxScale);
        return result;
    }
    function pan(toX, toY, panOptions, originalEvent) {
        var result = constrainXY(toX, toY, scale, panOptions);
        // Only try to set if the result is somehow different
        if (x !== result.x || y !== result.y) {
            x = result.x;
            y = result.y;
            return setTransformWithEvent('panzoompan', result.opts, originalEvent);
        }
        return { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
    }
    function zoom(toScale, zoomOptions, originalEvent) {
        var result = constrainScale(toScale, zoomOptions);
        var opts = result.opts;
        if (!opts.force && opts.disableZoom) {
            return;
        }
        toScale = result.scale;
        var toX = x;
        var toY = y;
        if (opts.focal) {
            // The difference between the point after the scale and the point before the scale
            // plus the current translation after the scale
            // neutralized to no scale (as the transform scale will apply to the translation)
            var focal = opts.focal;
            toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;
            toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;
        }
        var panResult = constrainXY(toX, toY, toScale, { relative: false, force: true });
        x = panResult.x;
        y = panResult.y;
        scale = toScale;
        return setTransformWithEvent('panzoomzoom', opts, originalEvent);
    }
    function zoomInOut(isIn, zoomOptions) {
        var opts = __assign(__assign(__assign({}, options), { animate: true }), zoomOptions);
        return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);
    }
    function zoomIn(zoomOptions) {
        return zoomInOut(true, zoomOptions);
    }
    function zoomOut(zoomOptions) {
        return zoomInOut(false, zoomOptions);
    }
    function zoomToPoint(toScale, point, zoomOptions, originalEvent) {
        var dims = getDimensions(elem);
        // Instead of thinking of operating on the panzoom element,
        // think of operating on the area inside the panzoom
        // element's parent
        // Subtract padding and border
        var effectiveArea = {
            width: dims.parent.width -
                dims.parent.padding.left -
                dims.parent.padding.right -
                dims.parent.border.left -
                dims.parent.border.right,
            height: dims.parent.height -
                dims.parent.padding.top -
                dims.parent.padding.bottom -
                dims.parent.border.top -
                dims.parent.border.bottom
        };
        // Adjust the clientX/clientY to ignore the area
        // outside the effective area
        var clientX = point.clientX -
            dims.parent.left -
            dims.parent.padding.left -
            dims.parent.border.left -
            dims.elem.margin.left;
        var clientY = point.clientY -
            dims.parent.top -
            dims.parent.padding.top -
            dims.parent.border.top -
            dims.elem.margin.top;
        // Adjust the clientX/clientY for HTML elements,
        // because they have a transform-origin of 50% 50%
        if (!isSVG) {
            clientX -= dims.elem.width / scale / 2;
            clientY -= dims.elem.height / scale / 2;
        }
        // Convert the mouse point from it's position over the
        // effective area before the scale to the position
        // over the effective area after the scale.
        var focal = {
            x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
            y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
        };
        return zoom(toScale, __assign(__assign({}, zoomOptions), { animate: false, focal: focal }), originalEvent);
    }
    function zoomWithWheel(event, zoomOptions) {
        // Need to prevent the default here
        // or it conflicts with regular page scroll
        event.preventDefault();
        var opts = __assign(__assign(__assign({}, options), zoomOptions), { animate: false });
        // Normalize to deltaX in case shift modifier is used on Mac
        var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
        var wheel = delta < 0 ? 1 : -1;
        var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;
        return zoomToPoint(toScale, event, opts, event);
    }
    function reset(resetOptions) {
        var opts = __assign(__assign(__assign({}, options), { animate: true, force: true }), resetOptions);
        scale = constrainScale(opts.startScale, opts).scale;
        var panResult = constrainXY(opts.startX, opts.startY, scale, opts);
        x = panResult.x;
        y = panResult.y;
        return setTransformWithEvent('panzoomreset', opts);
    }
    var origX;
    var origY;
    var startClientX;
    var startClientY;
    var startScale;
    var startDistance;
    var pointers = [];
    function handleDown(event) {
        // Don't handle this event if the target is excluded
        if (isExcluded(event.target, options)) {
            return;
        }
        addPointer(pointers, event);
        isPanning = true;
        options.handleStartEvent(event);
        origX = x;
        origY = y;
        trigger('panzoomstart', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
        // This works whether there are multiple
        // pointers or not
        var point = getMiddle(pointers);
        startClientX = point.clientX;
        startClientY = point.clientY;
        startScale = scale;
        startDistance = getDistance(pointers);
    }
    function handleMove(event) {
        if (!isPanning ||
            origX === undefined ||
            origY === undefined ||
            startClientX === undefined ||
            startClientY === undefined) {
            return;
        }
        addPointer(pointers, event);
        var current = getMiddle(pointers);
        var hasMultiple = pointers.length > 1;
        var toScale = scale;
        if (hasMultiple) {
            // A startDistance of 0 means
            // that there weren't 2 pointers
            // handled on start
            if (startDistance === 0) {
                startDistance = getDistance(pointers);
            }
            // Use the distance between the first 2 pointers
            // to determine the current scale
            var diff = getDistance(pointers) - startDistance;
            toScale = constrainScale((diff * options.step) / 80 + startScale).scale;
            zoomToPoint(toScale, current, { animate: false }, event);
        }
        // Pan during pinch if pinchAndPan is true.
        // Note: some calculations may be off because the zoom
        // above has not yet rendered. However, the behavior
        // was removed before the new scale was used in the following
        // pan calculation.
        // See https://github.com/timmywil/panzoom/issues/512
        // and https://github.com/timmywil/panzoom/issues/606
        if (!hasMultiple || options.pinchAndPan) {
            pan(origX + (current.clientX - startClientX) / toScale, origY + (current.clientY - startClientY) / toScale, {
                animate: false
            }, event);
        }
    }
    function handleUp(event) {
        // Don't call panzoomend when panning with 2 touches
        // until both touches end
        if (pointers.length === 1) {
            trigger('panzoomend', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
        }
        // Note: don't remove all pointers
        // Can restart without having to reinitiate all of them
        // Remove the pointer regardless of the isPanning state
        removePointer(pointers, event);
        if (!isPanning) {
            return;
        }
        isPanning = false;
        origX = origY = startClientX = startClientY = undefined;
    }
    var bound = false;
    function bind() {
        if (bound) {
            return;
        }
        bound = true;
        onPointer('down', options.canvas ? parent : elem, handleDown);
        onPointer('move', document, handleMove, { passive: true });
        onPointer('up', document, handleUp, { passive: true });
    }
    function destroy() {
        bound = false;
        destroyPointer('down', options.canvas ? parent : elem, handleDown);
        destroyPointer('move', document, handleMove);
        destroyPointer('up', document, handleUp);
    }
    if (!options.noBind) {
        bind();
    }
    return {
        bind: bind,
        destroy: destroy,
        eventNames: events,
        getPan: function () { return ({ x: x, y: y }); },
        getScale: function () { return scale; },
        getOptions: function () { return shallowClone(options); },
        handleDown: handleDown,
        handleMove: handleMove,
        handleUp: handleUp,
        pan: pan,
        reset: reset,
        resetStyle: resetStyle,
        setOptions: setOptions,
        setStyle: function (name, value) { return setStyle(elem, name, value); },
        zoom: zoom,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        zoomToPoint: zoomToPoint,
        zoomWithWheel: zoomWithWheel
    };
}
Panzoom.defaultOptions = defaultOptions;// GET REQUIRED LIBRARIES

class DunGenTesting extends VueApplication {
    constructor(data) {
		super(data);

		this.data = data;

		// Store Image PanZoom Status
		this.imagePanZoom = null;
		this.PanZoomOptions = {
			maxScale: 10
		};

		// Store Hook IDs
		this._hookIds = [];

		// Store Scene Information
		this.sceneOptions = null;

		// Track Generated Options
		this.generationOptions = null;

		// Set Attempt Call Count for Generating Map
		this.maxCallCount = 4;
    }

	static installAPI = () => { }

	static init = () => { }

	static get defaultOptions() {
      	return mergeObject(
			super.defaultOptions, {
			title: MODULE.TITLE,
			id: `${MODULE.ID}-dialog`,
			classes: [],
			template: `modules/${MODULE.ID}/templates/dungen.vue`,
			width: window.innerWidth > 960 ? 960 : window.innerWidth - 300,
			height: window.innerHeight > 800 ? 800 : window.innerHeight - 100
		});
    }

	getThemes(genType) {
		let themes = ['original'];

		if (genType == 'dungeon') themes = themes.concat([
			"ice_temple",
			"stylized_gray",
			"black_white",
			"stylized_white",
			"classic_blue",
			"virtual_world",
			"mask"
		]);

		return themes;
	}

	getMapSizes(genType) {
		return genType == 'dungeon' 
			? [ "120", "80", "40", "16", "6", "4" ]
			: [ "50", "40", "30", "20", "12" ]
	}

	getTileSizes(genType) {
		const tileSizes = [{
			"title": "Default Options",
			"isPatreonLocked": false,
			"options": [ "50", "70" ] 
		},{
			"title": "Patreon Exclusive",
			"isPatreonLocked": (MODULE.setting('patreon_values')?.token_expired || !(MODULE.setting('patreon_values')?.patreon_features ?? []).includes('Double Resolution (140px grid)')),
			"options": [ "140" ] 
		}];

		return tileSizes
	}

	getGenerationProps(elem, seed=randomID(12)) {
		const genType = elem.querySelector('aside input[type="radio"][name="gen_type"]:checked').value;

		let data = {
			patreon_token: MODULE.setting('patreon_token'),
			seed: elem.querySelector('aside input[type="text"][name="seed"]').value?.length > 0 ? elem.querySelector('aside input[type="text"][name="seed"]').value : seed,
			theme: elem.querySelector('aside select[name="theme"]').value ?? 'original',
			max_size:  elem.querySelector('aside select[name="max_size"]').value ?? 16,
			tile_size: 30, //elem.querySelector('aside select[name="tile_size"]').value ?? 70,
			image_encoded: true
		};

		if (genType == 'dungeon') mergeObject(data, {
				multi_level: elem.querySelector('aside input[type="checkbox"][name="multi_level"]')?.checked ?? false,
				trap: elem.querySelector('aside input[type="checkbox"][name="trap"]')?.checked ?? false
			});
		else if (genType == 'cave') mergeObject(data, {
				map_style: elem.querySelector('aside select[name="map_style"]').value ?? 'l_rooms',
				corridor_density: elem.querySelector('aside input[type="range"][name="corridor_density"]').value ?? 0,
				egress: elem.querySelector('aside input[type="range"][name="egress"]').value ?? 1,
				secret_rooms: elem.querySelector('aside input[type="checkbox"][name="secret_rooms"]')?.checked ?? false
			});
		
		return data;
	}

	getData(options={}) {
		const genType = 'dungeon';
		return {
			genType: genType,
			moduleId: MODULE.ID,
			previewImage: `/modules/${MODULE.ID}/images/logo.webp`,
			requiresRegeneration: false,
			hasWallsPermission: !MODULE.setting('patreon_values')?.token_expired && (MODULE.setting('patreon_values')?.patreon_features ?? []).includes('Automatic Walls'),
			sceneFolders: game.folders.filter(folder => folder.type === 'Scene').map(folder => { return { id: folder.id, name: folder.name } }),
			isDisabled: false,
			themes: this.getThemes(genType),
			maxSizes: this.getMapSizes(genType),
			mapStyles: [ "l_area", "l_rooms", "s_rooms"],
			tileSizes: this.getTileSizes(genType),
			inputValues: {
				name: options.name,
				folder: options.folder,
				corridor_density: 0,
				egress: 1
			},
			mapDetails: false,
			setRequiresRegeneration: this._setRequiresRegeneration,
			onInputRangeWheel: this._onInputRangeWheel,
			onchangeGenType: this._onchangeGenType,
			onMountImage: this._onMountImage,
			generateDungeon: this._generateDungeon,
			regenerateDungeon: (elem) => {
				const dialog = elem.closest(`#${MODULE.ID}-dialog`);
				let tileSize = dialog.querySelector('aside select[name="tile_size"]').value;
				
				if (tileSize == 140) tileSize = 70;
				else if (tileSize == 70) tileSize = 50;

				dialog.querySelector('aside select[name="tile_size"]').value = tileSize;
				this.generationOptions.tile_size = tileSize;				

				this._generateDungeon({
					target: elem
				}, this.generationOptions.seed);
			},
			createScene: this._createScene,
			checkSize: (width, height) => {
				const gl = document.createElement('canvas').getContext('webgl');
				gl.getParameter(gl.MAX_TEXTURE_SIZE) ?? 8192;

				return {
					'8k': (width < 16384 && height < 16384) && (width > 8192 || height > 8192),
					'16k': width > 16384 || height > 16384
 				}
			},
			maxTextureSize: (pixel_size) => {
				const gl = document.createElement('canvas').getContext('webgl');
				const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) ?? 8192;
				return maxTextureSize < (pixel_size?.width ?? 0) || maxTextureSize < (pixel_size?.height ?? 0);
			}
		}
	}

	_setRequiresRegeneration = (event) => {
		// If no scene data, ignore
		if (this.sceneOptions == null) return;
		const elem = event.target.closest(`#${MODULE.ID}-dialog`);
		const seed = elem.querySelector('aside input[type="text"][name="seed"]').value?.length > 0 ? elem.querySelector('aside input[type="text"][name="seed"]').value : this.sceneOptions.flags[MODULE.ID].seed_string;
		const checkGenerationData = this.getGenerationProps(elem, seed);

		this._vue.store.requiresRegeneration = !(JSON.stringify(this.generationOptions) == JSON.stringify(checkGenerationData));

		// Handle Generation Button State
		const generateBtn = elem.querySelector(`aside .button-group button[id="${MODULE.ID}-btn-generate"]`);
		if (this._vue.store.requiresRegeneration) {
			generateBtn.innerHTML = `<i class="fa-light fa-dungeon"></i> ${MODULE.localize(`dialog.buttons.generate`)}`;
			generateBtn.removeAttribute('data-tooltip');
		}else {
			generateBtn.innerHTML = `<i class="fa-light fa-dungeon"></i>`;
			generateBtn.setAttribute('data-tooltip', MODULE.localize('dialog.buttons.generate'));
		}
		// Remove Tooltip
		game.tooltip.deactivate();
	}
	
	_onInputRangeWheel = (event) => {
		if (event.target.getAttribute('name') == 'corridor-density') {
			this._vue.store.inputValues.corridor_density = event.target.value;
		}else if (event.target.getAttribute('name') == 'egress') {
			this._vue.store.inputValues.egress = event.target.value;
		}

		// Check if Scene Needs to be Regenerated
		this._setRequiresRegeneration(event);
	}

	_onchangeGenType = (event) => {
		const genType = event.target.value;
		// Update Gen Type
		this._vue.store.genType = genType;

		// Get New Options
		this._vue.store.themes = this.getThemes(genType);
		this._vue.store.maxSizes = this.getMapSizes(genType);
		this._vue.store.tileSizes = this.getTileSizes(genType);

		// Check if Scene Needs to be Regenerated
		if (this.sceneOptions == null) return;
		this._vue.store.requiresRegeneration = true;
		setTimeout(() => this._setRequiresRegeneration(event), 100);
	}

	_onMountImage = (elem) => {
		this.imagePanZoom = Panzoom(elem, this.PanZoomOptions ?? {});
		elem.closest('main').addEventListener('wheel', this.imagePanZoom.zoomWithWheel);
	}

	async getMapFromAPI(options, callCount=0) {
		return await fetch(`${MODULE.API}/fvtt_${this._vue.store.genType}/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(options)
		})
		.then(response => response.json())
		.then(response => response)
		.catch(async error => {
			// increase Call Count
			callCount = callCount + 1;
			if (callCount >= this.maxCallCount) {
				ui.notifications.error('DunGen failed to generate this map, please try generating a new map.');
				return undefined
			} 
			else {
				ui.notifications.warn('DunGen is still building this map, please wait.');
				return await this.getMapFromAPI(options, callCount);
			} 
		})
	} 

	_generateDungeon = async (event, seed=randomID(12)) => {
		const elem = event.target.closest(`#${MODULE.ID}-dialog`);
		const generateBtn = elem.querySelector(`aside .button-group button[id="${MODULE.ID}-btn-generate"]`);

		// Set Theme
		elem.querySelector('main').setAttribute('data-theme', 'none');

		// Remove Tooltip
		generateBtn.removeAttribute('data-tooltip');
		game.tooltip.deactivate();

		// Disable Button
		generateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i> ${MODULE.localize('dialog.buttons.building')}`;
		
		// Disable Inputs
		this._vue.store.isDisabled = true;

		const defaultURL = `/modules/${MODULE.ID}/images/logo.webp`;
		elem.querySelector('main img').setAttribute('src', defaultURL);
			
		// Reset Zoom and Pan
		this.imagePanZoom.zoom(1);
		this.imagePanZoom.pan(0, 0);

		// Get Generation Options
		this.generationOptions = this.getGenerationProps(elem, seed);

		// Hide Notifications
		this._vue.store.requiresRegeneration = false;
		this._vue.store.mapDetails = false;

		/////--------------------------------------
		const response = await this.getMapFromAPI(this.generationOptions);
		if (typeof response === 'undefined') {
			// Enable Inputs
			this._vue.store.isDisabled = false;

			return false;
		}

		// Update Image
		if (!(response?.image_url ?? false)) return;
		elem.querySelector('main img').setAttribute('src', `data:image/jpeg;charset=utf-8;base64,${response?.image_encoded}`);

		// Set Theme
		elem.querySelector('main').setAttribute('data-theme', this.generationOptions.theme);

		// Fill Seed with Response
		//elem.querySelector('aside input[type="text"][name="seed"]').value = response.seed_string;
		response.max_tile_size = response.max_tile_size.split(' x ');

		this._vue.store.mapDetails = {
			file_size: response.file_size,
			max_tile_size: response.max_tile_size,
			pixel_size: {
				height: response.max_tile_size[1] * parseInt(elem.querySelector('aside select[name="tile_size"]').value),
				width: response.max_tile_size[0] * parseInt(elem.querySelector('aside select[name="tile_size"]').value)
			},
			seed_string: response.seed_string
		};

		this.sceneOptions = {
			background: {
				src: `data:image/jpeg;charset=utf-8;base64,${response?.image_encoded}`
			},
			flags: {
				[`${MODULE.ID}`]: mergeObject( {
					generationDetails: this.generationOptions,
					image_url: `${MODULE.API.replace('/api', '')}/${response.image_url.replace('../', '')}`,
				}, this._vue.store.mapDetails, { inplace: false })
			},
			grid: {
				type: 1, // 0: Gridless, 1: Square, 2: Hexagonal Rows - Odd, 3: Hexagonal Rows - Even, 4: Hexagonal Columns - Odd, 5: Hexagonal Columns - Even
				size: parseInt(elem.querySelector('aside select[name="tile_size"]').value),
			},
			height: this._vue.store.mapDetails.pixel_size.height,
			name: elem.querySelector('input[type="text"][name="name"').value,
			width: this._vue.store.mapDetails.pixel_size.height,
		};

		if (elem.querySelector('aside select[name="folder"]').value.length > 0) {
			this.sceneOptions.folder = game.folders.find(folder => folder.type === 'Scene' && folder.id == elem.querySelector('aside select[name="folder"]').value);
		}

		// Set Requires Regeneration to False
		this._vue.store.requiresRegeneration = false;

		// Enable Button
		generateBtn.innerHTML = `<i class="fa-light fa-dungeon"></i>`;
		generateBtn.setAttribute('data-tooltip', MODULE.localize('dialog.buttons.generate'));

		// Enable Inputs
		this._vue.store.isDisabled = false;
	}

	_createScene = async (event) => {
		event.preventDefault();
		const elem = event.target.closest(`#${MODULE.ID}-dialog`);

		// Disable Inputs
		this._vue.store.isDisabled = true;

		// Update Scene Name
		this.sceneOptions.name = elem.querySelector('input[type="text"][name="name"').value;

		// If Scene Name is Blank, Use Default Name
		if (this.sceneOptions.name.length == 0) {
			this.sceneOptions.name = game.i18n.format("DOCUMENT.New", {type: game.i18n.translations.DOCUMENT.Scene});
			if (game.scenes?.size ?? 0 > 0) this.sceneOptions.name += ` (${game.scenes?.size + 1})`;
		}

		// Handle for Scene Folder
		if (elem.querySelector('aside select[name="folder"]').value.length > 0) {
			this.sceneOptions.folder = game.folders.find(folder => folder.type === 'Scene' && folder.id == elem.querySelector('aside select[name="folder"]').value);
		}

		// Get Cave Texture
		if (this._vue.store.genType == 'cave') {
			this.sceneOptions.flags[MODULE.ID] = await this.getCaveTexture(this.generationOptions);
			this.sceneOptions.background.src = `data:image/jpeg;charset=utf-8;base64,${this.sceneOptions.flags[MODULE.ID]?.image_encoded}`;
		}

		// Save Image to Server
		const fileDetails = await this.createImage(this.sceneOptions.background.src, this.sceneOptions.flags[MODULE.ID].image_url);

		// Update Background Image Source
		this.sceneOptions.background.src = fileDetails?.path ?? '';

		// Get Map Walls
		if (elem.querySelector('input[type="checkbox"][name="green_path"').checked) {
			this.sceneOptions.walls = await this.getWallData(this.generationOptions);
		}

		// Create Scene
		const scene = await Scene.create(mergeObject({ type: 'base' }, this.sceneOptions));

		// Open Scene Config Window
		await scene.sheet.render(true);

		return await super.close();
	}

	async getWallData(generationOptions) {
		return await fetch(`${MODULE.API}/fvtt_${this._vue.store.genType}/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(mergeObject(generationOptions, { 
				theme_selected: this._vue.store.genType == 'dungeon' ? 'mask' : 'original',
				green_path: 'fvtt'
			 }))
		})
		.then(response => response.json())
		.then(response => response?.walls ?? []);
	}

	async getCaveTexture(generationOptions) {
		return await fetch(`${MODULE.API}/cave/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(mergeObject(generationOptions, { layout: false, }))
		})
		.then(response => response.json())
		.then(response => {
			return response;
		});
	}

	async createSceneFolder(folderPath) {
		// Clean up Path Structure
		//folderPath = folderPath.replace(/[^a-z0-9 -]/gi, '');
		const pathExists = await FilePicker.browse('user', `${MODULE.setting('scene_storage')}`, {}).then(response => {
			return response.files;
		}).then(file => file).catch((error) => {
			return false;
		});

		if (!pathExists) await FilePicker.createDirectory('user', `${MODULE.setting('scene_storage')}`, {});

		return `${MODULE.setting('scene_storage')}`;
	}

	async createImage(fileURL, fileName) {
		fileName = fileName.split('/').pop();
		const target = await this.createSceneFolder();
		const file = await fetch(fileURL)
            .then(response => response.arrayBuffer())
            .then(buffer => new File([buffer], fileName, { type: 'image/jpeg' }));

		return await FilePicker.upload('data', target, file);
	}

	activateListeners(html) {
		// Watch for changes in Patreon Values Settings
		this._hookIds.push(['updateSetting', Hooks.on('updateSetting', async (setting, value, options, user) => {
			if (setting.key != `${MODULE.ID}.patreon_values`) return;

			this._vue.store.tileSizes = this.getTileSizes(this._vue.store.genType);
			this._vue.store.hasWallsPermission = !MODULE.setting('patreon_values')?.token_expired && (MODULE.setting('patreon_values')?.patreon_features ?? []).includes('Automatic Walls');
		})]);

		// Watch For New Scene Folders
		['create', 'update', 'delete'].forEach(method => {
			this._hookIds.push([`${method}Folder`, Hooks.on(`${method}Folder`, async (folder, options, userId) => {
				if (folder.type != 'Scene') return;

				this._vue.store.sceneFolders = game.folders.filter(folder => folder.type === 'Scene').map(folder => { return { id: folder.id, name: folder.name } });
			})]);
		});

		// Focus on Best Input
		if (!this.data.name) html[0].querySelector('aside input[name="name"]').focus();
		else if (!this.data.folder) html[0].querySelector('aside select[name="folder"]').focus();
		else html[0].querySelector('aside input[type="radio"][name="gen_type"][value="dungeon"]').focus();
	}

	async close(options={}) {
		// Remove Hooks
		this._hookIds.forEach(hookId => Hooks.off(...hookId));

		return await super.close();
	}
}// GET MODULE CORE

// FOUNDRY HOOKS -> SETUP
Hooks.once('setup', async () => {
	const getTokenData = async (patreon_token) => {
		return await fetch(`${MODULE.API}fvtt_token/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ patreon_token: patreon_token })
		})
		.then(response => response.json());
	};

	MODULE.setting('register', 'scene_storage', {
		type: String,
		default: "DunGen Scenes",
		scope: 'world',
		filePicker: "folder"
	});

	MODULE.setting('register', 'show_in_sidebar', {
		type: Boolean,
		default: true,
		scope: 'world',
		config: true,
		onChange: async (value) => {
			const sceneElem = document.querySelector('#sidebar section.tab[data-tab="scenes"]');
			if (value) {
				// Handle for DDB Importer adding click event to header-actions instead of header-actions > button
				Array.from(sceneElem.querySelectorAll('.header-actions')).pop().insertAdjacentHTML('beforeend', `<button class="create-dungen" data-button="dungen">
					<i class="fa-light fa-dungeon"></i> ${MODULE.TITLE}
				</button>`);
				sceneElem.querySelector('.header-actions.action-buttons button[data-button="dungen"]').addEventListener('click', (event) => {
					new DunGenTesting({ name: '', folder: '' }).render(true);
				});
			}else {
				sceneElem.querySelector('.header-actions.action-buttons button[data-button="dungen"]')?.remove();
			}
		}
	});

	MODULE.setting('register', 'patreon_token', {
		type: String,
		default: '',
		scope: 'world',
		onChange: async (value) => {
			if (value == '') return MODULE.setting('patreon_values', {});

			// Update Patreon Values
			MODULE.setting('patreon_values', await getTokenData(value));
		},
	});

	MODULE.setting('register', 'patreon_values', {
		type: Object,
		default: {},
		scope: 'world',
		config: false
	});

	// Check Patreon Status on Ready
	Hooks.once('ready', async () => {
		// No Key, Don't need to do anything
		if (MODULE.setting('patreon_token') == '') return;

		// If there is no token data, grab it
		if (isEmpty(MODULE.setting('patreon_values'))) {
			await MODULE.setting('patreon_values', await getTokenData(MODULE.setting('patreon_token')));
		}

		// We don't need to worry about anything, because the token is expired already
		if (MODULE.setting('patreon_values')?.token_expired ?? false) return;

		// Check if the token is still valid
		if (new Date(MODULE.setting('patreon_values').expiry) < (new Date()).setHours(0, 0, 0, 0)) {
			ui.notifications.warn(`<strong>${MODULE.TITLE}</strong> ${MODULE.localize('notifications.token_expired')}`);
			
			MODULE.setting('patreon_values', mergeObject(MODULE.setting('patreon_values') ,{
				"token_expired": true,
			}));
		}		
	});
	
	// Handle Settings Config Window
	Hooks.on('renderSettingsConfig', async (app, elem, options) => {
		// User is not a Game Master and can not create Scenes
		if (!game.user.isGM) return;

		// Don't do Anything if no values exists
		if (isEmpty(MODULE.setting('patreon_values'))) return;

		// Check out if Pledge is Unknown
		// Check out if Pledge Features is Unknown
		// Check out if Pledge Features is Unknown
		if ((!MODULE.setting('patreon_values')?.patreon_pledge ?? false)
			&&(!MODULE.setting('patreon_values')?.patreon_features ?? false)
			&& (new Date(MODULE.setting('patreon_values')?.expiry ?? '') == 'Invalid Date')) {

			elem[0].querySelector(`section[data-tab="${MODULE.ID}"] .form-group:last-of-type`).insertAdjacentHTML('afterend', `<div class="form-group notification error">
				<div><strong>${MODULE.TITLE}</strong> ${MODULE.localize('notifications.invalid_token_data')}</div>
			</div>`);
		}else {
			elem[0].querySelector(`section[data-tab="${MODULE.ID}"] .form-group:last-of-type`).insertAdjacentHTML('afterend', `<div class="form-group patreon-status">
				${new Date(MODULE.setting('patreon_values').expiry) < (new Date()).setHours(0, 0, 0, 0) ? `<div class="form-group notification warning"><div>${MODULE.localize('notifications.expired_token_data')}</div></div>`: ''}
				<div><strong>${MODULE.localize('settings.patreon.tier')}:</strong> ${MODULE.setting('patreon_values')?.patreon_pledge ?? ''}</div>
				<div><strong>${MODULE.localize('settings.patreon.features')}:</strong> ${(MODULE.setting('patreon_values')?.patreon_features ?? []).join(', ')}</div>
				<div><strong>${MODULE.localize('settings.patreon.expires')}:</strong> ${(new Date(MODULE.setting('patreon_values')?.expiry ?? '')).toLocaleDateString()}</div>
			</div>`);
		}
	});

	// Handle Adding Button to Sidebar Tab
	Hooks.on('renderSidebarTab', async (app, elem, options) => {
		if (app.id !== 'scenes' || !MODULE.setting('show_in_sidebar') || !game.user.isGM) return;
		
		// Handle for DDB Importer adding click event to header-actions instead of header-actions > button
		Array.from(elem[0].querySelectorAll('.header-actions')).pop().insertAdjacentHTML('beforeend', `<button class="dialog-button" data-button="dungen">
			<i class="fa-light fa-dungeon"></i> DunGen
		</button>`);
		elem[0].querySelector('.header-actions.action-buttons button[data-button="dungen"]').addEventListener('click', (event) => {
			new DunGenTesting({ name: '', folder: '' }).render(true);
		});
	});
});// SPDX-License-Identifier: MIT

// A shim for the libWrapper library
let libWrapper = undefined;
const TGT_SPLIT_RE   = new RegExp("([^.[]+|\\[('([^'\\\\]|\\\\.)+?'|\"([^\"\\\\]|\\\\.)+?\")\\])", 'g');
const TGT_CLEANUP_RE = new RegExp("(^\\['|'\\]$|^\\[\"|\"\\]$)", 'g');

// Main shim code
Hooks.once('init', () => {
	// Check if the real module is already loaded - if so, use it
	if(globalThis.libWrapper && !(globalThis.libWrapper.is_fallback ?? true)) {
		libWrapper = globalThis.libWrapper;
		return;
	}

	// Fallback implementation
	libWrapper = class {
		static get is_fallback() { return true };

		static get WRAPPER()  { return 'WRAPPER'  };
		static get MIXED()    { return 'MIXED'    };
		static get OVERRIDE() { return 'OVERRIDE' };

		static register(package_id, target, fn, type="MIXED", {chain=undefined, bind=[]}={}) {
			const is_setter = target.endsWith('#set');
			target = !is_setter ? target : target.slice(0, -4);
			const split = target.match(TGT_SPLIT_RE).map((x)=>x.replace(/\\(.)/g, '$1').replace(TGT_CLEANUP_RE,''));
			const root_nm = split.splice(0,1)[0];

			let obj, fn_name;
			if(split.length == 0) {
				obj = globalThis;
				fn_name = root_nm;
			}
			else {
				const _eval = eval;
				fn_name = split.pop();
				obj = split.reduce((x,y)=>x[y], globalThis[root_nm] ?? _eval(root_nm));
			}

			let iObj = obj;
			let descriptor = null;
			while(iObj) {
				descriptor = Object.getOwnPropertyDescriptor(iObj, fn_name);
				if(descriptor) break;
				iObj = Object.getPrototypeOf(iObj);
			}
			if(!descriptor || descriptor?.configurable === false) throw new Error(`libWrapper Shim: '${target}' does not exist, could not be found, or has a non-configurable descriptor.`);

			let original = null;
			const wrapper = (chain ?? (type.toUpperCase?.() != 'OVERRIDE' && type != 3)) ?
				function(...args) { return fn.call(this, original.bind(this), ...bind, ...args); } :
				function(...args) { return fn.call(this, ...bind, ...args); }
			;

			if(!is_setter) {
				if(descriptor.value) {
					original = descriptor.value;
					descriptor.value = wrapper;
				}
				else {
					original = descriptor.get;
					descriptor.get = wrapper;
				}
			}
			else {
				if(!descriptor.set) throw new Error(`libWrapper Shim: '${target}' does not have a setter`);
				original = descriptor.set;
				descriptor.set = wrapper;
			}

			descriptor.configurable = true;
			Object.defineProperty(obj, fn_name, descriptor);
		}
	};

	//************** USER CUSTOMIZABLE:
	// Set up the ready hook that shows the "libWrapper not installed" warning dialog. Remove if undesired.
	{
		//************** USER CUSTOMIZABLE:
		// Package ID & Package Title - by default attempts to auto-detect, but you might want to hardcode your package ID and title here to avoid potential auto-detect issues
		const [PACKAGE_ID, PACKAGE_TITLE] = (()=>{
			const match = (import.meta?.url ?? Error().stack)?.match(/\/(worlds|systems|modules)\/(.+)(?=\/)/i);
			if(match?.length !== 3) return [null,null];
			const dirs = match[2].split('/');
			if(match[1] === 'worlds') return dirs.find(n => n && game.world.id === n) ? [game.world.id, game.world.title] : [null,null];
			if(match[1] === 'systems') return dirs.find(n => n && game.system.id === n) ? [game.system.id, game.system.title ?? game.system.data.title] : [null,null];
			const id = dirs.find(n => n && game.modules.has(n));
			const mdl = game.modules.get(id);
			return [id, mdl?.title ?? mdl?.data?.title];
		})();

		if(!PACKAGE_ID || !PACKAGE_TITLE) {
			console.error("libWrapper Shim: Could not auto-detect package ID and/or title. The libWrapper fallback warning dialog will be disabled.");
			return;
		}

		/*Hooks.once('ready', () => {
			//************** USER CUSTOMIZABLE:
			// Title and message for the dialog shown when the real libWrapper is not installed.
			const FALLBACK_MESSAGE_TITLE = PACKAGE_TITLE;
			const FALLBACK_MESSAGE = `
				<p><b>'${PACKAGE_TITLE}' depends on the 'libWrapper' module, which is not present.</b></p>
				<p>A fallback implementation will be used, which increases the chance of compatibility issues with other modules.</p>
				<small><p>'libWrapper' is a library which provides package developers with a simple way to modify core Foundry VTT code, while reducing the likelihood of conflict with other packages.</p>
				<p>You can install it from the "Add-on Modules" tab in the <a href="javascript:game.shutDown()">Foundry VTT Setup</a>, from the <a href="https://foundryvtt.com/packages/lib-wrapper">Foundry VTT package repository</a>, or from <a href="https://github.com/ruipin/fvtt-lib-wrapper/">libWrapper's Github page</a>.</p></small>
			`;

			// Settings key used for the "Don't remind me again" setting
			const DONT_REMIND_AGAIN_KEY = "libwrapper-dont-remind-again";

			// Dialog code
			console.warn(`${PACKAGE_TITLE}: libWrapper not present, using fallback implementation.`);
			game.settings.register(PACKAGE_ID, DONT_REMIND_AGAIN_KEY, { name: '', default: false, type: Boolean, scope: 'world', config: false });
			if(game.user.isGM && !game.settings.get(PACKAGE_ID, DONT_REMIND_AGAIN_KEY)) {
				new Dialog({
					title: FALLBACK_MESSAGE_TITLE,
					content: FALLBACK_MESSAGE, buttons: {
						ok: { icon: '<i class="fas fa-check"></i>', label: 'Understood' },
						dont_remind: { icon: '<i class="fas fa-times"></i>', label: "Don't remind me again", callback: () => game.settings.set(PACKAGE_ID, DONT_REMIND_AGAIN_KEY, true) }
					}
				}).render(true);
			}
		});*/
	}
});// GET MODULE FUNCTIONS

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// socketlib HOOKS -> socketlib.ready
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
Hooks.once('socketlib.ready', () => {
	MODULE.debug('SOCKETLIB Ready - SOCKET'); // WONT REGISTER CAUSE CALL HAPPENS WAY TO EARLY
	CORE.registerSocketLib();
});

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// 🧙 DEVELOPER MODE HOOKS -> devModeReady
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MODULE.ID, 'level', {
		choiceLabelOverrides: {
			0: 'NONE',
			1: 'ERROR',
			2: 'WARN',
			3: 'DEBUG',
			4: 'INFO',
			5: 'ALL'
		}
	});
});

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// FOUNDRY HOOKS -> READY
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
Hooks.once('ready', async () => {
	// User is not a Game Master and can not create Scenes
	if (!game.user.isGM) return;

	// We have libWrapper... Override Scene.createDialog
	libWrapper.register(MODULE.ID, 'Scene.createDialog', async function (data={}, {parent=null, pack=null, ...options}={}) {
		// Collect data
		const documentName = this.metadata.name;
		const types = game.documentTypes[documentName];
		const folders = parent ? [] : game.folders.filter(f => (f.type === documentName) && f.displayed);
		const label = game.i18n.localize(this.metadata.label);
		const title = game.i18n.format("DOCUMENT.Create", {type: label});

		// Render the document creation form
		const html = await renderTemplate("templates/sidebar/document-create.html", {
			folders,
			name: data.name || game.i18n.format("DOCUMENT.New", {type: label}),
			folder: data.folder,
			hasFolders: folders.length >= 1,
			type: data.type || CONFIG[documentName]?.defaultType || types[0],
			types: types.reduce((obj, t) => {
				const label = CONFIG[documentName]?.typeLabels?.[t] ?? t;
				obj[t] = game.i18n.has(label) ? game.i18n.localize(label) : t;
				return obj;
			}, {}),
			hasTypes: types.length > 1
		});

		// Render the confirmation dialog window
		return Dialog.confirm({
			title: title,
			content: html,
			render: (html) => { 
				// Update Confirm Buttons Text and Icons
				html[2].querySelector('button[data-button="yes"]').innerHTML = `<i class="fas fa-check"></i> ${title}`;
				html[2].querySelector('button[data-button="no"]').innerHTML = `<i class="fa-light fa-dungeon"></i> ${MODULE.TITLE}`;
			},
			yes: html => {
				// Bind Yes Button to Default Create Scene Logic
				const form = html[0].querySelector("form");
				const fd = new FormDataExtended(form);
				foundry.utils.mergeObject(data, fd.object, {inplace: true});
				if ( !data.folder ) delete data.folder;
				if ( types.length === 1 ) data.type = types[0];
				if ( !data.name?.trim() ) data.name = this.defaultName();
				return this.create(data, {parent, pack, renderSheet: true});
			},
			no: html => {
				// Bind No Button to Opening a New DunGen Dialog
				new DunGenTesting({
					name: html[0].querySelector('input[name="name"]').value ?? '',
					folder: html[0].querySelector('select[name="folder"]').value ?? ''
				}).render(true);
			},
			rejectClose: false,
			options
		});
	}, 'OVERRIDE');
});

Hooks.once('ready', async () => {
	// User is not a Game Master and can not create Scenes
	if (!game.user.isGM) return;
});

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// FOUNDRY HOOKS -> MODULE FUNCTIONS
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */