import { createApp, reactive } from './petite-vue.es.js';
export const pVue = {
    template: {
        cache: new Map,
        get: async e => pVue.template.cache.has(e) ? pVue.template.cache.get(e) : await fetch(e).then(e => {
            if (!e.ok) throw Error(e.statusText);
            return e.text()
        }).then(t => (pVue.template.cache.set(e, t), pVue.template.cache.get(e))).catch(e => (console.error(e), !1)),
        set: async e => (pVue.template.cache.has(e) && pVue.template.cache.delete(e), pVue.template.cache.get(e)),
        async delete(e) {
            pVue.template.cache.delete(e)
        }
    },
    helpers: {
        localize: (e, t = {}) => (foundry.utils?.isEmpty ?? foundry.utils?.isObjectEmpty)(t.hash ?? {}) ? game.i18n.localize(e) : game.i18n.format(e, t),
        l: (...e) => pVue.helpers.localize(...e)
    }
};
export class VueApplication extends Application {
    constructor(...e) {
        super(...e)
    }
    get store() {
        return this._vue.store
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["vue-window-app"],
            submitOnClose: !1,
            submitOnInput: !1,
            autoUpdate: !1
        })
    }
    async _renderInner(e) {
        let t = await pVue.template.get(this.template);
        if ("" === t) throw Error(`No data was returned from template ${this.template}`);
        let s = Object.assign(document.createElement("div"), {
                innerHTML: `<div v-scope @vue:mounted="mounted($el)" @vue:unmounted="unmounted($el)">${t}</div>`
            }),
            i = reactive(e);
        return console.log(i), this._vue = {
            store: i,
            app: null
        }, $(s.firstChild)
    }
    async _activateCoreListeners(e) {
        super._activateCoreListeners(e);
        let t = e[0];
        this._vue.app = createApp(mergeObject({
            store: this._vue.store
        }, mergeObject(pVue.helpers, {
            mounted: function(e) {
                Hooks.callAll("mountedVueApplication", this, e)
            },
            unmounted: function(e) {
                Hooks.callAll("unmountedVueApplication", this, e)
            }
        }))).mount(t.querySelector(".window-content > div"))
    }
    async close(e = {}) {
        let t = this.element[0],
            s = Application.RENDER_STATES;
        if (e.force || [s.RENDERED, s.ERROR].includes(this._state)) {
            if (this._state = s.CLOSING, !t) return this._state = s.CLOSED;
            for (let i of this.constructor._getInheritanceChain()) Hooks.call(`close${i.name}`, this, this.element);
            return await new Promise(e => {
                t.addEventListener("transitionend", i => {
                    this._vue.app.unmount(), this._vue = null, t.remove(), this._element = null, delete ui.windows[this.appId], this._minimized = !1, this._scrollPositions = null, this._state = s.CLOSED, e()
                }, {
                    once: !0
                }), Object.assign(t.style, {
                    transformOrigin: "top right",
                    transition: "opacity 0.2s ease-in-out, height 0.2s ease-in-out",
                    opacity: 0,
                    height: 0
                })
            })
        }
    }
}
export class VueFormApplication extends FormApplication {
    constructor(...e) {
        super(...e), this._hookIds = []
    }
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["vue-window-app"],
            submitOnInput: !1,
            autoUpdate: !1
        })
    }
    get store() {
        return this._vue.store
    }
    getData(e = {}) {
        return {
            object: this.object?.toObject() ?? this.object,
            options: this.options,
            title: this.title
        }
    }
    async _renderInner(e) {
        let t = await pVue.template.get(this.template);
        if ("" === t) throw Error(`No data was returned from template ${this.template}`);
        let s = Object.assign(document.createElement("div"), {
                innerHTML: `<form @vue:mounted="mounted($el)" @vue:unmounted="unmounted($el)">${t}</form>`
            }),
            i = reactive(e.object);
        return this._vue = {
            store: i,
            app: createApp({
                store: i,
                ...{
                    ...pVue.helpers,
                    mounted: function(e) {
                        Hooks.callAll("mountedVueFormApplication", this, e)
                    },
                    unmounted: function(e) {
                        Hooks.callAll("unmountedVueFormApplication", this, e)
                    }
                }
            }).mount(s.firstChild)
        }, this.form = s.querySelector("form"), $(s.firstChild)
    }
    async _activateCoreListeners(e) {
        if (super._activateCoreListeners(e), this.options.autoSync && this.object?.update)
            for (let t of Object.values(this.object.schema.fields)) {
                if (!t?.element?.documentName) continue;
                let s = ["create", "update", "delete"];
                s.forEach(e => {
                    let s = `${e}${t.element.documentName}`;
                    this._hookIds.push([s, Hooks.on(s, (e, t, s, i) => {
                        e.parent == this.object && mergeObject(this._vue.store, e.parent.toObject(), {
                            performDeletions: !0
                        })
                    })])
                })
            }
    }
    async _updateObject() {
        this.object?.update && this._vue.store && await this.object.update(this._vue.store)
    }
    async close(e = {}) {
        let t = this.element[0],
            s = Application.RENDER_STATES,
            i = e.submit ?? this.options.submitOnClose;
        for (let n of (i && await this.submit({
                preventClose: !0,
                preventRender: !0
            }), this.filepickers)) n.close();
        for (let o of (this.filepickers = [], Object.values(this.editors))) o.mce && o.mce.destroy();
        if (this.editors = {}, e.force || [s.RENDERED, s.ERROR].includes(this._state)) {
            if (this._state = s.CLOSING, !t) return this._state = s.CLOSED;
            for (let a of this.constructor._getInheritanceChain()) Hooks.call(`close${a.name}`, this, this.element);
            return await new Promise(e => {
                t.addEventListener("transitionend", i => {
                    this._vue.app.unmount(), this._vue = null, t.remove(), this._element = null, delete ui.windows[this.appId], this._minimized = !1, this._scrollPositions = null, this._state = s.CLOSED, e()
                }, {
                    once: !0
                }), Object.assign(t.style, {
                    transformOrigin: "top right",
                    transition: "opacity 0.2s ease-in-out, height 0.2s ease-in-out",
                    opacity: 0,
                    height: 0
                })
            })
        }
    }
}