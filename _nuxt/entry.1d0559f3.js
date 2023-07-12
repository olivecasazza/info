var Hg=Object.defineProperty;var kg=(t,e,n)=>e in t?Hg(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var nt=(t,e,n)=>(kg(t,typeof e!="symbol"?e+"":e,n),n);function Oc(t,e){const n=Object.create(null),i=t.split(",");for(let r=0;r<i.length;r++)n[i[r]]=!0;return e?r=>!!n[r.toLowerCase()]:r=>!!n[r]}const it={},wr=[],_n=()=>{},zg=()=>!1,Gg=/^on[^a-z]/,Gs=t=>Gg.test(t),Fc=t=>t.startsWith("onUpdate:"),mt=Object.assign,Bc=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Vg=Object.prototype.hasOwnProperty,Ye=(t,e)=>Vg.call(t,e),Ie=Array.isArray,Ar=t=>Vs(t)==="[object Map]",Pd=t=>Vs(t)==="[object Set]",Wg=t=>Vs(t)==="[object RegExp]",Be=t=>typeof t=="function",at=t=>typeof t=="string",Hc=t=>typeof t=="symbol",tt=t=>t!==null&&typeof t=="object",Ld=t=>tt(t)&&Be(t.then)&&Be(t.catch),Dd=Object.prototype.toString,Vs=t=>Dd.call(t),Xg=t=>Vs(t).slice(8,-1),Id=t=>Vs(t)==="[object Object]",kc=t=>at(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,hs=Oc(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),ga=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},jg=/-(\w)/g,An=ga(t=>t.replace(jg,(e,n)=>n?n.toUpperCase():"")),qg=/\B([A-Z])/g,Xr=ga(t=>t.replace(qg,"-$1").toLowerCase()),_a=ga(t=>t.charAt(0).toUpperCase()+t.slice(1)),Va=ga(t=>t?`on${_a(t)}`:""),Rs=(t,e)=>!Object.is(t,e),ds=(t,e)=>{for(let n=0;n<t.length;n++)t[n](e)},Jo=(t,e,n)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:n})},$g=t=>{const e=parseFloat(t);return isNaN(e)?t:e},Ud=t=>{const e=at(t)?Number(t):NaN;return isNaN(e)?t:e};let Ru;const Gl=()=>Ru||(Ru=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function va(t){if(Ie(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],r=at(i)?Jg(i):va(i);if(r)for(const s in r)e[s]=r[s]}return e}else{if(at(t))return t;if(tt(t))return t}}const Yg=/;(?![^(]*\))/g,Kg=/:([^]+)/,Zg=/\/\*[^]*?\*\//g;function Jg(t){const e={};return t.replace(Zg,"").split(Yg).forEach(n=>{if(n){const i=n.split(Kg);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function xa(t){let e="";if(at(t))e=t;else if(Ie(t))for(let n=0;n<t.length;n++){const i=xa(t[n]);i&&(e+=i+" ")}else if(tt(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}function Qg(t){if(!t)return null;let{class:e,style:n}=t;return e&&!at(e)&&(t.class=xa(e)),n&&(t.style=va(n)),t}const e_="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",t_=Oc(e_);function Nd(t){return!!t||t===""}const Cu=t=>at(t)?t:t==null?"":Ie(t)||tt(t)&&(t.toString===Dd||!Be(t.toString))?JSON.stringify(t,Od,2):String(t),Od=(t,e)=>e&&e.__v_isRef?Od(t,e.value):Ar(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[i,r])=>(n[`${i} =>`]=r,n),{})}:Pd(e)?{[`Set(${e.size})`]:[...e.values()]}:tt(e)&&!Ie(e)&&!Id(e)?String(e):e;let qt;class Fd{constructor(e=!1){this.detached=e,this._active=!0,this.effects=[],this.cleanups=[],this.parent=qt,!e&&qt&&(this.index=(qt.scopes||(qt.scopes=[])).push(this)-1)}get active(){return this._active}run(e){if(this._active){const n=qt;try{return qt=this,e()}finally{qt=n}}}on(){qt=this}off(){qt=this.parent}stop(e){if(this._active){let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.scopes)for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0,this._active=!1}}}function Bd(t){return new Fd(t)}function n_(t,e=qt){e&&e.active&&e.effects.push(t)}function Hd(){return qt}function i_(t){qt&&qt.cleanups.push(t)}const zc=t=>{const e=new Set(t);return e.w=0,e.n=0,e},kd=t=>(t.w&xi)>0,zd=t=>(t.n&xi)>0,r_=({deps:t})=>{if(t.length)for(let e=0;e<t.length;e++)t[e].w|=xi},s_=t=>{const{deps:e}=t;if(e.length){let n=0;for(let i=0;i<e.length;i++){const r=e[i];kd(r)&&!zd(r)?r.delete(t):e[n++]=r,r.w&=~xi,r.n&=~xi}e.length=n}},Qo=new WeakMap;let as=0,xi=1;const Vl=30;let hn;const Bi=Symbol(""),Wl=Symbol("");class Gc{constructor(e,n=null,i){this.fn=e,this.scheduler=n,this.active=!0,this.deps=[],this.parent=void 0,n_(this,i)}run(){if(!this.active)return this.fn();let e=hn,n=mi;for(;e;){if(e===this)return;e=e.parent}try{return this.parent=hn,hn=this,mi=!0,xi=1<<++as,as<=Vl?r_(this):Pu(this),this.fn()}finally{as<=Vl&&s_(this),xi=1<<--as,hn=this.parent,mi=n,this.parent=void 0,this.deferStop&&this.stop()}}stop(){hn===this?this.deferStop=!0:this.active&&(Pu(this),this.onStop&&this.onStop(),this.active=!1)}}function Pu(t){const{deps:e}=t;if(e.length){for(let n=0;n<e.length;n++)e[n].delete(t);e.length=0}}let mi=!0;const Gd=[];function jr(){Gd.push(mi),mi=!1}function qr(){const t=Gd.pop();mi=t===void 0?!0:t}function Gt(t,e,n){if(mi&&hn){let i=Qo.get(t);i||Qo.set(t,i=new Map);let r=i.get(n);r||i.set(n,r=zc()),Vd(r)}}function Vd(t,e){let n=!1;as<=Vl?zd(t)||(t.n|=xi,n=!kd(t)):n=!t.has(hn),n&&(t.add(hn),hn.deps.push(t))}function jn(t,e,n,i,r,s){const o=Qo.get(t);if(!o)return;let a=[];if(e==="clear")a=[...o.values()];else if(n==="length"&&Ie(t)){const l=Number(i);o.forEach((c,u)=>{(u==="length"||u>=l)&&a.push(c)})}else switch(n!==void 0&&a.push(o.get(n)),e){case"add":Ie(t)?kc(n)&&a.push(o.get("length")):(a.push(o.get(Bi)),Ar(t)&&a.push(o.get(Wl)));break;case"delete":Ie(t)||(a.push(o.get(Bi)),Ar(t)&&a.push(o.get(Wl)));break;case"set":Ar(t)&&a.push(o.get(Bi));break}if(a.length===1)a[0]&&Xl(a[0]);else{const l=[];for(const c of a)c&&l.push(...c);Xl(zc(l))}}function Xl(t,e){const n=Ie(t)?t:[...t];for(const i of n)i.computed&&Lu(i);for(const i of n)i.computed||Lu(i)}function Lu(t,e){(t!==hn||t.allowRecurse)&&(t.scheduler?t.scheduler():t.run())}function o_(t,e){var n;return(n=Qo.get(t))==null?void 0:n.get(e)}const a_=Oc("__proto__,__v_isRef,__isVue"),Wd=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Hc)),l_=Vc(),c_=Vc(!1,!0),u_=Vc(!0),Du=f_();function f_(){const t={};return["includes","indexOf","lastIndexOf"].forEach(e=>{t[e]=function(...n){const i=qe(this);for(let s=0,o=this.length;s<o;s++)Gt(i,"get",s+"");const r=i[e](...n);return r===-1||r===!1?i[e](...n.map(qe)):r}}),["push","pop","shift","unshift","splice"].forEach(e=>{t[e]=function(...n){jr();const i=qe(this)[e].apply(this,n);return qr(),i}}),t}function h_(t){const e=qe(this);return Gt(e,"has",t),e.hasOwnProperty(t)}function Vc(t=!1,e=!1){return function(i,r,s){if(r==="__v_isReactive")return!t;if(r==="__v_isReadonly")return t;if(r==="__v_isShallow")return e;if(r==="__v_raw"&&s===(t?e?R_:Yd:e?$d:qd).get(i))return i;const o=Ie(i);if(!t){if(o&&Ye(Du,r))return Reflect.get(Du,r,s);if(r==="hasOwnProperty")return h_}const a=Reflect.get(i,r,s);return(Hc(r)?Wd.has(r):a_(r))||(t||Gt(i,"get",r),e)?a:rt(a)?o&&kc(r)?a:a.value:tt(a)?t?Kd(a):qn(a):a}}const d_=Xd(),p_=Xd(!0);function Xd(t=!1){return function(n,i,r,s){let o=n[i];if(Xi(o)&&rt(o)&&!rt(r))return!1;if(!t&&(!ea(r)&&!Xi(r)&&(o=qe(o),r=qe(r)),!Ie(n)&&rt(o)&&!rt(r)))return o.value=r,!0;const a=Ie(n)&&kc(i)?Number(i)<n.length:Ye(n,i),l=Reflect.set(n,i,r,s);return n===qe(s)&&(a?Rs(r,o)&&jn(n,"set",i,r):jn(n,"add",i,r)),l}}function m_(t,e){const n=Ye(t,e);t[e];const i=Reflect.deleteProperty(t,e);return i&&n&&jn(t,"delete",e,void 0),i}function g_(t,e){const n=Reflect.has(t,e);return(!Hc(e)||!Wd.has(e))&&Gt(t,"has",e),n}function __(t){return Gt(t,"iterate",Ie(t)?"length":Bi),Reflect.ownKeys(t)}const jd={get:l_,set:d_,deleteProperty:m_,has:g_,ownKeys:__},v_={get:u_,set(t,e){return!0},deleteProperty(t,e){return!0}},x_=mt({},jd,{get:c_,set:p_}),Wc=t=>t,ya=t=>Reflect.getPrototypeOf(t);function ro(t,e,n=!1,i=!1){t=t.__v_raw;const r=qe(t),s=qe(e);n||(e!==s&&Gt(r,"get",e),Gt(r,"get",s));const{has:o}=ya(r),a=i?Wc:n?qc:Cs;if(o.call(r,e))return a(t.get(e));if(o.call(r,s))return a(t.get(s));t!==r&&t.get(e)}function so(t,e=!1){const n=this.__v_raw,i=qe(n),r=qe(t);return e||(t!==r&&Gt(i,"has",t),Gt(i,"has",r)),t===r?n.has(t):n.has(t)||n.has(r)}function oo(t,e=!1){return t=t.__v_raw,!e&&Gt(qe(t),"iterate",Bi),Reflect.get(t,"size",t)}function Iu(t){t=qe(t);const e=qe(this);return ya(e).has.call(e,t)||(e.add(t),jn(e,"add",t,t)),this}function Uu(t,e){e=qe(e);const n=qe(this),{has:i,get:r}=ya(n);let s=i.call(n,t);s||(t=qe(t),s=i.call(n,t));const o=r.call(n,t);return n.set(t,e),s?Rs(e,o)&&jn(n,"set",t,e):jn(n,"add",t,e),this}function Nu(t){const e=qe(this),{has:n,get:i}=ya(e);let r=n.call(e,t);r||(t=qe(t),r=n.call(e,t)),i&&i.call(e,t);const s=e.delete(t);return r&&jn(e,"delete",t,void 0),s}function Ou(){const t=qe(this),e=t.size!==0,n=t.clear();return e&&jn(t,"clear",void 0,void 0),n}function ao(t,e){return function(i,r){const s=this,o=s.__v_raw,a=qe(o),l=e?Wc:t?qc:Cs;return!t&&Gt(a,"iterate",Bi),o.forEach((c,u)=>i.call(r,l(c),l(u),s))}}function lo(t,e,n){return function(...i){const r=this.__v_raw,s=qe(r),o=Ar(s),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=r[t](...i),u=n?Wc:e?qc:Cs;return!e&&Gt(s,"iterate",l?Wl:Bi),{next(){const{value:f,done:d}=c.next();return d?{value:f,done:d}:{value:a?[u(f[0]),u(f[1])]:u(f),done:d}},[Symbol.iterator](){return this}}}}function Zn(t){return function(...e){return t==="delete"?!1:this}}function y_(){const t={get(s){return ro(this,s)},get size(){return oo(this)},has:so,add:Iu,set:Uu,delete:Nu,clear:Ou,forEach:ao(!1,!1)},e={get(s){return ro(this,s,!1,!0)},get size(){return oo(this)},has:so,add:Iu,set:Uu,delete:Nu,clear:Ou,forEach:ao(!1,!0)},n={get(s){return ro(this,s,!0)},get size(){return oo(this,!0)},has(s){return so.call(this,s,!0)},add:Zn("add"),set:Zn("set"),delete:Zn("delete"),clear:Zn("clear"),forEach:ao(!0,!1)},i={get(s){return ro(this,s,!0,!0)},get size(){return oo(this,!0)},has(s){return so.call(this,s,!0)},add:Zn("add"),set:Zn("set"),delete:Zn("delete"),clear:Zn("clear"),forEach:ao(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(s=>{t[s]=lo(s,!1,!1),n[s]=lo(s,!0,!1),e[s]=lo(s,!1,!0),i[s]=lo(s,!0,!0)}),[t,n,e,i]}const[M_,E_,S_,b_]=y_();function Xc(t,e){const n=e?t?b_:S_:t?E_:M_;return(i,r,s)=>r==="__v_isReactive"?!t:r==="__v_isReadonly"?t:r==="__v_raw"?i:Reflect.get(Ye(n,r)&&r in i?n:i,r,s)}const T_={get:Xc(!1,!1)},w_={get:Xc(!1,!0)},A_={get:Xc(!0,!1)},qd=new WeakMap,$d=new WeakMap,Yd=new WeakMap,R_=new WeakMap;function C_(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function P_(t){return t.__v_skip||!Object.isExtensible(t)?0:C_(Xg(t))}function qn(t){return Xi(t)?t:jc(t,!1,jd,T_,qd)}function Ws(t){return jc(t,!1,x_,w_,$d)}function Kd(t){return jc(t,!0,v_,A_,Yd)}function jc(t,e,n,i,r){if(!tt(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const s=r.get(t);if(s)return s;const o=P_(t);if(o===0)return t;const a=new Proxy(t,o===2?i:n);return r.set(t,a),a}function Vn(t){return Xi(t)?Vn(t.__v_raw):!!(t&&t.__v_isReactive)}function Xi(t){return!!(t&&t.__v_isReadonly)}function ea(t){return!!(t&&t.__v_isShallow)}function Zd(t){return Vn(t)||Xi(t)}function qe(t){const e=t&&t.__v_raw;return e?qe(e):t}function Ma(t){return Jo(t,"__v_skip",!0),t}const Cs=t=>tt(t)?qn(t):t,qc=t=>tt(t)?Kd(t):t;function Jd(t){mi&&hn&&(t=qe(t),Vd(t.dep||(t.dep=zc())))}function Qd(t,e){t=qe(t);const n=t.dep;n&&Xl(n)}function rt(t){return!!(t&&t.__v_isRef===!0)}function Ke(t){return ep(t,!1)}function Ps(t){return ep(t,!0)}function ep(t,e){return rt(t)?t:new L_(t,e)}class L_{constructor(e,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?e:qe(e),this._value=n?e:Cs(e)}get value(){return Jd(this),this._value}set value(e){const n=this.__v_isShallow||ea(e)||Xi(e);e=n?e:qe(e),Rs(e,this._rawValue)&&(this._rawValue=e,this._value=n?e:Cs(e),Qd(this))}}function et(t){return rt(t)?t.value:t}const D_={get:(t,e,n)=>et(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const r=t[e];return rt(r)&&!rt(n)?(r.value=n,!0):Reflect.set(t,e,n,i)}};function tp(t){return Vn(t)?t:new Proxy(t,D_)}function I_(t){const e=Ie(t)?new Array(t.length):{};for(const n in t)e[n]=np(t,n);return e}class U_{constructor(e,n,i){this._object=e,this._key=n,this._defaultValue=i,this.__v_isRef=!0}get value(){const e=this._object[this._key];return e===void 0?this._defaultValue:e}set value(e){this._object[this._key]=e}get dep(){return o_(qe(this._object),this._key)}}class N_{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0}get value(){return this._getter()}}function $c(t,e,n){return rt(t)?t:Be(t)?new N_(t):tt(t)&&arguments.length>1?np(t,e,n):Ke(t)}function np(t,e,n){const i=t[e];return rt(i)?i:new U_(t,e,n)}class O_{constructor(e,n,i,r){this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this._dirty=!0,this.effect=new Gc(e,()=>{this._dirty||(this._dirty=!0,Qd(this))}),this.effect.computed=this,this.effect.active=this._cacheable=!r,this.__v_isReadonly=i}get value(){const e=qe(this);return Jd(e),(e._dirty||!e._cacheable)&&(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e)}}function F_(t,e,n=!1){let i,r;const s=Be(t);return s?(i=t,r=_n):(i=t.get,r=t.set),new O_(i,r,s||!r,n)}function gi(t,e,n,i){let r;try{r=i?t(...i):t()}catch(s){$r(s,e,n)}return r}function rn(t,e,n,i){if(Be(t)){const s=gi(t,e,n,i);return s&&Ld(s)&&s.catch(o=>{$r(o,e,n)}),s}const r=[];for(let s=0;s<t.length;s++)r.push(rn(t[s],e,n,i));return r}function $r(t,e,n,i=!0){const r=e?e.vnode:null;if(e){let s=e.parent;const o=e.proxy,a=n;for(;s;){const c=s.ec;if(c){for(let u=0;u<c.length;u++)if(c[u](t,o,a)===!1)return}s=s.parent}const l=e.appContext.config.errorHandler;if(l){gi(l,null,10,[t,o,a]);return}}B_(t,n,r,i)}function B_(t,e,n,i=!0){console.error(t)}let Ls=!1,jl=!1;const Rt=[];let wn=0;const Rr=[];let Hn=null,Ui=0;const ip=Promise.resolve();let Yc=null;function Yi(t){const e=Yc||ip;return t?e.then(this?t.bind(this):t):e}function H_(t){let e=wn+1,n=Rt.length;for(;e<n;){const i=e+n>>>1;Ds(Rt[i])<t?e=i+1:n=i}return e}function Ea(t){(!Rt.length||!Rt.includes(t,Ls&&t.allowRecurse?wn+1:wn))&&(t.id==null?Rt.push(t):Rt.splice(H_(t.id),0,t),rp())}function rp(){!Ls&&!jl&&(jl=!0,Yc=ip.then(op))}function k_(t){const e=Rt.indexOf(t);e>wn&&Rt.splice(e,1)}function sp(t){Ie(t)?Rr.push(...t):(!Hn||!Hn.includes(t,t.allowRecurse?Ui+1:Ui))&&Rr.push(t),rp()}function Fu(t,e=Ls?wn+1:0){for(;e<Rt.length;e++){const n=Rt[e];n&&n.pre&&(Rt.splice(e,1),e--,n())}}function ta(t){if(Rr.length){const e=[...new Set(Rr)];if(Rr.length=0,Hn){Hn.push(...e);return}for(Hn=e,Hn.sort((n,i)=>Ds(n)-Ds(i)),Ui=0;Ui<Hn.length;Ui++)Hn[Ui]();Hn=null,Ui=0}}const Ds=t=>t.id==null?1/0:t.id,z_=(t,e)=>{const n=Ds(t)-Ds(e);if(n===0){if(t.pre&&!e.pre)return-1;if(e.pre&&!t.pre)return 1}return n};function op(t){jl=!1,Ls=!0,Rt.sort(z_);const e=_n;try{for(wn=0;wn<Rt.length;wn++){const n=Rt[wn];n&&n.active!==!1&&gi(n,null,14)}}finally{wn=0,Rt.length=0,ta(),Ls=!1,Yc=null,(Rt.length||Rr.length)&&op()}}function G_(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||it;let r=n;const s=e.startsWith("update:"),o=s&&e.slice(7);if(o&&o in i){const u=`${o==="modelValue"?"model":o}Modifiers`,{number:f,trim:d}=i[u]||it;d&&(r=n.map(p=>at(p)?p.trim():p)),f&&(r=n.map($g))}let a,l=i[a=Va(e)]||i[a=Va(An(e))];!l&&s&&(l=i[a=Va(Xr(e))]),l&&rn(l,t,6,r);const c=i[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,rn(c,t,6,r)}}function ap(t,e,n=!1){const i=e.emitsCache,r=i.get(t);if(r!==void 0)return r;const s=t.emits;let o={},a=!1;if(!Be(t)){const l=c=>{const u=ap(c,e,!0);u&&(a=!0,mt(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!s&&!a?(tt(t)&&i.set(t,null),null):(Ie(s)?s.forEach(l=>o[l]=null):mt(o,s),tt(t)&&i.set(t,o),o)}function Sa(t,e){return!t||!Gs(e)?!1:(e=e.slice(2).replace(/Once$/,""),Ye(t,e[0].toLowerCase()+e.slice(1))||Ye(t,Xr(e))||Ye(t,e))}let Yt=null,ba=null;function na(t){const e=Yt;return Yt=t,ba=t&&t.type.__scopeId||null,e}function p1(t){ba=t}function m1(){ba=null}function Kc(t,e=Yt,n){if(!e||t._n)return t;const i=(...r)=>{i._d&&Zu(-1);const s=na(e);let o;try{o=t(...r)}finally{na(s),i._d&&Zu(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function Wa(t){const{type:e,vnode:n,proxy:i,withProxy:r,props:s,propsOptions:[o],slots:a,attrs:l,emit:c,render:u,renderCache:f,data:d,setupState:p,ctx:g,inheritAttrs:_}=t;let m,h;const v=na(t);try{if(n.shapeFlag&4){const y=r||i;m=Qt(u.call(y,y,f,s,p,d,g)),h=l}else{const y=e;m=Qt(y.length>1?y(s,{attrs:l,slots:a,emit:c}):y(s,null)),h=e.props?l:W_(l)}}catch(y){ms.length=0,$r(y,t,1),m=st(Ht)}let x=m;if(h&&_!==!1){const y=Object.keys(h),{shapeFlag:S}=x;y.length&&S&7&&(o&&y.some(Fc)&&(h=X_(h,o)),x=$n(x,h))}return n.dirs&&(x=$n(x),x.dirs=x.dirs?x.dirs.concat(n.dirs):n.dirs),n.transition&&(x.transition=n.transition),m=x,na(v),m}function V_(t){let e;for(let n=0;n<t.length;n++){const i=t[n];if(Ns(i)){if(i.type!==Ht||i.children==="v-if"){if(e)return;e=i}}else return}return e}const W_=t=>{let e;for(const n in t)(n==="class"||n==="style"||Gs(n))&&((e||(e={}))[n]=t[n]);return e},X_=(t,e)=>{const n={};for(const i in t)(!Fc(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function j_(t,e,n){const{props:i,children:r,component:s}=t,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?Bu(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let f=0;f<u.length;f++){const d=u[f];if(o[d]!==i[d]&&!Sa(c,d))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?Bu(i,o,c):!0:!!o;return!1}function Bu(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(e[s]!==t[s]&&!Sa(n,s))return!0}return!1}function Zc({vnode:t,parent:e},n){for(;e&&e.subTree===t;)(t=e.vnode).el=n,e=e.parent}const lp=t=>t.__isSuspense,q_={name:"Suspense",__isSuspense:!0,process(t,e,n,i,r,s,o,a,l,c){t==null?$_(e,n,i,r,s,o,a,l,c):Y_(t,e,n,i,r,o,a,l,c)},hydrate:K_,create:Jc,normalize:Z_},cp=q_;function Is(t,e){const n=t.props&&t.props[e];Be(n)&&n()}function $_(t,e,n,i,r,s,o,a,l){const{p:c,o:{createElement:u}}=l,f=u("div"),d=t.suspense=Jc(t,r,i,e,f,n,s,o,a,l);c(null,d.pendingBranch=t.ssContent,f,null,i,d,s,o),d.deps>0?(Is(t,"onPending"),Is(t,"onFallback"),c(null,t.ssFallback,e,n,i,null,s,o),Cr(d,t.ssFallback)):d.resolve(!1,!0)}function Y_(t,e,n,i,r,s,o,a,{p:l,um:c,o:{createElement:u}}){const f=e.suspense=t.suspense;f.vnode=e,e.el=t.el;const d=e.ssContent,p=e.ssFallback,{activeBranch:g,pendingBranch:_,isInFallback:m,isHydrating:h}=f;if(_)f.pendingBranch=d,dn(d,_)?(l(_,d,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0?f.resolve():m&&(l(g,p,n,i,r,null,s,o,a),Cr(f,p))):(f.pendingId++,h?(f.isHydrating=!1,f.activeBranch=_):c(_,r,f),f.deps=0,f.effects.length=0,f.hiddenContainer=u("div"),m?(l(null,d,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0?f.resolve():(l(g,p,n,i,r,null,s,o,a),Cr(f,p))):g&&dn(d,g)?(l(g,d,n,i,r,f,s,o,a),f.resolve(!0)):(l(null,d,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0&&f.resolve()));else if(g&&dn(d,g))l(g,d,n,i,r,f,s,o,a),Cr(f,d);else if(Is(e,"onPending"),f.pendingBranch=d,f.pendingId++,l(null,d,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0)f.resolve();else{const{timeout:v,pendingId:x}=f;v>0?setTimeout(()=>{f.pendingId===x&&f.fallback(p)},v):v===0&&f.fallback(p)}}function Jc(t,e,n,i,r,s,o,a,l,c,u=!1){const{p:f,m:d,um:p,n:g,o:{parentNode:_,remove:m}}=c;let h;const v=J_(t);v&&e!=null&&e.pendingBranch&&(h=e.pendingId,e.deps++);const x=t.props?Ud(t.props.timeout):void 0,y={vnode:t,parent:e,parentComponent:n,isSVG:o,container:i,hiddenContainer:r,anchor:s,deps:0,pendingId:0,timeout:typeof x=="number"?x:-1,activeBranch:null,pendingBranch:null,isInFallback:!0,isHydrating:u,isUnmounted:!1,effects:[],resolve(S=!1,R=!1){const{vnode:A,activeBranch:P,pendingBranch:E,pendingId:T,effects:F,parentComponent:H,container:N}=y;if(y.isHydrating)y.isHydrating=!1;else if(!S){const Z=P&&E.transition&&E.transition.mode==="out-in";Z&&(P.transition.afterLeave=()=>{T===y.pendingId&&d(E,N,$,0)});let{anchor:$}=y;P&&($=g(P),p(P,H,y,!0)),Z||d(E,N,$,0)}Cr(y,E),y.pendingBranch=null,y.isInFallback=!1;let U=y.parent,W=!1;for(;U;){if(U.pendingBranch){U.effects.push(...F),W=!0;break}U=U.parent}W||sp(F),y.effects=[],v&&e&&e.pendingBranch&&h===e.pendingId&&(e.deps--,e.deps===0&&!R&&e.resolve()),Is(A,"onResolve")},fallback(S){if(!y.pendingBranch)return;const{vnode:R,activeBranch:A,parentComponent:P,container:E,isSVG:T}=y;Is(R,"onFallback");const F=g(A),H=()=>{y.isInFallback&&(f(null,S,E,F,P,null,T,a,l),Cr(y,S))},N=S.transition&&S.transition.mode==="out-in";N&&(A.transition.afterLeave=H),y.isInFallback=!0,p(A,P,null,!0),N||H()},move(S,R,A){y.activeBranch&&d(y.activeBranch,S,R,A),y.container=S},next(){return y.activeBranch&&g(y.activeBranch)},registerDep(S,R){const A=!!y.pendingBranch;A&&y.deps++;const P=S.vnode.el;S.asyncDep.catch(E=>{$r(E,S,0)}).then(E=>{if(S.isUnmounted||y.isUnmounted||y.pendingId!==S.suspenseId)return;S.asyncResolved=!0;const{vnode:T}=S;Jl(S,E,!1),P&&(T.el=P);const F=!P&&S.subTree.el;R(S,T,_(P||S.subTree.el),P?null:g(S.subTree),y,o,l),F&&m(F),Zc(S,T.el),A&&--y.deps===0&&y.resolve()})},unmount(S,R){y.isUnmounted=!0,y.activeBranch&&p(y.activeBranch,n,S,R),y.pendingBranch&&p(y.pendingBranch,n,S,R)}};return y}function K_(t,e,n,i,r,s,o,a,l){const c=e.suspense=Jc(e,i,n,t.parentNode,document.createElement("div"),null,r,s,o,a,!0),u=l(t,c.pendingBranch=e.ssContent,n,c,s,o);return c.deps===0&&c.resolve(!1,!0),u}function Z_(t){const{shapeFlag:e,children:n}=t,i=e&32;t.ssContent=Hu(i?n.default:n),t.ssFallback=i?Hu(n.fallback):st(Ht)}function Hu(t){let e;if(Be(t)){const n=Or&&t._c;n&&(t._d=!1,Mt()),t=t(),n&&(t._d=!0,e=nn,Lp())}return Ie(t)&&(t=V_(t)),t=Qt(t),e&&!t.dynamicChildren&&(t.dynamicChildren=e.filter(n=>n!==t)),t}function up(t,e){e&&e.pendingBranch?Ie(t)?e.effects.push(...t):e.effects.push(t):sp(t)}function Cr(t,e){t.activeBranch=e;const{vnode:n,parentComponent:i}=t,r=n.el=e.el;i&&i.subTree===n&&(i.vnode.el=r,Zc(i,r))}function J_(t){var e;return((e=t.props)==null?void 0:e.suspensible)!=null&&t.props.suspensible!==!1}function Q_(t,e){return Qc(t,null,e)}const co={};function Hi(t,e,n){return Qc(t,e,n)}function Qc(t,e,{immediate:n,deep:i,flush:r,onTrack:s,onTrigger:o}=it){var a;const l=Hd()===((a=pt)==null?void 0:a.scope)?pt:null;let c,u=!1,f=!1;if(rt(t)?(c=()=>t.value,u=ea(t)):Vn(t)?(c=()=>t,i=!0):Ie(t)?(f=!0,u=t.some(y=>Vn(y)||ea(y)),c=()=>t.map(y=>{if(rt(y))return y.value;if(Vn(y))return Er(y);if(Be(y))return gi(y,l,2)})):Be(t)?e?c=()=>gi(t,l,2):c=()=>{if(!(l&&l.isUnmounted))return d&&d(),rn(t,l,3,[p])}:c=_n,e&&i){const y=c;c=()=>Er(y())}let d,p=y=>{d=v.onStop=()=>{gi(y,l,4)}},g;if(Br)if(p=_n,e?n&&rn(e,l,3,[c(),f?[]:void 0,p]):c(),r==="sync"){const y=Wv();g=y.__watcherHandles||(y.__watcherHandles=[])}else return _n;let _=f?new Array(t.length).fill(co):co;const m=()=>{if(v.active)if(e){const y=v.run();(i||u||(f?y.some((S,R)=>Rs(S,_[R])):Rs(y,_)))&&(d&&d(),rn(e,l,3,[y,_===co?void 0:f&&_[0]===co?[]:_,p]),_=y)}else v.run()};m.allowRecurse=!!e;let h;r==="sync"?h=m:r==="post"?h=()=>St(m,l&&l.suspense):(m.pre=!0,l&&(m.id=l.uid),h=()=>Ea(m));const v=new Gc(c,h);e?n?m():_=v.run():r==="post"?St(v.run.bind(v),l&&l.suspense):v.run();const x=()=>{v.stop(),l&&l.scope&&Bc(l.scope.effects,v)};return g&&g.push(x),x}function ev(t,e,n){const i=this.proxy,r=at(t)?t.includes(".")?fp(i,t):()=>i[t]:t.bind(i,i);let s;Be(e)?s=e:(s=e.handler,n=e);const o=pt;Fr(this);const a=Qc(r,s.bind(i),n);return o?Fr(o):ki(),a}function fp(t,e){const n=e.split(".");return()=>{let i=t;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}function Er(t,e){if(!tt(t)||t.__v_skip||(e=e||new Set,e.has(t)))return t;if(e.add(t),rt(t))Er(t.value,e);else if(Ie(t))for(let n=0;n<t.length;n++)Er(t[n],e);else if(Pd(t)||Ar(t))t.forEach(n=>{Er(n,e)});else if(Id(t))for(const n in t)Er(t[n],e);return t}function Sn(t,e,n,i){const r=t.dirs,s=e&&e.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(jr(),rn(l,n,8,[t.el,a,t,e]),qr())}}function tv(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return Ki(()=>{t.isMounted=!0}),Yr(()=>{t.isUnmounting=!0}),t}const Zt=[Function,Array],hp={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:Zt,onEnter:Zt,onAfterEnter:Zt,onEnterCancelled:Zt,onBeforeLeave:Zt,onLeave:Zt,onAfterLeave:Zt,onLeaveCancelled:Zt,onBeforeAppear:Zt,onAppear:Zt,onAfterAppear:Zt,onAppearCancelled:Zt},nv={name:"BaseTransition",props:hp,setup(t,{slots:e}){const n=js(),i=tv();let r;return()=>{const s=e.default&&pp(e.default(),!0);if(!s||!s.length)return;let o=s[0];if(s.length>1){for(const _ of s)if(_.type!==Ht){o=_;break}}const a=qe(t),{mode:l}=a;if(i.isLeaving)return Xa(o);const c=ku(o);if(!c)return Xa(o);const u=ql(c,a,i,n);ia(c,u);const f=n.subTree,d=f&&ku(f);let p=!1;const{getTransitionKey:g}=c.type;if(g){const _=g();r===void 0?r=_:_!==r&&(r=_,p=!0)}if(d&&d.type!==Ht&&(!dn(c,d)||p)){const _=ql(d,a,i,n);if(ia(d,_),l==="out-in")return i.isLeaving=!0,_.afterLeave=()=>{i.isLeaving=!1,n.update.active!==!1&&n.update()},Xa(o);l==="in-out"&&c.type!==Ht&&(_.delayLeave=(m,h,v)=>{const x=dp(i,d);x[String(d.key)]=d,m._leaveCb=()=>{h(),m._leaveCb=void 0,delete u.delayedLeave},u.delayedLeave=v})}return o}}},iv=nv;function dp(t,e){const{leavingVNodes:n}=t;let i=n.get(e.type);return i||(i=Object.create(null),n.set(e.type,i)),i}function ql(t,e,n,i){const{appear:r,mode:s,persisted:o=!1,onBeforeEnter:a,onEnter:l,onAfterEnter:c,onEnterCancelled:u,onBeforeLeave:f,onLeave:d,onAfterLeave:p,onLeaveCancelled:g,onBeforeAppear:_,onAppear:m,onAfterAppear:h,onAppearCancelled:v}=e,x=String(t.key),y=dp(n,t),S=(P,E)=>{P&&rn(P,i,9,E)},R=(P,E)=>{const T=E[1];S(P,E),Ie(P)?P.every(F=>F.length<=1)&&T():P.length<=1&&T()},A={mode:s,persisted:o,beforeEnter(P){let E=a;if(!n.isMounted)if(r)E=_||a;else return;P._leaveCb&&P._leaveCb(!0);const T=y[x];T&&dn(t,T)&&T.el._leaveCb&&T.el._leaveCb(),S(E,[P])},enter(P){let E=l,T=c,F=u;if(!n.isMounted)if(r)E=m||l,T=h||c,F=v||u;else return;let H=!1;const N=P._enterCb=U=>{H||(H=!0,U?S(F,[P]):S(T,[P]),A.delayedLeave&&A.delayedLeave(),P._enterCb=void 0)};E?R(E,[P,N]):N()},leave(P,E){const T=String(t.key);if(P._enterCb&&P._enterCb(!0),n.isUnmounting)return E();S(f,[P]);let F=!1;const H=P._leaveCb=N=>{F||(F=!0,E(),N?S(g,[P]):S(p,[P]),P._leaveCb=void 0,y[T]===t&&delete y[T])};y[T]=t,d?R(d,[P,H]):H()},clone(P){return ql(P,e,n,i)}};return A}function Xa(t){if(Xs(t))return t=$n(t),t.children=null,t}function ku(t){return Xs(t)?t.children?t.children[0]:void 0:t}function ia(t,e){t.shapeFlag&6&&t.component?ia(t.component.subTree,e):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function pp(t,e=!1,n){let i=[],r=0;for(let s=0;s<t.length;s++){let o=t[s];const a=n==null?o.key:String(n)+String(o.key!=null?o.key:s);o.type===$t?(o.patchFlag&128&&r++,i=i.concat(pp(o.children,e,a))):(e||o.type!==Ht)&&i.push(a!=null?$n(o,{key:a}):o)}if(r>1)for(let s=0;s<i.length;s++)i[s].patchFlag=-2;return i}function Cn(t,e){return Be(t)?(()=>mt({name:t.name},e,{setup:t}))():t}const Pr=t=>!!t.type.__asyncLoader;function zu(t){Be(t)&&(t={loader:t});const{loader:e,loadingComponent:n,errorComponent:i,delay:r=200,timeout:s,suspensible:o=!0,onError:a}=t;let l=null,c,u=0;const f=()=>(u++,l=null,d()),d=()=>{let p;return l||(p=l=e().catch(g=>{if(g=g instanceof Error?g:new Error(String(g)),a)return new Promise((_,m)=>{a(g,()=>_(f()),()=>m(g),u+1)});throw g}).then(g=>p!==l&&l?l:(g&&(g.__esModule||g[Symbol.toStringTag]==="Module")&&(g=g.default),c=g,g)))};return Cn({name:"AsyncComponentWrapper",__asyncLoader:d,get __asyncResolved(){return c},setup(){const p=pt;if(c)return()=>ja(c,p);const g=v=>{l=null,$r(v,p,13,!i)};if(o&&p.suspense||Br)return d().then(v=>()=>ja(v,p)).catch(v=>(g(v),()=>i?st(i,{error:v}):null));const _=Ke(!1),m=Ke(),h=Ke(!!r);return r&&setTimeout(()=>{h.value=!1},r),s!=null&&setTimeout(()=>{if(!_.value&&!m.value){const v=new Error(`Async component timed out after ${s}ms.`);g(v),m.value=v}},s),d().then(()=>{_.value=!0,p.parent&&Xs(p.parent.vnode)&&Ea(p.parent.update)}).catch(v=>{g(v),m.value=v}),()=>{if(_.value&&c)return ja(c,p);if(m.value&&i)return st(i,{error:m.value});if(n&&!h.value)return st(n)}}})}function ja(t,e){const{ref:n,props:i,children:r,ce:s}=e.vnode,o=st(t,i,r);return o.ref=n,o.ce=s,delete e.vnode.ce,o}const Xs=t=>t.type.__isKeepAlive,rv={name:"KeepAlive",__isKeepAlive:!0,props:{include:[String,RegExp,Array],exclude:[String,RegExp,Array],max:[String,Number]},setup(t,{slots:e}){const n=js(),i=n.ctx;if(!i.renderer)return()=>{const v=e.default&&e.default();return v&&v.length===1?v[0]:v};const r=new Map,s=new Set;let o=null;const a=n.suspense,{renderer:{p:l,m:c,um:u,o:{createElement:f}}}=i,d=f("div");i.activate=(v,x,y,S,R)=>{const A=v.component;c(v,x,y,0,a),l(A.vnode,v,x,y,A,a,S,v.slotScopeIds,R),St(()=>{A.isDeactivated=!1,A.a&&ds(A.a);const P=v.props&&v.props.onVnodeMounted;P&&Ft(P,A.parent,v)},a)},i.deactivate=v=>{const x=v.component;c(v,d,null,1,a),St(()=>{x.da&&ds(x.da);const y=v.props&&v.props.onVnodeUnmounted;y&&Ft(y,x.parent,v),x.isDeactivated=!0},a)};function p(v){qa(v),u(v,n,a,!0)}function g(v){r.forEach((x,y)=>{const S=Ql(x.type);S&&(!v||!v(S))&&_(y)})}function _(v){const x=r.get(v);!o||!dn(x,o)?p(x):o&&qa(o),r.delete(v),s.delete(v)}Hi(()=>[t.include,t.exclude],([v,x])=>{v&&g(y=>ls(v,y)),x&&g(y=>!ls(x,y))},{flush:"post",deep:!0});let m=null;const h=()=>{m!=null&&r.set(m,$a(n.subTree))};return Ki(h),vp(h),Yr(()=>{r.forEach(v=>{const{subTree:x,suspense:y}=n,S=$a(x);if(v.type===S.type&&v.key===S.key){qa(S);const R=S.component.da;R&&St(R,y);return}p(v)})}),()=>{if(m=null,!e.default)return null;const v=e.default(),x=v[0];if(v.length>1)return o=null,v;if(!Ns(x)||!(x.shapeFlag&4)&&!(x.shapeFlag&128))return o=null,x;let y=$a(x);const S=y.type,R=Ql(Pr(y)?y.type.__asyncResolved||{}:S),{include:A,exclude:P,max:E}=t;if(A&&(!R||!ls(A,R))||P&&R&&ls(P,R))return o=y,x;const T=y.key==null?S:y.key,F=r.get(T);return y.el&&(y=$n(y),x.shapeFlag&128&&(x.ssContent=y)),m=T,F?(y.el=F.el,y.component=F.component,y.transition&&ia(y,y.transition),y.shapeFlag|=512,s.delete(T),s.add(T)):(s.add(T),E&&s.size>parseInt(E,10)&&_(s.values().next().value)),y.shapeFlag|=256,o=y,lp(x.type)?x:y}}},sv=rv;function ls(t,e){return Ie(t)?t.some(n=>ls(n,e)):at(t)?t.split(",").includes(e):Wg(t)?t.test(e):!1}function mp(t,e){_p(t,"a",e)}function gp(t,e){_p(t,"da",e)}function _p(t,e,n=pt){const i=t.__wdc||(t.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return t()});if(Ta(e,i,n),n){let r=n.parent;for(;r&&r.parent;)Xs(r.parent.vnode)&&ov(i,e,n,r),r=r.parent}}function ov(t,e,n,i){const r=Ta(e,t,i,!0);wa(()=>{Bc(i[e],r)},n)}function qa(t){t.shapeFlag&=-257,t.shapeFlag&=-513}function $a(t){return t.shapeFlag&128?t.ssContent:t}function Ta(t,e,n=pt,i=!1){if(n){const r=n[t]||(n[t]=[]),s=e.__weh||(e.__weh=(...o)=>{if(n.isUnmounted)return;jr(),Fr(n);const a=rn(e,n,t,o);return ki(),qr(),a});return i?r.unshift(s):r.push(s),s}}const Yn=t=>(e,n=pt)=>(!Br||t==="sp")&&Ta(t,(...i)=>e(...i),n),av=Yn("bm"),Ki=Yn("m"),lv=Yn("bu"),vp=Yn("u"),Yr=Yn("bum"),wa=Yn("um"),cv=Yn("sp"),uv=Yn("rtg"),fv=Yn("rtc");function xp(t,e=pt){Ta("ec",t,e)}const eu="components";function hv(t,e){return Mp(eu,t,!0,e)||t}const yp=Symbol.for("v-ndc");function dv(t){return at(t)?Mp(eu,t,!1)||t:t||yp}function Mp(t,e,n=!0,i=!1){const r=Yt||pt;if(r){const s=r.type;if(t===eu){const a=Ql(s,!1);if(a&&(a===e||a===An(e)||a===_a(An(e))))return s}const o=Gu(r[t]||s[t],e)||Gu(r.appContext[t],e);return!o&&i?s:o}}function Gu(t,e){return t&&(t[e]||t[An(e)]||t[_a(An(e))])}function pv(t,e,n,i){let r;const s=n&&n[i];if(Ie(t)||at(t)){r=new Array(t.length);for(let o=0,a=t.length;o<a;o++)r[o]=e(t[o],o,void 0,s&&s[o])}else if(typeof t=="number"){r=new Array(t);for(let o=0;o<t;o++)r[o]=e(o+1,o,void 0,s&&s[o])}else if(tt(t))if(t[Symbol.iterator])r=Array.from(t,(o,a)=>e(o,a,void 0,s&&s[a]));else{const o=Object.keys(t);r=new Array(o.length);for(let a=0,l=o.length;a<l;a++){const c=o[a];r[a]=e(t[c],c,a,s&&s[a])}}else r=[];return n&&(n[i]=r),r}const $l=t=>t?Np(t)?au(t)||t.proxy:$l(t.parent):null,ps=mt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>$l(t.parent),$root:t=>$l(t.root),$emit:t=>t.emit,$options:t=>tu(t),$forceUpdate:t=>t.f||(t.f=()=>Ea(t.update)),$nextTick:t=>t.n||(t.n=Yi.bind(t.proxy)),$watch:t=>ev.bind(t)}),Ya=(t,e)=>t!==it&&!t.__isScriptSetup&&Ye(t,e),mv={get({_:t},e){const{ctx:n,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=t;let c;if(e[0]!=="$"){const p=o[e];if(p!==void 0)switch(p){case 1:return i[e];case 2:return r[e];case 4:return n[e];case 3:return s[e]}else{if(Ya(i,e))return o[e]=1,i[e];if(r!==it&&Ye(r,e))return o[e]=2,r[e];if((c=t.propsOptions[0])&&Ye(c,e))return o[e]=3,s[e];if(n!==it&&Ye(n,e))return o[e]=4,n[e];Yl&&(o[e]=0)}}const u=ps[e];let f,d;if(u)return e==="$attrs"&&Gt(t,"get",e),u(t);if((f=a.__cssModules)&&(f=f[e]))return f;if(n!==it&&Ye(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,Ye(d,e))return d[e]},set({_:t},e,n){const{data:i,setupState:r,ctx:s}=t;return Ya(r,e)?(r[e]=n,!0):i!==it&&Ye(i,e)?(i[e]=n,!0):Ye(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(s[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:r,propsOptions:s}},o){let a;return!!n[o]||t!==it&&Ye(t,o)||Ya(e,o)||(a=s[0])&&Ye(a,o)||Ye(i,o)||Ye(ps,o)||Ye(r.config.globalProperties,o)},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:Ye(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Vu(t){return Ie(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Yl=!0;function gv(t){const e=tu(t),n=t.proxy,i=t.ctx;Yl=!1,e.beforeCreate&&Wu(e.beforeCreate,t,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:f,mounted:d,beforeUpdate:p,updated:g,activated:_,deactivated:m,beforeDestroy:h,beforeUnmount:v,destroyed:x,unmounted:y,render:S,renderTracked:R,renderTriggered:A,errorCaptured:P,serverPrefetch:E,expose:T,inheritAttrs:F,components:H,directives:N,filters:U}=e;if(c&&_v(c,i,null),o)for(const $ in o){const Y=o[$];Be(Y)&&(i[$]=Y.bind(n))}if(r){const $=r.call(n,n);tt($)&&(t.data=qn($))}if(Yl=!0,s)for(const $ in s){const Y=s[$],he=Be(Y)?Y.bind(n,n):Be(Y.get)?Y.get.bind(n,n):_n,de=!Be(Y)&&Be(Y.set)?Y.set.bind(n):_n,X=Nt({get:he,set:de});Object.defineProperty(i,$,{enumerable:!0,configurable:!0,get:()=>X.value,set:Q=>X.value=Q})}if(a)for(const $ in a)Ep(a[$],i,n,$);if(l){const $=Be(l)?l.call(n):l;Reflect.ownKeys($).forEach(Y=>{Lr(Y,$[Y])})}u&&Wu(u,t,"c");function Z($,Y){Ie(Y)?Y.forEach(he=>$(he.bind(n))):Y&&$(Y.bind(n))}if(Z(av,f),Z(Ki,d),Z(lv,p),Z(vp,g),Z(mp,_),Z(gp,m),Z(xp,P),Z(fv,R),Z(uv,A),Z(Yr,v),Z(wa,y),Z(cv,E),Ie(T))if(T.length){const $=t.exposed||(t.exposed={});T.forEach(Y=>{Object.defineProperty($,Y,{get:()=>n[Y],set:he=>n[Y]=he})})}else t.exposed||(t.exposed={});S&&t.render===_n&&(t.render=S),F!=null&&(t.inheritAttrs=F),H&&(t.components=H),N&&(t.directives=N)}function _v(t,e,n=_n){Ie(t)&&(t=Kl(t));for(const i in t){const r=t[i];let s;tt(r)?"default"in r?s=Bt(r.from||i,r.default,!0):s=Bt(r.from||i):s=Bt(r),rt(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function Wu(t,e,n){rn(Ie(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function Ep(t,e,n,i){const r=i.includes(".")?fp(n,i):()=>n[i];if(at(t)){const s=e[t];Be(s)&&Hi(r,s)}else if(Be(t))Hi(r,t.bind(n));else if(tt(t))if(Ie(t))t.forEach(s=>Ep(s,e,n,i));else{const s=Be(t.handler)?t.handler.bind(n):e[t.handler];Be(s)&&Hi(r,s,t)}}function tu(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=t.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!n&&!i?l=e:(l={},r.length&&r.forEach(c=>ra(l,c,o,!0)),ra(l,e,o)),tt(e)&&s.set(e,l),l}function ra(t,e,n,i=!1){const{mixins:r,extends:s}=e;s&&ra(t,s,n,!0),r&&r.forEach(o=>ra(t,o,n,!0));for(const o in e)if(!(i&&o==="expose")){const a=vv[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const vv={data:Xu,props:ju,emits:ju,methods:cs,computed:cs,beforeCreate:Lt,created:Lt,beforeMount:Lt,mounted:Lt,beforeUpdate:Lt,updated:Lt,beforeDestroy:Lt,beforeUnmount:Lt,destroyed:Lt,unmounted:Lt,activated:Lt,deactivated:Lt,errorCaptured:Lt,serverPrefetch:Lt,components:cs,directives:cs,watch:yv,provide:Xu,inject:xv};function Xu(t,e){return e?t?function(){return mt(Be(t)?t.call(this,this):t,Be(e)?e.call(this,this):e)}:e:t}function xv(t,e){return cs(Kl(t),Kl(e))}function Kl(t){if(Ie(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Lt(t,e){return t?[...new Set([].concat(t,e))]:e}function cs(t,e){return t?mt(Object.create(null),t,e):e}function ju(t,e){return t?Ie(t)&&Ie(e)?[...new Set([...t,...e])]:mt(Object.create(null),Vu(t),Vu(e??{})):e}function yv(t,e){if(!t)return e;if(!e)return t;const n=mt(Object.create(null),t);for(const i in e)n[i]=Lt(t[i],e[i]);return n}function Sp(){return{app:null,config:{isNativeTag:zg,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Mv=0;function Ev(t,e){return function(i,r=null){Be(i)||(i=mt({},i)),r!=null&&!tt(r)&&(r=null);const s=Sp(),o=new Set;let a=!1;const l=s.app={_uid:Mv++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:Fp,get config(){return s.config},set config(c){},use(c,...u){return o.has(c)||(c&&Be(c.install)?(o.add(c),c.install(l,...u)):Be(c)&&(o.add(c),c(l,...u))),l},mixin(c){return s.mixins.includes(c)||s.mixins.push(c),l},component(c,u){return u?(s.components[c]=u,l):s.components[c]},directive(c,u){return u?(s.directives[c]=u,l):s.directives[c]},mount(c,u,f){if(!a){const d=st(i,r);return d.appContext=s,u&&e?e(d,c):t(d,c,f),a=!0,l._container=c,c.__vue_app__=l,au(d.component)||d.component.proxy}},unmount(){a&&(t(null,l._container),delete l._container.__vue_app__)},provide(c,u){return s.provides[c]=u,l},runWithContext(c){Us=l;try{return c()}finally{Us=null}}};return l}}let Us=null;function Lr(t,e){if(pt){let n=pt.provides;const i=pt.parent&&pt.parent.provides;i===n&&(n=pt.provides=Object.create(i)),n[t]=e}}function Bt(t,e,n=!1){const i=pt||Yt;if(i||Us){const r=i?i.parent==null?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:Us._context.provides;if(r&&t in r)return r[t];if(arguments.length>1)return n&&Be(e)?e.call(i&&i.proxy):e}}function nu(){return!!(pt||Yt||Us)}function Sv(t,e,n,i=!1){const r={},s={};Jo(s,Aa,1),t.propsDefaults=Object.create(null),bp(t,e,r,s);for(const o in t.propsOptions[0])o in r||(r[o]=void 0);n?t.props=i?r:Ws(r):t.type.props?t.props=r:t.props=s,t.attrs=s}function bv(t,e,n,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=t,a=qe(r),[l]=t.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let f=0;f<u.length;f++){let d=u[f];if(Sa(t.emitsOptions,d))continue;const p=e[d];if(l)if(Ye(s,d))p!==s[d]&&(s[d]=p,c=!0);else{const g=An(d);r[g]=Zl(l,a,g,p,t,!1)}else p!==s[d]&&(s[d]=p,c=!0)}}}else{bp(t,e,r,s)&&(c=!0);let u;for(const f in a)(!e||!Ye(e,f)&&((u=Xr(f))===f||!Ye(e,u)))&&(l?n&&(n[f]!==void 0||n[u]!==void 0)&&(r[f]=Zl(l,a,f,void 0,t,!0)):delete r[f]);if(s!==a)for(const f in s)(!e||!Ye(e,f))&&(delete s[f],c=!0)}c&&jn(t,"set","$attrs")}function bp(t,e,n,i){const[r,s]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(hs(l))continue;const c=e[l];let u;r&&Ye(r,u=An(l))?!s||!s.includes(u)?n[u]=c:(a||(a={}))[u]=c:Sa(t.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=qe(n),c=a||it;for(let u=0;u<s.length;u++){const f=s[u];n[f]=Zl(r,l,f,c[f],t,!Ye(c,f))}}return o}function Zl(t,e,n,i,r,s){const o=t[n];if(o!=null){const a=Ye(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&Be(l)){const{propsDefaults:c}=r;n in c?i=c[n]:(Fr(r),i=c[n]=l.call(null,e),ki())}else i=l}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===Xr(n))&&(i=!0))}return i}function Tp(t,e,n=!1){const i=e.propsCache,r=i.get(t);if(r)return r;const s=t.props,o={},a=[];let l=!1;if(!Be(t)){const u=f=>{l=!0;const[d,p]=Tp(f,e,!0);mt(o,d),p&&a.push(...p)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!s&&!l)return tt(t)&&i.set(t,wr),wr;if(Ie(s))for(let u=0;u<s.length;u++){const f=An(s[u]);qu(f)&&(o[f]=it)}else if(s)for(const u in s){const f=An(u);if(qu(f)){const d=s[u],p=o[f]=Ie(d)||Be(d)?{type:d}:mt({},d);if(p){const g=Ku(Boolean,p.type),_=Ku(String,p.type);p[0]=g>-1,p[1]=_<0||g<_,(g>-1||Ye(p,"default"))&&a.push(f)}}}const c=[o,a];return tt(t)&&i.set(t,c),c}function qu(t){return t[0]!=="$"}function $u(t){const e=t&&t.toString().match(/^\s*(function|class) (\w+)/);return e?e[2]:t===null?"null":""}function Yu(t,e){return $u(t)===$u(e)}function Ku(t,e){return Ie(e)?e.findIndex(n=>Yu(n,t)):Be(e)&&Yu(e,t)?0:-1}const wp=t=>t[0]==="_"||t==="$stable",iu=t=>Ie(t)?t.map(Qt):[Qt(t)],Tv=(t,e,n)=>{if(e._n)return e;const i=Kc((...r)=>iu(e(...r)),n);return i._c=!1,i},Ap=(t,e,n)=>{const i=t._ctx;for(const r in t){if(wp(r))continue;const s=t[r];if(Be(s))e[r]=Tv(r,s,i);else if(s!=null){const o=iu(s);e[r]=()=>o}}},Rp=(t,e)=>{const n=iu(e);t.slots.default=()=>n},wv=(t,e)=>{if(t.vnode.shapeFlag&32){const n=e._;n?(t.slots=qe(e),Jo(e,"_",n)):Ap(e,t.slots={})}else t.slots={},e&&Rp(t,e);Jo(t.slots,Aa,1)},Av=(t,e,n)=>{const{vnode:i,slots:r}=t;let s=!0,o=it;if(i.shapeFlag&32){const a=e._;a?n&&a===1?s=!1:(mt(r,e),!n&&a===1&&delete r._):(s=!e.$stable,Ap(e,r)),o=e}else e&&(Rp(t,e),o={default:1});if(s)for(const a in r)!wp(a)&&!(a in o)&&delete r[a]};function sa(t,e,n,i,r=!1){if(Ie(t)){t.forEach((d,p)=>sa(d,e&&(Ie(e)?e[p]:e),n,i,r));return}if(Pr(i)&&!r)return;const s=i.shapeFlag&4?au(i.component)||i.component.proxy:i.el,o=r?null:s,{i:a,r:l}=t,c=e&&e.r,u=a.refs===it?a.refs={}:a.refs,f=a.setupState;if(c!=null&&c!==l&&(at(c)?(u[c]=null,Ye(f,c)&&(f[c]=null)):rt(c)&&(c.value=null)),Be(l))gi(l,a,12,[o,u]);else{const d=at(l),p=rt(l);if(d||p){const g=()=>{if(t.f){const _=d?Ye(f,l)?f[l]:u[l]:l.value;r?Ie(_)&&Bc(_,s):Ie(_)?_.includes(s)||_.push(s):d?(u[l]=[s],Ye(f,l)&&(f[l]=u[l])):(l.value=[s],t.k&&(u[t.k]=l.value))}else d?(u[l]=o,Ye(f,l)&&(f[l]=o)):p&&(l.value=o,t.k&&(u[t.k]=o))};o?(g.id=-1,St(g,n)):g()}}}let Jn=!1;const uo=t=>/svg/.test(t.namespaceURI)&&t.tagName!=="foreignObject",fo=t=>t.nodeType===8;function Rv(t){const{mt:e,p:n,o:{patchProp:i,createText:r,nextSibling:s,parentNode:o,remove:a,insert:l,createComment:c}}=t,u=(h,v)=>{if(!v.hasChildNodes()){n(null,h,v),ta(),v._vnode=h;return}Jn=!1,f(v.firstChild,h,null,null,null),ta(),v._vnode=h,Jn&&console.error("Hydration completed but contains mismatches.")},f=(h,v,x,y,S,R=!1)=>{const A=fo(h)&&h.data==="[",P=()=>_(h,v,x,y,S,A),{type:E,ref:T,shapeFlag:F,patchFlag:H}=v;let N=h.nodeType;v.el=h,H===-2&&(R=!1,v.dynamicChildren=null);let U=null;switch(E){case Nr:N!==3?v.children===""?(l(v.el=r(""),o(h),h),U=h):U=P():(h.data!==v.children&&(Jn=!0,h.data=v.children),U=s(h));break;case Ht:N!==8||A?U=P():U=s(h);break;case Go:if(A&&(h=s(h),N=h.nodeType),N===1||N===3){U=h;const W=!v.children.length;for(let Z=0;Z<v.staticCount;Z++)W&&(v.children+=U.nodeType===1?U.outerHTML:U.data),Z===v.staticCount-1&&(v.anchor=U),U=s(U);return A?s(U):U}else P();break;case $t:A?U=g(h,v,x,y,S,R):U=P();break;default:if(F&1)N!==1||v.type.toLowerCase()!==h.tagName.toLowerCase()?U=P():U=d(h,v,x,y,S,R);else if(F&6){v.slotScopeIds=S;const W=o(h);if(e(v,W,null,x,y,uo(W),R),U=A?m(h):s(h),U&&fo(U)&&U.data==="teleport end"&&(U=s(U)),Pr(v)){let Z;A?(Z=st($t),Z.anchor=U?U.previousSibling:W.lastChild):Z=h.nodeType===3?ru(""):st("div"),Z.el=h,v.component.subTree=Z}}else F&64?N!==8?U=P():U=v.type.hydrate(h,v,x,y,S,R,t,p):F&128&&(U=v.type.hydrate(h,v,x,y,uo(o(h)),S,R,t,f))}return T!=null&&sa(T,null,y,v),U},d=(h,v,x,y,S,R)=>{R=R||!!v.dynamicChildren;const{type:A,props:P,patchFlag:E,shapeFlag:T,dirs:F}=v,H=A==="input"&&F||A==="option";if(H||E!==-1){if(F&&Sn(v,null,x,"created"),P)if(H||!R||E&48)for(const U in P)(H&&U.endsWith("value")||Gs(U)&&!hs(U))&&i(h,U,null,P[U],!1,void 0,x);else P.onClick&&i(h,"onClick",null,P.onClick,!1,void 0,x);let N;if((N=P&&P.onVnodeBeforeMount)&&Ft(N,x,v),F&&Sn(v,null,x,"beforeMount"),((N=P&&P.onVnodeMounted)||F)&&up(()=>{N&&Ft(N,x,v),F&&Sn(v,null,x,"mounted")},y),T&16&&!(P&&(P.innerHTML||P.textContent))){let U=p(h.firstChild,v,h,x,y,S,R);for(;U;){Jn=!0;const W=U;U=U.nextSibling,a(W)}}else T&8&&h.textContent!==v.children&&(Jn=!0,h.textContent=v.children)}return h.nextSibling},p=(h,v,x,y,S,R,A)=>{A=A||!!v.dynamicChildren;const P=v.children,E=P.length;for(let T=0;T<E;T++){const F=A?P[T]:P[T]=Qt(P[T]);if(h)h=f(h,F,y,S,R,A);else{if(F.type===Nr&&!F.children)continue;Jn=!0,n(null,F,x,null,y,S,uo(x),R)}}return h},g=(h,v,x,y,S,R)=>{const{slotScopeIds:A}=v;A&&(S=S?S.concat(A):A);const P=o(h),E=p(s(h),v,P,x,y,S,R);return E&&fo(E)&&E.data==="]"?s(v.anchor=E):(Jn=!0,l(v.anchor=c("]"),P,E),E)},_=(h,v,x,y,S,R)=>{if(Jn=!0,v.el=null,R){const E=m(h);for(;;){const T=s(h);if(T&&T!==E)a(T);else break}}const A=s(h),P=o(h);return a(h),n(null,v,P,A,x,y,uo(P),S),A},m=h=>{let v=0;for(;h;)if(h=s(h),h&&fo(h)&&(h.data==="["&&v++,h.data==="]")){if(v===0)return s(h);v--}return h};return[u,f]}const St=up;function Cv(t){return Cp(t)}function Pv(t){return Cp(t,Rv)}function Cp(t,e){const n=Gl();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:f,nextSibling:d,setScopeId:p=_n,insertStaticContent:g}=t,_=(M,D,I,k=null,V=null,ie=null,fe=!1,ee=null,ue=!!D.dynamicChildren)=>{if(M===D)return;M&&!dn(M,D)&&(k=j(M),Q(M,V,ie,!0),M=null),D.patchFlag===-2&&(ue=!1,D.dynamicChildren=null);const{type:le,ref:be,shapeFlag:w}=D;switch(le){case Nr:m(M,D,I,k);break;case Ht:h(M,D,I,k);break;case Go:M==null&&v(D,I,k,fe);break;case $t:H(M,D,I,k,V,ie,fe,ee,ue);break;default:w&1?S(M,D,I,k,V,ie,fe,ee,ue):w&6?N(M,D,I,k,V,ie,fe,ee,ue):(w&64||w&128)&&le.process(M,D,I,k,V,ie,fe,ee,ue,ce)}be!=null&&V&&sa(be,M&&M.ref,ie,D||M,!D)},m=(M,D,I,k)=>{if(M==null)i(D.el=a(D.children),I,k);else{const V=D.el=M.el;D.children!==M.children&&c(V,D.children)}},h=(M,D,I,k)=>{M==null?i(D.el=l(D.children||""),I,k):D.el=M.el},v=(M,D,I,k)=>{[M.el,M.anchor]=g(M.children,D,I,k,M.el,M.anchor)},x=({el:M,anchor:D},I,k)=>{let V;for(;M&&M!==D;)V=d(M),i(M,I,k),M=V;i(D,I,k)},y=({el:M,anchor:D})=>{let I;for(;M&&M!==D;)I=d(M),r(M),M=I;r(D)},S=(M,D,I,k,V,ie,fe,ee,ue)=>{fe=fe||D.type==="svg",M==null?R(D,I,k,V,ie,fe,ee,ue):E(M,D,V,ie,fe,ee,ue)},R=(M,D,I,k,V,ie,fe,ee)=>{let ue,le;const{type:be,props:w,shapeFlag:b,transition:B,dirs:te}=M;if(ue=M.el=o(M.type,ie,w&&w.is,w),b&8?u(ue,M.children):b&16&&P(M.children,ue,null,k,V,ie&&be!=="foreignObject",fe,ee),te&&Sn(M,null,k,"created"),A(ue,M,M.scopeId,fe,k),w){for(const L in w)L!=="value"&&!hs(L)&&s(ue,L,null,w[L],ie,M.children,k,V,Ae);"value"in w&&s(ue,"value",null,w.value),(le=w.onVnodeBeforeMount)&&Ft(le,k,M)}te&&Sn(M,null,k,"beforeMount");const ae=(!V||V&&!V.pendingBranch)&&B&&!B.persisted;ae&&B.beforeEnter(ue),i(ue,D,I),((le=w&&w.onVnodeMounted)||ae||te)&&St(()=>{le&&Ft(le,k,M),ae&&B.enter(ue),te&&Sn(M,null,k,"mounted")},V)},A=(M,D,I,k,V)=>{if(I&&p(M,I),k)for(let ie=0;ie<k.length;ie++)p(M,k[ie]);if(V){let ie=V.subTree;if(D===ie){const fe=V.vnode;A(M,fe,fe.scopeId,fe.slotScopeIds,V.parent)}}},P=(M,D,I,k,V,ie,fe,ee,ue=0)=>{for(let le=ue;le<M.length;le++){const be=M[le]=ee?ai(M[le]):Qt(M[le]);_(null,be,D,I,k,V,ie,fe,ee)}},E=(M,D,I,k,V,ie,fe)=>{const ee=D.el=M.el;let{patchFlag:ue,dynamicChildren:le,dirs:be}=D;ue|=M.patchFlag&16;const w=M.props||it,b=D.props||it;let B;I&&Ti(I,!1),(B=b.onVnodeBeforeUpdate)&&Ft(B,I,D,M),be&&Sn(D,M,I,"beforeUpdate"),I&&Ti(I,!0);const te=V&&D.type!=="foreignObject";if(le?T(M.dynamicChildren,le,ee,I,k,te,ie):fe||Y(M,D,ee,null,I,k,te,ie,!1),ue>0){if(ue&16)F(ee,D,w,b,I,k,V);else if(ue&2&&w.class!==b.class&&s(ee,"class",null,b.class,V),ue&4&&s(ee,"style",w.style,b.style,V),ue&8){const ae=D.dynamicProps;for(let L=0;L<ae.length;L++){const ne=ae[L],pe=w[ne],K=b[ne];(K!==pe||ne==="value")&&s(ee,ne,pe,K,V,M.children,I,k,Ae)}}ue&1&&M.children!==D.children&&u(ee,D.children)}else!fe&&le==null&&F(ee,D,w,b,I,k,V);((B=b.onVnodeUpdated)||be)&&St(()=>{B&&Ft(B,I,D,M),be&&Sn(D,M,I,"updated")},k)},T=(M,D,I,k,V,ie,fe)=>{for(let ee=0;ee<D.length;ee++){const ue=M[ee],le=D[ee],be=ue.el&&(ue.type===$t||!dn(ue,le)||ue.shapeFlag&70)?f(ue.el):I;_(ue,le,be,null,k,V,ie,fe,!0)}},F=(M,D,I,k,V,ie,fe)=>{if(I!==k){if(I!==it)for(const ee in I)!hs(ee)&&!(ee in k)&&s(M,ee,I[ee],null,fe,D.children,V,ie,Ae);for(const ee in k){if(hs(ee))continue;const ue=k[ee],le=I[ee];ue!==le&&ee!=="value"&&s(M,ee,le,ue,fe,D.children,V,ie,Ae)}"value"in k&&s(M,"value",I.value,k.value)}},H=(M,D,I,k,V,ie,fe,ee,ue)=>{const le=D.el=M?M.el:a(""),be=D.anchor=M?M.anchor:a("");let{patchFlag:w,dynamicChildren:b,slotScopeIds:B}=D;B&&(ee=ee?ee.concat(B):B),M==null?(i(le,I,k),i(be,I,k),P(D.children,I,be,V,ie,fe,ee,ue)):w>0&&w&64&&b&&M.dynamicChildren?(T(M.dynamicChildren,b,I,V,ie,fe,ee),(D.key!=null||V&&D===V.subTree)&&Pp(M,D,!0)):Y(M,D,I,be,V,ie,fe,ee,ue)},N=(M,D,I,k,V,ie,fe,ee,ue)=>{D.slotScopeIds=ee,M==null?D.shapeFlag&512?V.ctx.activate(D,I,k,fe,ue):U(D,I,k,V,ie,fe,ue):W(M,D,ue)},U=(M,D,I,k,V,ie,fe)=>{const ee=M.component=Fv(M,k,V);if(Xs(M)&&(ee.ctx.renderer=ce),Bv(ee),ee.asyncDep){if(V&&V.registerDep(ee,Z),!M.el){const ue=ee.subTree=st(Ht);h(null,ue,D,I)}return}Z(ee,M,D,I,V,ie,fe)},W=(M,D,I)=>{const k=D.component=M.component;if(j_(M,D,I))if(k.asyncDep&&!k.asyncResolved){$(k,D,I);return}else k.next=D,k_(k.update),k.update();else D.el=M.el,k.vnode=D},Z=(M,D,I,k,V,ie,fe)=>{const ee=()=>{if(M.isMounted){let{next:be,bu:w,u:b,parent:B,vnode:te}=M,ae=be,L;Ti(M,!1),be?(be.el=te.el,$(M,be,fe)):be=te,w&&ds(w),(L=be.props&&be.props.onVnodeBeforeUpdate)&&Ft(L,B,be,te),Ti(M,!0);const ne=Wa(M),pe=M.subTree;M.subTree=ne,_(pe,ne,f(pe.el),j(pe),M,V,ie),be.el=ne.el,ae===null&&Zc(M,ne.el),b&&St(b,V),(L=be.props&&be.props.onVnodeUpdated)&&St(()=>Ft(L,B,be,te),V)}else{let be;const{el:w,props:b}=D,{bm:B,m:te,parent:ae}=M,L=Pr(D);if(Ti(M,!1),B&&ds(B),!L&&(be=b&&b.onVnodeBeforeMount)&&Ft(be,ae,D),Ti(M,!0),w&&we){const ne=()=>{M.subTree=Wa(M),we(w,M.subTree,M,V,null)};L?D.type.__asyncLoader().then(()=>!M.isUnmounted&&ne()):ne()}else{const ne=M.subTree=Wa(M);_(null,ne,I,k,M,V,ie),D.el=ne.el}if(te&&St(te,V),!L&&(be=b&&b.onVnodeMounted)){const ne=D;St(()=>Ft(be,ae,ne),V)}(D.shapeFlag&256||ae&&Pr(ae.vnode)&&ae.vnode.shapeFlag&256)&&M.a&&St(M.a,V),M.isMounted=!0,D=I=k=null}},ue=M.effect=new Gc(ee,()=>Ea(le),M.scope),le=M.update=()=>ue.run();le.id=M.uid,Ti(M,!0),le()},$=(M,D,I)=>{D.component=M;const k=M.vnode.props;M.vnode=D,M.next=null,bv(M,D.props,k,I),Av(M,D.children,I),jr(),Fu(),qr()},Y=(M,D,I,k,V,ie,fe,ee,ue=!1)=>{const le=M&&M.children,be=M?M.shapeFlag:0,w=D.children,{patchFlag:b,shapeFlag:B}=D;if(b>0){if(b&128){de(le,w,I,k,V,ie,fe,ee,ue);return}else if(b&256){he(le,w,I,k,V,ie,fe,ee,ue);return}}B&8?(be&16&&Ae(le,V,ie),w!==le&&u(I,w)):be&16?B&16?de(le,w,I,k,V,ie,fe,ee,ue):Ae(le,V,ie,!0):(be&8&&u(I,""),B&16&&P(w,I,k,V,ie,fe,ee,ue))},he=(M,D,I,k,V,ie,fe,ee,ue)=>{M=M||wr,D=D||wr;const le=M.length,be=D.length,w=Math.min(le,be);let b;for(b=0;b<w;b++){const B=D[b]=ue?ai(D[b]):Qt(D[b]);_(M[b],B,I,null,V,ie,fe,ee,ue)}le>be?Ae(M,V,ie,!0,!1,w):P(D,I,k,V,ie,fe,ee,ue,w)},de=(M,D,I,k,V,ie,fe,ee,ue)=>{let le=0;const be=D.length;let w=M.length-1,b=be-1;for(;le<=w&&le<=b;){const B=M[le],te=D[le]=ue?ai(D[le]):Qt(D[le]);if(dn(B,te))_(B,te,I,null,V,ie,fe,ee,ue);else break;le++}for(;le<=w&&le<=b;){const B=M[w],te=D[b]=ue?ai(D[b]):Qt(D[b]);if(dn(B,te))_(B,te,I,null,V,ie,fe,ee,ue);else break;w--,b--}if(le>w){if(le<=b){const B=b+1,te=B<be?D[B].el:k;for(;le<=b;)_(null,D[le]=ue?ai(D[le]):Qt(D[le]),I,te,V,ie,fe,ee,ue),le++}}else if(le>b)for(;le<=w;)Q(M[le],V,ie,!0),le++;else{const B=le,te=le,ae=new Map;for(le=te;le<=b;le++){const xe=D[le]=ue?ai(D[le]):Qt(D[le]);xe.key!=null&&ae.set(xe.key,le)}let L,ne=0;const pe=b-te+1;let K=!1,Re=0;const Pe=new Array(pe);for(le=0;le<pe;le++)Pe[le]=0;for(le=B;le<=w;le++){const xe=M[le];if(ne>=pe){Q(xe,V,ie,!0);continue}let Me;if(xe.key!=null)Me=ae.get(xe.key);else for(L=te;L<=b;L++)if(Pe[L-te]===0&&dn(xe,D[L])){Me=L;break}Me===void 0?Q(xe,V,ie,!0):(Pe[Me-te]=le+1,Me>=Re?Re=Me:K=!0,_(xe,D[Me],I,null,V,ie,fe,ee,ue),ne++)}const Le=K?Lv(Pe):wr;for(L=Le.length-1,le=pe-1;le>=0;le--){const xe=te+le,Me=D[xe],Ue=xe+1<be?D[xe+1].el:k;Pe[le]===0?_(null,Me,I,Ue,V,ie,fe,ee,ue):K&&(L<0||le!==Le[L]?X(Me,I,Ue,2):L--)}}},X=(M,D,I,k,V=null)=>{const{el:ie,type:fe,transition:ee,children:ue,shapeFlag:le}=M;if(le&6){X(M.component.subTree,D,I,k);return}if(le&128){M.suspense.move(D,I,k);return}if(le&64){fe.move(M,D,I,ce);return}if(fe===$t){i(ie,D,I);for(let w=0;w<ue.length;w++)X(ue[w],D,I,k);i(M.anchor,D,I);return}if(fe===Go){x(M,D,I);return}if(k!==2&&le&1&&ee)if(k===0)ee.beforeEnter(ie),i(ie,D,I),St(()=>ee.enter(ie),V);else{const{leave:w,delayLeave:b,afterLeave:B}=ee,te=()=>i(ie,D,I),ae=()=>{w(ie,()=>{te(),B&&B()})};b?b(ie,te,ae):ae()}else i(ie,D,I)},Q=(M,D,I,k=!1,V=!1)=>{const{type:ie,props:fe,ref:ee,children:ue,dynamicChildren:le,shapeFlag:be,patchFlag:w,dirs:b}=M;if(ee!=null&&sa(ee,null,I,M,!0),be&256){D.ctx.deactivate(M);return}const B=be&1&&b,te=!Pr(M);let ae;if(te&&(ae=fe&&fe.onVnodeBeforeUnmount)&&Ft(ae,D,M),be&6)ye(M.component,I,k);else{if(be&128){M.suspense.unmount(I,k);return}B&&Sn(M,null,D,"beforeUnmount"),be&64?M.type.remove(M,D,I,V,ce,k):le&&(ie!==$t||w>0&&w&64)?Ae(le,D,I,!1,!0):(ie===$t&&w&384||!V&&be&16)&&Ae(ue,D,I),k&&_e(M)}(te&&(ae=fe&&fe.onVnodeUnmounted)||B)&&St(()=>{ae&&Ft(ae,D,M),B&&Sn(M,null,D,"unmounted")},I)},_e=M=>{const{type:D,el:I,anchor:k,transition:V}=M;if(D===$t){ge(I,k);return}if(D===Go){y(M);return}const ie=()=>{r(I),V&&!V.persisted&&V.afterLeave&&V.afterLeave()};if(M.shapeFlag&1&&V&&!V.persisted){const{leave:fe,delayLeave:ee}=V,ue=()=>fe(I,ie);ee?ee(M.el,ie,ue):ue()}else ie()},ge=(M,D)=>{let I;for(;M!==D;)I=d(M),r(M),M=I;r(D)},ye=(M,D,I)=>{const{bum:k,scope:V,update:ie,subTree:fe,um:ee}=M;k&&ds(k),V.stop(),ie&&(ie.active=!1,Q(fe,M,D,I)),ee&&St(ee,D),St(()=>{M.isUnmounted=!0},D),D&&D.pendingBranch&&!D.isUnmounted&&M.asyncDep&&!M.asyncResolved&&M.suspenseId===D.pendingId&&(D.deps--,D.deps===0&&D.resolve())},Ae=(M,D,I,k=!1,V=!1,ie=0)=>{for(let fe=ie;fe<M.length;fe++)Q(M[fe],D,I,k,V)},j=M=>M.shapeFlag&6?j(M.component.subTree):M.shapeFlag&128?M.suspense.next():d(M.anchor||M.el),oe=(M,D,I)=>{M==null?D._vnode&&Q(D._vnode,null,null,!0):_(D._vnode||null,M,D,null,null,null,I),Fu(),ta(),D._vnode=M},ce={p:_,um:Q,m:X,r:_e,mt:U,mc:P,pc:Y,pbc:T,n:j,o:t};let Ee,we;return e&&([Ee,we]=e(ce)),{render:oe,hydrate:Ee,createApp:Ev(oe,Ee)}}function Ti({effect:t,update:e},n){t.allowRecurse=e.allowRecurse=n}function Pp(t,e,n=!1){const i=t.children,r=e.children;if(Ie(i)&&Ie(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=ai(r[s]),a.el=o.el),n||Pp(o,a)),a.type===Nr&&(a.el=o.el)}}function Lv(t){const e=t.slice(),n=[0];let i,r,s,o,a;const l=t.length;for(i=0;i<l;i++){const c=t[i];if(c!==0){if(r=n[n.length-1],t[r]<c){e[i]=r,n.push(i);continue}for(s=0,o=n.length-1;s<o;)a=s+o>>1,t[n[a]]<c?s=a+1:o=a;c<t[n[s]]&&(s>0&&(e[i]=n[s-1]),n[s]=i)}}for(s=n.length,o=n[s-1];s-- >0;)n[s]=o,o=e[o];return n}const Dv=t=>t.__isTeleport,$t=Symbol.for("v-fgt"),Nr=Symbol.for("v-txt"),Ht=Symbol.for("v-cmt"),Go=Symbol.for("v-stc"),ms=[];let nn=null;function Mt(t=!1){ms.push(nn=t?null:[])}function Lp(){ms.pop(),nn=ms[ms.length-1]||null}let Or=1;function Zu(t){Or+=t}function Dp(t){return t.dynamicChildren=Or>0?nn||wr:null,Lp(),Or>0&&nn&&nn.push(t),t}function ci(t,e,n,i,r,s){return Dp(Ra(t,e,n,i,r,s,!0))}function kn(t,e,n,i,r){return Dp(st(t,e,n,i,r,!0))}function Ns(t){return t?t.__v_isVNode===!0:!1}function dn(t,e){return t.type===e.type&&t.key===e.key}const Aa="__vInternal",Ip=({key:t})=>t??null,Vo=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?at(t)||rt(t)||Be(t)?{i:Yt,r:t,k:e,f:!!n}:t:null);function Ra(t,e=null,n=null,i=0,r=null,s=t===$t?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Ip(e),ref:e&&Vo(e),scopeId:ba,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Yt};return a?(su(l,n),s&128&&t.normalize(l)):n&&(l.shapeFlag|=at(n)?8:16),Or>0&&!o&&nn&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&nn.push(l),l}const st=Iv;function Iv(t,e=null,n=null,i=0,r=null,s=!1){if((!t||t===yp)&&(t=Ht),Ns(t)){const a=$n(t,e,!0);return n&&su(a,n),Or>0&&!s&&nn&&(a.shapeFlag&6?nn[nn.indexOf(t)]=a:nn.push(a)),a.patchFlag|=-2,a}if(Gv(t)&&(t=t.__vccOpts),e){e=Up(e);let{class:a,style:l}=e;a&&!at(a)&&(e.class=xa(a)),tt(l)&&(Zd(l)&&!Ie(l)&&(l=mt({},l)),e.style=va(l))}const o=at(t)?1:lp(t)?128:Dv(t)?64:tt(t)?4:Be(t)?2:0;return Ra(t,e,n,i,r,o,s,!0)}function Up(t){return t?Zd(t)||Aa in t?mt({},t):t:null}function $n(t,e,n=!1){const{props:i,ref:r,patchFlag:s,children:o}=t,a=e?Uv(i||{},e):i;return{__v_isVNode:!0,__v_skip:!0,type:t.type,props:a,key:a&&Ip(a),ref:e&&e.ref?n&&r?Ie(r)?r.concat(Vo(e)):[r,Vo(e)]:Vo(e):r,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:o,target:t.target,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==$t?s===-1?16:s|16:s,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:t.transition,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&$n(t.ssContent),ssFallback:t.ssFallback&&$n(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce}}function ru(t=" ",e=0){return st(Nr,null,t,e)}function us(t="",e=!1){return e?(Mt(),kn(Ht,null,t)):st(Ht,null,t)}function Qt(t){return t==null||typeof t=="boolean"?st(Ht):Ie(t)?st($t,null,t.slice()):typeof t=="object"?ai(t):st(Nr,null,String(t))}function ai(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:$n(t)}function su(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(Ie(e))n=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),su(t,r()),r._c&&(r._d=!0));return}else{n=32;const r=e._;!r&&!(Aa in e)?e._ctx=Yt:r===3&&Yt&&(Yt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Be(e)?(e={default:e,_ctx:Yt},n=32):(e=String(e),i&64?(n=16,e=[ru(e)]):n=8);t.children=e,t.shapeFlag|=n}function Uv(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=xa([e.class,i.class]));else if(r==="style")e.style=va([e.style,i.style]);else if(Gs(r)){const s=e[r],o=i[r];o&&s!==o&&!(Ie(s)&&s.includes(o))&&(e[r]=s?[].concat(s,o):o)}else r!==""&&(e[r]=i[r])}return e}function Ft(t,e,n,i=null){rn(t,e,7,[n,i])}const Nv=Sp();let Ov=0;function Fv(t,e,n){const i=t.type,r=(e?e.appContext:t.appContext)||Nv,s={uid:Ov++,vnode:t,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,scope:new Fd(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Tp(i,r),emitsOptions:ap(i,r),emit:null,emitted:null,propsDefaults:it,inheritAttrs:i.inheritAttrs,ctx:it,data:it,props:it,attrs:it,slots:it,refs:it,setupState:it,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=G_.bind(null,s),t.ce&&t.ce(s),s}let pt=null;const js=()=>pt||Yt;let ou,Ji,Ju="__VUE_INSTANCE_SETTERS__";(Ji=Gl()[Ju])||(Ji=Gl()[Ju]=[]),Ji.push(t=>pt=t),ou=t=>{Ji.length>1?Ji.forEach(e=>e(t)):Ji[0](t)};const Fr=t=>{ou(t),t.scope.on()},ki=()=>{pt&&pt.scope.off(),ou(null)};function Np(t){return t.vnode.shapeFlag&4}let Br=!1;function Bv(t,e=!1){Br=e;const{props:n,children:i}=t.vnode,r=Np(t);Sv(t,n,r,e),wv(t,i);const s=r?Hv(t,e):void 0;return Br=!1,s}function Hv(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=Ma(new Proxy(t.ctx,mv));const{setup:i}=n;if(i){const r=t.setupContext=i.length>1?zv(t):null;Fr(t),jr();const s=gi(i,t,0,[t.props,r]);if(qr(),ki(),Ld(s)){if(s.then(ki,ki),e)return s.then(o=>{Jl(t,o,e)}).catch(o=>{$r(o,t,0)});t.asyncDep=s}else Jl(t,s,e)}else Op(t,e)}function Jl(t,e,n){Be(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:tt(e)&&(t.setupState=tp(e)),Op(t,n)}let Qu;function Op(t,e,n){const i=t.type;if(!t.render){if(!e&&Qu&&!i.render){const r=i.template||tu(t).template;if(r){const{isCustomElement:s,compilerOptions:o}=t.appContext.config,{delimiters:a,compilerOptions:l}=i,c=mt(mt({isCustomElement:s,delimiters:a},o),l);i.render=Qu(r,c)}}t.render=i.render||_n}Fr(t),jr(),gv(t),qr(),ki()}function kv(t){return t.attrsProxy||(t.attrsProxy=new Proxy(t.attrs,{get(e,n){return Gt(t,"get","$attrs"),e[n]}}))}function zv(t){const e=n=>{t.exposed=n||{}};return{get attrs(){return kv(t)},slots:t.slots,emit:t.emit,expose:e}}function au(t){if(t.exposed)return t.exposeProxy||(t.exposeProxy=new Proxy(tp(Ma(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in ps)return ps[n](t)},has(e,n){return n in e||n in ps}}))}function Ql(t,e=!0){return Be(t)?t.displayName||t.name:t.name||e&&t.__name}function Gv(t){return Be(t)&&"__vccOpts"in t}const Nt=(t,e)=>F_(t,e,Br);function vn(t,e,n){const i=arguments.length;return i===2?tt(e)&&!Ie(e)?Ns(e)?st(t,null,[e]):st(t,e):st(t,null,e):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&Ns(n)&&(n=[n]),st(t,e,n))}const Vv=Symbol.for("v-scx"),Wv=()=>Bt(Vv),Fp="3.3.4",Xv="http://www.w3.org/2000/svg",Ni=typeof document<"u"?document:null,ef=Ni&&Ni.createElement("template"),jv={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const r=e?Ni.createElementNS(Xv,t):Ni.createElement(t,n?{is:n}:void 0);return t==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:t=>Ni.createTextNode(t),createComment:t=>Ni.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Ni.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,r,s){const o=n?n.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{ef.innerHTML=i?`<svg>${t}</svg>`:t;const a=ef.content;if(i){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}};function qv(t,e,n){const i=t._vtc;i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}function $v(t,e,n){const i=t.style,r=at(n);if(n&&!r){if(e&&!at(e))for(const s in e)n[s]==null&&ec(i,s,"");for(const s in n)ec(i,s,n[s])}else{const s=i.display;r?e!==n&&(i.cssText=n):e&&t.removeAttribute("style"),"_vod"in t&&(i.display=s)}}const tf=/\s*!important$/;function ec(t,e,n){if(Ie(n))n.forEach(i=>ec(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const i=Yv(t,e);tf.test(n)?t.setProperty(Xr(i),n.replace(tf,""),"important"):t[i]=n}}const nf=["Webkit","Moz","ms"],Ka={};function Yv(t,e){const n=Ka[e];if(n)return n;let i=An(e);if(i!=="filter"&&i in t)return Ka[e]=i;i=_a(i);for(let r=0;r<nf.length;r++){const s=nf[r]+i;if(s in t)return Ka[e]=s}return e}const rf="http://www.w3.org/1999/xlink";function Kv(t,e,n,i,r){if(i&&e.startsWith("xlink:"))n==null?t.removeAttributeNS(rf,e.slice(6,e.length)):t.setAttributeNS(rf,e,n);else{const s=t_(e);n==null||s&&!Nd(n)?t.removeAttribute(e):t.setAttribute(e,s?"":n)}}function Zv(t,e,n,i,r,s,o){if(e==="innerHTML"||e==="textContent"){i&&o(i,r,s),t[e]=n??"";return}const a=t.tagName;if(e==="value"&&a!=="PROGRESS"&&!a.includes("-")){t._value=n;const c=a==="OPTION"?t.getAttribute("value"):t.value,u=n??"";c!==u&&(t.value=u),n==null&&t.removeAttribute(e);return}let l=!1;if(n===""||n==null){const c=typeof t[e];c==="boolean"?n=Nd(n):n==null&&c==="string"?(n="",l=!0):c==="number"&&(n=0,l=!0)}try{t[e]=n}catch{}l&&t.removeAttribute(e)}function Jv(t,e,n,i){t.addEventListener(e,n,i)}function Qv(t,e,n,i){t.removeEventListener(e,n,i)}function e0(t,e,n,i,r=null){const s=t._vei||(t._vei={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=t0(e);if(i){const c=s[e]=r0(i,r);Jv(t,a,c,l)}else o&&(Qv(t,a,o,l),s[e]=void 0)}}const sf=/(?:Once|Passive|Capture)$/;function t0(t){let e;if(sf.test(t)){e={};let i;for(;i=t.match(sf);)t=t.slice(0,t.length-i[0].length),e[i[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Xr(t.slice(2)),e]}let Za=0;const n0=Promise.resolve(),i0=()=>Za||(n0.then(()=>Za=0),Za=Date.now());function r0(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;rn(s0(i,n.value),e,5,[i])};return n.value=t,n.attached=i0(),n}function s0(t,e){if(Ie(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const of=/^on[a-z]/,o0=(t,e,n,i,r=!1,s,o,a,l)=>{e==="class"?qv(t,i,r):e==="style"?$v(t,n,i):Gs(e)?Fc(e)||e0(t,e,n,i,o):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):a0(t,e,i,r))?Zv(t,e,i,s,o,a,l):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),Kv(t,e,i,r))};function a0(t,e,n,i){return i?!!(e==="innerHTML"||e==="textContent"||e in t&&of.test(e)&&Be(n)):e==="spellcheck"||e==="draggable"||e==="translate"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA"||of.test(e)&&at(n)?!1:e in t}const Qn="transition",Qr="animation",lu=(t,{slots:e})=>vn(iv,l0(t),e);lu.displayName="Transition";const Bp={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String};lu.props=mt({},hp,Bp);const wi=(t,e=[])=>{Ie(t)?t.forEach(n=>n(...e)):t&&t(...e)},af=t=>t?Ie(t)?t.some(e=>e.length>1):t.length>1:!1;function l0(t){const e={};for(const H in t)H in Bp||(e[H]=t[H]);if(t.css===!1)return e;const{name:n="v",type:i,duration:r,enterFromClass:s=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:l=s,appearActiveClass:c=o,appearToClass:u=a,leaveFromClass:f=`${n}-leave-from`,leaveActiveClass:d=`${n}-leave-active`,leaveToClass:p=`${n}-leave-to`}=t,g=c0(r),_=g&&g[0],m=g&&g[1],{onBeforeEnter:h,onEnter:v,onEnterCancelled:x,onLeave:y,onLeaveCancelled:S,onBeforeAppear:R=h,onAppear:A=v,onAppearCancelled:P=x}=e,E=(H,N,U)=>{Ai(H,N?u:a),Ai(H,N?c:o),U&&U()},T=(H,N)=>{H._isLeaving=!1,Ai(H,f),Ai(H,p),Ai(H,d),N&&N()},F=H=>(N,U)=>{const W=H?A:v,Z=()=>E(N,H,U);wi(W,[N,Z]),lf(()=>{Ai(N,H?l:s),ei(N,H?u:a),af(W)||cf(N,i,_,Z)})};return mt(e,{onBeforeEnter(H){wi(h,[H]),ei(H,s),ei(H,o)},onBeforeAppear(H){wi(R,[H]),ei(H,l),ei(H,c)},onEnter:F(!1),onAppear:F(!0),onLeave(H,N){H._isLeaving=!0;const U=()=>T(H,N);ei(H,f),h0(),ei(H,d),lf(()=>{H._isLeaving&&(Ai(H,f),ei(H,p),af(y)||cf(H,i,m,U))}),wi(y,[H,U])},onEnterCancelled(H){E(H,!1),wi(x,[H])},onAppearCancelled(H){E(H,!0),wi(P,[H])},onLeaveCancelled(H){T(H),wi(S,[H])}})}function c0(t){if(t==null)return null;if(tt(t))return[Ja(t.enter),Ja(t.leave)];{const e=Ja(t);return[e,e]}}function Ja(t){return Ud(t)}function ei(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t._vtc||(t._vtc=new Set)).add(e)}function Ai(t,e){e.split(/\s+/).forEach(i=>i&&t.classList.remove(i));const{_vtc:n}=t;n&&(n.delete(e),n.size||(t._vtc=void 0))}function lf(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let u0=0;function cf(t,e,n,i){const r=t._endId=++u0,s=()=>{r===t._endId&&i()};if(n)return setTimeout(s,n);const{type:o,timeout:a,propCount:l}=f0(t,e);if(!o)return i();const c=o+"end";let u=0;const f=()=>{t.removeEventListener(c,d),s()},d=p=>{p.target===t&&++u>=l&&f()};setTimeout(()=>{u<l&&f()},a+1),t.addEventListener(c,d)}function f0(t,e){const n=window.getComputedStyle(t),i=g=>(n[g]||"").split(", "),r=i(`${Qn}Delay`),s=i(`${Qn}Duration`),o=uf(r,s),a=i(`${Qr}Delay`),l=i(`${Qr}Duration`),c=uf(a,l);let u=null,f=0,d=0;e===Qn?o>0&&(u=Qn,f=o,d=s.length):e===Qr?c>0&&(u=Qr,f=c,d=l.length):(f=Math.max(o,c),u=f>0?o>c?Qn:Qr:null,d=u?u===Qn?s.length:l.length:0);const p=u===Qn&&/\b(transform|all)(,|$)/.test(i(`${Qn}Property`).toString());return{type:u,timeout:f,propCount:d,hasTransform:p}}function uf(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,i)=>ff(n)+ff(t[i])))}function ff(t){return Number(t.slice(0,-1).replace(",","."))*1e3}function h0(){return document.body.offsetHeight}const Hp=mt({patchProp:o0},jv);let gs,hf=!1;function d0(){return gs||(gs=Cv(Hp))}function p0(){return gs=hf?gs:Pv(Hp),hf=!0,gs}const m0=(...t)=>{const e=d0().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=kp(i);if(!r)return;const s=e._component;!Be(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.innerHTML="";const o=n(r,!1,r instanceof SVGElement);return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e},g0=(...t)=>{const e=p0().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=kp(i);if(r)return n(r,!0,r instanceof SVGElement)},e};function kp(t){return at(t)?document.querySelector(t):t}const _0=/"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,v0=/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,x0=/^\s*["[{]|^\s*-?\d[\d.]{0,14}\s*$/;function y0(t,e){if(t==="__proto__"||t==="constructor"&&e&&typeof e=="object"&&"prototype"in e){M0(t);return}return e}function M0(t){console.warn(`[destr] Dropping "${t}" key to prevent prototype pollution.`)}function E0(t,e={}){if(typeof t!="string")return t;const n=t.trim();if(t[0]==='"'&&t[t.length-1]==='"')return n.slice(1,-1);const i=n.toLowerCase();if(i==="true")return!0;if(i==="false")return!1;if(i!=="undefined"){if(i==="null")return null;if(i==="nan")return Number.NaN;if(i==="infinity")return Number.POSITIVE_INFINITY;if(i==="-infinity")return Number.NEGATIVE_INFINITY;if(!x0.test(t)){if(e.strict)throw new SyntaxError("[destr] Invalid JSON");return t}try{if(_0.test(t)||v0.test(t)){if(e.strict)throw new Error("[destr] Possible prototype pollution");return JSON.parse(t,y0)}return JSON.parse(t)}catch(r){if(e.strict)throw r;return t}}}const S0=/#/g,b0=/&/g,T0=/=/g,zp=/\+/g,w0=/%5e/gi,A0=/%60/gi,R0=/%7c/gi,C0=/%20/gi;function P0(t){return encodeURI(""+t).replace(R0,"|")}function tc(t){return P0(typeof t=="string"?t:JSON.stringify(t)).replace(zp,"%2B").replace(C0,"+").replace(S0,"%23").replace(b0,"%26").replace(A0,"`").replace(w0,"^")}function Qa(t){return tc(t).replace(T0,"%3D")}function Gp(t=""){try{return decodeURIComponent(""+t)}catch{return""+t}}function L0(t){return Gp(t.replace(zp," "))}function Vp(t=""){const e={};t[0]==="?"&&(t=t.slice(1));for(const n of t.split("&")){const i=n.match(/([^=]+)=?(.*)/)||[];if(i.length<2)continue;const r=Gp(i[1]);if(r==="__proto__"||r==="constructor")continue;const s=L0(i[2]||"");typeof e[r]<"u"?Array.isArray(e[r])?e[r].push(s):e[r]=[e[r],s]:e[r]=s}return e}function D0(t,e){return(typeof e=="number"||typeof e=="boolean")&&(e=String(e)),e?Array.isArray(e)?e.map(n=>`${Qa(t)}=${tc(n)}`).join("&"):`${Qa(t)}=${tc(e)}`:Qa(t)}function I0(t){return Object.keys(t).filter(e=>t[e]!==void 0).map(e=>D0(e,t[e])).join("&")}const U0=/^\w{2,}:([/\\]{1,2})/,N0=/^\w{2,}:([/\\]{2})?/,O0=/^([/\\]\s*){2,}[^/\\]/;function Kr(t,e={}){return typeof e=="boolean"&&(e={acceptRelative:e}),e.strict?U0.test(t):N0.test(t)||(e.acceptRelative?O0.test(t):!1)}const F0=/\/$|\/\?/;function nc(t="",e=!1){return e?F0.test(t):t.endsWith("/")}function cu(t="",e=!1){if(!e)return(nc(t)?t.slice(0,-1):t)||"/";if(!nc(t,!0))return t||"/";const[n,...i]=t.split("?");return(n.slice(0,-1)||"/")+(i.length>0?`?${i.join("?")}`:"")}function Wp(t="",e=!1){if(!e)return t.endsWith("/")?t:t+"/";if(nc(t,!0))return t||"/";const[n,...i]=t.split("?");return n+"/"+(i.length>0?`?${i.join("?")}`:"")}function B0(t=""){return t.startsWith("/")}function H0(t=""){return(B0(t)?t.slice(1):t)||"/"}function k0(t,e){if(jp(e)||Kr(t))return t;const n=cu(e);return t.startsWith(n)?t:qs(n,t)}function df(t,e){if(jp(e))return t;const n=cu(e);if(!t.startsWith(n))return t;const i=t.slice(n.length);return i[0]==="/"?i:"/"+i}function Xp(t,e){const n=$s(t),i={...Vp(n.search),...e};return n.search=I0(i),G0(n)}function jp(t){return!t||t==="/"}function z0(t){return t&&t!=="/"}function qs(t,...e){let n=t||"";for(const i of e.filter(r=>z0(r)))n=n?Wp(n)+H0(i):i;return n}function $s(t="",e){if(!Kr(t,{acceptRelative:!0}))return e?$s(e+t):pf(t);const[n="",i,r=""]=(t.replace(/\\/g,"/").match(/([^/:]+:)?\/\/([^/@]+@)?(.*)/)||[]).splice(1),[s="",o=""]=(r.match(/([^#/?]*)(.*)?/)||[]).splice(1),{pathname:a,search:l,hash:c}=pf(o.replace(/\/(?=[A-Za-z]:)/,""));return{protocol:n,auth:i?i.slice(0,Math.max(0,i.length-1)):"",host:s,pathname:a,search:l,hash:c}}function pf(t=""){const[e="",n="",i=""]=(t.match(/([^#?]*)(\?[^#]*)?(#.*)?/)||[]).splice(1);return{pathname:e,search:n,hash:i}}function G0(t){const e=t.pathname+(t.search?(t.search.startsWith("?")?"":"?")+t.search:"")+t.hash;return t.protocol?t.protocol+"//"+(t.auth?t.auth+"@":"")+t.host+e:e}class V0 extends Error{constructor(){super(...arguments),this.name="FetchError"}}function W0(t,e,n){let i="";e&&(i=e.message),t&&n?i=`${i} (${n.status} ${n.statusText} (${t.toString()}))`:t&&(i=`${i} (${t.toString()})`);const r=new V0(i);return Object.defineProperty(r,"request",{get(){return t}}),Object.defineProperty(r,"response",{get(){return n}}),Object.defineProperty(r,"data",{get(){return n&&n._data}}),Object.defineProperty(r,"status",{get(){return n&&n.status}}),Object.defineProperty(r,"statusText",{get(){return n&&n.statusText}}),Object.defineProperty(r,"statusCode",{get(){return n&&n.status}}),Object.defineProperty(r,"statusMessage",{get(){return n&&n.statusText}}),r}const X0=new Set(Object.freeze(["PATCH","POST","PUT","DELETE"]));function mf(t="GET"){return X0.has(t.toUpperCase())}function j0(t){if(t===void 0)return!1;const e=typeof t;return e==="string"||e==="number"||e==="boolean"||e===null?!0:e!=="object"?!1:Array.isArray(t)?!0:t.constructor&&t.constructor.name==="Object"||typeof t.toJSON=="function"}const q0=new Set(["image/svg","application/xml","application/xhtml","application/html"]),$0=/^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;function Y0(t=""){if(!t)return"json";const e=t.split(";").shift()||"";return $0.test(e)?"json":q0.has(e)||e.startsWith("text/")?"text":"blob"}function K0(t,e,n=globalThis.Headers){const i={...e,...t};if(e!=null&&e.params&&(t!=null&&t.params)&&(i.params={...e==null?void 0:e.params,...t==null?void 0:t.params}),e!=null&&e.query&&(t!=null&&t.query)&&(i.query={...e==null?void 0:e.query,...t==null?void 0:t.query}),e!=null&&e.headers&&(t!=null&&t.headers)){i.headers=new n((e==null?void 0:e.headers)||{});for(const[r,s]of new n((t==null?void 0:t.headers)||{}))i.headers.set(r,s)}return i}const Z0=new Set([408,409,425,429,500,502,503,504]);function qp(t){const{fetch:e,Headers:n}=t;function i(o){const a=o.error&&o.error.name==="AbortError"||!1;if(o.options.retry!==!1&&!a){let c;typeof o.options.retry=="number"?c=o.options.retry:c=mf(o.options.method)?0:1;const u=o.response&&o.response.status||500;if(c>0&&Z0.has(u))return r(o.request,{...o.options,retry:c-1})}const l=W0(o.request,o.error,o.response);throw Error.captureStackTrace&&Error.captureStackTrace(l,r),l}const r=async function(a,l={}){const c={request:a,options:K0(l,t.defaults,n),response:void 0,error:void 0};c.options.onRequest&&await c.options.onRequest(c),typeof c.request=="string"&&(c.options.baseURL&&(c.request=k0(c.request,c.options.baseURL)),(c.options.query||c.options.params)&&(c.request=Xp(c.request,{...c.options.params,...c.options.query})),c.options.body&&mf(c.options.method)&&j0(c.options.body)&&(c.options.body=typeof c.options.body=="string"?c.options.body:JSON.stringify(c.options.body),c.options.headers=new n(c.options.headers||{}),c.options.headers.has("content-type")||c.options.headers.set("content-type","application/json"),c.options.headers.has("accept")||c.options.headers.set("accept","application/json")));try{c.response=await e(c.request,c.options)}catch(f){return c.error=f,c.options.onRequestError&&await c.options.onRequestError(c),await i(c)}const u=(c.options.parseResponse?"json":c.options.responseType)||Y0(c.response.headers.get("content-type")||"");if(u==="json"){const f=await c.response.text(),d=c.options.parseResponse||E0;c.response._data=d(f)}else u==="stream"?c.response._data=c.response.body:c.response._data=await c.response[u]();return c.options.onResponse&&await c.options.onResponse(c),!c.options.ignoreResponseError&&c.response.status>=400&&c.response.status<600?(c.options.onResponseError&&await c.options.onResponseError(c),await i(c)):c.response},s=async function(a,l){return(await r(a,l))._data};return s.raw=r,s.native=e,s.create=(o={})=>qp({...t,defaults:{...t.defaults,...o}}),s}const $p=function(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("unable to locate global object")}(),J0=$p.fetch||(()=>Promise.reject(new Error("[ofetch] global.fetch is not supported!"))),Q0=$p.Headers,ex=qp({fetch:J0,Headers:Q0}),tx=ex,nx=()=>{var t;return((t=window==null?void 0:window.__NUXT__)==null?void 0:t.config)||{}},oa=nx().app,ix=()=>oa.baseURL,rx=()=>oa.buildAssetsDir,sx=(...t)=>qs(Yp(),rx(),...t),Yp=(...t)=>{const e=oa.cdnURL||oa.baseURL;return t.length?qs(e,...t):e};globalThis.__buildAssetsURL=sx,globalThis.__publicAssetsURL=Yp;function ic(t,e={},n){for(const i in t){const r=t[i],s=n?`${n}:${i}`:i;typeof r=="object"&&r!==null?ic(r,e,s):typeof r=="function"&&(e[s]=r)}return e}const ox={run:t=>t()},ax=()=>ox,Kp=typeof console.createTask<"u"?console.createTask:ax;function lx(t,e){const n=e.shift(),i=Kp(n);return t.reduce((r,s)=>r.then(()=>i.run(()=>s(...e))),Promise.resolve())}function cx(t,e){const n=e.shift(),i=Kp(n);return Promise.all(t.map(r=>i.run(()=>r(...e))))}function el(t,e){for(const n of[...t])n(e)}class ux{constructor(){this._hooks={},this._before=void 0,this._after=void 0,this._deprecatedMessages=void 0,this._deprecatedHooks={},this.hook=this.hook.bind(this),this.callHook=this.callHook.bind(this),this.callHookWith=this.callHookWith.bind(this)}hook(e,n,i={}){if(!e||typeof n!="function")return()=>{};const r=e;let s;for(;this._deprecatedHooks[e];)s=this._deprecatedHooks[e],e=s.to;if(s&&!i.allowDeprecated){let o=s.message;o||(o=`${r} hook has been deprecated`+(s.to?`, please use ${s.to}`:"")),this._deprecatedMessages||(this._deprecatedMessages=new Set),this._deprecatedMessages.has(o)||(console.warn(o),this._deprecatedMessages.add(o))}if(!n.name)try{Object.defineProperty(n,"name",{get:()=>"_"+e.replace(/\W+/g,"_")+"_hook_cb",configurable:!0})}catch{}return this._hooks[e]=this._hooks[e]||[],this._hooks[e].push(n),()=>{n&&(this.removeHook(e,n),n=void 0)}}hookOnce(e,n){let i,r=(...s)=>(typeof i=="function"&&i(),i=void 0,r=void 0,n(...s));return i=this.hook(e,r),i}removeHook(e,n){if(this._hooks[e]){const i=this._hooks[e].indexOf(n);i!==-1&&this._hooks[e].splice(i,1),this._hooks[e].length===0&&delete this._hooks[e]}}deprecateHook(e,n){this._deprecatedHooks[e]=typeof n=="string"?{to:n}:n;const i=this._hooks[e]||[];delete this._hooks[e];for(const r of i)this.hook(e,r)}deprecateHooks(e){Object.assign(this._deprecatedHooks,e);for(const n in e)this.deprecateHook(n,e[n])}addHooks(e){const n=ic(e),i=Object.keys(n).map(r=>this.hook(r,n[r]));return()=>{for(const r of i.splice(0,i.length))r()}}removeHooks(e){const n=ic(e);for(const i in n)this.removeHook(i,n[i])}removeAllHooks(){for(const e in this._hooks)delete this._hooks[e]}callHook(e,...n){return n.unshift(e),this.callHookWith(lx,e,...n)}callHookParallel(e,...n){return n.unshift(e),this.callHookWith(cx,e,...n)}callHookWith(e,n,...i){const r=this._before||this._after?{name:n,args:i,context:{}}:void 0;this._before&&el(this._before,r);const s=e(n in this._hooks?[...this._hooks[n]]:[],i);return s instanceof Promise?s.finally(()=>{this._after&&r&&el(this._after,r)}):(this._after&&r&&el(this._after,r),s)}beforeEach(e){return this._before=this._before||[],this._before.push(e),()=>{if(this._before!==void 0){const n=this._before.indexOf(e);n!==-1&&this._before.splice(n,1)}}}afterEach(e){return this._after=this._after||[],this._after.push(e),()=>{if(this._after!==void 0){const n=this._after.indexOf(e);n!==-1&&this._after.splice(n,1)}}}}function Zp(){return new ux}function fx(t={}){let e,n=!1;const i=o=>{if(e&&e!==o)throw new Error("Context conflict")};let r;if(t.asyncContext){const o=t.AsyncLocalStorage||globalThis.AsyncLocalStorage;o?r=new o:console.warn("[unctx] `AsyncLocalStorage` is not provided.")}const s=()=>{if(r&&e===void 0){const o=r.getStore();if(o!==void 0)return o}return e};return{use:()=>{const o=s();if(o===void 0)throw new Error("Context is not available");return o},tryUse:()=>s(),set:(o,a)=>{a||i(o),e=o,n=!0},unset:()=>{e=void 0,n=!1},call:(o,a)=>{i(o),e=o;try{return r?r.run(o,a):a()}finally{n||(e=void 0)}},async callAsync(o,a){e=o;const l=()=>{e=o},c=()=>e===o?l:void 0;rc.add(c);try{const u=r?r.run(o,a):a();return n||(e=void 0),await u}finally{rc.delete(c)}}}}function hx(t={}){const e={};return{get(n,i={}){return e[n]||(e[n]=fx({...t,...i})),e[n],e[n]}}}const aa=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof global<"u"?global:typeof window<"u"?window:{},gf="__unctx__",dx=aa[gf]||(aa[gf]=hx()),px=(t,e={})=>dx.get(t,e),_f="__unctx_async_handlers__",rc=aa[_f]||(aa[_f]=new Set);function la(t){const e=[];for(const r of rc){const s=r();s&&e.push(s)}const n=()=>{for(const r of e)r()};let i=t();return i&&typeof i=="object"&&"catch"in i&&(i=i.catch(r=>{throw n(),r})),[i,n]}const Jp=px("nuxt-app"),mx="__nuxt_plugin";function gx(t){let e=0;const n={provide:void 0,globalName:"nuxt",versions:{get nuxt(){return"3.6.2"},get vue(){return n.vueApp.version}},payload:qn({data:{},state:{},_errors:{},...window.__NUXT__??{}}),static:{data:{}},runWithContext:r=>xx(n,r),isHydrating:!0,deferHydration(){if(!n.isHydrating)return()=>{};e++;let r=!1;return()=>{if(!r&&(r=!0,e--,e===0))return n.isHydrating=!1,n.callHook("app:suspense:resolve")}},_asyncDataPromises:{},_asyncData:{},_payloadRevivers:{},...t};n.hooks=Zp(),n.hook=n.hooks.hook,n.callHook=n.hooks.callHook,n.provide=(r,s)=>{const o="$"+r;ho(n,o,s),ho(n.vueApp.config.globalProperties,o,s)},ho(n.vueApp,"$nuxt",n),ho(n.vueApp.config.globalProperties,"$nuxt",n);{window.addEventListener("nuxt.preloadError",s=>{n.callHook("app:chunkError",{error:s.payload})}),window.useNuxtApp=window.useNuxtApp||lt;const r=n.hook("app:error",(...s)=>{console.error("[nuxt] error caught during app initialization",...s)});n.hook("app:mounted",r)}const i=qn(n.payload.config);return n.provide("config",i),n}async function _x(t,e){if(e.hooks&&t.hooks.addHooks(e.hooks),typeof e=="function"){const{provide:n}=await t.runWithContext(()=>e(t))||{};if(n&&typeof n=="object")for(const i in n)t.provide(i,n[i])}}async function vx(t,e){const n=[],i=[];for(const r of e){const s=_x(t,r);r.parallel?n.push(s.catch(o=>i.push(o))):await s}if(await Promise.all(n),i.length)throw i[0]}/*! @__NO_SIDE_EFFECTS__ */function Mi(t){return typeof t=="function"?t:(delete t.name,Object.assign(t.setup||(()=>{}),t,{[mx]:!0}))}function xx(t,e,n){const i=()=>n?e(...n):e();return Jp.set(t),t.vueApp.runWithContext(i)}/*! @__NO_SIDE_EFFECTS__ */function lt(){var e;let t;if(nu()&&(t=(e=js())==null?void 0:e.appContext.app.$nuxt),t=t||Jp.tryUse(),!t)throw new Error("[nuxt] instance unavailable");return t}/*! @__NO_SIDE_EFFECTS__ */function uu(){return lt().$config}function ho(t,e,n){Object.defineProperty(t,e,{get:()=>n})}const yx="modulepreload",Mx=function(t,e){return t.startsWith(".")?new URL(t,e).href:t},vf={},Ex=function(e,n,i){if(!n||n.length===0)return e();const r=document.getElementsByTagName("link");return Promise.all(n.map(s=>{if(s=Mx(s,i),s in vf)return;vf[s]=!0;const o=s.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(!!i)for(let u=r.length-1;u>=0;u--){const f=r[u];if(f.href===s&&(!o||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${a}`))return;const c=document.createElement("link");if(c.rel=o?"stylesheet":yx,o||(c.as="script",c.crossOrigin=""),c.href=s,document.head.appendChild(c),o)return new Promise((u,f)=>{c.addEventListener("load",u),c.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e())},Dr=(...t)=>Ex(...t).catch(e=>{const n=new Event("nuxt.preloadError");throw n.payload=e,window.dispatchEvent(n),e}),Sx=-1,bx=-2,Tx=-3,wx=-4,Ax=-5,Rx=-6;function Cx(t,e){return Px(JSON.parse(t),e)}function Px(t,e){if(typeof t=="number")return r(t,!0);if(!Array.isArray(t)||t.length===0)throw new Error("Invalid input");const n=t,i=Array(n.length);function r(s,o=!1){if(s===Sx)return;if(s===Tx)return NaN;if(s===wx)return 1/0;if(s===Ax)return-1/0;if(s===Rx)return-0;if(o)throw new Error("Invalid input");if(s in i)return i[s];const a=n[s];if(!a||typeof a!="object")i[s]=a;else if(Array.isArray(a))if(typeof a[0]=="string"){const l=a[0],c=e==null?void 0:e[l];if(c)return i[s]=c(r(a[1]));switch(l){case"Date":i[s]=new Date(a[1]);break;case"Set":const u=new Set;i[s]=u;for(let p=1;p<a.length;p+=1)u.add(r(a[p]));break;case"Map":const f=new Map;i[s]=f;for(let p=1;p<a.length;p+=2)f.set(r(a[p]),r(a[p+1]));break;case"RegExp":i[s]=new RegExp(a[1],a[2]);break;case"Object":i[s]=Object(a[1]);break;case"BigInt":i[s]=BigInt(a[1]);break;case"null":const d=Object.create(null);i[s]=d;for(let p=1;p<a.length;p+=2)d[a[p]]=r(a[p+1]);break;default:throw new Error(`Unknown type ${l}`)}}else{const l=new Array(a.length);i[s]=l;for(let c=0;c<a.length;c+=1){const u=a[c];u!==bx&&(l[c]=r(u))}}else{const l={};i[s]=l;for(const c in a){const u=a[c];l[c]=r(u)}}return i[s]}return r(0)}function Lx(t){return Array.isArray(t)?t:[t]}const Qp=["title","script","style","noscript"],em=["base","meta","link","style","script","noscript"],Dx=["title","titleTemplate","templateParams","base","htmlAttrs","bodyAttrs","meta","link","style","script","noscript"],Ix=["base","title","titleTemplate","bodyAttrs","htmlAttrs","templateParams"],Ux=["tagPosition","tagPriority","tagDuplicateStrategy","innerHTML","textContent"];function tm(t){let e=9;for(let n=0;n<t.length;)e=Math.imul(e^t.charCodeAt(n++),9**9);return((e^e>>>9)+65536).toString(16).substring(1,8).toLowerCase()}function sc(t){return tm(`${t.tag}:${t.textContent||t.innerHTML||""}:${Object.entries(t.props).map(([e,n])=>`${e}:${String(n)}`).join(",")}`)}function Nx(t){let e=9;for(const n of t)for(let i=0;i<n.length;)e=Math.imul(e^n.charCodeAt(i++),9**9);return((e^e>>>9)+65536).toString(16).substring(1,8).toLowerCase()}function nm(t,e){const{props:n,tag:i}=t;if(Ix.includes(i))return i;if(i==="link"&&n.rel==="canonical")return"canonical";if(n.charset)return"charset";const r=["id"];i==="meta"&&r.push("name","property","http-equiv");for(const s of r)if(typeof n[s]<"u"){const o=String(n[s]);return e&&!e(o)?!1:`${i}:${s}:${o}`}return!1}function xf(t,e){return t==null?e||null:typeof t=="function"?t(e):t}function po(t,e=!1,n){const{tag:i,$el:r}=t;r&&(Object.entries(i.props).forEach(([s,o])=>{o=String(o);const a=`attr:${s}`;if(s==="class"){if(!o)return;for(const l of o.split(" ")){const c=`${a}:${l}`;n&&n(t,c,()=>r.classList.remove(l)),r.classList.contains(l)||r.classList.add(l)}return}n&&!s.startsWith("data-h-")&&n(t,a,()=>r.removeAttribute(s)),(e||r.getAttribute(s)!==o)&&r.setAttribute(s,o)}),Qp.includes(i.tag)&&(i.textContent&&i.textContent!==r.textContent?r.textContent=i.textContent:i.innerHTML&&i.innerHTML!==r.innerHTML&&(r.innerHTML=i.innerHTML)))}let es=!1;async function Ox(t,e={}){var d,p;const n={shouldRender:!0};if(await t.hooks.callHook("dom:beforeRender",n),!n.shouldRender)return;const i=e.document||t.resolvedOptions.document||window.document,r=(await t.resolveTags()).map(a);if(t.resolvedOptions.experimentalHashHydration&&(es=es||t._hash||!1,es)){const g=Nx(r.map(_=>_.tag._h));if(es===g)return;es=g}const s=t._popSideEffectQueue();t.headEntries().map(g=>g._sde).forEach(g=>{Object.entries(g).forEach(([_,m])=>{s[_]=m})});const o=(g,_,m)=>{_=`${g.renderId}:${_}`,g.entry&&(g.entry._sde[_]=m),delete s[_]};function a(g){const _=t.headEntries().find(h=>h._i===g._e),m={renderId:g._d||sc(g),$el:null,shouldRender:!0,tag:g,entry:_,markSideEffect:(h,v)=>o(m,h,v)};return m}const l=[],c={body:[],head:[]},u=g=>{t._elMap[g.renderId]=g.$el,l.push(g),o(g,"el",()=>{var _;(_=g.$el)==null||_.remove(),delete t._elMap[g.renderId]})};for(const g of r){if(await t.hooks.callHook("dom:beforeRenderTag",g),!g.shouldRender)continue;const{tag:_}=g;if(_.tag==="title"){i.title=_.textContent||"",l.push(g);continue}if(_.tag==="htmlAttrs"||_.tag==="bodyAttrs"){g.$el=i[_.tag==="htmlAttrs"?"documentElement":"body"],po(g,!1,o),l.push(g);continue}if(g.$el=t._elMap[g.renderId],!g.$el&&_.key&&(g.$el=i.querySelector(`${(d=_.tagPosition)!=null&&d.startsWith("body")?"body":"head"} > ${_.tag}[data-h-${_._h}]`)),g.$el){g.tag._d&&po(g),u(g);continue}c[(p=_.tagPosition)!=null&&p.startsWith("body")?"body":"head"].push(g)}const f={bodyClose:void 0,bodyOpen:void 0,head:void 0};Object.entries(c).forEach(([g,_])=>{var h;if(!_.length)return;const m=(h=i==null?void 0:i[g])==null?void 0:h.children;if(m){for(const v of[...m].reverse()){const x=v.tagName.toLowerCase();if(!em.includes(x))continue;const y=v.getAttributeNames().reduce((P,E)=>({...P,[E]:v.getAttribute(E)}),{}),S={tag:x,props:y};v.innerHTML&&(S.innerHTML=v.innerHTML);const R=sc(S);let A=_.findIndex(P=>(P==null?void 0:P.renderId)===R);if(A===-1){const P=nm(S);A=_.findIndex(E=>(E==null?void 0:E.tag._d)&&E.tag._d===P)}if(A!==-1){const P=_[A];P.$el=v,po(P),u(P),delete _[A]}}_.forEach(v=>{const x=v.tag.tagPosition||"head";f[x]=f[x]||i.createDocumentFragment(),v.$el||(v.$el=i.createElement(v.tag.tag),po(v,!0)),f[x].appendChild(v.$el),u(v)})}}),f.head&&i.head.appendChild(f.head),f.bodyOpen&&i.body.insertBefore(f.bodyOpen,i.body.firstChild),f.bodyClose&&i.body.appendChild(f.bodyClose);for(const g of l)await t.hooks.callHook("dom:renderTag",g);Object.values(s).forEach(g=>g())}let tl=null;async function Fx(t,e={}){function n(){return tl=null,Ox(t,e)}const i=e.delayFn||(r=>setTimeout(r,10));return tl=tl||new Promise(r=>i(()=>r(n())))}function Bx(t){return{hooks:{"entries:updated":function(e){if(typeof(t==null?void 0:t.document)>"u"&&typeof window>"u")return;let n=t==null?void 0:t.delayFn;!n&&typeof requestAnimationFrame<"u"&&(n=requestAnimationFrame),Fx(e,{document:(t==null?void 0:t.document)||window.document,delayFn:n})}}}}function Hx(t){var e;return((e=t==null?void 0:t.head.querySelector('meta[name="unhead:ssr"]'))==null?void 0:e.getAttribute("content"))||!1}const yf={base:-1,title:1},Mf={critical:-8,high:-1,low:2};function ca(t){let e=10;const n=t.tagPriority;return typeof n=="number"?n:(t.tag==="meta"?(t.props.charset&&(e=-2),t.props["http-equiv"]==="content-security-policy"&&(e=0)):t.tag in yf&&(e=yf[t.tag]),typeof n=="string"&&n in Mf?e+Mf[n]:e)}const kx=[{prefix:"before:",offset:-1},{prefix:"after:",offset:1}];function zx(){return{hooks:{"tags:resolve":t=>{const e=n=>{var i;return(i=t.tags.find(r=>r._d===n))==null?void 0:i._p};for(const{prefix:n,offset:i}of kx)for(const r of t.tags.filter(s=>typeof s.tagPriority=="string"&&s.tagPriority.startsWith(n))){const s=e(r.tagPriority.replace(n,""));typeof s<"u"&&(r._p=s+i)}t.tags.sort((n,i)=>n._p-i._p).sort((n,i)=>ca(n)-ca(i))}}}}function Gx(){return{hooks:{"tags:resolve":t=>{const{tags:e}=t;let n=e.findIndex(r=>r.tag==="titleTemplate");const i=e.findIndex(r=>r.tag==="title");if(i!==-1&&n!==-1){const r=xf(e[n].textContent,e[i].textContent);r!==null?e[i].textContent=r||e[i].textContent:delete e[i]}else if(n!==-1){const r=xf(e[n].textContent);r!==null&&(e[n].textContent=r,e[n].tag="title",n=-1)}n!==-1&&delete e[n],t.tags=e.filter(Boolean)}}}}function Vx(){return{hooks:{"tag:normalise":function({tag:t}){typeof t.props.body<"u"&&(t.tagPosition="bodyClose",delete t.props.body)}}}}const Wx=["link","style","script","noscript"];function Xx(){return{hooks:{"tag:normalise":({tag:t,resolvedOptions:e})=>{e.experimentalHashHydration===!0&&(t._h=sc(t)),t.key&&Wx.includes(t.tag)&&(t._h=tm(t.key),t.props[`data-h-${t._h}`]="")}}}}const Ef=["script","link","bodyAttrs"];function jx(){const t=(e,n)=>{const i={},r={};Object.entries(n.props).forEach(([o,a])=>{o.startsWith("on")&&typeof a=="function"?r[o]=a:i[o]=a});let s;return e==="dom"&&n.tag==="script"&&typeof i.src=="string"&&typeof r.onload<"u"&&(s=i.src,delete i.src),{props:i,eventHandlers:r,delayedSrc:s}};return{hooks:{"ssr:render":function(e){e.tags=e.tags.map(n=>(!Ef.includes(n.tag)||!Object.entries(n.props).find(([i,r])=>i.startsWith("on")&&typeof r=="function")||(n.props=t("ssr",n).props),n))},"dom:beforeRenderTag":function(e){if(!Ef.includes(e.tag.tag)||!Object.entries(e.tag.props).find(([s,o])=>s.startsWith("on")&&typeof o=="function"))return;const{props:n,eventHandlers:i,delayedSrc:r}=t("dom",e.tag);Object.keys(i).length&&(e.tag.props=n,e.tag._eventHandlers=i,e.tag._delayedSrc=r)},"dom:renderTag":function(e){const n=e.$el;if(!e.tag._eventHandlers||!n)return;const i=e.tag.tag==="bodyAttrs"&&typeof window<"u"?window:n;Object.entries(e.tag._eventHandlers).forEach(([r,s])=>{const o=`${e.tag._d||e.tag._p}:${r}`,a=r.slice(2).toLowerCase(),l=`data-h-${a}`;if(e.markSideEffect(o,()=>{}),n.hasAttribute(l))return;const c=s;n.setAttribute(l,""),i.addEventListener(a,c),e.entry&&(e.entry._sde[o]=()=>{i.removeEventListener(a,c),n.removeAttribute(l)})}),e.tag._delayedSrc&&n.setAttribute("src",e.tag._delayedSrc)}}}}const qx=["templateParams","htmlAttrs","bodyAttrs"];function $x(){return{hooks:{"tag:normalise":function({tag:t}){["hid","vmid","key"].forEach(i=>{t.props[i]&&(t.key=t.props[i],delete t.props[i])});const n=nm(t)||(t.key?`${t.tag}:${t.key}`:!1);n&&(t._d=n)},"tags:resolve":function(t){const e={};t.tags.forEach(i=>{const r=(i.key?`${i.tag}:${i.key}`:i._d)||i._p,s=e[r];if(s){let a=i==null?void 0:i.tagDuplicateStrategy;if(!a&&qx.includes(i.tag)&&(a="merge"),a==="merge"){const l=s.props;["class","style"].forEach(c=>{i.props[c]&&l[c]&&(c==="style"&&!l[c].endsWith(";")&&(l[c]+=";"),i.props[c]=`${l[c]} ${i.props[c]}`)}),e[r].props={...l,...i.props};return}else if(i._e===s._e){s._duped=s._duped||[],i._d=`${s._d}:${s._duped.length+1}`,s._duped.push(i);return}else if(ca(i)>ca(s))return}const o=Object.keys(i.props).length+(i.innerHTML?1:0)+(i.textContent?1:0);if(em.includes(i.tag)&&o===0){delete e[r];return}e[r]=i});const n=[];Object.values(e).forEach(i=>{const r=i._duped;delete i._duped,n.push(i),r&&n.push(...r)}),t.tags=n}}}}function ts(t,e){if(typeof t!="string")return t;function n(o){if(["s","pageTitle"].includes(o))return e.pageTitle;let a;return o.includes(".")?a=o.split(".").reduce((l,c)=>l&&l[c]||void 0,e):a=e[o],typeof a<"u"?a||"":!1}let i=t;try{i=decodeURI(t)}catch{}(i.match(/%(\w+\.+\w+)|%(\w+)/g)||[]).sort().reverse().forEach(o=>{const a=n(o.slice(1));typeof a=="string"&&(t=t.replace(new RegExp(`\\${o}(\\W|$)`,"g"),`${a}$1`).trim())});const s=e.separator;return t.includes(s)&&(t.endsWith(s)&&(t=t.slice(0,-s.length).trim()),t.startsWith(s)&&(t=t.slice(s.length).trim()),t=t.replace(new RegExp(`\\${s}\\s*\\${s}`,"g"),s)),t}function Yx(){return{hooks:{"tags:resolve":t=>{var s;const{tags:e}=t,n=(s=e.find(o=>o.tag==="title"))==null?void 0:s.textContent,i=e.findIndex(o=>o.tag==="templateParams"),r=i!==-1?e[i].props:{};r.separator=r.separator||"|",r.pageTitle=ts(r.pageTitle||n||"",r);for(const o of e)if(["titleTemplate","title"].includes(o.tag)&&typeof o.textContent=="string")o.textContent=ts(o.textContent,r);else if(o.tag==="meta"&&typeof o.props.content=="string")o.props.content=ts(o.props.content,r);else if(o.tag==="link"&&typeof o.props.href=="string")o.props.href=ts(o.props.href,r);else if(o.tag==="script"&&["application/json","application/ld+json"].includes(o.props.type)&&typeof o.innerHTML=="string")try{o.innerHTML=JSON.stringify(JSON.parse(o.innerHTML),(a,l)=>typeof l=="string"?ts(l,r):l)}catch{}t.tags=e.filter(o=>o.tag!=="templateParams")}}}}const Kx=typeof window<"u";let im;function Zx(t){return im=t}function Jx(){return im}async function Qx(t,e){const n={tag:t,props:{}};return e instanceof Promise&&(e=await e),t==="templateParams"?(n.props=e,n):["title","titleTemplate"].includes(t)?(e&&typeof e=="object"?(n.textContent=e.textContent,e.tagPriority&&(n.tagPriority=e.tagPriority)):n.textContent=e,n):typeof e=="string"?["script","noscript","style"].includes(t)?(t==="script"&&(/^(https?:)?\/\//.test(e)||e.startsWith("/"))?n.props.src=e:n.innerHTML=e,n):!1:(n.props=await ty(t,{...e}),n.props.children&&(n.props.innerHTML=n.props.children),delete n.props.children,Object.keys(n.props).filter(i=>Ux.includes(i)).forEach(i=>{(!["innerHTML","textContent"].includes(i)||Qp.includes(n.tag))&&(n[i]=n.props[i]),delete n.props[i]}),["innerHTML","textContent"].forEach(i=>{if(n.tag==="script"&&typeof n[i]=="string"&&["application/ld+json","application/json"].includes(n.props.type))try{n[i]=JSON.parse(n[i])}catch{n[i]=""}typeof n[i]=="object"&&(n[i]=JSON.stringify(n[i]))}),n.props.class&&(n.props.class=ey(n.props.class)),n.props.content&&Array.isArray(n.props.content)?n.props.content.map(i=>({...n,props:{...n.props,content:i}})):n)}function ey(t){return typeof t=="object"&&!Array.isArray(t)&&(t=Object.keys(t).filter(e=>t[e])),(Array.isArray(t)?t.join(" "):t).split(" ").filter(e=>e.trim()).filter(Boolean).join(" ")}async function ty(t,e){for(const n of Object.keys(e)){const i=n.startsWith("data-");e[n]instanceof Promise&&(e[n]=await e[n]),String(e[n])==="true"?e[n]=i?"true":"":String(e[n])==="false"&&(i?e[n]="false":delete e[n])}return e}const ny=10;async function iy(t){const e=[];return Object.entries(t.resolvedInput).filter(([n,i])=>typeof i<"u"&&Dx.includes(n)).forEach(([n,i])=>{const r=Lx(i);e.push(...r.map(s=>Qx(n,s)).flat())}),(await Promise.all(e)).flat().filter(Boolean).map((n,i)=>(n._e=t._i,n._p=(t._i<<ny)+i,n))}function ry(){return[$x(),zx(),Yx(),Gx(),Xx(),jx(),Vx()]}function sy(t={}){return[Bx({document:t==null?void 0:t.document,delayFn:t==null?void 0:t.domDelayFn})]}function oy(t={}){const e=ay({...t,plugins:[...sy(t),...(t==null?void 0:t.plugins)||[]]});return t.experimentalHashHydration&&e.resolvedOptions.document&&(e._hash=Hx(e.resolvedOptions.document)),Zx(e),e}function ay(t={}){let e=[],n={},i=0;const r=Zp();t!=null&&t.hooks&&r.addHooks(t.hooks),t.plugins=[...ry(),...(t==null?void 0:t.plugins)||[]],t.plugins.forEach(a=>a.hooks&&r.addHooks(a.hooks)),t.document=t.document||(Kx?document:void 0);const s=()=>r.callHook("entries:updated",o),o={resolvedOptions:t,headEntries(){return e},get hooks(){return r},use(a){a.hooks&&r.addHooks(a.hooks)},push(a,l){const c={_i:i++,input:a,_sde:{}};return l!=null&&l.mode&&(c._m=l==null?void 0:l.mode),l!=null&&l.transform&&(c._t=l==null?void 0:l.transform),e.push(c),s(),{dispose(){e=e.filter(u=>u._i!==c._i?!0:(n={...n,...u._sde||{}},u._sde={},s(),!1))},patch(u){e=e.map(f=>(f._i===c._i&&(c.input=f.input=u,s()),f))}}},async resolveTags(){const a={tags:[],entries:[...e]};await r.callHook("entries:resolve",a);for(const l of a.entries){const c=l._t||(u=>u);if(l.resolvedInput=c(l.resolvedInput||l.input),l.resolvedInput)for(const u of await iy(l)){const f={tag:u,entry:l,resolvedOptions:o.resolvedOptions};await r.callHook("tag:normalise",f),a.tags.push(f.tag)}}return await r.callHook("tags:resolve",a),a.tags},_popSideEffectQueue(){const a={...n};return n={},a},_elMap:{}};return o.hooks.callHook("init",o),o}function ly(t){return typeof t=="function"?t():et(t)}function ua(t,e=""){if(t instanceof Promise)return t;const n=ly(t);return!t||!n?n:Array.isArray(n)?n.map(i=>ua(i,e)):typeof n=="object"?Object.fromEntries(Object.entries(n).map(([i,r])=>i==="titleTemplate"||i.startsWith("on")?[i,et(r)]:[i,ua(r,i)])):n}const cy=Fp.startsWith("3"),uy=typeof window<"u",rm="usehead";function fu(){return js()&&Bt(rm)||Jx()}function fy(t){return{install(n){cy&&(n.config.globalProperties.$unhead=t,n.config.globalProperties.$head=t,n.provide(rm,t))}}.install}function hy(t={}){const e=oy({...t,domDelayFn:n=>setTimeout(()=>Yi(()=>n()),10),plugins:[dy(),...(t==null?void 0:t.plugins)||[]]});return e.install=fy(e),e}function dy(){return{hooks:{"entries:resolve":function(t){for(const e of t.entries)e.resolvedInput=ua(e.input)}}}}function py(t,e={}){const n=fu(),i=Ke(!1),r=Ke({});Q_(()=>{r.value=i.value?{}:ua(t)});const s=n.push(r.value,e);return Hi(r,a=>{s.patch(a)}),js()&&(Yr(()=>{s.dispose()}),gp(()=>{i.value=!0}),mp(()=>{i.value=!1})),s}function my(t,e={}){return fu().push(t,e)}function g1(t,e={}){var i;const n=fu();if(n){const r=uy||!!((i=n.resolvedOptions)!=null&&i.document);return e.mode==="server"&&r||e.mode==="client"&&!r?void 0:r?py(t,e):my(t,e)}}const gy={meta:[{name:"viewport",content:"width=device-width, initial-scale=1"},{charset:"utf-8"}],link:[],style:[],script:[],noscript:[]},oc=!1,_y=!1,vy="__nuxt",xy=!0;function Sf(t,e={}){const n=yy(t,e),i=lt(),r=i._payloadCache=i._payloadCache||{};return r[n]||(r[n]=sm(n).then(s=>s||(delete r[n],null))),r[n]}const bf="json";function yy(t,e={}){const n=new URL(t,"http://localhost");if(n.search)throw new Error("Payload URL cannot contain search params: "+t);if(n.host!=="localhost"||Kr(n.pathname,{acceptRelative:!0}))throw new Error("Payload URL must not include hostname: "+t);const i=e.hash||(e.fresh?Date.now():"");return qs(uu().app.baseURL,n.pathname,i?`_payload.${i}.${bf}`:`_payload.${bf}`)}async function sm(t){try{return xy?om(await fetch(t).then(e=>e.text())):await Dr(()=>import(t),[],import.meta.url).then(e=>e.default||e)}catch(e){console.warn("[nuxt] Cannot load payload ",t,e)}return null}function My(){return!!lt().payload.prerenderedAt}let mo=null;async function Ey(){if(mo)return mo;const t=document.getElementById("__NUXT_DATA__");if(!t)return{};const e=om(t.textContent||""),n=t.dataset.src?await sm(t.dataset.src):void 0;return mo={...e,...n,...window.__NUXT__},mo}function om(t){return Cx(t,lt()._payloadRevivers)}function Sy(t,e){lt()._payloadRevivers[t]=e}function nl(t){return t!==null&&typeof t=="object"}function ac(t,e,n=".",i){if(!nl(e))return ac(t,{},n,i);const r=Object.assign({},e);for(const s in t){if(s==="__proto__"||s==="constructor")continue;const o=t[s];o!=null&&(i&&i(r,s,o,n)||(Array.isArray(o)&&Array.isArray(r[s])?r[s]=[...o,...r[s]]:nl(o)&&nl(r[s])?r[s]=ac(o,r[s],(n?`${n}.`:"")+s.toString(),i):r[s]=o))}return r}function by(t){return(...e)=>e.reduce((n,i)=>ac(n,i,"",t),{})}const Ty=by();class lc extends Error{constructor(){super(...arguments),this.statusCode=500,this.fatal=!1,this.unhandled=!1}toJSON(){const e={message:this.message,statusCode:uc(this.statusCode,500)};return this.statusMessage&&(e.statusMessage=am(this.statusMessage)),this.data!==void 0&&(e.data=this.data),e}}lc.__h3_error__=!0;function cc(t){if(typeof t=="string")return new lc(t);if(wy(t))return t;const e=new lc(t.message??t.statusMessage??"",t.cause?{cause:t.cause}:void 0);if("stack"in t)try{Object.defineProperty(e,"stack",{get(){return t.stack}})}catch{try{e.stack=t.stack}catch{}}if(t.data&&(e.data=t.data),t.statusCode?e.statusCode=uc(t.statusCode,e.statusCode):t.status&&(e.statusCode=uc(t.status,e.statusCode)),t.statusMessage?e.statusMessage=t.statusMessage:t.statusText&&(e.statusMessage=t.statusText),e.statusMessage){const n=e.statusMessage;am(e.statusMessage)!==n&&console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.")}return t.fatal!==void 0&&(e.fatal=t.fatal),t.unhandled!==void 0&&(e.unhandled=t.unhandled),e}function wy(t){var e;return((e=t==null?void 0:t.constructor)==null?void 0:e.__h3_error__)===!0}const Ay=/[^\u0009\u0020-\u007E]/g;function am(t=""){return t.replace(Ay,"")}function uc(t,e=200){return!t||(typeof t=="string"&&(t=Number.parseInt(t,10)),t<100||t>999)?e:t}const Ry="$s";function Cy(...t){const e=typeof t[t.length-1]=="string"?t.pop():void 0;typeof t[0]!="string"&&t.unshift(e);const[n,i]=t;if(!n||typeof n!="string")throw new TypeError("[nuxt] [useState] key must be a string: "+n);if(i!==void 0&&typeof i!="function")throw new Error("[nuxt] [useState] init must be a function: "+i);const r=Ry+n,s=lt(),o=$c(s.payload.state,r);if(o.value===void 0&&i){const a=i();if(rt(a))return s.payload.state[r]=a,a;o.value=a}return o}const Py=Symbol("layout-meta"),Ca=Symbol("route"),Ei=()=>{var t;return(t=lt())==null?void 0:t.$router},fc=()=>nu()?Bt(Ca,lt()._route):lt()._route;/*! @__NO_SIDE_EFFECTS__ */const Ly=()=>{try{if(lt()._processingMiddleware)return!0}catch{return!0}return!1},Dy=(t,e)=>{t||(t="/");const n=typeof t=="string"?t:Xp(t.path||"/",t.query||{})+(t.hash||"");if(e!=null&&e.open){{const{target:a="_blank",windowFeatures:l={}}=e.open,c=Object.entries(l).filter(([u,f])=>f!==void 0).map(([u,f])=>`${u.toLowerCase()}=${f}`).join(", ");open(n,a,c)}return Promise.resolve()}const i=(e==null?void 0:e.external)||Kr(n,{acceptRelative:!0});if(i&&!(e!=null&&e.external))throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");if(i&&$s(n).protocol==="script:")throw new Error("Cannot navigate to an URL with script protocol.");const r=Ly();if(!i&&r)return t;const s=Ei(),o=lt();return i?(e!=null&&e.replace?location.replace(n):location.href=n,r?o.isHydrating?new Promise(()=>{}):!1:Promise.resolve()):e!=null&&e.replace?s.replace(t):s.push(t)},Pa=()=>$c(lt().payload,"error"),Sr=t=>{const e=hu(t);try{const n=lt(),i=Pa();n.hooks.callHook("app:error",e),i.value=i.value||e}catch{throw e}return e},Iy=async(t={})=>{const e=lt(),n=Pa();e.callHook("app:error:cleared",t),t.redirect&&await Ei().replace(t.redirect),n.value=null},Uy=t=>!!(t&&typeof t=="object"&&"__nuxt_error"in t),hu=t=>{const e=cc(t);return e.__nuxt_error=!0,e},Tf={NuxtError:t=>hu(t),EmptyShallowRef:t=>Ps(t==="_"?void 0:t==="0n"?BigInt(0):JSON.parse(t)),EmptyRef:t=>Ke(t==="_"?void 0:t==="0n"?BigInt(0):JSON.parse(t)),ShallowRef:t=>Ps(t),ShallowReactive:t=>Ws(t),Ref:t=>Ke(t),Reactive:t=>qn(t)},Ny=Mi({name:"nuxt:revive-payload:client",order:-30,async setup(t){let e,n;for(const i in Tf)Sy(i,Tf[i]);Object.assign(t.payload,([e,n]=la(()=>t.runWithContext(Ey)),e=await e,n(),e)),window.__NUXT__=t.payload}});/*!
  * vue-router v4.2.3
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */const xr=typeof window<"u";function Oy(t){return t.__esModule||t[Symbol.toStringTag]==="Module"}const Qe=Object.assign;function il(t,e){const n={};for(const i in e){const r=e[i];n[i]=xn(r)?r.map(t):t(r)}return n}const _s=()=>{},xn=Array.isArray,Fy=/\/$/,By=t=>t.replace(Fy,"");function rl(t,e,n="/"){let i,r={},s="",o="";const a=e.indexOf("#");let l=e.indexOf("?");return a<l&&a>=0&&(l=-1),l>-1&&(i=e.slice(0,l),s=e.slice(l+1,a>-1?a:e.length),r=t(s)),a>-1&&(i=i||e.slice(0,a),o=e.slice(a,e.length)),i=Gy(i??e,n),{fullPath:i+(s&&"?")+s+o,path:i,query:r,hash:o}}function Hy(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function wf(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function ky(t,e,n){const i=e.matched.length-1,r=n.matched.length-1;return i>-1&&i===r&&Hr(e.matched[i],n.matched[r])&&lm(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function Hr(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function lm(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(!zy(t[n],e[n]))return!1;return!0}function zy(t,e){return xn(t)?Af(t,e):xn(e)?Af(e,t):t===e}function Af(t,e){return xn(e)?t.length===e.length&&t.every((n,i)=>n===e[i]):t.length===1&&t[0]===e}function Gy(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),i=t.split("/"),r=i[i.length-1];(r===".."||r===".")&&i.push("");let s=n.length-1,o,a;for(o=0;o<i.length;o++)if(a=i[o],a!==".")if(a==="..")s>1&&s--;else break;return n.slice(0,s).join("/")+"/"+i.slice(o-(o===i.length?1:0)).join("/")}var Os;(function(t){t.pop="pop",t.push="push"})(Os||(Os={}));var vs;(function(t){t.back="back",t.forward="forward",t.unknown=""})(vs||(vs={}));function Vy(t){if(!t)if(xr){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),By(t)}const Wy=/^[^#]+#/;function Xy(t,e){return t.replace(Wy,"#")+e}function jy(t,e){const n=document.documentElement.getBoundingClientRect(),i=t.getBoundingClientRect();return{behavior:e.behavior,left:i.left-n.left-(e.left||0),top:i.top-n.top-(e.top||0)}}const La=()=>({left:window.pageXOffset,top:window.pageYOffset});function qy(t){let e;if("el"in t){const n=t.el,i=typeof n=="string"&&n.startsWith("#"),r=typeof n=="string"?i?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!r)return;e=jy(r,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.pageXOffset,e.top!=null?e.top:window.pageYOffset)}function Rf(t,e){return(history.state?history.state.position-e:-1)+t}const hc=new Map;function $y(t,e){hc.set(t,e)}function Yy(t){const e=hc.get(t);return hc.delete(t),e}let Ky=()=>location.protocol+"//"+location.host;function cm(t,e){const{pathname:n,search:i,hash:r}=e,s=t.indexOf("#");if(s>-1){let a=r.includes(t.slice(s))?t.slice(s).length:1,l=r.slice(a);return l[0]!=="/"&&(l="/"+l),wf(l,"")}return wf(n,t)+i+r}function Zy(t,e,n,i){let r=[],s=[],o=null;const a=({state:d})=>{const p=cm(t,location),g=n.value,_=e.value;let m=0;if(d){if(n.value=p,e.value=d,o&&o===g){o=null;return}m=_?d.position-_.position:0}else i(p);r.forEach(h=>{h(n.value,g,{delta:m,type:Os.pop,direction:m?m>0?vs.forward:vs.back:vs.unknown})})};function l(){o=n.value}function c(d){r.push(d);const p=()=>{const g=r.indexOf(d);g>-1&&r.splice(g,1)};return s.push(p),p}function u(){const{history:d}=window;d.state&&d.replaceState(Qe({},d.state,{scroll:La()}),"")}function f(){for(const d of s)d();s=[],window.removeEventListener("popstate",a),window.removeEventListener("beforeunload",u)}return window.addEventListener("popstate",a),window.addEventListener("beforeunload",u,{passive:!0}),{pauseListeners:l,listen:c,destroy:f}}function Cf(t,e,n,i=!1,r=!1){return{back:t,current:e,forward:n,replaced:i,position:window.history.length,scroll:r?La():null}}function Jy(t){const{history:e,location:n}=window,i={value:cm(t,n)},r={value:e.state};r.value||s(i.value,{back:null,current:i.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function s(l,c,u){const f=t.indexOf("#"),d=f>-1?(n.host&&document.querySelector("base")?t:t.slice(f))+l:Ky()+t+l;try{e[u?"replaceState":"pushState"](c,"",d),r.value=c}catch(p){console.error(p),n[u?"replace":"assign"](d)}}function o(l,c){const u=Qe({},e.state,Cf(r.value.back,l,r.value.forward,!0),c,{position:r.value.position});s(l,u,!0),i.value=l}function a(l,c){const u=Qe({},r.value,e.state,{forward:l,scroll:La()});s(u.current,u,!0);const f=Qe({},Cf(i.value,l,null),{position:u.position+1},c);s(l,f,!1),i.value=l}return{location:i,state:r,push:a,replace:o}}function um(t){t=Vy(t);const e=Jy(t),n=Zy(t,e.state,e.location,e.replace);function i(s,o=!0){o||n.pauseListeners(),history.go(s)}const r=Qe({location:"",base:t,go:i,createHref:Xy.bind(null,t)},e,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>e.state.value}),r}function Qy(t){return t=location.host?t||location.pathname+location.search:"",t.includes("#")||(t+="#"),um(t)}function eM(t){return typeof t=="string"||t&&typeof t=="object"}function fm(t){return typeof t=="string"||typeof t=="symbol"}const En={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},hm=Symbol("");var Pf;(function(t){t[t.aborted=4]="aborted",t[t.cancelled=8]="cancelled",t[t.duplicated=16]="duplicated"})(Pf||(Pf={}));function kr(t,e){return Qe(new Error,{type:t,[hm]:!0},e)}function Ln(t,e){return t instanceof Error&&hm in t&&(e==null||!!(t.type&e))}const Lf="[^/]+?",tM={sensitive:!1,strict:!1,start:!0,end:!0},nM=/[.+*?^${}()[\]/\\]/g;function iM(t,e){const n=Qe({},tM,e),i=[];let r=n.start?"^":"";const s=[];for(const c of t){const u=c.length?[]:[90];n.strict&&!c.length&&(r+="/");for(let f=0;f<c.length;f++){const d=c[f];let p=40+(n.sensitive?.25:0);if(d.type===0)f||(r+="/"),r+=d.value.replace(nM,"\\$&"),p+=40;else if(d.type===1){const{value:g,repeatable:_,optional:m,regexp:h}=d;s.push({name:g,repeatable:_,optional:m});const v=h||Lf;if(v!==Lf){p+=10;try{new RegExp(`(${v})`)}catch(y){throw new Error(`Invalid custom RegExp for param "${g}" (${v}): `+y.message)}}let x=_?`((?:${v})(?:/(?:${v}))*)`:`(${v})`;f||(x=m&&c.length<2?`(?:/${x})`:"/"+x),m&&(x+="?"),r+=x,p+=20,m&&(p+=-8),_&&(p+=-20),v===".*"&&(p+=-50)}u.push(p)}i.push(u)}if(n.strict&&n.end){const c=i.length-1;i[c][i[c].length-1]+=.7000000000000001}n.strict||(r+="/?"),n.end?r+="$":n.strict&&(r+="(?:/|$)");const o=new RegExp(r,n.sensitive?"":"i");function a(c){const u=c.match(o),f={};if(!u)return null;for(let d=1;d<u.length;d++){const p=u[d]||"",g=s[d-1];f[g.name]=p&&g.repeatable?p.split("/"):p}return f}function l(c){let u="",f=!1;for(const d of t){(!f||!u.endsWith("/"))&&(u+="/"),f=!1;for(const p of d)if(p.type===0)u+=p.value;else if(p.type===1){const{value:g,repeatable:_,optional:m}=p,h=g in c?c[g]:"";if(xn(h)&&!_)throw new Error(`Provided param "${g}" is an array but it is not repeatable (* or + modifiers)`);const v=xn(h)?h.join("/"):h;if(!v)if(m)d.length<2&&(u.endsWith("/")?u=u.slice(0,-1):f=!0);else throw new Error(`Missing required param "${g}"`);u+=v}}return u||"/"}return{re:o,score:i,keys:s,parse:a,stringify:l}}function rM(t,e){let n=0;for(;n<t.length&&n<e.length;){const i=e[n]-t[n];if(i)return i;n++}return t.length<e.length?t.length===1&&t[0]===40+40?-1:1:t.length>e.length?e.length===1&&e[0]===40+40?1:-1:0}function sM(t,e){let n=0;const i=t.score,r=e.score;for(;n<i.length&&n<r.length;){const s=rM(i[n],r[n]);if(s)return s;n++}if(Math.abs(r.length-i.length)===1){if(Df(i))return 1;if(Df(r))return-1}return r.length-i.length}function Df(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const oM={type:0,value:""},aM=/[a-zA-Z0-9_]/;function lM(t){if(!t)return[[]];if(t==="/")return[[oM]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(p){throw new Error(`ERR (${n})/"${c}": ${p}`)}let n=0,i=n;const r=[];let s;function o(){s&&r.push(s),s=[]}let a=0,l,c="",u="";function f(){c&&(n===0?s.push({type:0,value:c}):n===1||n===2||n===3?(s.length>1&&(l==="*"||l==="+")&&e(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),s.push({type:1,value:c,regexp:u,repeatable:l==="*"||l==="+",optional:l==="*"||l==="?"})):e("Invalid state to consume buffer"),c="")}function d(){c+=l}for(;a<t.length;){if(l=t[a++],l==="\\"&&n!==2){i=n,n=4;continue}switch(n){case 0:l==="/"?(c&&f(),o()):l===":"?(f(),n=1):d();break;case 4:d(),n=i;break;case 1:l==="("?n=2:aM.test(l)?d():(f(),n=0,l!=="*"&&l!=="?"&&l!=="+"&&a--);break;case 2:l===")"?u[u.length-1]=="\\"?u=u.slice(0,-1)+l:n=3:u+=l;break;case 3:f(),n=0,l!=="*"&&l!=="?"&&l!=="+"&&a--,u="";break;default:e("Unknown state");break}}return n===2&&e(`Unfinished custom RegExp for param "${c}"`),f(),o(),r}function cM(t,e,n){const i=iM(lM(t.path),n),r=Qe(i,{record:t,parent:e,children:[],alias:[]});return e&&!r.record.aliasOf==!e.record.aliasOf&&e.children.push(r),r}function uM(t,e){const n=[],i=new Map;e=Nf({strict:!1,end:!0,sensitive:!1},e);function r(u){return i.get(u)}function s(u,f,d){const p=!d,g=fM(u);g.aliasOf=d&&d.record;const _=Nf(e,u),m=[g];if("alias"in u){const x=typeof u.alias=="string"?[u.alias]:u.alias;for(const y of x)m.push(Qe({},g,{components:d?d.record.components:g.components,path:y,aliasOf:d?d.record:g}))}let h,v;for(const x of m){const{path:y}=x;if(f&&y[0]!=="/"){const S=f.record.path,R=S[S.length-1]==="/"?"":"/";x.path=f.record.path+(y&&R+y)}if(h=cM(x,f,_),d?d.alias.push(h):(v=v||h,v!==h&&v.alias.push(h),p&&u.name&&!Uf(h)&&o(u.name)),g.children){const S=g.children;for(let R=0;R<S.length;R++)s(S[R],h,d&&d.children[R])}d=d||h,(h.record.components&&Object.keys(h.record.components).length||h.record.name||h.record.redirect)&&l(h)}return v?()=>{o(v)}:_s}function o(u){if(fm(u)){const f=i.get(u);f&&(i.delete(u),n.splice(n.indexOf(f),1),f.children.forEach(o),f.alias.forEach(o))}else{const f=n.indexOf(u);f>-1&&(n.splice(f,1),u.record.name&&i.delete(u.record.name),u.children.forEach(o),u.alias.forEach(o))}}function a(){return n}function l(u){let f=0;for(;f<n.length&&sM(u,n[f])>=0&&(u.record.path!==n[f].record.path||!dm(u,n[f]));)f++;n.splice(f,0,u),u.record.name&&!Uf(u)&&i.set(u.record.name,u)}function c(u,f){let d,p={},g,_;if("name"in u&&u.name){if(d=i.get(u.name),!d)throw kr(1,{location:u});_=d.record.name,p=Qe(If(f.params,d.keys.filter(v=>!v.optional).map(v=>v.name)),u.params&&If(u.params,d.keys.map(v=>v.name))),g=d.stringify(p)}else if("path"in u)g=u.path,d=n.find(v=>v.re.test(g)),d&&(p=d.parse(g),_=d.record.name);else{if(d=f.name?i.get(f.name):n.find(v=>v.re.test(f.path)),!d)throw kr(1,{location:u,currentLocation:f});_=d.record.name,p=Qe({},f.params,u.params),g=d.stringify(p)}const m=[];let h=d;for(;h;)m.unshift(h.record),h=h.parent;return{name:_,path:g,params:p,matched:m,meta:dM(m)}}return t.forEach(u=>s(u)),{addRoute:s,resolve:c,removeRoute:o,getRoutes:a,getRecordMatcher:r}}function If(t,e){const n={};for(const i of e)i in t&&(n[i]=t[i]);return n}function fM(t){return{path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:void 0,beforeEnter:t.beforeEnter,props:hM(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}}}function hM(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const i in t.components)e[i]=typeof n=="object"?n[i]:n;return e}function Uf(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function dM(t){return t.reduce((e,n)=>Qe(e,n.meta),{})}function Nf(t,e){const n={};for(const i in t)n[i]=i in e?e[i]:t[i];return n}function dm(t,e){return e.children.some(n=>n===t||dm(t,n))}const pm=/#/g,pM=/&/g,mM=/\//g,gM=/=/g,_M=/\?/g,mm=/\+/g,vM=/%5B/g,xM=/%5D/g,gm=/%5E/g,yM=/%60/g,_m=/%7B/g,MM=/%7C/g,vm=/%7D/g,EM=/%20/g;function du(t){return encodeURI(""+t).replace(MM,"|").replace(vM,"[").replace(xM,"]")}function SM(t){return du(t).replace(_m,"{").replace(vm,"}").replace(gm,"^")}function dc(t){return du(t).replace(mm,"%2B").replace(EM,"+").replace(pm,"%23").replace(pM,"%26").replace(yM,"`").replace(_m,"{").replace(vm,"}").replace(gm,"^")}function bM(t){return dc(t).replace(gM,"%3D")}function TM(t){return du(t).replace(pm,"%23").replace(_M,"%3F")}function wM(t){return t==null?"":TM(t).replace(mM,"%2F")}function fa(t){try{return decodeURIComponent(""+t)}catch{}return""+t}function AM(t){const e={};if(t===""||t==="?")return e;const i=(t[0]==="?"?t.slice(1):t).split("&");for(let r=0;r<i.length;++r){const s=i[r].replace(mm," "),o=s.indexOf("="),a=fa(o<0?s:s.slice(0,o)),l=o<0?null:fa(s.slice(o+1));if(a in e){let c=e[a];xn(c)||(c=e[a]=[c]),c.push(l)}else e[a]=l}return e}function Of(t){let e="";for(let n in t){const i=t[n];if(n=bM(n),i==null){i!==void 0&&(e+=(e.length?"&":"")+n);continue}(xn(i)?i.map(s=>s&&dc(s)):[i&&dc(i)]).forEach(s=>{s!==void 0&&(e+=(e.length?"&":"")+n,s!=null&&(e+="="+s))})}return e}function RM(t){const e={};for(const n in t){const i=t[n];i!==void 0&&(e[n]=xn(i)?i.map(r=>r==null?null:""+r):i==null?i:""+i)}return e}const CM=Symbol(""),Ff=Symbol(""),pu=Symbol(""),xm=Symbol(""),pc=Symbol("");function ns(){let t=[];function e(i){return t.push(i),()=>{const r=t.indexOf(i);r>-1&&t.splice(r,1)}}function n(){t=[]}return{add:e,list:()=>t,reset:n}}function li(t,e,n,i,r){const s=i&&(i.enterCallbacks[r]=i.enterCallbacks[r]||[]);return()=>new Promise((o,a)=>{const l=f=>{f===!1?a(kr(4,{from:n,to:e})):f instanceof Error?a(f):eM(f)?a(kr(2,{from:e,to:f})):(s&&i.enterCallbacks[r]===s&&typeof f=="function"&&s.push(f),o())},c=t.call(i&&i.instances[r],e,n,l);let u=Promise.resolve(c);t.length<3&&(u=u.then(l)),u.catch(f=>a(f))})}function sl(t,e,n,i){const r=[];for(const s of t)for(const o in s.components){let a=s.components[o];if(!(e!=="beforeRouteEnter"&&!s.instances[o]))if(PM(a)){const c=(a.__vccOpts||a)[e];c&&r.push(li(c,n,i,s,o))}else{let l=a();r.push(()=>l.then(c=>{if(!c)return Promise.reject(new Error(`Couldn't resolve component "${o}" at "${s.path}"`));const u=Oy(c)?c.default:c;s.components[o]=u;const d=(u.__vccOpts||u)[e];return d&&li(d,n,i,s,o)()}))}}return r}function PM(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function Bf(t){const e=Bt(pu),n=Bt(xm),i=Nt(()=>e.resolve(et(t.to))),r=Nt(()=>{const{matched:l}=i.value,{length:c}=l,u=l[c-1],f=n.matched;if(!u||!f.length)return-1;const d=f.findIndex(Hr.bind(null,u));if(d>-1)return d;const p=Hf(l[c-2]);return c>1&&Hf(u)===p&&f[f.length-1].path!==p?f.findIndex(Hr.bind(null,l[c-2])):d}),s=Nt(()=>r.value>-1&&UM(n.params,i.value.params)),o=Nt(()=>r.value>-1&&r.value===n.matched.length-1&&lm(n.params,i.value.params));function a(l={}){return IM(l)?e[et(t.replace)?"replace":"push"](et(t.to)).catch(_s):Promise.resolve()}return{route:i,href:Nt(()=>i.value.href),isActive:s,isExactActive:o,navigate:a}}const LM=Cn({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:Bf,setup(t,{slots:e}){const n=qn(Bf(t)),{options:i}=Bt(pu),r=Nt(()=>({[kf(t.activeClass,i.linkActiveClass,"router-link-active")]:n.isActive,[kf(t.exactActiveClass,i.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const s=e.default&&e.default(n);return t.custom?s:vn("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:r.value},s)}}}),DM=LM;function IM(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function UM(t,e){for(const n in e){const i=e[n],r=t[n];if(typeof i=="string"){if(i!==r)return!1}else if(!xn(r)||r.length!==i.length||i.some((s,o)=>s!==r[o]))return!1}return!0}function Hf(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const kf=(t,e,n)=>t??e??n,NM=Cn({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const i=Bt(pc),r=Nt(()=>t.route||i.value),s=Bt(Ff,0),o=Nt(()=>{let c=et(s);const{matched:u}=r.value;let f;for(;(f=u[c])&&!f.components;)c++;return c}),a=Nt(()=>r.value.matched[o.value]);Lr(Ff,Nt(()=>o.value+1)),Lr(CM,a),Lr(pc,r);const l=Ke();return Hi(()=>[l.value,a.value,t.name],([c,u,f],[d,p,g])=>{u&&(u.instances[f]=c,p&&p!==u&&c&&c===d&&(u.leaveGuards.size||(u.leaveGuards=p.leaveGuards),u.updateGuards.size||(u.updateGuards=p.updateGuards))),c&&u&&(!p||!Hr(u,p)||!d)&&(u.enterCallbacks[f]||[]).forEach(_=>_(c))},{flush:"post"}),()=>{const c=r.value,u=t.name,f=a.value,d=f&&f.components[u];if(!d)return zf(n.default,{Component:d,route:c});const p=f.props[u],g=p?p===!0?c.params:typeof p=="function"?p(c):p:null,m=vn(d,Qe({},g,e,{onVnodeUnmounted:h=>{h.component.isUnmounted&&(f.instances[u]=null)},ref:l}));return zf(n.default,{Component:m,route:c})||m}}});function zf(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const ym=NM;function OM(t){const e=uM(t.routes,t),n=t.parseQuery||AM,i=t.stringifyQuery||Of,r=t.history,s=ns(),o=ns(),a=ns(),l=Ps(En);let c=En;xr&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const u=il.bind(null,j=>""+j),f=il.bind(null,wM),d=il.bind(null,fa);function p(j,oe){let ce,Ee;return fm(j)?(ce=e.getRecordMatcher(j),Ee=oe):Ee=j,e.addRoute(Ee,ce)}function g(j){const oe=e.getRecordMatcher(j);oe&&e.removeRoute(oe)}function _(){return e.getRoutes().map(j=>j.record)}function m(j){return!!e.getRecordMatcher(j)}function h(j,oe){if(oe=Qe({},oe||l.value),typeof j=="string"){const I=rl(n,j,oe.path),k=e.resolve({path:I.path},oe),V=r.createHref(I.fullPath);return Qe(I,k,{params:d(k.params),hash:fa(I.hash),redirectedFrom:void 0,href:V})}let ce;if("path"in j)ce=Qe({},j,{path:rl(n,j.path,oe.path).path});else{const I=Qe({},j.params);for(const k in I)I[k]==null&&delete I[k];ce=Qe({},j,{params:f(I)}),oe.params=f(oe.params)}const Ee=e.resolve(ce,oe),we=j.hash||"";Ee.params=u(d(Ee.params));const M=Hy(i,Qe({},j,{hash:SM(we),path:Ee.path})),D=r.createHref(M);return Qe({fullPath:M,hash:we,query:i===Of?RM(j.query):j.query||{}},Ee,{redirectedFrom:void 0,href:D})}function v(j){return typeof j=="string"?rl(n,j,l.value.path):Qe({},j)}function x(j,oe){if(c!==j)return kr(8,{from:oe,to:j})}function y(j){return A(j)}function S(j){return y(Qe(v(j),{replace:!0}))}function R(j){const oe=j.matched[j.matched.length-1];if(oe&&oe.redirect){const{redirect:ce}=oe;let Ee=typeof ce=="function"?ce(j):ce;return typeof Ee=="string"&&(Ee=Ee.includes("?")||Ee.includes("#")?Ee=v(Ee):{path:Ee},Ee.params={}),Qe({query:j.query,hash:j.hash,params:"path"in Ee?{}:j.params},Ee)}}function A(j,oe){const ce=c=h(j),Ee=l.value,we=j.state,M=j.force,D=j.replace===!0,I=R(ce);if(I)return A(Qe(v(I),{state:typeof I=="object"?Qe({},we,I.state):we,force:M,replace:D}),oe||ce);const k=ce;k.redirectedFrom=oe;let V;return!M&&ky(i,Ee,ce)&&(V=kr(16,{to:k,from:Ee}),X(Ee,Ee,!0,!1)),(V?Promise.resolve(V):T(k,Ee)).catch(ie=>Ln(ie)?Ln(ie,2)?ie:de(ie):Y(ie,k,Ee)).then(ie=>{if(ie){if(Ln(ie,2))return A(Qe({replace:D},v(ie.to),{state:typeof ie.to=="object"?Qe({},we,ie.to.state):we,force:M}),oe||k)}else ie=H(k,Ee,!0,D,we);return F(k,Ee,ie),ie})}function P(j,oe){const ce=x(j,oe);return ce?Promise.reject(ce):Promise.resolve()}function E(j){const oe=ge.values().next().value;return oe&&typeof oe.runWithContext=="function"?oe.runWithContext(j):j()}function T(j,oe){let ce;const[Ee,we,M]=FM(j,oe);ce=sl(Ee.reverse(),"beforeRouteLeave",j,oe);for(const I of Ee)I.leaveGuards.forEach(k=>{ce.push(li(k,j,oe))});const D=P.bind(null,j,oe);return ce.push(D),Ae(ce).then(()=>{ce=[];for(const I of s.list())ce.push(li(I,j,oe));return ce.push(D),Ae(ce)}).then(()=>{ce=sl(we,"beforeRouteUpdate",j,oe);for(const I of we)I.updateGuards.forEach(k=>{ce.push(li(k,j,oe))});return ce.push(D),Ae(ce)}).then(()=>{ce=[];for(const I of M)if(I.beforeEnter)if(xn(I.beforeEnter))for(const k of I.beforeEnter)ce.push(li(k,j,oe));else ce.push(li(I.beforeEnter,j,oe));return ce.push(D),Ae(ce)}).then(()=>(j.matched.forEach(I=>I.enterCallbacks={}),ce=sl(M,"beforeRouteEnter",j,oe),ce.push(D),Ae(ce))).then(()=>{ce=[];for(const I of o.list())ce.push(li(I,j,oe));return ce.push(D),Ae(ce)}).catch(I=>Ln(I,8)?I:Promise.reject(I))}function F(j,oe,ce){for(const Ee of a.list())E(()=>Ee(j,oe,ce))}function H(j,oe,ce,Ee,we){const M=x(j,oe);if(M)return M;const D=oe===En,I=xr?history.state:{};ce&&(Ee||D?r.replace(j.fullPath,Qe({scroll:D&&I&&I.scroll},we)):r.push(j.fullPath,we)),l.value=j,X(j,oe,ce,D),de()}let N;function U(){N||(N=r.listen((j,oe,ce)=>{if(!ye.listening)return;const Ee=h(j),we=R(Ee);if(we){A(Qe(we,{replace:!0}),Ee).catch(_s);return}c=Ee;const M=l.value;xr&&$y(Rf(M.fullPath,ce.delta),La()),T(Ee,M).catch(D=>Ln(D,12)?D:Ln(D,2)?(A(D.to,Ee).then(I=>{Ln(I,20)&&!ce.delta&&ce.type===Os.pop&&r.go(-1,!1)}).catch(_s),Promise.reject()):(ce.delta&&r.go(-ce.delta,!1),Y(D,Ee,M))).then(D=>{D=D||H(Ee,M,!1),D&&(ce.delta&&!Ln(D,8)?r.go(-ce.delta,!1):ce.type===Os.pop&&Ln(D,20)&&r.go(-1,!1)),F(Ee,M,D)}).catch(_s)}))}let W=ns(),Z=ns(),$;function Y(j,oe,ce){de(j);const Ee=Z.list();return Ee.length?Ee.forEach(we=>we(j,oe,ce)):console.error(j),Promise.reject(j)}function he(){return $&&l.value!==En?Promise.resolve():new Promise((j,oe)=>{W.add([j,oe])})}function de(j){return $||($=!j,U(),W.list().forEach(([oe,ce])=>j?ce(j):oe()),W.reset()),j}function X(j,oe,ce,Ee){const{scrollBehavior:we}=t;if(!xr||!we)return Promise.resolve();const M=!ce&&Yy(Rf(j.fullPath,0))||(Ee||!ce)&&history.state&&history.state.scroll||null;return Yi().then(()=>we(j,oe,M)).then(D=>D&&qy(D)).catch(D=>Y(D,j,oe))}const Q=j=>r.go(j);let _e;const ge=new Set,ye={currentRoute:l,listening:!0,addRoute:p,removeRoute:g,hasRoute:m,getRoutes:_,resolve:h,options:t,push:y,replace:S,go:Q,back:()=>Q(-1),forward:()=>Q(1),beforeEach:s.add,beforeResolve:o.add,afterEach:a.add,onError:Z.add,isReady:he,install(j){const oe=this;j.component("RouterLink",DM),j.component("RouterView",ym),j.config.globalProperties.$router=oe,Object.defineProperty(j.config.globalProperties,"$route",{enumerable:!0,get:()=>et(l)}),xr&&!_e&&l.value===En&&(_e=!0,y(r.location).catch(we=>{}));const ce={};for(const we in En)Object.defineProperty(ce,we,{get:()=>l.value[we],enumerable:!0});j.provide(pu,oe),j.provide(xm,Ws(ce)),j.provide(pc,l);const Ee=j.unmount;ge.add(j),j.unmount=function(){ge.delete(j),ge.size<1&&(c=En,N&&N(),N=null,l.value=En,_e=!1,$=!1),Ee()}}};function Ae(j){return j.reduce((oe,ce)=>oe.then(()=>E(ce)),Promise.resolve())}return ye}function FM(t,e){const n=[],i=[],r=[],s=Math.max(e.matched.length,t.matched.length);for(let o=0;o<s;o++){const a=e.matched[o];a&&(t.matched.find(c=>Hr(c,a))?i.push(a):n.push(a));const l=t.matched[o];l&&(e.matched.find(c=>Hr(c,l))||r.push(l))}return[n,i,r]}const Gf=[{name:"index",path:"/",meta:{},alias:[],redirect:void 0,component:()=>Dr(()=>import("./index.4f73291a.js"),["./index.4f73291a.js","./client-only.24f7881d.js"],import.meta.url).then(t=>t.default||t)},{name:"projects-flock",path:"/projects/flock",meta:{},alias:[],redirect:void 0,component:()=>Dr(()=>import("./flock.d8a943d6.js"),["./flock.d8a943d6.js","./flock.89ac26ab.css"],import.meta.url).then(t=>t.default||t)},{name:"projects-notebooks-2d-inverse-kinematics",path:"/projects/notebooks/2d-inverse-kinematics",meta:{},alias:[],redirect:void 0,component:()=>Dr(()=>import("./2d-inverse-kinematics.7a3ba354.js"),["./2d-inverse-kinematics.7a3ba354.js","./client-only.24f7881d.js","./2d-inverse-kinematics.862e917b.css"],import.meta.url).then(t=>t.default||t)}],BM={scrollBehavior(t,e,n){const i=lt();let r=n||void 0;if(!r&&e&&t&&t.meta.scrollToTop!==!1&&HM(e,t)&&(r={left:0,top:0}),t.path===e.path){if(e.hash&&!t.hash)return{left:0,top:0};if(t.hash)return{el:t.hash,top:Vf(t.hash)}}const s=a=>!!(a.meta.pageTransition??oc),o=s(e)&&s(t)?"page:transition:finish":"page:finish";return new Promise(a=>{i.hooks.hookOnce(o,async()=>{await Yi(),t.hash&&(r={el:t.hash,top:Vf(t.hash)}),a(r)})})}};function Vf(t){try{const e=document.querySelector(t);if(e)return parseFloat(getComputedStyle(e).scrollMarginTop)}catch{}return 0}function HM(t,e){const n=e.matched.every((i,r)=>{var s,o,a;return((s=i.components)==null?void 0:s.default)===((a=(o=t.matched[r])==null?void 0:o.components)==null?void 0:a.default)});return!!(!n||n&&JSON.stringify(t.params)!==JSON.stringify(e.params))}const kM={},Ot={...kM,...BM},zM=async t=>{var l;let e,n;if(!((l=t.meta)!=null&&l.validate))return;const i=lt(),r=Ei();if(([e,n]=la(()=>Promise.resolve(t.meta.validate(t))),e=await e,n(),e)===!0)return;const o=hu({statusCode:404,statusMessage:`Page Not Found: ${t.fullPath}`}),a=r.beforeResolve(c=>{if(a(),c===t){const u=r.afterEach(async()=>{u(),await i.runWithContext(()=>Sr(o)),window.history.pushState({},"",t.fullPath)});return!1}})},GM=[zM],xs={};function VM(t,e,n){const{pathname:i,search:r,hash:s}=e,o=t.indexOf("#");if(o>-1){const l=s.includes(t.slice(o))?t.slice(o).length:1;let c=s.slice(l);return c[0]!=="/"&&(c="/"+c),df(c,"")}const a=n||df(i,t);return a+(a.includes("?")?"":r)+s}const WM=Mi({name:"nuxt:router",enforce:"pre",async setup(t){var _,m;let e,n,i=uu().app.baseURL;Ot.hashMode&&!i.includes("#")&&(i+="#");const r=((_=Ot.history)==null?void 0:_.call(Ot,i))??(Ot.hashMode?Qy(i):um(i)),s=((m=Ot.routes)==null?void 0:m.call(Ot,Gf))??Gf;let o;const a=VM(i,window.location,t.payload.path),l=OM({...Ot,scrollBehavior:(h,v,x)=>{var y;if(v===En){o=x;return}return l.options.scrollBehavior=Ot.scrollBehavior,(y=Ot.scrollBehavior)==null?void 0:y.call(Ot,h,En,o||x)},history:r,routes:s});t.vueApp.use(l);const c=Ps(l.currentRoute.value);l.afterEach((h,v)=>{c.value=v}),Object.defineProperty(t.vueApp.config.globalProperties,"previousRoute",{get:()=>c.value});const u=Ps(l.resolve(a)),f=()=>{u.value=l.currentRoute.value};t.hook("page:finish",f),l.afterEach((h,v)=>{var x,y,S,R;((y=(x=h.matched[0])==null?void 0:x.components)==null?void 0:y.default)===((R=(S=v.matched[0])==null?void 0:S.components)==null?void 0:R.default)&&f()});const d={};for(const h in u.value)Object.defineProperty(d,h,{get:()=>u.value[h]});t._route=Ws(d),t._middleware=t._middleware||{global:[],named:{}};const p=Pa();try{[e,n]=la(()=>l.isReady()),await e,n()}catch(h){[e,n]=la(()=>t.runWithContext(()=>Sr(h))),await e,n()}const g=Cy("_layout");return l.beforeEach(async(h,v)=>{var x;h.meta=qn(h.meta),t.isHydrating&&g.value&&!Xi(h.meta.layout)&&(h.meta.layout=g.value),t._processingMiddleware=!0;{const y=new Set([...GM,...t._middleware.global]);for(const S of h.matched){const R=S.meta.middleware;if(R)if(Array.isArray(R))for(const A of R)y.add(A);else y.add(R)}for(const S of y){const R=typeof S=="string"?t._middleware.named[S]||await((x=xs[S])==null?void 0:x.call(xs).then(P=>P.default||P)):S;if(!R)throw new Error(`Unknown route middleware: '${S}'.`);const A=await t.runWithContext(()=>R(h,v));if(!t.payload.serverRendered&&t.isHydrating&&(A===!1||A instanceof Error)){const P=A||cc({statusCode:404,statusMessage:`Page Not Found: ${a}`});return await t.runWithContext(()=>Sr(P)),!1}if(A||A===!1)return A}}}),l.onError(()=>{delete t._processingMiddleware}),l.afterEach(async(h,v,x)=>{delete t._processingMiddleware,!t.isHydrating&&p.value&&await t.runWithContext(Iy),h.matched.length===0&&await t.runWithContext(()=>Sr(cc({statusCode:404,fatal:!1,statusMessage:`Page not found: ${h.fullPath}`})))}),t.hooks.hookOnce("app:created",async()=>{try{await l.replace({...l.resolve(a),name:void 0,force:!0}),l.options.scrollBehavior=Ot.scrollBehavior}catch(h){await t.runWithContext(()=>Sr(h))}}),{provide:{router:l}}}}),XM=Mi({name:"nuxt:payload",setup(t){My()&&(t.hooks.hook("link:prefetch",async e=>{$s(e).protocol||await Sf(e)}),Ei().beforeResolve(async(e,n)=>{if(e.path===n.path)return;const i=await Sf(e.path);i&&Object.assign(t.static.data,i.data)}))}}),jM=!1;/*!
  * pinia v2.1.4
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */let Mm;const Ys=t=>Mm=t,Em=Symbol();function mc(t){return t&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"&&typeof t.toJSON!="function"}var ys;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(ys||(ys={}));function qM(){const t=Bd(!0),e=t.run(()=>Ke({}));let n=[],i=[];const r=Ma({install(s){Ys(r),r._a=s,s.provide(Em,r),s.config.globalProperties.$pinia=r,i.forEach(o=>n.push(o)),i=[]},use(s){return!this._a&&!jM?i.push(s):n.push(s),this},_p:n,_a:null,_e:t,_s:new Map,state:e});return r}const Sm=()=>{};function Wf(t,e,n,i=Sm){t.push(e);const r=()=>{const s=t.indexOf(e);s>-1&&(t.splice(s,1),i())};return!n&&Hd()&&i_(r),r}function Qi(t,...e){t.slice().forEach(n=>{n(...e)})}const $M=t=>t();function gc(t,e){t instanceof Map&&e instanceof Map&&e.forEach((n,i)=>t.set(i,n)),t instanceof Set&&e instanceof Set&&e.forEach(t.add,t);for(const n in e){if(!e.hasOwnProperty(n))continue;const i=e[n],r=t[n];mc(r)&&mc(i)&&t.hasOwnProperty(n)&&!rt(i)&&!Vn(i)?t[n]=gc(r,i):t[n]=i}return t}const YM=Symbol();function KM(t){return!mc(t)||!t.hasOwnProperty(YM)}const{assign:si}=Object;function ZM(t){return!!(rt(t)&&t.effect)}function JM(t,e,n,i){const{state:r,actions:s,getters:o}=e,a=n.state.value[t];let l;function c(){a||(n.state.value[t]=r?r():{});const u=I_(n.state.value[t]);return si(u,s,Object.keys(o||{}).reduce((f,d)=>(f[d]=Ma(Nt(()=>{Ys(n);const p=n._s.get(t);return o[d].call(p,p)})),f),{}))}return l=bm(t,c,e,n,i,!0),l}function bm(t,e,n={},i,r,s){let o;const a=si({actions:{}},n),l={deep:!0};let c,u,f=[],d=[],p;const g=i.state.value[t];!s&&!g&&(i.state.value[t]={}),Ke({});let _;function m(P){let E;c=u=!1,typeof P=="function"?(P(i.state.value[t]),E={type:ys.patchFunction,storeId:t,events:p}):(gc(i.state.value[t],P),E={type:ys.patchObject,payload:P,storeId:t,events:p});const T=_=Symbol();Yi().then(()=>{_===T&&(c=!0)}),u=!0,Qi(f,E,i.state.value[t])}const h=s?function(){const{state:E}=n,T=E?E():{};this.$patch(F=>{si(F,T)})}:Sm;function v(){o.stop(),f=[],d=[],i._s.delete(t)}function x(P,E){return function(){Ys(i);const T=Array.from(arguments),F=[],H=[];function N(Z){F.push(Z)}function U(Z){H.push(Z)}Qi(d,{args:T,name:P,store:S,after:N,onError:U});let W;try{W=E.apply(this&&this.$id===t?this:S,T)}catch(Z){throw Qi(H,Z),Z}return W instanceof Promise?W.then(Z=>(Qi(F,Z),Z)).catch(Z=>(Qi(H,Z),Promise.reject(Z))):(Qi(F,W),W)}}const y={_p:i,$id:t,$onAction:Wf.bind(null,d),$patch:m,$reset:h,$subscribe(P,E={}){const T=Wf(f,P,E.detached,()=>F()),F=o.run(()=>Hi(()=>i.state.value[t],H=>{(E.flush==="sync"?u:c)&&P({storeId:t,type:ys.direct,events:p},H)},si({},l,E)));return T},$dispose:v},S=qn(y);i._s.set(t,S);const R=i._a&&i._a.runWithContext||$M,A=i._e.run(()=>(o=Bd(),R(()=>o.run(e))));for(const P in A){const E=A[P];if(rt(E)&&!ZM(E)||Vn(E))s||(g&&KM(E)&&(rt(E)?E.value=g[P]:gc(E,g[P])),i.state.value[t][P]=E);else if(typeof E=="function"){const T=x(P,E);A[P]=T,a.actions[P]=E}}return si(S,A),si(qe(S),A),Object.defineProperty(S,"$state",{get:()=>i.state.value[t],set:P=>{m(E=>{si(E,P)})}}),i._p.forEach(P=>{si(S,o.run(()=>P({store:S,app:i._a,pinia:i,options:a})))}),g&&s&&n.hydrate&&n.hydrate(S.$state,g),c=!0,u=!0,S}function Tm(t,e,n){let i,r;const s=typeof e=="function";typeof t=="string"?(i=t,r=s?n:e):(r=t,i=t.id);function o(a,l){const c=nu();return a=a||(c?Bt(Em,null):null),a&&Ys(a),a=Mm,a._s.has(i)||(s?bm(i,e,r,a):JM(i,r,a)),a._s.get(i)}return o.$id=i,o}function wm(t){{t=qe(t);const e={};for(const n in t){const i=t[n];(rt(i)||Vn(i))&&(e[n]=$c(t,n))}return e}}const _c=globalThis.requestIdleCallback||(t=>{const e=Date.now(),n={didTimeout:!1,timeRemaining:()=>Math.max(0,50-(Date.now()-e))};return setTimeout(()=>{t(n)},1)}),QM=globalThis.cancelIdleCallback||(t=>{clearTimeout(t)}),eE=t=>{const e=lt();e.isHydrating?e.hooks.hookOnce("app:suspense:resolve",()=>{_c(t)}):_c(t)};async function Am(t,e=Ei()){const{path:n,matched:i}=e.resolve(t);if(!i.length||(e._routePreloaded||(e._routePreloaded=new Set),e._routePreloaded.has(n)))return;const r=e._preloadPromises=e._preloadPromises||[];if(r.length>4)return Promise.all(r).then(()=>Am(t,e));e._routePreloaded.add(n);const s=i.map(o=>{var a;return(a=o.components)==null?void 0:a.default}).filter(o=>typeof o=="function");for(const o of s){const a=Promise.resolve(o()).catch(()=>{}).finally(()=>r.splice(r.indexOf(a)));r.push(a)}await Promise.all(r)}function tE(t={}){const e=t.path||window.location.pathname;let n={};try{n=JSON.parse(sessionStorage.getItem("nuxt:reload")||"{}")}catch{}if(t.force||(n==null?void 0:n.path)!==e||(n==null?void 0:n.expires)<Date.now()){try{sessionStorage.setItem("nuxt:reload",JSON.stringify({path:e,expires:Date.now()+(t.ttl??1e4)}))}catch{}if(t.persistState)try{sessionStorage.setItem("nuxt:reload:state",JSON.stringify({state:lt().payload.state}))}catch{}window.location.pathname!==e?window.location.href=e:window.location.reload()}}const nE=(...t)=>t.find(e=>e!==void 0),iE="noopener noreferrer";/*! @__NO_SIDE_EFFECTS__ */function rE(t){const e=t.componentName||"NuxtLink",n=(i,r)=>{if(!i||t.trailingSlash!=="append"&&t.trailingSlash!=="remove")return i;const s=t.trailingSlash==="append"?Wp:cu;if(typeof i=="string")return s(i,!0);const o="path"in i?i.path:r(i).path;return{...i,name:void 0,path:s(o,!0)}};return Cn({name:e,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},setup(i,{slots:r}){const s=Ei(),o=Nt(()=>{const f=i.to||i.href||"";return n(f,s.resolve)}),a=Nt(()=>i.external||i.target&&i.target!=="_self"?!0:typeof o.value=="object"?!1:o.value===""||Kr(o.value,{acceptRelative:!0})),l=Ke(!1),c=Ke(null),u=f=>{var d;c.value=i.custom?(d=f==null?void 0:f.$el)==null?void 0:d.nextElementSibling:f==null?void 0:f.$el};if(i.prefetch!==!1&&i.noPrefetch!==!0&&i.target!=="_blank"&&!aE()){const d=lt();let p,g=null;Ki(()=>{const _=oE();eE(()=>{p=_c(()=>{var m;(m=c==null?void 0:c.value)!=null&&m.tagName&&(g=_.observe(c.value,async()=>{g==null||g(),g=null;const h=typeof o.value=="string"?o.value:s.resolve(o.value).fullPath;await Promise.all([d.hooks.callHook("link:prefetch",h).catch(()=>{}),!a.value&&Am(o.value,s).catch(()=>{})]),l.value=!0}))})})}),Yr(()=>{p&&QM(p),g==null||g(),g=null})}return()=>{var _,m;if(!a.value){const h={ref:u,to:o.value,activeClass:i.activeClass||t.activeClass,exactActiveClass:i.exactActiveClass||t.exactActiveClass,replace:i.replace,ariaCurrentValue:i.ariaCurrentValue,custom:i.custom};return i.custom||(l.value&&(h.class=i.prefetchedClass||t.prefetchedClass),h.rel=i.rel),vn(hv("RouterLink"),h,r.default)}const f=typeof o.value=="object"?((_=s.resolve(o.value))==null?void 0:_.href)??null:o.value||null,d=i.target||null,p=i.noRel?null:nE(i.rel,t.externalRelAttribute,f?iE:"")||null,g=()=>Dy(f,{replace:i.replace});return i.custom?r.default?r.default({href:f,navigate:g,get route(){if(!f)return;const h=$s(f);return{path:h.pathname,fullPath:h.pathname,get query(){return Vp(h.search)},hash:h.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:f}},rel:p,target:d,isExternal:a.value,isActive:!1,isExactActive:!1}):null:vn("a",{ref:c,href:f,rel:p,target:d},(m=r.default)==null?void 0:m.call(r))}}})}const sE=rE({componentName:"NuxtLink"});function oE(){const t=lt();if(t._observer)return t._observer;let e=null;const n=new Map,i=(s,o)=>(e||(e=new IntersectionObserver(a=>{for(const l of a){const c=n.get(l.target);(l.isIntersecting||l.intersectionRatio>0)&&c&&c()}})),n.set(s,o),e.observe(s),()=>{n.delete(s),e.unobserve(s),n.size===0&&(e.disconnect(),e=null)});return t._observer={observe:i}}function aE(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}const lE=Mi(t=>{const e=qM();return t.vueApp.use(e),Ys(e),t.payload&&t.payload.pinia&&(e.state.value=t.payload.pinia),{provide:{pinia:e}}}),cE=Mi({name:"nuxt:global-components"}),uE=Mi({name:"nuxt:head",setup(t){const n=hy();n.push(gy),t.vueApp.use(n);{let i=!0;const r=()=>{i=!1,n.hooks.callHook("entries:updated",n)};n.hooks.hook("dom:beforeRender",s=>{s.shouldRender=!i}),t.hooks.hook("page:start",()=>{i=!0}),t.hooks.hook("page:finish",r),t.hooks.hook("app:suspense:resolve",r)}}}),go={},fE=Mi({name:"nuxt:prefetch",setup(t){const e=Ei();t.hooks.hook("app:mounted",()=>{e.beforeEach(async n=>{var r;const i=(r=n==null?void 0:n.meta)==null?void 0:r.layout;i&&typeof go[i]=="function"&&await go[i]()})}),t.hooks.hook("link:prefetch",n=>{var o,a,l,c;if(Kr(n))return;const i=e.resolve(n);if(!i)return;const r=(o=i==null?void 0:i.meta)==null?void 0:o.layout;let s=Array.isArray((a=i==null?void 0:i.meta)==null?void 0:a.middleware)?(l=i==null?void 0:i.meta)==null?void 0:l.middleware:[(c=i==null?void 0:i.meta)==null?void 0:c.middleware];s=s.filter(u=>typeof u=="string");for(const u of s)typeof xs[u]=="function"&&xs[u]();r&&typeof go[r]=="function"&&go[r]()})}}),hE=Mi({name:"nuxt:chunk-reload",setup(t){const e=Ei(),n=uu(),i=new Set;e.beforeEach(()=>{i.clear()}),t.hook("app:chunkError",({error:r})=>{i.add(r)}),e.onError((r,s)=>{if(i.has(r)){const a="href"in s&&s.href.startsWith("#")?n.app.baseURL+s.href:qs(n.app.baseURL,s.fullPath);tE({path:a,persistState:!0})}})}}),dE=[Ny,WM,XM,lE,cE,uE,fE,hE];/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const mu="154",er={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},tr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},pE=0,Xf=1,mE=2,Rm=1,gE=2,Bn=3,yi=0,kt=1,zn=2,_i=0,Ir=1,jf=2,qf=3,$f=4,_E=5,yr=100,vE=101,xE=102,Yf=103,Kf=104,yE=200,ME=201,EE=202,SE=203,Cm=204,Pm=205,bE=206,TE=207,wE=208,AE=209,RE=210,CE=0,PE=1,LE=2,vc=3,DE=4,IE=5,UE=6,NE=7,Lm=0,OE=1,FE=2,Wn=0,BE=1,HE=2,kE=3,zE=4,GE=5,Dm=300,zr=301,Gr=302,xc=303,yc=304,Da=306,Mc=1e3,pn=1001,Ec=1002,It=1003,Zf=1004,ol=1005,en=1006,VE=1007,Fs=1008,vi=1009,WE=1010,XE=1011,gu=1012,Im=1013,ui=1014,fi=1015,Bs=1016,Um=1017,Nm=1018,zi=1020,jE=1021,mn=1023,qE=1024,$E=1025,Gi=1026,Vr=1027,YE=1028,Om=1029,KE=1030,Fm=1031,Bm=1033,al=33776,ll=33777,cl=33778,ul=33779,Jf=35840,Qf=35841,eh=35842,th=35843,ZE=36196,nh=37492,ih=37496,rh=37808,sh=37809,oh=37810,ah=37811,lh=37812,ch=37813,uh=37814,fh=37815,hh=37816,dh=37817,ph=37818,mh=37819,gh=37820,_h=37821,fl=36492,JE=36283,vh=36284,xh=36285,yh=36286,Hm=3e3,Vi=3001,QE=3200,eS=3201,tS=0,nS=1,Wi="",Ge="srgb",Rn="srgb-linear",km="display-p3",hl=7680,iS=519,rS=512,sS=513,oS=514,aS=515,lS=516,cS=517,uS=518,fS=519,Mh=35044,Eh="300 es",Sc=1035,Gn=2e3,ha=2001;class Zi{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dl=Math.PI/180,bc=180/Math.PI;function Ks(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tt[t&255]+Tt[t>>8&255]+Tt[t>>16&255]+Tt[t>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[n&63|128]+Tt[n>>8&255]+"-"+Tt[n>>16&255]+Tt[n>>24&255]+Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]).toLowerCase()}function Ut(t,e,n){return Math.max(e,Math.min(n,t))}function hS(t,e){return(t%e+e)%e}function pl(t,e,n){return(1-n)*t+n*e}function Sh(t){return(t&t-1)===0&&t!==0}function Tc(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function _o(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Wt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class Xe{constructor(e=0,n=0){Xe.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ut(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,n,i,r,s,o,a,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],d=i[2],p=i[5],g=i[8],_=r[0],m=r[3],h=r[6],v=r[1],x=r[4],y=r[7],S=r[2],R=r[5],A=r[8];return s[0]=o*_+a*v+l*S,s[3]=o*m+a*x+l*R,s[6]=o*h+a*y+l*A,s[1]=c*_+u*v+f*S,s[4]=c*m+u*x+f*R,s[7]=c*h+u*y+f*A,s[2]=d*_+p*v+g*S,s[5]=d*m+p*x+g*R,s[8]=d*h+p*y+g*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,d=a*l-u*s,p=c*s-o*l,g=n*f+i*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=d*_,e[4]=(u*n-r*l)*_,e[5]=(r*s-a*n)*_,e[6]=p*_,e[7]=(i*l-c*n)*_,e[8]=(o*n-i*s)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(ml.makeScale(e,n)),this}rotate(e){return this.premultiply(ml.makeRotation(-e)),this}translate(e,n){return this.premultiply(ml.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ml=new Ve;function zm(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function da(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}const bh={};function Ms(t){t in bh||(bh[t]=!0,console.warn(t))}function Ur(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function gl(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const dS=new Ve().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),pS=new Ve().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function mS(t){return t.convertSRGBToLinear().applyMatrix3(pS)}function gS(t){return t.applyMatrix3(dS).convertLinearToSRGB()}const _S={[Rn]:t=>t,[Ge]:t=>t.convertSRGBToLinear(),[km]:mS},vS={[Rn]:t=>t,[Ge]:t=>t.convertLinearToSRGB(),[km]:gS},an={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(t){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!t},get workingColorSpace(){return Rn},set workingColorSpace(t){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=_S[e],r=vS[n];if(i===void 0||r===void 0)throw new Error(`Unsupported color space conversion, "${e}" to "${n}".`);return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)}};let nr;class Gm{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{nr===void 0&&(nr=da("canvas")),nr.width=e.width,nr.height=e.height;const i=nr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=nr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=da("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ur(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ur(n[i]/255)*255):n[i]=Ur(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xS=0;class Vm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xS++}),this.uuid=Ks(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(_l(r[o].image)):s.push(_l(r[o]))}else s=_l(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function _l(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Gm.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yS=0;class Kt extends Zi{constructor(e=Kt.DEFAULT_IMAGE,n=Kt.DEFAULT_MAPPING,i=pn,r=pn,s=en,o=Fs,a=mn,l=vi,c=Kt.DEFAULT_ANISOTROPY,u=Wi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yS++}),this.uuid=Ks(),this.name="",this.source=new Vm(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Ms("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===Vi?Ge:Wi),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mc:e.x=e.x-Math.floor(e.x);break;case pn:e.x=e.x<0?0:1;break;case Ec:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mc:e.y=e.y-Math.floor(e.y);break;case pn:e.y=e.y<0?0:1;break;case Ec:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ms("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ge?Vi:Hm}set encoding(e){Ms("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Vi?Ge:Wi}}Kt.DEFAULT_IMAGE=null;Kt.DEFAULT_MAPPING=Dm;Kt.DEFAULT_ANISOTROPY=1;class bt{constructor(e=0,n=0,i=0,r=1){bt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],h=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+h-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const x=(c+1)/2,y=(p+1)/2,S=(h+1)/2,R=(u+d)/4,A=(f+_)/4,P=(g+m)/4;return x>y&&x>S?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=R/i,s=A/i):y>S?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=R/r,s=P/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=A/s,r=P/s),this.set(i,r,s,n),this}let v=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(f-_)/v,this.z=(d-u)/v,this.w=Math.acos((c+p+h-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ji extends Zi{constructor(e=1,n=1,i={}){super(),this.isWebGLRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new bt(0,0,e,n),this.scissorTest=!1,this.viewport=new bt(0,0,e,n);const r={width:e,height:n,depth:1};i.encoding!==void 0&&(Ms("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Vi?Ge:Wi),this.texture=new Kt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.internalFormat=i.internalFormat!==void 0?i.internalFormat:null,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:en,this.depthBuffer=i.depthBuffer!==void 0?i.depthBuffer:!0,this.stencilBuffer=i.stencilBuffer!==void 0?i.stencilBuffer:!1,this.depthTexture=i.depthTexture!==void 0?i.depthTexture:null,this.samples=i.samples!==void 0?i.samples:0}setSize(e,n,i=1){(this.width!==e||this.height!==n||this.depth!==i)&&(this.width=e,this.height=n,this.depth=i,this.texture.image.width=e,this.texture.image.height=n,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Vm(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wm extends Kt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=It,this.minFilter=It,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class MS extends Kt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=It,this.minFilter=It,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qi{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const d=s[o+0],p=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f;return}if(a===1){e[n+0]=d,e[n+1]=p,e[n+2]=g,e[n+3]=_;return}if(f!==_||l!==d||c!==p||u!==g){let m=1-a;const h=l*d+c*p+u*g+f*_,v=h>=0?1:-1,x=1-h*h;if(x>Number.EPSILON){const S=Math.sqrt(x),R=Math.atan2(S,h*v);m=Math.sin(m*R)/S,a=Math.sin(a*R)/S}const y=a*v;if(l=l*m+d*y,c=c*m+p*y,u=u*m+g*y,f=f*m+_*y,m===1-a){const S=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=S,c*=S,u*=S,f*=S}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],d=s[o+1],p=s[o+2],g=s[o+3];return e[n]=a*g+u*f+l*p-c*d,e[n+1]=l*g+u*d+c*f-a*p,e[n+2]=c*g+u*p+a*d-l*f,e[n+3]=u*g-a*f-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),d=l(i/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*f+c*p*g,this._y=c*p*f-d*u*g,this._z=c*u*g+d*p*f,this._w=c*u*f-d*p*g;break;case"YXZ":this._x=d*u*f+c*p*g,this._y=c*p*f-d*u*g,this._z=c*u*g-d*p*f,this._w=c*u*f+d*p*g;break;case"ZXY":this._x=d*u*f-c*p*g,this._y=c*p*f+d*u*g,this._z=c*u*g+d*p*f,this._w=c*u*f-d*p*g;break;case"ZYX":this._x=d*u*f-c*p*g,this._y=c*p*f+d*u*g,this._z=c*u*g-d*p*f,this._w=c*u*f+d*p*g;break;case"YZX":this._x=d*u*f+c*p*g,this._y=c*p*f+d*u*g,this._z=c*u*g-d*p*f,this._w=c*u*f-d*p*g;break;case"XZY":this._x=d*u*f-c*p*g,this._y=c*p*f-d*u*g,this._z=c*u*g+d*p*f,this._w=c*u*f+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],d=i+a+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>f){const p=2*Math.sqrt(1+i-a-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>f){const p=2*Math.sqrt(1+a-i-f);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ut(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),f=Math.sin((1-n)*u)/c,d=Math.sin(n*u)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=r*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=Math.random(),n=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(n*Math.cos(r),i*Math.sin(s),i*Math.cos(s),n*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(e=0,n=0,i=0){z.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Th.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Th.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=l*n+o*r-a*i,u=l*i+a*n-s*r,f=l*r+s*i-o*n,d=-s*n-o*i-a*r;return this.x=c*l+d*-s+u*-a-f*-o,this.y=u*l+d*-o+f*-s-c*-a,this.z=f*l+d*-a+c*-o-u*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return vl.copy(this).projectOnVector(e),this.sub(vl)}reflect(e){return this.sub(vl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ut(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,n=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(n),this.y=i*Math.sin(n),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vl=new z,Th=new qi;class Zs{constructor(e=new z(1/0,1/0,1/0),n=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(In.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(In.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=In.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){if(e.updateWorldMatrix(!1,!1),e.boundingBox!==void 0)e.boundingBox===null&&e.computeBoundingBox(),ir.copy(e.boundingBox),ir.applyMatrix4(e.matrixWorld),this.union(ir);else{const r=e.geometry;if(r!==void 0)if(n&&r.attributes!==void 0&&r.attributes.position!==void 0){const s=r.attributes.position;for(let o=0,a=s.count;o<a;o++)In.fromBufferAttribute(s,o).applyMatrix4(e.matrixWorld),this.expandByPoint(In)}else r.boundingBox===null&&r.computeBoundingBox(),ir.copy(r.boundingBox),ir.applyMatrix4(e.matrixWorld),this.union(ir)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],n);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(is),vo.subVectors(this.max,is),rr.subVectors(e.a,is),sr.subVectors(e.b,is),or.subVectors(e.c,is),ti.subVectors(sr,rr),ni.subVectors(or,sr),Ri.subVectors(rr,or);let n=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-Ri.z,Ri.y,ti.z,0,-ti.x,ni.z,0,-ni.x,Ri.z,0,-Ri.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-Ri.y,Ri.x,0];return!xl(n,rr,sr,or,vo)||(n=[1,0,0,0,1,0,0,0,1],!xl(n,rr,sr,or,vo))?!1:(xo.crossVectors(ti,ni),n=[xo.x,xo.y,xo.z],xl(n,rr,sr,or,vo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Dn=[new z,new z,new z,new z,new z,new z,new z,new z],In=new z,ir=new Zs,rr=new z,sr=new z,or=new z,ti=new z,ni=new z,Ri=new z,is=new z,vo=new z,xo=new z,Ci=new z;function xl(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Ci.fromArray(t,s);const a=r.x*Math.abs(Ci.x)+r.y*Math.abs(Ci.y)+r.z*Math.abs(Ci.z),l=e.dot(Ci),c=n.dot(Ci),u=i.dot(Ci);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const ES=new Zs,rs=new z,yl=new z;class Ia{constructor(e=new z,n=-1){this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):ES.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rs.subVectors(e,this.center);const n=rs.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(rs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rs.copy(e.center).add(yl)),this.expandByPoint(rs.copy(e.center).sub(yl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Un=new z,Ml=new z,yo=new z,ii=new z,El=new z,Mo=new z,Sl=new z;class Xm{constructor(e=new z,n=new z(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Un)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Un.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Un.copy(this.origin).addScaledVector(this.direction,n),Un.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Ml.copy(e).add(n).multiplyScalar(.5),yo.copy(n).sub(e).normalize(),ii.copy(this.origin).sub(Ml);const s=e.distanceTo(n)*.5,o=-this.direction.dot(yo),a=ii.dot(this.direction),l=-ii.dot(yo),c=ii.lengthSq(),u=Math.abs(1-o*o);let f,d,p,g;if(u>0)if(f=o*l-a,d=o*a-l,g=s*u,f>=0)if(d>=-g)if(d<=g){const _=1/u;f*=_,d*=_,p=f*(f+o*d+2*a)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-o*s+a)),d=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(f=Math.max(0,-(o*s+a)),d=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Ml).addScaledVector(yo,d),p}intersectSphere(e,n){Un.subVectors(e.center,this.origin);const i=Un.dot(this.direction),r=Un.dot(Un)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(a=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Un)!==null}intersectTriangle(e,n,i,r,s){El.subVectors(n,e),Mo.subVectors(i,e),Sl.crossVectors(El,Mo);let o=this.direction.dot(Sl),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ii.subVectors(this.origin,e);const l=a*this.direction.dot(Mo.crossVectors(ii,Mo));if(l<0)return null;const c=a*this.direction.dot(El.cross(ii));if(c<0||l+c>o)return null;const u=-a*ii.dot(Sl);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et{constructor(e,n,i,r,s,o,a,l,c,u,f,d,p,g,_,m){Et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,d,p,g,_,m)}set(e,n,i,r,s,o,a,l,c,u,f,d,p,g,_,m){const h=this.elements;return h[0]=e,h[4]=n,h[8]=i,h[12]=r,h[1]=s,h[5]=o,h[9]=a,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=d,h[3]=p,h[7]=g,h[11]=_,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Et().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ar.setFromMatrixColumn(e,0).length(),s=1/ar.setFromMatrixColumn(e,1).length(),o=1/ar.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const d=o*u,p=o*f,g=a*u,_=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=p+g*c,n[5]=d-_*c,n[9]=-a*l,n[2]=_-d*c,n[6]=g+p*c,n[10]=o*l}else if(e.order==="YXZ"){const d=l*u,p=l*f,g=c*u,_=c*f;n[0]=d+_*a,n[4]=g*a-p,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=p*a-g,n[6]=_+d*a,n[10]=o*l}else if(e.order==="ZXY"){const d=l*u,p=l*f,g=c*u,_=c*f;n[0]=d-_*a,n[4]=-o*f,n[8]=g+p*a,n[1]=p+g*a,n[5]=o*u,n[9]=_-d*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const d=o*u,p=o*f,g=a*u,_=a*f;n[0]=l*u,n[4]=g*c-p,n[8]=d*c+_,n[1]=l*f,n[5]=_*c+d,n[9]=p*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,g=a*l,_=a*c;n[0]=l*u,n[4]=_-d*f,n[8]=g*f+p,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=p*f+g,n[10]=d-_*f}else if(e.order==="XZY"){const d=o*l,p=o*c,g=a*l,_=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=d*f+_,n[5]=o*u,n[9]=p*f-g,n[2]=g*f-p,n[6]=a*u,n[10]=_*f+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(SS,e,bS)}lookAt(e,n,i){const r=this.elements;return Xt.subVectors(e,n),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),ri.crossVectors(i,Xt),ri.lengthSq()===0&&(Math.abs(i.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),ri.crossVectors(i,Xt)),ri.normalize(),Eo.crossVectors(Xt,ri),r[0]=ri.x,r[4]=Eo.x,r[8]=Xt.x,r[1]=ri.y,r[5]=Eo.y,r[9]=Xt.y,r[2]=ri.z,r[6]=Eo.z,r[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],h=i[14],v=i[3],x=i[7],y=i[11],S=i[15],R=r[0],A=r[4],P=r[8],E=r[12],T=r[1],F=r[5],H=r[9],N=r[13],U=r[2],W=r[6],Z=r[10],$=r[14],Y=r[3],he=r[7],de=r[11],X=r[15];return s[0]=o*R+a*T+l*U+c*Y,s[4]=o*A+a*F+l*W+c*he,s[8]=o*P+a*H+l*Z+c*de,s[12]=o*E+a*N+l*$+c*X,s[1]=u*R+f*T+d*U+p*Y,s[5]=u*A+f*F+d*W+p*he,s[9]=u*P+f*H+d*Z+p*de,s[13]=u*E+f*N+d*$+p*X,s[2]=g*R+_*T+m*U+h*Y,s[6]=g*A+_*F+m*W+h*he,s[10]=g*P+_*H+m*Z+h*de,s[14]=g*E+_*N+m*$+h*X,s[3]=v*R+x*T+y*U+S*Y,s[7]=v*A+x*F+y*W+S*he,s[11]=v*P+x*H+y*Z+S*de,s[15]=v*E+x*N+y*$+S*X,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],p=e[14],g=e[3],_=e[7],m=e[11],h=e[15];return g*(+s*l*f-r*c*f-s*a*d+i*c*d+r*a*p-i*l*p)+_*(+n*l*p-n*c*d+s*o*d-r*o*p+r*c*u-s*l*u)+m*(+n*c*f-n*a*p-s*o*f+i*o*p+s*a*u-i*c*u)+h*(-r*a*u-n*l*f+n*a*d+r*o*f-i*o*d+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],h=e[15],v=f*m*c-_*d*c+_*l*p-a*m*p-f*l*h+a*d*h,x=g*d*c-u*m*c-g*l*p+o*m*p+u*l*h-o*d*h,y=u*_*c-g*f*c+g*a*p-o*_*p-u*a*h+o*f*h,S=g*f*l-u*_*l-g*a*d+o*_*d+u*a*m-o*f*m,R=n*v+i*x+r*y+s*S;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=v*A,e[1]=(_*d*s-f*m*s-_*r*p+i*m*p+f*r*h-i*d*h)*A,e[2]=(a*m*s-_*l*s+_*r*c-i*m*c-a*r*h+i*l*h)*A,e[3]=(f*l*s-a*d*s-f*r*c+i*d*c+a*r*p-i*l*p)*A,e[4]=x*A,e[5]=(u*m*s-g*d*s+g*r*p-n*m*p-u*r*h+n*d*h)*A,e[6]=(g*l*s-o*m*s-g*r*c+n*m*c+o*r*h-n*l*h)*A,e[7]=(o*d*s-u*l*s+u*r*c-n*d*c-o*r*p+n*l*p)*A,e[8]=y*A,e[9]=(g*f*s-u*_*s-g*i*p+n*_*p+u*i*h-n*f*h)*A,e[10]=(o*_*s-g*a*s+g*i*c-n*_*c-o*i*h+n*a*h)*A,e[11]=(u*a*s-o*f*s-u*i*c+n*f*c+o*i*p-n*a*p)*A,e[12]=S*A,e[13]=(u*_*r-g*f*r+g*i*d-n*_*d-u*i*m+n*f*m)*A,e[14]=(g*a*r-o*_*r-g*i*l+n*_*l+o*i*m-n*a*m)*A,e[15]=(o*f*r-u*a*r+u*i*l-n*f*l-o*i*d+n*a*d)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,d=s*c,p=s*u,g=s*f,_=o*u,m=o*f,h=a*f,v=l*c,x=l*u,y=l*f,S=i.x,R=i.y,A=i.z;return r[0]=(1-(_+h))*S,r[1]=(p+y)*S,r[2]=(g-x)*S,r[3]=0,r[4]=(p-y)*R,r[5]=(1-(d+h))*R,r[6]=(m+v)*R,r[7]=0,r[8]=(g+x)*A,r[9]=(m-v)*A,r[10]=(1-(d+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ar.set(r[0],r[1],r[2]).length();const o=ar.set(r[4],r[5],r[6]).length(),a=ar.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ln.copy(this);const c=1/s,u=1/o,f=1/a;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=u,ln.elements[5]*=u,ln.elements[6]*=u,ln.elements[8]*=f,ln.elements[9]*=f,ln.elements[10]*=f,n.setFromRotationMatrix(ln),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=Gn){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),f=(n+e)/(n-e),d=(i+r)/(i-r);let p,g;if(a===Gn)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===ha)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Gn){const l=this.elements,c=1/(n-e),u=1/(i-r),f=1/(o-s),d=(n+e)*c,p=(i+r)*u;let g,_;if(a===Gn)g=(o+s)*f,_=-2*f;else if(a===ha)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ar=new z,ln=new Et,SS=new z(0,0,0),bS=new z(1,1,1),ri=new z,Eo=new z,Xt=new z,wh=new Et,Ah=new qi;class Ua{constructor(e=0,n=0,i=0,r=Ua.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],d=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(Ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ut(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ut(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ut(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return wh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wh,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Ah.setFromEuler(this),this.setFromQuaternion(Ah,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ua.DEFAULT_ORDER="XYZ";class jm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let TS=0;const Rh=new z,lr=new qi,Nn=new Et,So=new z,ss=new z,wS=new z,AS=new qi,Ch=new z(1,0,0),Ph=new z(0,1,0),Lh=new z(0,0,1),RS={type:"added"},Dh={type:"removed"};class zt extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:TS++}),this.uuid=Ks(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zt.DEFAULT_UP.clone();const e=new z,n=new Ua,i=new qi,r=new z(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Et},normalMatrix:{value:new Ve}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=zt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new jm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return lr.setFromAxisAngle(e,n),this.quaternion.multiply(lr),this}rotateOnWorldAxis(e,n){return lr.setFromAxisAngle(e,n),this.quaternion.premultiply(lr),this}rotateX(e){return this.rotateOnAxis(Ch,e)}rotateY(e){return this.rotateOnAxis(Ph,e)}rotateZ(e){return this.rotateOnAxis(Lh,e)}translateOnAxis(e,n){return Rh.copy(e).applyQuaternion(this.quaternion),this.position.add(Rh.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Ch,e)}translateY(e){return this.translateOnAxis(Ph,e)}translateZ(e){return this.translateOnAxis(Lh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?So.copy(e):So.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(ss,So,this.up):Nn.lookAt(So,ss,this.up),this.quaternion.setFromRotationMatrix(Nn),r&&(Nn.extractRotation(r.matrixWorld),lr.setFromRotationMatrix(Nn),this.quaternion.premultiply(lr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(RS)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Dh)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const n=this.children[e];n.parent=null,n.dispatchEvent(Dh)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Nn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Nn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n){let i=[];this[e]===n&&i.push(this);for(let r=0,s=this.children.length;r<s;r++){const o=this.children[r].getObjectsByProperty(e,n);o.length>0&&(i=i.concat(o))}return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,e,wS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,AS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++){const s=n[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations,this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}zt.DEFAULT_UP=new z(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new z,On=new z,bl=new z,Fn=new z,cr=new z,ur=new z,Ih=new z,Tl=new z,wl=new z,Al=new z;let bo=!1;class fn{constructor(e=new z,n=new z,i=new z){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),cn.subVectors(e,n),r.cross(cn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){cn.subVectors(r,n),On.subVectors(i,n),bl.subVectors(e,n);const o=cn.dot(cn),a=cn.dot(On),l=cn.dot(bl),c=On.dot(On),u=On.dot(bl),f=o*c-a*a;if(f===0)return s.set(-2,-1,-1);const d=1/f,p=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-p-g,g,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Fn),Fn.x>=0&&Fn.y>=0&&Fn.x+Fn.y<=1}static getUV(e,n,i,r,s,o,a,l){return bo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),bo=!0),this.getInterpolation(e,n,i,r,s,o,a,l)}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Fn),l.setScalar(0),l.addScaledVector(s,Fn.x),l.addScaledVector(o,Fn.y),l.addScaledVector(a,Fn.z),l}static isFrontFacing(e,n,i,r){return cn.subVectors(i,n),On.subVectors(e,n),cn.cross(On).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return cn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),cn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return fn.getBarycoord(e,this.a,this.b,this.c,n)}getUV(e,n,i,r,s){return bo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),bo=!0),fn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}getInterpolation(e,n,i,r,s){return fn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;cr.subVectors(r,i),ur.subVectors(s,i),Tl.subVectors(e,i);const l=cr.dot(Tl),c=ur.dot(Tl);if(l<=0&&c<=0)return n.copy(i);wl.subVectors(e,r);const u=cr.dot(wl),f=ur.dot(wl);if(u>=0&&f<=u)return n.copy(r);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(cr,o);Al.subVectors(e,s);const p=cr.dot(Al),g=ur.dot(Al);if(g>=0&&p<=g)return n.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(ur,a);const m=u*g-p*f;if(m<=0&&f-u>=0&&p-g>=0)return Ih.subVectors(s,r),a=(f-u)/(f-u+(p-g)),n.copy(r).addScaledVector(Ih,a);const h=1/(m+_+d);return o=_*h,a=d*h,n.copy(i).addScaledVector(cr,o).addScaledVector(ur,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let CS=0;class Js extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:CS++}),this.uuid=Ks(),this.name="",this.type="Material",this.blending=Ir,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Cm,this.blendDst=Pm,this.blendEquation=yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=vc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=iS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hl,this.stencilZFail=hl,this.stencilZPass=hl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ir&&(i.blending=this.blending),this.side!==yi&&(i.side=this.side),this.vertexColors&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=this.transparent),i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.stencilWrite=this.stencilWrite,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(i.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(i.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(i.wireframe=this.wireframe),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=this.flatShading),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const qm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},un={h:0,s:0,l:0},To={h:0,s:0,l:0};function Rl(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Je{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ge){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,an.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=an.workingColorSpace){return this.r=e,this.g=n,this.b=i,an.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=an.workingColorSpace){if(e=hS(e,1),n=Ut(n,0,1),i=Ut(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Rl(o,s,e+1/3),this.g=Rl(o,s,e),this.b=Rl(o,s,e-1/3)}return an.toWorkingColorSpace(this,r),this}setStyle(e,n=Ge){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ge){const i=qm[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ur(e.r),this.g=Ur(e.g),this.b=Ur(e.b),this}copyLinearToSRGB(e){return this.r=gl(e.r),this.g=gl(e.g),this.b=gl(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ge){return an.fromWorkingColorSpace(wt.copy(this),e),Math.round(Ut(wt.r*255,0,255))*65536+Math.round(Ut(wt.g*255,0,255))*256+Math.round(Ut(wt.b*255,0,255))}getHexString(e=Ge){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=an.workingColorSpace){an.fromWorkingColorSpace(wt.copy(this),n);const i=wt.r,r=wt.g,s=wt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=an.workingColorSpace){return an.fromWorkingColorSpace(wt.copy(this),n),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=Ge){an.fromWorkingColorSpace(wt.copy(this),e);const n=wt.r,i=wt.g,r=wt.b;return e!==Ge?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(un),un.h+=e,un.s+=n,un.l+=i,this.setHSL(un.h,un.s,un.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(un),e.getHSL(To);const i=pl(un.h,To.h,n),r=pl(un.s,To.s,n),s=pl(un.l,To.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new Je;Je.NAMES=qm;class $m extends Js{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Lm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dt=new z,wo=new Xe;class sn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Mh,this.updateRange={offset:0,count:-1},this.gpuType=fi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)wo.fromBufferAttribute(this,n),wo.applyMatrix3(e),this.setXY(n,wo.x,wo.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.applyMatrix3(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.applyMatrix4(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.applyNormalMatrix(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.transformDirection(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}set(e,n=0){return this.array.set(e,n),this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=_o(n,this.array)),n}setX(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=_o(n,this.array)),n}setY(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=_o(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=_o(n,this.array)),n}setW(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Wt(n,this.array),i=Wt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Wt(n,this.array),i=Wt(i,this.array),r=Wt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Wt(n,this.array),i=Wt(i,this.array),r=Wt(r,this.array),s=Wt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Mh&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}class Ym extends sn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Km extends sn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Xn extends sn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let PS=0;const Jt=new Et,Cl=new zt,fr=new z,jt=new Zs,os=new Zs,yt=new z;class Kn extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:PS++}),this.uuid=Ks(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(zm(e)?Km:Ym)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,n,i){return Jt.makeTranslation(e,n,i),this.applyMatrix4(Jt),this}scale(e,n,i){return Jt.makeScale(e,n,i),this.applyMatrix4(Jt),this}lookAt(e){return Cl.lookAt(e),Cl.updateMatrix(),this.applyMatrix4(Cl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fr).negate(),this.translate(fr.x,fr.y,fr.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Xn(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];jt.setFromBufferAttribute(s),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ia);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,1/0);return}if(e){const i=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];os.setFromBufferAttribute(a),this.morphTargetsRelative?(yt.addVectors(jt.min,os.min),jt.expandByPoint(yt),yt.addVectors(jt.max,os.max),jt.expandByPoint(yt)):(jt.expandByPoint(os.min),jt.expandByPoint(os.max))}jt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)yt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(yt));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)yt.fromBufferAttribute(a,c),l&&(fr.fromBufferAttribute(e,c),yt.add(fr)),r=Math.max(r,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=n.position.array,s=n.normal.array,o=n.uv.array,a=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new sn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let T=0;T<a;T++)c[T]=new z,u[T]=new z;const f=new z,d=new z,p=new z,g=new Xe,_=new Xe,m=new Xe,h=new z,v=new z;function x(T,F,H){f.fromArray(r,T*3),d.fromArray(r,F*3),p.fromArray(r,H*3),g.fromArray(o,T*2),_.fromArray(o,F*2),m.fromArray(o,H*2),d.sub(f),p.sub(f),_.sub(g),m.sub(g);const N=1/(_.x*m.y-m.x*_.y);isFinite(N)&&(h.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(N),v.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(N),c[T].add(h),c[F].add(h),c[H].add(h),u[T].add(v),u[F].add(v),u[H].add(v))}let y=this.groups;y.length===0&&(y=[{start:0,count:i.length}]);for(let T=0,F=y.length;T<F;++T){const H=y[T],N=H.start,U=H.count;for(let W=N,Z=N+U;W<Z;W+=3)x(i[W+0],i[W+1],i[W+2])}const S=new z,R=new z,A=new z,P=new z;function E(T){A.fromArray(s,T*3),P.copy(A);const F=c[T];S.copy(F),S.sub(A.multiplyScalar(A.dot(F))).normalize(),R.crossVectors(P,F);const N=R.dot(u[T])<0?-1:1;l[T*4]=S.x,l[T*4+1]=S.y,l[T*4+2]=S.z,l[T*4+3]=N}for(let T=0,F=y.length;T<F;++T){const H=y[T],N=H.start,U=H.count;for(let W=N,Z=N+U;W<Z;W+=3)E(i[W+0]),E(i[W+1]),E(i[W+2])}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new sn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new z,s=new z,o=new z,a=new z,l=new z,c=new z,u=new z,f=new z;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,_),o.fromBufferAttribute(n,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=n.count;d<p;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),o.fromBufferAttribute(n,d+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)yt.fromBufferAttribute(e,n),yt.normalize(),e.setXYZ(n,yt.x,yt.y,yt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,d=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let h=0;h<u;h++)d[g++]=c[p++]}return new sn(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Kn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const d=c[u],p=e(d,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uh=new Et,Pi=new Xm,Ao=new Ia,Nh=new z,hr=new z,dr=new z,pr=new z,Pl=new z,Ro=new z,Co=new Xe,Po=new Xe,Lo=new Xe,Oh=new z,Fh=new z,Bh=new z,Do=new z,Io=new z;class hi extends zt{constructor(e=new Kn,n=new $m){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Ro.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(Pl.fromBufferAttribute(f,e),o?Ro.addScaledVector(Pl,u):Ro.addScaledVector(Pl.sub(n),u))}n.add(Ro)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ao.copy(i.boundingSphere),Ao.applyMatrix4(s),Pi.copy(e.ray).recast(e.near),!(Ao.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Ao,Nh)===null||Pi.origin.distanceToSquared(Nh)>(e.far-e.near)**2))&&(Uh.copy(s).invert(),Pi.copy(e.ray).applyMatrix4(Uh),!(i.boundingBox!==null&&Pi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Pi)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],h=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,S=x;y<S;y+=3){const R=a.getX(y),A=a.getX(y+1),P=a.getX(y+2);r=Uo(this,h,e,i,c,u,f,R,A,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,h=_;m<h;m+=3){const v=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);r=Uo(this,o,e,i,c,u,f,v,x,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],h=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,S=x;y<S;y+=3){const R=y,A=y+1,P=y+2;r=Uo(this,h,e,i,c,u,f,R,A,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,h=_;m<h;m+=3){const v=m,x=m+1,y=m+2;r=Uo(this,o,e,i,c,u,f,v,x,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function LS(t,e,n,i,r,s,o,a){let l;if(e.side===kt?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===yi,a),l===null)return null;Io.copy(a),Io.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Io);return c<n.near||c>n.far?null:{distance:c,point:Io.clone(),object:t}}function Uo(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,hr),t.getVertexPosition(l,dr),t.getVertexPosition(c,pr);const u=LS(t,e,n,i,hr,dr,pr,Do);if(u){r&&(Co.fromBufferAttribute(r,a),Po.fromBufferAttribute(r,l),Lo.fromBufferAttribute(r,c),u.uv=fn.getInterpolation(Do,hr,dr,pr,Co,Po,Lo,new Xe)),s&&(Co.fromBufferAttribute(s,a),Po.fromBufferAttribute(s,l),Lo.fromBufferAttribute(s,c),u.uv1=fn.getInterpolation(Do,hr,dr,pr,Co,Po,Lo,new Xe),u.uv2=u.uv1),o&&(Oh.fromBufferAttribute(o,a),Fh.fromBufferAttribute(o,l),Bh.fromBufferAttribute(o,c),u.normal=fn.getInterpolation(Do,hr,dr,pr,Oh,Fh,Bh,new z),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new z,materialIndex:0};fn.getNormal(hr,dr,pr,f.normal),u.face=f}return u}class Qs extends Kn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let d=0,p=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Xn(c,3)),this.setAttribute("normal",new Xn(u,3)),this.setAttribute("uv",new Xn(f,2));function g(_,m,h,v,x,y,S,R,A,P,E){const T=y/A,F=S/P,H=y/2,N=S/2,U=R/2,W=A+1,Z=P+1;let $=0,Y=0;const he=new z;for(let de=0;de<Z;de++){const X=de*F-N;for(let Q=0;Q<W;Q++){const _e=Q*T-H;he[_]=_e*v,he[m]=X*x,he[h]=U,c.push(he.x,he.y,he.z),he[_]=0,he[m]=0,he[h]=R>0?1:-1,u.push(he.x,he.y,he.z),f.push(Q/A),f.push(1-de/P),$+=1}}for(let de=0;de<P;de++)for(let X=0;X<A;X++){const Q=d+X+W*de,_e=d+X+W*(de+1),ge=d+(X+1)+W*(de+1),ye=d+(X+1)+W*de;l.push(Q,_e,ye),l.push(_e,ge,ye),Y+=6}a.addGroup(p,Y,E),p+=Y,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Wr(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Dt(t){const e={};for(let n=0;n<t.length;n++){const i=Wr(t[n]);for(const r in i)e[r]=i[r]}return e}function DS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Zm(t){return t.getRenderTarget()===null?t.outputColorSpace:Rn}const IS={clone:Wr,merge:Dt};var US=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,NS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class $i extends Js{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=US,this.fragmentShader=NS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wr(e.uniforms),this.uniformsGroups=DS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Jm extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=Gn}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(-n[8],-n[9],-n[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class tn extends Jm{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=bc*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(dl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bc*2*Math.atan(Math.tan(dl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(dl*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const mr=-90,gr=1;class OS extends zt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null;const r=new tn(mr,gr,e,n);r.layers=this.layers,this.add(r);const s=new tn(mr,gr,e,n);s.layers=this.layers,this.add(s);const o=new tn(mr,gr,e,n);o.layers=this.layers,this.add(o);const a=new tn(mr,gr,e,n);a.layers=this.layers,this.add(a);const l=new tn(mr,gr,e,n);l.layers=this.layers,this.add(l);const c=new tn(mr,gr,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===Gn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ha)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const i=this.renderTarget;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,o,a,l,c]=this.children,u=e.getRenderTarget(),f=e.toneMapping,d=e.xr.enabled;e.toneMapping=Wn,e.xr.enabled=!1;const p=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0),e.render(n,r),e.setRenderTarget(i,1),e.render(n,s),e.setRenderTarget(i,2),e.render(n,o),e.setRenderTarget(i,3),e.render(n,a),e.setRenderTarget(i,4),e.render(n,l),i.texture.generateMipmaps=p,e.setRenderTarget(i,5),e.render(n,c),e.setRenderTarget(u),e.toneMapping=f,e.xr.enabled=d,i.texture.needsPMREMUpdate=!0}}class Qm extends Kt{constructor(e,n,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:zr,super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class FS extends ji{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];n.encoding!==void 0&&(Ms("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Vi?Ge:Wi),this.texture=new Qm(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:en}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Qs(5,5,5),s=new $i({name:"CubemapFromEquirect",uniforms:Wr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:kt,blending:_i});s.uniforms.tEquirect.value=n;const o=new hi(r,s),a=n.minFilter;return n.minFilter===Fs&&(n.minFilter=en),new OS(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const Ll=new z,BS=new z,HS=new Ve;class Di{constructor(e=new z(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Ll.subVectors(i,n).cross(BS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Ll),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||HS.getNormalMatrix(e),r=this.coplanarPoint(Ll).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Ia,No=new z;class eg{constructor(e=new Di,n=new Di,i=new Di,r=new Di,s=new Di,o=new Di){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Gn){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],f=r[6],d=r[7],p=r[8],g=r[9],_=r[10],m=r[11],h=r[12],v=r[13],x=r[14],y=r[15];if(i[0].setComponents(l-s,d-c,m-p,y-h).normalize(),i[1].setComponents(l+s,d+c,m+p,y+h).normalize(),i[2].setComponents(l+o,d+u,m+g,y+v).normalize(),i[3].setComponents(l-o,d-u,m-g,y-v).normalize(),i[4].setComponents(l-a,d-f,m-_,y-x).normalize(),n===Gn)i[5].setComponents(l+a,d+f,m+_,y+x).normalize();else if(n===ha)i[5].setComponents(a,f,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Li.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){return Li.center.set(0,0,0),Li.radius=.7071067811865476,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(No.x=r.normal.x>0?e.max.x:e.min.x,No.y=r.normal.y>0?e.max.y:e.min.y,No.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(No)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function tg(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function kS(t,e){const n=e.isWebGL2,i=new WeakMap;function r(c,u){const f=c.array,d=c.usage,p=t.createBuffer();t.bindBuffer(u,p),t.bufferData(u,f,d),c.onUploadCallback();let g;if(f instanceof Float32Array)g=t.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(n)g=t.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=t.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=t.SHORT;else if(f instanceof Uint32Array)g=t.UNSIGNED_INT;else if(f instanceof Int32Array)g=t.INT;else if(f instanceof Int8Array)g=t.BYTE;else if(f instanceof Uint8Array)g=t.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:p,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version}}function s(c,u,f){const d=u.array,p=u.updateRange;t.bindBuffer(f,c),p.count===-1?t.bufferSubData(f,0,d):(n?t.bufferSubData(f,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):t.bufferSubData(f,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),u.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(t.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const d=i.get(c);(!d||d.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=i.get(c);f===void 0?i.set(c,r(c,u)):f.version<c.version&&(s(f.buffer,c,u),f.version=c.version)}return{get:o,remove:a,update:l}}class _u extends Kn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,d=n/l,p=[],g=[],_=[],m=[];for(let h=0;h<u;h++){const v=h*d-o;for(let x=0;x<c;x++){const y=x*f-s;g.push(y,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-h/l)}}for(let h=0;h<l;h++)for(let v=0;v<a;v++){const x=v+c*h,y=v+c*(h+1),S=v+1+c*(h+1),R=v+1+c*h;p.push(x,y,R),p.push(y,S,R)}this.setIndex(p),this.setAttribute("position",new Xn(g,3)),this.setAttribute("normal",new Xn(_,3)),this.setAttribute("uv",new Xn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _u(e.width,e.height,e.widthSegments,e.heightSegments)}}var zS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,GS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,VS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,WS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,XS=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,jS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$S=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,YS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,KS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ZS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,JS=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			 return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,QS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = dFdx( surf_pos.xyz );
		vec3 vSigmaY = dFdy( surf_pos.xyz );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,eb=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,tb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ib=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,sb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ob=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,ab=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,lb=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cb=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ub=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,fb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,db=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mb="gl_FragColor = linearToOutputTexel( gl_FragColor );",gb=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_b=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,vb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xb=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yb=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mb=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Eb=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bb=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Tb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wb=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ab=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Rb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cb=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Pb=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lb=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Db=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ib=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ub=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ob=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fb=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	anisotropyV /= material.anisotropy;
	material.anisotropy = saturate( material.anisotropy );
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x - tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x + tbn[ 0 ] * anisotropyV.y;
#endif`,Bb=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hb=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometry.viewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,kb=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometry.viewDir, geometry.normal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zb=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,Gb=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Vb=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wb=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Xb=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,jb=`#ifdef USE_MAP
	diffuseColor *= texture2D( map, vMapUv );
#endif`,qb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$b=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yb=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zb=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jb=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,eT=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,tT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,nT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 geometryNormal = normal;`,iT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,oT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,aT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,lT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,cT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,uT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,fT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,pT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_T=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,MT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ET=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ST=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,TT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,wT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,AT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,RT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,CT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,PT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,LT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,DT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,IT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,UT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,NT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,OT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,FT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const BT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,HT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,GT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,VT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,WT=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,XT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,jT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,qT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$T=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,YT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,KT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ZT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,JT=`#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,QT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ew=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tw=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nw=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,iw=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rw=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,sw=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ow=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,aw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cw=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uw=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fw=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hw=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,dw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pw=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_w=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ze={alphahash_fragment:zS,alphahash_pars_fragment:GS,alphamap_fragment:VS,alphamap_pars_fragment:WS,alphatest_fragment:XS,alphatest_pars_fragment:jS,aomap_fragment:qS,aomap_pars_fragment:$S,begin_vertex:YS,beginnormal_vertex:KS,bsdfs:ZS,iridescence_fragment:JS,bumpmap_pars_fragment:QS,clipping_planes_fragment:eb,clipping_planes_pars_fragment:tb,clipping_planes_pars_vertex:nb,clipping_planes_vertex:ib,color_fragment:rb,color_pars_fragment:sb,color_pars_vertex:ob,color_vertex:ab,common:lb,cube_uv_reflection_fragment:cb,defaultnormal_vertex:ub,displacementmap_pars_vertex:fb,displacementmap_vertex:hb,emissivemap_fragment:db,emissivemap_pars_fragment:pb,colorspace_fragment:mb,colorspace_pars_fragment:gb,envmap_fragment:_b,envmap_common_pars_fragment:vb,envmap_pars_fragment:xb,envmap_pars_vertex:yb,envmap_physical_pars_fragment:Db,envmap_vertex:Mb,fog_vertex:Eb,fog_pars_vertex:Sb,fog_fragment:bb,fog_pars_fragment:Tb,gradientmap_pars_fragment:wb,lightmap_fragment:Ab,lightmap_pars_fragment:Rb,lights_lambert_fragment:Cb,lights_lambert_pars_fragment:Pb,lights_pars_begin:Lb,lights_toon_fragment:Ib,lights_toon_pars_fragment:Ub,lights_phong_fragment:Nb,lights_phong_pars_fragment:Ob,lights_physical_fragment:Fb,lights_physical_pars_fragment:Bb,lights_fragment_begin:Hb,lights_fragment_maps:kb,lights_fragment_end:zb,logdepthbuf_fragment:Gb,logdepthbuf_pars_fragment:Vb,logdepthbuf_pars_vertex:Wb,logdepthbuf_vertex:Xb,map_fragment:jb,map_pars_fragment:qb,map_particle_fragment:$b,map_particle_pars_fragment:Yb,metalnessmap_fragment:Kb,metalnessmap_pars_fragment:Zb,morphcolor_vertex:Jb,morphnormal_vertex:Qb,morphtarget_pars_vertex:eT,morphtarget_vertex:tT,normal_fragment_begin:nT,normal_fragment_maps:iT,normal_pars_fragment:rT,normal_pars_vertex:sT,normal_vertex:oT,normalmap_pars_fragment:aT,clearcoat_normal_fragment_begin:lT,clearcoat_normal_fragment_maps:cT,clearcoat_pars_fragment:uT,iridescence_pars_fragment:fT,opaque_fragment:hT,packing:dT,premultiplied_alpha_fragment:pT,project_vertex:mT,dithering_fragment:gT,dithering_pars_fragment:_T,roughnessmap_fragment:vT,roughnessmap_pars_fragment:xT,shadowmap_pars_fragment:yT,shadowmap_pars_vertex:MT,shadowmap_vertex:ET,shadowmask_pars_fragment:ST,skinbase_vertex:bT,skinning_pars_vertex:TT,skinning_vertex:wT,skinnormal_vertex:AT,specularmap_fragment:RT,specularmap_pars_fragment:CT,tonemapping_fragment:PT,tonemapping_pars_fragment:LT,transmission_fragment:DT,transmission_pars_fragment:IT,uv_pars_fragment:UT,uv_pars_vertex:NT,uv_vertex:OT,worldpos_vertex:FT,background_vert:BT,background_frag:HT,backgroundCube_vert:kT,backgroundCube_frag:zT,cube_vert:GT,cube_frag:VT,depth_vert:WT,depth_frag:XT,distanceRGBA_vert:jT,distanceRGBA_frag:qT,equirect_vert:$T,equirect_frag:YT,linedashed_vert:KT,linedashed_frag:ZT,meshbasic_vert:JT,meshbasic_frag:QT,meshlambert_vert:ew,meshlambert_frag:tw,meshmatcap_vert:nw,meshmatcap_frag:iw,meshnormal_vert:rw,meshnormal_frag:sw,meshphong_vert:ow,meshphong_frag:aw,meshphysical_vert:lw,meshphysical_frag:cw,meshtoon_vert:uw,meshtoon_frag:fw,points_vert:hw,points_frag:dw,shadow_vert:pw,shadow_frag:mw,sprite_vert:gw,sprite_frag:_w},ve={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},bn={basic:{uniforms:Dt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Dt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Je(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Dt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Dt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Dt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Je(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Dt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Dt([ve.points,ve.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Dt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Dt([ve.common,ve.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Dt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Dt([ve.sprite,ve.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Dt([ve.common,ve.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Dt([ve.lights,ve.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};bn.physical={uniforms:Dt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const Oo={r:0,b:0,g:0};function vw(t,e,n,i,r,s,o){const a=new Je(0);let l=s===!0?0:1,c,u,f=null,d=0,p=null;function g(m,h){let v=!1,x=h.isScene===!0?h.background:null;switch(x&&x.isTexture&&(x=(h.backgroundBlurriness>0?n:e).get(x)),x===null?_(a,l):x&&x.isColor&&(_(x,1),v=!0),t.xr.getEnvironmentBlendMode()){case"opaque":v=!0;break;case"additive":i.buffers.color.setClear(0,0,0,1,o),v=!0;break;case"alpha-blend":i.buffers.color.setClear(0,0,0,0,o),v=!0;break}(t.autoClear||v)&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Da)?(u===void 0&&(u=new hi(new Qs(1,1,1),new $i({name:"BackgroundCubeMaterial",uniforms:Wr(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,A,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=h.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=h.backgroundIntensity,u.material.toneMapped=x.colorSpace!==Ge,(f!==x||d!==x.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,f=x,d=x.version,p=t.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new hi(new _u(2,2),new $i({name:"BackgroundMaterial",uniforms:Wr(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=h.backgroundIntensity,c.material.toneMapped=x.colorSpace!==Ge,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||d!==x.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,f=x,d=x.version,p=t.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,h){m.getRGB(Oo,Zm(t)),i.buffers.color.setClear(Oo.r,Oo.g,Oo.b,h,o)}return{getClearColor:function(){return a},setClearColor:function(m,h=1){a.set(m),l=h,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(a,l)},render:g}}function xw(t,e,n,i){const r=t.getParameter(t.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=m(null);let c=l,u=!1;function f(U,W,Z,$,Y){let he=!1;if(o){const de=_($,Z,W);c!==de&&(c=de,p(c.object)),he=h(U,$,Z,Y),he&&v(U,$,Z,Y)}else{const de=W.wireframe===!0;(c.geometry!==$.id||c.program!==Z.id||c.wireframe!==de)&&(c.geometry=$.id,c.program=Z.id,c.wireframe=de,he=!0)}Y!==null&&n.update(Y,t.ELEMENT_ARRAY_BUFFER),(he||u)&&(u=!1,P(U,W,Z,$),Y!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.get(Y).buffer))}function d(){return i.isWebGL2?t.createVertexArray():s.createVertexArrayOES()}function p(U){return i.isWebGL2?t.bindVertexArray(U):s.bindVertexArrayOES(U)}function g(U){return i.isWebGL2?t.deleteVertexArray(U):s.deleteVertexArrayOES(U)}function _(U,W,Z){const $=Z.wireframe===!0;let Y=a[U.id];Y===void 0&&(Y={},a[U.id]=Y);let he=Y[W.id];he===void 0&&(he={},Y[W.id]=he);let de=he[$];return de===void 0&&(de=m(d()),he[$]=de),de}function m(U){const W=[],Z=[],$=[];for(let Y=0;Y<r;Y++)W[Y]=0,Z[Y]=0,$[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:W,enabledAttributes:Z,attributeDivisors:$,object:U,attributes:{},index:null}}function h(U,W,Z,$){const Y=c.attributes,he=W.attributes;let de=0;const X=Z.getAttributes();for(const Q in X)if(X[Q].location>=0){const ge=Y[Q];let ye=he[Q];if(ye===void 0&&(Q==="instanceMatrix"&&U.instanceMatrix&&(ye=U.instanceMatrix),Q==="instanceColor"&&U.instanceColor&&(ye=U.instanceColor)),ge===void 0||ge.attribute!==ye||ye&&ge.data!==ye.data)return!0;de++}return c.attributesNum!==de||c.index!==$}function v(U,W,Z,$){const Y={},he=W.attributes;let de=0;const X=Z.getAttributes();for(const Q in X)if(X[Q].location>=0){let ge=he[Q];ge===void 0&&(Q==="instanceMatrix"&&U.instanceMatrix&&(ge=U.instanceMatrix),Q==="instanceColor"&&U.instanceColor&&(ge=U.instanceColor));const ye={};ye.attribute=ge,ge&&ge.data&&(ye.data=ge.data),Y[Q]=ye,de++}c.attributes=Y,c.attributesNum=de,c.index=$}function x(){const U=c.newAttributes;for(let W=0,Z=U.length;W<Z;W++)U[W]=0}function y(U){S(U,0)}function S(U,W){const Z=c.newAttributes,$=c.enabledAttributes,Y=c.attributeDivisors;Z[U]=1,$[U]===0&&(t.enableVertexAttribArray(U),$[U]=1),Y[U]!==W&&((i.isWebGL2?t:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,W),Y[U]=W)}function R(){const U=c.newAttributes,W=c.enabledAttributes;for(let Z=0,$=W.length;Z<$;Z++)W[Z]!==U[Z]&&(t.disableVertexAttribArray(Z),W[Z]=0)}function A(U,W,Z,$,Y,he,de){de===!0?t.vertexAttribIPointer(U,W,Z,Y,he):t.vertexAttribPointer(U,W,Z,$,Y,he)}function P(U,W,Z,$){if(i.isWebGL2===!1&&(U.isInstancedMesh||$.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;x();const Y=$.attributes,he=Z.getAttributes(),de=W.defaultAttributeValues;for(const X in he){const Q=he[X];if(Q.location>=0){let _e=Y[X];if(_e===void 0&&(X==="instanceMatrix"&&U.instanceMatrix&&(_e=U.instanceMatrix),X==="instanceColor"&&U.instanceColor&&(_e=U.instanceColor)),_e!==void 0){const ge=_e.normalized,ye=_e.itemSize,Ae=n.get(_e);if(Ae===void 0)continue;const j=Ae.buffer,oe=Ae.type,ce=Ae.bytesPerElement,Ee=i.isWebGL2===!0&&(oe===t.INT||oe===t.UNSIGNED_INT||_e.gpuType===Im);if(_e.isInterleavedBufferAttribute){const we=_e.data,M=we.stride,D=_e.offset;if(we.isInstancedInterleavedBuffer){for(let I=0;I<Q.locationSize;I++)S(Q.location+I,we.meshPerAttribute);U.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=we.meshPerAttribute*we.count)}else for(let I=0;I<Q.locationSize;I++)y(Q.location+I);t.bindBuffer(t.ARRAY_BUFFER,j);for(let I=0;I<Q.locationSize;I++)A(Q.location+I,ye/Q.locationSize,oe,ge,M*ce,(D+ye/Q.locationSize*I)*ce,Ee)}else{if(_e.isInstancedBufferAttribute){for(let we=0;we<Q.locationSize;we++)S(Q.location+we,_e.meshPerAttribute);U.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let we=0;we<Q.locationSize;we++)y(Q.location+we);t.bindBuffer(t.ARRAY_BUFFER,j);for(let we=0;we<Q.locationSize;we++)A(Q.location+we,ye/Q.locationSize,oe,ge,ye*ce,ye/Q.locationSize*we*ce,Ee)}}else if(de!==void 0){const ge=de[X];if(ge!==void 0)switch(ge.length){case 2:t.vertexAttrib2fv(Q.location,ge);break;case 3:t.vertexAttrib3fv(Q.location,ge);break;case 4:t.vertexAttrib4fv(Q.location,ge);break;default:t.vertexAttrib1fv(Q.location,ge)}}}}R()}function E(){H();for(const U in a){const W=a[U];for(const Z in W){const $=W[Z];for(const Y in $)g($[Y].object),delete $[Y];delete W[Z]}delete a[U]}}function T(U){if(a[U.id]===void 0)return;const W=a[U.id];for(const Z in W){const $=W[Z];for(const Y in $)g($[Y].object),delete $[Y];delete W[Z]}delete a[U.id]}function F(U){for(const W in a){const Z=a[W];if(Z[U.id]===void 0)continue;const $=Z[U.id];for(const Y in $)g($[Y].object),delete $[Y];delete Z[U.id]}}function H(){N(),u=!0,c!==l&&(c=l,p(c.object))}function N(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:H,resetDefaultState:N,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:F,initAttributes:x,enableAttribute:y,disableUnusedAttributes:R}}function yw(t,e,n,i){const r=i.isWebGL2;let s;function o(c){s=c}function a(c,u){t.drawArrays(s,c,u),n.update(u,s,1)}function l(c,u,f){if(f===0)return;let d,p;if(r)d=t,p="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),p="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[p](s,c,u,f),n.update(u,s,f)}this.setMode=o,this.render=a,this.renderInstances=l}function Mw(t,e,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&t.constructor.name==="WebGL2RenderingContext";let a=n.precision!==void 0?n.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),u=n.logarithmicDepthBuffer===!0,f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),d=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),_=t.getParameter(t.MAX_VERTEX_ATTRIBS),m=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),h=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,y=o||e.has("OES_texture_float"),S=x&&y,R=o?t.getParameter(t.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:h,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:y,floatVertexTextures:S,maxSamples:R}}function Ew(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Di,a=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||i!==0||r;return r=d,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){n=u(f,d,0)},this.setState=function(f,d,p){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,h=t.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const v=s?0:i,x=v*4;let y=h.clippingState||null;l.value=y,y=u(g,d,x,p);for(let S=0;S!==x;++S)y[S]=n[S];h.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,d,p,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const h=p+_*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<h)&&(m=new Float32Array(h));for(let x=0,y=p;x!==_;++x,y+=4)o.copy(f[x]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Sw(t){let e=new WeakMap;function n(o,a){return a===xc?o.mapping=zr:a===yc&&(o.mapping=Gr),o}function i(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const a=o.mapping;if(a===xc||a===yc)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new FS(l.height/2);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class bw extends Jm{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const br=4,Hh=[.125,.215,.35,.446,.526,.582],Oi=20,Dl=new bw,kh=new Je;let Il=null;const Ii=(1+Math.sqrt(5))/2,_r=1/Ii,zh=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,Ii,_r),new z(0,Ii,-_r),new z(_r,0,Ii),new z(-_r,0,Ii),new z(Ii,_r,0),new z(-Ii,_r,0)];class Gh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Il=this._renderer.getRenderTarget(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Il),e.scissorTest=!1,Fo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===zr||e.mapping===Gr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Il=this._renderer.getRenderTarget();const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:en,minFilter:en,generateMipmaps:!1,type:Bs,format:mn,colorSpace:Rn,depthBuffer:!1},r=Vh(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vh(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Tw(s)),this._blurMaterial=ww(s,e,n)}return r}_compileMaterial(e){const n=new hi(this._lodPlanes[0],e);this._renderer.compile(n,Dl)}_sceneToCubeUV(e,n,i,r){const a=new tn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(kh),u.toneMapping=Wn,u.autoClear=!1;const p=new $m({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1}),g=new hi(new Qs,p);let _=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(kh),_=!0);for(let h=0;h<6;h++){const v=h%3;v===0?(a.up.set(0,l[h],0),a.lookAt(c[h],0,0)):v===1?(a.up.set(0,0,l[h]),a.lookAt(0,c[h],0)):(a.up.set(0,l[h],0),a.lookAt(0,0,c[h]));const x=this._cubeSize;Fo(r,v*x,h>2?x:0,x,x),u.setRenderTarget(r),_&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===zr||e.mapping===Gr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wh());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new hi(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Fo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Dl)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=zh[(r-1)%zh.length];this._blur(e,r-1,r,s,o)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new hi(this._lodPlanes[r],c),d=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Oi-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):Oi;m>Oi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Oi}`);const h=[];let v=0;for(let A=0;A<Oi;++A){const P=A/_,E=Math.exp(-P*P/2);h.push(E),A===0?v+=E:A<m&&(v+=2*E)}for(let A=0;A<h.length;A++)h[A]=h[A]/v;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=h,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const y=this._sizeLods[r],S=3*y*(r>x-br?r-x+br:0),R=4*(this._cubeSize-y);Fo(n,S,R,3*y,2*y),l.setRenderTarget(n),l.render(f,Dl)}}function Tw(t){const e=[],n=[],i=[];let r=t;const s=t-br+1+Hh.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-br?l=Hh[o-t+br-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,g=6,_=3,m=2,h=1,v=new Float32Array(_*g*p),x=new Float32Array(m*g*p),y=new Float32Array(h*g*p);for(let R=0;R<p;R++){const A=R%3*2/3-1,P=R>2?0:-1,E=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];v.set(E,_*g*R),x.set(d,m*g*R);const T=[R,R,R,R,R,R];y.set(T,h*g*R)}const S=new Kn;S.setAttribute("position",new sn(v,_)),S.setAttribute("uv",new sn(x,m)),S.setAttribute("faceIndex",new sn(y,h)),e.push(S),r>br&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Vh(t,e,n){const i=new ji(t,e,n);return i.texture.mapping=Da,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function ww(t,e,n){const i=new Float32Array(Oi),r=new z(0,1,0);return new $i({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function Wh(){return new $i({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function Xh(){return new $i({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function vu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Aw(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===xc||l===yc,u=l===zr||l===Gr;if(c||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=e.get(a);return n===null&&(n=new Gh(t)),f=c?n.fromEquirectangular(a,f):n.fromCubemap(a,f),e.set(a,f),f.texture}else{if(e.has(a))return e.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||u&&f&&r(f)){n===null&&(n=new Gh(t));const d=c?n.fromEquirectangular(a):n.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",s),d.texture}else return null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function Rw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(i){i.isWebGL2?n("EXT_color_buffer_float"):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(i){const r=n(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Cw(t,e,n,i){const r={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,h=_.length;m<h;m++)e.remove(_[m])}d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function a(f,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,n.memory.geometries++),d}function l(f){const d=f.attributes;for(const g in d)e.update(d[g],t.ARRAY_BUFFER);const p=f.morphAttributes;for(const g in p){const _=p[g];for(let m=0,h=_.length;m<h;m++)e.update(_[m],t.ARRAY_BUFFER)}}function c(f){const d=[],p=f.index,g=f.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let x=0,y=v.length;x<y;x+=3){const S=v[x+0],R=v[x+1],A=v[x+2];d.push(S,R,R,A,A,S)}}else{const v=g.array;_=g.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const S=x+0,R=x+1,A=x+2;d.push(S,R,R,A,A,S)}}const m=new(zm(d)?Km:Ym)(d,1);m.version=_;const h=s.get(f);h&&e.remove(h),s.set(f,m)}function u(f){const d=s.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function Pw(t,e,n,i){const r=i.isWebGL2;let s;function o(d){s=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function u(d,p){t.drawElements(s,p,a,d*l),n.update(p,s,1)}function f(d,p,g){if(g===0)return;let _,m;if(r)_=t,m="drawElementsInstanced";else if(_=e.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",_===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}_[m](s,p,a,d*l,g),n.update(p,s,g)}this.setMode=o,this.setIndex=c,this.render=u,this.renderInstances=f}function Lw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Dw(t,e){return t[0]-e[0]}function Iw(t,e){return Math.abs(e[1])-Math.abs(t[1])}function Uw(t,e,n){const i={},r=new Float32Array(8),s=new WeakMap,o=new bt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,u,f){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const p=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=p!==void 0?p.length:0;let _=s.get(u);if(_===void 0||_.count!==g){let U=function(){H.dispose(),s.delete(u),u.removeEventListener("dispose",U)};_!==void 0&&_.texture.dispose();const v=u.morphAttributes.position!==void 0,x=u.morphAttributes.normal!==void 0,y=u.morphAttributes.color!==void 0,S=u.morphAttributes.position||[],R=u.morphAttributes.normal||[],A=u.morphAttributes.color||[];let P=0;v===!0&&(P=1),x===!0&&(P=2),y===!0&&(P=3);let E=u.attributes.position.count*P,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const F=new Float32Array(E*T*4*g),H=new Wm(F,E,T,g);H.type=fi,H.needsUpdate=!0;const N=P*4;for(let W=0;W<g;W++){const Z=S[W],$=R[W],Y=A[W],he=E*T*4*W;for(let de=0;de<Z.count;de++){const X=de*N;v===!0&&(o.fromBufferAttribute(Z,de),F[he+X+0]=o.x,F[he+X+1]=o.y,F[he+X+2]=o.z,F[he+X+3]=0),x===!0&&(o.fromBufferAttribute($,de),F[he+X+4]=o.x,F[he+X+5]=o.y,F[he+X+6]=o.z,F[he+X+7]=0),y===!0&&(o.fromBufferAttribute(Y,de),F[he+X+8]=o.x,F[he+X+9]=o.y,F[he+X+10]=o.z,F[he+X+11]=Y.itemSize===4?o.w:1)}}_={count:g,texture:H,size:new Xe(E,T)},s.set(u,_),u.addEventListener("dispose",U)}let m=0;for(let v=0;v<d.length;v++)m+=d[v];const h=u.morphTargetsRelative?1:1-m;f.getUniforms().setValue(t,"morphTargetBaseInfluence",h),f.getUniforms().setValue(t,"morphTargetInfluences",d),f.getUniforms().setValue(t,"morphTargetsTexture",_.texture,n),f.getUniforms().setValue(t,"morphTargetsTextureSize",_.size)}else{const p=d===void 0?0:d.length;let g=i[u.id];if(g===void 0||g.length!==p){g=[];for(let x=0;x<p;x++)g[x]=[x,0];i[u.id]=g}for(let x=0;x<p;x++){const y=g[x];y[0]=x,y[1]=d[x]}g.sort(Iw);for(let x=0;x<8;x++)x<p&&g[x][1]?(a[x][0]=g[x][0],a[x][1]=g[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(Dw);const _=u.morphAttributes.position,m=u.morphAttributes.normal;let h=0;for(let x=0;x<8;x++){const y=a[x],S=y[0],R=y[1];S!==Number.MAX_SAFE_INTEGER&&R?(_&&u.getAttribute("morphTarget"+x)!==_[S]&&u.setAttribute("morphTarget"+x,_[S]),m&&u.getAttribute("morphNormal"+x)!==m[S]&&u.setAttribute("morphNormal"+x,m[S]),r[x]=R,h+=R):(_&&u.hasAttribute("morphTarget"+x)===!0&&u.deleteAttribute("morphTarget"+x),m&&u.hasAttribute("morphNormal"+x)===!0&&u.deleteAttribute("morphNormal"+x),r[x]=0)}const v=u.morphTargetsRelative?1:1-h;f.getUniforms().setValue(t,"morphTargetBaseInfluence",v),f.getUniforms().setValue(t,"morphTargetInfluences",r)}}return{update:l}}function Nw(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}const ng=new Kt,ig=new Wm,rg=new MS,sg=new Qm,jh=[],qh=[],$h=new Float32Array(16),Yh=new Float32Array(9),Kh=new Float32Array(4);function Zr(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=jh[r];if(s===void 0&&(s=new Float32Array(r),jh[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function gt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function _t(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Na(t,e){let n=qh[e];n===void 0&&(n=new Int32Array(e),qh[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Ow(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function Fw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(gt(n,e))return;t.uniform2fv(this.addr,e),_t(n,e)}}function Bw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(gt(n,e))return;t.uniform3fv(this.addr,e),_t(n,e)}}function Hw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(gt(n,e))return;t.uniform4fv(this.addr,e),_t(n,e)}}function kw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(gt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),_t(n,e)}else{if(gt(n,i))return;Kh.set(i),t.uniformMatrix2fv(this.addr,!1,Kh),_t(n,i)}}function zw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(gt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),_t(n,e)}else{if(gt(n,i))return;Yh.set(i),t.uniformMatrix3fv(this.addr,!1,Yh),_t(n,i)}}function Gw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(gt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),_t(n,e)}else{if(gt(n,i))return;$h.set(i),t.uniformMatrix4fv(this.addr,!1,$h),_t(n,i)}}function Vw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Ww(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(gt(n,e))return;t.uniform2iv(this.addr,e),_t(n,e)}}function Xw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(gt(n,e))return;t.uniform3iv(this.addr,e),_t(n,e)}}function jw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(gt(n,e))return;t.uniform4iv(this.addr,e),_t(n,e)}}function qw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function $w(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(gt(n,e))return;t.uniform2uiv(this.addr,e),_t(n,e)}}function Yw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(gt(n,e))return;t.uniform3uiv(this.addr,e),_t(n,e)}}function Kw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(gt(n,e))return;t.uniform4uiv(this.addr,e),_t(n,e)}}function Zw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2D(e||ng,r)}function Jw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||rg,r)}function Qw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||sg,r)}function eA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||ig,r)}function tA(t){switch(t){case 5126:return Ow;case 35664:return Fw;case 35665:return Bw;case 35666:return Hw;case 35674:return kw;case 35675:return zw;case 35676:return Gw;case 5124:case 35670:return Vw;case 35667:case 35671:return Ww;case 35668:case 35672:return Xw;case 35669:case 35673:return jw;case 5125:return qw;case 36294:return $w;case 36295:return Yw;case 36296:return Kw;case 35678:case 36198:case 36298:case 36306:case 35682:return Zw;case 35679:case 36299:case 36307:return Jw;case 35680:case 36300:case 36308:case 36293:return Qw;case 36289:case 36303:case 36311:case 36292:return eA}}function nA(t,e){t.uniform1fv(this.addr,e)}function iA(t,e){const n=Zr(e,this.size,2);t.uniform2fv(this.addr,n)}function rA(t,e){const n=Zr(e,this.size,3);t.uniform3fv(this.addr,n)}function sA(t,e){const n=Zr(e,this.size,4);t.uniform4fv(this.addr,n)}function oA(t,e){const n=Zr(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function aA(t,e){const n=Zr(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function lA(t,e){const n=Zr(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function cA(t,e){t.uniform1iv(this.addr,e)}function uA(t,e){t.uniform2iv(this.addr,e)}function fA(t,e){t.uniform3iv(this.addr,e)}function hA(t,e){t.uniform4iv(this.addr,e)}function dA(t,e){t.uniform1uiv(this.addr,e)}function pA(t,e){t.uniform2uiv(this.addr,e)}function mA(t,e){t.uniform3uiv(this.addr,e)}function gA(t,e){t.uniform4uiv(this.addr,e)}function _A(t,e,n){const i=this.cache,r=e.length,s=Na(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||ng,s[o])}function vA(t,e,n){const i=this.cache,r=e.length,s=Na(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||rg,s[o])}function xA(t,e,n){const i=this.cache,r=e.length,s=Na(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||sg,s[o])}function yA(t,e,n){const i=this.cache,r=e.length,s=Na(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||ig,s[o])}function MA(t){switch(t){case 5126:return nA;case 35664:return iA;case 35665:return rA;case 35666:return sA;case 35674:return oA;case 35675:return aA;case 35676:return lA;case 5124:case 35670:return cA;case 35667:case 35671:return uA;case 35668:case 35672:return fA;case 35669:case 35673:return hA;case 5125:return dA;case 36294:return pA;case 36295:return mA;case 36296:return gA;case 35678:case 36198:case 36298:case 36306:case 35682:return _A;case 35679:case 36299:case 36307:return vA;case 35680:case 36300:case 36308:case 36293:return xA;case 36289:case 36303:case 36311:case 36292:return yA}}class EA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.setValue=tA(n.type)}}class SA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.size=n.size,this.setValue=MA(n.type)}}class bA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Ul=/(\w+)(\])?(\[|\.)?/g;function Zh(t,e){t.seq.push(e),t.map[e.id]=e}function TA(t,e,n){const i=t.name,r=i.length;for(Ul.lastIndex=0;;){const s=Ul.exec(i),o=Ul.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Zh(n,c===void 0?new EA(a,t,e):new SA(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new bA(a),Zh(n,f)),n=f}}}class Wo{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);TA(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function Jh(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}let wA=0;function AA(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}function RA(t){switch(t){case Rn:return["Linear","( value )"];case Ge:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),["Linear","( value )"]}}function Qh(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+AA(t.getShaderSource(e),o)}else return r}function CA(t,e){const n=RA(e);return"vec4 "+t+"( vec4 value ) { return LinearTo"+n[0]+n[1]+"; }"}function PA(t,e){let n;switch(e){case BE:n="Linear";break;case HE:n="Reinhard";break;case kE:n="OptimizedCineon";break;case zE:n="ACESFilmic";break;case GE:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function LA(t){return[t.extensionDerivatives||t.envMapCubeUVHeight||t.bumpMap||t.normalMapTangentSpace||t.clearcoatNormalMap||t.flatShading||t.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(t.extensionFragDepth||t.logarithmicDepthBuffer)&&t.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",t.extensionDrawBuffers&&t.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(t.extensionShaderTextureLOD||t.envMap||t.transmission)&&t.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(fs).join(`
`)}function DA(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function IA(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function fs(t){return t!==""}function ed(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function td(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const UA=/^[ \t]*#include +<([\w\d./]+)>/gm;function wc(t){return t.replace(UA,OA)}const NA=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function OA(t,e){let n=ze[e];if(n===void 0){const i=NA.get(e);if(i!==void 0)n=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return wc(n)}const FA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nd(t){return t.replace(FA,BA)}function BA(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function id(t){let e="precision "+t.precision+` float;
precision `+t.precision+" int;";return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function HA(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Rm?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===gE?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===Bn&&(e="SHADOWMAP_TYPE_VSM"),e}function kA(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case zr:case Gr:e="ENVMAP_TYPE_CUBE";break;case Da:e="ENVMAP_TYPE_CUBE_UV";break}return e}function zA(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Gr:e="ENVMAP_MODE_REFRACTION";break}return e}function GA(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Lm:e="ENVMAP_BLENDING_MULTIPLY";break;case OE:e="ENVMAP_BLENDING_MIX";break;case FE:e="ENVMAP_BLENDING_ADD";break}return e}function VA(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function WA(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=HA(n),c=kA(n),u=zA(n),f=GA(n),d=VA(n),p=n.isWebGL2?"":LA(n),g=DA(s),_=r.createProgram();let m,h,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(fs).join(`
`),m.length>0&&(m+=`
`),h=[p,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(fs).join(`
`),h.length>0&&(h+=`
`)):(m=[id(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),h=[p,id(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Wn?"#define TONE_MAPPING":"",n.toneMapping!==Wn?ze.tonemapping_pars_fragment:"",n.toneMapping!==Wn?PA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,CA("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(fs).join(`
`)),o=wc(o),o=ed(o,n),o=td(o,n),a=wc(a),a=ed(a,n),a=td(a,n),o=nd(o),a=nd(a),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",n.glslVersion===Eh?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Eh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const x=v+m+o,y=v+h+a,S=Jh(r,r.VERTEX_SHADER,x),R=Jh(r,r.FRAGMENT_SHADER,y);if(r.attachShader(_,S),r.attachShader(_,R),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_),t.debug.checkShaderErrors){const E=r.getProgramInfoLog(_).trim(),T=r.getShaderInfoLog(S).trim(),F=r.getShaderInfoLog(R).trim();let H=!0,N=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(H=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,_,S,R);else{const U=Qh(r,S,"vertex"),W=Qh(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Program Info Log: `+E+`
`+U+`
`+W)}else E!==""?console.warn("THREE.WebGLProgram: Program Info Log:",E):(T===""||F==="")&&(N=!1);N&&(this.diagnostics={runnable:H,programLog:E,vertexShader:{log:T,prefix:m},fragmentShader:{log:F,prefix:h}})}r.deleteShader(S),r.deleteShader(R);let A;this.getUniforms=function(){return A===void 0&&(A=new Wo(r,_)),A};let P;return this.getAttributes=function(){return P===void 0&&(P=IA(r,_)),P},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=wA++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=R,this}let XA=0;class jA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new qA(e),n.set(e,i)),i}}class qA{constructor(e){this.id=XA++,this.code=e,this.usedTimes=0}}function $A(t,e,n,i,r,s,o){const a=new jm,l=new jA,c=[],u=r.isWebGL2,f=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return E===0?"uv":`uv${E}`}function m(E,T,F,H,N){const U=H.fog,W=N.geometry,Z=E.isMeshStandardMaterial?H.environment:null,$=(E.isMeshStandardMaterial?n:e).get(E.envMap||Z),Y=$&&$.mapping===Da?$.image.height:null,he=g[E.type];E.precision!==null&&(p=r.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const de=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,X=de!==void 0?de.length:0;let Q=0;W.morphAttributes.position!==void 0&&(Q=1),W.morphAttributes.normal!==void 0&&(Q=2),W.morphAttributes.color!==void 0&&(Q=3);let _e,ge,ye,Ae;if(he){const yn=bn[he];_e=yn.vertexShader,ge=yn.fragmentShader}else _e=E.vertexShader,ge=E.fragmentShader,l.update(E),ye=l.getVertexShaderID(E),Ae=l.getFragmentShaderID(E);const j=t.getRenderTarget(),oe=N.isInstancedMesh===!0,ce=!!E.map,Ee=!!E.matcap,we=!!$,M=!!E.aoMap,D=!!E.lightMap,I=!!E.bumpMap,k=!!E.normalMap,V=!!E.displacementMap,ie=!!E.emissiveMap,fe=!!E.metalnessMap,ee=!!E.roughnessMap,ue=E.anisotropy>0,le=E.clearcoat>0,be=E.iridescence>0,w=E.sheen>0,b=E.transmission>0,B=ue&&!!E.anisotropyMap,te=le&&!!E.clearcoatMap,ae=le&&!!E.clearcoatNormalMap,L=le&&!!E.clearcoatRoughnessMap,ne=be&&!!E.iridescenceMap,pe=be&&!!E.iridescenceThicknessMap,K=w&&!!E.sheenColorMap,Re=w&&!!E.sheenRoughnessMap,Pe=!!E.specularMap,Le=!!E.specularColorMap,xe=!!E.specularIntensityMap,Me=b&&!!E.transmissionMap,Ue=b&&!!E.thicknessMap,je=!!E.gradientMap,O=!!E.alphaMap,Se=E.alphaTest>0,J=!!E.alphaHash,me=!!E.extensions,Te=!!W.attributes.uv1,Ze=!!W.attributes.uv2,ot=!!W.attributes.uv3;return{isWebGL2:u,shaderID:he,shaderType:E.type,shaderName:E.name,vertexShader:_e,fragmentShader:ge,defines:E.defines,customVertexShaderID:ye,customFragmentShaderID:Ae,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,instancing:oe,instancingColor:oe&&N.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:j===null?t.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Rn,map:ce,matcap:Ee,envMap:we,envMapMode:we&&$.mapping,envMapCubeUVHeight:Y,aoMap:M,lightMap:D,bumpMap:I,normalMap:k,displacementMap:d&&V,emissiveMap:ie,normalMapObjectSpace:k&&E.normalMapType===nS,normalMapTangentSpace:k&&E.normalMapType===tS,metalnessMap:fe,roughnessMap:ee,anisotropy:ue,anisotropyMap:B,clearcoat:le,clearcoatMap:te,clearcoatNormalMap:ae,clearcoatRoughnessMap:L,iridescence:be,iridescenceMap:ne,iridescenceThicknessMap:pe,sheen:w,sheenColorMap:K,sheenRoughnessMap:Re,specularMap:Pe,specularColorMap:Le,specularIntensityMap:xe,transmission:b,transmissionMap:Me,thicknessMap:Ue,gradientMap:je,opaque:E.transparent===!1&&E.blending===Ir,alphaMap:O,alphaTest:Se,alphaHash:J,combine:E.combine,mapUv:ce&&_(E.map.channel),aoMapUv:M&&_(E.aoMap.channel),lightMapUv:D&&_(E.lightMap.channel),bumpMapUv:I&&_(E.bumpMap.channel),normalMapUv:k&&_(E.normalMap.channel),displacementMapUv:V&&_(E.displacementMap.channel),emissiveMapUv:ie&&_(E.emissiveMap.channel),metalnessMapUv:fe&&_(E.metalnessMap.channel),roughnessMapUv:ee&&_(E.roughnessMap.channel),anisotropyMapUv:B&&_(E.anisotropyMap.channel),clearcoatMapUv:te&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:ae&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:L&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:K&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:Re&&_(E.sheenRoughnessMap.channel),specularMapUv:Pe&&_(E.specularMap.channel),specularColorMapUv:Le&&_(E.specularColorMap.channel),specularIntensityMapUv:xe&&_(E.specularIntensityMap.channel),transmissionMapUv:Me&&_(E.transmissionMap.channel),thicknessMapUv:Ue&&_(E.thicknessMap.channel),alphaMapUv:O&&_(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(k||ue),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,vertexUv1s:Te,vertexUv2s:Ze,vertexUv3s:ot,pointsUvs:N.isPoints===!0&&!!W.attributes.uv&&(ce||O),fog:!!U,useFog:E.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:N.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:X,morphTextureStride:Q,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:t.shadowMap.enabled&&F.length>0,shadowMapType:t.shadowMap.type,toneMapping:E.toneMapped?t.toneMapping:Wn,useLegacyLights:t.useLegacyLights,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===zn,flipSided:E.side===kt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionDerivatives:me&&E.extensions.derivatives===!0,extensionFragDepth:me&&E.extensions.fragDepth===!0,extensionDrawBuffers:me&&E.extensions.drawBuffers===!0,extensionShaderTextureLOD:me&&E.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),customProgramCacheKey:E.customProgramCacheKey()}}function h(E){const T=[];if(E.shaderID?T.push(E.shaderID):(T.push(E.customVertexShaderID),T.push(E.customFragmentShaderID)),E.defines!==void 0)for(const F in E.defines)T.push(F),T.push(E.defines[F]);return E.isRawShaderMaterial===!1&&(v(T,E),x(T,E),T.push(t.outputColorSpace)),T.push(E.customProgramCacheKey),T.join()}function v(E,T){E.push(T.precision),E.push(T.outputColorSpace),E.push(T.envMapMode),E.push(T.envMapCubeUVHeight),E.push(T.mapUv),E.push(T.alphaMapUv),E.push(T.lightMapUv),E.push(T.aoMapUv),E.push(T.bumpMapUv),E.push(T.normalMapUv),E.push(T.displacementMapUv),E.push(T.emissiveMapUv),E.push(T.metalnessMapUv),E.push(T.roughnessMapUv),E.push(T.anisotropyMapUv),E.push(T.clearcoatMapUv),E.push(T.clearcoatNormalMapUv),E.push(T.clearcoatRoughnessMapUv),E.push(T.iridescenceMapUv),E.push(T.iridescenceThicknessMapUv),E.push(T.sheenColorMapUv),E.push(T.sheenRoughnessMapUv),E.push(T.specularMapUv),E.push(T.specularColorMapUv),E.push(T.specularIntensityMapUv),E.push(T.transmissionMapUv),E.push(T.thicknessMapUv),E.push(T.combine),E.push(T.fogExp2),E.push(T.sizeAttenuation),E.push(T.morphTargetsCount),E.push(T.morphAttributeCount),E.push(T.numDirLights),E.push(T.numPointLights),E.push(T.numSpotLights),E.push(T.numSpotLightMaps),E.push(T.numHemiLights),E.push(T.numRectAreaLights),E.push(T.numDirLightShadows),E.push(T.numPointLightShadows),E.push(T.numSpotLightShadows),E.push(T.numSpotLightShadowsWithMaps),E.push(T.shadowMapType),E.push(T.toneMapping),E.push(T.numClippingPlanes),E.push(T.numClipIntersection),E.push(T.depthPacking)}function x(E,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),E.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),E.push(a.mask)}function y(E){const T=g[E.type];let F;if(T){const H=bn[T];F=IS.clone(H.uniforms)}else F=E.uniforms;return F}function S(E,T){let F;for(let H=0,N=c.length;H<N;H++){const U=c[H];if(U.cacheKey===T){F=U,++F.usedTimes;break}}return F===void 0&&(F=new WA(t,T,E,s),c.push(F)),F}function R(E){if(--E.usedTimes===0){const T=c.indexOf(E);c[T]=c[c.length-1],c.pop(),E.destroy()}}function A(E){l.remove(E)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:y,acquireProgram:S,releaseProgram:R,releaseShaderCache:A,programs:c,dispose:P}}function YA(){let t=new WeakMap;function e(s){let o=t.get(s);return o===void 0&&(o={},t.set(s,o)),o}function n(s){t.delete(s)}function i(s,o,a){t.get(s)[o]=a}function r(){t=new WeakMap}return{get:e,remove:n,update:i,dispose:r}}function KA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function rd(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function sd(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(f,d,p,g,_,m){let h=t[e];return h===void 0?(h={id:f.id,object:f,geometry:d,material:p,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},t[e]=h):(h.id=f.id,h.object=f,h.geometry=d,h.material=p,h.groupOrder=g,h.renderOrder=f.renderOrder,h.z=_,h.group=m),e++,h}function a(f,d,p,g,_,m){const h=o(f,d,p,g,_,m);p.transmission>0?i.push(h):p.transparent===!0?r.push(h):n.push(h)}function l(f,d,p,g,_,m){const h=o(f,d,p,g,_,m);p.transmission>0?i.unshift(h):p.transparent===!0?r.unshift(h):n.unshift(h)}function c(f,d){n.length>1&&n.sort(f||KA),i.length>1&&i.sort(d||rd),r.length>1&&r.sort(d||rd)}function u(){for(let f=e,d=t.length;f<d;f++){const p=t[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function ZA(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new sd,t.set(i,[o])):r>=s.length?(o=new sd,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function JA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new z,color:new Je};break;case"SpotLight":n={position:new z,direction:new z,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new z,color:new Je,distance:0,decay:0};break;case"HemisphereLight":n={direction:new z,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":n={color:new Je,position:new z,halfWidth:new z,halfHeight:new z};break}return t[e.id]=n,n}}}function QA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let eR=0;function tR(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function nR(t,e){const n=new JA,i=QA(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let u=0;u<9;u++)r.probe.push(new z);const s=new z,o=new Et,a=new Et;function l(u,f){let d=0,p=0,g=0;for(let F=0;F<9;F++)r.probe[F].set(0,0,0);let _=0,m=0,h=0,v=0,x=0,y=0,S=0,R=0,A=0,P=0;u.sort(tR);const E=f===!0?Math.PI:1;for(let F=0,H=u.length;F<H;F++){const N=u[F],U=N.color,W=N.intensity,Z=N.distance,$=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)d+=U.r*W*E,p+=U.g*W*E,g+=U.b*W*E;else if(N.isLightProbe)for(let Y=0;Y<9;Y++)r.probe[Y].addScaledVector(N.sh.coefficients[Y],W);else if(N.isDirectionalLight){const Y=n.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity*E),N.castShadow){const he=N.shadow,de=i.get(N);de.shadowBias=he.bias,de.shadowNormalBias=he.normalBias,de.shadowRadius=he.radius,de.shadowMapSize=he.mapSize,r.directionalShadow[_]=de,r.directionalShadowMap[_]=$,r.directionalShadowMatrix[_]=N.shadow.matrix,y++}r.directional[_]=Y,_++}else if(N.isSpotLight){const Y=n.get(N);Y.position.setFromMatrixPosition(N.matrixWorld),Y.color.copy(U).multiplyScalar(W*E),Y.distance=Z,Y.coneCos=Math.cos(N.angle),Y.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),Y.decay=N.decay,r.spot[h]=Y;const he=N.shadow;if(N.map&&(r.spotLightMap[A]=N.map,A++,he.updateMatrices(N),N.castShadow&&P++),r.spotLightMatrix[h]=he.matrix,N.castShadow){const de=i.get(N);de.shadowBias=he.bias,de.shadowNormalBias=he.normalBias,de.shadowRadius=he.radius,de.shadowMapSize=he.mapSize,r.spotShadow[h]=de,r.spotShadowMap[h]=$,R++}h++}else if(N.isRectAreaLight){const Y=n.get(N);Y.color.copy(U).multiplyScalar(W),Y.halfWidth.set(N.width*.5,0,0),Y.halfHeight.set(0,N.height*.5,0),r.rectArea[v]=Y,v++}else if(N.isPointLight){const Y=n.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity*E),Y.distance=N.distance,Y.decay=N.decay,N.castShadow){const he=N.shadow,de=i.get(N);de.shadowBias=he.bias,de.shadowNormalBias=he.normalBias,de.shadowRadius=he.radius,de.shadowMapSize=he.mapSize,de.shadowCameraNear=he.camera.near,de.shadowCameraFar=he.camera.far,r.pointShadow[m]=de,r.pointShadowMap[m]=$,r.pointShadowMatrix[m]=N.shadow.matrix,S++}r.point[m]=Y,m++}else if(N.isHemisphereLight){const Y=n.get(N);Y.skyColor.copy(N.color).multiplyScalar(W*E),Y.groundColor.copy(N.groundColor).multiplyScalar(W*E),r.hemi[x]=Y,x++}}v>0&&(e.isWebGL2||t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_FLOAT_1,r.rectAreaLTC2=ve.LTC_FLOAT_2):t.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_HALF_1,r.rectAreaLTC2=ve.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=d,r.ambient[1]=p,r.ambient[2]=g;const T=r.hash;(T.directionalLength!==_||T.pointLength!==m||T.spotLength!==h||T.rectAreaLength!==v||T.hemiLength!==x||T.numDirectionalShadows!==y||T.numPointShadows!==S||T.numSpotShadows!==R||T.numSpotMaps!==A)&&(r.directional.length=_,r.spot.length=h,r.rectArea.length=v,r.point.length=m,r.hemi.length=x,r.directionalShadow.length=y,r.directionalShadowMap.length=y,r.pointShadow.length=S,r.pointShadowMap.length=S,r.spotShadow.length=R,r.spotShadowMap.length=R,r.directionalShadowMatrix.length=y,r.pointShadowMatrix.length=S,r.spotLightMatrix.length=R+A-P,r.spotLightMap.length=A,r.numSpotLightShadowsWithMaps=P,T.directionalLength=_,T.pointLength=m,T.spotLength=h,T.rectAreaLength=v,T.hemiLength=x,T.numDirectionalShadows=y,T.numPointShadows=S,T.numSpotShadows=R,T.numSpotMaps=A,r.version=eR++)}function c(u,f){let d=0,p=0,g=0,_=0,m=0;const h=f.matrixWorldInverse;for(let v=0,x=u.length;v<x;v++){const y=u[v];if(y.isDirectionalLight){const S=r.directional[d];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(h),d++}else if(y.isSpotLight){const S=r.spot[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(h),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(h),g++}else if(y.isRectAreaLight){const S=r.rectArea[_];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(h),a.identity(),o.copy(y.matrixWorld),o.premultiply(h),a.extractRotation(o),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){const S=r.point[p];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(h),p++}else if(y.isHemisphereLight){const S=r.hemi[m];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(h),m++}}}return{setup:l,setupView:c,state:r}}function od(t,e){const n=new nR(t,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(f){i.push(f)}function a(f){r.push(f)}function l(f){n.setup(i,f)}function c(f){n.setupView(i,f)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:n},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function iR(t,e){let n=new WeakMap;function i(s,o=0){const a=n.get(s);let l;return a===void 0?(l=new od(t,e),n.set(s,[l])):o>=a.length?(l=new od(t,e),a.push(l)):l=a[o],l}function r(){n=new WeakMap}return{get:i,dispose:r}}class rR extends Js{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=QE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sR extends Js{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const oR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,aR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function lR(t,e,n){let i=new eg;const r=new Xe,s=new Xe,o=new bt,a=new rR({depthPacking:eS}),l=new sR,c={},u=n.maxTextureSize,f={[yi]:kt,[kt]:yi,[zn]:zn},d=new $i({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:oR,fragmentShader:aR}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Kn;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new hi(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rm;let h=this.type;this.render=function(S,R,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const P=t.getRenderTarget(),E=t.getActiveCubeFace(),T=t.getActiveMipmapLevel(),F=t.state;F.setBlending(_i),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const H=h!==Bn&&this.type===Bn,N=h===Bn&&this.type!==Bn;for(let U=0,W=S.length;U<W;U++){const Z=S[U],$=Z.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;r.copy($.mapSize);const Y=$.getFrameExtents();if(r.multiply(Y),s.copy($.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/Y.x),r.x=s.x*Y.x,$.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/Y.y),r.y=s.y*Y.y,$.mapSize.y=s.y)),$.map===null||H===!0||N===!0){const de=this.type!==Bn?{minFilter:It,magFilter:It}:{};$.map!==null&&$.map.dispose(),$.map=new ji(r.x,r.y,de),$.map.texture.name=Z.name+".shadowMap",$.camera.updateProjectionMatrix()}t.setRenderTarget($.map),t.clear();const he=$.getViewportCount();for(let de=0;de<he;de++){const X=$.getViewport(de);o.set(s.x*X.x,s.y*X.y,s.x*X.z,s.y*X.w),F.viewport(o),$.updateMatrices(Z,de),i=$.getFrustum(),y(R,A,$.camera,Z,this.type)}$.isPointLightShadow!==!0&&this.type===Bn&&v($,A),$.needsUpdate=!1}h=this.type,m.needsUpdate=!1,t.setRenderTarget(P,E,T)};function v(S,R){const A=e.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new ji(r.x,r.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,t.setRenderTarget(S.mapPass),t.clear(),t.renderBufferDirect(R,null,A,d,_,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,t.setRenderTarget(S.map),t.clear(),t.renderBufferDirect(R,null,A,p,_,null)}function x(S,R,A,P){let E=null;const T=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(T!==void 0)E=T;else if(E=A.isPointLight===!0?l:a,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const F=E.uuid,H=R.uuid;let N=c[F];N===void 0&&(N={},c[F]=N);let U=N[H];U===void 0&&(U=E.clone(),N[H]=U),E=U}if(E.visible=R.visible,E.wireframe=R.wireframe,P===Bn?E.side=R.shadowSide!==null?R.shadowSide:R.side:E.side=R.shadowSide!==null?R.shadowSide:f[R.side],E.alphaMap=R.alphaMap,E.alphaTest=R.alphaTest,E.map=R.map,E.clipShadows=R.clipShadows,E.clippingPlanes=R.clippingPlanes,E.clipIntersection=R.clipIntersection,E.displacementMap=R.displacementMap,E.displacementScale=R.displacementScale,E.displacementBias=R.displacementBias,E.wireframeLinewidth=R.wireframeLinewidth,E.linewidth=R.linewidth,A.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const F=t.properties.get(E);F.light=A}return E}function y(S,R,A,P,E){if(S.visible===!1)return;if(S.layers.test(R.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&E===Bn)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const H=e.update(S),N=S.material;if(Array.isArray(N)){const U=H.groups;for(let W=0,Z=U.length;W<Z;W++){const $=U[W],Y=N[$.materialIndex];if(Y&&Y.visible){const he=x(S,Y,P,E);t.renderBufferDirect(A,null,H,he,S,$)}}}else if(N.visible){const U=x(S,N,P,E);t.renderBufferDirect(A,null,H,U,S,null)}}const F=S.children;for(let H=0,N=F.length;H<N;H++)y(F[H],R,A,P,E)}}function cR(t,e,n){const i=n.isWebGL2;function r(){let O=!1;const Se=new bt;let J=null;const me=new bt(0,0,0,0);return{setMask:function(Te){J!==Te&&!O&&(t.colorMask(Te,Te,Te,Te),J=Te)},setLocked:function(Te){O=Te},setClear:function(Te,Ze,ot,vt,yn){yn===!0&&(Te*=vt,Ze*=vt,ot*=vt),Se.set(Te,Ze,ot,vt),me.equals(Se)===!1&&(t.clearColor(Te,Ze,ot,vt),me.copy(Se))},reset:function(){O=!1,J=null,me.set(-1,0,0,0)}}}function s(){let O=!1,Se=null,J=null,me=null;return{setTest:function(Te){Te?j(t.DEPTH_TEST):oe(t.DEPTH_TEST)},setMask:function(Te){Se!==Te&&!O&&(t.depthMask(Te),Se=Te)},setFunc:function(Te){if(J!==Te){switch(Te){case CE:t.depthFunc(t.NEVER);break;case PE:t.depthFunc(t.ALWAYS);break;case LE:t.depthFunc(t.LESS);break;case vc:t.depthFunc(t.LEQUAL);break;case DE:t.depthFunc(t.EQUAL);break;case IE:t.depthFunc(t.GEQUAL);break;case UE:t.depthFunc(t.GREATER);break;case NE:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}J=Te}},setLocked:function(Te){O=Te},setClear:function(Te){me!==Te&&(t.clearDepth(Te),me=Te)},reset:function(){O=!1,Se=null,J=null,me=null}}}function o(){let O=!1,Se=null,J=null,me=null,Te=null,Ze=null,ot=null,vt=null,yn=null;return{setTest:function(ct){O||(ct?j(t.STENCIL_TEST):oe(t.STENCIL_TEST))},setMask:function(ct){Se!==ct&&!O&&(t.stencilMask(ct),Se=ct)},setFunc:function(ct,Mn,Ct){(J!==ct||me!==Mn||Te!==Ct)&&(t.stencilFunc(ct,Mn,Ct),J=ct,me=Mn,Te=Ct)},setOp:function(ct,Mn,Ct){(Ze!==ct||ot!==Mn||vt!==Ct)&&(t.stencilOp(ct,Mn,Ct),Ze=ct,ot=Mn,vt=Ct)},setLocked:function(ct){O=ct},setClear:function(ct){yn!==ct&&(t.clearStencil(ct),yn=ct)},reset:function(){O=!1,Se=null,J=null,me=null,Te=null,Ze=null,ot=null,vt=null,yn=null}}}const a=new r,l=new s,c=new o,u=new WeakMap,f=new WeakMap;let d={},p={},g=new WeakMap,_=[],m=null,h=!1,v=null,x=null,y=null,S=null,R=null,A=null,P=null,E=!1,T=null,F=null,H=null,N=null,U=null;const W=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,$=0;const Y=t.getParameter(t.VERSION);Y.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(Y)[1]),Z=$>=1):Y.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),Z=$>=2);let he=null,de={};const X=t.getParameter(t.SCISSOR_BOX),Q=t.getParameter(t.VIEWPORT),_e=new bt().fromArray(X),ge=new bt().fromArray(Q);function ye(O,Se,J,me){const Te=new Uint8Array(4),Ze=t.createTexture();t.bindTexture(O,Ze),t.texParameteri(O,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(O,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let ot=0;ot<J;ot++)i&&(O===t.TEXTURE_3D||O===t.TEXTURE_2D_ARRAY)?t.texImage3D(Se,0,t.RGBA,1,1,me,0,t.RGBA,t.UNSIGNED_BYTE,Te):t.texImage2D(Se+ot,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Te);return Ze}const Ae={};Ae[t.TEXTURE_2D]=ye(t.TEXTURE_2D,t.TEXTURE_2D,1),Ae[t.TEXTURE_CUBE_MAP]=ye(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ae[t.TEXTURE_2D_ARRAY]=ye(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Ae[t.TEXTURE_3D]=ye(t.TEXTURE_3D,t.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),j(t.DEPTH_TEST),l.setFunc(vc),V(!1),ie(Xf),j(t.CULL_FACE),I(_i);function j(O){d[O]!==!0&&(t.enable(O),d[O]=!0)}function oe(O){d[O]!==!1&&(t.disable(O),d[O]=!1)}function ce(O,Se){return p[O]!==Se?(t.bindFramebuffer(O,Se),p[O]=Se,i&&(O===t.DRAW_FRAMEBUFFER&&(p[t.FRAMEBUFFER]=Se),O===t.FRAMEBUFFER&&(p[t.DRAW_FRAMEBUFFER]=Se)),!0):!1}function Ee(O,Se){let J=_,me=!1;if(O)if(J=g.get(Se),J===void 0&&(J=[],g.set(Se,J)),O.isWebGLMultipleRenderTargets){const Te=O.texture;if(J.length!==Te.length||J[0]!==t.COLOR_ATTACHMENT0){for(let Ze=0,ot=Te.length;Ze<ot;Ze++)J[Ze]=t.COLOR_ATTACHMENT0+Ze;J.length=Te.length,me=!0}}else J[0]!==t.COLOR_ATTACHMENT0&&(J[0]=t.COLOR_ATTACHMENT0,me=!0);else J[0]!==t.BACK&&(J[0]=t.BACK,me=!0);me&&(n.isWebGL2?t.drawBuffers(J):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(J))}function we(O){return m!==O?(t.useProgram(O),m=O,!0):!1}const M={[yr]:t.FUNC_ADD,[vE]:t.FUNC_SUBTRACT,[xE]:t.FUNC_REVERSE_SUBTRACT};if(i)M[Yf]=t.MIN,M[Kf]=t.MAX;else{const O=e.get("EXT_blend_minmax");O!==null&&(M[Yf]=O.MIN_EXT,M[Kf]=O.MAX_EXT)}const D={[yE]:t.ZERO,[ME]:t.ONE,[EE]:t.SRC_COLOR,[Cm]:t.SRC_ALPHA,[RE]:t.SRC_ALPHA_SATURATE,[wE]:t.DST_COLOR,[bE]:t.DST_ALPHA,[SE]:t.ONE_MINUS_SRC_COLOR,[Pm]:t.ONE_MINUS_SRC_ALPHA,[AE]:t.ONE_MINUS_DST_COLOR,[TE]:t.ONE_MINUS_DST_ALPHA};function I(O,Se,J,me,Te,Ze,ot,vt){if(O===_i){h===!0&&(oe(t.BLEND),h=!1);return}if(h===!1&&(j(t.BLEND),h=!0),O!==_E){if(O!==v||vt!==E){if((x!==yr||R!==yr)&&(t.blendEquation(t.FUNC_ADD),x=yr,R=yr),vt)switch(O){case Ir:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case jf:t.blendFunc(t.ONE,t.ONE);break;case qf:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case $f:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Ir:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case jf:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case qf:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case $f:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}y=null,S=null,A=null,P=null,v=O,E=vt}return}Te=Te||Se,Ze=Ze||J,ot=ot||me,(Se!==x||Te!==R)&&(t.blendEquationSeparate(M[Se],M[Te]),x=Se,R=Te),(J!==y||me!==S||Ze!==A||ot!==P)&&(t.blendFuncSeparate(D[J],D[me],D[Ze],D[ot]),y=J,S=me,A=Ze,P=ot),v=O,E=!1}function k(O,Se){O.side===zn?oe(t.CULL_FACE):j(t.CULL_FACE);let J=O.side===kt;Se&&(J=!J),V(J),O.blending===Ir&&O.transparent===!1?I(_i):I(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.premultipliedAlpha),l.setFunc(O.depthFunc),l.setTest(O.depthTest),l.setMask(O.depthWrite),a.setMask(O.colorWrite);const me=O.stencilWrite;c.setTest(me),me&&(c.setMask(O.stencilWriteMask),c.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),c.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ee(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?j(t.SAMPLE_ALPHA_TO_COVERAGE):oe(t.SAMPLE_ALPHA_TO_COVERAGE)}function V(O){T!==O&&(O?t.frontFace(t.CW):t.frontFace(t.CCW),T=O)}function ie(O){O!==pE?(j(t.CULL_FACE),O!==F&&(O===Xf?t.cullFace(t.BACK):O===mE?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):oe(t.CULL_FACE),F=O}function fe(O){O!==H&&(Z&&t.lineWidth(O),H=O)}function ee(O,Se,J){O?(j(t.POLYGON_OFFSET_FILL),(N!==Se||U!==J)&&(t.polygonOffset(Se,J),N=Se,U=J)):oe(t.POLYGON_OFFSET_FILL)}function ue(O){O?j(t.SCISSOR_TEST):oe(t.SCISSOR_TEST)}function le(O){O===void 0&&(O=t.TEXTURE0+W-1),he!==O&&(t.activeTexture(O),he=O)}function be(O,Se,J){J===void 0&&(he===null?J=t.TEXTURE0+W-1:J=he);let me=de[J];me===void 0&&(me={type:void 0,texture:void 0},de[J]=me),(me.type!==O||me.texture!==Se)&&(he!==J&&(t.activeTexture(J),he=J),t.bindTexture(O,Se||Ae[O]),me.type=O,me.texture=Se)}function w(){const O=de[he];O!==void 0&&O.type!==void 0&&(t.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function b(){try{t.compressedTexImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function B(){try{t.compressedTexImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function te(){try{t.texSubImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ae(){try{t.texSubImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function L(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ne(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function pe(){try{t.texStorage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function K(){try{t.texStorage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Re(){try{t.texImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pe(){try{t.texImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Le(O){_e.equals(O)===!1&&(t.scissor(O.x,O.y,O.z,O.w),_e.copy(O))}function xe(O){ge.equals(O)===!1&&(t.viewport(O.x,O.y,O.z,O.w),ge.copy(O))}function Me(O,Se){let J=f.get(Se);J===void 0&&(J=new WeakMap,f.set(Se,J));let me=J.get(O);me===void 0&&(me=t.getUniformBlockIndex(Se,O.name),J.set(O,me))}function Ue(O,Se){const me=f.get(Se).get(O);u.get(Se)!==me&&(t.uniformBlockBinding(Se,me,O.__bindingPointIndex),u.set(Se,me))}function je(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),i===!0&&(t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null)),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),d={},he=null,de={},p={},g=new WeakMap,_=[],m=null,h=!1,v=null,x=null,y=null,S=null,R=null,A=null,P=null,E=!1,T=null,F=null,H=null,N=null,U=null,_e.set(0,0,t.canvas.width,t.canvas.height),ge.set(0,0,t.canvas.width,t.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:j,disable:oe,bindFramebuffer:ce,drawBuffers:Ee,useProgram:we,setBlending:I,setMaterial:k,setFlipSided:V,setCullFace:ie,setLineWidth:fe,setPolygonOffset:ee,setScissorTest:ue,activeTexture:le,bindTexture:be,unbindTexture:w,compressedTexImage2D:b,compressedTexImage3D:B,texImage2D:Re,texImage3D:Pe,updateUBOMapping:Me,uniformBlockBinding:Ue,texStorage2D:pe,texStorage3D:K,texSubImage2D:te,texSubImage3D:ae,compressedTexSubImage2D:L,compressedTexSubImage3D:ne,scissor:Le,viewport:xe,reset:je}}function uR(t,e,n,i,r,s,o){const a=r.isWebGL2,l=r.maxTextures,c=r.maxCubemapSize,u=r.maxTextureSize,f=r.maxSamples,d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new WeakMap;let _;const m=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,b){return h?new OffscreenCanvas(w,b):da("canvas")}function x(w,b,B,te){let ae=1;if((w.width>te||w.height>te)&&(ae=te/Math.max(w.width,w.height)),ae<1||b===!0)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap){const L=b?Tc:Math.floor,ne=L(ae*w.width),pe=L(ae*w.height);_===void 0&&(_=v(ne,pe));const K=B?v(ne,pe):_;return K.width=ne,K.height=pe,K.getContext("2d").drawImage(w,0,0,ne,pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+w.width+"x"+w.height+") to ("+ne+"x"+pe+")."),K}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+w.width+"x"+w.height+")."),w;return w}function y(w){return Sh(w.width)&&Sh(w.height)}function S(w){return a?!1:w.wrapS!==pn||w.wrapT!==pn||w.minFilter!==It&&w.minFilter!==en}function R(w,b){return w.generateMipmaps&&b&&w.minFilter!==It&&w.minFilter!==en}function A(w){t.generateMipmap(w)}function P(w,b,B,te,ae=!1){if(a===!1)return b;if(w!==null){if(t[w]!==void 0)return t[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let L=b;return b===t.RED&&(B===t.FLOAT&&(L=t.R32F),B===t.HALF_FLOAT&&(L=t.R16F),B===t.UNSIGNED_BYTE&&(L=t.R8)),b===t.RG&&(B===t.FLOAT&&(L=t.RG32F),B===t.HALF_FLOAT&&(L=t.RG16F),B===t.UNSIGNED_BYTE&&(L=t.RG8)),b===t.RGBA&&(B===t.FLOAT&&(L=t.RGBA32F),B===t.HALF_FLOAT&&(L=t.RGBA16F),B===t.UNSIGNED_BYTE&&(L=te===Ge&&ae===!1?t.SRGB8_ALPHA8:t.RGBA8),B===t.UNSIGNED_SHORT_4_4_4_4&&(L=t.RGBA4),B===t.UNSIGNED_SHORT_5_5_5_1&&(L=t.RGB5_A1)),(L===t.R16F||L===t.R32F||L===t.RG16F||L===t.RG32F||L===t.RGBA16F||L===t.RGBA32F)&&e.get("EXT_color_buffer_float"),L}function E(w,b,B){return R(w,B)===!0||w.isFramebufferTexture&&w.minFilter!==It&&w.minFilter!==en?Math.log2(Math.max(b.width,b.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?b.mipmaps.length:1}function T(w){return w===It||w===Zf||w===ol?t.NEAREST:t.LINEAR}function F(w){const b=w.target;b.removeEventListener("dispose",F),N(b),b.isVideoTexture&&g.delete(b)}function H(w){const b=w.target;b.removeEventListener("dispose",H),W(b)}function N(w){const b=i.get(w);if(b.__webglInit===void 0)return;const B=w.source,te=m.get(B);if(te){const ae=te[b.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&U(w),Object.keys(te).length===0&&m.delete(B)}i.remove(w)}function U(w){const b=i.get(w);t.deleteTexture(b.__webglTexture);const B=w.source,te=m.get(B);delete te[b.__cacheKey],o.memory.textures--}function W(w){const b=w.texture,B=i.get(w),te=i.get(b);if(te.__webglTexture!==void 0&&(t.deleteTexture(te.__webglTexture),o.memory.textures--),w.depthTexture&&w.depthTexture.dispose(),w.isWebGLCubeRenderTarget)for(let ae=0;ae<6;ae++)t.deleteFramebuffer(B.__webglFramebuffer[ae]),B.__webglDepthbuffer&&t.deleteRenderbuffer(B.__webglDepthbuffer[ae]);else{if(t.deleteFramebuffer(B.__webglFramebuffer),B.__webglDepthbuffer&&t.deleteRenderbuffer(B.__webglDepthbuffer),B.__webglMultisampledFramebuffer&&t.deleteFramebuffer(B.__webglMultisampledFramebuffer),B.__webglColorRenderbuffer)for(let ae=0;ae<B.__webglColorRenderbuffer.length;ae++)B.__webglColorRenderbuffer[ae]&&t.deleteRenderbuffer(B.__webglColorRenderbuffer[ae]);B.__webglDepthRenderbuffer&&t.deleteRenderbuffer(B.__webglDepthRenderbuffer)}if(w.isWebGLMultipleRenderTargets)for(let ae=0,L=b.length;ae<L;ae++){const ne=i.get(b[ae]);ne.__webglTexture&&(t.deleteTexture(ne.__webglTexture),o.memory.textures--),i.remove(b[ae])}i.remove(b),i.remove(w)}let Z=0;function $(){Z=0}function Y(){const w=Z;return w>=l&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+l),Z+=1,w}function he(w){const b=[];return b.push(w.wrapS),b.push(w.wrapT),b.push(w.wrapR||0),b.push(w.magFilter),b.push(w.minFilter),b.push(w.anisotropy),b.push(w.internalFormat),b.push(w.format),b.push(w.type),b.push(w.generateMipmaps),b.push(w.premultiplyAlpha),b.push(w.flipY),b.push(w.unpackAlignment),b.push(w.colorSpace),b.join()}function de(w,b){const B=i.get(w);if(w.isVideoTexture&&le(w),w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){const te=w.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(B,w,b);return}}n.bindTexture(t.TEXTURE_2D,B.__webglTexture,t.TEXTURE0+b)}function X(w,b){const B=i.get(w);if(w.version>0&&B.__version!==w.version){ce(B,w,b);return}n.bindTexture(t.TEXTURE_2D_ARRAY,B.__webglTexture,t.TEXTURE0+b)}function Q(w,b){const B=i.get(w);if(w.version>0&&B.__version!==w.version){ce(B,w,b);return}n.bindTexture(t.TEXTURE_3D,B.__webglTexture,t.TEXTURE0+b)}function _e(w,b){const B=i.get(w);if(w.version>0&&B.__version!==w.version){Ee(B,w,b);return}n.bindTexture(t.TEXTURE_CUBE_MAP,B.__webglTexture,t.TEXTURE0+b)}const ge={[Mc]:t.REPEAT,[pn]:t.CLAMP_TO_EDGE,[Ec]:t.MIRRORED_REPEAT},ye={[It]:t.NEAREST,[Zf]:t.NEAREST_MIPMAP_NEAREST,[ol]:t.NEAREST_MIPMAP_LINEAR,[en]:t.LINEAR,[VE]:t.LINEAR_MIPMAP_NEAREST,[Fs]:t.LINEAR_MIPMAP_LINEAR},Ae={[rS]:t.NEVER,[fS]:t.ALWAYS,[sS]:t.LESS,[aS]:t.LEQUAL,[oS]:t.EQUAL,[uS]:t.GEQUAL,[lS]:t.GREATER,[cS]:t.NOTEQUAL};function j(w,b,B){if(B?(t.texParameteri(w,t.TEXTURE_WRAP_S,ge[b.wrapS]),t.texParameteri(w,t.TEXTURE_WRAP_T,ge[b.wrapT]),(w===t.TEXTURE_3D||w===t.TEXTURE_2D_ARRAY)&&t.texParameteri(w,t.TEXTURE_WRAP_R,ge[b.wrapR]),t.texParameteri(w,t.TEXTURE_MAG_FILTER,ye[b.magFilter]),t.texParameteri(w,t.TEXTURE_MIN_FILTER,ye[b.minFilter])):(t.texParameteri(w,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(w,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),(w===t.TEXTURE_3D||w===t.TEXTURE_2D_ARRAY)&&t.texParameteri(w,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),(b.wrapS!==pn||b.wrapT!==pn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),t.texParameteri(w,t.TEXTURE_MAG_FILTER,T(b.magFilter)),t.texParameteri(w,t.TEXTURE_MIN_FILTER,T(b.minFilter)),b.minFilter!==It&&b.minFilter!==en&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(t.texParameteri(w,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(w,t.TEXTURE_COMPARE_FUNC,Ae[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const te=e.get("EXT_texture_filter_anisotropic");if(b.magFilter===It||b.minFilter!==ol&&b.minFilter!==Fs||b.type===fi&&e.has("OES_texture_float_linear")===!1||a===!1&&b.type===Bs&&e.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||i.get(b).__currentAnisotropy)&&(t.texParameterf(w,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy)}}function oe(w,b){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,b.addEventListener("dispose",F));const te=b.source;let ae=m.get(te);ae===void 0&&(ae={},m.set(te,ae));const L=he(b);if(L!==w.__cacheKey){ae[L]===void 0&&(ae[L]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,B=!0),ae[L].usedTimes++;const ne=ae[w.__cacheKey];ne!==void 0&&(ae[w.__cacheKey].usedTimes--,ne.usedTimes===0&&U(b)),w.__cacheKey=L,w.__webglTexture=ae[L].texture}return B}function ce(w,b,B){let te=t.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(te=t.TEXTURE_2D_ARRAY),b.isData3DTexture&&(te=t.TEXTURE_3D);const ae=oe(w,b),L=b.source;n.bindTexture(te,w.__webglTexture,t.TEXTURE0+B);const ne=i.get(L);if(L.version!==ne.__version||ae===!0){n.activeTexture(t.TEXTURE0+B),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE);const pe=S(b)&&y(b.image)===!1;let K=x(b.image,pe,!1,u);K=be(b,K);const Re=y(K)||a,Pe=s.convert(b.format,b.colorSpace);let Le=s.convert(b.type),xe=P(b.internalFormat,Pe,Le,b.colorSpace);j(te,b,Re);let Me;const Ue=b.mipmaps,je=a&&b.isVideoTexture!==!0,O=ne.__version===void 0||ae===!0,Se=E(b,K,Re);if(b.isDepthTexture)xe=t.DEPTH_COMPONENT,a?b.type===fi?xe=t.DEPTH_COMPONENT32F:b.type===ui?xe=t.DEPTH_COMPONENT24:b.type===zi?xe=t.DEPTH24_STENCIL8:xe=t.DEPTH_COMPONENT16:b.type===fi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Gi&&xe===t.DEPTH_COMPONENT&&b.type!==gu&&b.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=ui,Le=s.convert(b.type)),b.format===Vr&&xe===t.DEPTH_COMPONENT&&(xe=t.DEPTH_STENCIL,b.type!==zi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=zi,Le=s.convert(b.type))),O&&(je?n.texStorage2D(t.TEXTURE_2D,1,xe,K.width,K.height):n.texImage2D(t.TEXTURE_2D,0,xe,K.width,K.height,0,Pe,Le,null));else if(b.isDataTexture)if(Ue.length>0&&Re){je&&O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Ue[0].width,Ue[0].height);for(let J=0,me=Ue.length;J<me;J++)Me=Ue[J],je?n.texSubImage2D(t.TEXTURE_2D,J,0,0,Me.width,Me.height,Pe,Le,Me.data):n.texImage2D(t.TEXTURE_2D,J,xe,Me.width,Me.height,0,Pe,Le,Me.data);b.generateMipmaps=!1}else je?(O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,K.width,K.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,K.width,K.height,Pe,Le,K.data)):n.texImage2D(t.TEXTURE_2D,0,xe,K.width,K.height,0,Pe,Le,K.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){je&&O&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Se,xe,Ue[0].width,Ue[0].height,K.depth);for(let J=0,me=Ue.length;J<me;J++)Me=Ue[J],b.format!==mn?Pe!==null?je?n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,Me.width,Me.height,K.depth,Pe,Me.data,0,0):n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,J,xe,Me.width,Me.height,K.depth,0,Me.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?n.texSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,Me.width,Me.height,K.depth,Pe,Le,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,J,xe,Me.width,Me.height,K.depth,0,Pe,Le,Me.data)}else{je&&O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Ue[0].width,Ue[0].height);for(let J=0,me=Ue.length;J<me;J++)Me=Ue[J],b.format!==mn?Pe!==null?je?n.compressedTexSubImage2D(t.TEXTURE_2D,J,0,0,Me.width,Me.height,Pe,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,J,xe,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?n.texSubImage2D(t.TEXTURE_2D,J,0,0,Me.width,Me.height,Pe,Le,Me.data):n.texImage2D(t.TEXTURE_2D,J,xe,Me.width,Me.height,0,Pe,Le,Me.data)}else if(b.isDataArrayTexture)je?(O&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Se,xe,K.width,K.height,K.depth),n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Pe,Le,K.data)):n.texImage3D(t.TEXTURE_2D_ARRAY,0,xe,K.width,K.height,K.depth,0,Pe,Le,K.data);else if(b.isData3DTexture)je?(O&&n.texStorage3D(t.TEXTURE_3D,Se,xe,K.width,K.height,K.depth),n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Pe,Le,K.data)):n.texImage3D(t.TEXTURE_3D,0,xe,K.width,K.height,K.depth,0,Pe,Le,K.data);else if(b.isFramebufferTexture){if(O)if(je)n.texStorage2D(t.TEXTURE_2D,Se,xe,K.width,K.height);else{let J=K.width,me=K.height;for(let Te=0;Te<Se;Te++)n.texImage2D(t.TEXTURE_2D,Te,xe,J,me,0,Pe,Le,null),J>>=1,me>>=1}}else if(Ue.length>0&&Re){je&&O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Ue[0].width,Ue[0].height);for(let J=0,me=Ue.length;J<me;J++)Me=Ue[J],je?n.texSubImage2D(t.TEXTURE_2D,J,0,0,Pe,Le,Me):n.texImage2D(t.TEXTURE_2D,J,xe,Pe,Le,Me);b.generateMipmaps=!1}else je?(O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,K.width,K.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,Pe,Le,K)):n.texImage2D(t.TEXTURE_2D,0,xe,Pe,Le,K);R(b,Re)&&A(te),ne.__version=L.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function Ee(w,b,B){if(b.image.length!==6)return;const te=oe(w,b),ae=b.source;n.bindTexture(t.TEXTURE_CUBE_MAP,w.__webglTexture,t.TEXTURE0+B);const L=i.get(ae);if(ae.version!==L.__version||te===!0){n.activeTexture(t.TEXTURE0+B),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE);const ne=b.isCompressedTexture||b.image[0].isCompressedTexture,pe=b.image[0]&&b.image[0].isDataTexture,K=[];for(let J=0;J<6;J++)!ne&&!pe?K[J]=x(b.image[J],!1,!0,c):K[J]=pe?b.image[J].image:b.image[J],K[J]=be(b,K[J]);const Re=K[0],Pe=y(Re)||a,Le=s.convert(b.format,b.colorSpace),xe=s.convert(b.type),Me=P(b.internalFormat,Le,xe,b.colorSpace),Ue=a&&b.isVideoTexture!==!0,je=L.__version===void 0||te===!0;let O=E(b,Re,Pe);j(t.TEXTURE_CUBE_MAP,b,Pe);let Se;if(ne){Ue&&je&&n.texStorage2D(t.TEXTURE_CUBE_MAP,O,Me,Re.width,Re.height);for(let J=0;J<6;J++){Se=K[J].mipmaps;for(let me=0;me<Se.length;me++){const Te=Se[me];b.format!==mn?Le!==null?Ue?n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,Te.width,Te.height,Le,Te.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,Me,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,Te.width,Te.height,Le,xe,Te.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,Me,Te.width,Te.height,0,Le,xe,Te.data)}}}else{Se=b.mipmaps,Ue&&je&&(Se.length>0&&O++,n.texStorage2D(t.TEXTURE_CUBE_MAP,O,Me,K[0].width,K[0].height));for(let J=0;J<6;J++)if(pe){Ue?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,K[J].width,K[J].height,Le,xe,K[J].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Me,K[J].width,K[J].height,0,Le,xe,K[J].data);for(let me=0;me<Se.length;me++){const Ze=Se[me].image[J].image;Ue?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,Ze.width,Ze.height,Le,xe,Ze.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,Me,Ze.width,Ze.height,0,Le,xe,Ze.data)}}else{Ue?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Le,xe,K[J]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Me,Le,xe,K[J]);for(let me=0;me<Se.length;me++){const Te=Se[me];Ue?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,Le,xe,Te.image[J]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,Me,Le,xe,Te.image[J])}}}R(b,Pe)&&A(t.TEXTURE_CUBE_MAP),L.__version=ae.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function we(w,b,B,te,ae){const L=s.convert(B.format,B.colorSpace),ne=s.convert(B.type),pe=P(B.internalFormat,L,ne,B.colorSpace);i.get(b).__hasExternalTextures||(ae===t.TEXTURE_3D||ae===t.TEXTURE_2D_ARRAY?n.texImage3D(ae,0,pe,b.width,b.height,b.depth,0,L,ne,null):n.texImage2D(ae,0,pe,b.width,b.height,0,L,ne,null)),n.bindFramebuffer(t.FRAMEBUFFER,w),ue(b)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,te,ae,i.get(B).__webglTexture,0,ee(b)):(ae===t.TEXTURE_2D||ae>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,te,ae,i.get(B).__webglTexture,0),n.bindFramebuffer(t.FRAMEBUFFER,null)}function M(w,b,B){if(t.bindRenderbuffer(t.RENDERBUFFER,w),b.depthBuffer&&!b.stencilBuffer){let te=t.DEPTH_COMPONENT16;if(B||ue(b)){const ae=b.depthTexture;ae&&ae.isDepthTexture&&(ae.type===fi?te=t.DEPTH_COMPONENT32F:ae.type===ui&&(te=t.DEPTH_COMPONENT24));const L=ee(b);ue(b)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,L,te,b.width,b.height):t.renderbufferStorageMultisample(t.RENDERBUFFER,L,te,b.width,b.height)}else t.renderbufferStorage(t.RENDERBUFFER,te,b.width,b.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,w)}else if(b.depthBuffer&&b.stencilBuffer){const te=ee(b);B&&ue(b)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,te,t.DEPTH24_STENCIL8,b.width,b.height):ue(b)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,te,t.DEPTH24_STENCIL8,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,w)}else{const te=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let ae=0;ae<te.length;ae++){const L=te[ae],ne=s.convert(L.format,L.colorSpace),pe=s.convert(L.type),K=P(L.internalFormat,ne,pe,L.colorSpace),Re=ee(b);B&&ue(b)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Re,K,b.width,b.height):ue(b)?d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Re,K,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,K,b.width,b.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function D(w,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,w),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),de(b.depthTexture,0);const te=i.get(b.depthTexture).__webglTexture,ae=ee(b);if(b.depthTexture.format===Gi)ue(b)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0);else if(b.depthTexture.format===Vr)ue(b)?d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function I(w){const b=i.get(w),B=w.isWebGLCubeRenderTarget===!0;if(w.depthTexture&&!b.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");D(b.__webglFramebuffer,w)}else if(B){b.__webglDepthbuffer=[];for(let te=0;te<6;te++)n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[te]),b.__webglDepthbuffer[te]=t.createRenderbuffer(),M(b.__webglDepthbuffer[te],w,!1)}else n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=t.createRenderbuffer(),M(b.__webglDepthbuffer,w,!1);n.bindFramebuffer(t.FRAMEBUFFER,null)}function k(w,b,B){const te=i.get(w);b!==void 0&&we(te.__webglFramebuffer,w,w.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D),B!==void 0&&I(w)}function V(w){const b=w.texture,B=i.get(w),te=i.get(b);w.addEventListener("dispose",H),w.isWebGLMultipleRenderTargets!==!0&&(te.__webglTexture===void 0&&(te.__webglTexture=t.createTexture()),te.__version=b.version,o.memory.textures++);const ae=w.isWebGLCubeRenderTarget===!0,L=w.isWebGLMultipleRenderTargets===!0,ne=y(w)||a;if(ae){B.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)B.__webglFramebuffer[pe]=t.createFramebuffer()}else{if(B.__webglFramebuffer=t.createFramebuffer(),L)if(r.drawBuffers){const pe=w.texture;for(let K=0,Re=pe.length;K<Re;K++){const Pe=i.get(pe[K]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=t.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&w.samples>0&&ue(w)===!1){const pe=L?b:[b];B.__webglMultisampledFramebuffer=t.createFramebuffer(),B.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let K=0;K<pe.length;K++){const Re=pe[K];B.__webglColorRenderbuffer[K]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,B.__webglColorRenderbuffer[K]);const Pe=s.convert(Re.format,Re.colorSpace),Le=s.convert(Re.type),xe=P(Re.internalFormat,Pe,Le,Re.colorSpace,w.isXRRenderTarget===!0),Me=ee(w);t.renderbufferStorageMultisample(t.RENDERBUFFER,Me,xe,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+K,t.RENDERBUFFER,B.__webglColorRenderbuffer[K])}t.bindRenderbuffer(t.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=t.createRenderbuffer(),M(B.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ae){n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),j(t.TEXTURE_CUBE_MAP,b,ne);for(let pe=0;pe<6;pe++)we(B.__webglFramebuffer[pe],w,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+pe);R(b,ne)&&A(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(L){const pe=w.texture;for(let K=0,Re=pe.length;K<Re;K++){const Pe=pe[K],Le=i.get(Pe);n.bindTexture(t.TEXTURE_2D,Le.__webglTexture),j(t.TEXTURE_2D,Pe,ne),we(B.__webglFramebuffer,w,Pe,t.COLOR_ATTACHMENT0+K,t.TEXTURE_2D),R(Pe,ne)&&A(t.TEXTURE_2D)}n.unbindTexture()}else{let pe=t.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(a?pe=w.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(pe,te.__webglTexture),j(pe,b,ne),we(B.__webglFramebuffer,w,b,t.COLOR_ATTACHMENT0,pe),R(b,ne)&&A(pe),n.unbindTexture()}w.depthBuffer&&I(w)}function ie(w){const b=y(w)||a,B=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let te=0,ae=B.length;te<ae;te++){const L=B[te];if(R(L,b)){const ne=w.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,pe=i.get(L).__webglTexture;n.bindTexture(ne,pe),A(ne),n.unbindTexture()}}}function fe(w){if(a&&w.samples>0&&ue(w)===!1){const b=w.isWebGLMultipleRenderTargets?w.texture:[w.texture],B=w.width,te=w.height;let ae=t.COLOR_BUFFER_BIT;const L=[],ne=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,pe=i.get(w),K=w.isWebGLMultipleRenderTargets===!0;if(K)for(let Re=0;Re<b.length;Re++)n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let Re=0;Re<b.length;Re++){L.push(t.COLOR_ATTACHMENT0+Re),w.depthBuffer&&L.push(ne);const Pe=pe.__ignoreDepthValues!==void 0?pe.__ignoreDepthValues:!1;if(Pe===!1&&(w.depthBuffer&&(ae|=t.DEPTH_BUFFER_BIT),w.stencilBuffer&&(ae|=t.STENCIL_BUFFER_BIT)),K&&t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,pe.__webglColorRenderbuffer[Re]),Pe===!0&&(t.invalidateFramebuffer(t.READ_FRAMEBUFFER,[ne]),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[ne])),K){const Le=i.get(b[Re]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Le,0)}t.blitFramebuffer(0,0,B,te,0,0,B,te,ae,t.NEAREST),p&&t.invalidateFramebuffer(t.READ_FRAMEBUFFER,L)}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),K)for(let Re=0;Re<b.length;Re++){n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.RENDERBUFFER,pe.__webglColorRenderbuffer[Re]);const Pe=i.get(b[Re]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.TEXTURE_2D,Pe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}}function ee(w){return Math.min(f,w.samples)}function ue(w){const b=i.get(w);return a&&w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function le(w){const b=o.render.frame;g.get(w)!==b&&(g.set(w,b),w.update())}function be(w,b){const B=w.colorSpace,te=w.format,ae=w.type;return w.isCompressedTexture===!0||w.format===Sc||B!==Rn&&B!==Wi&&(B===Ge?a===!1?e.has("EXT_sRGB")===!0&&te===mn?(w.format=Sc,w.minFilter=en,w.generateMipmaps=!1):b=Gm.sRGBToLinear(b):(te!==mn||ae!==vi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),b}this.allocateTextureUnit=Y,this.resetTextureUnits=$,this.setTexture2D=de,this.setTexture2DArray=X,this.setTexture3D=Q,this.setTextureCube=_e,this.rebindTextures=k,this.setupRenderTarget=V,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=I,this.setupFrameBufferTexture=we,this.useMultisampledRTT=ue}function fR(t,e,n){const i=n.isWebGL2;function r(s,o=Wi){let a;if(s===vi)return t.UNSIGNED_BYTE;if(s===Um)return t.UNSIGNED_SHORT_4_4_4_4;if(s===Nm)return t.UNSIGNED_SHORT_5_5_5_1;if(s===WE)return t.BYTE;if(s===XE)return t.SHORT;if(s===gu)return t.UNSIGNED_SHORT;if(s===Im)return t.INT;if(s===ui)return t.UNSIGNED_INT;if(s===fi)return t.FLOAT;if(s===Bs)return i?t.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===jE)return t.ALPHA;if(s===mn)return t.RGBA;if(s===qE)return t.LUMINANCE;if(s===$E)return t.LUMINANCE_ALPHA;if(s===Gi)return t.DEPTH_COMPONENT;if(s===Vr)return t.DEPTH_STENCIL;if(s===Sc)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===YE)return t.RED;if(s===Om)return t.RED_INTEGER;if(s===KE)return t.RG;if(s===Fm)return t.RG_INTEGER;if(s===Bm)return t.RGBA_INTEGER;if(s===al||s===ll||s===cl||s===ul)if(o===Ge)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===al)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===ll)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===cl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===ul)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===al)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===ll)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===cl)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===ul)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Jf||s===Qf||s===eh||s===th)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===Jf)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Qf)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===eh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===th)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===ZE)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===nh||s===ih)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===nh)return o===Ge?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===ih)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===rh||s===sh||s===oh||s===ah||s===lh||s===ch||s===uh||s===fh||s===hh||s===dh||s===ph||s===mh||s===gh||s===_h)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===rh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===sh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===oh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===ah)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===lh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===ch)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===uh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===fh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===hh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===dh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===ph)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===mh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===gh)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===_h)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===fl)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===fl)return o===Ge?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(s===JE||s===vh||s===xh||s===yh)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===fl)return a.COMPRESSED_RED_RGTC1_EXT;if(s===vh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===xh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===yh)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===zi?i?t.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):t[s]!==void 0?t[s]:null}return{convert:r}}class hR extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Bo extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dR={type:"move"};class Nl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=n.getJointPose(_,i),h=this._getHandJoint(c,_);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(dR)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Bo;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}class pR extends Kt{constructor(e,n,i,r,s,o,a,l,c,u){if(u=u!==void 0?u:Gi,u!==Gi&&u!==Vr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Gi&&(i=ui),i===void 0&&u===Vr&&(i=zi),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:It,this.minFilter=l!==void 0?l:It,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class mR extends Zi{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,d=null,p=null,g=null;const _=n.getContextAttributes();let m=null,h=null;const v=[],x=[],y=new tn;y.layers.enable(1),y.viewport=new bt;const S=new tn;S.layers.enable(2),S.viewport=new bt;const R=[y,S],A=new hR;A.layers.enable(1),A.layers.enable(2);let P=null,E=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Q=v[X];return Q===void 0&&(Q=new Nl,v[X]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(X){let Q=v[X];return Q===void 0&&(Q=new Nl,v[X]=Q),Q.getGripSpace()},this.getHand=function(X){let Q=v[X];return Q===void 0&&(Q=new Nl,v[X]=Q),Q.getHandSpace()};function T(X){const Q=x.indexOf(X.inputSource);if(Q===-1)return;const _e=v[Q];_e!==void 0&&(_e.update(X.inputSource,X.frame,c||o),_e.dispatchEvent({type:X.type,data:X.inputSource}))}function F(){r.removeEventListener("select",T),r.removeEventListener("selectstart",T),r.removeEventListener("selectend",T),r.removeEventListener("squeeze",T),r.removeEventListener("squeezestart",T),r.removeEventListener("squeezeend",T),r.removeEventListener("end",F),r.removeEventListener("inputsourceschange",H);for(let X=0;X<v.length;X++){const Q=x[X];Q!==null&&(x[X]=null,v[X].disconnect(Q))}P=null,E=null,e.setRenderTarget(m),p=null,d=null,f=null,r=null,h=null,de.stop(),i.isPresenting=!1,i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(m=e.getRenderTarget(),r.addEventListener("select",T),r.addEventListener("selectstart",T),r.addEventListener("selectend",T),r.addEventListener("squeeze",T),r.addEventListener("squeezestart",T),r.addEventListener("squeezeend",T),r.addEventListener("end",F),r.addEventListener("inputsourceschange",H),_.xrCompatible!==!0&&await n.makeXRCompatible(),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Q={antialias:r.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,Q),r.updateRenderState({baseLayer:p}),h=new ji(p.framebufferWidth,p.framebufferHeight,{format:mn,type:vi,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Q=null,_e=null,ge=null;_.depth&&(ge=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Q=_.stencil?Vr:Gi,_e=_.stencil?zi:ui);const ye={colorFormat:n.RGBA8,depthFormat:ge,scaleFactor:s};f=new XRWebGLBinding(r,n),d=f.createProjectionLayer(ye),r.updateRenderState({layers:[d]}),h=new ji(d.textureWidth,d.textureHeight,{format:mn,type:vi,depthTexture:new pR(d.textureWidth,d.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Ae=e.properties.get(h);Ae.__ignoreDepthValues=d.ignoreDepthValues}h.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),de.setContext(r),de.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function H(X){for(let Q=0;Q<X.removed.length;Q++){const _e=X.removed[Q],ge=x.indexOf(_e);ge>=0&&(x[ge]=null,v[ge].disconnect(_e))}for(let Q=0;Q<X.added.length;Q++){const _e=X.added[Q];let ge=x.indexOf(_e);if(ge===-1){for(let Ae=0;Ae<v.length;Ae++)if(Ae>=x.length){x.push(_e),ge=Ae;break}else if(x[Ae]===null){x[Ae]=_e,ge=Ae;break}if(ge===-1)break}const ye=v[ge];ye&&ye.connect(_e)}}const N=new z,U=new z;function W(X,Q,_e){N.setFromMatrixPosition(Q.matrixWorld),U.setFromMatrixPosition(_e.matrixWorld);const ge=N.distanceTo(U),ye=Q.projectionMatrix.elements,Ae=_e.projectionMatrix.elements,j=ye[14]/(ye[10]-1),oe=ye[14]/(ye[10]+1),ce=(ye[9]+1)/ye[5],Ee=(ye[9]-1)/ye[5],we=(ye[8]-1)/ye[0],M=(Ae[8]+1)/Ae[0],D=j*we,I=j*M,k=ge/(-we+M),V=k*-we;Q.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(V),X.translateZ(k),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const ie=j+k,fe=oe+k,ee=D-V,ue=I+(ge-V),le=ce*oe/fe*ie,be=Ee*oe/fe*ie;X.projectionMatrix.makePerspective(ee,ue,le,be,ie,fe),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function Z(X,Q){Q===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Q.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;A.near=S.near=y.near=X.near,A.far=S.far=y.far=X.far,(P!==A.near||E!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),P=A.near,E=A.far);const Q=X.parent,_e=A.cameras;Z(A,Q);for(let ge=0;ge<_e.length;ge++)Z(_e[ge],Q);_e.length===2?W(A,y,S):A.projectionMatrix.copy(y.projectionMatrix),$(X,A,Q)};function $(X,Q,_e){_e===null?X.matrix.copy(Q.matrixWorld):(X.matrix.copy(_e.matrixWorld),X.matrix.invert(),X.matrix.multiply(Q.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0);const ge=X.children;for(let ye=0,Ae=ge.length;ye<Ae;ye++)ge[ye].updateMatrixWorld(!0);X.projectionMatrix.copy(Q.projectionMatrix),X.projectionMatrixInverse.copy(Q.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=bc*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)};let Y=null;function he(X,Q){if(u=Q.getViewerPose(c||o),g=Q,u!==null){const _e=u.views;p!==null&&(e.setRenderTargetFramebuffer(h,p.framebuffer),e.setRenderTarget(h));let ge=!1;_e.length!==A.cameras.length&&(A.cameras.length=0,ge=!0);for(let ye=0;ye<_e.length;ye++){const Ae=_e[ye];let j=null;if(p!==null)j=p.getViewport(Ae);else{const ce=f.getViewSubImage(d,Ae);j=ce.viewport,ye===0&&(e.setRenderTargetTextures(h,ce.colorTexture,d.ignoreDepthValues?void 0:ce.depthStencilTexture),e.setRenderTarget(h))}let oe=R[ye];oe===void 0&&(oe=new tn,oe.layers.enable(ye),oe.viewport=new bt,R[ye]=oe),oe.matrix.fromArray(Ae.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(Ae.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(j.x,j.y,j.width,j.height),ye===0&&(A.matrix.copy(oe.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),ge===!0&&A.cameras.push(oe)}}for(let _e=0;_e<v.length;_e++){const ge=x[_e],ye=v[_e];ge!==null&&ye!==void 0&&ye.update(ge,Q,c||o)}Y&&Y(X,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const de=new tg;de.setAnimationLoop(he),this.setAnimationLoop=function(X){Y=X},this.dispose=function(){}}}function gR(t,e){function n(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function i(m,h){h.color.getRGB(m.fogColor.value,Zm(t)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function r(m,h,v,x,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(m,h):h.isMeshToonMaterial?(s(m,h),f(m,h)):h.isMeshPhongMaterial?(s(m,h),u(m,h)):h.isMeshStandardMaterial?(s(m,h),d(m,h),h.isMeshPhysicalMaterial&&p(m,h,y)):h.isMeshMatcapMaterial?(s(m,h),g(m,h)):h.isMeshDepthMaterial?s(m,h):h.isMeshDistanceMaterial?(s(m,h),_(m,h)):h.isMeshNormalMaterial?s(m,h):h.isLineBasicMaterial?(o(m,h),h.isLineDashedMaterial&&a(m,h)):h.isPointsMaterial?l(m,h,v,x):h.isSpriteMaterial?c(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,n(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,n(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===kt&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,n(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===kt&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,n(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,n(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,n(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const v=e.get(h).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap){m.lightMap.value=h.lightMap;const x=t.useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=h.lightMapIntensity*x,n(h.lightMap,m.lightMapTransform)}h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,n(h.aoMap,m.aoMapTransform))}function o(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,n(h.map,m.mapTransform))}function a(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function l(m,h,v,x){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*v,m.scale.value=x*.5,h.map&&(m.map.value=h.map,n(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function c(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,n(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function f(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function d(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,n(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,n(h.roughnessMap,m.roughnessMapTransform)),e.get(h).envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,v){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,n(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,n(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,n(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,n(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,n(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===kt&&m.clearcoatNormalScale.value.negate())),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,n(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,n(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,n(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,n(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,n(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,n(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,n(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function _(m,h){const v=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function _R(t,e,n,i){let r={},s={},o=[];const a=n.isWebGL2?t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(v,x){const y=x.program;i.uniformBlockBinding(v,y)}function c(v,x){let y=r[v.id];y===void 0&&(g(v),y=u(v),r[v.id]=y,v.addEventListener("dispose",m));const S=x.program;i.updateUBOMapping(v,S);const R=e.render.frame;s[v.id]!==R&&(d(v),s[v.id]=R)}function u(v){const x=f();v.__bindingPointIndex=x;const y=t.createBuffer(),S=v.__size,R=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,S,R),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,y),y}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const x=r[v.id],y=v.uniforms,S=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let R=0,A=y.length;R<A;R++){const P=y[R];if(p(P,R,S)===!0){const E=P.__offset,T=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let H=0;H<T.length;H++){const N=T[H],U=_(N);typeof N=="number"?(P.__data[0]=N,t.bufferSubData(t.UNIFORM_BUFFER,E+F,P.__data)):N.isMatrix3?(P.__data[0]=N.elements[0],P.__data[1]=N.elements[1],P.__data[2]=N.elements[2],P.__data[3]=N.elements[0],P.__data[4]=N.elements[3],P.__data[5]=N.elements[4],P.__data[6]=N.elements[5],P.__data[7]=N.elements[0],P.__data[8]=N.elements[6],P.__data[9]=N.elements[7],P.__data[10]=N.elements[8],P.__data[11]=N.elements[0]):(N.toArray(P.__data,F),F+=U.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,E,P.__data)}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(v,x,y){const S=v.value;if(y[x]===void 0){if(typeof S=="number")y[x]=S;else{const R=Array.isArray(S)?S:[S],A=[];for(let P=0;P<R.length;P++)A.push(R[P].clone());y[x]=A}return!0}else if(typeof S=="number"){if(y[x]!==S)return y[x]=S,!0}else{const R=Array.isArray(y[x])?y[x]:[y[x]],A=Array.isArray(S)?S:[S];for(let P=0;P<R.length;P++){const E=R[P];if(E.equals(A[P])===!1)return E.copy(A[P]),!0}}return!1}function g(v){const x=v.uniforms;let y=0;const S=16;let R=0;for(let A=0,P=x.length;A<P;A++){const E=x[A],T={boundary:0,storage:0},F=Array.isArray(E.value)?E.value:[E.value];for(let H=0,N=F.length;H<N;H++){const U=F[H],W=_(U);T.boundary+=W.boundary,T.storage+=W.storage}if(E.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),E.__offset=y,A>0){R=y%S;const H=S-R;R!==0&&H-T.boundary<0&&(y+=S-R,E.__offset=y)}y+=T.storage}return R=y%S,R>0&&(y+=S-R),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function h(){for(const v in r)t.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:h}}function vR(){const t=da("canvas");return t.style.display="block",t}class Ac{constructor(e={}){const{canvas:n=vR(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=o;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const h=[],v=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=Ge,this.useLegacyLights=!0,this.toneMapping=Wn,this.toneMappingExposure=1;const x=this;let y=!1,S=0,R=0,A=null,P=-1,E=null;const T=new bt,F=new bt;let H=null;const N=new Je(0);let U=0,W=n.width,Z=n.height,$=1,Y=null,he=null;const de=new bt(0,0,W,Z),X=new bt(0,0,W,Z);let Q=!1;const _e=new eg;let ge=!1,ye=!1,Ae=null;const j=new Et,oe=new Xe,ce=new z,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function we(){return A===null?$:1}let M=i;function D(C,q){for(let re=0;re<C.length;re++){const G=C[re],se=n.getContext(G,q);if(se!==null)return se}return null}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${mu}`),n.addEventListener("webglcontextlost",Se,!1),n.addEventListener("webglcontextrestored",J,!1),n.addEventListener("webglcontextcreationerror",me,!1),M===null){const q=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&q.shift(),M=D(q,C),M===null)throw D(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&M instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),M.getShaderPrecisionFormat===void 0&&(M.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let I,k,V,ie,fe,ee,ue,le,be,w,b,B,te,ae,L,ne,pe,K,Re,Pe,Le,xe,Me,Ue;function je(){I=new Rw(M),k=new Mw(M,I,e),I.init(k),xe=new fR(M,I,k),V=new cR(M,I,k),ie=new Lw(M),fe=new YA,ee=new uR(M,I,V,fe,k,xe,ie),ue=new Sw(x),le=new Aw(x),be=new kS(M,k),Me=new xw(M,I,be,k),w=new Cw(M,be,ie,Me),b=new Nw(M,w,be,ie),Re=new Uw(M,k,ee),ne=new Ew(fe),B=new $A(x,ue,le,I,k,Me,ne),te=new gR(x,fe),ae=new ZA,L=new iR(I,k),K=new vw(x,ue,le,V,b,d,l),pe=new lR(x,b,k),Ue=new _R(M,ie,k,V),Pe=new yw(M,I,ie,k),Le=new Pw(M,I,ie,k),ie.programs=B.programs,x.capabilities=k,x.extensions=I,x.properties=fe,x.renderLists=ae,x.shadowMap=pe,x.state=V,x.info=ie}je();const O=new mR(x,M);this.xr=O,this.getContext=function(){return M},this.getContextAttributes=function(){return M.getContextAttributes()},this.forceContextLoss=function(){const C=I.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=I.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(C){C!==void 0&&($=C,this.setSize(W,Z,!1))},this.getSize=function(C){return C.set(W,Z)},this.setSize=function(C,q,re=!0){if(O.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=C,Z=q,n.width=Math.floor(C*$),n.height=Math.floor(q*$),re===!0&&(n.style.width=C+"px",n.style.height=q+"px"),this.setViewport(0,0,C,q)},this.getDrawingBufferSize=function(C){return C.set(W*$,Z*$).floor()},this.setDrawingBufferSize=function(C,q,re){W=C,Z=q,$=re,n.width=Math.floor(C*re),n.height=Math.floor(q*re),this.setViewport(0,0,C,q)},this.getCurrentViewport=function(C){return C.copy(T)},this.getViewport=function(C){return C.copy(de)},this.setViewport=function(C,q,re,G){C.isVector4?de.set(C.x,C.y,C.z,C.w):de.set(C,q,re,G),V.viewport(T.copy(de).multiplyScalar($).floor())},this.getScissor=function(C){return C.copy(X)},this.setScissor=function(C,q,re,G){C.isVector4?X.set(C.x,C.y,C.z,C.w):X.set(C,q,re,G),V.scissor(F.copy(X).multiplyScalar($).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(C){V.setScissorTest(Q=C)},this.setOpaqueSort=function(C){Y=C},this.setTransparentSort=function(C){he=C},this.getClearColor=function(C){return C.copy(K.getClearColor())},this.setClearColor=function(){K.setClearColor.apply(K,arguments)},this.getClearAlpha=function(){return K.getClearAlpha()},this.setClearAlpha=function(){K.setClearAlpha.apply(K,arguments)},this.clear=function(C=!0,q=!0,re=!0){let G=0;if(C){let se=!1;if(A!==null){const Ce=A.texture.format;se=Ce===Bm||Ce===Fm||Ce===Om}if(se){const Ce=A.texture.type,Ne=Ce===vi||Ce===ui||Ce===gu||Ce===zi||Ce===Um||Ce===Nm,Oe=K.getClearColor(),Fe=K.getClearAlpha(),We=Oe.r,He=Oe.g,ke=Oe.b;Ne?(p[0]=We,p[1]=He,p[2]=ke,p[3]=Fe,M.clearBufferuiv(M.COLOR,0,p)):(g[0]=We,g[1]=He,g[2]=ke,g[3]=Fe,M.clearBufferiv(M.COLOR,0,g))}else G|=M.COLOR_BUFFER_BIT}q&&(G|=M.DEPTH_BUFFER_BIT),re&&(G|=M.STENCIL_BUFFER_BIT),M.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Se,!1),n.removeEventListener("webglcontextrestored",J,!1),n.removeEventListener("webglcontextcreationerror",me,!1),ae.dispose(),L.dispose(),fe.dispose(),ue.dispose(),le.dispose(),b.dispose(),Me.dispose(),Ue.dispose(),B.dispose(),O.dispose(),O.removeEventListener("sessionstart",ct),O.removeEventListener("sessionend",Mn),Ae&&(Ae.dispose(),Ae=null),Ct.stop()};function Se(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function J(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const C=ie.autoReset,q=pe.enabled,re=pe.autoUpdate,G=pe.needsUpdate,se=pe.type;je(),ie.autoReset=C,pe.enabled=q,pe.autoUpdate=re,pe.needsUpdate=G,pe.type=se}function me(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Te(C){const q=C.target;q.removeEventListener("dispose",Te),Ze(q)}function Ze(C){ot(C),fe.remove(C)}function ot(C){const q=fe.get(C).programs;q!==void 0&&(q.forEach(function(re){B.releaseProgram(re)}),C.isShaderMaterial&&B.releaseShaderCache(C))}this.renderBufferDirect=function(C,q,re,G,se,Ce){q===null&&(q=Ee);const Ne=se.isMesh&&se.matrixWorld.determinant()<0,Oe=Ng(C,q,re,G,se);V.setMaterial(G,Ne);let Fe=re.index,We=1;G.wireframe===!0&&(Fe=w.getWireframeAttribute(re),We=2);const He=re.drawRange,ke=re.attributes.position;let ut=He.start*We,ft=(He.start+He.count)*We;Ce!==null&&(ut=Math.max(ut,Ce.start*We),ft=Math.min(ft,(Ce.start+Ce.count)*We)),Fe!==null?(ut=Math.max(ut,0),ft=Math.min(ft,Fe.count)):ke!=null&&(ut=Math.max(ut,0),ft=Math.min(ft,ke.count));const on=ft-ut;if(on<0||on===1/0)return;Me.setup(se,G,Oe,re,Fe);let Pn,ht=Pe;if(Fe!==null&&(Pn=be.get(Fe),ht=Le,ht.setIndex(Pn)),se.isMesh)G.wireframe===!0?(V.setLineWidth(G.wireframeLinewidth*we()),ht.setMode(M.LINES)):ht.setMode(M.TRIANGLES);else if(se.isLine){let $e=G.linewidth;$e===void 0&&($e=1),V.setLineWidth($e*we()),se.isLineSegments?ht.setMode(M.LINES):se.isLineLoop?ht.setMode(M.LINE_LOOP):ht.setMode(M.LINE_STRIP)}else se.isPoints?ht.setMode(M.POINTS):se.isSprite&&ht.setMode(M.TRIANGLES);if(se.isInstancedMesh)ht.renderInstances(ut,on,se.count);else if(re.isInstancedBufferGeometry){const $e=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,Ha=Math.min(re.instanceCount,$e);ht.renderInstances(ut,on,Ha)}else ht.render(ut,on)},this.compile=function(C,q){function re(G,se,Ce){G.transparent===!0&&G.side===zn&&G.forceSinglePass===!1?(G.side=kt,G.needsUpdate=!0,io(G,se,Ce),G.side=yi,G.needsUpdate=!0,io(G,se,Ce),G.side=zn):io(G,se,Ce)}m=L.get(C),m.init(),v.push(m),C.traverseVisible(function(G){G.isLight&&G.layers.test(q.layers)&&(m.pushLight(G),G.castShadow&&m.pushShadow(G))}),m.setupLights(x.useLegacyLights),C.traverse(function(G){const se=G.material;if(se)if(Array.isArray(se))for(let Ce=0;Ce<se.length;Ce++){const Ne=se[Ce];re(Ne,C,G)}else re(se,C,G)}),v.pop(),m=null};let vt=null;function yn(C){vt&&vt(C)}function ct(){Ct.stop()}function Mn(){Ct.start()}const Ct=new tg;Ct.setAnimationLoop(yn),typeof self<"u"&&Ct.setContext(self),this.setAnimationLoop=function(C){vt=C,O.setAnimationLoop(C),C===null?Ct.stop():Ct.start()},O.addEventListener("sessionstart",ct),O.addEventListener("sessionend",Mn),this.render=function(C,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),O.enabled===!0&&O.isPresenting===!0&&(O.cameraAutoUpdate===!0&&O.updateCamera(q),q=O.getCamera()),C.isScene===!0&&C.onBeforeRender(x,C,q,A),m=L.get(C,v.length),m.init(),v.push(m),j.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),_e.setFromProjectionMatrix(j),ye=this.localClippingEnabled,ge=ne.init(this.clippingPlanes,ye),_=ae.get(C,h.length),_.init(),h.push(_),Eu(C,q,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(Y,he),this.info.render.frame++,ge===!0&&ne.beginShadows();const re=m.state.shadowsArray;if(pe.render(re,C,q),ge===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset(),K.render(_,C),m.setupLights(x.useLegacyLights),q.isArrayCamera){const G=q.cameras;for(let se=0,Ce=G.length;se<Ce;se++){const Ne=G[se];Su(_,C,Ne,Ne.viewport)}}else Su(_,C,q);A!==null&&(ee.updateMultisampleRenderTarget(A),ee.updateRenderTargetMipmap(A)),C.isScene===!0&&C.onAfterRender(x,C,q),Me.resetDefaultState(),P=-1,E=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,h.pop(),h.length>0?_=h[h.length-1]:_=null};function Eu(C,q,re,G){if(C.visible===!1)return;if(C.layers.test(q.layers)){if(C.isGroup)re=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(q);else if(C.isLight)m.pushLight(C),C.castShadow&&m.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||_e.intersectsSprite(C)){G&&ce.setFromMatrixPosition(C.matrixWorld).applyMatrix4(j);const Ne=b.update(C),Oe=C.material;Oe.visible&&_.push(C,Ne,Oe,re,ce.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||_e.intersectsObject(C))){const Ne=b.update(C),Oe=C.material;if(G&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),ce.copy(C.boundingSphere.center)):(Ne.boundingSphere===null&&Ne.computeBoundingSphere(),ce.copy(Ne.boundingSphere.center)),ce.applyMatrix4(C.matrixWorld).applyMatrix4(j)),Array.isArray(Oe)){const Fe=Ne.groups;for(let We=0,He=Fe.length;We<He;We++){const ke=Fe[We],ut=Oe[ke.materialIndex];ut&&ut.visible&&_.push(C,Ne,ut,re,ce.z,ke)}}else Oe.visible&&_.push(C,Ne,Oe,re,ce.z,null)}}const Ce=C.children;for(let Ne=0,Oe=Ce.length;Ne<Oe;Ne++)Eu(Ce[Ne],q,re,G)}function Su(C,q,re,G){const se=C.opaque,Ce=C.transmissive,Ne=C.transparent;m.setupLightsView(re),ge===!0&&ne.setGlobalState(x.clippingPlanes,re),Ce.length>0&&Ug(se,Ce,q,re),G&&V.viewport(T.copy(G)),se.length>0&&no(se,q,re),Ce.length>0&&no(Ce,q,re),Ne.length>0&&no(Ne,q,re),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function Ug(C,q,re,G){const se=k.isWebGL2;Ae===null&&(Ae=new ji(1,1,{generateMipmaps:!0,type:I.has("EXT_color_buffer_half_float")?Bs:vi,minFilter:Fs,samples:se?4:0})),x.getDrawingBufferSize(oe),se?Ae.setSize(oe.x,oe.y):Ae.setSize(Tc(oe.x),Tc(oe.y));const Ce=x.getRenderTarget();x.setRenderTarget(Ae),x.getClearColor(N),U=x.getClearAlpha(),U<1&&x.setClearColor(16777215,.5),x.clear();const Ne=x.toneMapping;x.toneMapping=Wn,no(C,re,G),ee.updateMultisampleRenderTarget(Ae),ee.updateRenderTargetMipmap(Ae);let Oe=!1;for(let Fe=0,We=q.length;Fe<We;Fe++){const He=q[Fe],ke=He.object,ut=He.geometry,ft=He.material,on=He.group;if(ft.side===zn&&ke.layers.test(G.layers)){const Pn=ft.side;ft.side=kt,ft.needsUpdate=!0,bu(ke,re,G,ut,ft,on),ft.side=Pn,ft.needsUpdate=!0,Oe=!0}}Oe===!0&&(ee.updateMultisampleRenderTarget(Ae),ee.updateRenderTargetMipmap(Ae)),x.setRenderTarget(Ce),x.setClearColor(N,U),x.toneMapping=Ne}function no(C,q,re){const G=q.isScene===!0?q.overrideMaterial:null;for(let se=0,Ce=C.length;se<Ce;se++){const Ne=C[se],Oe=Ne.object,Fe=Ne.geometry,We=G===null?Ne.material:G,He=Ne.group;Oe.layers.test(re.layers)&&bu(Oe,q,re,Fe,We,He)}}function bu(C,q,re,G,se,Ce){C.onBeforeRender(x,q,re,G,se,Ce),C.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),se.onBeforeRender(x,q,re,G,C,Ce),se.transparent===!0&&se.side===zn&&se.forceSinglePass===!1?(se.side=kt,se.needsUpdate=!0,x.renderBufferDirect(re,q,G,se,C,Ce),se.side=yi,se.needsUpdate=!0,x.renderBufferDirect(re,q,G,se,C,Ce),se.side=zn):x.renderBufferDirect(re,q,G,se,C,Ce),C.onAfterRender(x,q,re,G,se,Ce)}function io(C,q,re){q.isScene!==!0&&(q=Ee);const G=fe.get(C),se=m.state.lights,Ce=m.state.shadowsArray,Ne=se.state.version,Oe=B.getParameters(C,se.state,Ce,q,re),Fe=B.getProgramCacheKey(Oe);let We=G.programs;G.environment=C.isMeshStandardMaterial?q.environment:null,G.fog=q.fog,G.envMap=(C.isMeshStandardMaterial?le:ue).get(C.envMap||G.environment),We===void 0&&(C.addEventListener("dispose",Te),We=new Map,G.programs=We);let He=We.get(Fe);if(He!==void 0){if(G.currentProgram===He&&G.lightsStateVersion===Ne)return Tu(C,Oe),He}else Oe.uniforms=B.getUniforms(C),C.onBuild(re,Oe,x),C.onBeforeCompile(Oe,x),He=B.acquireProgram(Oe,Fe),We.set(Fe,He),G.uniforms=Oe.uniforms;const ke=G.uniforms;(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(ke.clippingPlanes=ne.uniform),Tu(C,Oe),G.needsLights=Fg(C),G.lightsStateVersion=Ne,G.needsLights&&(ke.ambientLightColor.value=se.state.ambient,ke.lightProbe.value=se.state.probe,ke.directionalLights.value=se.state.directional,ke.directionalLightShadows.value=se.state.directionalShadow,ke.spotLights.value=se.state.spot,ke.spotLightShadows.value=se.state.spotShadow,ke.rectAreaLights.value=se.state.rectArea,ke.ltc_1.value=se.state.rectAreaLTC1,ke.ltc_2.value=se.state.rectAreaLTC2,ke.pointLights.value=se.state.point,ke.pointLightShadows.value=se.state.pointShadow,ke.hemisphereLights.value=se.state.hemi,ke.directionalShadowMap.value=se.state.directionalShadowMap,ke.directionalShadowMatrix.value=se.state.directionalShadowMatrix,ke.spotShadowMap.value=se.state.spotShadowMap,ke.spotLightMatrix.value=se.state.spotLightMatrix,ke.spotLightMap.value=se.state.spotLightMap,ke.pointShadowMap.value=se.state.pointShadowMap,ke.pointShadowMatrix.value=se.state.pointShadowMatrix);const ut=He.getUniforms(),ft=Wo.seqWithValue(ut.seq,ke);return G.currentProgram=He,G.uniformsList=ft,He}function Tu(C,q){const re=fe.get(C);re.outputColorSpace=q.outputColorSpace,re.instancing=q.instancing,re.skinning=q.skinning,re.morphTargets=q.morphTargets,re.morphNormals=q.morphNormals,re.morphColors=q.morphColors,re.morphTargetsCount=q.morphTargetsCount,re.numClippingPlanes=q.numClippingPlanes,re.numIntersection=q.numClipIntersection,re.vertexAlphas=q.vertexAlphas,re.vertexTangents=q.vertexTangents,re.toneMapping=q.toneMapping}function Ng(C,q,re,G,se){q.isScene!==!0&&(q=Ee),ee.resetTextureUnits();const Ce=q.fog,Ne=G.isMeshStandardMaterial?q.environment:null,Oe=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Rn,Fe=(G.isMeshStandardMaterial?le:ue).get(G.envMap||Ne),We=G.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,He=!!re.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),ke=!!re.morphAttributes.position,ut=!!re.morphAttributes.normal,ft=!!re.morphAttributes.color,on=G.toneMapped?x.toneMapping:Wn,Pn=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,ht=Pn!==void 0?Pn.length:0,$e=fe.get(G),Ha=m.state.lights;if(ge===!0&&(ye===!0||C!==E)){const Vt=C===E&&G.id===P;ne.setState(G,C,Vt)}let xt=!1;G.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==Ha.state.version||$e.outputColorSpace!==Oe||se.isInstancedMesh&&$e.instancing===!1||!se.isInstancedMesh&&$e.instancing===!0||se.isSkinnedMesh&&$e.skinning===!1||!se.isSkinnedMesh&&$e.skinning===!0||$e.envMap!==Fe||G.fog===!0&&$e.fog!==Ce||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==ne.numPlanes||$e.numIntersection!==ne.numIntersection)||$e.vertexAlphas!==We||$e.vertexTangents!==He||$e.morphTargets!==ke||$e.morphNormals!==ut||$e.morphColors!==ft||$e.toneMapping!==on||k.isWebGL2===!0&&$e.morphTargetsCount!==ht)&&(xt=!0):(xt=!0,$e.__version=G.version);let Si=$e.currentProgram;xt===!0&&(Si=io(G,q,se));let wu=!1,Jr=!1,ka=!1;const Pt=Si.getUniforms(),bi=$e.uniforms;if(V.useProgram(Si.program)&&(wu=!0,Jr=!0,ka=!0),G.id!==P&&(P=G.id,Jr=!0),wu||E!==C){if(Pt.setValue(M,"projectionMatrix",C.projectionMatrix),k.logarithmicDepthBuffer&&Pt.setValue(M,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),E!==C&&(E=C,Jr=!0,ka=!0),G.isShaderMaterial||G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshStandardMaterial||G.envMap){const Vt=Pt.map.cameraPosition;Vt!==void 0&&Vt.setValue(M,ce.setFromMatrixPosition(C.matrixWorld))}(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Pt.setValue(M,"isOrthographic",C.isOrthographicCamera===!0),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial||G.isShadowMaterial||se.isSkinnedMesh)&&Pt.setValue(M,"viewMatrix",C.matrixWorldInverse)}if(se.isSkinnedMesh){Pt.setOptional(M,se,"bindMatrix"),Pt.setOptional(M,se,"bindMatrixInverse");const Vt=se.skeleton;Vt&&(k.floatVertexTextures?(Vt.boneTexture===null&&Vt.computeBoneTexture(),Pt.setValue(M,"boneTexture",Vt.boneTexture,ee),Pt.setValue(M,"boneTextureSize",Vt.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const za=re.morphAttributes;if((za.position!==void 0||za.normal!==void 0||za.color!==void 0&&k.isWebGL2===!0)&&Re.update(se,re,Si),(Jr||$e.receiveShadow!==se.receiveShadow)&&($e.receiveShadow=se.receiveShadow,Pt.setValue(M,"receiveShadow",se.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(bi.envMap.value=Fe,bi.flipEnvMap.value=Fe.isCubeTexture&&Fe.isRenderTargetTexture===!1?-1:1),Jr&&(Pt.setValue(M,"toneMappingExposure",x.toneMappingExposure),$e.needsLights&&Og(bi,ka),Ce&&G.fog===!0&&te.refreshFogUniforms(bi,Ce),te.refreshMaterialUniforms(bi,G,$,Z,Ae),Wo.upload(M,$e.uniformsList,bi,ee)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Wo.upload(M,$e.uniformsList,bi,ee),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Pt.setValue(M,"center",se.center),Pt.setValue(M,"modelViewMatrix",se.modelViewMatrix),Pt.setValue(M,"normalMatrix",se.normalMatrix),Pt.setValue(M,"modelMatrix",se.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Vt=G.uniformsGroups;for(let Ga=0,Bg=Vt.length;Ga<Bg;Ga++)if(k.isWebGL2){const Au=Vt[Ga];Ue.update(Au,Si),Ue.bind(Au,Si)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Si}function Og(C,q){C.ambientLightColor.needsUpdate=q,C.lightProbe.needsUpdate=q,C.directionalLights.needsUpdate=q,C.directionalLightShadows.needsUpdate=q,C.pointLights.needsUpdate=q,C.pointLightShadows.needsUpdate=q,C.spotLights.needsUpdate=q,C.spotLightShadows.needsUpdate=q,C.rectAreaLights.needsUpdate=q,C.hemisphereLights.needsUpdate=q}function Fg(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(C,q,re){fe.get(C.texture).__webglTexture=q,fe.get(C.depthTexture).__webglTexture=re;const G=fe.get(C);G.__hasExternalTextures=!0,G.__hasExternalTextures&&(G.__autoAllocateDepthBuffer=re===void 0,G.__autoAllocateDepthBuffer||I.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,q){const re=fe.get(C);re.__webglFramebuffer=q,re.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(C,q=0,re=0){A=C,S=q,R=re;let G=!0,se=null,Ce=!1,Ne=!1;if(C){const Fe=fe.get(C);Fe.__useDefaultFramebuffer!==void 0?(V.bindFramebuffer(M.FRAMEBUFFER,null),G=!1):Fe.__webglFramebuffer===void 0?ee.setupRenderTarget(C):Fe.__hasExternalTextures&&ee.rebindTextures(C,fe.get(C.texture).__webglTexture,fe.get(C.depthTexture).__webglTexture);const We=C.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Ne=!0);const He=fe.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(se=He[q],Ce=!0):k.isWebGL2&&C.samples>0&&ee.useMultisampledRTT(C)===!1?se=fe.get(C).__webglMultisampledFramebuffer:se=He,T.copy(C.viewport),F.copy(C.scissor),H=C.scissorTest}else T.copy(de).multiplyScalar($).floor(),F.copy(X).multiplyScalar($).floor(),H=Q;if(V.bindFramebuffer(M.FRAMEBUFFER,se)&&k.drawBuffers&&G&&V.drawBuffers(C,se),V.viewport(T),V.scissor(F),V.setScissorTest(H),Ce){const Fe=fe.get(C.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_CUBE_MAP_POSITIVE_X+q,Fe.__webglTexture,re)}else if(Ne){const Fe=fe.get(C.texture),We=q||0;M.framebufferTextureLayer(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,Fe.__webglTexture,re||0,We)}P=-1},this.readRenderTargetPixels=function(C,q,re,G,se,Ce,Ne){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=fe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ne!==void 0&&(Oe=Oe[Ne]),Oe){V.bindFramebuffer(M.FRAMEBUFFER,Oe);try{const Fe=C.texture,We=Fe.format,He=Fe.type;if(We!==mn&&xe.convert(We)!==M.getParameter(M.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ke=He===Bs&&(I.has("EXT_color_buffer_half_float")||k.isWebGL2&&I.has("EXT_color_buffer_float"));if(He!==vi&&xe.convert(He)!==M.getParameter(M.IMPLEMENTATION_COLOR_READ_TYPE)&&!(He===fi&&(k.isWebGL2||I.has("OES_texture_float")||I.has("WEBGL_color_buffer_float")))&&!ke){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=C.width-G&&re>=0&&re<=C.height-se&&M.readPixels(q,re,G,se,xe.convert(We),xe.convert(He),Ce)}finally{const Fe=A!==null?fe.get(A).__webglFramebuffer:null;V.bindFramebuffer(M.FRAMEBUFFER,Fe)}}},this.copyFramebufferToTexture=function(C,q,re=0){const G=Math.pow(2,-re),se=Math.floor(q.image.width*G),Ce=Math.floor(q.image.height*G);ee.setTexture2D(q,0),M.copyTexSubImage2D(M.TEXTURE_2D,re,0,0,C.x,C.y,se,Ce),V.unbindTexture()},this.copyTextureToTexture=function(C,q,re,G=0){const se=q.image.width,Ce=q.image.height,Ne=xe.convert(re.format),Oe=xe.convert(re.type);ee.setTexture2D(re,0),M.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,re.flipY),M.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,re.premultiplyAlpha),M.pixelStorei(M.UNPACK_ALIGNMENT,re.unpackAlignment),q.isDataTexture?M.texSubImage2D(M.TEXTURE_2D,G,C.x,C.y,se,Ce,Ne,Oe,q.image.data):q.isCompressedTexture?M.compressedTexSubImage2D(M.TEXTURE_2D,G,C.x,C.y,q.mipmaps[0].width,q.mipmaps[0].height,Ne,q.mipmaps[0].data):M.texSubImage2D(M.TEXTURE_2D,G,C.x,C.y,Ne,Oe,q.image),G===0&&re.generateMipmaps&&M.generateMipmap(M.TEXTURE_2D),V.unbindTexture()},this.copyTextureToTexture3D=function(C,q,re,G,se=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ce=C.max.x-C.min.x+1,Ne=C.max.y-C.min.y+1,Oe=C.max.z-C.min.z+1,Fe=xe.convert(G.format),We=xe.convert(G.type);let He;if(G.isData3DTexture)ee.setTexture3D(G,0),He=M.TEXTURE_3D;else if(G.isDataArrayTexture)ee.setTexture2DArray(G,0),He=M.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}M.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,G.flipY),M.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),M.pixelStorei(M.UNPACK_ALIGNMENT,G.unpackAlignment);const ke=M.getParameter(M.UNPACK_ROW_LENGTH),ut=M.getParameter(M.UNPACK_IMAGE_HEIGHT),ft=M.getParameter(M.UNPACK_SKIP_PIXELS),on=M.getParameter(M.UNPACK_SKIP_ROWS),Pn=M.getParameter(M.UNPACK_SKIP_IMAGES),ht=re.isCompressedTexture?re.mipmaps[0]:re.image;M.pixelStorei(M.UNPACK_ROW_LENGTH,ht.width),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,ht.height),M.pixelStorei(M.UNPACK_SKIP_PIXELS,C.min.x),M.pixelStorei(M.UNPACK_SKIP_ROWS,C.min.y),M.pixelStorei(M.UNPACK_SKIP_IMAGES,C.min.z),re.isDataTexture||re.isData3DTexture?M.texSubImage3D(He,se,q.x,q.y,q.z,Ce,Ne,Oe,Fe,We,ht.data):re.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),M.compressedTexSubImage3D(He,se,q.x,q.y,q.z,Ce,Ne,Oe,Fe,ht.data)):M.texSubImage3D(He,se,q.x,q.y,q.z,Ce,Ne,Oe,Fe,We,ht),M.pixelStorei(M.UNPACK_ROW_LENGTH,ke),M.pixelStorei(M.UNPACK_IMAGE_HEIGHT,ut),M.pixelStorei(M.UNPACK_SKIP_PIXELS,ft),M.pixelStorei(M.UNPACK_SKIP_ROWS,on),M.pixelStorei(M.UNPACK_SKIP_IMAGES,Pn),se===0&&G.generateMipmaps&&M.generateMipmap(He),V.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?ee.setTextureCube(C,0):C.isData3DTexture?ee.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ee.setTexture2DArray(C,0):ee.setTexture2D(C,0),V.unbindTexture()},this.resetState=function(){S=0,R=0,A=null,V.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(e){console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!e}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ge?Vi:Hm}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Vi?Ge:Rn}}class xR extends Ac{}xR.prototype.isWebGL1Renderer=!0;class yR extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n}}class og extends Js{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ad=new z,ld=new z,cd=new Et,Ol=new Xm,Ho=new Ia;class MR extends zt{constructor(e=new Kn,n=new og){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)ad.fromBufferAttribute(n,r-1),ld.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=ad.distanceTo(ld);e.setAttribute("lineDistance",new Xn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ho.copy(i.boundingSphere),Ho.applyMatrix4(r),Ho.radius+=s,e.ray.intersectsSphere(Ho)===!1)return;cd.copy(r).invert(),Ol.copy(e.ray).applyMatrix4(cd);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new z,u=new z,f=new z,d=new z,p=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){const h=Math.max(0,o.start),v=Math.min(g.count,o.start+o.count);for(let x=h,y=v-1;x<y;x+=p){const S=g.getX(x),R=g.getX(x+1);if(c.fromBufferAttribute(m,S),u.fromBufferAttribute(m,R),Ol.distanceSqToSegment(c,u,d,f)>l)continue;d.applyMatrix4(this.matrixWorld);const P=e.ray.origin.distanceTo(d);P<e.near||P>e.far||n.push({distance:P,point:f.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const h=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let x=h,y=v-1;x<y;x+=p){if(c.fromBufferAttribute(m,x),u.fromBufferAttribute(m,x+1),Ol.distanceSqToSegment(c,u,d,f)>l)continue;d.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(d);R<e.near||R>e.far||n.push({distance:R,point:f.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}const ud=new z,fd=new z;class ER extends MR{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)ud.fromBufferAttribute(n,r),fd.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+ud.distanceTo(fd);e.setAttribute("lineDistance",new Xn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hd{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ut(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:mu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=mu);var Es=function(){var t=0,e=document.createElement("div");e.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",e.addEventListener("click",function(u){u.preventDefault(),i(++t%e.children.length)},!1);function n(u){return e.appendChild(u.dom),u}function i(u){for(var f=0;f<e.children.length;f++)e.children[f].style.display=f===u?"block":"none";t=u}var r=(performance||Date).now(),s=r,o=0,a=n(new Es.Panel("FPS","#0ff","#002")),l=n(new Es.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=n(new Es.Panel("MB","#f08","#201"));return i(0),{REVISION:16,dom:e,addPanel:n,showPanel:i,begin:function(){r=(performance||Date).now()},end:function(){o++;var u=(performance||Date).now();if(l.update(u-r,200),u>=s+1e3&&(a.update(o*1e3/(u-s),100),s=u,o=0,c)){var f=performance.memory;c.update(f.usedJSHeapSize/1048576,f.jsHeapSizeLimit/1048576)}return u},update:function(){r=this.end()},domElement:e,setMode:i}};Es.Panel=function(t,e,n){var i=1/0,r=0,s=Math.round,o=s(window.devicePixelRatio||1),a=80*o,l=48*o,c=3*o,u=2*o,f=3*o,d=15*o,p=74*o,g=30*o,_=document.createElement("canvas");_.width=a,_.height=l,_.style.cssText="width:80px;height:48px";var m=_.getContext("2d");return m.font="bold "+9*o+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=n,m.fillRect(0,0,a,l),m.fillStyle=e,m.fillText(t,c,u),m.fillRect(f,d,p,g),m.fillStyle=n,m.globalAlpha=.9,m.fillRect(f,d,p,g),{dom:_,update:function(h,v){i=Math.min(i,h),r=Math.max(r,h),m.fillStyle=n,m.globalAlpha=1,m.fillRect(0,0,a,d),m.fillStyle=e,m.fillText(s(h)+" "+t+" ("+s(i)+"-"+s(r)+")",c,u),m.drawImage(_,f+o,d,p-o,g,f,d,p-o,g),m.fillRect(f+p-o,d,o,g),m.fillStyle=n,m.globalAlpha=.9,m.fillRect(f+p-o,d,o,s((1-h/v)*g))}}};const SR=Es,As=class{constructor(){nt(this,"stop",!0);nt(this,"frameCount",0);nt(this,"fps",120);nt(this,"fpsInterval",1e3/this.fps);nt(this,"startTime",As._now());nt(this,"now",As._now());nt(this,"then",As._now());nt(this,"elapsed",0)}};let Xo=As;nt(Xo,"_now",()=>Date.now());function bR(t,e){return Math.atan(Math.tan(e/2*Math.PI/180)/t)*2*180/Math.PI}class ag{constructor(){nt(this,"container");nt(this,"height",0);nt(this,"width",0);nt(this,"left",0);nt(this,"bottom",0);nt(this,"horizontalFov",90);nt(this,"isMounted",!1)}get aspect(){return this.width/this.height}get verticalFov(){return bR(this.aspect,this.horizontalFov)}mount(e){this.container=e.container,this.resize(),this.isMounted=!0}}class TR extends ag{getOffset(e){var a;const n=e.getBoundingClientRect(),{webGLRenderer:i}=wm(Hs());if(!((a=i.value)!=null&&a.domElement))throw new Error("could not get renderer root dom element");const r=i.value.domElement,s=r.offsetTop+r.height-(n.y+n.height);return{left:n.left-r.offsetLeft,bottom:s}}resize(){const{left:e,bottom:n}=this.getOffset(this.container),{width:i,height:r}=this.container.getBoundingClientRect();this.height=r,this.width=i,this.left=e,this.bottom=n}destroy(){throw new Error("not implemented")}}class wR extends ag{resize(){this.height=this.container.clientHeight,this.width=this.container.clientWidth,this.left=0,this.bottom=0}destroy(){throw new Error("not implemented")}}const Hs=Tm("renderer",()=>{const t=Ke([]),e=Ke(new SR),n=Ke(new Xo),i=Ke(new wR),r=Ke(new Ac),s=Ke(!1);function o(h){r.value=new Ac({canvas:h.container}),i.value.mount({container:h.container}),s.value=!0}function a(h){const v=h.container.appendChild(e.value.dom);v.style.position="relative",v.style.overflow="hidden"}function l(){if(!r||!s.value)return;i.value.resize();const{width:h,height:v}=i.value;r.value.setSize(h,v,!0),t.value.forEach(x=>{x.camera.aspect=i.value.aspect,x.viewPort.resize()})}function c(h){h.view.mount(h.container),t.value.push(h.view)}function u(h){t.value.splice(t.value.findIndex(v=>v.id===h.viewId),1)}function f(h){if(!r)return;const{view:v,timeStepMS:x}=h;v.renderTickCallback(v,x);const{width:y,height:S,left:R,bottom:A}=v.viewPort;r.value.setViewport(R,A,y,S),r.value.setScissor(R,A,y,S),r.value.setScissorTest(!0),r.value.render(qe(v.scene),v.camera),v.camera.updateProjectionMatrix(),v.controls.update()}function d(){n.value.stop=!0}function p(){n.value.stop=!1,g()}function g(){if(requestAnimationFrame(()=>p()),n.value.now=Date.now(),n.value.elapsed=n.value.now-n.value.then,n.value.elapsed>n.value.fpsInterval&&!n.value.stop){n.value.then=n.value.now-n.value.elapsed%n.value.fpsInterval;const h=n.value.elapsed/1e3;t.value.forEach(v=>f({view:v,timeStepMS:h})),e.value.update()}}function _(h){for(const v of t.value)if(v.id===h.viewId)return v;throw new Error("no view with matching id was found")}async function m(h){const v=await _(h);if(typeof v[h.method]=="function")v[h.method](...h.args);else throw typeof v[h.method]>"u"?new TypeError("unable to call method, method undefined"):new TypeError("unable to call method with type of"+typeof v[h.method])}return{views:t,stats:e,webGLRenderer:r,renderLoop:n,rendererRootViewPort:i,isReady:s,init:o,initStats:a,resize:l,addView:c,removeView:u,renderView:f,stop:d,start:p,animate:g,getViewById:_,callViewMethod:m}}),AR=Cn({__name:"RendererRootViewPortComponent",setup(t){const e=Ke();return Ki(()=>{const n=Hs(),{init:i,resize:r,start:s}=n;if(!e.value)throw new Error("root container not found");i({container:e.value}),window.addEventListener("resize",r),window.addEventListener("orientation_change",r),s(),r()}),wa(()=>{var s;const n=Hs(),{resize:i,webGLRenderer:r}=n;for(window.removeEventListener("resize",i),window.removeEventListener("orientation_change",i),r==null||r.dispose();(s=e.value)!=null&&s.lastChild;)e.value.removeChild(e.value.lastChild)}),(n,i)=>(Mt(),ci("canvas",{id:"root",ref_key:"root",ref:e},null,512))}}),RR=Cn({__name:"ViewPortComponent",props:{view:{}},setup(t){const e=t,n=Ke({[e.view.id]:null});return Ki(()=>{const i=Hs(),{addView:r}=i,s=n.value[e.view.id];if(!e.view)throw new Error("view was not provided to viewport.");if(!s)throw new Error("could not get container for view");r({view:e.view,container:s})}),Yr(()=>{const i=Hs(),{removeView:r}=i;r({viewId:e.view.id})}),(i,r)=>(Mt(),ci("div",{ref:s=>et(n)[e.view.id]=s},null,512))}});function lg(t){const e=typeof t;return t!=null&&(e==="object"||e==="function")}const CR=typeof global=="object"&&global!==null&&global.Object===Object&&global,PR=typeof globalThis=="object"&&globalThis!==null&&globalThis.Object==Object&&globalThis,LR=typeof self=="object"&&self!==null&&self.Object===Object&&self,ko=PR||CR||LR||Function("return this")();function DR(t,e,n){let i,r,s,o,a,l,c=0,u=!1,f=!1,d=!0;const p=!e&&e!==0&&typeof ko.requestAnimationFrame=="function";if(typeof t!="function")throw new TypeError("Expected a function");e=+e||0,lg(n)&&(u=!!n.leading,f="maxWait"in n,s=f?Math.max(+n.maxWait||0,e):s,d="trailing"in n?!!n.trailing:d);function g(T){const F=i,H=r;return i=r=void 0,c=T,o=t.apply(H,F),o}function _(T,F){return p?(ko.cancelAnimationFrame(a),ko.requestAnimationFrame(T)):setTimeout(T,F)}function m(T){if(p)return ko.cancelAnimationFrame(T);clearTimeout(T)}function h(T){return c=T,a=_(y,e),u?g(T):o}function v(T){const F=T-l,H=T-c,N=e-F;return f?Math.min(N,s-H):N}function x(T){const F=T-l,H=T-c;return l===void 0||F>=e||F<0||f&&H>=s}function y(){const T=Date.now();if(x(T))return S(T);a=_(y,v(T))}function S(T){return a=void 0,d&&i?g(T):(i=r=void 0,o)}function R(){a!==void 0&&m(a),c=0,i=l=r=a=void 0}function A(){return a===void 0?o:S(Date.now())}function P(){return a!==void 0}function E(...T){const F=Date.now(),H=x(F);if(i=T,r=this,l=F,H){if(a===void 0)return h(l);if(f)return a=_(y,e),g(l)}return a===void 0&&(a=_(y,e)),o}return E.cancel=R,E.flush=A,E.pending=P,E}function vr(t,e,n){let i=!0,r=!0;if(typeof t!="function")throw new TypeError("Expected a function");return n&&lg(n)&&(i="leading"in n?!!n.leading:i,r="trailing"in n?!!n.trailing:r),DR(t,e,{leading:i,trailing:r,maxWait:e})}const At=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];function cg(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(At[t&255]+At[t>>8&255]+At[t>>16&255]+At[t>>24&255]+"-"+At[e&255]+At[e>>8&255]+"-"+At[e>>16&15|64]+At[e>>24&255]+"-"+At[n&63|128]+At[n>>8&255]+"-"+At[n>>16&255]+At[n>>24&255]+At[i&255]+At[i>>8&255]+At[i>>16&255]+At[i>>24&255]).toLowerCase()}function dd(t,e,n){return(1-n)*t+n*e}function ug(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]]);return n}var IR=function(){},pd=function(){};const Rc=(t,e,n)=>Math.min(Math.max(n,t),e),Fl=.001,UR=.01,md=10,NR=.05,OR=1;function FR({duration:t=800,bounce:e=.25,velocity:n=0,mass:i=1}){let r,s;IR(t<=md*1e3);let o=1-e;o=Rc(NR,OR,o),t=Rc(UR,md,t/1e3),o<1?(r=c=>{const u=c*o,f=u*t,d=u-n,p=Cc(c,o),g=Math.exp(-f);return Fl-d/p*g},s=c=>{const f=c*o*t,d=f*n+n,p=Math.pow(o,2)*Math.pow(c,2)*t,g=Math.exp(-f),_=Cc(Math.pow(c,2),o);return(-r(c)+Fl>0?-1:1)*((d-p)*g)/_}):(r=c=>{const u=Math.exp(-c*t),f=(c-n)*t+1;return-Fl+u*f},s=c=>{const u=Math.exp(-c*t),f=(n-c)*(t*t);return u*f});const a=5/t,l=HR(r,s,a);if(t=t*1e3,isNaN(l))return{stiffness:100,damping:10,duration:t};{const c=Math.pow(l,2)*i;return{stiffness:c,damping:o*2*Math.sqrt(i*c),duration:t}}}const BR=12;function HR(t,e,n){let i=n;for(let r=1;r<BR;r++)i=i-t(i)/e(i);return i}function Cc(t,e){return t*Math.sqrt(1-e*e)}const kR=["duration","bounce"],zR=["stiffness","damping","mass"];function gd(t,e){return e.some(n=>t[n]!==void 0)}function GR(t){let e=Object.assign({velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1},t);if(!gd(t,zR)&&gd(t,kR)){const n=FR(t);e=Object.assign(Object.assign(Object.assign({},e),n),{velocity:0,mass:1}),e.isResolvedFromDuration=!0}return e}function xu(t){var{from:e=0,to:n=1,restSpeed:i=2,restDelta:r}=t,s=ug(t,["from","to","restSpeed","restDelta"]);const o={done:!1,value:e};let{stiffness:a,damping:l,mass:c,velocity:u,duration:f,isResolvedFromDuration:d}=GR(s),p=_d,g=_d;function _(){const m=u?-(u/1e3):0,h=n-e,v=l/(2*Math.sqrt(a*c)),x=Math.sqrt(a/c)/1e3;if(r===void 0&&(r=Math.min(Math.abs(n-e)/100,.4)),v<1){const y=Cc(x,v);p=S=>{const R=Math.exp(-v*x*S);return n-R*((m+v*x*h)/y*Math.sin(y*S)+h*Math.cos(y*S))},g=S=>{const R=Math.exp(-v*x*S);return v*x*R*(Math.sin(y*S)*(m+v*x*h)/y+h*Math.cos(y*S))-R*(Math.cos(y*S)*(m+v*x*h)-y*h*Math.sin(y*S))}}else if(v===1)p=y=>n-Math.exp(-x*y)*(h+(m+x*h)*y);else{const y=x*Math.sqrt(v*v-1);p=S=>{const R=Math.exp(-v*x*S),A=Math.min(y*S,300);return n-R*((m+v*x*h)*Math.sinh(A)+y*h*Math.cosh(A))/y}}}return _(),{next:m=>{const h=p(m);if(d)o.done=m>=f;else{const v=g(m)*1e3,x=Math.abs(v)<=i,y=Math.abs(n-h)<=r;o.done=x&&y}return o.value=o.done?n:h,o},flipTarget:()=>{u=-u,[e,n]=[n,e],_()}}}xu.needsInterpolation=(t,e)=>typeof t=="string"||typeof e=="string";const _d=t=>0,fg=(t,e,n)=>{const i=e-t;return i===0?1:(n-t)/i},yu=(t,e,n)=>-n*t+n*e+t,hg=(t,e)=>n=>Math.max(Math.min(n,e),t),Ss=t=>t%1?Number(t.toFixed(5)):t,pa=/(-)?([\d]*\.?[\d])+/g,Pc=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,VR=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function eo(t){return typeof t=="string"}const Oa={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},dg=Object.assign(Object.assign({},Oa),{transform:hg(0,1)});Object.assign(Object.assign({},Oa),{default:1});const WR=t=>({test:e=>eo(e)&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),bs=WR("%");Object.assign(Object.assign({},bs),{parse:t=>bs.parse(t)/100,transform:t=>bs.transform(t*100)});const Mu=(t,e)=>n=>!!(eo(n)&&VR.test(n)&&n.startsWith(t)||e&&Object.prototype.hasOwnProperty.call(n,e)),pg=(t,e,n)=>i=>{if(!eo(i))return i;const[r,s,o,a]=i.match(pa);return{[t]:parseFloat(r),[e]:parseFloat(s),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},Fi={test:Mu("hsl","hue"),parse:pg("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:i=1})=>"hsla("+Math.round(t)+", "+bs.transform(Ss(e))+", "+bs.transform(Ss(n))+", "+Ss(dg.transform(i))+")"},XR=hg(0,255),Bl=Object.assign(Object.assign({},Oa),{transform:t=>Math.round(XR(t))}),di={test:Mu("rgb","red"),parse:pg("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:i=1})=>"rgba("+Bl.transform(t)+", "+Bl.transform(e)+", "+Bl.transform(n)+", "+Ss(dg.transform(i))+")"};function jR(t){let e="",n="",i="",r="";return t.length>5?(e=t.substr(1,2),n=t.substr(3,2),i=t.substr(5,2),r=t.substr(7,2)):(e=t.substr(1,1),n=t.substr(2,1),i=t.substr(3,1),r=t.substr(4,1),e+=e,n+=n,i+=i,r+=r),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:r?parseInt(r,16)/255:1}}const Lc={test:Mu("#"),parse:jR,transform:di.transform},Fa={test:t=>di.test(t)||Lc.test(t)||Fi.test(t),parse:t=>di.test(t)?di.parse(t):Fi.test(t)?Fi.parse(t):Lc.parse(t),transform:t=>eo(t)?t:t.hasOwnProperty("red")?di.transform(t):Fi.transform(t)},mg="${c}",gg="${n}";function qR(t){var e,n,i,r;return isNaN(t)&&eo(t)&&((n=(e=t.match(pa))===null||e===void 0?void 0:e.length)!==null&&n!==void 0?n:0)+((r=(i=t.match(Pc))===null||i===void 0?void 0:i.length)!==null&&r!==void 0?r:0)>0}function _g(t){typeof t=="number"&&(t=`${t}`);const e=[];let n=0;const i=t.match(Pc);i&&(n=i.length,t=t.replace(Pc,mg),e.push(...i.map(Fa.parse)));const r=t.match(pa);return r&&(t=t.replace(pa,gg),e.push(...r.map(Oa.parse))),{values:e,numColors:n,tokenised:t}}function vg(t){return _g(t).values}function xg(t){const{values:e,numColors:n,tokenised:i}=_g(t),r=e.length;return s=>{let o=i;for(let a=0;a<r;a++)o=o.replace(a<n?mg:gg,a<n?Fa.transform(s[a]):Ss(s[a]));return o}}const $R=t=>typeof t=="number"?0:t;function YR(t){const e=vg(t);return xg(t)(e.map($R))}const yg={test:qR,parse:vg,createTransformer:xg,getAnimatableNone:YR};function Hl(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function vd({hue:t,saturation:e,lightness:n,alpha:i}){t/=360,e/=100,n/=100;let r=0,s=0,o=0;if(!e)r=s=o=n;else{const a=n<.5?n*(1+e):n+e-n*e,l=2*n-a;r=Hl(l,a,t+1/3),s=Hl(l,a,t),o=Hl(l,a,t-1/3)}return{red:Math.round(r*255),green:Math.round(s*255),blue:Math.round(o*255),alpha:i}}const KR=(t,e,n)=>{const i=t*t,r=e*e;return Math.sqrt(Math.max(0,n*(r-i)+i))},ZR=[Lc,di,Fi],xd=t=>ZR.find(e=>e.test(t)),Mg=(t,e)=>{let n=xd(t),i=xd(e),r=n.parse(t),s=i.parse(e);n===Fi&&(r=vd(r),n=di),i===Fi&&(s=vd(s),i=di);const o=Object.assign({},r);return a=>{for(const l in o)l!=="alpha"&&(o[l]=KR(r[l],s[l],a));return o.alpha=yu(r.alpha,s.alpha,a),n.transform(o)}},JR=t=>typeof t=="number",QR=(t,e)=>n=>e(t(n)),Eg=(...t)=>t.reduce(QR);function Sg(t,e){return JR(t)?n=>yu(t,e,n):Fa.test(t)?Mg(t,e):Tg(t,e)}const bg=(t,e)=>{const n=[...t],i=n.length,r=t.map((s,o)=>Sg(s,e[o]));return s=>{for(let o=0;o<i;o++)n[o]=r[o](s);return n}},eC=(t,e)=>{const n=Object.assign(Object.assign({},t),e),i={};for(const r in n)t[r]!==void 0&&e[r]!==void 0&&(i[r]=Sg(t[r],e[r]));return r=>{for(const s in i)n[s]=i[s](r);return n}};function yd(t){const e=yg.parse(t),n=e.length;let i=0,r=0,s=0;for(let o=0;o<n;o++)i||typeof e[o]=="number"?i++:e[o].hue!==void 0?s++:r++;return{parsed:e,numNumbers:i,numRGB:r,numHSL:s}}const Tg=(t,e)=>{const n=yg.createTransformer(e),i=yd(t),r=yd(e);return i.numHSL===r.numHSL&&i.numRGB===r.numRGB&&i.numNumbers>=r.numNumbers?Eg(bg(i.parsed,r.parsed),n):o=>`${o>0?e:t}`},tC=(t,e)=>n=>yu(t,e,n);function nC(t){if(typeof t=="number")return tC;if(typeof t=="string")return Fa.test(t)?Mg:Tg;if(Array.isArray(t))return bg;if(typeof t=="object")return eC}function iC(t,e,n){const i=[],r=n||nC(t[0]),s=t.length-1;for(let o=0;o<s;o++){let a=r(t[o],t[o+1]);if(e){const l=Array.isArray(e)?e[o]:e;a=Eg(l,a)}i.push(a)}return i}function rC([t,e],[n]){return i=>n(fg(t,e,i))}function sC(t,e){const n=t.length,i=n-1;return r=>{let s=0,o=!1;if(r<=t[0]?o=!0:r>=t[i]&&(s=i-1,o=!0),!o){let l=1;for(;l<n&&!(t[l]>r||l===i);l++);s=l-1}const a=fg(t[s],t[s+1],r);return e[s](a)}}function wg(t,e,{clamp:n=!0,ease:i,mixer:r}={}){const s=t.length;pd(s===e.length),pd(!i||!Array.isArray(i)||i.length===s-1),t[0]>t[s-1]&&(t=[].concat(t),e=[].concat(e),t.reverse(),e.reverse());const o=iC(e,i,r),a=s===2?rC(t,o):sC(t,o);return n?l=>a(Rc(t[0],t[s-1],l)):a}const oC=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,aC=t=>e=>Math.pow(e,t),lC=t=>e=>e*e*((t+1)*e-t),cC=t=>{const e=lC(t);return n=>(n*=2)<1?.5*e(n):.5*(2-Math.pow(2,-10*(n-1)))},uC=1.525,fC=aC(2),hC=oC(fC);cC(uC);function dC(t,e){return t.map(()=>e||hC).splice(0,t.length-1)}function pC(t){const e=t.length;return t.map((n,i)=>i!==0?i/(e-1):0)}function mC(t,e){return t.map(n=>n*e)}function jo({from:t=0,to:e=1,ease:n,offset:i,duration:r=300}){const s={done:!1,value:t},o=Array.isArray(e)?e:[t,e],a=mC(i&&i.length===o.length?i:pC(o),r);function l(){return wg(a,o,{ease:Array.isArray(n)?n:dC(o,n)})}let c=l();return{next:u=>(s.value=c(u),s.done=u>=r,s),flipTarget:()=>{o.reverse(),c=l()}}}function gC({velocity:t=0,from:e=0,power:n=.8,timeConstant:i=350,restDelta:r=.5,modifyTarget:s}){const o={done:!1,value:e};let a=n*t;const l=e+a,c=s===void 0?l:s(l);return c!==l&&(a=c-e),{next:u=>{const f=-a*Math.exp(-u/i);return o.done=!(f>r||f<-r),o.value=o.done?c:c+f,o},flipTarget:()=>{}}}const Md={keyframes:jo,spring:xu,decay:gC};function _C(t){if(Array.isArray(t.to))return jo;if(Md[t.type])return Md[t.type];const e=new Set(Object.keys(t));return e.has("ease")||e.has("duration")&&!e.has("dampingRatio")?jo:e.has("dampingRatio")||e.has("stiffness")||e.has("mass")||e.has("damping")||e.has("restSpeed")||e.has("restDelta")?xu:jo}const Ag=1/60*1e3,vC=typeof performance<"u"?()=>performance.now():()=>Date.now(),Rg=typeof window<"u"?t=>window.requestAnimationFrame(t):t=>setTimeout(()=>t(vC()),Ag);function xC(t){let e=[],n=[],i=0,r=!1,s=!1;const o=new WeakSet,a={schedule:(l,c=!1,u=!1)=>{const f=u&&r,d=f?e:n;return c&&o.add(l),d.indexOf(l)===-1&&(d.push(l),f&&r&&(i=e.length)),l},cancel:l=>{const c=n.indexOf(l);c!==-1&&n.splice(c,1),o.delete(l)},process:l=>{if(r){s=!0;return}if(r=!0,[e,n]=[n,e],n.length=0,i=e.length,i)for(let c=0;c<i;c++){const u=e[c];u(l),o.has(u)&&(a.schedule(u),t())}r=!1,s&&(s=!1,a.process(l))}};return a}const yC=40;let Dc=!0,ks=!1,Ic=!1;const Ts={delta:0,timestamp:0},to=["read","update","preRender","render","postRender"],Ba=to.reduce((t,e)=>(t[e]=xC(()=>ks=!0),t),{}),MC=to.reduce((t,e)=>{const n=Ba[e];return t[e]=(i,r=!1,s=!1)=>(ks||bC(),n.schedule(i,r,s)),t},{}),EC=to.reduce((t,e)=>(t[e]=Ba[e].cancel,t),{});to.reduce((t,e)=>(t[e]=()=>Ba[e].process(Ts),t),{});const SC=t=>Ba[t].process(Ts),Cg=t=>{ks=!1,Ts.delta=Dc?Ag:Math.max(Math.min(t-Ts.timestamp,yC),1),Ts.timestamp=t,Ic=!0,to.forEach(SC),Ic=!1,ks&&(Dc=!1,Rg(Cg))},bC=()=>{ks=!0,Dc=!0,Ic||Rg(Cg)},TC=MC;function Pg(t,e,n=0){return t-e-n}function wC(t,e,n=0,i=!0){return i?Pg(e+-t,e,n):e-(t-e)+n}function AC(t,e,n,i){return i?t>=e+n:t<=-n}const RC=t=>{const e=({delta:n})=>t(n);return{start:()=>TC.update(e,!0),stop:()=>EC.update(e)}};function CC(t){var e,n,{from:i,autoplay:r=!0,driver:s=RC,elapsed:o=0,repeat:a=0,repeatType:l="loop",repeatDelay:c=0,onPlay:u,onStop:f,onComplete:d,onRepeat:p,onUpdate:g}=t,_=ug(t,["from","autoplay","driver","elapsed","repeat","repeatType","repeatDelay","onPlay","onStop","onComplete","onRepeat","onUpdate"]);let{to:m}=_,h,v=0,x=_.duration,y,S=!1,R=!0,A;const P=_C(_);!((n=(e=P).needsInterpolation)===null||n===void 0)&&n.call(e,i,m)&&(A=wg([0,100],[i,m],{clamp:!1}),i=0,m=100);const E=P(Object.assign(Object.assign({},_),{from:i,to:m}));function T(){v++,l==="reverse"?(R=v%2===0,o=wC(o,x,c,R)):(o=Pg(o,x,c),l==="mirror"&&E.flipTarget()),S=!1,p&&p()}function F(){h.stop(),d&&d()}function H(U){if(R||(U=-U),o+=U,!S){const W=E.next(Math.max(0,o));y=W.value,A&&(y=A(y)),S=R?W.done:o<=0}g==null||g(y),S&&(v===0&&(x??(x=o)),v<a?AC(o,x,c,R)&&T():F())}function N(){u==null||u(),h=s(H),h.start()}return r&&N(),{stop:()=>{f==null||f(),h.stop()}}}function Ed(t){const e=t.map(s=>s.probability);if(t.length!==e.length)throw new Error("Items and weights must be of the same size");if(!t.length)throw new Error("Items must not be empty");const n=[];for(let s=0;s<e.length;s+=1)n[s]=e[s]+(n[s-1]||0);const r=n[n.length-1]*Math.random();for(let s=0;s<t.length;s+=1)if(n[s]>=r)return t[s];return t[0]}let De;const gn=new Array(32).fill(void 0);gn.push(void 0,null,!0,!1);function oi(t){return gn[t]}let ws=gn.length;function PC(t){t<36||(gn[t]=ws,ws=t)}function LC(t){const e=oi(t);return PC(t),e}const Lg=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});Lg.decode();let qo=new Uint8Array;function $o(){return qo.byteLength===0&&(qo=new Uint8Array(De.memory.buffer)),qo}function Uc(t,e){return Lg.decode($o().subarray(t,t+e))}function Mr(t){ws===gn.length&&gn.push(gn.length+1);const e=ws;return ws=gn[e],gn[e]=t,e}let pi=0;const Yo=new TextEncoder("utf-8"),DC=typeof Yo.encodeInto=="function"?function(t,e){return Yo.encodeInto(t,e)}:function(t,e){const n=Yo.encode(t);return e.set(n),{read:t.length,written:n.length}};function Tr(t,e,n){if(n===void 0){const a=Yo.encode(t),l=e(a.length);return $o().subarray(l,l+a.length).set(a),pi=a.length,l}let i=t.length,r=e(i);const s=$o();let o=0;for(;o<i;o++){const a=t.charCodeAt(o);if(a>127)break;s[r+o]=a}if(o!==i){o!==0&&(t=t.slice(o)),r=n(r,i,i=o+t.length*3);const a=$o().subarray(r+o,r+i),l=DC(t,a);o+=l.written}return pi=o,r}function IC(t,e){if(!(t instanceof e))throw new Error(`expected instance of ${e.name}`);return t.ptr}let Ko=32;function UC(t){if(Ko==1)throw new Error("out of js stack");return gn[--Ko]=t,Ko}let Zo=new Int32Array;function Sd(){return Zo.byteLength===0&&(Zo=new Int32Array(De.memory.buffer)),Zo}function NC(t,e){try{return t.apply(this,e)}catch(n){De.__wbindgen_exn_store(Mr(n))}}class zs{static __wrap(e){const n=Object.create(zs.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();De.__wbg_birdconfig_free(e)}get probability(){return De.__wbg_get_birdconfig_probability(this.ptr)}set probability(e){De.__wbg_set_birdconfig_probability(this.ptr,e)}get neighbor_distance(){return De.__wbg_get_birdconfig_neighbor_distance(this.ptr)}set neighbor_distance(e){De.__wbg_set_birdconfig_neighbor_distance(this.ptr,e)}get desired_separation(){return De.__wbg_get_birdconfig_desired_separation(this.ptr)}set desired_separation(e){De.__wbg_set_birdconfig_desired_separation(this.ptr,e)}get separation_multiplier(){return De.__wbg_get_birdconfig_separation_multiplier(this.ptr)}set separation_multiplier(e){De.__wbg_set_birdconfig_separation_multiplier(this.ptr,e)}get alignment_multiplier(){return De.__wbg_get_birdconfig_alignment_multiplier(this.ptr)}set alignment_multiplier(e){De.__wbg_set_birdconfig_alignment_multiplier(this.ptr,e)}get cohesion_multiplier(){return De.__wbg_get_birdconfig_cohesion_multiplier(this.ptr)}set cohesion_multiplier(e){De.__wbg_set_birdconfig_cohesion_multiplier(this.ptr,e)}get max_speed(){return De.__wbg_get_birdconfig_max_speed(this.ptr)}set max_speed(e){De.__wbg_set_birdconfig_max_speed(this.ptr,e)}get max_force(){return De.__wbg_get_birdconfig_max_force(this.ptr)}set max_force(e){De.__wbg_set_birdconfig_max_force(this.ptr,e)}get bird_size(){return De.__wbg_get_birdconfig_bird_size(this.ptr)}set bird_size(e){De.__wbg_set_birdconfig_bird_size(this.ptr,e)}get color_r(){return De.__wbg_get_birdconfig_color_r(this.ptr)}set color_r(e){De.__wbg_set_birdconfig_color_r(this.ptr,e)}get color_g(){return De.__wbg_get_birdconfig_color_g(this.ptr)}set color_g(e){De.__wbg_set_birdconfig_color_g(this.ptr,e)}get color_b(){return De.__wbg_get_birdconfig_color_b(this.ptr)}set color_b(e){De.__wbg_set_birdconfig_color_b(this.ptr,e)}get id(){try{const i=De.__wbindgen_add_to_stack_pointer(-16);De.birdconfig_id(i,this.ptr);var e=Sd()[i/4+0],n=Sd()[i/4+1];return Uc(e,n)}finally{De.__wbindgen_add_to_stack_pointer(16),De.__wbindgen_free(e,n)}}set id(e){const n=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),i=pi;De.birdconfig_set_id(this.ptr,n,i)}static new(e,n,i,r,s,o,a,l,c,u,f,d,p){const g=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),_=pi,m=De.birdconfig_new(g,_,n,i,r,s,o,a,l,c,u,f,d,p);return zs.__wrap(m)}}class ma{static __wrap(e){const n=Object.create(ma.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();De.__wbg_flock_free(e)}constructor(e,n){const i=De.flock_new(e,n);return ma.__wrap(i)}get max_flock_size(){return De.flock_max_flock_size(this.ptr)>>>0}set max_flock_size(e){De.flock_set_max_flock_size(this.ptr,e)}get current_flock_size(){return De.flock_current_flock_size(this.ptr)>>>0}add_bird(e,n,i){const r=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),s=pi;De.flock_add_bird(this.ptr,r,s,n,i)}add_bird_at_random_position(e,n,i){const r=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),s=pi;De.flock_add_bird_at_random_position(this.ptr,r,s,n,i)}insert_bird_config(e,n){const i=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),r=pi;IC(n,zs);var s=n.ptr;n.ptr=0,De.flock_insert_bird_config(this.ptr,i,r,s)}remove_bird_config(e){const n=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),i=pi;De.flock_remove_bird_config(this.ptr,n,i)}update(e,n,i,r){try{De.flock_update(this.ptr,e,n,i,UC(r))}finally{gn[Ko++]=void 0}}}async function OC(t,e){if(typeof Response=="function"&&t instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(t,e)}catch(i){if(t.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",i);else throw i}const n=await t.arrayBuffer();return await WebAssembly.instantiate(n,e)}else{const n=await WebAssembly.instantiate(t,e);return n instanceof WebAssembly.Instance?{instance:n,module:t}:n}}function FC(){const t={};return t.wbg={},t.wbg.__wbindgen_object_drop_ref=function(e){LC(e)},t.wbg.__wbg_log_e22a238abcadd0a4=function(e,n){console.log(Uc(e,n))},t.wbg.__wbg_call_3999bee59e9f7719=function(){return NC(function(e,n,i,r){const s=oi(e).call(oi(n),oi(i),oi(r));return Mr(s)},arguments)},t.wbg.__wbg_buffer_3f3d764d4747d564=function(e){const n=oi(e).buffer;return Mr(n)},t.wbg.__wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4=function(e,n,i){const r=new Float32Array(oi(e),n>>>0,i>>>0);return Mr(r)},t.wbg.__wbg_new_4d6520efe4ca3e24=function(e){const n=new Float32Array(oi(e));return Mr(n)},t.wbg.__wbindgen_throw=function(e,n){throw new Error(Uc(e,n))},t.wbg.__wbindgen_memory=function(){const e=De.memory;return Mr(e)},t}function BC(t,e){return De=t.exports,Dg.__wbindgen_wasm_module=e,Zo=new Int32Array,qo=new Uint8Array,De}async function Dg(t){typeof t>"u"&&(t=new URL(""+new URL("flock_bg.a2c4915c.wasm",import.meta.url).href,self.location));const e=FC();(typeof t=="string"||typeof Request=="function"&&t instanceof Request||typeof URL=="function"&&t instanceof URL)&&(t=fetch(t));const{instance:n,module:i}=await OC(await t,e);return BC(n,i)}const zo=[{navy:{50:"#f6f9f8",100:"#e4f1f7",200:"#c2e1ec",300:"#90c2d4",400:"#579db4",500:"#407c93",600:"#346276",700:"#2b495a",800:"#1e3140",900:"#121e2a"},turquoise:{50:"#eef5f4",100:"#cff0f2",200:"#98e7e1",300:"#5dcdbe",400:"#23af93",500:"#18946b",600:"#167e53",700:"#156142",800:"#104232",900:"#0b2825"},gold:{50:"#fbf9f3",100:"#f8efb9",200:"#f0dd7d",300:"#d9b94c",400:"#b89029",500:"#987114",600:"#7c580d",700:"#5f420c",800:"#412d0b",900:"#2c1c08"},cocoa:{50:"#fcfaf6",100:"#faefce",200:"#f4d89f",300:"#e3b16b",400:"#d18540",500:"#b86424",600:"#9b4a17",700:"#773714",800:"#532610",900:"#36180b"},coral:{50:"#fcfbf9",100:"#fbf0e3",200:"#f7d3c6",300:"#eba798",400:"#e4786a",500:"#d45547",600:"#ba3b30",700:"#932c25",800:"#681f1a",900:"#41130f"}}],bd={primary:zo[0].turquoise,secondary:zo[0].coral,highlight:zo[0].gold,compliment:zo[0].navy};function HC(t,e){return t.length>e?t.slice(0,e-1):t}function Tn(t,e){return Math.random()*(e-t)+t}function kl(t,e){return Math.round(Tn(t,e))}function kC(){const t=Tn(0,1),e=Tn(0,1),n=Tn(0,1);return new Je(t,e,n)}const zC="default",GC=1200;function Ig(){return HC(cg(),8)}function _1(){return{id:Ig(),probability:kl(25,75),neighborDistance:kl(0,50),desiredSeparation:kl(50,250),separationMultiplier:Tn(.001,1.2),alignmentMultiplier:Tn(.001,1.2),cohesionMultiplier:Tn(.001,1.2),maxForce:Tn(.001,.5),maxSpeed:Tn(.001,10),birdColor:"#"+kC().getHexString(),birdSize:Tn(3,15),wasmObject:void 0}}const Td=Tm("background",()=>{const t=Ke(new Map),e=Ke(!1),n=Ke(!1),i=Ke(!1),r=Ke(1),s=Ke(GC),o=Ke({});async function a(){await Dg(),o.value=new ma(s.value,BigInt(new Date().getUTCMilliseconds())),u({id:Ig(),probability:10,neighborDistance:30,desiredSeparation:40,separationMultiplier:.3,alignmentMultiplier:.01,cohesionMultiplier:.01,maxSpeed:7,maxForce:.7,birdSize:10,birdColor:bd.secondary[400]}),u({id:zC,probability:80,neighborDistance:40,desiredSeparation:25,separationMultiplier:.5,alignmentMultiplier:.5,cohesionMultiplier:.3,maxSpeed:5,maxForce:.33,birdSize:12,birdColor:bd.primary[500]}),n.value=!0}function l(){var _;t.value.forEach(m=>{var h;m&&((h=m.wasmObject)==null||h.free())}),(_=o.value)==null||_.free()}function c(_){o.value&&(o.value.max_flock_size=_)}function u(_){if(!o.value)throw new Error("[background.vuex] cannot add config, flock doesn't exist.");const m=new Je(_.birdColor);if(_.wasmObject=zs.new(_.id,_.probability,_.neighborDistance,_.desiredSeparation,_.separationMultiplier,_.alignmentMultiplier,_.cohesionMultiplier,_.maxSpeed,_.maxForce,_.birdSize,m.r,m.g,m.b),!_.wasmObject)throw new Error("wasm object could not be generated for bird config");t.value.set(_.id,_),o.value.insert_bird_config(_.id,_.wasmObject)}function f(_){if(!o.value)throw new Error("[background.vuex] cannot remove config, flock doesn't exist.");if(!t.value.get(_))throw new Error("[background.vuex] cannot remove config, cannot find matching config.");o.value.remove_bird_config(_),t.value.delete(_)}function d(_){o.value&&o.value.update(_.sceneWidth,_.sceneHeight,_.timeStep?_.timeStep:r.value,_.updateFlockGeometryCallback)}function p(_){if(!o.value)return;const m=Ed([...t.value.values()]);o.value.add_bird_at_random_position(m.id,_.viewWidth,_.viewHeight)}function g(_){if(!o.value)return;const m=Ed([...t.value.values()]);o.value.add_bird(m.id,_.x,_.y)}return{birdConfigs:t,isDragging:e,isReady:n,updating:i,timeStep:r,maxFlockSize:s,updateMaxFlockSize:c,flock:o,init:a,dispose:l,addOrUpdateBirdConfig:u,removeBirdConfig:f,updateFlock:d,addBirdAtRandomPosition:p,addBirdAtPosition:g}}),wd={type:"change"},zl={type:"start"},Ad={type:"end"};class VC extends Zi{constructor(e,n){super(),this.object=e,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new z,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:er.ROTATE,MIDDLE:er.DOLLY,RIGHT:er.PAN},this.touches={ONE:tr.ROTATE,TWO:tr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",ue),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ue),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(wd),i.update(),s=r.NONE},this.update=function(){const L=new z,ne=new qi().setFromUnitVectors(e.up,new z(0,1,0)),pe=ne.clone().invert(),K=new z,Re=new qi,Pe=new z,Le=2*Math.PI;return function(){const Me=i.object.position;L.copy(Me).sub(i.target),L.applyQuaternion(ne),a.setFromVector3(L),i.autoRotate&&s===r.NONE&&E(A()),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Ue=i.minAzimuthAngle,je=i.maxAzimuthAngle;return isFinite(Ue)&&isFinite(je)&&(Ue<-Math.PI?Ue+=Le:Ue>Math.PI&&(Ue-=Le),je<-Math.PI?je+=Le:je>Math.PI&&(je-=Le),Ue<=je?a.theta=Math.max(Ue,Math.min(je,a.theta)):a.theta=a.theta>(Ue+je)/2?Math.max(Ue,a.theta):Math.min(je,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),a.radius*=c,a.radius=Math.max(i.minDistance,Math.min(i.maxDistance,a.radius)),i.enableDamping===!0?i.target.addScaledVector(u,i.dampingFactor):i.target.add(u),L.setFromSpherical(a),L.applyQuaternion(pe),Me.copy(i.target).add(L),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,u.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),u.set(0,0,0)),c=1,f||K.distanceToSquared(i.object.position)>o||8*(1-Re.dot(i.object.quaternion))>o||Pe.distanceToSquared(i.target)>0?(i.dispatchEvent(wd),K.copy(i.object.position),Re.copy(i.object.quaternion),Pe.copy(i.target),f=!1,!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",w),i.domElement.removeEventListener("pointerdown",I),i.domElement.removeEventListener("pointercancel",V),i.domElement.removeEventListener("wheel",ee),i.domElement.removeEventListener("pointermove",k),i.domElement.removeEventListener("pointerup",V),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",ue),i._domElementKeyEvents=null)};const i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const o=1e-6,a=new hd,l=new hd;let c=1;const u=new z;let f=!1;const d=new Xe,p=new Xe,g=new Xe,_=new Xe,m=new Xe,h=new Xe,v=new Xe,x=new Xe,y=new Xe,S=[],R={};function A(){return 2*Math.PI/60/60*i.autoRotateSpeed}function P(){return Math.pow(.95,i.zoomSpeed)}function E(L){l.theta-=L}function T(L){l.phi-=L}const F=function(){const L=new z;return function(pe,K){L.setFromMatrixColumn(K,0),L.multiplyScalar(-pe),u.add(L)}}(),H=function(){const L=new z;return function(pe,K){i.screenSpacePanning===!0?L.setFromMatrixColumn(K,1):(L.setFromMatrixColumn(K,0),L.crossVectors(i.object.up,L)),L.multiplyScalar(pe),u.add(L)}}(),N=function(){const L=new z;return function(pe,K){const Re=i.domElement;if(i.object.isPerspectiveCamera){const Pe=i.object.position;L.copy(Pe).sub(i.target);let Le=L.length();Le*=Math.tan(i.object.fov/2*Math.PI/180),F(2*pe*Le/Re.clientHeight,i.object.matrix),H(2*K*Le/Re.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(F(pe*(i.object.right-i.object.left)/i.object.zoom/Re.clientWidth,i.object.matrix),H(K*(i.object.top-i.object.bottom)/i.object.zoom/Re.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function U(L){i.object.isPerspectiveCamera?c/=L:i.object.isOrthographicCamera?(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom*L)),i.object.updateProjectionMatrix(),f=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function W(L){i.object.isPerspectiveCamera?c*=L:i.object.isOrthographicCamera?(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/L)),i.object.updateProjectionMatrix(),f=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function Z(L){d.set(L.clientX,L.clientY)}function $(L){v.set(L.clientX,L.clientY)}function Y(L){_.set(L.clientX,L.clientY)}function he(L){p.set(L.clientX,L.clientY),g.subVectors(p,d).multiplyScalar(i.rotateSpeed);const ne=i.domElement;E(2*Math.PI*g.x/ne.clientHeight),T(2*Math.PI*g.y/ne.clientHeight),d.copy(p),i.update()}function de(L){x.set(L.clientX,L.clientY),y.subVectors(x,v),y.y>0?U(P()):y.y<0&&W(P()),v.copy(x),i.update()}function X(L){m.set(L.clientX,L.clientY),h.subVectors(m,_).multiplyScalar(i.panSpeed),N(h.x,h.y),_.copy(m),i.update()}function Q(L){L.deltaY<0?W(P()):L.deltaY>0&&U(P()),i.update()}function _e(L){let ne=!1;switch(L.code){case i.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?T(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(0,i.keyPanSpeed),ne=!0;break;case i.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?T(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(0,-i.keyPanSpeed),ne=!0;break;case i.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?E(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(i.keyPanSpeed,0),ne=!0;break;case i.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?E(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(-i.keyPanSpeed,0),ne=!0;break}ne&&(L.preventDefault(),i.update())}function ge(){if(S.length===1)d.set(S[0].pageX,S[0].pageY);else{const L=.5*(S[0].pageX+S[1].pageX),ne=.5*(S[0].pageY+S[1].pageY);d.set(L,ne)}}function ye(){if(S.length===1)_.set(S[0].pageX,S[0].pageY);else{const L=.5*(S[0].pageX+S[1].pageX),ne=.5*(S[0].pageY+S[1].pageY);_.set(L,ne)}}function Ae(){const L=S[0].pageX-S[1].pageX,ne=S[0].pageY-S[1].pageY,pe=Math.sqrt(L*L+ne*ne);v.set(0,pe)}function j(){i.enableZoom&&Ae(),i.enablePan&&ye()}function oe(){i.enableZoom&&Ae(),i.enableRotate&&ge()}function ce(L){if(S.length==1)p.set(L.pageX,L.pageY);else{const pe=ae(L),K=.5*(L.pageX+pe.x),Re=.5*(L.pageY+pe.y);p.set(K,Re)}g.subVectors(p,d).multiplyScalar(i.rotateSpeed);const ne=i.domElement;E(2*Math.PI*g.x/ne.clientHeight),T(2*Math.PI*g.y/ne.clientHeight),d.copy(p)}function Ee(L){if(S.length===1)m.set(L.pageX,L.pageY);else{const ne=ae(L),pe=.5*(L.pageX+ne.x),K=.5*(L.pageY+ne.y);m.set(pe,K)}h.subVectors(m,_).multiplyScalar(i.panSpeed),N(h.x,h.y),_.copy(m)}function we(L){const ne=ae(L),pe=L.pageX-ne.x,K=L.pageY-ne.y,Re=Math.sqrt(pe*pe+K*K);x.set(0,Re),y.set(0,Math.pow(x.y/v.y,i.zoomSpeed)),U(y.y),v.copy(x)}function M(L){i.enableZoom&&we(L),i.enablePan&&Ee(L)}function D(L){i.enableZoom&&we(L),i.enableRotate&&ce(L)}function I(L){i.enabled!==!1&&(S.length===0&&(i.domElement.setPointerCapture(L.pointerId),i.domElement.addEventListener("pointermove",k),i.domElement.addEventListener("pointerup",V)),b(L),L.pointerType==="touch"?le(L):ie(L))}function k(L){i.enabled!==!1&&(L.pointerType==="touch"?be(L):fe(L))}function V(L){B(L),S.length===0&&(i.domElement.releasePointerCapture(L.pointerId),i.domElement.removeEventListener("pointermove",k),i.domElement.removeEventListener("pointerup",V)),i.dispatchEvent(Ad),s=r.NONE}function ie(L){let ne;switch(L.button){case 0:ne=i.mouseButtons.LEFT;break;case 1:ne=i.mouseButtons.MIDDLE;break;case 2:ne=i.mouseButtons.RIGHT;break;default:ne=-1}switch(ne){case er.DOLLY:if(i.enableZoom===!1)return;$(L),s=r.DOLLY;break;case er.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(i.enablePan===!1)return;Y(L),s=r.PAN}else{if(i.enableRotate===!1)return;Z(L),s=r.ROTATE}break;case er.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(i.enableRotate===!1)return;Z(L),s=r.ROTATE}else{if(i.enablePan===!1)return;Y(L),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(zl)}function fe(L){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;he(L);break;case r.DOLLY:if(i.enableZoom===!1)return;de(L);break;case r.PAN:if(i.enablePan===!1)return;X(L);break}}function ee(L){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(L.preventDefault(),i.dispatchEvent(zl),Q(L),i.dispatchEvent(Ad))}function ue(L){i.enabled===!1||i.enablePan===!1||_e(L)}function le(L){switch(te(L),S.length){case 1:switch(i.touches.ONE){case tr.ROTATE:if(i.enableRotate===!1)return;ge(),s=r.TOUCH_ROTATE;break;case tr.PAN:if(i.enablePan===!1)return;ye(),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case tr.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;j(),s=r.TOUCH_DOLLY_PAN;break;case tr.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;oe(),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(zl)}function be(L){switch(te(L),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;ce(L),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;Ee(L),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;M(L),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;D(L),i.update();break;default:s=r.NONE}}function w(L){i.enabled!==!1&&L.preventDefault()}function b(L){S.push(L)}function B(L){delete R[L.pointerId];for(let ne=0;ne<S.length;ne++)if(S[ne].pointerId==L.pointerId){S.splice(ne,1);return}}function te(L){let ne=R[L.pointerId];ne===void 0&&(ne=new Xe,R[L.pointerId]=ne),ne.set(L.pageX,L.pageY)}function ae(L){const ne=L.pointerId===S[0].pointerId?S[1]:S[0];return R[ne.pointerId]}i.domElement.addEventListener("contextmenu",w),i.domElement.addEventListener("pointerdown",I),i.domElement.addEventListener("pointercancel",V),i.domElement.addEventListener("wheel",ee,{passive:!1}),this.update()}}class WC{constructor(e){nt(this,"options");nt(this,"id",cg());nt(this,"background",new Je("black"));nt(this,"scene",new yR);nt(this,"viewPort",new TR);nt(this,"camera");nt(this,"controls");this.options=e,Object.assign(this,e)}renderTickCallback(e,n){throw new Error("not implemented.")}get isMounted(){return this.viewPort.isMounted||!1}get visibleHeightAtZDepth(){const e=this.camera.position.z,n=this.camera.fov*Math.PI/180;return 2*Math.tan(n/2)*Math.abs(e)}get visibleWidthAtZDepth(){return this.visibleHeightAtZDepth*this.camera.aspect}mount(e){this.viewPort.mount({container:e});const i={...{fov:75,near:.1,far:1e4},...this.options.cameraOptions},{fov:r,near:s,far:o}=i;this.camera=new tn(r,this.viewPort.aspect,s,o);const l={...{minAzimuthAngle:0,minPolarAngle:0,enableRotate:!1,enabled:!1},...this.options.controlsOptions};if(this.controls=new VC(this.camera,this.viewPort.container),this.camera.aspect=this.viewPort.aspect,this.controls.minAzimuthAngle=l.minAzimuthAngle,this.controls.minPolarAngle=l.minPolarAngle,this.controls.enableRotate=l.enableRotate,this.controls.enabled=l.enabled,this.controls.maxDistance=this.camera.far,this.controls.minDistance=this.camera.near,i.startingPosition){const{x:c,y:u,z:f}=i.startingPosition;this.controls.center=new z(c,u,f),this.camera.position.set(c,u,f),this.camera.updateMatrix()}if(l.startDirection){const{x:c,y:u,z:f}=l.startDirection;this.controls.target=new z(c,u,f),this.camera.lookAt(c,u,f),this.camera.updateMatrix()}this.viewPort.isMounted=!0}positionCamera(e){const{x:n,y:i,z:r}=e;this.controls.center=new z(n,i,r),this.camera.position.set(n,i,r),this.controls.target=new z(n,i,0),this.camera.lookAt(n,i,0),this.camera.updateMatrix()}removeEntities(...e){this.scene.children=this.scene.children.filter(n=>!e.includes(n))}}const XC=Cn({__name:"BackgroundWrapper",setup(t){const e=Td(),{init:n,dispose:i,addBirdAtRandomPosition:r,addBirdAtPosition:s}=e,{isDragging:o,maxFlockSize:a,flock:l}=wm(e);let c;const u=Ke(null),f=Ke(null),d=Ke(null),p=Ke(null);Ki(async()=>{u.value=new WC({cameraOptions:{fov:75,near:.1,far:1200,startingPosition:new z(0,0,1e3)},controlsOptions:{startDirection:new z(0,0,0),enabled:!1},id:"BACKGROUND_VIEW",background:new Je("black"),renderTickCallback:_}),f.value=new Kn,d.value=new og({vertexColors:!0}),p.value=new ER(f.value,d.value),u.value.scene.add(p.value),await n();const x=CC({from:0,to:100,duration:1e3*10,onUpdate:function(){l.value&&l.value.current_flock_size>a.value&&x.stop(),u.value&&r({viewWidth:u.value.visibleWidthAtZDepth,viewHeight:u.value.visibleHeightAtZDepth})}});window.addEventListener("touchstart",vr(h,40),!1),window.addEventListener("touchmove",vr(h,40),!1),window.addEventListener("mousedown",()=>o.value=!0,!1),window.addEventListener("mousemove",vr(m,40),!1),window.addEventListener("mouseup",()=>o.value=!1,!1)}),wa(()=>{window.removeEventListener("touchstart",vr(h,40),!1),window.removeEventListener("touchmove",vr(h,40),!1),window.removeEventListener("mousedown",()=>o.value=!0,!1),window.removeEventListener("mousemove",vr(m,40),!1),window.removeEventListener("mouseup",()=>o.value=!1,!1),clearInterval(c),i()});function g(x,y){p.value&&(p.value.geometry.setAttribute("position",new sn(x,3)),p.value.geometry.setAttribute("color",new sn(y,3)))}function _(x){const y=Td(),{isReady:S,updateFlock:R,timeStep:A}=y;!S||!u.value||R({sceneWidth:u.value.visibleWidthAtZDepth,sceneHeight:u.value.visibleHeightAtZDepth,timeStep:A,updateFlockGeometryCallback:g})}function m(x){o&&v(x.x,x.y)}function h(x){const y=x.touches.item(x.touches.length-1);y&&v(y.clientX,y.clientY)}function v(x,y){if(!u.value)return;const S=x/u.value.viewPort.width,R=y/u.value.viewPort.height,A=u.value.visibleWidthAtZDepth/2,P=u.value.visibleHeightAtZDepth/2,E=dd(-A,A,S),T=-dd(-P,P,R);s({x:E,y:T})}return(x,y)=>{const S=RR;return et(u)?(Mt(),kn(S,{key:0,class:"w-full h-full",view:et(u),onMousedown:y[0]||(y[0]=R=>o.value=!0),onMouseup:y[1]||(y[1]=R=>o.value=!1),onMousemove:m,onTouchmove:h},null,8,["view"])):us("",!0)}}}),jC=(t,e)=>e.path.replace(/(:\w+)\([^)]+\)/g,"$1").replace(/(:\w+)[?+*]/g,"$1").replace(/:\w+/g,n=>{var i;return((i=t.params[n.slice(1)])==null?void 0:i.toString())||""}),Nc=(t,e)=>{const n=t.route.matched.find(r=>{var s;return((s=r.components)==null?void 0:s.default)===t.Component.type}),i=e??(n==null?void 0:n.meta.key)??(n&&jC(t.route,n));return typeof i=="function"?i(t.route):i},qC=(t,e)=>({default:()=>t?vn(sv,t===!0?{}:t,e):e}),$C=Cn({name:"RouteProvider",props:{vnode:{type:Object,required:!0},route:{type:Object,required:!0},vnodeRef:Object,renderKey:String,trackRootNodes:Boolean},setup(t){const e=t.renderKey,n=t.route,i={};for(const r in t.route)Object.defineProperty(i,r,{get:()=>e===t.renderKey?t.route[r]:n[r]});return Lr(Ca,Ws(i)),()=>vn(t.vnode,{ref:t.vnodeRef})}}),YC=(t,e,n)=>(e=e===!0?{}:e,{default:()=>{var i;return e?vn(t,e,n):(i=n.default)==null?void 0:i.call(n)}}),KC=Cn({name:"NuxtPage",inheritAttrs:!1,props:{name:{type:String},transition:{type:[Boolean,Object],default:void 0},keepalive:{type:[Boolean,Object],default:void 0},route:{type:Object},pageKey:{type:[Function,String],default:null}},setup(t,{attrs:e,expose:n}){const i=lt(),r=Ke(),s=Bt(Ca,null);n({pageRef:r});const o=Bt(Py,null);let a;return()=>vn(ym,{name:t.name,route:t.route,...e},{default:l=>{const c=QC(s,l.route,l.Component),u=s&&s.matched.length===l.route.matched.length;if(!l.Component)return a&&!u?a:void 0;if(a&&o&&!o.isCurrent(l.route))return a;if(c&&s&&(!o||o!=null&&o.isCurrent(s)))return u?a:null;const f=Nc(l,t.pageKey),d=i.deferHydration(),p=!!(t.transition??l.route.meta.pageTransition??oc),g=p&&JC([t.transition,l.route.meta.pageTransition,oc,{onAfterLeave:()=>{i.callHook("page:transition:finish",l.Component)}}].filter(Boolean));return a=YC(lu,p&&g,qC(t.keepalive??l.route.meta.keepalive??_y,vn(cp,{suspensible:!0,onPending:()=>i.callHook("page:start",l.Component),onResolve:()=>{Yi(()=>i.callHook("page:finish",l.Component).finally(d))}},{default:()=>vn($C,{key:f,vnode:l.Component,route:l.route,renderKey:f,trackRootNodes:p,vnodeRef:r})}))).default(),a}})}});function ZC(t){return Array.isArray(t)?t:t?[t]:[]}function JC(t){const e=t.map(n=>({...n,onAfterLeave:ZC(n.onAfterLeave)}));return Ty(...e)}function QC(t,e,n){if(!t)return!1;const i=e.matched.findIndex(r=>{var s;return((s=r.components)==null?void 0:s.default)===(n==null?void 0:n.type)});return!i||i===-1?!1:e.matched.slice(0,i).some((r,s)=>{var o,a,l;return((o=r.components)==null?void 0:o.default)!==((l=(a=t.matched[s])==null?void 0:a.components)==null?void 0:l.default)})||n&&Nc({route:e,Component:n})!==Nc({route:t,Component:n})}const e1={key:0,class:"p-1 flex flex-row"},t1={key:1,class:"rainbow-text-animated"},n1={key:2,class:"ml-1 mr-1"},i1=Cn({__name:"NavBar",setup(t){const e=Nt(()=>{const r=["projects","notebooks"],s=fc().fullPath;return["home",...s.slice(1,s.length).split("/").filter(a=>a!==""&&!r.includes(a))].map(a=>` /${a}`)});function n(r){const s=fc().fullPath.split("/").pop();return r.replace("/","").trim()===(((s==null?void 0:s.trim())??"")===""?"home":s==null?void 0:s.trim())}function i(r){switch(r.trim()){case"/home":return"/";case"/2d-inverse-kinematics":return"/projects/notebooks/2d-inverse-kinematics";default:return"/"}}return(r,s)=>{var a;const o=sE;return((a=et(e))==null?void 0:a.length)!=0?(Mt(),ci("div",e1,[(Mt(!0),ci($t,null,pv(et(e),(l,c)=>(Mt(),ci("div",{key:c},[Ra("span",null,[n(l)?us("",!0):(Mt(),kn(o,{key:0,class:"link",to:i(l)},{default:Kc(()=>[ru(Cu(l),1)]),_:2},1032,["to"])),n(l)?(Mt(),ci("div",t1,Cu(l),1)):us("",!0),et(e)[c+1]?(Mt(),ci("span",n1,">")):us("",!0)])]))),128))])):us("",!0)}}});const r1=(t,e)=>{const n=t.__vccOpts||t;for(const[i,r]of e)n[i]=r;return n},s1={},o1={class:"min-h-screen flex flex-col h-screen"},a1={class:"z-10 flex-grow flex flex-col overflow-scroll"};function l1(t,e){const n=AR,i=XC,r=KC,s=i1;return Mt(),ci("div",o1,[st(n,{class:"z-1 absolute h-full w-full"}),st(i,{class:"z-2 absolute h-full w-full"}),Ra("div",a1,[st(r,{class:"flex-grow overflow-y-scroll"}),st(s)])])}const c1=r1(s1,[["render",l1]]),u1={__name:"nuxt-error-page",props:{error:Object},setup(t){const n=t.error;(n.stack||"").split(`
`).splice(1).map(f=>({text:f.replace("webpack:/","").replace(".vue",".js").trim(),internal:f.includes("node_modules")&&!f.includes(".cache")||f.includes("internal")||f.includes("new Promise")})).map(f=>`<span class="stack${f.internal?" internal":""}">${f.text}</span>`).join(`
`);const i=Number(n.statusCode||500),r=i===404,s=n.statusMessage??(r?"Page Not Found":"Internal Server Error"),o=n.message||n.toString(),a=void 0,u=r?zu(()=>Dr(()=>import("./error-404.d86b15c8.js"),["./error-404.d86b15c8.js","./error-404.8bdbaeb8.css"],import.meta.url).then(f=>f.default||f)):zu(()=>Dr(()=>import("./error-500.51dd3817.js"),["./error-500.51dd3817.js","./error-500.b63a96f5.css"],import.meta.url).then(f=>f.default||f));return(f,d)=>(Mt(),kn(et(u),Qg(Up({statusCode:et(i),statusMessage:et(s),description:et(o),stack:et(a)})),null,16))}},f1=u1,h1={__name:"nuxt-root",setup(t){const e=()=>null,n=lt(),i=n.deferHydration(),r=!1;Lr(Ca,fc()),n.hooks.callHookWith(a=>a.map(l=>l()),"vue:setup");const s=Pa();xp((a,l,c)=>{if(n.hooks.callHook("vue:error",a,l,c).catch(u=>console.error("[nuxt] Error in `vue:error` hook",u)),Uy(a)&&(a.fatal||a.unhandled))return n.runWithContext(()=>Sr(a)),!1});const{islandContext:o}=!1;return(a,l)=>(Mt(),kn(cp,{onResolve:et(i)},{default:Kc(()=>[et(s)?(Mt(),kn(et(f1),{key:0,error:et(s)},null,8,["error"])):et(o)?(Mt(),kn(et(e),{key:1,context:et(o)},null,8,["context"])):et(r)?(Mt(),kn(dv(et(r)),{key:2})):(Mt(),kn(et(c1),{key:3}))]),_:1},8,["onResolve"]))}},Rd=h1;globalThis.$fetch||(globalThis.$fetch=tx.create({baseURL:ix()}));let Cd;{let t;Cd=async function(){var s,o;if(t)return t;const i=!!((s=window.__NUXT__)!=null&&s.serverRendered||((o=document.getElementById("__NUXT_DATA__"))==null?void 0:o.dataset.ssr)==="true")?g0(Rd):m0(Rd),r=gx({vueApp:i});try{await vx(r,dE)}catch(a){await r.callHook("app:error",a),r.payload.error=r.payload.error||a}try{await r.hooks.callHook("app:created",i),await r.hooks.callHook("app:beforeMount",i),i.mount("#"+vy),await r.hooks.callHook("app:mounted",i),await Yi()}catch(a){await r.callHook("app:error",a),r.payload.error=r.payload.error||a}return i},t=Cd().catch(e=>{console.error("Error while mounting app:",e)})}export{zC as D,$t as F,r1 as _,Ra as a,st as b,ci as c,ru as d,sE as e,m1 as f,Cn as g,Nt as h,kn as i,Td as j,Ke as k,Ki as l,_1 as m,et as n,Mt as o,p1 as p,us as q,pv as r,wm as s,Cu as t,g1 as u,Kc as w};
