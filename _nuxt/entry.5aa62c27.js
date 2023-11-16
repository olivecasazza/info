function Lc(t,e){const n=Object.create(null),i=t.split(",");for(let r=0;r<i.length;r++)n[i[r]]=!0;return e?r=>!!n[r.toLowerCase()]:r=>!!n[r]}const nt={},Ar=[],gn=()=>{},Lg=()=>!1,Dg=/^on[^a-z]/,Fs=t=>Dg.test(t),Dc=t=>t.startsWith("onUpdate:"),pt=Object.assign,Uc=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Ug=Object.prototype.hasOwnProperty,Ye=(t,e)=>Ug.call(t,e),Ue=Array.isArray,wr=t=>Bs(t)==="[object Map]",Ah=t=>Bs(t)==="[object Set]",Ig=t=>Bs(t)==="[object RegExp]",Be=t=>typeof t=="function",ot=t=>typeof t=="string",Ic=t=>typeof t=="symbol",tt=t=>t!==null&&typeof t=="object",wh=t=>tt(t)&&Be(t.then)&&Be(t.catch),Rh=Object.prototype.toString,Bs=t=>Rh.call(t),Ng=t=>Bs(t).slice(8,-1),Ch=t=>Bs(t)==="[object Object]",Nc=t=>ot(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,us=Lc(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),pa=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},Og=/-(\w)/g,wn=pa(t=>t.replace(Og,(e,n)=>n?n.toUpperCase():"")),Fg=/\B([A-Z])/g,Wr=pa(t=>t.replace(Fg,"-$1").toLowerCase()),ma=pa(t=>t.charAt(0).toUpperCase()+t.slice(1)),Ha=pa(t=>t?`on${ma(t)}`:""),bs=(t,e)=>!Object.is(t,e),fs=(t,e)=>{for(let n=0;n<t.length;n++)t[n](e)},Yo=(t,e,n)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:n})},Bg=t=>{const e=parseFloat(t);return isNaN(e)?t:e},Ph=t=>{const e=ot(t)?Number(t):NaN;return isNaN(e)?t:e};let bu;const Bl=()=>bu||(bu=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function ga(t){if(Ue(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],r=ot(i)?Gg(i):ga(i);if(r)for(const s in r)e[s]=r[s]}return e}else{if(ot(t))return t;if(tt(t))return t}}const Hg=/;(?![^(]*\))/g,kg=/:([^]+)/,zg=/\/\*[^]*?\*\//g;function Gg(t){const e={};return t.replace(zg,"").split(Hg).forEach(n=>{if(n){const i=n.split(kg);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function _a(t){let e="";if(ot(t))e=t;else if(Ue(t))for(let n=0;n<t.length;n++){const i=_a(t[n]);i&&(e+=i+" ")}else if(tt(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}function Vg(t){if(!t)return null;let{class:e,style:n}=t;return e&&!ot(e)&&(t.class=_a(e)),n&&(t.style=ga(n)),t}const Wg="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Xg=Lc(Wg);function Lh(t){return!!t||t===""}const Tu=t=>ot(t)?t:t==null?"":Ue(t)||tt(t)&&(t.toString===Rh||!Be(t.toString))?JSON.stringify(t,Dh,2):String(t),Dh=(t,e)=>e&&e.__v_isRef?Dh(t,e.value):wr(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[i,r])=>(n[`${i} =>`]=r,n),{})}:Ah(e)?{[`Set(${e.size})`]:[...e.values()]}:tt(e)&&!Ue(e)&&!Ch(e)?String(e):e;let qt;class Uh{constructor(e=!1){this.detached=e,this._active=!0,this.effects=[],this.cleanups=[],this.parent=qt,!e&&qt&&(this.index=(qt.scopes||(qt.scopes=[])).push(this)-1)}get active(){return this._active}run(e){if(this._active){const n=qt;try{return qt=this,e()}finally{qt=n}}}on(){qt=this}off(){qt=this.parent}stop(e){if(this._active){let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.scopes)for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0,this._active=!1}}}function Ih(t){return new Uh(t)}function jg(t,e=qt){e&&e.active&&e.effects.push(t)}function Nh(){return qt}function qg(t){qt&&qt.cleanups.push(t)}const Oc=t=>{const e=new Set(t);return e.w=0,e.n=0,e},Oh=t=>(t.w&vi)>0,Fh=t=>(t.n&vi)>0,$g=({deps:t})=>{if(t.length)for(let e=0;e<t.length;e++)t[e].w|=vi},Yg=t=>{const{deps:e}=t;if(e.length){let n=0;for(let i=0;i<e.length;i++){const r=e[i];Oh(r)&&!Fh(r)?r.delete(t):e[n++]=r,r.w&=~vi,r.n&=~vi}e.length=n}},Ko=new WeakMap;let ss=0,vi=1;const Hl=30;let fn;const Hi=Symbol(""),kl=Symbol("");class Fc{constructor(e,n=null,i){this.fn=e,this.scheduler=n,this.active=!0,this.deps=[],this.parent=void 0,jg(this,i)}run(){if(!this.active)return this.fn();let e=fn,n=pi;for(;e;){if(e===this)return;e=e.parent}try{return this.parent=fn,fn=this,pi=!0,vi=1<<++ss,ss<=Hl?$g(this):Au(this),this.fn()}finally{ss<=Hl&&Yg(this),vi=1<<--ss,fn=this.parent,pi=n,this.parent=void 0,this.deferStop&&this.stop()}}stop(){fn===this?this.deferStop=!0:this.active&&(Au(this),this.onStop&&this.onStop(),this.active=!1)}}function Au(t){const{deps:e}=t;if(e.length){for(let n=0;n<e.length;n++)e[n].delete(t);e.length=0}}let pi=!0;const Bh=[];function Xr(){Bh.push(pi),pi=!1}function jr(){const t=Bh.pop();pi=t===void 0?!0:t}function Gt(t,e,n){if(pi&&fn){let i=Ko.get(t);i||Ko.set(t,i=new Map);let r=i.get(n);r||i.set(n,r=Oc()),Hh(r)}}function Hh(t,e){let n=!1;ss<=Hl?Fh(t)||(t.n|=vi,n=!Oh(t)):n=!t.has(fn),n&&(t.add(fn),fn.deps.push(t))}function Wn(t,e,n,i,r,s){const o=Ko.get(t);if(!o)return;let a=[];if(e==="clear")a=[...o.values()];else if(n==="length"&&Ue(t)){const l=Number(i);o.forEach((c,u)=>{(u==="length"||u>=l)&&a.push(c)})}else switch(n!==void 0&&a.push(o.get(n)),e){case"add":Ue(t)?Nc(n)&&a.push(o.get("length")):(a.push(o.get(Hi)),wr(t)&&a.push(o.get(kl)));break;case"delete":Ue(t)||(a.push(o.get(Hi)),wr(t)&&a.push(o.get(kl)));break;case"set":wr(t)&&a.push(o.get(Hi));break}if(a.length===1)a[0]&&zl(a[0]);else{const l=[];for(const c of a)c&&l.push(...c);zl(Oc(l))}}function zl(t,e){const n=Ue(t)?t:[...t];for(const i of n)i.computed&&wu(i);for(const i of n)i.computed||wu(i)}function wu(t,e){(t!==fn||t.allowRecurse)&&(t.scheduler?t.scheduler():t.run())}function Kg(t,e){var n;return(n=Ko.get(t))==null?void 0:n.get(e)}const Zg=Lc("__proto__,__v_isRef,__isVue"),kh=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Ic)),Jg=Bc(),Qg=Bc(!1,!0),e_=Bc(!0),Ru=t_();function t_(){const t={};return["includes","indexOf","lastIndexOf"].forEach(e=>{t[e]=function(...n){const i=qe(this);for(let s=0,o=this.length;s<o;s++)Gt(i,"get",s+"");const r=i[e](...n);return r===-1||r===!1?i[e](...n.map(qe)):r}}),["push","pop","shift","unshift","splice"].forEach(e=>{t[e]=function(...n){Xr();const i=qe(this)[e].apply(this,n);return jr(),i}}),t}function n_(t){const e=qe(this);return Gt(e,"has",t),e.hasOwnProperty(t)}function Bc(t=!1,e=!1){return function(i,r,s){if(r==="__v_isReactive")return!t;if(r==="__v_isReadonly")return t;if(r==="__v_isShallow")return e;if(r==="__v_raw"&&s===(t?e?v_:Xh:e?Wh:Vh).get(i))return i;const o=Ue(i);if(!t){if(o&&Ye(Ru,r))return Reflect.get(Ru,r,s);if(r==="hasOwnProperty")return n_}const a=Reflect.get(i,r,s);return(Ic(r)?kh.has(r):Zg(r))||(t||Gt(i,"get",r),e)?a:it(a)?o&&Nc(r)?a:a.value:tt(a)?t?jh(a):Xn(a):a}}const i_=zh(),r_=zh(!0);function zh(t=!1){return function(n,i,r,s){let o=n[i];if(ji(o)&&it(o)&&!it(r))return!1;if(!t&&(!Zo(r)&&!ji(r)&&(o=qe(o),r=qe(r)),!Ue(n)&&it(o)&&!it(r)))return o.value=r,!0;const a=Ue(n)&&Nc(i)?Number(i)<n.length:Ye(n,i),l=Reflect.set(n,i,r,s);return n===qe(s)&&(a?bs(r,o)&&Wn(n,"set",i,r):Wn(n,"add",i,r)),l}}function s_(t,e){const n=Ye(t,e);t[e];const i=Reflect.deleteProperty(t,e);return i&&n&&Wn(t,"delete",e,void 0),i}function o_(t,e){const n=Reflect.has(t,e);return(!Ic(e)||!kh.has(e))&&Gt(t,"has",e),n}function a_(t){return Gt(t,"iterate",Ue(t)?"length":Hi),Reflect.ownKeys(t)}const Gh={get:Jg,set:i_,deleteProperty:s_,has:o_,ownKeys:a_},l_={get:e_,set(t,e){return!0},deleteProperty(t,e){return!0}},c_=pt({},Gh,{get:Qg,set:r_}),Hc=t=>t,va=t=>Reflect.getPrototypeOf(t);function no(t,e,n=!1,i=!1){t=t.__v_raw;const r=qe(t),s=qe(e);n||(e!==s&&Gt(r,"get",e),Gt(r,"get",s));const{has:o}=va(r),a=i?Hc:n?Gc:Ts;if(o.call(r,e))return a(t.get(e));if(o.call(r,s))return a(t.get(s));t!==r&&t.get(e)}function io(t,e=!1){const n=this.__v_raw,i=qe(n),r=qe(t);return e||(t!==r&&Gt(i,"has",t),Gt(i,"has",r)),t===r?n.has(t):n.has(t)||n.has(r)}function ro(t,e=!1){return t=t.__v_raw,!e&&Gt(qe(t),"iterate",Hi),Reflect.get(t,"size",t)}function Cu(t){t=qe(t);const e=qe(this);return va(e).has.call(e,t)||(e.add(t),Wn(e,"add",t,t)),this}function Pu(t,e){e=qe(e);const n=qe(this),{has:i,get:r}=va(n);let s=i.call(n,t);s||(t=qe(t),s=i.call(n,t));const o=r.call(n,t);return n.set(t,e),s?bs(e,o)&&Wn(n,"set",t,e):Wn(n,"add",t,e),this}function Lu(t){const e=qe(this),{has:n,get:i}=va(e);let r=n.call(e,t);r||(t=qe(t),r=n.call(e,t)),i&&i.call(e,t);const s=e.delete(t);return r&&Wn(e,"delete",t,void 0),s}function Du(){const t=qe(this),e=t.size!==0,n=t.clear();return e&&Wn(t,"clear",void 0,void 0),n}function so(t,e){return function(i,r){const s=this,o=s.__v_raw,a=qe(o),l=e?Hc:t?Gc:Ts;return!t&&Gt(a,"iterate",Hi),o.forEach((c,u)=>i.call(r,l(c),l(u),s))}}function oo(t,e,n){return function(...i){const r=this.__v_raw,s=qe(r),o=wr(s),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=r[t](...i),u=n?Hc:e?Gc:Ts;return!e&&Gt(s,"iterate",l?kl:Hi),{next(){const{value:f,done:h}=c.next();return h?{value:f,done:h}:{value:a?[u(f[0]),u(f[1])]:u(f),done:h}},[Symbol.iterator](){return this}}}}function Yn(t){return function(...e){return t==="delete"?!1:this}}function u_(){const t={get(s){return no(this,s)},get size(){return ro(this)},has:io,add:Cu,set:Pu,delete:Lu,clear:Du,forEach:so(!1,!1)},e={get(s){return no(this,s,!1,!0)},get size(){return ro(this)},has:io,add:Cu,set:Pu,delete:Lu,clear:Du,forEach:so(!1,!0)},n={get(s){return no(this,s,!0)},get size(){return ro(this,!0)},has(s){return io.call(this,s,!0)},add:Yn("add"),set:Yn("set"),delete:Yn("delete"),clear:Yn("clear"),forEach:so(!0,!1)},i={get(s){return no(this,s,!0,!0)},get size(){return ro(this,!0)},has(s){return io.call(this,s,!0)},add:Yn("add"),set:Yn("set"),delete:Yn("delete"),clear:Yn("clear"),forEach:so(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(s=>{t[s]=oo(s,!1,!1),n[s]=oo(s,!0,!1),e[s]=oo(s,!1,!0),i[s]=oo(s,!0,!0)}),[t,n,e,i]}const[f_,d_,h_,p_]=u_();function kc(t,e){const n=e?t?p_:h_:t?d_:f_;return(i,r,s)=>r==="__v_isReactive"?!t:r==="__v_isReadonly"?t:r==="__v_raw"?i:Reflect.get(Ye(n,r)&&r in i?n:i,r,s)}const m_={get:kc(!1,!1)},g_={get:kc(!1,!0)},__={get:kc(!0,!1)},Vh=new WeakMap,Wh=new WeakMap,Xh=new WeakMap,v_=new WeakMap;function x_(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function y_(t){return t.__v_skip||!Object.isExtensible(t)?0:x_(Ng(t))}function Xn(t){return ji(t)?t:zc(t,!1,Gh,m_,Vh)}function Hs(t){return zc(t,!1,c_,g_,Wh)}function jh(t){return zc(t,!0,l_,__,Xh)}function zc(t,e,n,i,r){if(!tt(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const s=r.get(t);if(s)return s;const o=y_(t);if(o===0)return t;const a=new Proxy(t,o===2?i:n);return r.set(t,a),a}function zn(t){return ji(t)?zn(t.__v_raw):!!(t&&t.__v_isReactive)}function ji(t){return!!(t&&t.__v_isReadonly)}function Zo(t){return!!(t&&t.__v_isShallow)}function qh(t){return zn(t)||ji(t)}function qe(t){const e=t&&t.__v_raw;return e?qe(e):t}function xa(t){return Yo(t,"__v_skip",!0),t}const Ts=t=>tt(t)?Xn(t):t,Gc=t=>tt(t)?jh(t):t;function $h(t){pi&&fn&&(t=qe(t),Hh(t.dep||(t.dep=Oc())))}function Yh(t,e){t=qe(t);const n=t.dep;n&&zl(n)}function it(t){return!!(t&&t.__v_isRef===!0)}function Ze(t){return Kh(t,!1)}function As(t){return Kh(t,!0)}function Kh(t,e){return it(t)?t:new M_(t,e)}class M_{constructor(e,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?e:qe(e),this._value=n?e:Ts(e)}get value(){return $h(this),this._value}set value(e){const n=this.__v_isShallow||Zo(e)||ji(e);e=n?e:qe(e),bs(e,this._rawValue)&&(this._rawValue=e,this._value=n?e:Ts(e),Yh(this))}}function et(t){return it(t)?t.value:t}const E_={get:(t,e,n)=>et(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const r=t[e];return it(r)&&!it(n)?(r.value=n,!0):Reflect.set(t,e,n,i)}};function Zh(t){return zn(t)?t:new Proxy(t,E_)}function S_(t){const e=Ue(t)?new Array(t.length):{};for(const n in t)e[n]=Jh(t,n);return e}class b_{constructor(e,n,i){this._object=e,this._key=n,this._defaultValue=i,this.__v_isRef=!0}get value(){const e=this._object[this._key];return e===void 0?this._defaultValue:e}set value(e){this._object[this._key]=e}get dep(){return Kg(qe(this._object),this._key)}}class T_{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0}get value(){return this._getter()}}function Vc(t,e,n){return it(t)?t:Be(t)?new T_(t):tt(t)&&arguments.length>1?Jh(t,e,n):Ze(t)}function Jh(t,e,n){const i=t[e];return it(i)?i:new b_(t,e,n)}class A_{constructor(e,n,i,r){this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this._dirty=!0,this.effect=new Fc(e,()=>{this._dirty||(this._dirty=!0,Yh(this))}),this.effect.computed=this,this.effect.active=this._cacheable=!r,this.__v_isReadonly=i}get value(){const e=qe(this);return $h(e),(e._dirty||!e._cacheable)&&(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e)}}function w_(t,e,n=!1){let i,r;const s=Be(t);return s?(i=t,r=gn):(i=t.get,r=t.set),new A_(i,r,s||!r,n)}function mi(t,e,n,i){let r;try{r=i?t(...i):t()}catch(s){qr(s,e,n)}return r}function nn(t,e,n,i){if(Be(t)){const s=mi(t,e,n,i);return s&&wh(s)&&s.catch(o=>{qr(o,e,n)}),s}const r=[];for(let s=0;s<t.length;s++)r.push(nn(t[s],e,n,i));return r}function qr(t,e,n,i=!0){const r=e?e.vnode:null;if(e){let s=e.parent;const o=e.proxy,a=n;for(;s;){const c=s.ec;if(c){for(let u=0;u<c.length;u++)if(c[u](t,o,a)===!1)return}s=s.parent}const l=e.appContext.config.errorHandler;if(l){mi(l,null,10,[t,o,a]);return}}R_(t,n,r,i)}function R_(t,e,n,i=!0){console.error(t)}let ws=!1,Gl=!1;const Rt=[];let An=0;const Rr=[];let Bn=null,Ii=0;const Qh=Promise.resolve();let Wc=null;function Ki(t){const e=Wc||Qh;return t?e.then(this?t.bind(this):t):e}function C_(t){let e=An+1,n=Rt.length;for(;e<n;){const i=e+n>>>1;Rs(Rt[i])<t?e=i+1:n=i}return e}function ya(t){(!Rt.length||!Rt.includes(t,ws&&t.allowRecurse?An+1:An))&&(t.id==null?Rt.push(t):Rt.splice(C_(t.id),0,t),ep())}function ep(){!ws&&!Gl&&(Gl=!0,Wc=Qh.then(np))}function P_(t){const e=Rt.indexOf(t);e>An&&Rt.splice(e,1)}function tp(t){Ue(t)?Rr.push(...t):(!Bn||!Bn.includes(t,t.allowRecurse?Ii+1:Ii))&&Rr.push(t),ep()}function Uu(t,e=ws?An+1:0){for(;e<Rt.length;e++){const n=Rt[e];n&&n.pre&&(Rt.splice(e,1),e--,n())}}function Jo(t){if(Rr.length){const e=[...new Set(Rr)];if(Rr.length=0,Bn){Bn.push(...e);return}for(Bn=e,Bn.sort((n,i)=>Rs(n)-Rs(i)),Ii=0;Ii<Bn.length;Ii++)Bn[Ii]();Bn=null,Ii=0}}const Rs=t=>t.id==null?1/0:t.id,L_=(t,e)=>{const n=Rs(t)-Rs(e);if(n===0){if(t.pre&&!e.pre)return-1;if(e.pre&&!t.pre)return 1}return n};function np(t){Gl=!1,ws=!0,Rt.sort(L_);const e=gn;try{for(An=0;An<Rt.length;An++){const n=Rt[An];n&&n.active!==!1&&mi(n,null,14)}}finally{An=0,Rt.length=0,Jo(),ws=!1,Wc=null,(Rt.length||Rr.length)&&np()}}function D_(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||nt;let r=n;const s=e.startsWith("update:"),o=s&&e.slice(7);if(o&&o in i){const u=`${o==="modelValue"?"model":o}Modifiers`,{number:f,trim:h}=i[u]||nt;h&&(r=n.map(p=>ot(p)?p.trim():p)),f&&(r=n.map(Bg))}let a,l=i[a=Ha(e)]||i[a=Ha(wn(e))];!l&&s&&(l=i[a=Ha(Wr(e))]),l&&nn(l,t,6,r);const c=i[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,nn(c,t,6,r)}}function ip(t,e,n=!1){const i=e.emitsCache,r=i.get(t);if(r!==void 0)return r;const s=t.emits;let o={},a=!1;if(!Be(t)){const l=c=>{const u=ip(c,e,!0);u&&(a=!0,pt(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!s&&!a?(tt(t)&&i.set(t,null),null):(Ue(s)?s.forEach(l=>o[l]=null):pt(o,s),tt(t)&&i.set(t,o),o)}function Ma(t,e){return!t||!Fs(e)?!1:(e=e.slice(2).replace(/Once$/,""),Ye(t,e[0].toLowerCase()+e.slice(1))||Ye(t,Wr(e))||Ye(t,e))}let Yt=null,Ea=null;function Qo(t){const e=Yt;return Yt=t,Ea=t&&t.type.__scopeId||null,e}function e1(t){Ea=t}function t1(){Ea=null}function Xc(t,e=Yt,n){if(!e||t._n)return t;const i=(...r)=>{i._d&&qu(-1);const s=Qo(e);let o;try{o=t(...r)}finally{Qo(s),i._d&&qu(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function ka(t){const{type:e,vnode:n,proxy:i,withProxy:r,props:s,propsOptions:[o],slots:a,attrs:l,emit:c,render:u,renderCache:f,data:h,setupState:p,ctx:g,inheritAttrs:x}=t;let m,d;const _=Qo(t);try{if(n.shapeFlag&4){const y=r||i;m=Qt(u.call(y,y,f,s,p,h,g)),d=l}else{const y=e;m=Qt(y.length>1?y(s,{attrs:l,slots:a,emit:c}):y(s,null)),d=e.props?l:I_(l)}}catch(y){hs.length=0,qr(y,t,1),m=st(Ht)}let v=m;if(d&&x!==!1){const y=Object.keys(d),{shapeFlag:S}=v;y.length&&S&7&&(o&&y.some(Dc)&&(d=N_(d,o)),v=jn(v,d))}return n.dirs&&(v=jn(v),v.dirs=v.dirs?v.dirs.concat(n.dirs):n.dirs),n.transition&&(v.transition=n.transition),m=v,Qo(_),m}function U_(t){let e;for(let n=0;n<t.length;n++){const i=t[n];if(Ls(i)){if(i.type!==Ht||i.children==="v-if"){if(e)return;e=i}}else return}return e}const I_=t=>{let e;for(const n in t)(n==="class"||n==="style"||Fs(n))&&((e||(e={}))[n]=t[n]);return e},N_=(t,e)=>{const n={};for(const i in t)(!Dc(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function O_(t,e,n){const{props:i,children:r,component:s}=t,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?Iu(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let f=0;f<u.length;f++){const h=u[f];if(o[h]!==i[h]&&!Ma(c,h))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?Iu(i,o,c):!0:!!o;return!1}function Iu(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(e[s]!==t[s]&&!Ma(n,s))return!0}return!1}function jc({vnode:t,parent:e},n){for(;e&&e.subTree===t;)(t=e.vnode).el=n,e=e.parent}const rp=t=>t.__isSuspense,F_={name:"Suspense",__isSuspense:!0,process(t,e,n,i,r,s,o,a,l,c){t==null?B_(e,n,i,r,s,o,a,l,c):H_(t,e,n,i,r,o,a,l,c)},hydrate:k_,create:qc,normalize:z_},sp=F_;function Cs(t,e){const n=t.props&&t.props[e];Be(n)&&n()}function B_(t,e,n,i,r,s,o,a,l){const{p:c,o:{createElement:u}}=l,f=u("div"),h=t.suspense=qc(t,r,i,e,f,n,s,o,a,l);c(null,h.pendingBranch=t.ssContent,f,null,i,h,s,o),h.deps>0?(Cs(t,"onPending"),Cs(t,"onFallback"),c(null,t.ssFallback,e,n,i,null,s,o),Cr(h,t.ssFallback)):h.resolve(!1,!0)}function H_(t,e,n,i,r,s,o,a,{p:l,um:c,o:{createElement:u}}){const f=e.suspense=t.suspense;f.vnode=e,e.el=t.el;const h=e.ssContent,p=e.ssFallback,{activeBranch:g,pendingBranch:x,isInFallback:m,isHydrating:d}=f;if(x)f.pendingBranch=h,dn(h,x)?(l(x,h,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0?f.resolve():m&&(l(g,p,n,i,r,null,s,o,a),Cr(f,p))):(f.pendingId++,d?(f.isHydrating=!1,f.activeBranch=x):c(x,r,f),f.deps=0,f.effects.length=0,f.hiddenContainer=u("div"),m?(l(null,h,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0?f.resolve():(l(g,p,n,i,r,null,s,o,a),Cr(f,p))):g&&dn(h,g)?(l(g,h,n,i,r,f,s,o,a),f.resolve(!0)):(l(null,h,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0&&f.resolve()));else if(g&&dn(h,g))l(g,h,n,i,r,f,s,o,a),Cr(f,h);else if(Cs(e,"onPending"),f.pendingBranch=h,f.pendingId++,l(null,h,f.hiddenContainer,null,r,f,s,o,a),f.deps<=0)f.resolve();else{const{timeout:_,pendingId:v}=f;_>0?setTimeout(()=>{f.pendingId===v&&f.fallback(p)},_):_===0&&f.fallback(p)}}function qc(t,e,n,i,r,s,o,a,l,c,u=!1){const{p:f,m:h,um:p,n:g,o:{parentNode:x,remove:m}}=c;let d;const _=G_(t);_&&e!=null&&e.pendingBranch&&(d=e.pendingId,e.deps++);const v=t.props?Ph(t.props.timeout):void 0,y={vnode:t,parent:e,parentComponent:n,isSVG:o,container:i,hiddenContainer:r,anchor:s,deps:0,pendingId:0,timeout:typeof v=="number"?v:-1,activeBranch:null,pendingBranch:null,isInFallback:!0,isHydrating:u,isUnmounted:!1,effects:[],resolve(S=!1,R=!1){const{vnode:w,activeBranch:P,pendingBranch:M,pendingId:T,effects:F,parentComponent:H,container:N}=y;if(y.isHydrating)y.isHydrating=!1;else if(!S){const K=P&&M.transition&&M.transition.mode==="out-in";K&&(P.transition.afterLeave=()=>{T===y.pendingId&&h(M,N,q,0)});let{anchor:q}=y;P&&(q=g(P),p(P,H,y,!0)),K||h(M,N,q,0)}Cr(y,M),y.pendingBranch=null,y.isInFallback=!1;let U=y.parent,B=!1;for(;U;){if(U.pendingBranch){U.effects.push(...F),B=!0;break}U=U.parent}B||tp(F),y.effects=[],_&&e&&e.pendingBranch&&d===e.pendingId&&(e.deps--,e.deps===0&&!R&&e.resolve()),Cs(w,"onResolve")},fallback(S){if(!y.pendingBranch)return;const{vnode:R,activeBranch:w,parentComponent:P,container:M,isSVG:T}=y;Cs(R,"onFallback");const F=g(w),H=()=>{y.isInFallback&&(f(null,S,M,F,P,null,T,a,l),Cr(y,S))},N=S.transition&&S.transition.mode==="out-in";N&&(w.transition.afterLeave=H),y.isInFallback=!0,p(w,P,null,!0),N||H()},move(S,R,w){y.activeBranch&&h(y.activeBranch,S,R,w),y.container=S},next(){return y.activeBranch&&g(y.activeBranch)},registerDep(S,R){const w=!!y.pendingBranch;w&&y.deps++;const P=S.vnode.el;S.asyncDep.catch(M=>{qr(M,S,0)}).then(M=>{if(S.isUnmounted||y.isUnmounted||y.pendingId!==S.suspenseId)return;S.asyncResolved=!0;const{vnode:T}=S;$l(S,M,!1),P&&(T.el=P);const F=!P&&S.subTree.el;R(S,T,x(P||S.subTree.el),P?null:g(S.subTree),y,o,l),F&&m(F),jc(S,T.el),w&&--y.deps===0&&y.resolve()})},unmount(S,R){y.isUnmounted=!0,y.activeBranch&&p(y.activeBranch,n,S,R),y.pendingBranch&&p(y.pendingBranch,n,S,R)}};return y}function k_(t,e,n,i,r,s,o,a,l){const c=e.suspense=qc(e,i,n,t.parentNode,document.createElement("div"),null,r,s,o,a,!0),u=l(t,c.pendingBranch=e.ssContent,n,c,s,o);return c.deps===0&&c.resolve(!1,!0),u}function z_(t){const{shapeFlag:e,children:n}=t,i=e&32;t.ssContent=Nu(i?n.default:n),t.ssFallback=i?Nu(n.fallback):st(Ht)}function Nu(t){let e;if(Be(t)){const n=Nr&&t._c;n&&(t._d=!1,St()),t=t(),n&&(t._d=!0,e=tn,wp())}return Ue(t)&&(t=U_(t)),t=Qt(t),e&&!t.dynamicChildren&&(t.dynamicChildren=e.filter(n=>n!==t)),t}function op(t,e){e&&e.pendingBranch?Ue(t)?e.effects.push(...t):e.effects.push(t):tp(t)}function Cr(t,e){t.activeBranch=e;const{vnode:n,parentComponent:i}=t,r=n.el=e.el;i&&i.subTree===n&&(i.vnode.el=r,jc(i,r))}function G_(t){var e;return((e=t.props)==null?void 0:e.suspensible)!=null&&t.props.suspensible!==!1}function V_(t,e){return $c(t,null,e)}const ao={};function ki(t,e,n){return $c(t,e,n)}function $c(t,e,{immediate:n,deep:i,flush:r,onTrack:s,onTrigger:o}=nt){var a;const l=Nh()===((a=ht)==null?void 0:a.scope)?ht:null;let c,u=!1,f=!1;if(it(t)?(c=()=>t.value,u=Zo(t)):zn(t)?(c=()=>t,i=!0):Ue(t)?(f=!0,u=t.some(y=>zn(y)||Zo(y)),c=()=>t.map(y=>{if(it(y))return y.value;if(zn(y))return Er(y);if(Be(y))return mi(y,l,2)})):Be(t)?e?c=()=>mi(t,l,2):c=()=>{if(!(l&&l.isUnmounted))return h&&h(),nn(t,l,3,[p])}:c=gn,e&&i){const y=c;c=()=>Er(y())}let h,p=y=>{h=_.onStop=()=>{mi(y,l,4)}},g;if(Fr)if(p=gn,e?n&&nn(e,l,3,[c(),f?[]:void 0,p]):c(),r==="sync"){const y=Iv();g=y.__watcherHandles||(y.__watcherHandles=[])}else return gn;let x=f?new Array(t.length).fill(ao):ao;const m=()=>{if(_.active)if(e){const y=_.run();(i||u||(f?y.some((S,R)=>bs(S,x[R])):bs(y,x)))&&(h&&h(),nn(e,l,3,[y,x===ao?void 0:f&&x[0]===ao?[]:x,p]),x=y)}else _.run()};m.allowRecurse=!!e;let d;r==="sync"?d=m:r==="post"?d=()=>Et(m,l&&l.suspense):(m.pre=!0,l&&(m.id=l.uid),d=()=>ya(m));const _=new Fc(c,d);e?n?m():x=_.run():r==="post"?Et(_.run.bind(_),l&&l.suspense):_.run();const v=()=>{_.stop(),l&&l.scope&&Uc(l.scope.effects,_)};return g&&g.push(v),v}function W_(t,e,n){const i=this.proxy,r=ot(t)?t.includes(".")?ap(i,t):()=>i[t]:t.bind(i,i);let s;Be(e)?s=e:(s=e.handler,n=e);const o=ht;Or(this);const a=$c(r,s.bind(i),n);return o?Or(o):zi(),a}function ap(t,e){const n=e.split(".");return()=>{let i=t;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}function Er(t,e){if(!tt(t)||t.__v_skip||(e=e||new Set,e.has(t)))return t;if(e.add(t),it(t))Er(t.value,e);else if(Ue(t))for(let n=0;n<t.length;n++)Er(t[n],e);else if(Ah(t)||wr(t))t.forEach(n=>{Er(n,e)});else if(Ch(t))for(const n in t)Er(t[n],e);return t}function Sn(t,e,n,i){const r=t.dirs,s=e&&e.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(Xr(),nn(l,n,8,[t.el,a,t,e]),jr())}}function X_(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return zs(()=>{t.isMounted=!0}),Gs(()=>{t.isUnmounting=!0}),t}const Zt=[Function,Array],lp={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:Zt,onEnter:Zt,onAfterEnter:Zt,onEnterCancelled:Zt,onBeforeLeave:Zt,onLeave:Zt,onAfterLeave:Zt,onLeaveCancelled:Zt,onBeforeAppear:Zt,onAppear:Zt,onAfterAppear:Zt,onAppearCancelled:Zt},j_={name:"BaseTransition",props:lp,setup(t,{slots:e}){const n=Ws(),i=X_();let r;return()=>{const s=e.default&&up(e.default(),!0);if(!s||!s.length)return;let o=s[0];if(s.length>1){for(const x of s)if(x.type!==Ht){o=x;break}}const a=qe(t),{mode:l}=a;if(i.isLeaving)return za(o);const c=Ou(o);if(!c)return za(o);const u=Vl(c,a,i,n);ea(c,u);const f=n.subTree,h=f&&Ou(f);let p=!1;const{getTransitionKey:g}=c.type;if(g){const x=g();r===void 0?r=x:x!==r&&(r=x,p=!0)}if(h&&h.type!==Ht&&(!dn(c,h)||p)){const x=Vl(h,a,i,n);if(ea(h,x),l==="out-in")return i.isLeaving=!0,x.afterLeave=()=>{i.isLeaving=!1,n.update.active!==!1&&n.update()},za(o);l==="in-out"&&c.type!==Ht&&(x.delayLeave=(m,d,_)=>{const v=cp(i,h);v[String(h.key)]=h,m._leaveCb=()=>{d(),m._leaveCb=void 0,delete u.delayedLeave},u.delayedLeave=_})}return o}}},q_=j_;function cp(t,e){const{leavingVNodes:n}=t;let i=n.get(e.type);return i||(i=Object.create(null),n.set(e.type,i)),i}function Vl(t,e,n,i){const{appear:r,mode:s,persisted:o=!1,onBeforeEnter:a,onEnter:l,onAfterEnter:c,onEnterCancelled:u,onBeforeLeave:f,onLeave:h,onAfterLeave:p,onLeaveCancelled:g,onBeforeAppear:x,onAppear:m,onAfterAppear:d,onAppearCancelled:_}=e,v=String(t.key),y=cp(n,t),S=(P,M)=>{P&&nn(P,i,9,M)},R=(P,M)=>{const T=M[1];S(P,M),Ue(P)?P.every(F=>F.length<=1)&&T():P.length<=1&&T()},w={mode:s,persisted:o,beforeEnter(P){let M=a;if(!n.isMounted)if(r)M=x||a;else return;P._leaveCb&&P._leaveCb(!0);const T=y[v];T&&dn(t,T)&&T.el._leaveCb&&T.el._leaveCb(),S(M,[P])},enter(P){let M=l,T=c,F=u;if(!n.isMounted)if(r)M=m||l,T=d||c,F=_||u;else return;let H=!1;const N=P._enterCb=U=>{H||(H=!0,U?S(F,[P]):S(T,[P]),w.delayedLeave&&w.delayedLeave(),P._enterCb=void 0)};M?R(M,[P,N]):N()},leave(P,M){const T=String(t.key);if(P._enterCb&&P._enterCb(!0),n.isUnmounting)return M();S(f,[P]);let F=!1;const H=P._leaveCb=N=>{F||(F=!0,M(),N?S(g,[P]):S(p,[P]),P._leaveCb=void 0,y[T]===t&&delete y[T])};y[T]=t,h?R(h,[P,H]):H()},clone(P){return Vl(P,e,n,i)}};return w}function za(t){if(ks(t))return t=jn(t),t.children=null,t}function Ou(t){return ks(t)?t.children?t.children[0]:void 0:t}function ea(t,e){t.shapeFlag&6&&t.component?ea(t.component.subTree,e):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function up(t,e=!1,n){let i=[],r=0;for(let s=0;s<t.length;s++){let o=t[s];const a=n==null?o.key:String(n)+String(o.key!=null?o.key:s);o.type===Ft?(o.patchFlag&128&&r++,i=i.concat(up(o.children,e,a))):(e||o.type!==Ht)&&i.push(a!=null?jn(o,{key:a}):o)}if(r>1)for(let s=0;s<i.length;s++)i[s].patchFlag=-2;return i}function yi(t,e){return Be(t)?(()=>pt({name:t.name},e,{setup:t}))():t}const Pr=t=>!!t.type.__asyncLoader;function Fu(t){Be(t)&&(t={loader:t});const{loader:e,loadingComponent:n,errorComponent:i,delay:r=200,timeout:s,suspensible:o=!0,onError:a}=t;let l=null,c,u=0;const f=()=>(u++,l=null,h()),h=()=>{let p;return l||(p=l=e().catch(g=>{if(g=g instanceof Error?g:new Error(String(g)),a)return new Promise((x,m)=>{a(g,()=>x(f()),()=>m(g),u+1)});throw g}).then(g=>p!==l&&l?l:(g&&(g.__esModule||g[Symbol.toStringTag]==="Module")&&(g=g.default),c=g,g)))};return yi({name:"AsyncComponentWrapper",__asyncLoader:h,get __asyncResolved(){return c},setup(){const p=ht;if(c)return()=>Ga(c,p);const g=_=>{l=null,qr(_,p,13,!i)};if(o&&p.suspense||Fr)return h().then(_=>()=>Ga(_,p)).catch(_=>(g(_),()=>i?st(i,{error:_}):null));const x=Ze(!1),m=Ze(),d=Ze(!!r);return r&&setTimeout(()=>{d.value=!1},r),s!=null&&setTimeout(()=>{if(!x.value&&!m.value){const _=new Error(`Async component timed out after ${s}ms.`);g(_),m.value=_}},s),h().then(()=>{x.value=!0,p.parent&&ks(p.parent.vnode)&&ya(p.parent.update)}).catch(_=>{g(_),m.value=_}),()=>{if(x.value&&c)return Ga(c,p);if(m.value&&i)return st(i,{error:m.value});if(n&&!d.value)return st(n)}}})}function Ga(t,e){const{ref:n,props:i,children:r,ce:s}=e.vnode,o=st(t,i,r);return o.ref=n,o.ce=s,delete e.vnode.ce,o}const ks=t=>t.type.__isKeepAlive,$_={name:"KeepAlive",__isKeepAlive:!0,props:{include:[String,RegExp,Array],exclude:[String,RegExp,Array],max:[String,Number]},setup(t,{slots:e}){const n=Ws(),i=n.ctx;if(!i.renderer)return()=>{const _=e.default&&e.default();return _&&_.length===1?_[0]:_};const r=new Map,s=new Set;let o=null;const a=n.suspense,{renderer:{p:l,m:c,um:u,o:{createElement:f}}}=i,h=f("div");i.activate=(_,v,y,S,R)=>{const w=_.component;c(_,v,y,0,a),l(w.vnode,_,v,y,w,a,S,_.slotScopeIds,R),Et(()=>{w.isDeactivated=!1,w.a&&fs(w.a);const P=_.props&&_.props.onVnodeMounted;P&&Ot(P,w.parent,_)},a)},i.deactivate=_=>{const v=_.component;c(_,h,null,1,a),Et(()=>{v.da&&fs(v.da);const y=_.props&&_.props.onVnodeUnmounted;y&&Ot(y,v.parent,_),v.isDeactivated=!0},a)};function p(_){Va(_),u(_,n,a,!0)}function g(_){r.forEach((v,y)=>{const S=Yl(v.type);S&&(!_||!_(S))&&x(y)})}function x(_){const v=r.get(_);!o||!dn(v,o)?p(v):o&&Va(o),r.delete(_),s.delete(_)}ki(()=>[t.include,t.exclude],([_,v])=>{_&&g(y=>os(_,y)),v&&g(y=>!os(v,y))},{flush:"post",deep:!0});let m=null;const d=()=>{m!=null&&r.set(m,Wa(n.subTree))};return zs(d),pp(d),Gs(()=>{r.forEach(_=>{const{subTree:v,suspense:y}=n,S=Wa(v);if(_.type===S.type&&_.key===S.key){Va(S);const R=S.component.da;R&&Et(R,y);return}p(_)})}),()=>{if(m=null,!e.default)return null;const _=e.default(),v=_[0];if(_.length>1)return o=null,_;if(!Ls(v)||!(v.shapeFlag&4)&&!(v.shapeFlag&128))return o=null,v;let y=Wa(v);const S=y.type,R=Yl(Pr(y)?y.type.__asyncResolved||{}:S),{include:w,exclude:P,max:M}=t;if(w&&(!R||!os(w,R))||P&&R&&os(P,R))return o=y,v;const T=y.key==null?S:y.key,F=r.get(T);return y.el&&(y=jn(y),v.shapeFlag&128&&(v.ssContent=y)),m=T,F?(y.el=F.el,y.component=F.component,y.transition&&ea(y,y.transition),y.shapeFlag|=512,s.delete(T),s.add(T)):(s.add(T),M&&s.size>parseInt(M,10)&&x(s.values().next().value)),y.shapeFlag|=256,o=y,rp(v.type)?v:y}}},Y_=$_;function os(t,e){return Ue(t)?t.some(n=>os(n,e)):ot(t)?t.split(",").includes(e):Ig(t)?t.test(e):!1}function fp(t,e){hp(t,"a",e)}function dp(t,e){hp(t,"da",e)}function hp(t,e,n=ht){const i=t.__wdc||(t.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return t()});if(Sa(e,i,n),n){let r=n.parent;for(;r&&r.parent;)ks(r.parent.vnode)&&K_(i,e,n,r),r=r.parent}}function K_(t,e,n,i){const r=Sa(e,t,i,!0);Yc(()=>{Uc(i[e],r)},n)}function Va(t){t.shapeFlag&=-257,t.shapeFlag&=-513}function Wa(t){return t.shapeFlag&128?t.ssContent:t}function Sa(t,e,n=ht,i=!1){if(n){const r=n[t]||(n[t]=[]),s=e.__weh||(e.__weh=(...o)=>{if(n.isUnmounted)return;Xr(),Or(n);const a=nn(e,n,t,o);return zi(),jr(),a});return i?r.unshift(s):r.push(s),s}}const qn=t=>(e,n=ht)=>(!Fr||t==="sp")&&Sa(t,(...i)=>e(...i),n),Z_=qn("bm"),zs=qn("m"),J_=qn("bu"),pp=qn("u"),Gs=qn("bum"),Yc=qn("um"),Q_=qn("sp"),ev=qn("rtg"),tv=qn("rtc");function mp(t,e=ht){Sa("ec",t,e)}const Kc="components";function nv(t,e){return _p(Kc,t,!0,e)||t}const gp=Symbol.for("v-ndc");function iv(t){return ot(t)?_p(Kc,t,!1)||t:t||gp}function _p(t,e,n=!0,i=!1){const r=Yt||ht;if(r){const s=r.type;if(t===Kc){const a=Yl(s,!1);if(a&&(a===e||a===wn(e)||a===ma(wn(e))))return s}const o=Bu(r[t]||s[t],e)||Bu(r.appContext[t],e);return!o&&i?s:o}}function Bu(t,e){return t&&(t[e]||t[wn(e)]||t[ma(wn(e))])}function rv(t,e,n,i){let r;const s=n&&n[i];if(Ue(t)||ot(t)){r=new Array(t.length);for(let o=0,a=t.length;o<a;o++)r[o]=e(t[o],o,void 0,s&&s[o])}else if(typeof t=="number"){r=new Array(t);for(let o=0;o<t;o++)r[o]=e(o+1,o,void 0,s&&s[o])}else if(tt(t))if(t[Symbol.iterator])r=Array.from(t,(o,a)=>e(o,a,void 0,s&&s[a]));else{const o=Object.keys(t);r=new Array(o.length);for(let a=0,l=o.length;a<l;a++){const c=o[a];r[a]=e(t[c],c,a,s&&s[a])}}else r=[];return n&&(n[i]=r),r}const Wl=t=>t?Lp(t)?iu(t)||t.proxy:Wl(t.parent):null,ds=pt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Wl(t.parent),$root:t=>Wl(t.root),$emit:t=>t.emit,$options:t=>Zc(t),$forceUpdate:t=>t.f||(t.f=()=>ya(t.update)),$nextTick:t=>t.n||(t.n=Ki.bind(t.proxy)),$watch:t=>W_.bind(t)}),Xa=(t,e)=>t!==nt&&!t.__isScriptSetup&&Ye(t,e),sv={get({_:t},e){const{ctx:n,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=t;let c;if(e[0]!=="$"){const p=o[e];if(p!==void 0)switch(p){case 1:return i[e];case 2:return r[e];case 4:return n[e];case 3:return s[e]}else{if(Xa(i,e))return o[e]=1,i[e];if(r!==nt&&Ye(r,e))return o[e]=2,r[e];if((c=t.propsOptions[0])&&Ye(c,e))return o[e]=3,s[e];if(n!==nt&&Ye(n,e))return o[e]=4,n[e];Xl&&(o[e]=0)}}const u=ds[e];let f,h;if(u)return e==="$attrs"&&Gt(t,"get",e),u(t);if((f=a.__cssModules)&&(f=f[e]))return f;if(n!==nt&&Ye(n,e))return o[e]=4,n[e];if(h=l.config.globalProperties,Ye(h,e))return h[e]},set({_:t},e,n){const{data:i,setupState:r,ctx:s}=t;return Xa(r,e)?(r[e]=n,!0):i!==nt&&Ye(i,e)?(i[e]=n,!0):Ye(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(s[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:r,propsOptions:s}},o){let a;return!!n[o]||t!==nt&&Ye(t,o)||Xa(e,o)||(a=s[0])&&Ye(a,o)||Ye(i,o)||Ye(ds,o)||Ye(r.config.globalProperties,o)},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:Ye(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Hu(t){return Ue(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Xl=!0;function ov(t){const e=Zc(t),n=t.proxy,i=t.ctx;Xl=!1,e.beforeCreate&&ku(e.beforeCreate,t,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:f,mounted:h,beforeUpdate:p,updated:g,activated:x,deactivated:m,beforeDestroy:d,beforeUnmount:_,destroyed:v,unmounted:y,render:S,renderTracked:R,renderTriggered:w,errorCaptured:P,serverPrefetch:M,expose:T,inheritAttrs:F,components:H,directives:N,filters:U}=e;if(c&&av(c,i,null),o)for(const q in o){const Y=o[q];Be(Y)&&(i[q]=Y.bind(n))}if(r){const q=r.call(n,n);tt(q)&&(t.data=Xn(q))}if(Xl=!0,s)for(const q in s){const Y=s[q],ce=Be(Y)?Y.bind(n,n):Be(Y.get)?Y.get.bind(n,n):gn,de=!Be(Y)&&Be(Y.set)?Y.set.bind(n):gn,V=mt({get:ce,set:de});Object.defineProperty(i,q,{enumerable:!0,configurable:!0,get:()=>V.value,set:Q=>V.value=Q})}if(a)for(const q in a)vp(a[q],i,n,q);if(l){const q=Be(l)?l.call(n):l;Reflect.ownKeys(q).forEach(Y=>{Lr(Y,q[Y])})}u&&ku(u,t,"c");function K(q,Y){Ue(Y)?Y.forEach(ce=>q(ce.bind(n))):Y&&q(Y.bind(n))}if(K(Z_,f),K(zs,h),K(J_,p),K(pp,g),K(fp,x),K(dp,m),K(mp,P),K(tv,R),K(ev,w),K(Gs,_),K(Yc,y),K(Q_,M),Ue(T))if(T.length){const q=t.exposed||(t.exposed={});T.forEach(Y=>{Object.defineProperty(q,Y,{get:()=>n[Y],set:ce=>n[Y]=ce})})}else t.exposed||(t.exposed={});S&&t.render===gn&&(t.render=S),F!=null&&(t.inheritAttrs=F),H&&(t.components=H),N&&(t.directives=N)}function av(t,e,n=gn){Ue(t)&&(t=jl(t));for(const i in t){const r=t[i];let s;tt(r)?"default"in r?s=Bt(r.from||i,r.default,!0):s=Bt(r.from||i):s=Bt(r),it(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function ku(t,e,n){nn(Ue(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function vp(t,e,n,i){const r=i.includes(".")?ap(n,i):()=>n[i];if(ot(t)){const s=e[t];Be(s)&&ki(r,s)}else if(Be(t))ki(r,t.bind(n));else if(tt(t))if(Ue(t))t.forEach(s=>vp(s,e,n,i));else{const s=Be(t.handler)?t.handler.bind(n):e[t.handler];Be(s)&&ki(r,s,t)}}function Zc(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=t.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!n&&!i?l=e:(l={},r.length&&r.forEach(c=>ta(l,c,o,!0)),ta(l,e,o)),tt(e)&&s.set(e,l),l}function ta(t,e,n,i=!1){const{mixins:r,extends:s}=e;s&&ta(t,s,n,!0),r&&r.forEach(o=>ta(t,o,n,!0));for(const o in e)if(!(i&&o==="expose")){const a=lv[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const lv={data:zu,props:Gu,emits:Gu,methods:as,computed:as,beforeCreate:Lt,created:Lt,beforeMount:Lt,mounted:Lt,beforeUpdate:Lt,updated:Lt,beforeDestroy:Lt,beforeUnmount:Lt,destroyed:Lt,unmounted:Lt,activated:Lt,deactivated:Lt,errorCaptured:Lt,serverPrefetch:Lt,components:as,directives:as,watch:uv,provide:zu,inject:cv};function zu(t,e){return e?t?function(){return pt(Be(t)?t.call(this,this):t,Be(e)?e.call(this,this):e)}:e:t}function cv(t,e){return as(jl(t),jl(e))}function jl(t){if(Ue(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Lt(t,e){return t?[...new Set([].concat(t,e))]:e}function as(t,e){return t?pt(Object.create(null),t,e):e}function Gu(t,e){return t?Ue(t)&&Ue(e)?[...new Set([...t,...e])]:pt(Object.create(null),Hu(t),Hu(e??{})):e}function uv(t,e){if(!t)return e;if(!e)return t;const n=pt(Object.create(null),t);for(const i in e)n[i]=Lt(t[i],e[i]);return n}function xp(){return{app:null,config:{isNativeTag:Lg,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let fv=0;function dv(t,e){return function(i,r=null){Be(i)||(i=pt({},i)),r!=null&&!tt(r)&&(r=null);const s=xp(),o=new Set;let a=!1;const l=s.app={_uid:fv++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:Up,get config(){return s.config},set config(c){},use(c,...u){return o.has(c)||(c&&Be(c.install)?(o.add(c),c.install(l,...u)):Be(c)&&(o.add(c),c(l,...u))),l},mixin(c){return s.mixins.includes(c)||s.mixins.push(c),l},component(c,u){return u?(s.components[c]=u,l):s.components[c]},directive(c,u){return u?(s.directives[c]=u,l):s.directives[c]},mount(c,u,f){if(!a){const h=st(i,r);return h.appContext=s,u&&e?e(h,c):t(h,c,f),a=!0,l._container=c,c.__vue_app__=l,iu(h.component)||h.component.proxy}},unmount(){a&&(t(null,l._container),delete l._container.__vue_app__)},provide(c,u){return s.provides[c]=u,l},runWithContext(c){Ps=l;try{return c()}finally{Ps=null}}};return l}}let Ps=null;function Lr(t,e){if(ht){let n=ht.provides;const i=ht.parent&&ht.parent.provides;i===n&&(n=ht.provides=Object.create(i)),n[t]=e}}function Bt(t,e,n=!1){const i=ht||Yt;if(i||Ps){const r=i?i.parent==null?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:Ps._context.provides;if(r&&t in r)return r[t];if(arguments.length>1)return n&&Be(e)?e.call(i&&i.proxy):e}}function Jc(){return!!(ht||Yt||Ps)}function hv(t,e,n,i=!1){const r={},s={};Yo(s,ba,1),t.propsDefaults=Object.create(null),yp(t,e,r,s);for(const o in t.propsOptions[0])o in r||(r[o]=void 0);n?t.props=i?r:Hs(r):t.type.props?t.props=r:t.props=s,t.attrs=s}function pv(t,e,n,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=t,a=qe(r),[l]=t.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let f=0;f<u.length;f++){let h=u[f];if(Ma(t.emitsOptions,h))continue;const p=e[h];if(l)if(Ye(s,h))p!==s[h]&&(s[h]=p,c=!0);else{const g=wn(h);r[g]=ql(l,a,g,p,t,!1)}else p!==s[h]&&(s[h]=p,c=!0)}}}else{yp(t,e,r,s)&&(c=!0);let u;for(const f in a)(!e||!Ye(e,f)&&((u=Wr(f))===f||!Ye(e,u)))&&(l?n&&(n[f]!==void 0||n[u]!==void 0)&&(r[f]=ql(l,a,f,void 0,t,!0)):delete r[f]);if(s!==a)for(const f in s)(!e||!Ye(e,f))&&(delete s[f],c=!0)}c&&Wn(t,"set","$attrs")}function yp(t,e,n,i){const[r,s]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(us(l))continue;const c=e[l];let u;r&&Ye(r,u=wn(l))?!s||!s.includes(u)?n[u]=c:(a||(a={}))[u]=c:Ma(t.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=qe(n),c=a||nt;for(let u=0;u<s.length;u++){const f=s[u];n[f]=ql(r,l,f,c[f],t,!Ye(c,f))}}return o}function ql(t,e,n,i,r,s){const o=t[n];if(o!=null){const a=Ye(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&Be(l)){const{propsDefaults:c}=r;n in c?i=c[n]:(Or(r),i=c[n]=l.call(null,e),zi())}else i=l}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===Wr(n))&&(i=!0))}return i}function Mp(t,e,n=!1){const i=e.propsCache,r=i.get(t);if(r)return r;const s=t.props,o={},a=[];let l=!1;if(!Be(t)){const u=f=>{l=!0;const[h,p]=Mp(f,e,!0);pt(o,h),p&&a.push(...p)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!s&&!l)return tt(t)&&i.set(t,Ar),Ar;if(Ue(s))for(let u=0;u<s.length;u++){const f=wn(s[u]);Vu(f)&&(o[f]=nt)}else if(s)for(const u in s){const f=wn(u);if(Vu(f)){const h=s[u],p=o[f]=Ue(h)||Be(h)?{type:h}:pt({},h);if(p){const g=ju(Boolean,p.type),x=ju(String,p.type);p[0]=g>-1,p[1]=x<0||g<x,(g>-1||Ye(p,"default"))&&a.push(f)}}}const c=[o,a];return tt(t)&&i.set(t,c),c}function Vu(t){return t[0]!=="$"}function Wu(t){const e=t&&t.toString().match(/^\s*(function|class) (\w+)/);return e?e[2]:t===null?"null":""}function Xu(t,e){return Wu(t)===Wu(e)}function ju(t,e){return Ue(e)?e.findIndex(n=>Xu(n,t)):Be(e)&&Xu(e,t)?0:-1}const Ep=t=>t[0]==="_"||t==="$stable",Qc=t=>Ue(t)?t.map(Qt):[Qt(t)],mv=(t,e,n)=>{if(e._n)return e;const i=Xc((...r)=>Qc(e(...r)),n);return i._c=!1,i},Sp=(t,e,n)=>{const i=t._ctx;for(const r in t){if(Ep(r))continue;const s=t[r];if(Be(s))e[r]=mv(r,s,i);else if(s!=null){const o=Qc(s);e[r]=()=>o}}},bp=(t,e)=>{const n=Qc(e);t.slots.default=()=>n},gv=(t,e)=>{if(t.vnode.shapeFlag&32){const n=e._;n?(t.slots=qe(e),Yo(e,"_",n)):Sp(e,t.slots={})}else t.slots={},e&&bp(t,e);Yo(t.slots,ba,1)},_v=(t,e,n)=>{const{vnode:i,slots:r}=t;let s=!0,o=nt;if(i.shapeFlag&32){const a=e._;a?n&&a===1?s=!1:(pt(r,e),!n&&a===1&&delete r._):(s=!e.$stable,Sp(e,r)),o=e}else e&&(bp(t,e),o={default:1});if(s)for(const a in r)!Ep(a)&&!(a in o)&&delete r[a]};function na(t,e,n,i,r=!1){if(Ue(t)){t.forEach((h,p)=>na(h,e&&(Ue(e)?e[p]:e),n,i,r));return}if(Pr(i)&&!r)return;const s=i.shapeFlag&4?iu(i.component)||i.component.proxy:i.el,o=r?null:s,{i:a,r:l}=t,c=e&&e.r,u=a.refs===nt?a.refs={}:a.refs,f=a.setupState;if(c!=null&&c!==l&&(ot(c)?(u[c]=null,Ye(f,c)&&(f[c]=null)):it(c)&&(c.value=null)),Be(l))mi(l,a,12,[o,u]);else{const h=ot(l),p=it(l);if(h||p){const g=()=>{if(t.f){const x=h?Ye(f,l)?f[l]:u[l]:l.value;r?Ue(x)&&Uc(x,s):Ue(x)?x.includes(s)||x.push(s):h?(u[l]=[s],Ye(f,l)&&(f[l]=u[l])):(l.value=[s],t.k&&(u[t.k]=l.value))}else h?(u[l]=o,Ye(f,l)&&(f[l]=o)):p&&(l.value=o,t.k&&(u[t.k]=o))};o?(g.id=-1,Et(g,n)):g()}}}let Kn=!1;const lo=t=>/svg/.test(t.namespaceURI)&&t.tagName!=="foreignObject",co=t=>t.nodeType===8;function vv(t){const{mt:e,p:n,o:{patchProp:i,createText:r,nextSibling:s,parentNode:o,remove:a,insert:l,createComment:c}}=t,u=(d,_)=>{if(!_.hasChildNodes()){n(null,d,_),Jo(),_._vnode=d;return}Kn=!1,f(_.firstChild,d,null,null,null),Jo(),_._vnode=d,Kn&&console.error("Hydration completed but contains mismatches.")},f=(d,_,v,y,S,R=!1)=>{const w=co(d)&&d.data==="[",P=()=>x(d,_,v,y,S,w),{type:M,ref:T,shapeFlag:F,patchFlag:H}=_;let N=d.nodeType;_.el=d,H===-2&&(R=!1,_.dynamicChildren=null);let U=null;switch(M){case Ir:N!==3?_.children===""?(l(_.el=r(""),o(d),d),U=d):U=P():(d.data!==_.children&&(Kn=!0,d.data=_.children),U=s(d));break;case Ht:N!==8||w?U=P():U=s(d);break;case ko:if(w&&(d=s(d),N=d.nodeType),N===1||N===3){U=d;const B=!_.children.length;for(let K=0;K<_.staticCount;K++)B&&(_.children+=U.nodeType===1?U.outerHTML:U.data),K===_.staticCount-1&&(_.anchor=U),U=s(U);return w?s(U):U}else P();break;case Ft:w?U=g(d,_,v,y,S,R):U=P();break;default:if(F&1)N!==1||_.type.toLowerCase()!==d.tagName.toLowerCase()?U=P():U=h(d,_,v,y,S,R);else if(F&6){_.slotScopeIds=S;const B=o(d);if(e(_,B,null,v,y,lo(B),R),U=w?m(d):s(d),U&&co(U)&&U.data==="teleport end"&&(U=s(U)),Pr(_)){let K;w?(K=st(Ft),K.anchor=U?U.previousSibling:B.lastChild):K=d.nodeType===3?eu(""):st("div"),K.el=d,_.component.subTree=K}}else F&64?N!==8?U=P():U=_.type.hydrate(d,_,v,y,S,R,t,p):F&128&&(U=_.type.hydrate(d,_,v,y,lo(o(d)),S,R,t,f))}return T!=null&&na(T,null,y,_),U},h=(d,_,v,y,S,R)=>{R=R||!!_.dynamicChildren;const{type:w,props:P,patchFlag:M,shapeFlag:T,dirs:F}=_,H=w==="input"&&F||w==="option";if(H||M!==-1){if(F&&Sn(_,null,v,"created"),P)if(H||!R||M&48)for(const U in P)(H&&U.endsWith("value")||Fs(U)&&!us(U))&&i(d,U,null,P[U],!1,void 0,v);else P.onClick&&i(d,"onClick",null,P.onClick,!1,void 0,v);let N;if((N=P&&P.onVnodeBeforeMount)&&Ot(N,v,_),F&&Sn(_,null,v,"beforeMount"),((N=P&&P.onVnodeMounted)||F)&&op(()=>{N&&Ot(N,v,_),F&&Sn(_,null,v,"mounted")},y),T&16&&!(P&&(P.innerHTML||P.textContent))){let U=p(d.firstChild,_,d,v,y,S,R);for(;U;){Kn=!0;const B=U;U=U.nextSibling,a(B)}}else T&8&&d.textContent!==_.children&&(Kn=!0,d.textContent=_.children)}return d.nextSibling},p=(d,_,v,y,S,R,w)=>{w=w||!!_.dynamicChildren;const P=_.children,M=P.length;for(let T=0;T<M;T++){const F=w?P[T]:P[T]=Qt(P[T]);if(d)d=f(d,F,y,S,R,w);else{if(F.type===Ir&&!F.children)continue;Kn=!0,n(null,F,v,null,y,S,lo(v),R)}}return d},g=(d,_,v,y,S,R)=>{const{slotScopeIds:w}=_;w&&(S=S?S.concat(w):w);const P=o(d),M=p(s(d),_,P,v,y,S,R);return M&&co(M)&&M.data==="]"?s(_.anchor=M):(Kn=!0,l(_.anchor=c("]"),P,M),M)},x=(d,_,v,y,S,R)=>{if(Kn=!0,_.el=null,R){const M=m(d);for(;;){const T=s(d);if(T&&T!==M)a(T);else break}}const w=s(d),P=o(d);return a(d),n(null,_,P,w,v,y,lo(P),S),w},m=d=>{let _=0;for(;d;)if(d=s(d),d&&co(d)&&(d.data==="["&&_++,d.data==="]")){if(_===0)return s(d);_--}return d};return[u,f]}const Et=op;function xv(t){return Tp(t)}function yv(t){return Tp(t,vv)}function Tp(t,e){const n=Bl();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:f,nextSibling:h,setScopeId:p=gn,insertStaticContent:g}=t,x=(E,D,I,z=null,W=null,ie=null,he=!1,ee=null,fe=!!D.dynamicChildren)=>{if(E===D)return;E&&!dn(E,D)&&(z=j(E),Q(E,W,ie,!0),E=null),D.patchFlag===-2&&(fe=!1,D.dynamicChildren=null);const{type:le,ref:be,shapeFlag:A}=D;switch(le){case Ir:m(E,D,I,z);break;case Ht:d(E,D,I,z);break;case ko:E==null&&_(D,I,z,he);break;case Ft:H(E,D,I,z,W,ie,he,ee,fe);break;default:A&1?S(E,D,I,z,W,ie,he,ee,fe):A&6?N(E,D,I,z,W,ie,he,ee,fe):(A&64||A&128)&&le.process(E,D,I,z,W,ie,he,ee,fe,ue)}be!=null&&W&&na(be,E&&E.ref,ie,D||E,!D)},m=(E,D,I,z)=>{if(E==null)i(D.el=a(D.children),I,z);else{const W=D.el=E.el;D.children!==E.children&&c(W,D.children)}},d=(E,D,I,z)=>{E==null?i(D.el=l(D.children||""),I,z):D.el=E.el},_=(E,D,I,z)=>{[E.el,E.anchor]=g(E.children,D,I,z,E.el,E.anchor)},v=({el:E,anchor:D},I,z)=>{let W;for(;E&&E!==D;)W=h(E),i(E,I,z),E=W;i(D,I,z)},y=({el:E,anchor:D})=>{let I;for(;E&&E!==D;)I=h(E),r(E),E=I;r(D)},S=(E,D,I,z,W,ie,he,ee,fe)=>{he=he||D.type==="svg",E==null?R(D,I,z,W,ie,he,ee,fe):M(E,D,W,ie,he,ee,fe)},R=(E,D,I,z,W,ie,he,ee)=>{let fe,le;const{type:be,props:A,shapeFlag:b,transition:k,dirs:te}=E;if(fe=E.el=o(E.type,ie,A&&A.is,A),b&8?u(fe,E.children):b&16&&P(E.children,fe,null,z,W,ie&&be!=="foreignObject",he,ee),te&&Sn(E,null,z,"created"),w(fe,E,E.scopeId,he,z),A){for(const L in A)L!=="value"&&!us(L)&&s(fe,L,null,A[L],ie,E.children,z,W,we);"value"in A&&s(fe,"value",null,A.value),(le=A.onVnodeBeforeMount)&&Ot(le,z,E)}te&&Sn(E,null,z,"beforeMount");const ae=(!W||W&&!W.pendingBranch)&&k&&!k.persisted;ae&&k.beforeEnter(fe),i(fe,D,I),((le=A&&A.onVnodeMounted)||ae||te)&&Et(()=>{le&&Ot(le,z,E),ae&&k.enter(fe),te&&Sn(E,null,z,"mounted")},W)},w=(E,D,I,z,W)=>{if(I&&p(E,I),z)for(let ie=0;ie<z.length;ie++)p(E,z[ie]);if(W){let ie=W.subTree;if(D===ie){const he=W.vnode;w(E,he,he.scopeId,he.slotScopeIds,W.parent)}}},P=(E,D,I,z,W,ie,he,ee,fe=0)=>{for(let le=fe;le<E.length;le++){const be=E[le]=ee?si(E[le]):Qt(E[le]);x(null,be,D,I,z,W,ie,he,ee)}},M=(E,D,I,z,W,ie,he)=>{const ee=D.el=E.el;let{patchFlag:fe,dynamicChildren:le,dirs:be}=D;fe|=E.patchFlag&16;const A=E.props||nt,b=D.props||nt;let k;I&&Ti(I,!1),(k=b.onVnodeBeforeUpdate)&&Ot(k,I,D,E),be&&Sn(D,E,I,"beforeUpdate"),I&&Ti(I,!0);const te=W&&D.type!=="foreignObject";if(le?T(E.dynamicChildren,le,ee,I,z,te,ie):he||Y(E,D,ee,null,I,z,te,ie,!1),fe>0){if(fe&16)F(ee,D,A,b,I,z,W);else if(fe&2&&A.class!==b.class&&s(ee,"class",null,b.class,W),fe&4&&s(ee,"style",A.style,b.style,W),fe&8){const ae=D.dynamicProps;for(let L=0;L<ae.length;L++){const ne=ae[L],pe=A[ne],Z=b[ne];(Z!==pe||ne==="value")&&s(ee,ne,pe,Z,W,E.children,I,z,we)}}fe&1&&E.children!==D.children&&u(ee,D.children)}else!he&&le==null&&F(ee,D,A,b,I,z,W);((k=b.onVnodeUpdated)||be)&&Et(()=>{k&&Ot(k,I,D,E),be&&Sn(D,E,I,"updated")},z)},T=(E,D,I,z,W,ie,he)=>{for(let ee=0;ee<D.length;ee++){const fe=E[ee],le=D[ee],be=fe.el&&(fe.type===Ft||!dn(fe,le)||fe.shapeFlag&70)?f(fe.el):I;x(fe,le,be,null,z,W,ie,he,!0)}},F=(E,D,I,z,W,ie,he)=>{if(I!==z){if(I!==nt)for(const ee in I)!us(ee)&&!(ee in z)&&s(E,ee,I[ee],null,he,D.children,W,ie,we);for(const ee in z){if(us(ee))continue;const fe=z[ee],le=I[ee];fe!==le&&ee!=="value"&&s(E,ee,le,fe,he,D.children,W,ie,we)}"value"in z&&s(E,"value",I.value,z.value)}},H=(E,D,I,z,W,ie,he,ee,fe)=>{const le=D.el=E?E.el:a(""),be=D.anchor=E?E.anchor:a("");let{patchFlag:A,dynamicChildren:b,slotScopeIds:k}=D;k&&(ee=ee?ee.concat(k):k),E==null?(i(le,I,z),i(be,I,z),P(D.children,I,be,W,ie,he,ee,fe)):A>0&&A&64&&b&&E.dynamicChildren?(T(E.dynamicChildren,b,I,W,ie,he,ee),(D.key!=null||W&&D===W.subTree)&&Ap(E,D,!0)):Y(E,D,I,be,W,ie,he,ee,fe)},N=(E,D,I,z,W,ie,he,ee,fe)=>{D.slotScopeIds=ee,E==null?D.shapeFlag&512?W.ctx.activate(D,I,z,he,fe):U(D,I,z,W,ie,he,fe):B(E,D,fe)},U=(E,D,I,z,W,ie,he)=>{const ee=E.component=wv(E,z,W);if(ks(E)&&(ee.ctx.renderer=ue),Rv(ee),ee.asyncDep){if(W&&W.registerDep(ee,K),!E.el){const fe=ee.subTree=st(Ht);d(null,fe,D,I)}return}K(ee,E,D,I,W,ie,he)},B=(E,D,I)=>{const z=D.component=E.component;if(O_(E,D,I))if(z.asyncDep&&!z.asyncResolved){q(z,D,I);return}else z.next=D,P_(z.update),z.update();else D.el=E.el,z.vnode=D},K=(E,D,I,z,W,ie,he)=>{const ee=()=>{if(E.isMounted){let{next:be,bu:A,u:b,parent:k,vnode:te}=E,ae=be,L;Ti(E,!1),be?(be.el=te.el,q(E,be,he)):be=te,A&&fs(A),(L=be.props&&be.props.onVnodeBeforeUpdate)&&Ot(L,k,be,te),Ti(E,!0);const ne=ka(E),pe=E.subTree;E.subTree=ne,x(pe,ne,f(pe.el),j(pe),E,W,ie),be.el=ne.el,ae===null&&jc(E,ne.el),b&&Et(b,W),(L=be.props&&be.props.onVnodeUpdated)&&Et(()=>Ot(L,k,be,te),W)}else{let be;const{el:A,props:b}=D,{bm:k,m:te,parent:ae}=E,L=Pr(D);if(Ti(E,!1),k&&fs(k),!L&&(be=b&&b.onVnodeBeforeMount)&&Ot(be,ae,D),Ti(E,!0),A&&Ae){const ne=()=>{E.subTree=ka(E),Ae(A,E.subTree,E,W,null)};L?D.type.__asyncLoader().then(()=>!E.isUnmounted&&ne()):ne()}else{const ne=E.subTree=ka(E);x(null,ne,I,z,E,W,ie),D.el=ne.el}if(te&&Et(te,W),!L&&(be=b&&b.onVnodeMounted)){const ne=D;Et(()=>Ot(be,ae,ne),W)}(D.shapeFlag&256||ae&&Pr(ae.vnode)&&ae.vnode.shapeFlag&256)&&E.a&&Et(E.a,W),E.isMounted=!0,D=I=z=null}},fe=E.effect=new Fc(ee,()=>ya(le),E.scope),le=E.update=()=>fe.run();le.id=E.uid,Ti(E,!0),le()},q=(E,D,I)=>{D.component=E;const z=E.vnode.props;E.vnode=D,E.next=null,pv(E,D.props,z,I),_v(E,D.children,I),Xr(),Uu(),jr()},Y=(E,D,I,z,W,ie,he,ee,fe=!1)=>{const le=E&&E.children,be=E?E.shapeFlag:0,A=D.children,{patchFlag:b,shapeFlag:k}=D;if(b>0){if(b&128){de(le,A,I,z,W,ie,he,ee,fe);return}else if(b&256){ce(le,A,I,z,W,ie,he,ee,fe);return}}k&8?(be&16&&we(le,W,ie),A!==le&&u(I,A)):be&16?k&16?de(le,A,I,z,W,ie,he,ee,fe):we(le,W,ie,!0):(be&8&&u(I,""),k&16&&P(A,I,z,W,ie,he,ee,fe))},ce=(E,D,I,z,W,ie,he,ee,fe)=>{E=E||Ar,D=D||Ar;const le=E.length,be=D.length,A=Math.min(le,be);let b;for(b=0;b<A;b++){const k=D[b]=fe?si(D[b]):Qt(D[b]);x(E[b],k,I,null,W,ie,he,ee,fe)}le>be?we(E,W,ie,!0,!1,A):P(D,I,z,W,ie,he,ee,fe,A)},de=(E,D,I,z,W,ie,he,ee,fe)=>{let le=0;const be=D.length;let A=E.length-1,b=be-1;for(;le<=A&&le<=b;){const k=E[le],te=D[le]=fe?si(D[le]):Qt(D[le]);if(dn(k,te))x(k,te,I,null,W,ie,he,ee,fe);else break;le++}for(;le<=A&&le<=b;){const k=E[A],te=D[b]=fe?si(D[b]):Qt(D[b]);if(dn(k,te))x(k,te,I,null,W,ie,he,ee,fe);else break;A--,b--}if(le>A){if(le<=b){const k=b+1,te=k<be?D[k].el:z;for(;le<=b;)x(null,D[le]=fe?si(D[le]):Qt(D[le]),I,te,W,ie,he,ee,fe),le++}}else if(le>b)for(;le<=A;)Q(E[le],W,ie,!0),le++;else{const k=le,te=le,ae=new Map;for(le=te;le<=b;le++){const xe=D[le]=fe?si(D[le]):Qt(D[le]);xe.key!=null&&ae.set(xe.key,le)}let L,ne=0;const pe=b-te+1;let Z=!1,Re=0;const Pe=new Array(pe);for(le=0;le<pe;le++)Pe[le]=0;for(le=k;le<=A;le++){const xe=E[le];if(ne>=pe){Q(xe,W,ie,!0);continue}let Me;if(xe.key!=null)Me=ae.get(xe.key);else for(L=te;L<=b;L++)if(Pe[L-te]===0&&dn(xe,D[L])){Me=L;break}Me===void 0?Q(xe,W,ie,!0):(Pe[Me-te]=le+1,Me>=Re?Re=Me:Z=!0,x(xe,D[Me],I,null,W,ie,he,ee,fe),ne++)}const Le=Z?Mv(Pe):Ar;for(L=Le.length-1,le=pe-1;le>=0;le--){const xe=te+le,Me=D[xe],Ie=xe+1<be?D[xe+1].el:z;Pe[le]===0?x(null,Me,I,Ie,W,ie,he,ee,fe):Z&&(L<0||le!==Le[L]?V(Me,I,Ie,2):L--)}}},V=(E,D,I,z,W=null)=>{const{el:ie,type:he,transition:ee,children:fe,shapeFlag:le}=E;if(le&6){V(E.component.subTree,D,I,z);return}if(le&128){E.suspense.move(D,I,z);return}if(le&64){he.move(E,D,I,ue);return}if(he===Ft){i(ie,D,I);for(let A=0;A<fe.length;A++)V(fe[A],D,I,z);i(E.anchor,D,I);return}if(he===ko){v(E,D,I);return}if(z!==2&&le&1&&ee)if(z===0)ee.beforeEnter(ie),i(ie,D,I),Et(()=>ee.enter(ie),W);else{const{leave:A,delayLeave:b,afterLeave:k}=ee,te=()=>i(ie,D,I),ae=()=>{A(ie,()=>{te(),k&&k()})};b?b(ie,te,ae):ae()}else i(ie,D,I)},Q=(E,D,I,z=!1,W=!1)=>{const{type:ie,props:he,ref:ee,children:fe,dynamicChildren:le,shapeFlag:be,patchFlag:A,dirs:b}=E;if(ee!=null&&na(ee,null,I,E,!0),be&256){D.ctx.deactivate(E);return}const k=be&1&&b,te=!Pr(E);let ae;if(te&&(ae=he&&he.onVnodeBeforeUnmount)&&Ot(ae,D,E),be&6)ye(E.component,I,z);else{if(be&128){E.suspense.unmount(I,z);return}k&&Sn(E,null,D,"beforeUnmount"),be&64?E.type.remove(E,D,I,W,ue,z):le&&(ie!==Ft||A>0&&A&64)?we(le,D,I,!1,!0):(ie===Ft&&A&384||!W&&be&16)&&we(fe,D,I),z&&me(E)}(te&&(ae=he&&he.onVnodeUnmounted)||k)&&Et(()=>{ae&&Ot(ae,D,E),k&&Sn(E,null,D,"unmounted")},I)},me=E=>{const{type:D,el:I,anchor:z,transition:W}=E;if(D===Ft){_e(I,z);return}if(D===ko){y(E);return}const ie=()=>{r(I),W&&!W.persisted&&W.afterLeave&&W.afterLeave()};if(E.shapeFlag&1&&W&&!W.persisted){const{leave:he,delayLeave:ee}=W,fe=()=>he(I,ie);ee?ee(E.el,ie,fe):fe()}else ie()},_e=(E,D)=>{let I;for(;E!==D;)I=h(E),r(E),E=I;r(D)},ye=(E,D,I)=>{const{bum:z,scope:W,update:ie,subTree:he,um:ee}=E;z&&fs(z),W.stop(),ie&&(ie.active=!1,Q(he,E,D,I)),ee&&Et(ee,D),Et(()=>{E.isUnmounted=!0},D),D&&D.pendingBranch&&!D.isUnmounted&&E.asyncDep&&!E.asyncResolved&&E.suspenseId===D.pendingId&&(D.deps--,D.deps===0&&D.resolve())},we=(E,D,I,z=!1,W=!1,ie=0)=>{for(let he=ie;he<E.length;he++)Q(E[he],D,I,z,W)},j=E=>E.shapeFlag&6?j(E.component.subTree):E.shapeFlag&128?E.suspense.next():h(E.anchor||E.el),oe=(E,D,I)=>{E==null?D._vnode&&Q(D._vnode,null,null,!0):x(D._vnode||null,E,D,null,null,null,I),Uu(),Jo(),D._vnode=E},ue={p:x,um:Q,m:V,r:me,mt:U,mc:P,pc:Y,pbc:T,n:j,o:t};let Ee,Ae;return e&&([Ee,Ae]=e(ue)),{render:oe,hydrate:Ee,createApp:dv(oe,Ee)}}function Ti({effect:t,update:e},n){t.allowRecurse=e.allowRecurse=n}function Ap(t,e,n=!1){const i=t.children,r=e.children;if(Ue(i)&&Ue(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=si(r[s]),a.el=o.el),n||Ap(o,a)),a.type===Ir&&(a.el=o.el)}}function Mv(t){const e=t.slice(),n=[0];let i,r,s,o,a;const l=t.length;for(i=0;i<l;i++){const c=t[i];if(c!==0){if(r=n[n.length-1],t[r]<c){e[i]=r,n.push(i);continue}for(s=0,o=n.length-1;s<o;)a=s+o>>1,t[n[a]]<c?s=a+1:o=a;c<t[n[s]]&&(s>0&&(e[i]=n[s-1]),n[s]=i)}}for(s=n.length,o=n[s-1];s-- >0;)n[s]=o,o=e[o];return n}const Ev=t=>t.__isTeleport,Ft=Symbol.for("v-fgt"),Ir=Symbol.for("v-txt"),Ht=Symbol.for("v-cmt"),ko=Symbol.for("v-stc"),hs=[];let tn=null;function St(t=!1){hs.push(tn=t?null:[])}function wp(){hs.pop(),tn=hs[hs.length-1]||null}let Nr=1;function qu(t){Nr+=t}function Rp(t){return t.dynamicChildren=Nr>0?tn||Ar:null,wp(),Nr>0&&tn&&tn.push(t),t}function ai(t,e,n,i,r,s){return Rp(Vs(t,e,n,i,r,s,!0))}function li(t,e,n,i,r){return Rp(st(t,e,n,i,r,!0))}function Ls(t){return t?t.__v_isVNode===!0:!1}function dn(t,e){return t.type===e.type&&t.key===e.key}const ba="__vInternal",Cp=({key:t})=>t??null,zo=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?ot(t)||it(t)||Be(t)?{i:Yt,r:t,k:e,f:!!n}:t:null);function Vs(t,e=null,n=null,i=0,r=null,s=t===Ft?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Cp(e),ref:e&&zo(e),scopeId:Ea,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Yt};return a?(tu(l,n),s&128&&t.normalize(l)):n&&(l.shapeFlag|=ot(n)?8:16),Nr>0&&!o&&tn&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&tn.push(l),l}const st=Sv;function Sv(t,e=null,n=null,i=0,r=null,s=!1){if((!t||t===gp)&&(t=Ht),Ls(t)){const a=jn(t,e,!0);return n&&tu(a,n),Nr>0&&!s&&tn&&(a.shapeFlag&6?tn[tn.indexOf(t)]=a:tn.push(a)),a.patchFlag|=-2,a}if(Dv(t)&&(t=t.__vccOpts),e){e=Pp(e);let{class:a,style:l}=e;a&&!ot(a)&&(e.class=_a(a)),tt(l)&&(qh(l)&&!Ue(l)&&(l=pt({},l)),e.style=ga(l))}const o=ot(t)?1:rp(t)?128:Ev(t)?64:tt(t)?4:Be(t)?2:0;return Vs(t,e,n,i,r,o,s,!0)}function Pp(t){return t?qh(t)||ba in t?pt({},t):t:null}function jn(t,e,n=!1){const{props:i,ref:r,patchFlag:s,children:o}=t,a=e?bv(i||{},e):i;return{__v_isVNode:!0,__v_skip:!0,type:t.type,props:a,key:a&&Cp(a),ref:e&&e.ref?n&&r?Ue(r)?r.concat(zo(e)):[r,zo(e)]:zo(e):r,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:o,target:t.target,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ft?s===-1?16:s|16:s,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:t.transition,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&jn(t.ssContent),ssFallback:t.ssFallback&&jn(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce}}function eu(t=" ",e=0){return st(Ir,null,t,e)}function ls(t="",e=!1){return e?(St(),li(Ht,null,t)):st(Ht,null,t)}function Qt(t){return t==null||typeof t=="boolean"?st(Ht):Ue(t)?st(Ft,null,t.slice()):typeof t=="object"?si(t):st(Ir,null,String(t))}function si(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:jn(t)}function tu(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(Ue(e))n=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),tu(t,r()),r._c&&(r._d=!0));return}else{n=32;const r=e._;!r&&!(ba in e)?e._ctx=Yt:r===3&&Yt&&(Yt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Be(e)?(e={default:e,_ctx:Yt},n=32):(e=String(e),i&64?(n=16,e=[eu(e)]):n=8);t.children=e,t.shapeFlag|=n}function bv(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=_a([e.class,i.class]));else if(r==="style")e.style=ga([e.style,i.style]);else if(Fs(r)){const s=e[r],o=i[r];o&&s!==o&&!(Ue(s)&&s.includes(o))&&(e[r]=s?[].concat(s,o):o)}else r!==""&&(e[r]=i[r])}return e}function Ot(t,e,n,i=null){nn(t,e,7,[n,i])}const Tv=xp();let Av=0;function wv(t,e,n){const i=t.type,r=(e?e.appContext:t.appContext)||Tv,s={uid:Av++,vnode:t,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,scope:new Uh(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Mp(i,r),emitsOptions:ip(i,r),emit:null,emitted:null,propsDefaults:nt,inheritAttrs:i.inheritAttrs,ctx:nt,data:nt,props:nt,attrs:nt,slots:nt,refs:nt,setupState:nt,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=D_.bind(null,s),t.ce&&t.ce(s),s}let ht=null;const Ws=()=>ht||Yt;let nu,Ji,$u="__VUE_INSTANCE_SETTERS__";(Ji=Bl()[$u])||(Ji=Bl()[$u]=[]),Ji.push(t=>ht=t),nu=t=>{Ji.length>1?Ji.forEach(e=>e(t)):Ji[0](t)};const Or=t=>{nu(t),t.scope.on()},zi=()=>{ht&&ht.scope.off(),nu(null)};function Lp(t){return t.vnode.shapeFlag&4}let Fr=!1;function Rv(t,e=!1){Fr=e;const{props:n,children:i}=t.vnode,r=Lp(t);hv(t,n,r,e),gv(t,i);const s=r?Cv(t,e):void 0;return Fr=!1,s}function Cv(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=xa(new Proxy(t.ctx,sv));const{setup:i}=n;if(i){const r=t.setupContext=i.length>1?Lv(t):null;Or(t),Xr();const s=mi(i,t,0,[t.props,r]);if(jr(),zi(),wh(s)){if(s.then(zi,zi),e)return s.then(o=>{$l(t,o,e)}).catch(o=>{qr(o,t,0)});t.asyncDep=s}else $l(t,s,e)}else Dp(t,e)}function $l(t,e,n){Be(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:tt(e)&&(t.setupState=Zh(e)),Dp(t,n)}let Yu;function Dp(t,e,n){const i=t.type;if(!t.render){if(!e&&Yu&&!i.render){const r=i.template||Zc(t).template;if(r){const{isCustomElement:s,compilerOptions:o}=t.appContext.config,{delimiters:a,compilerOptions:l}=i,c=pt(pt({isCustomElement:s,delimiters:a},o),l);i.render=Yu(r,c)}}t.render=i.render||gn}Or(t),Xr(),ov(t),jr(),zi()}function Pv(t){return t.attrsProxy||(t.attrsProxy=new Proxy(t.attrs,{get(e,n){return Gt(t,"get","$attrs"),e[n]}}))}function Lv(t){const e=n=>{t.exposed=n||{}};return{get attrs(){return Pv(t)},slots:t.slots,emit:t.emit,expose:e}}function iu(t){if(t.exposed)return t.exposeProxy||(t.exposeProxy=new Proxy(Zh(xa(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in ds)return ds[n](t)},has(e,n){return n in e||n in ds}}))}function Yl(t,e=!0){return Be(t)?t.displayName||t.name:t.name||e&&t.__name}function Dv(t){return Be(t)&&"__vccOpts"in t}const mt=(t,e)=>w_(t,e,Fr);function _n(t,e,n){const i=arguments.length;return i===2?tt(e)&&!Ue(e)?Ls(e)?st(t,null,[e]):st(t,e):st(t,null,e):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&Ls(n)&&(n=[n]),st(t,e,n))}const Uv=Symbol.for("v-scx"),Iv=()=>Bt(Uv),Up="3.3.4",Nv="http://www.w3.org/2000/svg",Ni=typeof document<"u"?document:null,Ku=Ni&&Ni.createElement("template"),Ov={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const r=e?Ni.createElementNS(Nv,t):Ni.createElement(t,n?{is:n}:void 0);return t==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:t=>Ni.createTextNode(t),createComment:t=>Ni.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Ni.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,r,s){const o=n?n.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{Ku.innerHTML=i?`<svg>${t}</svg>`:t;const a=Ku.content;if(i){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}};function Fv(t,e,n){const i=t._vtc;i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}function Bv(t,e,n){const i=t.style,r=ot(n);if(n&&!r){if(e&&!ot(e))for(const s in e)n[s]==null&&Kl(i,s,"");for(const s in n)Kl(i,s,n[s])}else{const s=i.display;r?e!==n&&(i.cssText=n):e&&t.removeAttribute("style"),"_vod"in t&&(i.display=s)}}const Zu=/\s*!important$/;function Kl(t,e,n){if(Ue(n))n.forEach(i=>Kl(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const i=Hv(t,e);Zu.test(n)?t.setProperty(Wr(i),n.replace(Zu,""),"important"):t[i]=n}}const Ju=["Webkit","Moz","ms"],ja={};function Hv(t,e){const n=ja[e];if(n)return n;let i=wn(e);if(i!=="filter"&&i in t)return ja[e]=i;i=ma(i);for(let r=0;r<Ju.length;r++){const s=Ju[r]+i;if(s in t)return ja[e]=s}return e}const Qu="http://www.w3.org/1999/xlink";function kv(t,e,n,i,r){if(i&&e.startsWith("xlink:"))n==null?t.removeAttributeNS(Qu,e.slice(6,e.length)):t.setAttributeNS(Qu,e,n);else{const s=Xg(e);n==null||s&&!Lh(n)?t.removeAttribute(e):t.setAttribute(e,s?"":n)}}function zv(t,e,n,i,r,s,o){if(e==="innerHTML"||e==="textContent"){i&&o(i,r,s),t[e]=n??"";return}const a=t.tagName;if(e==="value"&&a!=="PROGRESS"&&!a.includes("-")){t._value=n;const c=a==="OPTION"?t.getAttribute("value"):t.value,u=n??"";c!==u&&(t.value=u),n==null&&t.removeAttribute(e);return}let l=!1;if(n===""||n==null){const c=typeof t[e];c==="boolean"?n=Lh(n):n==null&&c==="string"?(n="",l=!0):c==="number"&&(n=0,l=!0)}try{t[e]=n}catch{}l&&t.removeAttribute(e)}function Gv(t,e,n,i){t.addEventListener(e,n,i)}function Vv(t,e,n,i){t.removeEventListener(e,n,i)}function Wv(t,e,n,i,r=null){const s=t._vei||(t._vei={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=Xv(e);if(i){const c=s[e]=$v(i,r);Gv(t,a,c,l)}else o&&(Vv(t,a,o,l),s[e]=void 0)}}const ef=/(?:Once|Passive|Capture)$/;function Xv(t){let e;if(ef.test(t)){e={};let i;for(;i=t.match(ef);)t=t.slice(0,t.length-i[0].length),e[i[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Wr(t.slice(2)),e]}let qa=0;const jv=Promise.resolve(),qv=()=>qa||(jv.then(()=>qa=0),qa=Date.now());function $v(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;nn(Yv(i,n.value),e,5,[i])};return n.value=t,n.attached=qv(),n}function Yv(t,e){if(Ue(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const tf=/^on[a-z]/,Kv=(t,e,n,i,r=!1,s,o,a,l)=>{e==="class"?Fv(t,i,r):e==="style"?Bv(t,n,i):Fs(e)?Dc(e)||Wv(t,e,n,i,o):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Zv(t,e,i,r))?zv(t,e,i,s,o,a,l):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),kv(t,e,i,r))};function Zv(t,e,n,i){return i?!!(e==="innerHTML"||e==="textContent"||e in t&&tf.test(e)&&Be(n)):e==="spellcheck"||e==="draggable"||e==="translate"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA"||tf.test(e)&&ot(n)?!1:e in t}const Zn="transition",Zr="animation",ru=(t,{slots:e})=>_n(q_,Jv(t),e);ru.displayName="Transition";const Ip={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String};ru.props=pt({},lp,Ip);const Ai=(t,e=[])=>{Ue(t)?t.forEach(n=>n(...e)):t&&t(...e)},nf=t=>t?Ue(t)?t.some(e=>e.length>1):t.length>1:!1;function Jv(t){const e={};for(const H in t)H in Ip||(e[H]=t[H]);if(t.css===!1)return e;const{name:n="v",type:i,duration:r,enterFromClass:s=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:l=s,appearActiveClass:c=o,appearToClass:u=a,leaveFromClass:f=`${n}-leave-from`,leaveActiveClass:h=`${n}-leave-active`,leaveToClass:p=`${n}-leave-to`}=t,g=Qv(r),x=g&&g[0],m=g&&g[1],{onBeforeEnter:d,onEnter:_,onEnterCancelled:v,onLeave:y,onLeaveCancelled:S,onBeforeAppear:R=d,onAppear:w=_,onAppearCancelled:P=v}=e,M=(H,N,U)=>{wi(H,N?u:a),wi(H,N?c:o),U&&U()},T=(H,N)=>{H._isLeaving=!1,wi(H,f),wi(H,p),wi(H,h),N&&N()},F=H=>(N,U)=>{const B=H?w:_,K=()=>M(N,H,U);Ai(B,[N,K]),rf(()=>{wi(N,H?l:s),Jn(N,H?u:a),nf(B)||sf(N,i,x,K)})};return pt(e,{onBeforeEnter(H){Ai(d,[H]),Jn(H,s),Jn(H,o)},onBeforeAppear(H){Ai(R,[H]),Jn(H,l),Jn(H,c)},onEnter:F(!1),onAppear:F(!0),onLeave(H,N){H._isLeaving=!0;const U=()=>T(H,N);Jn(H,f),n0(),Jn(H,h),rf(()=>{H._isLeaving&&(wi(H,f),Jn(H,p),nf(y)||sf(H,i,m,U))}),Ai(y,[H,U])},onEnterCancelled(H){M(H,!1),Ai(v,[H])},onAppearCancelled(H){M(H,!0),Ai(P,[H])},onLeaveCancelled(H){T(H),Ai(S,[H])}})}function Qv(t){if(t==null)return null;if(tt(t))return[$a(t.enter),$a(t.leave)];{const e=$a(t);return[e,e]}}function $a(t){return Ph(t)}function Jn(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t._vtc||(t._vtc=new Set)).add(e)}function wi(t,e){e.split(/\s+/).forEach(i=>i&&t.classList.remove(i));const{_vtc:n}=t;n&&(n.delete(e),n.size||(t._vtc=void 0))}function rf(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let e0=0;function sf(t,e,n,i){const r=t._endId=++e0,s=()=>{r===t._endId&&i()};if(n)return setTimeout(s,n);const{type:o,timeout:a,propCount:l}=t0(t,e);if(!o)return i();const c=o+"end";let u=0;const f=()=>{t.removeEventListener(c,h),s()},h=p=>{p.target===t&&++u>=l&&f()};setTimeout(()=>{u<l&&f()},a+1),t.addEventListener(c,h)}function t0(t,e){const n=window.getComputedStyle(t),i=g=>(n[g]||"").split(", "),r=i(`${Zn}Delay`),s=i(`${Zn}Duration`),o=of(r,s),a=i(`${Zr}Delay`),l=i(`${Zr}Duration`),c=of(a,l);let u=null,f=0,h=0;e===Zn?o>0&&(u=Zn,f=o,h=s.length):e===Zr?c>0&&(u=Zr,f=c,h=l.length):(f=Math.max(o,c),u=f>0?o>c?Zn:Zr:null,h=u?u===Zn?s.length:l.length:0);const p=u===Zn&&/\b(transform|all)(,|$)/.test(i(`${Zn}Property`).toString());return{type:u,timeout:f,propCount:h,hasTransform:p}}function of(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,i)=>af(n)+af(t[i])))}function af(t){return Number(t.slice(0,-1).replace(",","."))*1e3}function n0(){return document.body.offsetHeight}const Np=pt({patchProp:Kv},Ov);let ps,lf=!1;function i0(){return ps||(ps=xv(Np))}function r0(){return ps=lf?ps:yv(Np),lf=!0,ps}const s0=(...t)=>{const e=i0().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=Op(i);if(!r)return;const s=e._component;!Be(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.innerHTML="";const o=n(r,!1,r instanceof SVGElement);return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e},o0=(...t)=>{const e=r0().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=Op(i);if(r)return n(r,!0,r instanceof SVGElement)},e};function Op(t){return ot(t)?document.querySelector(t):t}const a0=/"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,l0=/"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,c0=/^\s*["[{]|^\s*-?\d[\d.]{0,14}\s*$/;function u0(t,e){if(t==="__proto__"||t==="constructor"&&e&&typeof e=="object"&&"prototype"in e){f0(t);return}return e}function f0(t){console.warn(`[destr] Dropping "${t}" key to prevent prototype pollution.`)}function d0(t,e={}){if(typeof t!="string")return t;const n=t.trim();if(t[0]==='"'&&t[t.length-1]==='"')return n.slice(1,-1);const i=n.toLowerCase();if(i==="true")return!0;if(i==="false")return!1;if(i!=="undefined"){if(i==="null")return null;if(i==="nan")return Number.NaN;if(i==="infinity")return Number.POSITIVE_INFINITY;if(i==="-infinity")return Number.NEGATIVE_INFINITY;if(!c0.test(t)){if(e.strict)throw new SyntaxError("[destr] Invalid JSON");return t}try{if(a0.test(t)||l0.test(t)){if(e.strict)throw new Error("[destr] Possible prototype pollution");return JSON.parse(t,u0)}return JSON.parse(t)}catch(r){if(e.strict)throw r;return t}}}const h0=/#/g,p0=/&/g,m0=/=/g,Fp=/\+/g,g0=/%5e/gi,_0=/%60/gi,v0=/%7c/gi,x0=/%20/gi;function y0(t){return encodeURI(""+t).replace(v0,"|")}function Zl(t){return y0(typeof t=="string"?t:JSON.stringify(t)).replace(Fp,"%2B").replace(x0,"+").replace(h0,"%23").replace(p0,"%26").replace(_0,"`").replace(g0,"^")}function Ya(t){return Zl(t).replace(m0,"%3D")}function Bp(t=""){try{return decodeURIComponent(""+t)}catch{return""+t}}function M0(t){return Bp(t.replace(Fp," "))}function Hp(t=""){const e={};t[0]==="?"&&(t=t.slice(1));for(const n of t.split("&")){const i=n.match(/([^=]+)=?(.*)/)||[];if(i.length<2)continue;const r=Bp(i[1]);if(r==="__proto__"||r==="constructor")continue;const s=M0(i[2]||"");typeof e[r]<"u"?Array.isArray(e[r])?e[r].push(s):e[r]=[e[r],s]:e[r]=s}return e}function E0(t,e){return(typeof e=="number"||typeof e=="boolean")&&(e=String(e)),e?Array.isArray(e)?e.map(n=>`${Ya(t)}=${Zl(n)}`).join("&"):`${Ya(t)}=${Zl(e)}`:Ya(t)}function S0(t){return Object.keys(t).filter(e=>t[e]!==void 0).map(e=>E0(e,t[e])).join("&")}const b0=/^\w{2,}:([/\\]{1,2})/,T0=/^\w{2,}:([/\\]{2})?/,A0=/^([/\\]\s*){2,}[^/\\]/;function $r(t,e={}){return typeof e=="boolean"&&(e={acceptRelative:e}),e.strict?b0.test(t):T0.test(t)||(e.acceptRelative?A0.test(t):!1)}const w0=/\/$|\/\?/;function Jl(t="",e=!1){return e?w0.test(t):t.endsWith("/")}function su(t="",e=!1){if(!e)return(Jl(t)?t.slice(0,-1):t)||"/";if(!Jl(t,!0))return t||"/";const[n,...i]=t.split("?");return(n.slice(0,-1)||"/")+(i.length>0?`?${i.join("?")}`:"")}function kp(t="",e=!1){if(!e)return t.endsWith("/")?t:t+"/";if(Jl(t,!0))return t||"/";const[n,...i]=t.split("?");return n+"/"+(i.length>0?`?${i.join("?")}`:"")}function R0(t=""){return t.startsWith("/")}function C0(t=""){return(R0(t)?t.slice(1):t)||"/"}function P0(t,e){if(Gp(e)||$r(t))return t;const n=su(e);return t.startsWith(n)?t:Xs(n,t)}function cf(t,e){if(Gp(e))return t;const n=su(e);if(!t.startsWith(n))return t;const i=t.slice(n.length);return i[0]==="/"?i:"/"+i}function zp(t,e){const n=js(t),i={...Hp(n.search),...e};return n.search=S0(i),D0(n)}function Gp(t){return!t||t==="/"}function L0(t){return t&&t!=="/"}function Xs(t,...e){let n=t||"";for(const i of e.filter(r=>L0(r)))n=n?kp(n)+C0(i):i;return n}function js(t="",e){if(!$r(t,{acceptRelative:!0}))return e?js(e+t):uf(t);const[n="",i,r=""]=(t.replace(/\\/g,"/").match(/([^/:]+:)?\/\/([^/@]+@)?(.*)/)||[]).splice(1),[s="",o=""]=(r.match(/([^#/?]*)(.*)?/)||[]).splice(1),{pathname:a,search:l,hash:c}=uf(o.replace(/\/(?=[A-Za-z]:)/,""));return{protocol:n,auth:i?i.slice(0,Math.max(0,i.length-1)):"",host:s,pathname:a,search:l,hash:c}}function uf(t=""){const[e="",n="",i=""]=(t.match(/([^#?]*)(\?[^#]*)?(#.*)?/)||[]).splice(1);return{pathname:e,search:n,hash:i}}function D0(t){const e=t.pathname+(t.search?(t.search.startsWith("?")?"":"?")+t.search:"")+t.hash;return t.protocol?t.protocol+"//"+(t.auth?t.auth+"@":"")+t.host+e:e}class U0 extends Error{constructor(){super(...arguments),this.name="FetchError"}}function I0(t,e,n){let i="";e&&(i=e.message),t&&n?i=`${i} (${n.status} ${n.statusText} (${t.toString()}))`:t&&(i=`${i} (${t.toString()})`);const r=new U0(i);return Object.defineProperty(r,"request",{get(){return t}}),Object.defineProperty(r,"response",{get(){return n}}),Object.defineProperty(r,"data",{get(){return n&&n._data}}),Object.defineProperty(r,"status",{get(){return n&&n.status}}),Object.defineProperty(r,"statusText",{get(){return n&&n.statusText}}),Object.defineProperty(r,"statusCode",{get(){return n&&n.status}}),Object.defineProperty(r,"statusMessage",{get(){return n&&n.statusText}}),r}const N0=new Set(Object.freeze(["PATCH","POST","PUT","DELETE"]));function ff(t="GET"){return N0.has(t.toUpperCase())}function O0(t){if(t===void 0)return!1;const e=typeof t;return e==="string"||e==="number"||e==="boolean"||e===null?!0:e!=="object"?!1:Array.isArray(t)?!0:t.constructor&&t.constructor.name==="Object"||typeof t.toJSON=="function"}const F0=new Set(["image/svg","application/xml","application/xhtml","application/html"]),B0=/^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;function H0(t=""){if(!t)return"json";const e=t.split(";").shift()||"";return B0.test(e)?"json":F0.has(e)||e.startsWith("text/")?"text":"blob"}function k0(t,e,n=globalThis.Headers){const i={...e,...t};if(e!=null&&e.params&&(t!=null&&t.params)&&(i.params={...e==null?void 0:e.params,...t==null?void 0:t.params}),e!=null&&e.query&&(t!=null&&t.query)&&(i.query={...e==null?void 0:e.query,...t==null?void 0:t.query}),e!=null&&e.headers&&(t!=null&&t.headers)){i.headers=new n((e==null?void 0:e.headers)||{});for(const[r,s]of new n((t==null?void 0:t.headers)||{}))i.headers.set(r,s)}return i}const z0=new Set([408,409,425,429,500,502,503,504]);function Vp(t){const{fetch:e,Headers:n}=t;function i(o){const a=o.error&&o.error.name==="AbortError"||!1;if(o.options.retry!==!1&&!a){let c;typeof o.options.retry=="number"?c=o.options.retry:c=ff(o.options.method)?0:1;const u=o.response&&o.response.status||500;if(c>0&&z0.has(u))return r(o.request,{...o.options,retry:c-1})}const l=I0(o.request,o.error,o.response);throw Error.captureStackTrace&&Error.captureStackTrace(l,r),l}const r=async function(a,l={}){const c={request:a,options:k0(l,t.defaults,n),response:void 0,error:void 0};c.options.onRequest&&await c.options.onRequest(c),typeof c.request=="string"&&(c.options.baseURL&&(c.request=P0(c.request,c.options.baseURL)),(c.options.query||c.options.params)&&(c.request=zp(c.request,{...c.options.params,...c.options.query})),c.options.body&&ff(c.options.method)&&O0(c.options.body)&&(c.options.body=typeof c.options.body=="string"?c.options.body:JSON.stringify(c.options.body),c.options.headers=new n(c.options.headers||{}),c.options.headers.has("content-type")||c.options.headers.set("content-type","application/json"),c.options.headers.has("accept")||c.options.headers.set("accept","application/json")));try{c.response=await e(c.request,c.options)}catch(f){return c.error=f,c.options.onRequestError&&await c.options.onRequestError(c),await i(c)}const u=(c.options.parseResponse?"json":c.options.responseType)||H0(c.response.headers.get("content-type")||"");if(u==="json"){const f=await c.response.text(),h=c.options.parseResponse||d0;c.response._data=h(f)}else u==="stream"?c.response._data=c.response.body:c.response._data=await c.response[u]();return c.options.onResponse&&await c.options.onResponse(c),!c.options.ignoreResponseError&&c.response.status>=400&&c.response.status<600?(c.options.onResponseError&&await c.options.onResponseError(c),await i(c)):c.response},s=async function(a,l){return(await r(a,l))._data};return s.raw=r,s.native=e,s.create=(o={})=>Vp({...t,defaults:{...t.defaults,...o}}),s}const Wp=function(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("unable to locate global object")}(),G0=Wp.fetch||(()=>Promise.reject(new Error("[ofetch] global.fetch is not supported!"))),V0=Wp.Headers,W0=Vp({fetch:G0,Headers:V0}),X0=W0,j0=()=>{var t;return((t=window==null?void 0:window.__NUXT__)==null?void 0:t.config)||{}},ia=j0().app,q0=()=>ia.baseURL,$0=()=>ia.buildAssetsDir,Y0=(...t)=>Xs(Xp(),$0(),...t),Xp=(...t)=>{const e=ia.cdnURL||ia.baseURL;return t.length?Xs(e,...t):e};globalThis.__buildAssetsURL=Y0,globalThis.__publicAssetsURL=Xp;function Ql(t,e={},n){for(const i in t){const r=t[i],s=n?`${n}:${i}`:i;typeof r=="object"&&r!==null?Ql(r,e,s):typeof r=="function"&&(e[s]=r)}return e}const K0={run:t=>t()},Z0=()=>K0,jp=typeof console.createTask<"u"?console.createTask:Z0;function J0(t,e){const n=e.shift(),i=jp(n);return t.reduce((r,s)=>r.then(()=>i.run(()=>s(...e))),Promise.resolve())}function Q0(t,e){const n=e.shift(),i=jp(n);return Promise.all(t.map(r=>i.run(()=>r(...e))))}function Ka(t,e){for(const n of[...t])n(e)}class ex{constructor(){this._hooks={},this._before=void 0,this._after=void 0,this._deprecatedMessages=void 0,this._deprecatedHooks={},this.hook=this.hook.bind(this),this.callHook=this.callHook.bind(this),this.callHookWith=this.callHookWith.bind(this)}hook(e,n,i={}){if(!e||typeof n!="function")return()=>{};const r=e;let s;for(;this._deprecatedHooks[e];)s=this._deprecatedHooks[e],e=s.to;if(s&&!i.allowDeprecated){let o=s.message;o||(o=`${r} hook has been deprecated`+(s.to?`, please use ${s.to}`:"")),this._deprecatedMessages||(this._deprecatedMessages=new Set),this._deprecatedMessages.has(o)||(console.warn(o),this._deprecatedMessages.add(o))}if(!n.name)try{Object.defineProperty(n,"name",{get:()=>"_"+e.replace(/\W+/g,"_")+"_hook_cb",configurable:!0})}catch{}return this._hooks[e]=this._hooks[e]||[],this._hooks[e].push(n),()=>{n&&(this.removeHook(e,n),n=void 0)}}hookOnce(e,n){let i,r=(...s)=>(typeof i=="function"&&i(),i=void 0,r=void 0,n(...s));return i=this.hook(e,r),i}removeHook(e,n){if(this._hooks[e]){const i=this._hooks[e].indexOf(n);i!==-1&&this._hooks[e].splice(i,1),this._hooks[e].length===0&&delete this._hooks[e]}}deprecateHook(e,n){this._deprecatedHooks[e]=typeof n=="string"?{to:n}:n;const i=this._hooks[e]||[];delete this._hooks[e];for(const r of i)this.hook(e,r)}deprecateHooks(e){Object.assign(this._deprecatedHooks,e);for(const n in e)this.deprecateHook(n,e[n])}addHooks(e){const n=Ql(e),i=Object.keys(n).map(r=>this.hook(r,n[r]));return()=>{for(const r of i.splice(0,i.length))r()}}removeHooks(e){const n=Ql(e);for(const i in n)this.removeHook(i,n[i])}removeAllHooks(){for(const e in this._hooks)delete this._hooks[e]}callHook(e,...n){return n.unshift(e),this.callHookWith(J0,e,...n)}callHookParallel(e,...n){return n.unshift(e),this.callHookWith(Q0,e,...n)}callHookWith(e,n,...i){const r=this._before||this._after?{name:n,args:i,context:{}}:void 0;this._before&&Ka(this._before,r);const s=e(n in this._hooks?[...this._hooks[n]]:[],i);return s instanceof Promise?s.finally(()=>{this._after&&r&&Ka(this._after,r)}):(this._after&&r&&Ka(this._after,r),s)}beforeEach(e){return this._before=this._before||[],this._before.push(e),()=>{if(this._before!==void 0){const n=this._before.indexOf(e);n!==-1&&this._before.splice(n,1)}}}afterEach(e){return this._after=this._after||[],this._after.push(e),()=>{if(this._after!==void 0){const n=this._after.indexOf(e);n!==-1&&this._after.splice(n,1)}}}}function qp(){return new ex}function tx(t={}){let e,n=!1;const i=o=>{if(e&&e!==o)throw new Error("Context conflict")};let r;if(t.asyncContext){const o=t.AsyncLocalStorage||globalThis.AsyncLocalStorage;o?r=new o:console.warn("[unctx] `AsyncLocalStorage` is not provided.")}const s=()=>{if(r&&e===void 0){const o=r.getStore();if(o!==void 0)return o}return e};return{use:()=>{const o=s();if(o===void 0)throw new Error("Context is not available");return o},tryUse:()=>s(),set:(o,a)=>{a||i(o),e=o,n=!0},unset:()=>{e=void 0,n=!1},call:(o,a)=>{i(o),e=o;try{return r?r.run(o,a):a()}finally{n||(e=void 0)}},async callAsync(o,a){e=o;const l=()=>{e=o},c=()=>e===o?l:void 0;ec.add(c);try{const u=r?r.run(o,a):a();return n||(e=void 0),await u}finally{ec.delete(c)}}}}function nx(t={}){const e={};return{get(n,i={}){return e[n]||(e[n]=tx({...t,...i})),e[n],e[n]}}}const ra=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof global<"u"?global:typeof window<"u"?window:{},df="__unctx__",ix=ra[df]||(ra[df]=nx()),rx=(t,e={})=>ix.get(t,e),hf="__unctx_async_handlers__",ec=ra[hf]||(ra[hf]=new Set);function sa(t){const e=[];for(const r of ec){const s=r();s&&e.push(s)}const n=()=>{for(const r of e)r()};let i=t();return i&&typeof i=="object"&&"catch"in i&&(i=i.catch(r=>{throw n(),r})),[i,n]}const $p=rx("nuxt-app"),sx="__nuxt_plugin";function ox(t){let e=0;const n={provide:void 0,globalName:"nuxt",versions:{get nuxt(){return"3.6.2"},get vue(){return n.vueApp.version}},payload:Xn({data:{},state:{},_errors:{},...window.__NUXT__??{}}),static:{data:{}},runWithContext:r=>cx(n,r),isHydrating:!0,deferHydration(){if(!n.isHydrating)return()=>{};e++;let r=!1;return()=>{if(!r&&(r=!0,e--,e===0))return n.isHydrating=!1,n.callHook("app:suspense:resolve")}},_asyncDataPromises:{},_asyncData:{},_payloadRevivers:{},...t};n.hooks=qp(),n.hook=n.hooks.hook,n.callHook=n.hooks.callHook,n.provide=(r,s)=>{const o="$"+r;uo(n,o,s),uo(n.vueApp.config.globalProperties,o,s)},uo(n.vueApp,"$nuxt",n),uo(n.vueApp.config.globalProperties,"$nuxt",n);{window.addEventListener("nuxt.preloadError",s=>{n.callHook("app:chunkError",{error:s.payload})}),window.useNuxtApp=window.useNuxtApp||at;const r=n.hook("app:error",(...s)=>{console.error("[nuxt] error caught during app initialization",...s)});n.hook("app:mounted",r)}const i=Xn(n.payload.config);return n.provide("config",i),n}async function ax(t,e){if(e.hooks&&t.hooks.addHooks(e.hooks),typeof e=="function"){const{provide:n}=await t.runWithContext(()=>e(t))||{};if(n&&typeof n=="object")for(const i in n)t.provide(i,n[i])}}async function lx(t,e){const n=[],i=[];for(const r of e){const s=ax(t,r);r.parallel?n.push(s.catch(o=>i.push(o))):await s}if(await Promise.all(n),i.length)throw i[0]}/*! @__NO_SIDE_EFFECTS__ */function Mi(t){return typeof t=="function"?t:(delete t.name,Object.assign(t.setup||(()=>{}),t,{[sx]:!0}))}function cx(t,e,n){const i=()=>n?e(...n):e();return $p.set(t),t.vueApp.runWithContext(i)}/*! @__NO_SIDE_EFFECTS__ */function at(){var e;let t;if(Jc()&&(t=(e=Ws())==null?void 0:e.appContext.app.$nuxt),t=t||$p.tryUse(),!t)throw new Error("[nuxt] instance unavailable");return t}/*! @__NO_SIDE_EFFECTS__ */function ou(){return at().$config}function uo(t,e,n){Object.defineProperty(t,e,{get:()=>n})}const ux="modulepreload",fx=function(t,e){return t.startsWith(".")?new URL(t,e).href:t},pf={},dx=function(e,n,i){if(!n||n.length===0)return e();const r=document.getElementsByTagName("link");return Promise.all(n.map(s=>{if(s=fx(s,i),s in pf)return;pf[s]=!0;const o=s.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(!!i)for(let u=r.length-1;u>=0;u--){const f=r[u];if(f.href===s&&(!o||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${a}`))return;const c=document.createElement("link");if(c.rel=o?"stylesheet":ux,o||(c.as="script",c.crossOrigin=""),c.href=s,document.head.appendChild(c),o)return new Promise((u,f)=>{c.addEventListener("load",u),c.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e())},Fi=(...t)=>dx(...t).catch(e=>{const n=new Event("nuxt.preloadError");throw n.payload=e,window.dispatchEvent(n),e}),hx=-1,px=-2,mx=-3,gx=-4,_x=-5,vx=-6;function xx(t,e){return yx(JSON.parse(t),e)}function yx(t,e){if(typeof t=="number")return r(t,!0);if(!Array.isArray(t)||t.length===0)throw new Error("Invalid input");const n=t,i=Array(n.length);function r(s,o=!1){if(s===hx)return;if(s===mx)return NaN;if(s===gx)return 1/0;if(s===_x)return-1/0;if(s===vx)return-0;if(o)throw new Error("Invalid input");if(s in i)return i[s];const a=n[s];if(!a||typeof a!="object")i[s]=a;else if(Array.isArray(a))if(typeof a[0]=="string"){const l=a[0],c=e==null?void 0:e[l];if(c)return i[s]=c(r(a[1]));switch(l){case"Date":i[s]=new Date(a[1]);break;case"Set":const u=new Set;i[s]=u;for(let p=1;p<a.length;p+=1)u.add(r(a[p]));break;case"Map":const f=new Map;i[s]=f;for(let p=1;p<a.length;p+=2)f.set(r(a[p]),r(a[p+1]));break;case"RegExp":i[s]=new RegExp(a[1],a[2]);break;case"Object":i[s]=Object(a[1]);break;case"BigInt":i[s]=BigInt(a[1]);break;case"null":const h=Object.create(null);i[s]=h;for(let p=1;p<a.length;p+=2)h[a[p]]=r(a[p+1]);break;default:throw new Error(`Unknown type ${l}`)}}else{const l=new Array(a.length);i[s]=l;for(let c=0;c<a.length;c+=1){const u=a[c];u!==px&&(l[c]=r(u))}}else{const l={};i[s]=l;for(const c in a){const u=a[c];l[c]=r(u)}}return i[s]}return r(0)}function Mx(t){return Array.isArray(t)?t:[t]}const Yp=["title","script","style","noscript"],Kp=["base","meta","link","style","script","noscript"],Ex=["title","titleTemplate","templateParams","base","htmlAttrs","bodyAttrs","meta","link","style","script","noscript"],Sx=["base","title","titleTemplate","bodyAttrs","htmlAttrs","templateParams"],bx=["tagPosition","tagPriority","tagDuplicateStrategy","innerHTML","textContent"];function Zp(t){let e=9;for(let n=0;n<t.length;)e=Math.imul(e^t.charCodeAt(n++),9**9);return((e^e>>>9)+65536).toString(16).substring(1,8).toLowerCase()}function tc(t){return Zp(`${t.tag}:${t.textContent||t.innerHTML||""}:${Object.entries(t.props).map(([e,n])=>`${e}:${String(n)}`).join(",")}`)}function Tx(t){let e=9;for(const n of t)for(let i=0;i<n.length;)e=Math.imul(e^n.charCodeAt(i++),9**9);return((e^e>>>9)+65536).toString(16).substring(1,8).toLowerCase()}function Jp(t,e){const{props:n,tag:i}=t;if(Sx.includes(i))return i;if(i==="link"&&n.rel==="canonical")return"canonical";if(n.charset)return"charset";const r=["id"];i==="meta"&&r.push("name","property","http-equiv");for(const s of r)if(typeof n[s]<"u"){const o=String(n[s]);return e&&!e(o)?!1:`${i}:${s}:${o}`}return!1}function mf(t,e){return t==null?e||null:typeof t=="function"?t(e):t}function fo(t,e=!1,n){const{tag:i,$el:r}=t;r&&(Object.entries(i.props).forEach(([s,o])=>{o=String(o);const a=`attr:${s}`;if(s==="class"){if(!o)return;for(const l of o.split(" ")){const c=`${a}:${l}`;n&&n(t,c,()=>r.classList.remove(l)),r.classList.contains(l)||r.classList.add(l)}return}n&&!s.startsWith("data-h-")&&n(t,a,()=>r.removeAttribute(s)),(e||r.getAttribute(s)!==o)&&r.setAttribute(s,o)}),Yp.includes(i.tag)&&(i.textContent&&i.textContent!==r.textContent?r.textContent=i.textContent:i.innerHTML&&i.innerHTML!==r.innerHTML&&(r.innerHTML=i.innerHTML)))}let Jr=!1;async function Ax(t,e={}){var h,p;const n={shouldRender:!0};if(await t.hooks.callHook("dom:beforeRender",n),!n.shouldRender)return;const i=e.document||t.resolvedOptions.document||window.document,r=(await t.resolveTags()).map(a);if(t.resolvedOptions.experimentalHashHydration&&(Jr=Jr||t._hash||!1,Jr)){const g=Tx(r.map(x=>x.tag._h));if(Jr===g)return;Jr=g}const s=t._popSideEffectQueue();t.headEntries().map(g=>g._sde).forEach(g=>{Object.entries(g).forEach(([x,m])=>{s[x]=m})});const o=(g,x,m)=>{x=`${g.renderId}:${x}`,g.entry&&(g.entry._sde[x]=m),delete s[x]};function a(g){const x=t.headEntries().find(d=>d._i===g._e),m={renderId:g._d||tc(g),$el:null,shouldRender:!0,tag:g,entry:x,markSideEffect:(d,_)=>o(m,d,_)};return m}const l=[],c={body:[],head:[]},u=g=>{t._elMap[g.renderId]=g.$el,l.push(g),o(g,"el",()=>{var x;(x=g.$el)==null||x.remove(),delete t._elMap[g.renderId]})};for(const g of r){if(await t.hooks.callHook("dom:beforeRenderTag",g),!g.shouldRender)continue;const{tag:x}=g;if(x.tag==="title"){i.title=x.textContent||"",l.push(g);continue}if(x.tag==="htmlAttrs"||x.tag==="bodyAttrs"){g.$el=i[x.tag==="htmlAttrs"?"documentElement":"body"],fo(g,!1,o),l.push(g);continue}if(g.$el=t._elMap[g.renderId],!g.$el&&x.key&&(g.$el=i.querySelector(`${(h=x.tagPosition)!=null&&h.startsWith("body")?"body":"head"} > ${x.tag}[data-h-${x._h}]`)),g.$el){g.tag._d&&fo(g),u(g);continue}c[(p=x.tagPosition)!=null&&p.startsWith("body")?"body":"head"].push(g)}const f={bodyClose:void 0,bodyOpen:void 0,head:void 0};Object.entries(c).forEach(([g,x])=>{var d;if(!x.length)return;const m=(d=i==null?void 0:i[g])==null?void 0:d.children;if(m){for(const _ of[...m].reverse()){const v=_.tagName.toLowerCase();if(!Kp.includes(v))continue;const y=_.getAttributeNames().reduce((P,M)=>({...P,[M]:_.getAttribute(M)}),{}),S={tag:v,props:y};_.innerHTML&&(S.innerHTML=_.innerHTML);const R=tc(S);let w=x.findIndex(P=>(P==null?void 0:P.renderId)===R);if(w===-1){const P=Jp(S);w=x.findIndex(M=>(M==null?void 0:M.tag._d)&&M.tag._d===P)}if(w!==-1){const P=x[w];P.$el=_,fo(P),u(P),delete x[w]}}x.forEach(_=>{const v=_.tag.tagPosition||"head";f[v]=f[v]||i.createDocumentFragment(),_.$el||(_.$el=i.createElement(_.tag.tag),fo(_,!0)),f[v].appendChild(_.$el),u(_)})}}),f.head&&i.head.appendChild(f.head),f.bodyOpen&&i.body.insertBefore(f.bodyOpen,i.body.firstChild),f.bodyClose&&i.body.appendChild(f.bodyClose);for(const g of l)await t.hooks.callHook("dom:renderTag",g);Object.values(s).forEach(g=>g())}let Za=null;async function wx(t,e={}){function n(){return Za=null,Ax(t,e)}const i=e.delayFn||(r=>setTimeout(r,10));return Za=Za||new Promise(r=>i(()=>r(n())))}function Rx(t){return{hooks:{"entries:updated":function(e){if(typeof(t==null?void 0:t.document)>"u"&&typeof window>"u")return;let n=t==null?void 0:t.delayFn;!n&&typeof requestAnimationFrame<"u"&&(n=requestAnimationFrame),wx(e,{document:(t==null?void 0:t.document)||window.document,delayFn:n})}}}}function Cx(t){var e;return((e=t==null?void 0:t.head.querySelector('meta[name="unhead:ssr"]'))==null?void 0:e.getAttribute("content"))||!1}const gf={base:-1,title:1},_f={critical:-8,high:-1,low:2};function oa(t){let e=10;const n=t.tagPriority;return typeof n=="number"?n:(t.tag==="meta"?(t.props.charset&&(e=-2),t.props["http-equiv"]==="content-security-policy"&&(e=0)):t.tag in gf&&(e=gf[t.tag]),typeof n=="string"&&n in _f?e+_f[n]:e)}const Px=[{prefix:"before:",offset:-1},{prefix:"after:",offset:1}];function Lx(){return{hooks:{"tags:resolve":t=>{const e=n=>{var i;return(i=t.tags.find(r=>r._d===n))==null?void 0:i._p};for(const{prefix:n,offset:i}of Px)for(const r of t.tags.filter(s=>typeof s.tagPriority=="string"&&s.tagPriority.startsWith(n))){const s=e(r.tagPriority.replace(n,""));typeof s<"u"&&(r._p=s+i)}t.tags.sort((n,i)=>n._p-i._p).sort((n,i)=>oa(n)-oa(i))}}}}function Dx(){return{hooks:{"tags:resolve":t=>{const{tags:e}=t;let n=e.findIndex(r=>r.tag==="titleTemplate");const i=e.findIndex(r=>r.tag==="title");if(i!==-1&&n!==-1){const r=mf(e[n].textContent,e[i].textContent);r!==null?e[i].textContent=r||e[i].textContent:delete e[i]}else if(n!==-1){const r=mf(e[n].textContent);r!==null&&(e[n].textContent=r,e[n].tag="title",n=-1)}n!==-1&&delete e[n],t.tags=e.filter(Boolean)}}}}function Ux(){return{hooks:{"tag:normalise":function({tag:t}){typeof t.props.body<"u"&&(t.tagPosition="bodyClose",delete t.props.body)}}}}const Ix=["link","style","script","noscript"];function Nx(){return{hooks:{"tag:normalise":({tag:t,resolvedOptions:e})=>{e.experimentalHashHydration===!0&&(t._h=tc(t)),t.key&&Ix.includes(t.tag)&&(t._h=Zp(t.key),t.props[`data-h-${t._h}`]="")}}}}const vf=["script","link","bodyAttrs"];function Ox(){const t=(e,n)=>{const i={},r={};Object.entries(n.props).forEach(([o,a])=>{o.startsWith("on")&&typeof a=="function"?r[o]=a:i[o]=a});let s;return e==="dom"&&n.tag==="script"&&typeof i.src=="string"&&typeof r.onload<"u"&&(s=i.src,delete i.src),{props:i,eventHandlers:r,delayedSrc:s}};return{hooks:{"ssr:render":function(e){e.tags=e.tags.map(n=>(!vf.includes(n.tag)||!Object.entries(n.props).find(([i,r])=>i.startsWith("on")&&typeof r=="function")||(n.props=t("ssr",n).props),n))},"dom:beforeRenderTag":function(e){if(!vf.includes(e.tag.tag)||!Object.entries(e.tag.props).find(([s,o])=>s.startsWith("on")&&typeof o=="function"))return;const{props:n,eventHandlers:i,delayedSrc:r}=t("dom",e.tag);Object.keys(i).length&&(e.tag.props=n,e.tag._eventHandlers=i,e.tag._delayedSrc=r)},"dom:renderTag":function(e){const n=e.$el;if(!e.tag._eventHandlers||!n)return;const i=e.tag.tag==="bodyAttrs"&&typeof window<"u"?window:n;Object.entries(e.tag._eventHandlers).forEach(([r,s])=>{const o=`${e.tag._d||e.tag._p}:${r}`,a=r.slice(2).toLowerCase(),l=`data-h-${a}`;if(e.markSideEffect(o,()=>{}),n.hasAttribute(l))return;const c=s;n.setAttribute(l,""),i.addEventListener(a,c),e.entry&&(e.entry._sde[o]=()=>{i.removeEventListener(a,c),n.removeAttribute(l)})}),e.tag._delayedSrc&&n.setAttribute("src",e.tag._delayedSrc)}}}}const Fx=["templateParams","htmlAttrs","bodyAttrs"];function Bx(){return{hooks:{"tag:normalise":function({tag:t}){["hid","vmid","key"].forEach(i=>{t.props[i]&&(t.key=t.props[i],delete t.props[i])});const n=Jp(t)||(t.key?`${t.tag}:${t.key}`:!1);n&&(t._d=n)},"tags:resolve":function(t){const e={};t.tags.forEach(i=>{const r=(i.key?`${i.tag}:${i.key}`:i._d)||i._p,s=e[r];if(s){let a=i==null?void 0:i.tagDuplicateStrategy;if(!a&&Fx.includes(i.tag)&&(a="merge"),a==="merge"){const l=s.props;["class","style"].forEach(c=>{i.props[c]&&l[c]&&(c==="style"&&!l[c].endsWith(";")&&(l[c]+=";"),i.props[c]=`${l[c]} ${i.props[c]}`)}),e[r].props={...l,...i.props};return}else if(i._e===s._e){s._duped=s._duped||[],i._d=`${s._d}:${s._duped.length+1}`,s._duped.push(i);return}else if(oa(i)>oa(s))return}const o=Object.keys(i.props).length+(i.innerHTML?1:0)+(i.textContent?1:0);if(Kp.includes(i.tag)&&o===0){delete e[r];return}e[r]=i});const n=[];Object.values(e).forEach(i=>{const r=i._duped;delete i._duped,n.push(i),r&&n.push(...r)}),t.tags=n}}}}function Qr(t,e){if(typeof t!="string")return t;function n(o){if(["s","pageTitle"].includes(o))return e.pageTitle;let a;return o.includes(".")?a=o.split(".").reduce((l,c)=>l&&l[c]||void 0,e):a=e[o],typeof a<"u"?a||"":!1}let i=t;try{i=decodeURI(t)}catch{}(i.match(/%(\w+\.+\w+)|%(\w+)/g)||[]).sort().reverse().forEach(o=>{const a=n(o.slice(1));typeof a=="string"&&(t=t.replace(new RegExp(`\\${o}(\\W|$)`,"g"),`${a}$1`).trim())});const s=e.separator;return t.includes(s)&&(t.endsWith(s)&&(t=t.slice(0,-s.length).trim()),t.startsWith(s)&&(t=t.slice(s.length).trim()),t=t.replace(new RegExp(`\\${s}\\s*\\${s}`,"g"),s)),t}function Hx(){return{hooks:{"tags:resolve":t=>{var s;const{tags:e}=t,n=(s=e.find(o=>o.tag==="title"))==null?void 0:s.textContent,i=e.findIndex(o=>o.tag==="templateParams"),r=i!==-1?e[i].props:{};r.separator=r.separator||"|",r.pageTitle=Qr(r.pageTitle||n||"",r);for(const o of e)if(["titleTemplate","title"].includes(o.tag)&&typeof o.textContent=="string")o.textContent=Qr(o.textContent,r);else if(o.tag==="meta"&&typeof o.props.content=="string")o.props.content=Qr(o.props.content,r);else if(o.tag==="link"&&typeof o.props.href=="string")o.props.href=Qr(o.props.href,r);else if(o.tag==="script"&&["application/json","application/ld+json"].includes(o.props.type)&&typeof o.innerHTML=="string")try{o.innerHTML=JSON.stringify(JSON.parse(o.innerHTML),(a,l)=>typeof l=="string"?Qr(l,r):l)}catch{}t.tags=e.filter(o=>o.tag!=="templateParams")}}}}const kx=typeof window<"u";let Qp;function zx(t){return Qp=t}function Gx(){return Qp}async function Vx(t,e){const n={tag:t,props:{}};return e instanceof Promise&&(e=await e),t==="templateParams"?(n.props=e,n):["title","titleTemplate"].includes(t)?(e&&typeof e=="object"?(n.textContent=e.textContent,e.tagPriority&&(n.tagPriority=e.tagPriority)):n.textContent=e,n):typeof e=="string"?["script","noscript","style"].includes(t)?(t==="script"&&(/^(https?:)?\/\//.test(e)||e.startsWith("/"))?n.props.src=e:n.innerHTML=e,n):!1:(n.props=await Xx(t,{...e}),n.props.children&&(n.props.innerHTML=n.props.children),delete n.props.children,Object.keys(n.props).filter(i=>bx.includes(i)).forEach(i=>{(!["innerHTML","textContent"].includes(i)||Yp.includes(n.tag))&&(n[i]=n.props[i]),delete n.props[i]}),["innerHTML","textContent"].forEach(i=>{if(n.tag==="script"&&typeof n[i]=="string"&&["application/ld+json","application/json"].includes(n.props.type))try{n[i]=JSON.parse(n[i])}catch{n[i]=""}typeof n[i]=="object"&&(n[i]=JSON.stringify(n[i]))}),n.props.class&&(n.props.class=Wx(n.props.class)),n.props.content&&Array.isArray(n.props.content)?n.props.content.map(i=>({...n,props:{...n.props,content:i}})):n)}function Wx(t){return typeof t=="object"&&!Array.isArray(t)&&(t=Object.keys(t).filter(e=>t[e])),(Array.isArray(t)?t.join(" "):t).split(" ").filter(e=>e.trim()).filter(Boolean).join(" ")}async function Xx(t,e){for(const n of Object.keys(e)){const i=n.startsWith("data-");e[n]instanceof Promise&&(e[n]=await e[n]),String(e[n])==="true"?e[n]=i?"true":"":String(e[n])==="false"&&(i?e[n]="false":delete e[n])}return e}const jx=10;async function qx(t){const e=[];return Object.entries(t.resolvedInput).filter(([n,i])=>typeof i<"u"&&Ex.includes(n)).forEach(([n,i])=>{const r=Mx(i);e.push(...r.map(s=>Vx(n,s)).flat())}),(await Promise.all(e)).flat().filter(Boolean).map((n,i)=>(n._e=t._i,n._p=(t._i<<jx)+i,n))}function $x(){return[Bx(),Lx(),Hx(),Dx(),Nx(),Ox(),Ux()]}function Yx(t={}){return[Rx({document:t==null?void 0:t.document,delayFn:t==null?void 0:t.domDelayFn})]}function Kx(t={}){const e=Zx({...t,plugins:[...Yx(t),...(t==null?void 0:t.plugins)||[]]});return t.experimentalHashHydration&&e.resolvedOptions.document&&(e._hash=Cx(e.resolvedOptions.document)),zx(e),e}function Zx(t={}){let e=[],n={},i=0;const r=qp();t!=null&&t.hooks&&r.addHooks(t.hooks),t.plugins=[...$x(),...(t==null?void 0:t.plugins)||[]],t.plugins.forEach(a=>a.hooks&&r.addHooks(a.hooks)),t.document=t.document||(kx?document:void 0);const s=()=>r.callHook("entries:updated",o),o={resolvedOptions:t,headEntries(){return e},get hooks(){return r},use(a){a.hooks&&r.addHooks(a.hooks)},push(a,l){const c={_i:i++,input:a,_sde:{}};return l!=null&&l.mode&&(c._m=l==null?void 0:l.mode),l!=null&&l.transform&&(c._t=l==null?void 0:l.transform),e.push(c),s(),{dispose(){e=e.filter(u=>u._i!==c._i?!0:(n={...n,...u._sde||{}},u._sde={},s(),!1))},patch(u){e=e.map(f=>(f._i===c._i&&(c.input=f.input=u,s()),f))}}},async resolveTags(){const a={tags:[],entries:[...e]};await r.callHook("entries:resolve",a);for(const l of a.entries){const c=l._t||(u=>u);if(l.resolvedInput=c(l.resolvedInput||l.input),l.resolvedInput)for(const u of await qx(l)){const f={tag:u,entry:l,resolvedOptions:o.resolvedOptions};await r.callHook("tag:normalise",f),a.tags.push(f.tag)}}return await r.callHook("tags:resolve",a),a.tags},_popSideEffectQueue(){const a={...n};return n={},a},_elMap:{}};return o.hooks.callHook("init",o),o}function Jx(t){return typeof t=="function"?t():et(t)}function aa(t,e=""){if(t instanceof Promise)return t;const n=Jx(t);return!t||!n?n:Array.isArray(n)?n.map(i=>aa(i,e)):typeof n=="object"?Object.fromEntries(Object.entries(n).map(([i,r])=>i==="titleTemplate"||i.startsWith("on")?[i,et(r)]:[i,aa(r,i)])):n}const Qx=Up.startsWith("3"),ey=typeof window<"u",em="usehead";function au(){return Ws()&&Bt(em)||Gx()}function ty(t){return{install(n){Qx&&(n.config.globalProperties.$unhead=t,n.config.globalProperties.$head=t,n.provide(em,t))}}.install}function ny(t={}){const e=Kx({...t,domDelayFn:n=>setTimeout(()=>Ki(()=>n()),10),plugins:[iy(),...(t==null?void 0:t.plugins)||[]]});return e.install=ty(e),e}function iy(){return{hooks:{"entries:resolve":function(t){for(const e of t.entries)e.resolvedInput=aa(e.input)}}}}function ry(t,e={}){const n=au(),i=Ze(!1),r=Ze({});V_(()=>{r.value=i.value?{}:aa(t)});const s=n.push(r.value,e);return ki(r,a=>{s.patch(a)}),Ws()&&(Gs(()=>{s.dispose()}),dp(()=>{i.value=!0}),fp(()=>{i.value=!1})),s}function sy(t,e={}){return au().push(t,e)}function n1(t,e={}){var i;const n=au();if(n){const r=ey||!!((i=n.resolvedOptions)!=null&&i.document);return e.mode==="server"&&r||e.mode==="client"&&!r?void 0:r?ry(t,e):sy(t,e)}}const oy={meta:[{name:"viewport",content:"width=device-width, initial-scale=1"},{charset:"utf-8"}],link:[],style:[],script:[],noscript:[]},nc=!1,ay=!1,ly="__nuxt",cy=!0;function xf(t,e={}){const n=uy(t,e),i=at(),r=i._payloadCache=i._payloadCache||{};return r[n]||(r[n]=tm(n).then(s=>s||(delete r[n],null))),r[n]}const yf="json";function uy(t,e={}){const n=new URL(t,"http://localhost");if(n.search)throw new Error("Payload URL cannot contain search params: "+t);if(n.host!=="localhost"||$r(n.pathname,{acceptRelative:!0}))throw new Error("Payload URL must not include hostname: "+t);const i=e.hash||(e.fresh?Date.now():"");return Xs(ou().app.baseURL,n.pathname,i?`_payload.${i}.${yf}`:`_payload.${yf}`)}async function tm(t){try{return cy?nm(await fetch(t).then(e=>e.text())):await Fi(()=>import(t),[],import.meta.url).then(e=>e.default||e)}catch(e){console.warn("[nuxt] Cannot load payload ",t,e)}return null}function fy(){return!!at().payload.prerenderedAt}let ho=null;async function dy(){if(ho)return ho;const t=document.getElementById("__NUXT_DATA__");if(!t)return{};const e=nm(t.textContent||""),n=t.dataset.src?await tm(t.dataset.src):void 0;return ho={...e,...n,...window.__NUXT__},ho}function nm(t){return xx(t,at()._payloadRevivers)}function hy(t,e){at()._payloadRevivers[t]=e}function Ja(t){return t!==null&&typeof t=="object"}function ic(t,e,n=".",i){if(!Ja(e))return ic(t,{},n,i);const r=Object.assign({},e);for(const s in t){if(s==="__proto__"||s==="constructor")continue;const o=t[s];o!=null&&(i&&i(r,s,o,n)||(Array.isArray(o)&&Array.isArray(r[s])?r[s]=[...o,...r[s]]:Ja(o)&&Ja(r[s])?r[s]=ic(o,r[s],(n?`${n}.`:"")+s.toString(),i):r[s]=o))}return r}function py(t){return(...e)=>e.reduce((n,i)=>ic(n,i,"",t),{})}const my=py();class rc extends Error{constructor(){super(...arguments),this.statusCode=500,this.fatal=!1,this.unhandled=!1}toJSON(){const e={message:this.message,statusCode:oc(this.statusCode,500)};return this.statusMessage&&(e.statusMessage=im(this.statusMessage)),this.data!==void 0&&(e.data=this.data),e}}rc.__h3_error__=!0;function sc(t){if(typeof t=="string")return new rc(t);if(gy(t))return t;const e=new rc(t.message??t.statusMessage??"",t.cause?{cause:t.cause}:void 0);if("stack"in t)try{Object.defineProperty(e,"stack",{get(){return t.stack}})}catch{try{e.stack=t.stack}catch{}}if(t.data&&(e.data=t.data),t.statusCode?e.statusCode=oc(t.statusCode,e.statusCode):t.status&&(e.statusCode=oc(t.status,e.statusCode)),t.statusMessage?e.statusMessage=t.statusMessage:t.statusText&&(e.statusMessage=t.statusText),e.statusMessage){const n=e.statusMessage;im(e.statusMessage)!==n&&console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.")}return t.fatal!==void 0&&(e.fatal=t.fatal),t.unhandled!==void 0&&(e.unhandled=t.unhandled),e}function gy(t){var e;return((e=t==null?void 0:t.constructor)==null?void 0:e.__h3_error__)===!0}const _y=/[^\u0009\u0020-\u007E]/g;function im(t=""){return t.replace(_y,"")}function oc(t,e=200){return!t||(typeof t=="string"&&(t=Number.parseInt(t,10)),t<100||t>999)?e:t}const vy="$s";function xy(...t){const e=typeof t[t.length-1]=="string"?t.pop():void 0;typeof t[0]!="string"&&t.unshift(e);const[n,i]=t;if(!n||typeof n!="string")throw new TypeError("[nuxt] [useState] key must be a string: "+n);if(i!==void 0&&typeof i!="function")throw new Error("[nuxt] [useState] init must be a function: "+i);const r=vy+n,s=at(),o=Vc(s.payload.state,r);if(o.value===void 0&&i){const a=i();if(it(a))return s.payload.state[r]=a,a;o.value=a}return o}const yy=Symbol("layout-meta"),Ta=Symbol("route"),Ei=()=>{var t;return(t=at())==null?void 0:t.$router},la=()=>Jc()?Bt(Ta,at()._route):at()._route;/*! @__NO_SIDE_EFFECTS__ */const My=()=>{try{if(at()._processingMiddleware)return!0}catch{return!0}return!1},Ey=(t,e)=>{t||(t="/");const n=typeof t=="string"?t:zp(t.path||"/",t.query||{})+(t.hash||"");if(e!=null&&e.open){{const{target:a="_blank",windowFeatures:l={}}=e.open,c=Object.entries(l).filter(([u,f])=>f!==void 0).map(([u,f])=>`${u.toLowerCase()}=${f}`).join(", ");open(n,a,c)}return Promise.resolve()}const i=(e==null?void 0:e.external)||$r(n,{acceptRelative:!0});if(i&&!(e!=null&&e.external))throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");if(i&&js(n).protocol==="script:")throw new Error("Cannot navigate to an URL with script protocol.");const r=My();if(!i&&r)return t;const s=Ei(),o=at();return i?(e!=null&&e.replace?location.replace(n):location.href=n,r?o.isHydrating?new Promise(()=>{}):!1:Promise.resolve()):e!=null&&e.replace?s.replace(t):s.push(t)},Aa=()=>Vc(at().payload,"error"),Sr=t=>{const e=lu(t);try{const n=at(),i=Aa();n.hooks.callHook("app:error",e),i.value=i.value||e}catch{throw e}return e},Sy=async(t={})=>{const e=at(),n=Aa();e.callHook("app:error:cleared",t),t.redirect&&await Ei().replace(t.redirect),n.value=null},by=t=>!!(t&&typeof t=="object"&&"__nuxt_error"in t),lu=t=>{const e=sc(t);return e.__nuxt_error=!0,e},Mf={NuxtError:t=>lu(t),EmptyShallowRef:t=>As(t==="_"?void 0:t==="0n"?BigInt(0):JSON.parse(t)),EmptyRef:t=>Ze(t==="_"?void 0:t==="0n"?BigInt(0):JSON.parse(t)),ShallowRef:t=>As(t),ShallowReactive:t=>Hs(t),Ref:t=>Ze(t),Reactive:t=>Xn(t)},Ty=Mi({name:"nuxt:revive-payload:client",order:-30,async setup(t){let e,n;for(const i in Mf)hy(i,Mf[i]);Object.assign(t.payload,([e,n]=sa(()=>t.runWithContext(dy)),e=await e,n(),e)),window.__NUXT__=t.payload}});/*!
  * vue-router v4.2.3
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */const xr=typeof window<"u";function Ay(t){return t.__esModule||t[Symbol.toStringTag]==="Module"}const Je=Object.assign;function Qa(t,e){const n={};for(const i in e){const r=e[i];n[i]=vn(r)?r.map(t):t(r)}return n}const ms=()=>{},vn=Array.isArray,wy=/\/$/,Ry=t=>t.replace(wy,"");function el(t,e,n="/"){let i,r={},s="",o="";const a=e.indexOf("#");let l=e.indexOf("?");return a<l&&a>=0&&(l=-1),l>-1&&(i=e.slice(0,l),s=e.slice(l+1,a>-1?a:e.length),r=t(s)),a>-1&&(i=i||e.slice(0,a),o=e.slice(a,e.length)),i=Dy(i??e,n),{fullPath:i+(s&&"?")+s+o,path:i,query:r,hash:o}}function Cy(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function Ef(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function Py(t,e,n){const i=e.matched.length-1,r=n.matched.length-1;return i>-1&&i===r&&Br(e.matched[i],n.matched[r])&&rm(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function Br(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function rm(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(!Ly(t[n],e[n]))return!1;return!0}function Ly(t,e){return vn(t)?Sf(t,e):vn(e)?Sf(e,t):t===e}function Sf(t,e){return vn(e)?t.length===e.length&&t.every((n,i)=>n===e[i]):t.length===1&&t[0]===e}function Dy(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),i=t.split("/"),r=i[i.length-1];(r===".."||r===".")&&i.push("");let s=n.length-1,o,a;for(o=0;o<i.length;o++)if(a=i[o],a!==".")if(a==="..")s>1&&s--;else break;return n.slice(0,s).join("/")+"/"+i.slice(o-(o===i.length?1:0)).join("/")}var Ds;(function(t){t.pop="pop",t.push="push"})(Ds||(Ds={}));var gs;(function(t){t.back="back",t.forward="forward",t.unknown=""})(gs||(gs={}));function Uy(t){if(!t)if(xr){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),Ry(t)}const Iy=/^[^#]+#/;function Ny(t,e){return t.replace(Iy,"#")+e}function Oy(t,e){const n=document.documentElement.getBoundingClientRect(),i=t.getBoundingClientRect();return{behavior:e.behavior,left:i.left-n.left-(e.left||0),top:i.top-n.top-(e.top||0)}}const wa=()=>({left:window.pageXOffset,top:window.pageYOffset});function Fy(t){let e;if("el"in t){const n=t.el,i=typeof n=="string"&&n.startsWith("#"),r=typeof n=="string"?i?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!r)return;e=Oy(r,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.pageXOffset,e.top!=null?e.top:window.pageYOffset)}function bf(t,e){return(history.state?history.state.position-e:-1)+t}const ac=new Map;function By(t,e){ac.set(t,e)}function Hy(t){const e=ac.get(t);return ac.delete(t),e}let ky=()=>location.protocol+"//"+location.host;function sm(t,e){const{pathname:n,search:i,hash:r}=e,s=t.indexOf("#");if(s>-1){let a=r.includes(t.slice(s))?t.slice(s).length:1,l=r.slice(a);return l[0]!=="/"&&(l="/"+l),Ef(l,"")}return Ef(n,t)+i+r}function zy(t,e,n,i){let r=[],s=[],o=null;const a=({state:h})=>{const p=sm(t,location),g=n.value,x=e.value;let m=0;if(h){if(n.value=p,e.value=h,o&&o===g){o=null;return}m=x?h.position-x.position:0}else i(p);r.forEach(d=>{d(n.value,g,{delta:m,type:Ds.pop,direction:m?m>0?gs.forward:gs.back:gs.unknown})})};function l(){o=n.value}function c(h){r.push(h);const p=()=>{const g=r.indexOf(h);g>-1&&r.splice(g,1)};return s.push(p),p}function u(){const{history:h}=window;h.state&&h.replaceState(Je({},h.state,{scroll:wa()}),"")}function f(){for(const h of s)h();s=[],window.removeEventListener("popstate",a),window.removeEventListener("beforeunload",u)}return window.addEventListener("popstate",a),window.addEventListener("beforeunload",u,{passive:!0}),{pauseListeners:l,listen:c,destroy:f}}function Tf(t,e,n,i=!1,r=!1){return{back:t,current:e,forward:n,replaced:i,position:window.history.length,scroll:r?wa():null}}function Gy(t){const{history:e,location:n}=window,i={value:sm(t,n)},r={value:e.state};r.value||s(i.value,{back:null,current:i.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function s(l,c,u){const f=t.indexOf("#"),h=f>-1?(n.host&&document.querySelector("base")?t:t.slice(f))+l:ky()+t+l;try{e[u?"replaceState":"pushState"](c,"",h),r.value=c}catch(p){console.error(p),n[u?"replace":"assign"](h)}}function o(l,c){const u=Je({},e.state,Tf(r.value.back,l,r.value.forward,!0),c,{position:r.value.position});s(l,u,!0),i.value=l}function a(l,c){const u=Je({},r.value,e.state,{forward:l,scroll:wa()});s(u.current,u,!0);const f=Je({},Tf(i.value,l,null),{position:u.position+1},c);s(l,f,!1),i.value=l}return{location:i,state:r,push:a,replace:o}}function om(t){t=Uy(t);const e=Gy(t),n=zy(t,e.state,e.location,e.replace);function i(s,o=!0){o||n.pauseListeners(),history.go(s)}const r=Je({location:"",base:t,go:i,createHref:Ny.bind(null,t)},e,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>e.state.value}),r}function Vy(t){return t=location.host?t||location.pathname+location.search:"",t.includes("#")||(t+="#"),om(t)}function Wy(t){return typeof t=="string"||t&&typeof t=="object"}function am(t){return typeof t=="string"||typeof t=="symbol"}const Mn={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},lm=Symbol("");var Af;(function(t){t[t.aborted=4]="aborted",t[t.cancelled=8]="cancelled",t[t.duplicated=16]="duplicated"})(Af||(Af={}));function Hr(t,e){return Je(new Error,{type:t,[lm]:!0},e)}function Pn(t,e){return t instanceof Error&&lm in t&&(e==null||!!(t.type&e))}const wf="[^/]+?",Xy={sensitive:!1,strict:!1,start:!0,end:!0},jy=/[.+*?^${}()[\]/\\]/g;function qy(t,e){const n=Je({},Xy,e),i=[];let r=n.start?"^":"";const s=[];for(const c of t){const u=c.length?[]:[90];n.strict&&!c.length&&(r+="/");for(let f=0;f<c.length;f++){const h=c[f];let p=40+(n.sensitive?.25:0);if(h.type===0)f||(r+="/"),r+=h.value.replace(jy,"\\$&"),p+=40;else if(h.type===1){const{value:g,repeatable:x,optional:m,regexp:d}=h;s.push({name:g,repeatable:x,optional:m});const _=d||wf;if(_!==wf){p+=10;try{new RegExp(`(${_})`)}catch(y){throw new Error(`Invalid custom RegExp for param "${g}" (${_}): `+y.message)}}let v=x?`((?:${_})(?:/(?:${_}))*)`:`(${_})`;f||(v=m&&c.length<2?`(?:/${v})`:"/"+v),m&&(v+="?"),r+=v,p+=20,m&&(p+=-8),x&&(p+=-20),_===".*"&&(p+=-50)}u.push(p)}i.push(u)}if(n.strict&&n.end){const c=i.length-1;i[c][i[c].length-1]+=.7000000000000001}n.strict||(r+="/?"),n.end?r+="$":n.strict&&(r+="(?:/|$)");const o=new RegExp(r,n.sensitive?"":"i");function a(c){const u=c.match(o),f={};if(!u)return null;for(let h=1;h<u.length;h++){const p=u[h]||"",g=s[h-1];f[g.name]=p&&g.repeatable?p.split("/"):p}return f}function l(c){let u="",f=!1;for(const h of t){(!f||!u.endsWith("/"))&&(u+="/"),f=!1;for(const p of h)if(p.type===0)u+=p.value;else if(p.type===1){const{value:g,repeatable:x,optional:m}=p,d=g in c?c[g]:"";if(vn(d)&&!x)throw new Error(`Provided param "${g}" is an array but it is not repeatable (* or + modifiers)`);const _=vn(d)?d.join("/"):d;if(!_)if(m)h.length<2&&(u.endsWith("/")?u=u.slice(0,-1):f=!0);else throw new Error(`Missing required param "${g}"`);u+=_}}return u||"/"}return{re:o,score:i,keys:s,parse:a,stringify:l}}function $y(t,e){let n=0;for(;n<t.length&&n<e.length;){const i=e[n]-t[n];if(i)return i;n++}return t.length<e.length?t.length===1&&t[0]===40+40?-1:1:t.length>e.length?e.length===1&&e[0]===40+40?1:-1:0}function Yy(t,e){let n=0;const i=t.score,r=e.score;for(;n<i.length&&n<r.length;){const s=$y(i[n],r[n]);if(s)return s;n++}if(Math.abs(r.length-i.length)===1){if(Rf(i))return 1;if(Rf(r))return-1}return r.length-i.length}function Rf(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const Ky={type:0,value:""},Zy=/[a-zA-Z0-9_]/;function Jy(t){if(!t)return[[]];if(t==="/")return[[Ky]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(p){throw new Error(`ERR (${n})/"${c}": ${p}`)}let n=0,i=n;const r=[];let s;function o(){s&&r.push(s),s=[]}let a=0,l,c="",u="";function f(){c&&(n===0?s.push({type:0,value:c}):n===1||n===2||n===3?(s.length>1&&(l==="*"||l==="+")&&e(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),s.push({type:1,value:c,regexp:u,repeatable:l==="*"||l==="+",optional:l==="*"||l==="?"})):e("Invalid state to consume buffer"),c="")}function h(){c+=l}for(;a<t.length;){if(l=t[a++],l==="\\"&&n!==2){i=n,n=4;continue}switch(n){case 0:l==="/"?(c&&f(),o()):l===":"?(f(),n=1):h();break;case 4:h(),n=i;break;case 1:l==="("?n=2:Zy.test(l)?h():(f(),n=0,l!=="*"&&l!=="?"&&l!=="+"&&a--);break;case 2:l===")"?u[u.length-1]=="\\"?u=u.slice(0,-1)+l:n=3:u+=l;break;case 3:f(),n=0,l!=="*"&&l!=="?"&&l!=="+"&&a--,u="";break;default:e("Unknown state");break}}return n===2&&e(`Unfinished custom RegExp for param "${c}"`),f(),o(),r}function Qy(t,e,n){const i=qy(Jy(t.path),n),r=Je(i,{record:t,parent:e,children:[],alias:[]});return e&&!r.record.aliasOf==!e.record.aliasOf&&e.children.push(r),r}function eM(t,e){const n=[],i=new Map;e=Lf({strict:!1,end:!0,sensitive:!1},e);function r(u){return i.get(u)}function s(u,f,h){const p=!h,g=tM(u);g.aliasOf=h&&h.record;const x=Lf(e,u),m=[g];if("alias"in u){const v=typeof u.alias=="string"?[u.alias]:u.alias;for(const y of v)m.push(Je({},g,{components:h?h.record.components:g.components,path:y,aliasOf:h?h.record:g}))}let d,_;for(const v of m){const{path:y}=v;if(f&&y[0]!=="/"){const S=f.record.path,R=S[S.length-1]==="/"?"":"/";v.path=f.record.path+(y&&R+y)}if(d=Qy(v,f,x),h?h.alias.push(d):(_=_||d,_!==d&&_.alias.push(d),p&&u.name&&!Pf(d)&&o(u.name)),g.children){const S=g.children;for(let R=0;R<S.length;R++)s(S[R],d,h&&h.children[R])}h=h||d,(d.record.components&&Object.keys(d.record.components).length||d.record.name||d.record.redirect)&&l(d)}return _?()=>{o(_)}:ms}function o(u){if(am(u)){const f=i.get(u);f&&(i.delete(u),n.splice(n.indexOf(f),1),f.children.forEach(o),f.alias.forEach(o))}else{const f=n.indexOf(u);f>-1&&(n.splice(f,1),u.record.name&&i.delete(u.record.name),u.children.forEach(o),u.alias.forEach(o))}}function a(){return n}function l(u){let f=0;for(;f<n.length&&Yy(u,n[f])>=0&&(u.record.path!==n[f].record.path||!cm(u,n[f]));)f++;n.splice(f,0,u),u.record.name&&!Pf(u)&&i.set(u.record.name,u)}function c(u,f){let h,p={},g,x;if("name"in u&&u.name){if(h=i.get(u.name),!h)throw Hr(1,{location:u});x=h.record.name,p=Je(Cf(f.params,h.keys.filter(_=>!_.optional).map(_=>_.name)),u.params&&Cf(u.params,h.keys.map(_=>_.name))),g=h.stringify(p)}else if("path"in u)g=u.path,h=n.find(_=>_.re.test(g)),h&&(p=h.parse(g),x=h.record.name);else{if(h=f.name?i.get(f.name):n.find(_=>_.re.test(f.path)),!h)throw Hr(1,{location:u,currentLocation:f});x=h.record.name,p=Je({},f.params,u.params),g=h.stringify(p)}const m=[];let d=h;for(;d;)m.unshift(d.record),d=d.parent;return{name:x,path:g,params:p,matched:m,meta:iM(m)}}return t.forEach(u=>s(u)),{addRoute:s,resolve:c,removeRoute:o,getRoutes:a,getRecordMatcher:r}}function Cf(t,e){const n={};for(const i of e)i in t&&(n[i]=t[i]);return n}function tM(t){return{path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:void 0,beforeEnter:t.beforeEnter,props:nM(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}}}function nM(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const i in t.components)e[i]=typeof n=="object"?n[i]:n;return e}function Pf(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function iM(t){return t.reduce((e,n)=>Je(e,n.meta),{})}function Lf(t,e){const n={};for(const i in t)n[i]=i in e?e[i]:t[i];return n}function cm(t,e){return e.children.some(n=>n===t||cm(t,n))}const um=/#/g,rM=/&/g,sM=/\//g,oM=/=/g,aM=/\?/g,fm=/\+/g,lM=/%5B/g,cM=/%5D/g,dm=/%5E/g,uM=/%60/g,hm=/%7B/g,fM=/%7C/g,pm=/%7D/g,dM=/%20/g;function cu(t){return encodeURI(""+t).replace(fM,"|").replace(lM,"[").replace(cM,"]")}function hM(t){return cu(t).replace(hm,"{").replace(pm,"}").replace(dm,"^")}function lc(t){return cu(t).replace(fm,"%2B").replace(dM,"+").replace(um,"%23").replace(rM,"%26").replace(uM,"`").replace(hm,"{").replace(pm,"}").replace(dm,"^")}function pM(t){return lc(t).replace(oM,"%3D")}function mM(t){return cu(t).replace(um,"%23").replace(aM,"%3F")}function gM(t){return t==null?"":mM(t).replace(sM,"%2F")}function ca(t){try{return decodeURIComponent(""+t)}catch{}return""+t}function _M(t){const e={};if(t===""||t==="?")return e;const i=(t[0]==="?"?t.slice(1):t).split("&");for(let r=0;r<i.length;++r){const s=i[r].replace(fm," "),o=s.indexOf("="),a=ca(o<0?s:s.slice(0,o)),l=o<0?null:ca(s.slice(o+1));if(a in e){let c=e[a];vn(c)||(c=e[a]=[c]),c.push(l)}else e[a]=l}return e}function Df(t){let e="";for(let n in t){const i=t[n];if(n=pM(n),i==null){i!==void 0&&(e+=(e.length?"&":"")+n);continue}(vn(i)?i.map(s=>s&&lc(s)):[i&&lc(i)]).forEach(s=>{s!==void 0&&(e+=(e.length?"&":"")+n,s!=null&&(e+="="+s))})}return e}function vM(t){const e={};for(const n in t){const i=t[n];i!==void 0&&(e[n]=vn(i)?i.map(r=>r==null?null:""+r):i==null?i:""+i)}return e}const xM=Symbol(""),Uf=Symbol(""),uu=Symbol(""),mm=Symbol(""),cc=Symbol("");function es(){let t=[];function e(i){return t.push(i),()=>{const r=t.indexOf(i);r>-1&&t.splice(r,1)}}function n(){t=[]}return{add:e,list:()=>t,reset:n}}function oi(t,e,n,i,r){const s=i&&(i.enterCallbacks[r]=i.enterCallbacks[r]||[]);return()=>new Promise((o,a)=>{const l=f=>{f===!1?a(Hr(4,{from:n,to:e})):f instanceof Error?a(f):Wy(f)?a(Hr(2,{from:e,to:f})):(s&&i.enterCallbacks[r]===s&&typeof f=="function"&&s.push(f),o())},c=t.call(i&&i.instances[r],e,n,l);let u=Promise.resolve(c);t.length<3&&(u=u.then(l)),u.catch(f=>a(f))})}function tl(t,e,n,i){const r=[];for(const s of t)for(const o in s.components){let a=s.components[o];if(!(e!=="beforeRouteEnter"&&!s.instances[o]))if(yM(a)){const c=(a.__vccOpts||a)[e];c&&r.push(oi(c,n,i,s,o))}else{let l=a();r.push(()=>l.then(c=>{if(!c)return Promise.reject(new Error(`Couldn't resolve component "${o}" at "${s.path}"`));const u=Ay(c)?c.default:c;s.components[o]=u;const h=(u.__vccOpts||u)[e];return h&&oi(h,n,i,s,o)()}))}}return r}function yM(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function If(t){const e=Bt(uu),n=Bt(mm),i=mt(()=>e.resolve(et(t.to))),r=mt(()=>{const{matched:l}=i.value,{length:c}=l,u=l[c-1],f=n.matched;if(!u||!f.length)return-1;const h=f.findIndex(Br.bind(null,u));if(h>-1)return h;const p=Nf(l[c-2]);return c>1&&Nf(u)===p&&f[f.length-1].path!==p?f.findIndex(Br.bind(null,l[c-2])):h}),s=mt(()=>r.value>-1&&bM(n.params,i.value.params)),o=mt(()=>r.value>-1&&r.value===n.matched.length-1&&rm(n.params,i.value.params));function a(l={}){return SM(l)?e[et(t.replace)?"replace":"push"](et(t.to)).catch(ms):Promise.resolve()}return{route:i,href:mt(()=>i.value.href),isActive:s,isExactActive:o,navigate:a}}const MM=yi({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:If,setup(t,{slots:e}){const n=Xn(If(t)),{options:i}=Bt(uu),r=mt(()=>({[Of(t.activeClass,i.linkActiveClass,"router-link-active")]:n.isActive,[Of(t.exactActiveClass,i.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const s=e.default&&e.default(n);return t.custom?s:_n("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:r.value},s)}}}),EM=MM;function SM(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function bM(t,e){for(const n in e){const i=e[n],r=t[n];if(typeof i=="string"){if(i!==r)return!1}else if(!vn(r)||r.length!==i.length||i.some((s,o)=>s!==r[o]))return!1}return!0}function Nf(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const Of=(t,e,n)=>t??e??n,TM=yi({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const i=Bt(cc),r=mt(()=>t.route||i.value),s=Bt(Uf,0),o=mt(()=>{let c=et(s);const{matched:u}=r.value;let f;for(;(f=u[c])&&!f.components;)c++;return c}),a=mt(()=>r.value.matched[o.value]);Lr(Uf,mt(()=>o.value+1)),Lr(xM,a),Lr(cc,r);const l=Ze();return ki(()=>[l.value,a.value,t.name],([c,u,f],[h,p,g])=>{u&&(u.instances[f]=c,p&&p!==u&&c&&c===h&&(u.leaveGuards.size||(u.leaveGuards=p.leaveGuards),u.updateGuards.size||(u.updateGuards=p.updateGuards))),c&&u&&(!p||!Br(u,p)||!h)&&(u.enterCallbacks[f]||[]).forEach(x=>x(c))},{flush:"post"}),()=>{const c=r.value,u=t.name,f=a.value,h=f&&f.components[u];if(!h)return Ff(n.default,{Component:h,route:c});const p=f.props[u],g=p?p===!0?c.params:typeof p=="function"?p(c):p:null,m=_n(h,Je({},g,e,{onVnodeUnmounted:d=>{d.component.isUnmounted&&(f.instances[u]=null)},ref:l}));return Ff(n.default,{Component:m,route:c})||m}}});function Ff(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const gm=TM;function AM(t){const e=eM(t.routes,t),n=t.parseQuery||_M,i=t.stringifyQuery||Df,r=t.history,s=es(),o=es(),a=es(),l=As(Mn);let c=Mn;xr&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const u=Qa.bind(null,j=>""+j),f=Qa.bind(null,gM),h=Qa.bind(null,ca);function p(j,oe){let ue,Ee;return am(j)?(ue=e.getRecordMatcher(j),Ee=oe):Ee=j,e.addRoute(Ee,ue)}function g(j){const oe=e.getRecordMatcher(j);oe&&e.removeRoute(oe)}function x(){return e.getRoutes().map(j=>j.record)}function m(j){return!!e.getRecordMatcher(j)}function d(j,oe){if(oe=Je({},oe||l.value),typeof j=="string"){const I=el(n,j,oe.path),z=e.resolve({path:I.path},oe),W=r.createHref(I.fullPath);return Je(I,z,{params:h(z.params),hash:ca(I.hash),redirectedFrom:void 0,href:W})}let ue;if("path"in j)ue=Je({},j,{path:el(n,j.path,oe.path).path});else{const I=Je({},j.params);for(const z in I)I[z]==null&&delete I[z];ue=Je({},j,{params:f(I)}),oe.params=f(oe.params)}const Ee=e.resolve(ue,oe),Ae=j.hash||"";Ee.params=u(h(Ee.params));const E=Cy(i,Je({},j,{hash:hM(Ae),path:Ee.path})),D=r.createHref(E);return Je({fullPath:E,hash:Ae,query:i===Df?vM(j.query):j.query||{}},Ee,{redirectedFrom:void 0,href:D})}function _(j){return typeof j=="string"?el(n,j,l.value.path):Je({},j)}function v(j,oe){if(c!==j)return Hr(8,{from:oe,to:j})}function y(j){return w(j)}function S(j){return y(Je(_(j),{replace:!0}))}function R(j){const oe=j.matched[j.matched.length-1];if(oe&&oe.redirect){const{redirect:ue}=oe;let Ee=typeof ue=="function"?ue(j):ue;return typeof Ee=="string"&&(Ee=Ee.includes("?")||Ee.includes("#")?Ee=_(Ee):{path:Ee},Ee.params={}),Je({query:j.query,hash:j.hash,params:"path"in Ee?{}:j.params},Ee)}}function w(j,oe){const ue=c=d(j),Ee=l.value,Ae=j.state,E=j.force,D=j.replace===!0,I=R(ue);if(I)return w(Je(_(I),{state:typeof I=="object"?Je({},Ae,I.state):Ae,force:E,replace:D}),oe||ue);const z=ue;z.redirectedFrom=oe;let W;return!E&&Py(i,Ee,ue)&&(W=Hr(16,{to:z,from:Ee}),V(Ee,Ee,!0,!1)),(W?Promise.resolve(W):T(z,Ee)).catch(ie=>Pn(ie)?Pn(ie,2)?ie:de(ie):Y(ie,z,Ee)).then(ie=>{if(ie){if(Pn(ie,2))return w(Je({replace:D},_(ie.to),{state:typeof ie.to=="object"?Je({},Ae,ie.to.state):Ae,force:E}),oe||z)}else ie=H(z,Ee,!0,D,Ae);return F(z,Ee,ie),ie})}function P(j,oe){const ue=v(j,oe);return ue?Promise.reject(ue):Promise.resolve()}function M(j){const oe=_e.values().next().value;return oe&&typeof oe.runWithContext=="function"?oe.runWithContext(j):j()}function T(j,oe){let ue;const[Ee,Ae,E]=wM(j,oe);ue=tl(Ee.reverse(),"beforeRouteLeave",j,oe);for(const I of Ee)I.leaveGuards.forEach(z=>{ue.push(oi(z,j,oe))});const D=P.bind(null,j,oe);return ue.push(D),we(ue).then(()=>{ue=[];for(const I of s.list())ue.push(oi(I,j,oe));return ue.push(D),we(ue)}).then(()=>{ue=tl(Ae,"beforeRouteUpdate",j,oe);for(const I of Ae)I.updateGuards.forEach(z=>{ue.push(oi(z,j,oe))});return ue.push(D),we(ue)}).then(()=>{ue=[];for(const I of E)if(I.beforeEnter)if(vn(I.beforeEnter))for(const z of I.beforeEnter)ue.push(oi(z,j,oe));else ue.push(oi(I.beforeEnter,j,oe));return ue.push(D),we(ue)}).then(()=>(j.matched.forEach(I=>I.enterCallbacks={}),ue=tl(E,"beforeRouteEnter",j,oe),ue.push(D),we(ue))).then(()=>{ue=[];for(const I of o.list())ue.push(oi(I,j,oe));return ue.push(D),we(ue)}).catch(I=>Pn(I,8)?I:Promise.reject(I))}function F(j,oe,ue){for(const Ee of a.list())M(()=>Ee(j,oe,ue))}function H(j,oe,ue,Ee,Ae){const E=v(j,oe);if(E)return E;const D=oe===Mn,I=xr?history.state:{};ue&&(Ee||D?r.replace(j.fullPath,Je({scroll:D&&I&&I.scroll},Ae)):r.push(j.fullPath,Ae)),l.value=j,V(j,oe,ue,D),de()}let N;function U(){N||(N=r.listen((j,oe,ue)=>{if(!ye.listening)return;const Ee=d(j),Ae=R(Ee);if(Ae){w(Je(Ae,{replace:!0}),Ee).catch(ms);return}c=Ee;const E=l.value;xr&&By(bf(E.fullPath,ue.delta),wa()),T(Ee,E).catch(D=>Pn(D,12)?D:Pn(D,2)?(w(D.to,Ee).then(I=>{Pn(I,20)&&!ue.delta&&ue.type===Ds.pop&&r.go(-1,!1)}).catch(ms),Promise.reject()):(ue.delta&&r.go(-ue.delta,!1),Y(D,Ee,E))).then(D=>{D=D||H(Ee,E,!1),D&&(ue.delta&&!Pn(D,8)?r.go(-ue.delta,!1):ue.type===Ds.pop&&Pn(D,20)&&r.go(-1,!1)),F(Ee,E,D)}).catch(ms)}))}let B=es(),K=es(),q;function Y(j,oe,ue){de(j);const Ee=K.list();return Ee.length?Ee.forEach(Ae=>Ae(j,oe,ue)):console.error(j),Promise.reject(j)}function ce(){return q&&l.value!==Mn?Promise.resolve():new Promise((j,oe)=>{B.add([j,oe])})}function de(j){return q||(q=!j,U(),B.list().forEach(([oe,ue])=>j?ue(j):oe()),B.reset()),j}function V(j,oe,ue,Ee){const{scrollBehavior:Ae}=t;if(!xr||!Ae)return Promise.resolve();const E=!ue&&Hy(bf(j.fullPath,0))||(Ee||!ue)&&history.state&&history.state.scroll||null;return Ki().then(()=>Ae(j,oe,E)).then(D=>D&&Fy(D)).catch(D=>Y(D,j,oe))}const Q=j=>r.go(j);let me;const _e=new Set,ye={currentRoute:l,listening:!0,addRoute:p,removeRoute:g,hasRoute:m,getRoutes:x,resolve:d,options:t,push:y,replace:S,go:Q,back:()=>Q(-1),forward:()=>Q(1),beforeEach:s.add,beforeResolve:o.add,afterEach:a.add,onError:K.add,isReady:ce,install(j){const oe=this;j.component("RouterLink",EM),j.component("RouterView",gm),j.config.globalProperties.$router=oe,Object.defineProperty(j.config.globalProperties,"$route",{enumerable:!0,get:()=>et(l)}),xr&&!me&&l.value===Mn&&(me=!0,y(r.location).catch(Ae=>{}));const ue={};for(const Ae in Mn)Object.defineProperty(ue,Ae,{get:()=>l.value[Ae],enumerable:!0});j.provide(uu,oe),j.provide(mm,Hs(ue)),j.provide(cc,l);const Ee=j.unmount;_e.add(j),j.unmount=function(){_e.delete(j),_e.size<1&&(c=Mn,N&&N(),N=null,l.value=Mn,me=!1,q=!1),Ee()}}};function we(j){return j.reduce((oe,ue)=>oe.then(()=>M(ue)),Promise.resolve())}return ye}function wM(t,e){const n=[],i=[],r=[],s=Math.max(e.matched.length,t.matched.length);for(let o=0;o<s;o++){const a=e.matched[o];a&&(t.matched.find(c=>Br(c,a))?i.push(a):n.push(a));const l=t.matched[o];l&&(e.matched.find(c=>Br(c,l))||r.push(l))}return[n,i,r]}const Bf=[{name:"index",path:"/",meta:{},alias:[],redirect:void 0,component:()=>Fi(()=>import("./index.71321eda.js"),[],import.meta.url).then(t=>t.default||t)},{name:"projects-flock",path:"/projects/flock",meta:{},alias:[],redirect:void 0,component:()=>Fi(()=>import("./flock.dd006dde.js"),["./flock.dd006dde.js","./flock.89ac26ab.css"],import.meta.url).then(t=>t.default||t)},{name:"projects-notebooks-inverse-kinematic-approximations",path:"/projects/notebooks/inverse-kinematic-approximations",meta:{},alias:[],redirect:void 0,component:()=>Fi(()=>import("./inverse-kinematic-approximations.ce5fea55.js"),["./inverse-kinematic-approximations.ce5fea55.js","./NotebookWrapper.b1ec63a6.js","./NotebookWrapper.d4b1e936.css"],import.meta.url).then(t=>t.default||t)},{name:"projects-notebooks-kinematics",path:"/projects/notebooks/kinematics",meta:{},alias:[],redirect:void 0,component:()=>Fi(()=>import("./kinematics.1fc77ec4.js"),["./kinematics.1fc77ec4.js","./NotebookWrapper.b1ec63a6.js","./NotebookWrapper.d4b1e936.css"],import.meta.url).then(t=>t.default||t)}],RM={scrollBehavior(t,e,n){const i=at();let r=n||void 0;if(!r&&e&&t&&t.meta.scrollToTop!==!1&&CM(e,t)&&(r={left:0,top:0}),t.path===e.path){if(e.hash&&!t.hash)return{left:0,top:0};if(t.hash)return{el:t.hash,top:Hf(t.hash)}}const s=a=>!!(a.meta.pageTransition??nc),o=s(e)&&s(t)?"page:transition:finish":"page:finish";return new Promise(a=>{i.hooks.hookOnce(o,async()=>{await Ki(),t.hash&&(r={el:t.hash,top:Hf(t.hash)}),a(r)})})}};function Hf(t){try{const e=document.querySelector(t);if(e)return parseFloat(getComputedStyle(e).scrollMarginTop)}catch{}return 0}function CM(t,e){const n=e.matched.every((i,r)=>{var s,o,a;return((s=i.components)==null?void 0:s.default)===((a=(o=t.matched[r])==null?void 0:o.components)==null?void 0:a.default)});return!!(!n||n&&JSON.stringify(t.params)!==JSON.stringify(e.params))}const PM={},Nt={...PM,...RM},LM=async t=>{var l;let e,n;if(!((l=t.meta)!=null&&l.validate))return;const i=at(),r=Ei();if(([e,n]=sa(()=>Promise.resolve(t.meta.validate(t))),e=await e,n(),e)===!0)return;const o=lu({statusCode:404,statusMessage:`Page Not Found: ${t.fullPath}`}),a=r.beforeResolve(c=>{if(a(),c===t){const u=r.afterEach(async()=>{u(),await i.runWithContext(()=>Sr(o)),window.history.pushState({},"",t.fullPath)});return!1}})},DM=[LM],_s={};function UM(t,e,n){const{pathname:i,search:r,hash:s}=e,o=t.indexOf("#");if(o>-1){const l=s.includes(t.slice(o))?t.slice(o).length:1;let c=s.slice(l);return c[0]!=="/"&&(c="/"+c),cf(c,"")}const a=n||cf(i,t);return a+(a.includes("?")?"":r)+s}const IM=Mi({name:"nuxt:router",enforce:"pre",async setup(t){var x,m;let e,n,i=ou().app.baseURL;Nt.hashMode&&!i.includes("#")&&(i+="#");const r=((x=Nt.history)==null?void 0:x.call(Nt,i))??(Nt.hashMode?Vy(i):om(i)),s=((m=Nt.routes)==null?void 0:m.call(Nt,Bf))??Bf;let o;const a=UM(i,window.location,t.payload.path),l=AM({...Nt,scrollBehavior:(d,_,v)=>{var y;if(_===Mn){o=v;return}return l.options.scrollBehavior=Nt.scrollBehavior,(y=Nt.scrollBehavior)==null?void 0:y.call(Nt,d,Mn,o||v)},history:r,routes:s});t.vueApp.use(l);const c=As(l.currentRoute.value);l.afterEach((d,_)=>{c.value=_}),Object.defineProperty(t.vueApp.config.globalProperties,"previousRoute",{get:()=>c.value});const u=As(l.resolve(a)),f=()=>{u.value=l.currentRoute.value};t.hook("page:finish",f),l.afterEach((d,_)=>{var v,y,S,R;((y=(v=d.matched[0])==null?void 0:v.components)==null?void 0:y.default)===((R=(S=_.matched[0])==null?void 0:S.components)==null?void 0:R.default)&&f()});const h={};for(const d in u.value)Object.defineProperty(h,d,{get:()=>u.value[d]});t._route=Hs(h),t._middleware=t._middleware||{global:[],named:{}};const p=Aa();try{[e,n]=sa(()=>l.isReady()),await e,n()}catch(d){[e,n]=sa(()=>t.runWithContext(()=>Sr(d))),await e,n()}const g=xy("_layout");return l.beforeEach(async(d,_)=>{var v;d.meta=Xn(d.meta),t.isHydrating&&g.value&&!ji(d.meta.layout)&&(d.meta.layout=g.value),t._processingMiddleware=!0;{const y=new Set([...DM,...t._middleware.global]);for(const S of d.matched){const R=S.meta.middleware;if(R)if(Array.isArray(R))for(const w of R)y.add(w);else y.add(R)}for(const S of y){const R=typeof S=="string"?t._middleware.named[S]||await((v=_s[S])==null?void 0:v.call(_s).then(P=>P.default||P)):S;if(!R)throw new Error(`Unknown route middleware: '${S}'.`);const w=await t.runWithContext(()=>R(d,_));if(!t.payload.serverRendered&&t.isHydrating&&(w===!1||w instanceof Error)){const P=w||sc({statusCode:404,statusMessage:`Page Not Found: ${a}`});return await t.runWithContext(()=>Sr(P)),!1}if(w||w===!1)return w}}}),l.onError(()=>{delete t._processingMiddleware}),l.afterEach(async(d,_,v)=>{delete t._processingMiddleware,!t.isHydrating&&p.value&&await t.runWithContext(Sy),d.matched.length===0&&await t.runWithContext(()=>Sr(sc({statusCode:404,fatal:!1,statusMessage:`Page not found: ${d.fullPath}`})))}),t.hooks.hookOnce("app:created",async()=>{try{await l.replace({...l.resolve(a),name:void 0,force:!0}),l.options.scrollBehavior=Nt.scrollBehavior}catch(d){await t.runWithContext(()=>Sr(d))}}),{provide:{router:l}}}}),NM=Mi({name:"nuxt:payload",setup(t){fy()&&(t.hooks.hook("link:prefetch",async e=>{js(e).protocol||await xf(e)}),Ei().beforeResolve(async(e,n)=>{if(e.path===n.path)return;const i=await xf(e.path);i&&Object.assign(t.static.data,i.data)}))}}),OM=!1;/*!
  * pinia v2.1.4
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */let _m;const qs=t=>_m=t,vm=Symbol();function uc(t){return t&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"&&typeof t.toJSON!="function"}var vs;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(vs||(vs={}));function FM(){const t=Ih(!0),e=t.run(()=>Ze({}));let n=[],i=[];const r=xa({install(s){qs(r),r._a=s,s.provide(vm,r),s.config.globalProperties.$pinia=r,i.forEach(o=>n.push(o)),i=[]},use(s){return!this._a&&!OM?i.push(s):n.push(s),this},_p:n,_a:null,_e:t,_s:new Map,state:e});return r}const xm=()=>{};function kf(t,e,n,i=xm){t.push(e);const r=()=>{const s=t.indexOf(e);s>-1&&(t.splice(s,1),i())};return!n&&Nh()&&qg(r),r}function Qi(t,...e){t.slice().forEach(n=>{n(...e)})}const BM=t=>t();function fc(t,e){t instanceof Map&&e instanceof Map&&e.forEach((n,i)=>t.set(i,n)),t instanceof Set&&e instanceof Set&&e.forEach(t.add,t);for(const n in e){if(!e.hasOwnProperty(n))continue;const i=e[n],r=t[n];uc(r)&&uc(i)&&t.hasOwnProperty(n)&&!it(i)&&!zn(i)?t[n]=fc(r,i):t[n]=i}return t}const HM=Symbol();function kM(t){return!uc(t)||!t.hasOwnProperty(HM)}const{assign:ii}=Object;function zM(t){return!!(it(t)&&t.effect)}function GM(t,e,n,i){const{state:r,actions:s,getters:o}=e,a=n.state.value[t];let l;function c(){a||(n.state.value[t]=r?r():{});const u=S_(n.state.value[t]);return ii(u,s,Object.keys(o||{}).reduce((f,h)=>(f[h]=xa(mt(()=>{qs(n);const p=n._s.get(t);return o[h].call(p,p)})),f),{}))}return l=ym(t,c,e,n,i,!0),l}function ym(t,e,n={},i,r,s){let o;const a=ii({actions:{}},n),l={deep:!0};let c,u,f=[],h=[],p;const g=i.state.value[t];!s&&!g&&(i.state.value[t]={}),Ze({});let x;function m(P){let M;c=u=!1,typeof P=="function"?(P(i.state.value[t]),M={type:vs.patchFunction,storeId:t,events:p}):(fc(i.state.value[t],P),M={type:vs.patchObject,payload:P,storeId:t,events:p});const T=x=Symbol();Ki().then(()=>{x===T&&(c=!0)}),u=!0,Qi(f,M,i.state.value[t])}const d=s?function(){const{state:M}=n,T=M?M():{};this.$patch(F=>{ii(F,T)})}:xm;function _(){o.stop(),f=[],h=[],i._s.delete(t)}function v(P,M){return function(){qs(i);const T=Array.from(arguments),F=[],H=[];function N(K){F.push(K)}function U(K){H.push(K)}Qi(h,{args:T,name:P,store:S,after:N,onError:U});let B;try{B=M.apply(this&&this.$id===t?this:S,T)}catch(K){throw Qi(H,K),K}return B instanceof Promise?B.then(K=>(Qi(F,K),K)).catch(K=>(Qi(H,K),Promise.reject(K))):(Qi(F,B),B)}}const y={_p:i,$id:t,$onAction:kf.bind(null,h),$patch:m,$reset:d,$subscribe(P,M={}){const T=kf(f,P,M.detached,()=>F()),F=o.run(()=>ki(()=>i.state.value[t],H=>{(M.flush==="sync"?u:c)&&P({storeId:t,type:vs.direct,events:p},H)},ii({},l,M)));return T},$dispose:_},S=Xn(y);i._s.set(t,S);const R=i._a&&i._a.runWithContext||BM,w=i._e.run(()=>(o=Ih(),R(()=>o.run(e))));for(const P in w){const M=w[P];if(it(M)&&!zM(M)||zn(M))s||(g&&kM(M)&&(it(M)?M.value=g[P]:fc(M,g[P])),i.state.value[t][P]=M);else if(typeof M=="function"){const T=v(P,M);w[P]=T,a.actions[P]=M}}return ii(S,w),ii(qe(S),w),Object.defineProperty(S,"$state",{get:()=>i.state.value[t],set:P=>{m(M=>{ii(M,P)})}}),i._p.forEach(P=>{ii(S,o.run(()=>P({store:S,app:i._a,pinia:i,options:a})))}),g&&s&&n.hydrate&&n.hydrate(S.$state,g),c=!0,u=!0,S}function VM(t,e,n){let i,r;const s=typeof e=="function";typeof t=="string"?(i=t,r=s?n:e):(r=t,i=t.id);function o(a,l){const c=Jc();return a=a||(c?Bt(vm,null):null),a&&qs(a),a=_m,a._s.has(i)||(s?ym(i,e,r,a):GM(i,r,a)),a._s.get(i)}return o.$id=i,o}function WM(t){{t=qe(t);const e={};for(const n in t){const i=t[n];(it(i)||zn(i))&&(e[n]=Vc(t,n))}return e}}const dc=globalThis.requestIdleCallback||(t=>{const e=Date.now(),n={didTimeout:!1,timeRemaining:()=>Math.max(0,50-(Date.now()-e))};return setTimeout(()=>{t(n)},1)}),XM=globalThis.cancelIdleCallback||(t=>{clearTimeout(t)}),jM=t=>{const e=at();e.isHydrating?e.hooks.hookOnce("app:suspense:resolve",()=>{dc(t)}):dc(t)};async function Mm(t,e=Ei()){const{path:n,matched:i}=e.resolve(t);if(!i.length||(e._routePreloaded||(e._routePreloaded=new Set),e._routePreloaded.has(n)))return;const r=e._preloadPromises=e._preloadPromises||[];if(r.length>4)return Promise.all(r).then(()=>Mm(t,e));e._routePreloaded.add(n);const s=i.map(o=>{var a;return(a=o.components)==null?void 0:a.default}).filter(o=>typeof o=="function");for(const o of s){const a=Promise.resolve(o()).catch(()=>{}).finally(()=>r.splice(r.indexOf(a)));r.push(a)}await Promise.all(r)}function qM(t={}){const e=t.path||window.location.pathname;let n={};try{n=JSON.parse(sessionStorage.getItem("nuxt:reload")||"{}")}catch{}if(t.force||(n==null?void 0:n.path)!==e||(n==null?void 0:n.expires)<Date.now()){try{sessionStorage.setItem("nuxt:reload",JSON.stringify({path:e,expires:Date.now()+(t.ttl??1e4)}))}catch{}if(t.persistState)try{sessionStorage.setItem("nuxt:reload:state",JSON.stringify({state:at().payload.state}))}catch{}window.location.pathname!==e?window.location.href=e:window.location.reload()}}const $M=(...t)=>t.find(e=>e!==void 0),YM="noopener noreferrer";/*! @__NO_SIDE_EFFECTS__ */function KM(t){const e=t.componentName||"NuxtLink",n=(i,r)=>{if(!i||t.trailingSlash!=="append"&&t.trailingSlash!=="remove")return i;const s=t.trailingSlash==="append"?kp:su;if(typeof i=="string")return s(i,!0);const o="path"in i?i.path:r(i).path;return{...i,name:void 0,path:s(o,!0)}};return yi({name:e,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},setup(i,{slots:r}){const s=Ei(),o=mt(()=>{const f=i.to||i.href||"";return n(f,s.resolve)}),a=mt(()=>i.external||i.target&&i.target!=="_self"?!0:typeof o.value=="object"?!1:o.value===""||$r(o.value,{acceptRelative:!0})),l=Ze(!1),c=Ze(null),u=f=>{var h;c.value=i.custom?(h=f==null?void 0:f.$el)==null?void 0:h.nextElementSibling:f==null?void 0:f.$el};if(i.prefetch!==!1&&i.noPrefetch!==!0&&i.target!=="_blank"&&!QM()){const h=at();let p,g=null;zs(()=>{const x=JM();jM(()=>{p=dc(()=>{var m;(m=c==null?void 0:c.value)!=null&&m.tagName&&(g=x.observe(c.value,async()=>{g==null||g(),g=null;const d=typeof o.value=="string"?o.value:s.resolve(o.value).fullPath;await Promise.all([h.hooks.callHook("link:prefetch",d).catch(()=>{}),!a.value&&Mm(o.value,s).catch(()=>{})]),l.value=!0}))})})}),Gs(()=>{p&&XM(p),g==null||g(),g=null})}return()=>{var x,m;if(!a.value){const d={ref:u,to:o.value,activeClass:i.activeClass||t.activeClass,exactActiveClass:i.exactActiveClass||t.exactActiveClass,replace:i.replace,ariaCurrentValue:i.ariaCurrentValue,custom:i.custom};return i.custom||(l.value&&(d.class=i.prefetchedClass||t.prefetchedClass),d.rel=i.rel),_n(nv("RouterLink"),d,r.default)}const f=typeof o.value=="object"?((x=s.resolve(o.value))==null?void 0:x.href)??null:o.value||null,h=i.target||null,p=i.noRel?null:$M(i.rel,t.externalRelAttribute,f?YM:"")||null,g=()=>Ey(f,{replace:i.replace});return i.custom?r.default?r.default({href:f,navigate:g,get route(){if(!f)return;const d=js(f);return{path:d.pathname,fullPath:d.pathname,get query(){return Hp(d.search)},hash:d.hash,params:{},name:void 0,matched:[],redirectedFrom:void 0,meta:{},href:f}},rel:p,target:h,isExternal:a.value,isActive:!1,isExactActive:!1}):null:_n("a",{ref:c,href:f,rel:p,target:h},(m=r.default)==null?void 0:m.call(r))}}})}const ZM=KM({componentName:"NuxtLink"});function JM(){const t=at();if(t._observer)return t._observer;let e=null;const n=new Map,i=(s,o)=>(e||(e=new IntersectionObserver(a=>{for(const l of a){const c=n.get(l.target);(l.isIntersecting||l.intersectionRatio>0)&&c&&c()}})),n.set(s,o),e.observe(s),()=>{n.delete(s),e.unobserve(s),n.size===0&&(e.disconnect(),e=null)});return t._observer={observe:i}}function QM(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}const eE=Mi(t=>{const e=FM();return t.vueApp.use(e),qs(e),t.payload&&t.payload.pinia&&(e.state.value=t.payload.pinia),{provide:{pinia:e}}}),tE=Mi({name:"nuxt:global-components"}),nE=Mi({name:"nuxt:head",setup(t){const n=ny();n.push(oy),t.vueApp.use(n);{let i=!0;const r=()=>{i=!1,n.hooks.callHook("entries:updated",n)};n.hooks.hook("dom:beforeRender",s=>{s.shouldRender=!i}),t.hooks.hook("page:start",()=>{i=!0}),t.hooks.hook("page:finish",r),t.hooks.hook("app:suspense:resolve",r)}}}),po={},iE=Mi({name:"nuxt:prefetch",setup(t){const e=Ei();t.hooks.hook("app:mounted",()=>{e.beforeEach(async n=>{var r;const i=(r=n==null?void 0:n.meta)==null?void 0:r.layout;i&&typeof po[i]=="function"&&await po[i]()})}),t.hooks.hook("link:prefetch",n=>{var o,a,l,c;if($r(n))return;const i=e.resolve(n);if(!i)return;const r=(o=i==null?void 0:i.meta)==null?void 0:o.layout;let s=Array.isArray((a=i==null?void 0:i.meta)==null?void 0:a.middleware)?(l=i==null?void 0:i.meta)==null?void 0:l.middleware:[(c=i==null?void 0:i.meta)==null?void 0:c.middleware];s=s.filter(u=>typeof u=="string");for(const u of s)typeof _s[u]=="function"&&_s[u]();r&&typeof po[r]=="function"&&po[r]()})}}),rE=Mi({name:"nuxt:chunk-reload",setup(t){const e=Ei(),n=ou(),i=new Set;e.beforeEach(()=>{i.clear()}),t.hook("app:chunkError",({error:r})=>{i.add(r)}),e.onError((r,s)=>{if(i.has(r)){const a="href"in s&&s.href.startsWith("#")?n.app.baseURL+s.href:Xs(n.app.baseURL,s.fullPath);qM({path:a,persistState:!0})}})}}),sE=[Ty,IM,NM,eE,tE,nE,iE,rE];function Em(t){const e=typeof t;return t!=null&&(e==="object"||e==="function")}const oE=typeof global=="object"&&global!==null&&global.Object===Object&&global,aE=typeof globalThis=="object"&&globalThis!==null&&globalThis.Object==Object&&globalThis,lE=typeof self=="object"&&self!==null&&self.Object===Object&&self,mo=aE||oE||lE||Function("return this")();function cE(t,e,n){let i,r,s,o,a,l,c=0,u=!1,f=!1,h=!0;const p=!e&&e!==0&&typeof mo.requestAnimationFrame=="function";if(typeof t!="function")throw new TypeError("Expected a function");e=+e||0,Em(n)&&(u=!!n.leading,f="maxWait"in n,s=f?Math.max(+n.maxWait||0,e):s,h="trailing"in n?!!n.trailing:h);function g(T){const F=i,H=r;return i=r=void 0,c=T,o=t.apply(H,F),o}function x(T,F){return p?(mo.cancelAnimationFrame(a),mo.requestAnimationFrame(T)):setTimeout(T,F)}function m(T){if(p)return mo.cancelAnimationFrame(T);clearTimeout(T)}function d(T){return c=T,a=x(y,e),u?g(T):o}function _(T){const F=T-l,H=T-c,N=e-F;return f?Math.min(N,s-H):N}function v(T){const F=T-l,H=T-c;return l===void 0||F>=e||F<0||f&&H>=s}function y(){const T=Date.now();if(v(T))return S(T);a=x(y,_(T))}function S(T){return a=void 0,h&&i?g(T):(i=r=void 0,o)}function R(){a!==void 0&&m(a),c=0,i=l=r=a=void 0}function w(){return a===void 0?o:S(Date.now())}function P(){return a!==void 0}function M(...T){const F=Date.now(),H=v(F);if(i=T,r=this,l=F,H){if(a===void 0)return d(l);if(f)return a=x(y,e),g(l)}return a===void 0&&(a=x(y,e)),o}return M.cancel=R,M.flush=w,M.pending=P,M}function er(t,e,n){let i=!0,r=!0;if(typeof t!="function")throw new TypeError("Expected a function");return n&&Em(n)&&(i="leading"in n?!!n.leading:i,r="trailing"in n?!!n.trailing:r),cE(t,e,{leading:i,trailing:r,maxWait:e})}function Sm(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]]);return n}var uE=function(){},zf=function(){};const hc=(t,e,n)=>Math.min(Math.max(n,t),e),nl=.001,fE=.01,Gf=10,dE=.05,hE=1;function pE({duration:t=800,bounce:e=.25,velocity:n=0,mass:i=1}){let r,s;uE(t<=Gf*1e3);let o=1-e;o=hc(dE,hE,o),t=hc(fE,Gf,t/1e3),o<1?(r=c=>{const u=c*o,f=u*t,h=u-n,p=pc(c,o),g=Math.exp(-f);return nl-h/p*g},s=c=>{const f=c*o*t,h=f*n+n,p=Math.pow(o,2)*Math.pow(c,2)*t,g=Math.exp(-f),x=pc(Math.pow(c,2),o);return(-r(c)+nl>0?-1:1)*((h-p)*g)/x}):(r=c=>{const u=Math.exp(-c*t),f=(c-n)*t+1;return-nl+u*f},s=c=>{const u=Math.exp(-c*t),f=(n-c)*(t*t);return u*f});const a=5/t,l=gE(r,s,a);if(t=t*1e3,isNaN(l))return{stiffness:100,damping:10,duration:t};{const c=Math.pow(l,2)*i;return{stiffness:c,damping:o*2*Math.sqrt(i*c),duration:t}}}const mE=12;function gE(t,e,n){let i=n;for(let r=1;r<mE;r++)i=i-t(i)/e(i);return i}function pc(t,e){return t*Math.sqrt(1-e*e)}const _E=["duration","bounce"],vE=["stiffness","damping","mass"];function Vf(t,e){return e.some(n=>t[n]!==void 0)}function xE(t){let e=Object.assign({velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1},t);if(!Vf(t,vE)&&Vf(t,_E)){const n=pE(t);e=Object.assign(Object.assign(Object.assign({},e),n),{velocity:0,mass:1}),e.isResolvedFromDuration=!0}return e}function fu(t){var{from:e=0,to:n=1,restSpeed:i=2,restDelta:r}=t,s=Sm(t,["from","to","restSpeed","restDelta"]);const o={done:!1,value:e};let{stiffness:a,damping:l,mass:c,velocity:u,duration:f,isResolvedFromDuration:h}=xE(s),p=Wf,g=Wf;function x(){const m=u?-(u/1e3):0,d=n-e,_=l/(2*Math.sqrt(a*c)),v=Math.sqrt(a/c)/1e3;if(r===void 0&&(r=Math.min(Math.abs(n-e)/100,.4)),_<1){const y=pc(v,_);p=S=>{const R=Math.exp(-_*v*S);return n-R*((m+_*v*d)/y*Math.sin(y*S)+d*Math.cos(y*S))},g=S=>{const R=Math.exp(-_*v*S);return _*v*R*(Math.sin(y*S)*(m+_*v*d)/y+d*Math.cos(y*S))-R*(Math.cos(y*S)*(m+_*v*d)-y*d*Math.sin(y*S))}}else if(_===1)p=y=>n-Math.exp(-v*y)*(d+(m+v*d)*y);else{const y=v*Math.sqrt(_*_-1);p=S=>{const R=Math.exp(-_*v*S),w=Math.min(y*S,300);return n-R*((m+_*v*d)*Math.sinh(w)+y*d*Math.cosh(w))/y}}}return x(),{next:m=>{const d=p(m);if(h)o.done=m>=f;else{const _=g(m)*1e3,v=Math.abs(_)<=i,y=Math.abs(n-d)<=r;o.done=v&&y}return o.value=o.done?n:d,o},flipTarget:()=>{u=-u,[e,n]=[n,e],x()}}}fu.needsInterpolation=(t,e)=>typeof t=="string"||typeof e=="string";const Wf=t=>0,bm=(t,e,n)=>{const i=e-t;return i===0?1:(n-t)/i},du=(t,e,n)=>-n*t+n*e+t,Tm=(t,e)=>n=>Math.max(Math.min(n,e),t),xs=t=>t%1?Number(t.toFixed(5)):t,ua=/(-)?([\d]*\.?[\d])+/g,mc=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,yE=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function $s(t){return typeof t=="string"}const Ra={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},Am=Object.assign(Object.assign({},Ra),{transform:Tm(0,1)});Object.assign(Object.assign({},Ra),{default:1});const ME=t=>({test:e=>$s(e)&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),ys=ME("%");Object.assign(Object.assign({},ys),{parse:t=>ys.parse(t)/100,transform:t=>ys.transform(t*100)});const hu=(t,e)=>n=>!!($s(n)&&yE.test(n)&&n.startsWith(t)||e&&Object.prototype.hasOwnProperty.call(n,e)),wm=(t,e,n)=>i=>{if(!$s(i))return i;const[r,s,o,a]=i.match(ua);return{[t]:parseFloat(r),[e]:parseFloat(s),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},Bi={test:hu("hsl","hue"),parse:wm("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:i=1})=>"hsla("+Math.round(t)+", "+ys.transform(xs(e))+", "+ys.transform(xs(n))+", "+xs(Am.transform(i))+")"},EE=Tm(0,255),il=Object.assign(Object.assign({},Ra),{transform:t=>Math.round(EE(t))}),ci={test:hu("rgb","red"),parse:wm("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:i=1})=>"rgba("+il.transform(t)+", "+il.transform(e)+", "+il.transform(n)+", "+xs(Am.transform(i))+")"};function SE(t){let e="",n="",i="",r="";return t.length>5?(e=t.substr(1,2),n=t.substr(3,2),i=t.substr(5,2),r=t.substr(7,2)):(e=t.substr(1,1),n=t.substr(2,1),i=t.substr(3,1),r=t.substr(4,1),e+=e,n+=n,i+=i,r+=r),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:r?parseInt(r,16)/255:1}}const gc={test:hu("#"),parse:SE,transform:ci.transform},Ca={test:t=>ci.test(t)||gc.test(t)||Bi.test(t),parse:t=>ci.test(t)?ci.parse(t):Bi.test(t)?Bi.parse(t):gc.parse(t),transform:t=>$s(t)?t:t.hasOwnProperty("red")?ci.transform(t):Bi.transform(t)},Rm="${c}",Cm="${n}";function bE(t){var e,n,i,r;return isNaN(t)&&$s(t)&&((n=(e=t.match(ua))===null||e===void 0?void 0:e.length)!==null&&n!==void 0?n:0)+((r=(i=t.match(mc))===null||i===void 0?void 0:i.length)!==null&&r!==void 0?r:0)>0}function Pm(t){typeof t=="number"&&(t=`${t}`);const e=[];let n=0;const i=t.match(mc);i&&(n=i.length,t=t.replace(mc,Rm),e.push(...i.map(Ca.parse)));const r=t.match(ua);return r&&(t=t.replace(ua,Cm),e.push(...r.map(Ra.parse))),{values:e,numColors:n,tokenised:t}}function Lm(t){return Pm(t).values}function Dm(t){const{values:e,numColors:n,tokenised:i}=Pm(t),r=e.length;return s=>{let o=i;for(let a=0;a<r;a++)o=o.replace(a<n?Rm:Cm,a<n?Ca.transform(s[a]):xs(s[a]));return o}}const TE=t=>typeof t=="number"?0:t;function AE(t){const e=Lm(t);return Dm(t)(e.map(TE))}const Um={test:bE,parse:Lm,createTransformer:Dm,getAnimatableNone:AE};function rl(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function Xf({hue:t,saturation:e,lightness:n,alpha:i}){t/=360,e/=100,n/=100;let r=0,s=0,o=0;if(!e)r=s=o=n;else{const a=n<.5?n*(1+e):n+e-n*e,l=2*n-a;r=rl(l,a,t+1/3),s=rl(l,a,t),o=rl(l,a,t-1/3)}return{red:Math.round(r*255),green:Math.round(s*255),blue:Math.round(o*255),alpha:i}}const wE=(t,e,n)=>{const i=t*t,r=e*e;return Math.sqrt(Math.max(0,n*(r-i)+i))},RE=[gc,ci,Bi],jf=t=>RE.find(e=>e.test(t)),Im=(t,e)=>{let n=jf(t),i=jf(e),r=n.parse(t),s=i.parse(e);n===Bi&&(r=Xf(r),n=ci),i===Bi&&(s=Xf(s),i=ci);const o=Object.assign({},r);return a=>{for(const l in o)l!=="alpha"&&(o[l]=wE(r[l],s[l],a));return o.alpha=du(r.alpha,s.alpha,a),n.transform(o)}},CE=t=>typeof t=="number",PE=(t,e)=>n=>e(t(n)),Nm=(...t)=>t.reduce(PE);function Om(t,e){return CE(t)?n=>du(t,e,n):Ca.test(t)?Im(t,e):Bm(t,e)}const Fm=(t,e)=>{const n=[...t],i=n.length,r=t.map((s,o)=>Om(s,e[o]));return s=>{for(let o=0;o<i;o++)n[o]=r[o](s);return n}},LE=(t,e)=>{const n=Object.assign(Object.assign({},t),e),i={};for(const r in n)t[r]!==void 0&&e[r]!==void 0&&(i[r]=Om(t[r],e[r]));return r=>{for(const s in i)n[s]=i[s](r);return n}};function qf(t){const e=Um.parse(t),n=e.length;let i=0,r=0,s=0;for(let o=0;o<n;o++)i||typeof e[o]=="number"?i++:e[o].hue!==void 0?s++:r++;return{parsed:e,numNumbers:i,numRGB:r,numHSL:s}}const Bm=(t,e)=>{const n=Um.createTransformer(e),i=qf(t),r=qf(e);return i.numHSL===r.numHSL&&i.numRGB===r.numRGB&&i.numNumbers>=r.numNumbers?Nm(Fm(i.parsed,r.parsed),n):o=>`${o>0?e:t}`},DE=(t,e)=>n=>du(t,e,n);function UE(t){if(typeof t=="number")return DE;if(typeof t=="string")return Ca.test(t)?Im:Bm;if(Array.isArray(t))return Fm;if(typeof t=="object")return LE}function IE(t,e,n){const i=[],r=n||UE(t[0]),s=t.length-1;for(let o=0;o<s;o++){let a=r(t[o],t[o+1]);if(e){const l=Array.isArray(e)?e[o]:e;a=Nm(l,a)}i.push(a)}return i}function NE([t,e],[n]){return i=>n(bm(t,e,i))}function OE(t,e){const n=t.length,i=n-1;return r=>{let s=0,o=!1;if(r<=t[0]?o=!0:r>=t[i]&&(s=i-1,o=!0),!o){let l=1;for(;l<n&&!(t[l]>r||l===i);l++);s=l-1}const a=bm(t[s],t[s+1],r);return e[s](a)}}function En(t,e,{clamp:n=!0,ease:i,mixer:r}={}){const s=t.length;zf(s===e.length),zf(!i||!Array.isArray(i)||i.length===s-1),t[0]>t[s-1]&&(t=[].concat(t),e=[].concat(e),t.reverse(),e.reverse());const o=IE(e,i,r),a=s===2?NE(t,o):OE(t,o);return n?l=>a(hc(t[0],t[s-1],l)):a}const FE=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,BE=t=>e=>Math.pow(e,t),HE=t=>e=>e*e*((t+1)*e-t),kE=t=>{const e=HE(t);return n=>(n*=2)<1?.5*e(n):.5*(2-Math.pow(2,-10*(n-1)))},zE=1.525,GE=BE(2),VE=FE(GE);kE(zE);function WE(t,e){return t.map(()=>e||VE).splice(0,t.length-1)}function XE(t){const e=t.length;return t.map((n,i)=>i!==0?i/(e-1):0)}function jE(t,e){return t.map(n=>n*e)}function Go({from:t=0,to:e=1,ease:n,offset:i,duration:r=300}){const s={done:!1,value:t},o=Array.isArray(e)?e:[t,e],a=jE(i&&i.length===o.length?i:XE(o),r);function l(){return En(a,o,{ease:Array.isArray(n)?n:WE(o,n)})}let c=l();return{next:u=>(s.value=c(u),s.done=u>=r,s),flipTarget:()=>{o.reverse(),c=l()}}}function qE({velocity:t=0,from:e=0,power:n=.8,timeConstant:i=350,restDelta:r=.5,modifyTarget:s}){const o={done:!1,value:e};let a=n*t;const l=e+a,c=s===void 0?l:s(l);return c!==l&&(a=c-e),{next:u=>{const f=-a*Math.exp(-u/i);return o.done=!(f>r||f<-r),o.value=o.done?c:c+f,o},flipTarget:()=>{}}}const $f={keyframes:Go,spring:fu,decay:qE};function $E(t){if(Array.isArray(t.to))return Go;if($f[t.type])return $f[t.type];const e=new Set(Object.keys(t));return e.has("ease")||e.has("duration")&&!e.has("dampingRatio")?Go:e.has("dampingRatio")||e.has("stiffness")||e.has("mass")||e.has("damping")||e.has("restSpeed")||e.has("restDelta")?fu:Go}const Hm=1/60*1e3,YE=typeof performance<"u"?()=>performance.now():()=>Date.now(),km=typeof window<"u"?t=>window.requestAnimationFrame(t):t=>setTimeout(()=>t(YE()),Hm);function KE(t){let e=[],n=[],i=0,r=!1,s=!1;const o=new WeakSet,a={schedule:(l,c=!1,u=!1)=>{const f=u&&r,h=f?e:n;return c&&o.add(l),h.indexOf(l)===-1&&(h.push(l),f&&r&&(i=e.length)),l},cancel:l=>{const c=n.indexOf(l);c!==-1&&n.splice(c,1),o.delete(l)},process:l=>{if(r){s=!0;return}if(r=!0,[e,n]=[n,e],n.length=0,i=e.length,i)for(let c=0;c<i;c++){const u=e[c];u(l),o.has(u)&&(a.schedule(u),t())}r=!1,s&&(s=!1,a.process(l))}};return a}const ZE=40;let _c=!0,Us=!1,vc=!1;const Ms={delta:0,timestamp:0},Ys=["read","update","preRender","render","postRender"],Pa=Ys.reduce((t,e)=>(t[e]=KE(()=>Us=!0),t),{}),JE=Ys.reduce((t,e)=>{const n=Pa[e];return t[e]=(i,r=!1,s=!1)=>(Us||tS(),n.schedule(i,r,s)),t},{}),QE=Ys.reduce((t,e)=>(t[e]=Pa[e].cancel,t),{});Ys.reduce((t,e)=>(t[e]=()=>Pa[e].process(Ms),t),{});const eS=t=>Pa[t].process(Ms),zm=t=>{Us=!1,Ms.delta=_c?Hm:Math.max(Math.min(t-Ms.timestamp,ZE),1),Ms.timestamp=t,vc=!0,Ys.forEach(eS),vc=!1,Us&&(_c=!1,km(zm))},tS=()=>{Us=!0,_c=!0,vc||km(zm)},nS=JE;function Gm(t,e,n=0){return t-e-n}function iS(t,e,n=0,i=!0){return i?Gm(e+-t,e,n):e-(t-e)+n}function rS(t,e,n,i){return i?t>=e+n:t<=-n}const sS=t=>{const e=({delta:n})=>t(n);return{start:()=>nS.update(e,!0),stop:()=>QE.update(e)}};function xc(t){var e,n,{from:i,autoplay:r=!0,driver:s=sS,elapsed:o=0,repeat:a=0,repeatType:l="loop",repeatDelay:c=0,onPlay:u,onStop:f,onComplete:h,onRepeat:p,onUpdate:g}=t,x=Sm(t,["from","autoplay","driver","elapsed","repeat","repeatType","repeatDelay","onPlay","onStop","onComplete","onRepeat","onUpdate"]);let{to:m}=x,d,_=0,v=x.duration,y,S=!1,R=!0,w;const P=$E(x);!((n=(e=P).needsInterpolation)===null||n===void 0)&&n.call(e,i,m)&&(w=En([0,100],[i,m],{clamp:!1}),i=0,m=100);const M=P(Object.assign(Object.assign({},x),{from:i,to:m}));function T(){_++,l==="reverse"?(R=_%2===0,o=iS(o,v,c,R)):(o=Gm(o,v,c),l==="mirror"&&M.flipTarget()),S=!1,p&&p()}function F(){d.stop(),h&&h()}function H(U){if(R||(U=-U),o+=U,!S){const B=M.next(Math.max(0,o));y=B.value,w&&(y=w(y)),S=R?B.done:o<=0}g==null||g(y),S&&(_===0&&(v??(v=o)),_<a?rS(o,v,c,R)&&T():F())}function N(){u==null||u(),d=s(H),d.start()}return r&&N(),{stop:()=>{f==null||f(),d.stop()}}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pu="154",tr={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},nr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},oS=0,Yf=1,aS=2,Vm=1,lS=2,Fn=3,xi=0,kt=1,Hn=2,gi=0,Dr=1,Kf=2,Zf=3,Jf=4,cS=5,yr=100,uS=101,fS=102,Qf=103,ed=104,dS=200,hS=201,pS=202,mS=203,Wm=204,Xm=205,gS=206,_S=207,vS=208,xS=209,yS=210,MS=0,ES=1,SS=2,yc=3,bS=4,TS=5,AS=6,wS=7,jm=0,RS=1,CS=2,Gn=0,PS=1,LS=2,DS=3,US=4,IS=5,qm=300,kr=301,zr=302,Mc=303,Ec=304,La=306,Sc=1e3,hn=1001,bc=1002,Ut=1003,td=1004,sl=1005,en=1006,NS=1007,Is=1008,_i=1009,OS=1010,FS=1011,mu=1012,$m=1013,ui=1014,fi=1015,Ns=1016,Ym=1017,Km=1018,Gi=1020,BS=1021,pn=1023,HS=1024,kS=1025,Vi=1026,Gr=1027,zS=1028,Zm=1029,GS=1030,Jm=1031,Qm=1033,ol=33776,al=33777,ll=33778,cl=33779,nd=35840,id=35841,rd=35842,sd=35843,VS=36196,od=37492,ad=37496,ld=37808,cd=37809,ud=37810,fd=37811,dd=37812,hd=37813,pd=37814,md=37815,gd=37816,_d=37817,vd=37818,xd=37819,yd=37820,Md=37821,ul=36492,WS=36283,Ed=36284,Sd=36285,bd=36286,eg=3e3,Wi=3001,XS=3200,jS=3201,qS=0,$S=1,Xi="",Ge="srgb",Rn="srgb-linear",tg="display-p3",fl=7680,YS=519,KS=512,ZS=513,JS=514,QS=515,eb=516,tb=517,nb=518,ib=519,Td=35044,Ad="300 es",Tc=1035,kn=2e3,fa=2001;class Zi{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dl=Math.PI/180,Ac=180/Math.PI;function Ks(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tt[t&255]+Tt[t>>8&255]+Tt[t>>16&255]+Tt[t>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[n&63|128]+Tt[n>>8&255]+"-"+Tt[n>>16&255]+Tt[n>>24&255]+Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]).toLowerCase()}function It(t,e,n){return Math.max(e,Math.min(n,t))}function rb(t,e){return(t%e+e)%e}function hl(t,e,n){return(1-n)*t+n*e}function wd(t){return(t&t-1)===0&&t!==0}function wc(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function go(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Wt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class Xe{constructor(e=0,n=0){Xe.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,n,i,r,s,o,a,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],p=i[5],g=i[8],x=r[0],m=r[3],d=r[6],_=r[1],v=r[4],y=r[7],S=r[2],R=r[5],w=r[8];return s[0]=o*x+a*_+l*S,s[3]=o*m+a*v+l*R,s[6]=o*d+a*y+l*w,s[1]=c*x+u*_+f*S,s[4]=c*m+u*v+f*R,s[7]=c*d+u*y+f*w,s[2]=h*x+p*_+g*S,s[5]=h*m+p*v+g*R,s[8]=h*d+p*y+g*w,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,p=c*s-o*l,g=n*f+i*h+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=f*x,e[1]=(r*c-u*i)*x,e[2]=(a*i-r*o)*x,e[3]=h*x,e[4]=(u*n-r*l)*x,e[5]=(r*s-a*n)*x,e[6]=p*x,e[7]=(i*l-c*n)*x,e[8]=(o*n-i*s)*x,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(pl.makeScale(e,n)),this}rotate(e){return this.premultiply(pl.makeRotation(-e)),this}translate(e,n){return this.premultiply(pl.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const pl=new Ve;function ng(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function da(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}const Rd={};function Es(t){t in Rd||(Rd[t]=!0,console.warn(t))}function Ur(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ml(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const sb=new Ve().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),ob=new Ve().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function ab(t){return t.convertSRGBToLinear().applyMatrix3(ob)}function lb(t){return t.applyMatrix3(sb).convertLinearToSRGB()}const cb={[Rn]:t=>t,[Ge]:t=>t.convertSRGBToLinear(),[tg]:ab},ub={[Rn]:t=>t,[Ge]:t=>t.convertLinearToSRGB(),[tg]:lb},on={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(t){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!t},get workingColorSpace(){return Rn},set workingColorSpace(t){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=cb[e],r=ub[n];if(i===void 0||r===void 0)throw new Error(`Unsupported color space conversion, "${e}" to "${n}".`);return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)}};let ir;class ig{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ir===void 0&&(ir=da("canvas")),ir.width=e.width,ir.height=e.height;const i=ir.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ir}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=da("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ur(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ur(n[i]/255)*255):n[i]=Ur(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let fb=0;class rg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fb++}),this.uuid=Ks(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(gl(r[o].image)):s.push(gl(r[o]))}else s=gl(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function gl(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?ig.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let db=0;class Kt extends Zi{constructor(e=Kt.DEFAULT_IMAGE,n=Kt.DEFAULT_MAPPING,i=hn,r=hn,s=en,o=Is,a=pn,l=_i,c=Kt.DEFAULT_ANISOTROPY,u=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:db++}),this.uuid=Ks(),this.name="",this.source=new rg(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Es("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===Wi?Ge:Xi),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==qm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Sc:e.x=e.x-Math.floor(e.x);break;case hn:e.x=e.x<0?0:1;break;case bc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Sc:e.y=e.y-Math.floor(e.y);break;case hn:e.y=e.y<0?0:1;break;case bc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Es("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ge?Wi:eg}set encoding(e){Es("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Wi?Ge:Xi}}Kt.DEFAULT_IMAGE=null;Kt.DEFAULT_MAPPING=qm;Kt.DEFAULT_ANISOTROPY=1;class bt{constructor(e=0,n=0,i=0,r=1){bt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],p=l[5],g=l[9],x=l[2],m=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const v=(c+1)/2,y=(p+1)/2,S=(d+1)/2,R=(u+h)/4,w=(f+x)/4,P=(g+m)/4;return v>y&&v>S?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=R/i,s=w/i):y>S?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=R/r,s=P/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=w/s,r=P/s),this.set(i,r,s,n),this}let _=Math.sqrt((m-g)*(m-g)+(f-x)*(f-x)+(h-u)*(h-u));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(f-x)/_,this.z=(h-u)/_,this.w=Math.acos((c+p+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qi extends Zi{constructor(e=1,n=1,i={}){super(),this.isWebGLRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new bt(0,0,e,n),this.scissorTest=!1,this.viewport=new bt(0,0,e,n);const r={width:e,height:n,depth:1};i.encoding!==void 0&&(Es("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Wi?Ge:Xi),this.texture=new Kt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.internalFormat=i.internalFormat!==void 0?i.internalFormat:null,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:en,this.depthBuffer=i.depthBuffer!==void 0?i.depthBuffer:!0,this.stencilBuffer=i.stencilBuffer!==void 0?i.stencilBuffer:!1,this.depthTexture=i.depthTexture!==void 0?i.depthTexture:null,this.samples=i.samples!==void 0?i.samples:0}setSize(e,n,i=1){(this.width!==e||this.height!==n||this.depth!==i)&&(this.width=e,this.height=n,this.depth=i,this.texture.image.width=e,this.texture.image.height=n,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new rg(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class sg extends Kt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hb extends Kt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Ut,this.minFilter=Ut,this.wrapR=hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $i{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const h=s[o+0],p=s[o+1],g=s[o+2],x=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f;return}if(a===1){e[n+0]=h,e[n+1]=p,e[n+2]=g,e[n+3]=x;return}if(f!==x||l!==h||c!==p||u!==g){let m=1-a;const d=l*h+c*p+u*g+f*x,_=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){const S=Math.sqrt(v),R=Math.atan2(S,d*_);m=Math.sin(m*R)/S,a=Math.sin(a*R)/S}const y=a*_;if(l=l*m+h*y,c=c*m+p*y,u=u*m+g*y,f=f*m+x*y,m===1-a){const S=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=S,c*=S,u*=S,f*=S}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],p=s[o+2],g=s[o+3];return e[n]=a*g+u*f+l*p-c*h,e[n+1]=l*g+u*h+c*f-a*p,e[n+2]=c*g+u*p+a*h-l*f,e[n+3]=u*g-a*f-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*p*g,this._y=c*p*f-h*u*g,this._z=c*u*g+h*p*f,this._w=c*u*f-h*p*g;break;case"YXZ":this._x=h*u*f+c*p*g,this._y=c*p*f-h*u*g,this._z=c*u*g-h*p*f,this._w=c*u*f+h*p*g;break;case"ZXY":this._x=h*u*f-c*p*g,this._y=c*p*f+h*u*g,this._z=c*u*g+h*p*f,this._w=c*u*f-h*p*g;break;case"ZYX":this._x=h*u*f-c*p*g,this._y=c*p*f+h*u*g,this._z=c*u*g-h*p*f,this._w=c*u*f+h*p*g;break;case"YZX":this._x=h*u*f+c*p*g,this._y=c*p*f+h*u*g,this._z=c*u*g-h*p*f,this._w=c*u*f-h*p*g;break;case"XZY":this._x=h*u*f-c*p*g,this._y=c*p*f-h*u*g,this._z=c*u*g+h*p*f,this._w=c*u*f+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+a+f;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>f){const p=2*Math.sqrt(1+i-a-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>f){const p=2*Math.sqrt(1+a-i-f);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),f=Math.sin((1-n)*u)/c,h=Math.sin(n*u)/c;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=Math.random(),n=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(n*Math.cos(r),i*Math.sin(s),i*Math.cos(s),n*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(e=0,n=0,i=0){X.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Cd.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Cd.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=l*n+o*r-a*i,u=l*i+a*n-s*r,f=l*r+s*i-o*n,h=-s*n-o*i-a*r;return this.x=c*l+h*-s+u*-a-f*-o,this.y=u*l+h*-o+f*-s-c*-a,this.z=f*l+h*-a+c*-o-u*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return _l.copy(this).projectOnVector(e),this.sub(_l)}reflect(e){return this.sub(_l.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(It(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,n=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(n),this.y=i*Math.sin(n),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _l=new X,Cd=new $i;class Zs{constructor(e=new X(1/0,1/0,1/0),n=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Dn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Dn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Dn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){if(e.updateWorldMatrix(!1,!1),e.boundingBox!==void 0)e.boundingBox===null&&e.computeBoundingBox(),rr.copy(e.boundingBox),rr.applyMatrix4(e.matrixWorld),this.union(rr);else{const r=e.geometry;if(r!==void 0)if(n&&r.attributes!==void 0&&r.attributes.position!==void 0){const s=r.attributes.position;for(let o=0,a=s.count;o<a;o++)Dn.fromBufferAttribute(s,o).applyMatrix4(e.matrixWorld),this.expandByPoint(Dn)}else r.boundingBox===null&&r.computeBoundingBox(),rr.copy(r.boundingBox),rr.applyMatrix4(e.matrixWorld),this.union(rr)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],n);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ts),_o.subVectors(this.max,ts),sr.subVectors(e.a,ts),or.subVectors(e.b,ts),ar.subVectors(e.c,ts),Qn.subVectors(or,sr),ei.subVectors(ar,or),Ri.subVectors(sr,ar);let n=[0,-Qn.z,Qn.y,0,-ei.z,ei.y,0,-Ri.z,Ri.y,Qn.z,0,-Qn.x,ei.z,0,-ei.x,Ri.z,0,-Ri.x,-Qn.y,Qn.x,0,-ei.y,ei.x,0,-Ri.y,Ri.x,0];return!vl(n,sr,or,ar,_o)||(n=[1,0,0,0,1,0,0,0,1],!vl(n,sr,or,ar,_o))?!1:(vo.crossVectors(Qn,ei),n=[vo.x,vo.y,vo.z],vl(n,sr,or,ar,_o))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ln=[new X,new X,new X,new X,new X,new X,new X,new X],Dn=new X,rr=new Zs,sr=new X,or=new X,ar=new X,Qn=new X,ei=new X,Ri=new X,ts=new X,_o=new X,vo=new X,Ci=new X;function vl(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Ci.fromArray(t,s);const a=r.x*Math.abs(Ci.x)+r.y*Math.abs(Ci.y)+r.z*Math.abs(Ci.z),l=e.dot(Ci),c=n.dot(Ci),u=i.dot(Ci);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const pb=new Zs,ns=new X,xl=new X;class Da{constructor(e=new X,n=-1){this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):pb.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ns.subVectors(e,this.center);const n=ns.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ns,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ns.copy(e.center).add(xl)),this.expandByPoint(ns.copy(e.center).sub(xl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Un=new X,yl=new X,xo=new X,ti=new X,Ml=new X,yo=new X,El=new X;class og{constructor(e=new X,n=new X(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Un)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Un.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Un.copy(this.origin).addScaledVector(this.direction,n),Un.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){yl.copy(e).add(n).multiplyScalar(.5),xo.copy(n).sub(e).normalize(),ti.copy(this.origin).sub(yl);const s=e.distanceTo(n)*.5,o=-this.direction.dot(xo),a=ti.dot(this.direction),l=-ti.dot(xo),c=ti.lengthSq(),u=Math.abs(1-o*o);let f,h,p,g;if(u>0)if(f=o*l-a,h=o*a-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const x=1/u;f*=x,h*=x,p=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(yl).addScaledVector(xo,h),p}intersectSphere(e,n){Un.subVectors(e.center,this.origin);const i=Un.dot(this.direction),r=Un.dot(Un)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Un)!==null}intersectTriangle(e,n,i,r,s){Ml.subVectors(n,e),yo.subVectors(i,e),El.crossVectors(Ml,yo);let o=this.direction.dot(El),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ti.subVectors(this.origin,e);const l=a*this.direction.dot(yo.crossVectors(ti,yo));if(l<0)return null;const c=a*this.direction.dot(Ml.cross(ti));if(c<0||l+c>o)return null;const u=-a*ti.dot(El);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt{constructor(e,n,i,r,s,o,a,l,c,u,f,h,p,g,x,m){Mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,h,p,g,x,m)}set(e,n,i,r,s,o,a,l,c,u,f,h,p,g,x,m){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=h,d[3]=p,d[7]=g,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/lr.setFromMatrixColumn(e,0).length(),s=1/lr.setFromMatrixColumn(e,1).length(),o=1/lr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=o*u,p=o*f,g=a*u,x=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=p+g*c,n[5]=h-x*c,n[9]=-a*l,n[2]=x-h*c,n[6]=g+p*c,n[10]=o*l}else if(e.order==="YXZ"){const h=l*u,p=l*f,g=c*u,x=c*f;n[0]=h+x*a,n[4]=g*a-p,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=p*a-g,n[6]=x+h*a,n[10]=o*l}else if(e.order==="ZXY"){const h=l*u,p=l*f,g=c*u,x=c*f;n[0]=h-x*a,n[4]=-o*f,n[8]=g+p*a,n[1]=p+g*a,n[5]=o*u,n[9]=x-h*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const h=o*u,p=o*f,g=a*u,x=a*f;n[0]=l*u,n[4]=g*c-p,n[8]=h*c+x,n[1]=l*f,n[5]=x*c+h,n[9]=p*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=x-h*f,n[8]=g*f+p,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=p*f+g,n[10]=h-x*f}else if(e.order==="XZY"){const h=o*l,p=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+x,n[5]=o*u,n[9]=p*f-g,n[2]=g*f-p,n[6]=a*u,n[10]=x*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mb,e,gb)}lookAt(e,n,i){const r=this.elements;return Xt.subVectors(e,n),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),ni.crossVectors(i,Xt),ni.lengthSq()===0&&(Math.abs(i.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),ni.crossVectors(i,Xt)),ni.normalize(),Mo.crossVectors(Xt,ni),r[0]=ni.x,r[4]=Mo.x,r[8]=Xt.x,r[1]=ni.y,r[5]=Mo.y,r[9]=Xt.y,r[2]=ni.z,r[6]=Mo.z,r[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],p=i[13],g=i[2],x=i[6],m=i[10],d=i[14],_=i[3],v=i[7],y=i[11],S=i[15],R=r[0],w=r[4],P=r[8],M=r[12],T=r[1],F=r[5],H=r[9],N=r[13],U=r[2],B=r[6],K=r[10],q=r[14],Y=r[3],ce=r[7],de=r[11],V=r[15];return s[0]=o*R+a*T+l*U+c*Y,s[4]=o*w+a*F+l*B+c*ce,s[8]=o*P+a*H+l*K+c*de,s[12]=o*M+a*N+l*q+c*V,s[1]=u*R+f*T+h*U+p*Y,s[5]=u*w+f*F+h*B+p*ce,s[9]=u*P+f*H+h*K+p*de,s[13]=u*M+f*N+h*q+p*V,s[2]=g*R+x*T+m*U+d*Y,s[6]=g*w+x*F+m*B+d*ce,s[10]=g*P+x*H+m*K+d*de,s[14]=g*M+x*N+m*q+d*V,s[3]=_*R+v*T+y*U+S*Y,s[7]=_*w+v*F+y*B+S*ce,s[11]=_*P+v*H+y*K+S*de,s[15]=_*M+v*N+y*q+S*V,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],p=e[14],g=e[3],x=e[7],m=e[11],d=e[15];return g*(+s*l*f-r*c*f-s*a*h+i*c*h+r*a*p-i*l*p)+x*(+n*l*p-n*c*h+s*o*h-r*o*p+r*c*u-s*l*u)+m*(+n*c*f-n*a*p-s*o*f+i*o*p+s*a*u-i*c*u)+d*(-r*a*u-n*l*f+n*a*h+r*o*f-i*o*h+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],p=e[11],g=e[12],x=e[13],m=e[14],d=e[15],_=f*m*c-x*h*c+x*l*p-a*m*p-f*l*d+a*h*d,v=g*h*c-u*m*c-g*l*p+o*m*p+u*l*d-o*h*d,y=u*x*c-g*f*c+g*a*p-o*x*p-u*a*d+o*f*d,S=g*f*l-u*x*l-g*a*h+o*x*h+u*a*m-o*f*m,R=n*_+i*v+r*y+s*S;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/R;return e[0]=_*w,e[1]=(x*h*s-f*m*s-x*r*p+i*m*p+f*r*d-i*h*d)*w,e[2]=(a*m*s-x*l*s+x*r*c-i*m*c-a*r*d+i*l*d)*w,e[3]=(f*l*s-a*h*s-f*r*c+i*h*c+a*r*p-i*l*p)*w,e[4]=v*w,e[5]=(u*m*s-g*h*s+g*r*p-n*m*p-u*r*d+n*h*d)*w,e[6]=(g*l*s-o*m*s-g*r*c+n*m*c+o*r*d-n*l*d)*w,e[7]=(o*h*s-u*l*s+u*r*c-n*h*c-o*r*p+n*l*p)*w,e[8]=y*w,e[9]=(g*f*s-u*x*s-g*i*p+n*x*p+u*i*d-n*f*d)*w,e[10]=(o*x*s-g*a*s+g*i*c-n*x*c-o*i*d+n*a*d)*w,e[11]=(u*a*s-o*f*s-u*i*c+n*f*c+o*i*p-n*a*p)*w,e[12]=S*w,e[13]=(u*x*r-g*f*r+g*i*h-n*x*h-u*i*m+n*f*m)*w,e[14]=(g*a*r-o*x*r-g*i*l+n*x*l+o*i*m-n*a*m)*w,e[15]=(o*f*r-u*a*r+u*i*l-n*f*l-o*i*h+n*a*h)*w,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,h=s*c,p=s*u,g=s*f,x=o*u,m=o*f,d=a*f,_=l*c,v=l*u,y=l*f,S=i.x,R=i.y,w=i.z;return r[0]=(1-(x+d))*S,r[1]=(p+y)*S,r[2]=(g-v)*S,r[3]=0,r[4]=(p-y)*R,r[5]=(1-(h+d))*R,r[6]=(m+_)*R,r[7]=0,r[8]=(g+v)*w,r[9]=(m-_)*w,r[10]=(1-(h+x))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=lr.set(r[0],r[1],r[2]).length();const o=lr.set(r[4],r[5],r[6]).length(),a=lr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],an.copy(this);const c=1/s,u=1/o,f=1/a;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=f,an.elements[9]*=f,an.elements[10]*=f,n.setFromRotationMatrix(an),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=kn){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),f=(n+e)/(n-e),h=(i+r)/(i-r);let p,g;if(a===kn)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===fa)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=kn){const l=this.elements,c=1/(n-e),u=1/(i-r),f=1/(o-s),h=(n+e)*c,p=(i+r)*u;let g,x;if(a===kn)g=(o+s)*f,x=-2*f;else if(a===fa)g=s*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const lr=new X,an=new Mt,mb=new X(0,0,0),gb=new X(1,1,1),ni=new X,Mo=new X,Xt=new X,Pd=new Mt,Ld=new $i;class Ua{constructor(e=0,n=0,i=0,r=Ua.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(It(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-It(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(It(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Pd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pd,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Ld.setFromEuler(this),this.setFromQuaternion(Ld,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ua.DEFAULT_ORDER="XYZ";class ag{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _b=0;const Dd=new X,cr=new $i,In=new Mt,Eo=new X,is=new X,vb=new X,xb=new $i,Ud=new X(1,0,0),Id=new X(0,1,0),Nd=new X(0,0,1),yb={type:"added"},Od={type:"removed"};class zt extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_b++}),this.uuid=Ks(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=zt.DEFAULT_UP.clone();const e=new X,n=new Ua,i=new $i,r=new X(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Mt},normalMatrix:{value:new Ve}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=zt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new ag,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return cr.setFromAxisAngle(e,n),this.quaternion.multiply(cr),this}rotateOnWorldAxis(e,n){return cr.setFromAxisAngle(e,n),this.quaternion.premultiply(cr),this}rotateX(e){return this.rotateOnAxis(Ud,e)}rotateY(e){return this.rotateOnAxis(Id,e)}rotateZ(e){return this.rotateOnAxis(Nd,e)}translateOnAxis(e,n){return Dd.copy(e).applyQuaternion(this.quaternion),this.position.add(Dd.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Ud,e)}translateY(e){return this.translateOnAxis(Id,e)}translateZ(e){return this.translateOnAxis(Nd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Eo.copy(e):Eo.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(is,Eo,this.up):In.lookAt(Eo,is,this.up),this.quaternion.setFromRotationMatrix(In),r&&(In.extractRotation(r.matrixWorld),cr.setFromRotationMatrix(In),this.quaternion.premultiply(cr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(yb)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Od)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const n=this.children[e];n.parent=null,n.dispatchEvent(Od)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n){let i=[];this[e]===n&&i.push(this);for(let r=0,s=this.children.length;r<s;r++){const o=this.children[r].getObjectsByProperty(e,n);o.length>0&&(i=i.concat(o))}return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,e,vb),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,xb,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++){const s=n[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations,this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}zt.DEFAULT_UP=new X(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new X,Nn=new X,Sl=new X,On=new X,ur=new X,fr=new X,Fd=new X,bl=new X,Tl=new X,Al=new X;let So=!1;class un{constructor(e=new X,n=new X,i=new X){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),ln.subVectors(e,n),r.cross(ln);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){ln.subVectors(r,n),Nn.subVectors(i,n),Sl.subVectors(e,n);const o=ln.dot(ln),a=ln.dot(Nn),l=ln.dot(Sl),c=Nn.dot(Nn),u=Nn.dot(Sl),f=o*c-a*a;if(f===0)return s.set(-2,-1,-1);const h=1/f,p=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-p-g,g,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,On),On.x>=0&&On.y>=0&&On.x+On.y<=1}static getUV(e,n,i,r,s,o,a,l){return So===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),So=!0),this.getInterpolation(e,n,i,r,s,o,a,l)}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,On),l.setScalar(0),l.addScaledVector(s,On.x),l.addScaledVector(o,On.y),l.addScaledVector(a,On.z),l}static isFrontFacing(e,n,i,r){return ln.subVectors(i,n),Nn.subVectors(e,n),ln.cross(Nn).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Nn.subVectors(this.a,this.b),ln.cross(Nn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return un.getBarycoord(e,this.a,this.b,this.c,n)}getUV(e,n,i,r,s){return So===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),So=!0),un.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}getInterpolation(e,n,i,r,s){return un.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;ur.subVectors(r,i),fr.subVectors(s,i),bl.subVectors(e,i);const l=ur.dot(bl),c=fr.dot(bl);if(l<=0&&c<=0)return n.copy(i);Tl.subVectors(e,r);const u=ur.dot(Tl),f=fr.dot(Tl);if(u>=0&&f<=u)return n.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(ur,o);Al.subVectors(e,s);const p=ur.dot(Al),g=fr.dot(Al);if(g>=0&&p<=g)return n.copy(s);const x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(fr,a);const m=u*g-p*f;if(m<=0&&f-u>=0&&p-g>=0)return Fd.subVectors(s,r),a=(f-u)/(f-u+(p-g)),n.copy(r).addScaledVector(Fd,a);const d=1/(m+x+h);return o=x*d,a=h*d,n.copy(i).addScaledVector(ur,o).addScaledVector(fr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let Mb=0;class Js extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mb++}),this.uuid=Ks(),this.name="",this.type="Material",this.blending=Dr,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wm,this.blendDst=Xm,this.blendEquation=yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=yc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=YS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fl,this.stencilZFail=fl,this.stencilZPass=fl,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Dr&&(i.blending=this.blending),this.side!==xi&&(i.side=this.side),this.vertexColors&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=this.transparent),i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.stencilWrite=this.stencilWrite,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(i.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(i.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(i.wireframe=this.wireframe),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=this.flatShading),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const lg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cn={h:0,s:0,l:0},bo={h:0,s:0,l:0};function wl(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Qe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ge){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,on.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=on.workingColorSpace){return this.r=e,this.g=n,this.b=i,on.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=on.workingColorSpace){if(e=rb(e,1),n=It(n,0,1),i=It(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=wl(o,s,e+1/3),this.g=wl(o,s,e),this.b=wl(o,s,e-1/3)}return on.toWorkingColorSpace(this,r),this}setStyle(e,n=Ge){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ge){const i=lg[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ur(e.r),this.g=Ur(e.g),this.b=Ur(e.b),this}copyLinearToSRGB(e){return this.r=ml(e.r),this.g=ml(e.g),this.b=ml(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ge){return on.fromWorkingColorSpace(At.copy(this),e),Math.round(It(At.r*255,0,255))*65536+Math.round(It(At.g*255,0,255))*256+Math.round(It(At.b*255,0,255))}getHexString(e=Ge){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=on.workingColorSpace){on.fromWorkingColorSpace(At.copy(this),n);const i=At.r,r=At.g,s=At.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=on.workingColorSpace){return on.fromWorkingColorSpace(At.copy(this),n),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=Ge){on.fromWorkingColorSpace(At.copy(this),e);const n=At.r,i=At.g,r=At.b;return e!==Ge?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(cn),cn.h+=e,cn.s+=n,cn.l+=i,this.setHSL(cn.h,cn.s,cn.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(cn),e.getHSL(bo);const i=hl(cn.h,bo.h,n),r=hl(cn.s,bo.s,n),s=hl(cn.l,bo.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new Qe;Qe.NAMES=lg;class cg extends Js{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=jm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dt=new X,To=new Xe;class rn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Td,this.updateRange={offset:0,count:-1},this.gpuType=fi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)To.fromBufferAttribute(this,n),To.applyMatrix3(e),this.setXY(n,To.x,To.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.applyMatrix3(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.applyMatrix4(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.applyNormalMatrix(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)dt.fromBufferAttribute(this,n),dt.transformDirection(e),this.setXYZ(n,dt.x,dt.y,dt.z);return this}set(e,n=0){return this.array.set(e,n),this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=go(n,this.array)),n}setX(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=go(n,this.array)),n}setY(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=go(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=go(n,this.array)),n}setW(e,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Wt(n,this.array),i=Wt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Wt(n,this.array),i=Wt(i,this.array),r=Wt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Wt(n,this.array),i=Wt(i,this.array),r=Wt(r,this.array),s=Wt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Td&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}class ug extends rn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class fg extends rn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Vn extends rn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let Eb=0;const Jt=new Mt,Rl=new zt,dr=new X,jt=new Zs,rs=new Zs,yt=new X;class $n extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Eb++}),this.uuid=Ks(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ng(e)?fg:ug)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,n,i){return Jt.makeTranslation(e,n,i),this.applyMatrix4(Jt),this}scale(e,n,i){return Jt.makeScale(e,n,i),this.applyMatrix4(Jt),this}lookAt(e){return Rl.lookAt(e),Rl.updateMatrix(),this.applyMatrix4(Rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(dr).negate(),this.translate(dr.x,dr.y,dr.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Vn(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];jt.setFromBufferAttribute(s),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Da);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new X,1/0);return}if(e){const i=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];rs.setFromBufferAttribute(a),this.morphTargetsRelative?(yt.addVectors(jt.min,rs.min),jt.expandByPoint(yt),yt.addVectors(jt.max,rs.max),jt.expandByPoint(yt)):(jt.expandByPoint(rs.min),jt.expandByPoint(rs.max))}jt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)yt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(yt));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)yt.fromBufferAttribute(a,c),l&&(dr.fromBufferAttribute(e,c),yt.add(dr)),r=Math.max(r,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=n.position.array,s=n.normal.array,o=n.uv.array,a=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let T=0;T<a;T++)c[T]=new X,u[T]=new X;const f=new X,h=new X,p=new X,g=new Xe,x=new Xe,m=new Xe,d=new X,_=new X;function v(T,F,H){f.fromArray(r,T*3),h.fromArray(r,F*3),p.fromArray(r,H*3),g.fromArray(o,T*2),x.fromArray(o,F*2),m.fromArray(o,H*2),h.sub(f),p.sub(f),x.sub(g),m.sub(g);const N=1/(x.x*m.y-m.x*x.y);isFinite(N)&&(d.copy(h).multiplyScalar(m.y).addScaledVector(p,-x.y).multiplyScalar(N),_.copy(p).multiplyScalar(x.x).addScaledVector(h,-m.x).multiplyScalar(N),c[T].add(d),c[F].add(d),c[H].add(d),u[T].add(_),u[F].add(_),u[H].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:i.length}]);for(let T=0,F=y.length;T<F;++T){const H=y[T],N=H.start,U=H.count;for(let B=N,K=N+U;B<K;B+=3)v(i[B+0],i[B+1],i[B+2])}const S=new X,R=new X,w=new X,P=new X;function M(T){w.fromArray(s,T*3),P.copy(w);const F=c[T];S.copy(F),S.sub(w.multiplyScalar(w.dot(F))).normalize(),R.crossVectors(P,F);const N=R.dot(u[T])<0?-1:1;l[T*4]=S.x,l[T*4+1]=S.y,l[T*4+2]=S.z,l[T*4+3]=N}for(let T=0,F=y.length;T<F;++T){const H=y[T],N=H.start,U=H.count;for(let B=N,K=N+U;B<K;B+=3)M(i[B+0]),M(i[B+1]),M(i[B+2])}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new rn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const r=new X,s=new X,o=new X,a=new X,l=new X,c=new X,u=new X,f=new X;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),x=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,x),o.fromBufferAttribute(n,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=n.count;h<p;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)yt.fromBufferAttribute(e,n),yt.normalize(),e.setXYZ(n,yt.x,yt.y,yt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u);let p=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*u;for(let d=0;d<u;d++)h[g++]=c[p++]}return new rn(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new $n,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const h=c[u],p=e(h,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,p=f.length;h<p;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bd=new Mt,Pi=new og,Ao=new Da,Hd=new X,hr=new X,pr=new X,mr=new X,Cl=new X,wo=new X,Ro=new Xe,Co=new Xe,Po=new Xe,kd=new X,zd=new X,Gd=new X,Lo=new X,Do=new X;class di extends zt{constructor(e=new $n,n=new cg){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){wo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(Cl.fromBufferAttribute(f,e),o?wo.addScaledVector(Cl,u):wo.addScaledVector(Cl.sub(n),u))}n.add(wo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ao.copy(i.boundingSphere),Ao.applyMatrix4(s),Pi.copy(e.ray).recast(e.near),!(Ao.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Ao,Hd)===null||Pi.origin.distanceToSquared(Hd)>(e.far-e.near)**2))&&(Bd.copy(s).invert(),Pi.copy(e.ray).applyMatrix4(Bd),!(i.boundingBox!==null&&Pi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Pi)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){const m=h[g],d=o[m.materialIndex],_=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,S=v;y<S;y+=3){const R=a.getX(y),w=a.getX(y+1),P=a.getX(y+2);r=Uo(this,d,e,i,c,u,f,R,w,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){const _=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);r=Uo(this,o,e,i,c,u,f,_,v,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){const m=h[g],d=o[m.materialIndex],_=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,S=v;y<S;y+=3){const R=y,w=y+1,P=y+2;r=Uo(this,d,e,i,c,u,f,R,w,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){const _=m,v=m+1,y=m+2;r=Uo(this,o,e,i,c,u,f,_,v,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function Sb(t,e,n,i,r,s,o,a){let l;if(e.side===kt?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===xi,a),l===null)return null;Do.copy(a),Do.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Do);return c<n.near||c>n.far?null:{distance:c,point:Do.clone(),object:t}}function Uo(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,hr),t.getVertexPosition(l,pr),t.getVertexPosition(c,mr);const u=Sb(t,e,n,i,hr,pr,mr,Lo);if(u){r&&(Ro.fromBufferAttribute(r,a),Co.fromBufferAttribute(r,l),Po.fromBufferAttribute(r,c),u.uv=un.getInterpolation(Lo,hr,pr,mr,Ro,Co,Po,new Xe)),s&&(Ro.fromBufferAttribute(s,a),Co.fromBufferAttribute(s,l),Po.fromBufferAttribute(s,c),u.uv1=un.getInterpolation(Lo,hr,pr,mr,Ro,Co,Po,new Xe),u.uv2=u.uv1),o&&(kd.fromBufferAttribute(o,a),zd.fromBufferAttribute(o,l),Gd.fromBufferAttribute(o,c),u.normal=un.getInterpolation(Lo,hr,pr,mr,kd,zd,Gd,new X),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new X,materialIndex:0};un.getNormal(hr,pr,mr,f.normal),u.face=f}return u}class Qs extends $n{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let h=0,p=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Vn(c,3)),this.setAttribute("normal",new Vn(u,3)),this.setAttribute("uv",new Vn(f,2));function g(x,m,d,_,v,y,S,R,w,P,M){const T=y/w,F=S/P,H=y/2,N=S/2,U=R/2,B=w+1,K=P+1;let q=0,Y=0;const ce=new X;for(let de=0;de<K;de++){const V=de*F-N;for(let Q=0;Q<B;Q++){const me=Q*T-H;ce[x]=me*_,ce[m]=V*v,ce[d]=U,c.push(ce.x,ce.y,ce.z),ce[x]=0,ce[m]=0,ce[d]=R>0?1:-1,u.push(ce.x,ce.y,ce.z),f.push(Q/w),f.push(1-de/P),q+=1}}for(let de=0;de<P;de++)for(let V=0;V<w;V++){const Q=h+V+B*de,me=h+V+B*(de+1),_e=h+(V+1)+B*(de+1),ye=h+(V+1)+B*de;l.push(Q,me,ye),l.push(me,_e,ye),Y+=6}a.addGroup(p,Y,M),p+=Y,h+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Vr(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Dt(t){const e={};for(let n=0;n<t.length;n++){const i=Vr(t[n]);for(const r in i)e[r]=i[r]}return e}function bb(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function dg(t){return t.getRenderTarget()===null?t.outputColorSpace:Rn}const Tb={clone:Vr,merge:Dt};var Ab=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yi extends Js{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ab,this.fragmentShader=wb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Vr(e.uniforms),this.uniformsGroups=bb(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class hg extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=kn}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(-n[8],-n[9],-n[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class $t extends hg{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Ac*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(dl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ac*2*Math.atan(Math.tan(dl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(dl*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const gr=-90,_r=1;class Rb extends zt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null;const r=new $t(gr,_r,e,n);r.layers=this.layers,this.add(r);const s=new $t(gr,_r,e,n);s.layers=this.layers,this.add(s);const o=new $t(gr,_r,e,n);o.layers=this.layers,this.add(o);const a=new $t(gr,_r,e,n);a.layers=this.layers,this.add(a);const l=new $t(gr,_r,e,n);l.layers=this.layers,this.add(l);const c=new $t(gr,_r,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===kn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===fa)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const i=this.renderTarget;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,o,a,l,c]=this.children,u=e.getRenderTarget(),f=e.toneMapping,h=e.xr.enabled;e.toneMapping=Gn,e.xr.enabled=!1;const p=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0),e.render(n,r),e.setRenderTarget(i,1),e.render(n,s),e.setRenderTarget(i,2),e.render(n,o),e.setRenderTarget(i,3),e.render(n,a),e.setRenderTarget(i,4),e.render(n,l),i.texture.generateMipmaps=p,e.setRenderTarget(i,5),e.render(n,c),e.setRenderTarget(u),e.toneMapping=f,e.xr.enabled=h,i.texture.needsPMREMUpdate=!0}}class pg extends Kt{constructor(e,n,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:kr,super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Cb extends qi{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];n.encoding!==void 0&&(Es("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Wi?Ge:Xi),this.texture=new pg(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:en}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Qs(5,5,5),s=new Yi({name:"CubemapFromEquirect",uniforms:Vr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:kt,blending:gi});s.uniforms.tEquirect.value=n;const o=new di(r,s),a=n.minFilter;return n.minFilter===Is&&(n.minFilter=en),new Rb(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const Pl=new X,Pb=new X,Lb=new Ve;class Di{constructor(e=new X(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Pl.subVectors(i,n).cross(Pb.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Pl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||Lb.getNormalMatrix(e),r=this.coplanarPoint(Pl).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Da,Io=new X;class mg{constructor(e=new Di,n=new Di,i=new Di,r=new Di,s=new Di,o=new Di){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=kn){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],p=r[8],g=r[9],x=r[10],m=r[11],d=r[12],_=r[13],v=r[14],y=r[15];if(i[0].setComponents(l-s,h-c,m-p,y-d).normalize(),i[1].setComponents(l+s,h+c,m+p,y+d).normalize(),i[2].setComponents(l+o,h+u,m+g,y+_).normalize(),i[3].setComponents(l-o,h-u,m-g,y-_).normalize(),i[4].setComponents(l-a,h-f,m-x,y-v).normalize(),n===kn)i[5].setComponents(l+a,h+f,m+x,y+v).normalize();else if(n===fa)i[5].setComponents(a,f,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Li.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){return Li.center.set(0,0,0),Li.radius=.7071067811865476,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Io.x=r.normal.x>0?e.max.x:e.min.x,Io.y=r.normal.y>0?e.max.y:e.min.y,Io.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Io)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function gg(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function Db(t,e){const n=e.isWebGL2,i=new WeakMap;function r(c,u){const f=c.array,h=c.usage,p=t.createBuffer();t.bindBuffer(u,p),t.bufferData(u,f,h),c.onUploadCallback();let g;if(f instanceof Float32Array)g=t.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(n)g=t.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=t.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=t.SHORT;else if(f instanceof Uint32Array)g=t.UNSIGNED_INT;else if(f instanceof Int32Array)g=t.INT;else if(f instanceof Int8Array)g=t.BYTE;else if(f instanceof Uint8Array)g=t.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:p,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version}}function s(c,u,f){const h=u.array,p=u.updateRange;t.bindBuffer(f,c),p.count===-1?t.bufferSubData(f,0,h):(n?t.bufferSubData(f,p.offset*h.BYTES_PER_ELEMENT,h,p.offset,p.count):t.bufferSubData(f,p.offset*h.BYTES_PER_ELEMENT,h.subarray(p.offset,p.offset+p.count)),p.count=-1),u.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(t.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const h=i.get(c);(!h||h.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=i.get(c);f===void 0?i.set(c,r(c,u)):f.version<c.version&&(s(f.buffer,c,u),f.version=c.version)}return{get:o,remove:a,update:l}}class gu extends $n{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=n/l,p=[],g=[],x=[],m=[];for(let d=0;d<u;d++){const _=d*h-o;for(let v=0;v<c;v++){const y=v*f-s;g.push(y,-_,0),x.push(0,0,1),m.push(v/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let _=0;_<a;_++){const v=_+c*d,y=_+c*(d+1),S=_+1+c*(d+1),R=_+1+c*d;p.push(v,y,R),p.push(y,S,R)}this.setIndex(p),this.setAttribute("position",new Vn(g,3)),this.setAttribute("normal",new Vn(x,3)),this.setAttribute("uv",new Vn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gu(e.width,e.height,e.widthSegments,e.heightSegments)}}var Ub=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ib=`#ifdef USE_ALPHAHASH
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
#endif`,Nb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ob=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fb=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Bb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hb=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,kb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Gb=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vb=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Wb=`#ifdef USE_IRIDESCENCE
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
#endif`,Xb=`#ifdef USE_BUMPMAP
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
#endif`,jb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,qb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$b=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Kb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Zb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Qb=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,eT=`#define PI 3.141592653589793
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
} // validated`,tT=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,nT=`vec3 transformedNormal = objectNormal;
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
#endif`,iT=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rT=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sT=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,oT=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,aT="gl_FragColor = linearToOutputTexel( gl_FragColor );",lT=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cT=`#ifdef USE_ENVMAP
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
#endif`,uT=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fT=`#ifdef USE_ENVMAP
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
#endif`,dT=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hT=`#ifdef USE_ENVMAP
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
#endif`,pT=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mT=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gT=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_T=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vT=`#ifdef USE_GRADIENTMAP
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
}`,xT=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,yT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,MT=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ET=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ST=`uniform bool receiveShadow;
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
#endif`,bT=`#ifdef USE_ENVMAP
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
#endif`,TT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,AT=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,RT=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,CT=`PhysicalMaterial material;
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
#endif`,PT=`struct PhysicalMaterial {
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
}`,LT=`
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
#endif`,DT=`#if defined( RE_IndirectDiffuse )
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
#endif`,UT=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,IT=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,NT=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,OT=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,FT=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,BT=`#ifdef USE_MAP
	diffuseColor *= texture2D( map, vMapUv );
#endif`,HT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zT=`#if defined( USE_POINTS_UV )
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
#endif`,GT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,VT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,WT=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,XT=`#ifdef USE_MORPHNORMALS
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
#endif`,jT=`#ifdef USE_MORPHTARGETS
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
#endif`,qT=`#ifdef USE_MORPHTARGETS
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
#endif`,$T=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 geometryNormal = normal;`,YT=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,KT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,QT=`#ifdef USE_NORMALMAP
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
#endif`,eA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,tA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sA=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,oA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,aA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,uA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,mA=`float getShadowMask() {
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
}`,gA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_A=`#ifdef USE_SKINNING
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
#endif`,vA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xA=`#ifdef USE_SKINNING
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
#endif`,yA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,MA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,EA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,SA=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bA=`#ifdef USE_TRANSMISSION
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
#endif`,TA=`#ifdef USE_TRANSMISSION
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
#endif`,AA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,CA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const PA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,LA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,UA=`#ifdef ENVMAP_TYPE_CUBE
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
}`,IA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,NA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,OA=`#include <common>
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
}`,FA=`#if DEPTH_PACKING == 3200
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
}`,BA=`#define DISTANCE
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
}`,HA=`#define DISTANCE
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
}`,kA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,GA=`uniform float scale;
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
}`,VA=`uniform vec3 diffuse;
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
}`,WA=`#include <common>
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
}`,XA=`uniform vec3 diffuse;
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
}`,jA=`#define LAMBERT
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
}`,qA=`#define LAMBERT
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
}`,$A=`#define MATCAP
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
}`,YA=`#define MATCAP
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
}`,KA=`#define NORMAL
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
}`,ZA=`#define NORMAL
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
}`,JA=`#define PHONG
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
}`,QA=`#define PHONG
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
}`,ew=`#define STANDARD
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
}`,tw=`#define STANDARD
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
}`,nw=`#define TOON
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
}`,iw=`#define TOON
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
}`,rw=`uniform float size;
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
}`,sw=`uniform vec3 diffuse;
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
}`,ow=`#include <common>
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
}`,aw=`uniform vec3 color;
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
}`,lw=`uniform float rotation;
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
}`,cw=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:Ub,alphahash_pars_fragment:Ib,alphamap_fragment:Nb,alphamap_pars_fragment:Ob,alphatest_fragment:Fb,alphatest_pars_fragment:Bb,aomap_fragment:Hb,aomap_pars_fragment:kb,begin_vertex:zb,beginnormal_vertex:Gb,bsdfs:Vb,iridescence_fragment:Wb,bumpmap_pars_fragment:Xb,clipping_planes_fragment:jb,clipping_planes_pars_fragment:qb,clipping_planes_pars_vertex:$b,clipping_planes_vertex:Yb,color_fragment:Kb,color_pars_fragment:Zb,color_pars_vertex:Jb,color_vertex:Qb,common:eT,cube_uv_reflection_fragment:tT,defaultnormal_vertex:nT,displacementmap_pars_vertex:iT,displacementmap_vertex:rT,emissivemap_fragment:sT,emissivemap_pars_fragment:oT,colorspace_fragment:aT,colorspace_pars_fragment:lT,envmap_fragment:cT,envmap_common_pars_fragment:uT,envmap_pars_fragment:fT,envmap_pars_vertex:dT,envmap_physical_pars_fragment:bT,envmap_vertex:hT,fog_vertex:pT,fog_pars_vertex:mT,fog_fragment:gT,fog_pars_fragment:_T,gradientmap_pars_fragment:vT,lightmap_fragment:xT,lightmap_pars_fragment:yT,lights_lambert_fragment:MT,lights_lambert_pars_fragment:ET,lights_pars_begin:ST,lights_toon_fragment:TT,lights_toon_pars_fragment:AT,lights_phong_fragment:wT,lights_phong_pars_fragment:RT,lights_physical_fragment:CT,lights_physical_pars_fragment:PT,lights_fragment_begin:LT,lights_fragment_maps:DT,lights_fragment_end:UT,logdepthbuf_fragment:IT,logdepthbuf_pars_fragment:NT,logdepthbuf_pars_vertex:OT,logdepthbuf_vertex:FT,map_fragment:BT,map_pars_fragment:HT,map_particle_fragment:kT,map_particle_pars_fragment:zT,metalnessmap_fragment:GT,metalnessmap_pars_fragment:VT,morphcolor_vertex:WT,morphnormal_vertex:XT,morphtarget_pars_vertex:jT,morphtarget_vertex:qT,normal_fragment_begin:$T,normal_fragment_maps:YT,normal_pars_fragment:KT,normal_pars_vertex:ZT,normal_vertex:JT,normalmap_pars_fragment:QT,clearcoat_normal_fragment_begin:eA,clearcoat_normal_fragment_maps:tA,clearcoat_pars_fragment:nA,iridescence_pars_fragment:iA,opaque_fragment:rA,packing:sA,premultiplied_alpha_fragment:oA,project_vertex:aA,dithering_fragment:lA,dithering_pars_fragment:cA,roughnessmap_fragment:uA,roughnessmap_pars_fragment:fA,shadowmap_pars_fragment:dA,shadowmap_pars_vertex:hA,shadowmap_vertex:pA,shadowmask_pars_fragment:mA,skinbase_vertex:gA,skinning_pars_vertex:_A,skinning_vertex:vA,skinnormal_vertex:xA,specularmap_fragment:yA,specularmap_pars_fragment:MA,tonemapping_fragment:EA,tonemapping_pars_fragment:SA,transmission_fragment:bA,transmission_pars_fragment:TA,uv_pars_fragment:AA,uv_pars_vertex:wA,uv_vertex:RA,worldpos_vertex:CA,background_vert:PA,background_frag:LA,backgroundCube_vert:DA,backgroundCube_frag:UA,cube_vert:IA,cube_frag:NA,depth_vert:OA,depth_frag:FA,distanceRGBA_vert:BA,distanceRGBA_frag:HA,equirect_vert:kA,equirect_frag:zA,linedashed_vert:GA,linedashed_frag:VA,meshbasic_vert:WA,meshbasic_frag:XA,meshlambert_vert:jA,meshlambert_frag:qA,meshmatcap_vert:$A,meshmatcap_frag:YA,meshnormal_vert:KA,meshnormal_frag:ZA,meshphong_vert:JA,meshphong_frag:QA,meshphysical_vert:ew,meshphysical_frag:tw,meshtoon_vert:nw,meshtoon_frag:iw,points_vert:rw,points_frag:sw,shadow_vert:ow,shadow_frag:aw,sprite_vert:lw,sprite_frag:cw},ve={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},bn={basic:{uniforms:Dt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Dt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Qe(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Dt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Dt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Dt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Qe(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Dt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Dt([ve.points,ve.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Dt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Dt([ve.common,ve.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Dt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Dt([ve.sprite,ve.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Dt([ve.common,ve.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Dt([ve.lights,ve.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};bn.physical={uniforms:Dt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const No={r:0,b:0,g:0};function uw(t,e,n,i,r,s,o){const a=new Qe(0);let l=s===!0?0:1,c,u,f=null,h=0,p=null;function g(m,d){let _=!1,v=d.isScene===!0?d.background:null;switch(v&&v.isTexture&&(v=(d.backgroundBlurriness>0?n:e).get(v)),v===null?x(a,l):v&&v.isColor&&(x(v,1),_=!0),t.xr.getEnvironmentBlendMode()){case"opaque":_=!0;break;case"additive":i.buffers.color.setClear(0,0,0,1,o),_=!0;break;case"alpha-blend":i.buffers.color.setClear(0,0,0,0,o),_=!0;break}(t.autoClear||_)&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),v&&(v.isCubeTexture||v.mapping===La)?(u===void 0&&(u=new di(new Qs(1,1,1),new Yi({name:"BackgroundCubeMaterial",uniforms:Vr(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,w,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=v.colorSpace!==Ge,(f!==v||h!==v.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,f=v,h=v.version,p=t.toneMapping),u.layers.enableAll(),m.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new di(new gu(2,2),new Yi({name:"BackgroundMaterial",uniforms:Vr(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=v.colorSpace!==Ge,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||h!==v.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,f=v,h=v.version,p=t.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function x(m,d){m.getRGB(No,dg(t)),i.buffers.color.setClear(No.r,No.g,No.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(m,d=1){a.set(m),l=d,x(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,x(a,l)},render:g}}function fw(t,e,n,i){const r=t.getParameter(t.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=m(null);let c=l,u=!1;function f(U,B,K,q,Y){let ce=!1;if(o){const de=x(q,K,B);c!==de&&(c=de,p(c.object)),ce=d(U,q,K,Y),ce&&_(U,q,K,Y)}else{const de=B.wireframe===!0;(c.geometry!==q.id||c.program!==K.id||c.wireframe!==de)&&(c.geometry=q.id,c.program=K.id,c.wireframe=de,ce=!0)}Y!==null&&n.update(Y,t.ELEMENT_ARRAY_BUFFER),(ce||u)&&(u=!1,P(U,B,K,q),Y!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.get(Y).buffer))}function h(){return i.isWebGL2?t.createVertexArray():s.createVertexArrayOES()}function p(U){return i.isWebGL2?t.bindVertexArray(U):s.bindVertexArrayOES(U)}function g(U){return i.isWebGL2?t.deleteVertexArray(U):s.deleteVertexArrayOES(U)}function x(U,B,K){const q=K.wireframe===!0;let Y=a[U.id];Y===void 0&&(Y={},a[U.id]=Y);let ce=Y[B.id];ce===void 0&&(ce={},Y[B.id]=ce);let de=ce[q];return de===void 0&&(de=m(h()),ce[q]=de),de}function m(U){const B=[],K=[],q=[];for(let Y=0;Y<r;Y++)B[Y]=0,K[Y]=0,q[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:K,attributeDivisors:q,object:U,attributes:{},index:null}}function d(U,B,K,q){const Y=c.attributes,ce=B.attributes;let de=0;const V=K.getAttributes();for(const Q in V)if(V[Q].location>=0){const _e=Y[Q];let ye=ce[Q];if(ye===void 0&&(Q==="instanceMatrix"&&U.instanceMatrix&&(ye=U.instanceMatrix),Q==="instanceColor"&&U.instanceColor&&(ye=U.instanceColor)),_e===void 0||_e.attribute!==ye||ye&&_e.data!==ye.data)return!0;de++}return c.attributesNum!==de||c.index!==q}function _(U,B,K,q){const Y={},ce=B.attributes;let de=0;const V=K.getAttributes();for(const Q in V)if(V[Q].location>=0){let _e=ce[Q];_e===void 0&&(Q==="instanceMatrix"&&U.instanceMatrix&&(_e=U.instanceMatrix),Q==="instanceColor"&&U.instanceColor&&(_e=U.instanceColor));const ye={};ye.attribute=_e,_e&&_e.data&&(ye.data=_e.data),Y[Q]=ye,de++}c.attributes=Y,c.attributesNum=de,c.index=q}function v(){const U=c.newAttributes;for(let B=0,K=U.length;B<K;B++)U[B]=0}function y(U){S(U,0)}function S(U,B){const K=c.newAttributes,q=c.enabledAttributes,Y=c.attributeDivisors;K[U]=1,q[U]===0&&(t.enableVertexAttribArray(U),q[U]=1),Y[U]!==B&&((i.isWebGL2?t:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,B),Y[U]=B)}function R(){const U=c.newAttributes,B=c.enabledAttributes;for(let K=0,q=B.length;K<q;K++)B[K]!==U[K]&&(t.disableVertexAttribArray(K),B[K]=0)}function w(U,B,K,q,Y,ce,de){de===!0?t.vertexAttribIPointer(U,B,K,Y,ce):t.vertexAttribPointer(U,B,K,q,Y,ce)}function P(U,B,K,q){if(i.isWebGL2===!1&&(U.isInstancedMesh||q.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const Y=q.attributes,ce=K.getAttributes(),de=B.defaultAttributeValues;for(const V in ce){const Q=ce[V];if(Q.location>=0){let me=Y[V];if(me===void 0&&(V==="instanceMatrix"&&U.instanceMatrix&&(me=U.instanceMatrix),V==="instanceColor"&&U.instanceColor&&(me=U.instanceColor)),me!==void 0){const _e=me.normalized,ye=me.itemSize,we=n.get(me);if(we===void 0)continue;const j=we.buffer,oe=we.type,ue=we.bytesPerElement,Ee=i.isWebGL2===!0&&(oe===t.INT||oe===t.UNSIGNED_INT||me.gpuType===$m);if(me.isInterleavedBufferAttribute){const Ae=me.data,E=Ae.stride,D=me.offset;if(Ae.isInstancedInterleavedBuffer){for(let I=0;I<Q.locationSize;I++)S(Q.location+I,Ae.meshPerAttribute);U.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=Ae.meshPerAttribute*Ae.count)}else for(let I=0;I<Q.locationSize;I++)y(Q.location+I);t.bindBuffer(t.ARRAY_BUFFER,j);for(let I=0;I<Q.locationSize;I++)w(Q.location+I,ye/Q.locationSize,oe,_e,E*ue,(D+ye/Q.locationSize*I)*ue,Ee)}else{if(me.isInstancedBufferAttribute){for(let Ae=0;Ae<Q.locationSize;Ae++)S(Q.location+Ae,me.meshPerAttribute);U.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Ae=0;Ae<Q.locationSize;Ae++)y(Q.location+Ae);t.bindBuffer(t.ARRAY_BUFFER,j);for(let Ae=0;Ae<Q.locationSize;Ae++)w(Q.location+Ae,ye/Q.locationSize,oe,_e,ye*ue,ye/Q.locationSize*Ae*ue,Ee)}}else if(de!==void 0){const _e=de[V];if(_e!==void 0)switch(_e.length){case 2:t.vertexAttrib2fv(Q.location,_e);break;case 3:t.vertexAttrib3fv(Q.location,_e);break;case 4:t.vertexAttrib4fv(Q.location,_e);break;default:t.vertexAttrib1fv(Q.location,_e)}}}}R()}function M(){H();for(const U in a){const B=a[U];for(const K in B){const q=B[K];for(const Y in q)g(q[Y].object),delete q[Y];delete B[K]}delete a[U]}}function T(U){if(a[U.id]===void 0)return;const B=a[U.id];for(const K in B){const q=B[K];for(const Y in q)g(q[Y].object),delete q[Y];delete B[K]}delete a[U.id]}function F(U){for(const B in a){const K=a[B];if(K[U.id]===void 0)continue;const q=K[U.id];for(const Y in q)g(q[Y].object),delete q[Y];delete K[U.id]}}function H(){N(),u=!0,c!==l&&(c=l,p(c.object))}function N(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:H,resetDefaultState:N,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:F,initAttributes:v,enableAttribute:y,disableUnusedAttributes:R}}function dw(t,e,n,i){const r=i.isWebGL2;let s;function o(c){s=c}function a(c,u){t.drawArrays(s,c,u),n.update(u,s,1)}function l(c,u,f){if(f===0)return;let h,p;if(r)h=t,p="drawArraysInstanced";else if(h=e.get("ANGLE_instanced_arrays"),p="drawArraysInstancedANGLE",h===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}h[p](s,c,u,f),n.update(u,s,f)}this.setMode=o,this.render=a,this.renderInstances=l}function hw(t,e,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");i=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&t.constructor.name==="WebGL2RenderingContext";let a=n.precision!==void 0?n.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),u=n.logarithmicDepthBuffer===!0,f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),h=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),x=t.getParameter(t.MAX_VERTEX_ATTRIBS),m=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),d=t.getParameter(t.MAX_VARYING_VECTORS),_=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),v=h>0,y=o||e.has("OES_texture_float"),S=v&&y,R=o?t.getParameter(t.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:h,maxTextureSize:p,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:_,vertexTextures:v,floatFragmentTextures:y,floatVertexTextures:S,maxSamples:R}}function pw(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Di,a=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const p=f.length!==0||h||i!==0||r;return r=h,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,p){const g=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,d=t.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const _=s?0:i,v=_*4;let y=d.clippingState||null;l.value=y,y=u(g,h,v,p);for(let S=0;S!==v;++S)y[S]=n[S];d.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,p,g){const x=f!==null?f.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const d=p+x*4,_=h.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,y=p;v!==x;++v,y+=4)o.copy(f[v]).applyMatrix4(_,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function mw(t){let e=new WeakMap;function n(o,a){return a===Mc?o.mapping=kr:a===Ec&&(o.mapping=zr),o}function i(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const a=o.mapping;if(a===Mc||a===Ec)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Cb(l.height/2);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class gw extends hg{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const br=4,Vd=[.125,.215,.35,.446,.526,.582],Oi=20,Ll=new gw,Wd=new Qe;let Dl=null;const Ui=(1+Math.sqrt(5))/2,vr=1/Ui,Xd=[new X(1,1,1),new X(-1,1,1),new X(1,1,-1),new X(-1,1,-1),new X(0,Ui,vr),new X(0,Ui,-vr),new X(vr,0,Ui),new X(-vr,0,Ui),new X(Ui,vr,0),new X(-Ui,vr,0)];class jd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Dl=this._renderer.getRenderTarget(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$d(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Dl),e.scissorTest=!1,Oo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===kr||e.mapping===zr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dl=this._renderer.getRenderTarget();const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:en,minFilter:en,generateMipmaps:!1,type:Ns,format:pn,colorSpace:Rn,depthBuffer:!1},r=qd(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qd(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_w(s)),this._blurMaterial=vw(s,e,n)}return r}_compileMaterial(e){const n=new di(this._lodPlanes[0],e);this._renderer.compile(n,Ll)}_sceneToCubeUV(e,n,i,r){const a=new $t(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(Wd),u.toneMapping=Gn,u.autoClear=!1;const p=new cg({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1}),g=new di(new Qs,p);let x=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,x=!0):(p.color.copy(Wd),x=!0);for(let d=0;d<6;d++){const _=d%3;_===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):_===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const v=this._cubeSize;Oo(r,_*v,d>2?v:0,v,v),u.setRenderTarget(r),x&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=f,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===kr||e.mapping===zr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$d());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new di(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Oo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Ll)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Xd[(r-1)%Xd.length];this._blur(e,r-1,r,s,o)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new di(this._lodPlanes[r],c),h=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Oi-1),x=s/g,m=isFinite(s)?1+Math.floor(u*x):Oi;m>Oi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Oi}`);const d=[];let _=0;for(let w=0;w<Oi;++w){const P=w/x,M=Math.exp(-P*P/2);d.push(M),w===0?_+=M:w<m&&(_+=2*M)}for(let w=0;w<d.length;w++)d[w]=d[w]/_;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=d,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-i;const y=this._sizeLods[r],S=3*y*(r>v-br?r-v+br:0),R=4*(this._cubeSize-y);Oo(n,S,R,3*y,2*y),l.setRenderTarget(n),l.render(f,Ll)}}function _w(t){const e=[],n=[],i=[];let r=t;const s=t-br+1+Vd.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-br?l=Vd[o-t+br-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,g=6,x=3,m=2,d=1,_=new Float32Array(x*g*p),v=new Float32Array(m*g*p),y=new Float32Array(d*g*p);for(let R=0;R<p;R++){const w=R%3*2/3-1,P=R>2?0:-1,M=[w,P,0,w+2/3,P,0,w+2/3,P+1,0,w,P,0,w+2/3,P+1,0,w,P+1,0];_.set(M,x*g*R),v.set(h,m*g*R);const T=[R,R,R,R,R,R];y.set(T,d*g*R)}const S=new $n;S.setAttribute("position",new rn(_,x)),S.setAttribute("uv",new rn(v,m)),S.setAttribute("faceIndex",new rn(y,d)),e.push(S),r>br&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function qd(t,e,n){const i=new qi(t,e,n);return i.texture.mapping=La,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function vw(t,e,n){const i=new Float32Array(Oi),r=new X(0,1,0);return new Yi({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:_u(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function $d(){return new Yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_u(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Yd(){return new Yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_u(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function _u(){return`

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
	`}function xw(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Mc||l===Ec,u=l===kr||l===zr;if(c||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=e.get(a);return n===null&&(n=new jd(t)),f=c?n.fromEquirectangular(a,f):n.fromCubemap(a,f),e.set(a,f),f.texture}else{if(e.has(a))return e.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||u&&f&&r(f)){n===null&&(n=new jd(t));const h=c?n.fromEquirectangular(a):n.fromCubemap(a);return e.set(a,h),a.addEventListener("dispose",s),h.texture}else return null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function yw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(i){i.isWebGL2?n("EXT_color_buffer_float"):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(i){const r=n(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Mw(t,e,n,i){const r={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const x=h.morphAttributes[g];for(let m=0,d=x.length;m<d;m++)e.remove(x[m])}h.removeEventListener("dispose",o),delete r[h.id];const p=s.get(h);p&&(e.remove(p),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function l(f){const h=f.attributes;for(const g in h)e.update(h[g],t.ARRAY_BUFFER);const p=f.morphAttributes;for(const g in p){const x=p[g];for(let m=0,d=x.length;m<d;m++)e.update(x[m],t.ARRAY_BUFFER)}}function c(f){const h=[],p=f.index,g=f.attributes.position;let x=0;if(p!==null){const _=p.array;x=p.version;for(let v=0,y=_.length;v<y;v+=3){const S=_[v+0],R=_[v+1],w=_[v+2];h.push(S,R,R,w,w,S)}}else{const _=g.array;x=g.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const S=v+0,R=v+1,w=v+2;h.push(S,R,R,w,w,S)}}const m=new(ng(h)?fg:ug)(h,1);m.version=x;const d=s.get(f);d&&e.remove(d),s.set(f,m)}function u(f){const h=s.get(f);if(h){const p=f.index;p!==null&&h.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function Ew(t,e,n,i){const r=i.isWebGL2;let s;function o(h){s=h}let a,l;function c(h){a=h.type,l=h.bytesPerElement}function u(h,p){t.drawElements(s,p,a,h*l),n.update(p,s,1)}function f(h,p,g){if(g===0)return;let x,m;if(r)x=t,m="drawElementsInstanced";else if(x=e.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[m](s,p,a,h*l,g),n.update(p,s,g)}this.setMode=o,this.setIndex=c,this.render=u,this.renderInstances=f}function Sw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function bw(t,e){return t[0]-e[0]}function Tw(t,e){return Math.abs(e[1])-Math.abs(t[1])}function Aw(t,e,n){const i={},r=new Float32Array(8),s=new WeakMap,o=new bt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,u,f){const h=c.morphTargetInfluences;if(e.isWebGL2===!0){const p=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=p!==void 0?p.length:0;let x=s.get(u);if(x===void 0||x.count!==g){let U=function(){H.dispose(),s.delete(u),u.removeEventListener("dispose",U)};x!==void 0&&x.texture.dispose();const _=u.morphAttributes.position!==void 0,v=u.morphAttributes.normal!==void 0,y=u.morphAttributes.color!==void 0,S=u.morphAttributes.position||[],R=u.morphAttributes.normal||[],w=u.morphAttributes.color||[];let P=0;_===!0&&(P=1),v===!0&&(P=2),y===!0&&(P=3);let M=u.attributes.position.count*P,T=1;M>e.maxTextureSize&&(T=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const F=new Float32Array(M*T*4*g),H=new sg(F,M,T,g);H.type=fi,H.needsUpdate=!0;const N=P*4;for(let B=0;B<g;B++){const K=S[B],q=R[B],Y=w[B],ce=M*T*4*B;for(let de=0;de<K.count;de++){const V=de*N;_===!0&&(o.fromBufferAttribute(K,de),F[ce+V+0]=o.x,F[ce+V+1]=o.y,F[ce+V+2]=o.z,F[ce+V+3]=0),v===!0&&(o.fromBufferAttribute(q,de),F[ce+V+4]=o.x,F[ce+V+5]=o.y,F[ce+V+6]=o.z,F[ce+V+7]=0),y===!0&&(o.fromBufferAttribute(Y,de),F[ce+V+8]=o.x,F[ce+V+9]=o.y,F[ce+V+10]=o.z,F[ce+V+11]=Y.itemSize===4?o.w:1)}}x={count:g,texture:H,size:new Xe(M,T)},s.set(u,x),u.addEventListener("dispose",U)}let m=0;for(let _=0;_<h.length;_++)m+=h[_];const d=u.morphTargetsRelative?1:1-m;f.getUniforms().setValue(t,"morphTargetBaseInfluence",d),f.getUniforms().setValue(t,"morphTargetInfluences",h),f.getUniforms().setValue(t,"morphTargetsTexture",x.texture,n),f.getUniforms().setValue(t,"morphTargetsTextureSize",x.size)}else{const p=h===void 0?0:h.length;let g=i[u.id];if(g===void 0||g.length!==p){g=[];for(let v=0;v<p;v++)g[v]=[v,0];i[u.id]=g}for(let v=0;v<p;v++){const y=g[v];y[0]=v,y[1]=h[v]}g.sort(Tw);for(let v=0;v<8;v++)v<p&&g[v][1]?(a[v][0]=g[v][0],a[v][1]=g[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(bw);const x=u.morphAttributes.position,m=u.morphAttributes.normal;let d=0;for(let v=0;v<8;v++){const y=a[v],S=y[0],R=y[1];S!==Number.MAX_SAFE_INTEGER&&R?(x&&u.getAttribute("morphTarget"+v)!==x[S]&&u.setAttribute("morphTarget"+v,x[S]),m&&u.getAttribute("morphNormal"+v)!==m[S]&&u.setAttribute("morphNormal"+v,m[S]),r[v]=R,d+=R):(x&&u.hasAttribute("morphTarget"+v)===!0&&u.deleteAttribute("morphTarget"+v),m&&u.hasAttribute("morphNormal"+v)===!0&&u.deleteAttribute("morphNormal"+v),r[v]=0)}const _=u.morphTargetsRelative?1:1-d;f.getUniforms().setValue(t,"morphTargetBaseInfluence",_),f.getUniforms().setValue(t,"morphTargetInfluences",r)}}return{update:l}}function ww(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}const _g=new Kt,vg=new sg,xg=new hb,yg=new pg,Kd=[],Zd=[],Jd=new Float32Array(16),Qd=new Float32Array(9),eh=new Float32Array(4);function Yr(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Kd[r];if(s===void 0&&(s=new Float32Array(r),Kd[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function gt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function _t(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Ia(t,e){let n=Zd[e];n===void 0&&(n=new Int32Array(e),Zd[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Rw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function Cw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(gt(n,e))return;t.uniform2fv(this.addr,e),_t(n,e)}}function Pw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(gt(n,e))return;t.uniform3fv(this.addr,e),_t(n,e)}}function Lw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(gt(n,e))return;t.uniform4fv(this.addr,e),_t(n,e)}}function Dw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(gt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),_t(n,e)}else{if(gt(n,i))return;eh.set(i),t.uniformMatrix2fv(this.addr,!1,eh),_t(n,i)}}function Uw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(gt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),_t(n,e)}else{if(gt(n,i))return;Qd.set(i),t.uniformMatrix3fv(this.addr,!1,Qd),_t(n,i)}}function Iw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(gt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),_t(n,e)}else{if(gt(n,i))return;Jd.set(i),t.uniformMatrix4fv(this.addr,!1,Jd),_t(n,i)}}function Nw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Ow(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(gt(n,e))return;t.uniform2iv(this.addr,e),_t(n,e)}}function Fw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(gt(n,e))return;t.uniform3iv(this.addr,e),_t(n,e)}}function Bw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(gt(n,e))return;t.uniform4iv(this.addr,e),_t(n,e)}}function Hw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function kw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(gt(n,e))return;t.uniform2uiv(this.addr,e),_t(n,e)}}function zw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(gt(n,e))return;t.uniform3uiv(this.addr,e),_t(n,e)}}function Gw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(gt(n,e))return;t.uniform4uiv(this.addr,e),_t(n,e)}}function Vw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2D(e||_g,r)}function Ww(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||xg,r)}function Xw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||yg,r)}function jw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||vg,r)}function qw(t){switch(t){case 5126:return Rw;case 35664:return Cw;case 35665:return Pw;case 35666:return Lw;case 35674:return Dw;case 35675:return Uw;case 35676:return Iw;case 5124:case 35670:return Nw;case 35667:case 35671:return Ow;case 35668:case 35672:return Fw;case 35669:case 35673:return Bw;case 5125:return Hw;case 36294:return kw;case 36295:return zw;case 36296:return Gw;case 35678:case 36198:case 36298:case 36306:case 35682:return Vw;case 35679:case 36299:case 36307:return Ww;case 35680:case 36300:case 36308:case 36293:return Xw;case 36289:case 36303:case 36311:case 36292:return jw}}function $w(t,e){t.uniform1fv(this.addr,e)}function Yw(t,e){const n=Yr(e,this.size,2);t.uniform2fv(this.addr,n)}function Kw(t,e){const n=Yr(e,this.size,3);t.uniform3fv(this.addr,n)}function Zw(t,e){const n=Yr(e,this.size,4);t.uniform4fv(this.addr,n)}function Jw(t,e){const n=Yr(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Qw(t,e){const n=Yr(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function eR(t,e){const n=Yr(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function tR(t,e){t.uniform1iv(this.addr,e)}function nR(t,e){t.uniform2iv(this.addr,e)}function iR(t,e){t.uniform3iv(this.addr,e)}function rR(t,e){t.uniform4iv(this.addr,e)}function sR(t,e){t.uniform1uiv(this.addr,e)}function oR(t,e){t.uniform2uiv(this.addr,e)}function aR(t,e){t.uniform3uiv(this.addr,e)}function lR(t,e){t.uniform4uiv(this.addr,e)}function cR(t,e,n){const i=this.cache,r=e.length,s=Ia(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||_g,s[o])}function uR(t,e,n){const i=this.cache,r=e.length,s=Ia(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||xg,s[o])}function fR(t,e,n){const i=this.cache,r=e.length,s=Ia(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||yg,s[o])}function dR(t,e,n){const i=this.cache,r=e.length,s=Ia(n,r);gt(i,s)||(t.uniform1iv(this.addr,s),_t(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||vg,s[o])}function hR(t){switch(t){case 5126:return $w;case 35664:return Yw;case 35665:return Kw;case 35666:return Zw;case 35674:return Jw;case 35675:return Qw;case 35676:return eR;case 5124:case 35670:return tR;case 35667:case 35671:return nR;case 35668:case 35672:return iR;case 35669:case 35673:return rR;case 5125:return sR;case 36294:return oR;case 36295:return aR;case 36296:return lR;case 35678:case 36198:case 36298:case 36306:case 35682:return cR;case 35679:case 36299:case 36307:return uR;case 35680:case 36300:case 36308:case 36293:return fR;case 36289:case 36303:case 36311:case 36292:return dR}}class pR{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.setValue=qw(n.type)}}class mR{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.size=n.size,this.setValue=hR(n.type)}}class gR{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Ul=/(\w+)(\])?(\[|\.)?/g;function th(t,e){t.seq.push(e),t.map[e.id]=e}function _R(t,e,n){const i=t.name,r=i.length;for(Ul.lastIndex=0;;){const s=Ul.exec(i),o=Ul.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){th(n,c===void 0?new pR(a,t,e):new mR(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new gR(a),th(n,f)),n=f}}}class Vo{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);_R(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function nh(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}let vR=0;function xR(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}function yR(t){switch(t){case Rn:return["Linear","( value )"];case Ge:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),["Linear","( value )"]}}function ih(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+xR(t.getShaderSource(e),o)}else return r}function MR(t,e){const n=yR(e);return"vec4 "+t+"( vec4 value ) { return LinearTo"+n[0]+n[1]+"; }"}function ER(t,e){let n;switch(e){case PS:n="Linear";break;case LS:n="Reinhard";break;case DS:n="OptimizedCineon";break;case US:n="ACESFilmic";break;case IS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function SR(t){return[t.extensionDerivatives||t.envMapCubeUVHeight||t.bumpMap||t.normalMapTangentSpace||t.clearcoatNormalMap||t.flatShading||t.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(t.extensionFragDepth||t.logarithmicDepthBuffer)&&t.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",t.extensionDrawBuffers&&t.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(t.extensionShaderTextureLOD||t.envMap||t.transmission)&&t.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(cs).join(`
`)}function bR(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function TR(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function cs(t){return t!==""}function rh(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function sh(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const AR=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rc(t){return t.replace(AR,RR)}const wR=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function RR(t,e){let n=ze[e];if(n===void 0){const i=wR.get(e);if(i!==void 0)n=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Rc(n)}const CR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oh(t){return t.replace(CR,PR)}function PR(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ah(t){let e="precision "+t.precision+` float;
precision `+t.precision+" int;";return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function LR(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Vm?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===lS?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===Fn&&(e="SHADOWMAP_TYPE_VSM"),e}function DR(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case kr:case zr:e="ENVMAP_TYPE_CUBE";break;case La:e="ENVMAP_TYPE_CUBE_UV";break}return e}function UR(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case zr:e="ENVMAP_MODE_REFRACTION";break}return e}function IR(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case jm:e="ENVMAP_BLENDING_MULTIPLY";break;case RS:e="ENVMAP_BLENDING_MIX";break;case CS:e="ENVMAP_BLENDING_ADD";break}return e}function NR(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function OR(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=LR(n),c=DR(n),u=UR(n),f=IR(n),h=NR(n),p=n.isWebGL2?"":SR(n),g=bR(s),x=r.createProgram();let m,d,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(cs).join(`
`),m.length>0&&(m+=`
`),d=[p,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(cs).join(`
`),d.length>0&&(d+=`
`)):(m=[ah(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cs).join(`
`),d=[p,ah(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Gn?"#define TONE_MAPPING":"",n.toneMapping!==Gn?ze.tonemapping_pars_fragment:"",n.toneMapping!==Gn?ER("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,MR("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(cs).join(`
`)),o=Rc(o),o=rh(o,n),o=sh(o,n),a=Rc(a),a=rh(a,n),a=sh(a,n),o=oh(o),a=oh(a),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",n.glslVersion===Ad?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Ad?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const v=_+m+o,y=_+d+a,S=nh(r,r.VERTEX_SHADER,v),R=nh(r,r.FRAGMENT_SHADER,y);if(r.attachShader(x,S),r.attachShader(x,R),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x),t.debug.checkShaderErrors){const M=r.getProgramInfoLog(x).trim(),T=r.getShaderInfoLog(S).trim(),F=r.getShaderInfoLog(R).trim();let H=!0,N=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(H=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,S,R);else{const U=ih(r,S,"vertex"),B=ih(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Program Info Log: `+M+`
`+U+`
`+B)}else M!==""?console.warn("THREE.WebGLProgram: Program Info Log:",M):(T===""||F==="")&&(N=!1);N&&(this.diagnostics={runnable:H,programLog:M,vertexShader:{log:T,prefix:m},fragmentShader:{log:F,prefix:d}})}r.deleteShader(S),r.deleteShader(R);let w;this.getUniforms=function(){return w===void 0&&(w=new Vo(r,x)),w};let P;return this.getAttributes=function(){return P===void 0&&(P=TR(r,x)),P},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=vR++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=S,this.fragmentShader=R,this}let FR=0;class BR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new HR(e),n.set(e,i)),i}}class HR{constructor(e){this.id=FR++,this.code=e,this.usedTimes=0}}function kR(t,e,n,i,r,s,o){const a=new ag,l=new BR,c=[],u=r.isWebGL2,f=r.logarithmicDepthBuffer,h=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return M===0?"uv":`uv${M}`}function m(M,T,F,H,N){const U=H.fog,B=N.geometry,K=M.isMeshStandardMaterial?H.environment:null,q=(M.isMeshStandardMaterial?n:e).get(M.envMap||K),Y=q&&q.mapping===La?q.image.height:null,ce=g[M.type];M.precision!==null&&(p=r.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const de=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,V=de!==void 0?de.length:0;let Q=0;B.morphAttributes.position!==void 0&&(Q=1),B.morphAttributes.normal!==void 0&&(Q=2),B.morphAttributes.color!==void 0&&(Q=3);let me,_e,ye,we;if(ce){const xn=bn[ce];me=xn.vertexShader,_e=xn.fragmentShader}else me=M.vertexShader,_e=M.fragmentShader,l.update(M),ye=l.getVertexShaderID(M),we=l.getFragmentShaderID(M);const j=t.getRenderTarget(),oe=N.isInstancedMesh===!0,ue=!!M.map,Ee=!!M.matcap,Ae=!!q,E=!!M.aoMap,D=!!M.lightMap,I=!!M.bumpMap,z=!!M.normalMap,W=!!M.displacementMap,ie=!!M.emissiveMap,he=!!M.metalnessMap,ee=!!M.roughnessMap,fe=M.anisotropy>0,le=M.clearcoat>0,be=M.iridescence>0,A=M.sheen>0,b=M.transmission>0,k=fe&&!!M.anisotropyMap,te=le&&!!M.clearcoatMap,ae=le&&!!M.clearcoatNormalMap,L=le&&!!M.clearcoatRoughnessMap,ne=be&&!!M.iridescenceMap,pe=be&&!!M.iridescenceThicknessMap,Z=A&&!!M.sheenColorMap,Re=A&&!!M.sheenRoughnessMap,Pe=!!M.specularMap,Le=!!M.specularColorMap,xe=!!M.specularIntensityMap,Me=b&&!!M.transmissionMap,Ie=b&&!!M.thicknessMap,je=!!M.gradientMap,O=!!M.alphaMap,Se=M.alphaTest>0,J=!!M.alphaHash,ge=!!M.extensions,Te=!!B.attributes.uv1,Ke=!!B.attributes.uv2,rt=!!B.attributes.uv3;return{isWebGL2:u,shaderID:ce,shaderType:M.type,shaderName:M.name,vertexShader:me,fragmentShader:_e,defines:M.defines,customVertexShaderID:ye,customFragmentShaderID:we,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,instancing:oe,instancingColor:oe&&N.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:j===null?t.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Rn,map:ue,matcap:Ee,envMap:Ae,envMapMode:Ae&&q.mapping,envMapCubeUVHeight:Y,aoMap:E,lightMap:D,bumpMap:I,normalMap:z,displacementMap:h&&W,emissiveMap:ie,normalMapObjectSpace:z&&M.normalMapType===$S,normalMapTangentSpace:z&&M.normalMapType===qS,metalnessMap:he,roughnessMap:ee,anisotropy:fe,anisotropyMap:k,clearcoat:le,clearcoatMap:te,clearcoatNormalMap:ae,clearcoatRoughnessMap:L,iridescence:be,iridescenceMap:ne,iridescenceThicknessMap:pe,sheen:A,sheenColorMap:Z,sheenRoughnessMap:Re,specularMap:Pe,specularColorMap:Le,specularIntensityMap:xe,transmission:b,transmissionMap:Me,thicknessMap:Ie,gradientMap:je,opaque:M.transparent===!1&&M.blending===Dr,alphaMap:O,alphaTest:Se,alphaHash:J,combine:M.combine,mapUv:ue&&x(M.map.channel),aoMapUv:E&&x(M.aoMap.channel),lightMapUv:D&&x(M.lightMap.channel),bumpMapUv:I&&x(M.bumpMap.channel),normalMapUv:z&&x(M.normalMap.channel),displacementMapUv:W&&x(M.displacementMap.channel),emissiveMapUv:ie&&x(M.emissiveMap.channel),metalnessMapUv:he&&x(M.metalnessMap.channel),roughnessMapUv:ee&&x(M.roughnessMap.channel),anisotropyMapUv:k&&x(M.anisotropyMap.channel),clearcoatMapUv:te&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:ae&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:L&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:Z&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:Re&&x(M.sheenRoughnessMap.channel),specularMapUv:Pe&&x(M.specularMap.channel),specularColorMapUv:Le&&x(M.specularColorMap.channel),specularIntensityMapUv:xe&&x(M.specularIntensityMap.channel),transmissionMapUv:Me&&x(M.transmissionMap.channel),thicknessMapUv:Ie&&x(M.thicknessMap.channel),alphaMapUv:O&&x(M.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(z||fe),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:Te,vertexUv2s:Ke,vertexUv3s:rt,pointsUvs:N.isPoints===!0&&!!B.attributes.uv&&(ue||O),fog:!!U,useFog:M.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:N.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:V,morphTextureStride:Q,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&F.length>0,shadowMapType:t.shadowMap.type,toneMapping:M.toneMapped?t.toneMapping:Gn,useLegacyLights:t.useLegacyLights,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Hn,flipSided:M.side===kt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:ge&&M.extensions.derivatives===!0,extensionFragDepth:ge&&M.extensions.fragDepth===!0,extensionDrawBuffers:ge&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:ge&&M.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),customProgramCacheKey:M.customProgramCacheKey()}}function d(M){const T=[];if(M.shaderID?T.push(M.shaderID):(T.push(M.customVertexShaderID),T.push(M.customFragmentShaderID)),M.defines!==void 0)for(const F in M.defines)T.push(F),T.push(M.defines[F]);return M.isRawShaderMaterial===!1&&(_(T,M),v(T,M),T.push(t.outputColorSpace)),T.push(M.customProgramCacheKey),T.join()}function _(M,T){M.push(T.precision),M.push(T.outputColorSpace),M.push(T.envMapMode),M.push(T.envMapCubeUVHeight),M.push(T.mapUv),M.push(T.alphaMapUv),M.push(T.lightMapUv),M.push(T.aoMapUv),M.push(T.bumpMapUv),M.push(T.normalMapUv),M.push(T.displacementMapUv),M.push(T.emissiveMapUv),M.push(T.metalnessMapUv),M.push(T.roughnessMapUv),M.push(T.anisotropyMapUv),M.push(T.clearcoatMapUv),M.push(T.clearcoatNormalMapUv),M.push(T.clearcoatRoughnessMapUv),M.push(T.iridescenceMapUv),M.push(T.iridescenceThicknessMapUv),M.push(T.sheenColorMapUv),M.push(T.sheenRoughnessMapUv),M.push(T.specularMapUv),M.push(T.specularColorMapUv),M.push(T.specularIntensityMapUv),M.push(T.transmissionMapUv),M.push(T.thicknessMapUv),M.push(T.combine),M.push(T.fogExp2),M.push(T.sizeAttenuation),M.push(T.morphTargetsCount),M.push(T.morphAttributeCount),M.push(T.numDirLights),M.push(T.numPointLights),M.push(T.numSpotLights),M.push(T.numSpotLightMaps),M.push(T.numHemiLights),M.push(T.numRectAreaLights),M.push(T.numDirLightShadows),M.push(T.numPointLightShadows),M.push(T.numSpotLightShadows),M.push(T.numSpotLightShadowsWithMaps),M.push(T.shadowMapType),M.push(T.toneMapping),M.push(T.numClippingPlanes),M.push(T.numClipIntersection),M.push(T.depthPacking)}function v(M,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),M.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),M.push(a.mask)}function y(M){const T=g[M.type];let F;if(T){const H=bn[T];F=Tb.clone(H.uniforms)}else F=M.uniforms;return F}function S(M,T){let F;for(let H=0,N=c.length;H<N;H++){const U=c[H];if(U.cacheKey===T){F=U,++F.usedTimes;break}}return F===void 0&&(F=new OR(t,T,M,s),c.push(F)),F}function R(M){if(--M.usedTimes===0){const T=c.indexOf(M);c[T]=c[c.length-1],c.pop(),M.destroy()}}function w(M){l.remove(M)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:y,acquireProgram:S,releaseProgram:R,releaseShaderCache:w,programs:c,dispose:P}}function zR(){let t=new WeakMap;function e(s){let o=t.get(s);return o===void 0&&(o={},t.set(s,o)),o}function n(s){t.delete(s)}function i(s,o,a){t.get(s)[o]=a}function r(){t=new WeakMap}return{get:e,remove:n,update:i,dispose:r}}function GR(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function lh(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function ch(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(f,h,p,g,x,m){let d=t[e];return d===void 0?(d={id:f.id,object:f,geometry:h,material:p,groupOrder:g,renderOrder:f.renderOrder,z:x,group:m},t[e]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=p,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=x,d.group=m),e++,d}function a(f,h,p,g,x,m){const d=o(f,h,p,g,x,m);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):n.push(d)}function l(f,h,p,g,x,m){const d=o(f,h,p,g,x,m);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):n.unshift(d)}function c(f,h){n.length>1&&n.sort(f||GR),i.length>1&&i.sort(h||lh),r.length>1&&r.sort(h||lh)}function u(){for(let f=e,h=t.length;f<h;f++){const p=t[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function VR(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new ch,t.set(i,[o])):r>=s.length?(o=new ch,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function WR(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new X,color:new Qe};break;case"SpotLight":n={position:new X,direction:new X,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new X,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new X,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":n={color:new Qe,position:new X,halfWidth:new X,halfHeight:new X};break}return t[e.id]=n,n}}}function XR(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let jR=0;function qR(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function $R(t,e){const n=new WR,i=XR(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let u=0;u<9;u++)r.probe.push(new X);const s=new X,o=new Mt,a=new Mt;function l(u,f){let h=0,p=0,g=0;for(let F=0;F<9;F++)r.probe[F].set(0,0,0);let x=0,m=0,d=0,_=0,v=0,y=0,S=0,R=0,w=0,P=0;u.sort(qR);const M=f===!0?Math.PI:1;for(let F=0,H=u.length;F<H;F++){const N=u[F],U=N.color,B=N.intensity,K=N.distance,q=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)h+=U.r*B*M,p+=U.g*B*M,g+=U.b*B*M;else if(N.isLightProbe)for(let Y=0;Y<9;Y++)r.probe[Y].addScaledVector(N.sh.coefficients[Y],B);else if(N.isDirectionalLight){const Y=n.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity*M),N.castShadow){const ce=N.shadow,de=i.get(N);de.shadowBias=ce.bias,de.shadowNormalBias=ce.normalBias,de.shadowRadius=ce.radius,de.shadowMapSize=ce.mapSize,r.directionalShadow[x]=de,r.directionalShadowMap[x]=q,r.directionalShadowMatrix[x]=N.shadow.matrix,y++}r.directional[x]=Y,x++}else if(N.isSpotLight){const Y=n.get(N);Y.position.setFromMatrixPosition(N.matrixWorld),Y.color.copy(U).multiplyScalar(B*M),Y.distance=K,Y.coneCos=Math.cos(N.angle),Y.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),Y.decay=N.decay,r.spot[d]=Y;const ce=N.shadow;if(N.map&&(r.spotLightMap[w]=N.map,w++,ce.updateMatrices(N),N.castShadow&&P++),r.spotLightMatrix[d]=ce.matrix,N.castShadow){const de=i.get(N);de.shadowBias=ce.bias,de.shadowNormalBias=ce.normalBias,de.shadowRadius=ce.radius,de.shadowMapSize=ce.mapSize,r.spotShadow[d]=de,r.spotShadowMap[d]=q,R++}d++}else if(N.isRectAreaLight){const Y=n.get(N);Y.color.copy(U).multiplyScalar(B),Y.halfWidth.set(N.width*.5,0,0),Y.halfHeight.set(0,N.height*.5,0),r.rectArea[_]=Y,_++}else if(N.isPointLight){const Y=n.get(N);if(Y.color.copy(N.color).multiplyScalar(N.intensity*M),Y.distance=N.distance,Y.decay=N.decay,N.castShadow){const ce=N.shadow,de=i.get(N);de.shadowBias=ce.bias,de.shadowNormalBias=ce.normalBias,de.shadowRadius=ce.radius,de.shadowMapSize=ce.mapSize,de.shadowCameraNear=ce.camera.near,de.shadowCameraFar=ce.camera.far,r.pointShadow[m]=de,r.pointShadowMap[m]=q,r.pointShadowMatrix[m]=N.shadow.matrix,S++}r.point[m]=Y,m++}else if(N.isHemisphereLight){const Y=n.get(N);Y.skyColor.copy(N.color).multiplyScalar(B*M),Y.groundColor.copy(N.groundColor).multiplyScalar(B*M),r.hemi[v]=Y,v++}}_>0&&(e.isWebGL2||t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_FLOAT_1,r.rectAreaLTC2=ve.LTC_FLOAT_2):t.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=ve.LTC_HALF_1,r.rectAreaLTC2=ve.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=h,r.ambient[1]=p,r.ambient[2]=g;const T=r.hash;(T.directionalLength!==x||T.pointLength!==m||T.spotLength!==d||T.rectAreaLength!==_||T.hemiLength!==v||T.numDirectionalShadows!==y||T.numPointShadows!==S||T.numSpotShadows!==R||T.numSpotMaps!==w)&&(r.directional.length=x,r.spot.length=d,r.rectArea.length=_,r.point.length=m,r.hemi.length=v,r.directionalShadow.length=y,r.directionalShadowMap.length=y,r.pointShadow.length=S,r.pointShadowMap.length=S,r.spotShadow.length=R,r.spotShadowMap.length=R,r.directionalShadowMatrix.length=y,r.pointShadowMatrix.length=S,r.spotLightMatrix.length=R+w-P,r.spotLightMap.length=w,r.numSpotLightShadowsWithMaps=P,T.directionalLength=x,T.pointLength=m,T.spotLength=d,T.rectAreaLength=_,T.hemiLength=v,T.numDirectionalShadows=y,T.numPointShadows=S,T.numSpotShadows=R,T.numSpotMaps=w,r.version=jR++)}function c(u,f){let h=0,p=0,g=0,x=0,m=0;const d=f.matrixWorldInverse;for(let _=0,v=u.length;_<v;_++){const y=u[_];if(y.isDirectionalLight){const S=r.directional[h];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(d),h++}else if(y.isSpotLight){const S=r.spot[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(d),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(d),g++}else if(y.isRectAreaLight){const S=r.rectArea[x];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(d),a.identity(),o.copy(y.matrixWorld),o.premultiply(d),a.extractRotation(o),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const S=r.point[p];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(d),p++}else if(y.isHemisphereLight){const S=r.hemi[m];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(d),m++}}}return{setup:l,setupView:c,state:r}}function uh(t,e){const n=new $R(t,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(f){i.push(f)}function a(f){r.push(f)}function l(f){n.setup(i,f)}function c(f){n.setupView(i,f)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:n},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function YR(t,e){let n=new WeakMap;function i(s,o=0){const a=n.get(s);let l;return a===void 0?(l=new uh(t,e),n.set(s,[l])):o>=a.length?(l=new uh(t,e),a.push(l)):l=a[o],l}function r(){n=new WeakMap}return{get:i,dispose:r}}class KR extends Js{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=XS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ZR extends Js{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const JR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,QR=`uniform sampler2D shadow_pass;
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
}`;function eC(t,e,n){let i=new mg;const r=new Xe,s=new Xe,o=new bt,a=new KR({depthPacking:jS}),l=new ZR,c={},u=n.maxTextureSize,f={[xi]:kt,[kt]:xi,[Hn]:Hn},h=new Yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:JR,fragmentShader:QR}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new $n;g.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new di(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vm;let d=this.type;this.render=function(S,R,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const P=t.getRenderTarget(),M=t.getActiveCubeFace(),T=t.getActiveMipmapLevel(),F=t.state;F.setBlending(gi),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const H=d!==Fn&&this.type===Fn,N=d===Fn&&this.type!==Fn;for(let U=0,B=S.length;U<B;U++){const K=S[U],q=K.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;r.copy(q.mapSize);const Y=q.getFrameExtents();if(r.multiply(Y),s.copy(q.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/Y.x),r.x=s.x*Y.x,q.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/Y.y),r.y=s.y*Y.y,q.mapSize.y=s.y)),q.map===null||H===!0||N===!0){const de=this.type!==Fn?{minFilter:Ut,magFilter:Ut}:{};q.map!==null&&q.map.dispose(),q.map=new qi(r.x,r.y,de),q.map.texture.name=K.name+".shadowMap",q.camera.updateProjectionMatrix()}t.setRenderTarget(q.map),t.clear();const ce=q.getViewportCount();for(let de=0;de<ce;de++){const V=q.getViewport(de);o.set(s.x*V.x,s.y*V.y,s.x*V.z,s.y*V.w),F.viewport(o),q.updateMatrices(K,de),i=q.getFrustum(),y(R,w,q.camera,K,this.type)}q.isPointLightShadow!==!0&&this.type===Fn&&_(q,w),q.needsUpdate=!1}d=this.type,m.needsUpdate=!1,t.setRenderTarget(P,M,T)};function _(S,R){const w=e.update(x);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new qi(r.x,r.y)),h.uniforms.shadow_pass.value=S.map.texture,h.uniforms.resolution.value=S.mapSize,h.uniforms.radius.value=S.radius,t.setRenderTarget(S.mapPass),t.clear(),t.renderBufferDirect(R,null,w,h,x,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,t.setRenderTarget(S.map),t.clear(),t.renderBufferDirect(R,null,w,p,x,null)}function v(S,R,w,P){let M=null;const T=w.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(T!==void 0)M=T;else if(M=w.isPointLight===!0?l:a,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const F=M.uuid,H=R.uuid;let N=c[F];N===void 0&&(N={},c[F]=N);let U=N[H];U===void 0&&(U=M.clone(),N[H]=U),M=U}if(M.visible=R.visible,M.wireframe=R.wireframe,P===Fn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:f[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,w.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=t.properties.get(M);F.light=w}return M}function y(S,R,w,P,M){if(S.visible===!1)return;if(S.layers.test(R.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Fn)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,S.matrixWorld);const H=e.update(S),N=S.material;if(Array.isArray(N)){const U=H.groups;for(let B=0,K=U.length;B<K;B++){const q=U[B],Y=N[q.materialIndex];if(Y&&Y.visible){const ce=v(S,Y,P,M);t.renderBufferDirect(w,null,H,ce,S,q)}}}else if(N.visible){const U=v(S,N,P,M);t.renderBufferDirect(w,null,H,U,S,null)}}const F=S.children;for(let H=0,N=F.length;H<N;H++)y(F[H],R,w,P,M)}}function tC(t,e,n){const i=n.isWebGL2;function r(){let O=!1;const Se=new bt;let J=null;const ge=new bt(0,0,0,0);return{setMask:function(Te){J!==Te&&!O&&(t.colorMask(Te,Te,Te,Te),J=Te)},setLocked:function(Te){O=Te},setClear:function(Te,Ke,rt,vt,xn){xn===!0&&(Te*=vt,Ke*=vt,rt*=vt),Se.set(Te,Ke,rt,vt),ge.equals(Se)===!1&&(t.clearColor(Te,Ke,rt,vt),ge.copy(Se))},reset:function(){O=!1,J=null,ge.set(-1,0,0,0)}}}function s(){let O=!1,Se=null,J=null,ge=null;return{setTest:function(Te){Te?j(t.DEPTH_TEST):oe(t.DEPTH_TEST)},setMask:function(Te){Se!==Te&&!O&&(t.depthMask(Te),Se=Te)},setFunc:function(Te){if(J!==Te){switch(Te){case MS:t.depthFunc(t.NEVER);break;case ES:t.depthFunc(t.ALWAYS);break;case SS:t.depthFunc(t.LESS);break;case yc:t.depthFunc(t.LEQUAL);break;case bS:t.depthFunc(t.EQUAL);break;case TS:t.depthFunc(t.GEQUAL);break;case AS:t.depthFunc(t.GREATER);break;case wS:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}J=Te}},setLocked:function(Te){O=Te},setClear:function(Te){ge!==Te&&(t.clearDepth(Te),ge=Te)},reset:function(){O=!1,Se=null,J=null,ge=null}}}function o(){let O=!1,Se=null,J=null,ge=null,Te=null,Ke=null,rt=null,vt=null,xn=null;return{setTest:function(lt){O||(lt?j(t.STENCIL_TEST):oe(t.STENCIL_TEST))},setMask:function(lt){Se!==lt&&!O&&(t.stencilMask(lt),Se=lt)},setFunc:function(lt,yn,Ct){(J!==lt||ge!==yn||Te!==Ct)&&(t.stencilFunc(lt,yn,Ct),J=lt,ge=yn,Te=Ct)},setOp:function(lt,yn,Ct){(Ke!==lt||rt!==yn||vt!==Ct)&&(t.stencilOp(lt,yn,Ct),Ke=lt,rt=yn,vt=Ct)},setLocked:function(lt){O=lt},setClear:function(lt){xn!==lt&&(t.clearStencil(lt),xn=lt)},reset:function(){O=!1,Se=null,J=null,ge=null,Te=null,Ke=null,rt=null,vt=null,xn=null}}}const a=new r,l=new s,c=new o,u=new WeakMap,f=new WeakMap;let h={},p={},g=new WeakMap,x=[],m=null,d=!1,_=null,v=null,y=null,S=null,R=null,w=null,P=null,M=!1,T=null,F=null,H=null,N=null,U=null;const B=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,q=0;const Y=t.getParameter(t.VERSION);Y.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(Y)[1]),K=q>=1):Y.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),K=q>=2);let ce=null,de={};const V=t.getParameter(t.SCISSOR_BOX),Q=t.getParameter(t.VIEWPORT),me=new bt().fromArray(V),_e=new bt().fromArray(Q);function ye(O,Se,J,ge){const Te=new Uint8Array(4),Ke=t.createTexture();t.bindTexture(O,Ke),t.texParameteri(O,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(O,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let rt=0;rt<J;rt++)i&&(O===t.TEXTURE_3D||O===t.TEXTURE_2D_ARRAY)?t.texImage3D(Se,0,t.RGBA,1,1,ge,0,t.RGBA,t.UNSIGNED_BYTE,Te):t.texImage2D(Se+rt,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Te);return Ke}const we={};we[t.TEXTURE_2D]=ye(t.TEXTURE_2D,t.TEXTURE_2D,1),we[t.TEXTURE_CUBE_MAP]=ye(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(we[t.TEXTURE_2D_ARRAY]=ye(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),we[t.TEXTURE_3D]=ye(t.TEXTURE_3D,t.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),j(t.DEPTH_TEST),l.setFunc(yc),W(!1),ie(Yf),j(t.CULL_FACE),I(gi);function j(O){h[O]!==!0&&(t.enable(O),h[O]=!0)}function oe(O){h[O]!==!1&&(t.disable(O),h[O]=!1)}function ue(O,Se){return p[O]!==Se?(t.bindFramebuffer(O,Se),p[O]=Se,i&&(O===t.DRAW_FRAMEBUFFER&&(p[t.FRAMEBUFFER]=Se),O===t.FRAMEBUFFER&&(p[t.DRAW_FRAMEBUFFER]=Se)),!0):!1}function Ee(O,Se){let J=x,ge=!1;if(O)if(J=g.get(Se),J===void 0&&(J=[],g.set(Se,J)),O.isWebGLMultipleRenderTargets){const Te=O.texture;if(J.length!==Te.length||J[0]!==t.COLOR_ATTACHMENT0){for(let Ke=0,rt=Te.length;Ke<rt;Ke++)J[Ke]=t.COLOR_ATTACHMENT0+Ke;J.length=Te.length,ge=!0}}else J[0]!==t.COLOR_ATTACHMENT0&&(J[0]=t.COLOR_ATTACHMENT0,ge=!0);else J[0]!==t.BACK&&(J[0]=t.BACK,ge=!0);ge&&(n.isWebGL2?t.drawBuffers(J):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(J))}function Ae(O){return m!==O?(t.useProgram(O),m=O,!0):!1}const E={[yr]:t.FUNC_ADD,[uS]:t.FUNC_SUBTRACT,[fS]:t.FUNC_REVERSE_SUBTRACT};if(i)E[Qf]=t.MIN,E[ed]=t.MAX;else{const O=e.get("EXT_blend_minmax");O!==null&&(E[Qf]=O.MIN_EXT,E[ed]=O.MAX_EXT)}const D={[dS]:t.ZERO,[hS]:t.ONE,[pS]:t.SRC_COLOR,[Wm]:t.SRC_ALPHA,[yS]:t.SRC_ALPHA_SATURATE,[vS]:t.DST_COLOR,[gS]:t.DST_ALPHA,[mS]:t.ONE_MINUS_SRC_COLOR,[Xm]:t.ONE_MINUS_SRC_ALPHA,[xS]:t.ONE_MINUS_DST_COLOR,[_S]:t.ONE_MINUS_DST_ALPHA};function I(O,Se,J,ge,Te,Ke,rt,vt){if(O===gi){d===!0&&(oe(t.BLEND),d=!1);return}if(d===!1&&(j(t.BLEND),d=!0),O!==cS){if(O!==_||vt!==M){if((v!==yr||R!==yr)&&(t.blendEquation(t.FUNC_ADD),v=yr,R=yr),vt)switch(O){case Dr:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Kf:t.blendFunc(t.ONE,t.ONE);break;case Zf:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Jf:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Dr:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Kf:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Zf:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Jf:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}y=null,S=null,w=null,P=null,_=O,M=vt}return}Te=Te||Se,Ke=Ke||J,rt=rt||ge,(Se!==v||Te!==R)&&(t.blendEquationSeparate(E[Se],E[Te]),v=Se,R=Te),(J!==y||ge!==S||Ke!==w||rt!==P)&&(t.blendFuncSeparate(D[J],D[ge],D[Ke],D[rt]),y=J,S=ge,w=Ke,P=rt),_=O,M=!1}function z(O,Se){O.side===Hn?oe(t.CULL_FACE):j(t.CULL_FACE);let J=O.side===kt;Se&&(J=!J),W(J),O.blending===Dr&&O.transparent===!1?I(gi):I(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.premultipliedAlpha),l.setFunc(O.depthFunc),l.setTest(O.depthTest),l.setMask(O.depthWrite),a.setMask(O.colorWrite);const ge=O.stencilWrite;c.setTest(ge),ge&&(c.setMask(O.stencilWriteMask),c.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),c.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ee(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?j(t.SAMPLE_ALPHA_TO_COVERAGE):oe(t.SAMPLE_ALPHA_TO_COVERAGE)}function W(O){T!==O&&(O?t.frontFace(t.CW):t.frontFace(t.CCW),T=O)}function ie(O){O!==oS?(j(t.CULL_FACE),O!==F&&(O===Yf?t.cullFace(t.BACK):O===aS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):oe(t.CULL_FACE),F=O}function he(O){O!==H&&(K&&t.lineWidth(O),H=O)}function ee(O,Se,J){O?(j(t.POLYGON_OFFSET_FILL),(N!==Se||U!==J)&&(t.polygonOffset(Se,J),N=Se,U=J)):oe(t.POLYGON_OFFSET_FILL)}function fe(O){O?j(t.SCISSOR_TEST):oe(t.SCISSOR_TEST)}function le(O){O===void 0&&(O=t.TEXTURE0+B-1),ce!==O&&(t.activeTexture(O),ce=O)}function be(O,Se,J){J===void 0&&(ce===null?J=t.TEXTURE0+B-1:J=ce);let ge=de[J];ge===void 0&&(ge={type:void 0,texture:void 0},de[J]=ge),(ge.type!==O||ge.texture!==Se)&&(ce!==J&&(t.activeTexture(J),ce=J),t.bindTexture(O,Se||we[O]),ge.type=O,ge.texture=Se)}function A(){const O=de[ce];O!==void 0&&O.type!==void 0&&(t.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function b(){try{t.compressedTexImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function k(){try{t.compressedTexImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function te(){try{t.texSubImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ae(){try{t.texSubImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function L(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ne(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function pe(){try{t.texStorage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Z(){try{t.texStorage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Re(){try{t.texImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pe(){try{t.texImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Le(O){me.equals(O)===!1&&(t.scissor(O.x,O.y,O.z,O.w),me.copy(O))}function xe(O){_e.equals(O)===!1&&(t.viewport(O.x,O.y,O.z,O.w),_e.copy(O))}function Me(O,Se){let J=f.get(Se);J===void 0&&(J=new WeakMap,f.set(Se,J));let ge=J.get(O);ge===void 0&&(ge=t.getUniformBlockIndex(Se,O.name),J.set(O,ge))}function Ie(O,Se){const ge=f.get(Se).get(O);u.get(Se)!==ge&&(t.uniformBlockBinding(Se,ge,O.__bindingPointIndex),u.set(Se,ge))}function je(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),i===!0&&(t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null)),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},ce=null,de={},p={},g=new WeakMap,x=[],m=null,d=!1,_=null,v=null,y=null,S=null,R=null,w=null,P=null,M=!1,T=null,F=null,H=null,N=null,U=null,me.set(0,0,t.canvas.width,t.canvas.height),_e.set(0,0,t.canvas.width,t.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:j,disable:oe,bindFramebuffer:ue,drawBuffers:Ee,useProgram:Ae,setBlending:I,setMaterial:z,setFlipSided:W,setCullFace:ie,setLineWidth:he,setPolygonOffset:ee,setScissorTest:fe,activeTexture:le,bindTexture:be,unbindTexture:A,compressedTexImage2D:b,compressedTexImage3D:k,texImage2D:Re,texImage3D:Pe,updateUBOMapping:Me,uniformBlockBinding:Ie,texStorage2D:pe,texStorage3D:Z,texSubImage2D:te,texSubImage3D:ae,compressedTexSubImage2D:L,compressedTexSubImage3D:ne,scissor:Le,viewport:xe,reset:je}}function nC(t,e,n,i,r,s,o){const a=r.isWebGL2,l=r.maxTextures,c=r.maxCubemapSize,u=r.maxTextureSize,f=r.maxSamples,h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new WeakMap;let x;const m=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,b){return d?new OffscreenCanvas(A,b):da("canvas")}function v(A,b,k,te){let ae=1;if((A.width>te||A.height>te)&&(ae=te/Math.max(A.width,A.height)),ae<1||b===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const L=b?wc:Math.floor,ne=L(ae*A.width),pe=L(ae*A.height);x===void 0&&(x=_(ne,pe));const Z=k?_(ne,pe):x;return Z.width=ne,Z.height=pe,Z.getContext("2d").drawImage(A,0,0,ne,pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+ne+"x"+pe+")."),Z}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function y(A){return wd(A.width)&&wd(A.height)}function S(A){return a?!1:A.wrapS!==hn||A.wrapT!==hn||A.minFilter!==Ut&&A.minFilter!==en}function R(A,b){return A.generateMipmaps&&b&&A.minFilter!==Ut&&A.minFilter!==en}function w(A){t.generateMipmap(A)}function P(A,b,k,te,ae=!1){if(a===!1)return b;if(A!==null){if(t[A]!==void 0)return t[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let L=b;return b===t.RED&&(k===t.FLOAT&&(L=t.R32F),k===t.HALF_FLOAT&&(L=t.R16F),k===t.UNSIGNED_BYTE&&(L=t.R8)),b===t.RG&&(k===t.FLOAT&&(L=t.RG32F),k===t.HALF_FLOAT&&(L=t.RG16F),k===t.UNSIGNED_BYTE&&(L=t.RG8)),b===t.RGBA&&(k===t.FLOAT&&(L=t.RGBA32F),k===t.HALF_FLOAT&&(L=t.RGBA16F),k===t.UNSIGNED_BYTE&&(L=te===Ge&&ae===!1?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT_4_4_4_4&&(L=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(L=t.RGB5_A1)),(L===t.R16F||L===t.R32F||L===t.RG16F||L===t.RG32F||L===t.RGBA16F||L===t.RGBA32F)&&e.get("EXT_color_buffer_float"),L}function M(A,b,k){return R(A,k)===!0||A.isFramebufferTexture&&A.minFilter!==Ut&&A.minFilter!==en?Math.log2(Math.max(b.width,b.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?b.mipmaps.length:1}function T(A){return A===Ut||A===td||A===sl?t.NEAREST:t.LINEAR}function F(A){const b=A.target;b.removeEventListener("dispose",F),N(b),b.isVideoTexture&&g.delete(b)}function H(A){const b=A.target;b.removeEventListener("dispose",H),B(b)}function N(A){const b=i.get(A);if(b.__webglInit===void 0)return;const k=A.source,te=m.get(k);if(te){const ae=te[b.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&U(A),Object.keys(te).length===0&&m.delete(k)}i.remove(A)}function U(A){const b=i.get(A);t.deleteTexture(b.__webglTexture);const k=A.source,te=m.get(k);delete te[b.__cacheKey],o.memory.textures--}function B(A){const b=A.texture,k=i.get(A),te=i.get(b);if(te.__webglTexture!==void 0&&(t.deleteTexture(te.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let ae=0;ae<6;ae++)t.deleteFramebuffer(k.__webglFramebuffer[ae]),k.__webglDepthbuffer&&t.deleteRenderbuffer(k.__webglDepthbuffer[ae]);else{if(t.deleteFramebuffer(k.__webglFramebuffer),k.__webglDepthbuffer&&t.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&t.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let ae=0;ae<k.__webglColorRenderbuffer.length;ae++)k.__webglColorRenderbuffer[ae]&&t.deleteRenderbuffer(k.__webglColorRenderbuffer[ae]);k.__webglDepthRenderbuffer&&t.deleteRenderbuffer(k.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let ae=0,L=b.length;ae<L;ae++){const ne=i.get(b[ae]);ne.__webglTexture&&(t.deleteTexture(ne.__webglTexture),o.memory.textures--),i.remove(b[ae])}i.remove(b),i.remove(A)}let K=0;function q(){K=0}function Y(){const A=K;return A>=l&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+l),K+=1,A}function ce(A){const b=[];return b.push(A.wrapS),b.push(A.wrapT),b.push(A.wrapR||0),b.push(A.magFilter),b.push(A.minFilter),b.push(A.anisotropy),b.push(A.internalFormat),b.push(A.format),b.push(A.type),b.push(A.generateMipmaps),b.push(A.premultiplyAlpha),b.push(A.flipY),b.push(A.unpackAlignment),b.push(A.colorSpace),b.join()}function de(A,b){const k=i.get(A);if(A.isVideoTexture&&le(A),A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){const te=A.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ue(k,A,b);return}}n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+b)}function V(A,b){const k=i.get(A);if(A.version>0&&k.__version!==A.version){ue(k,A,b);return}n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+b)}function Q(A,b){const k=i.get(A);if(A.version>0&&k.__version!==A.version){ue(k,A,b);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+b)}function me(A,b){const k=i.get(A);if(A.version>0&&k.__version!==A.version){Ee(k,A,b);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+b)}const _e={[Sc]:t.REPEAT,[hn]:t.CLAMP_TO_EDGE,[bc]:t.MIRRORED_REPEAT},ye={[Ut]:t.NEAREST,[td]:t.NEAREST_MIPMAP_NEAREST,[sl]:t.NEAREST_MIPMAP_LINEAR,[en]:t.LINEAR,[NS]:t.LINEAR_MIPMAP_NEAREST,[Is]:t.LINEAR_MIPMAP_LINEAR},we={[KS]:t.NEVER,[ib]:t.ALWAYS,[ZS]:t.LESS,[QS]:t.LEQUAL,[JS]:t.EQUAL,[nb]:t.GEQUAL,[eb]:t.GREATER,[tb]:t.NOTEQUAL};function j(A,b,k){if(k?(t.texParameteri(A,t.TEXTURE_WRAP_S,_e[b.wrapS]),t.texParameteri(A,t.TEXTURE_WRAP_T,_e[b.wrapT]),(A===t.TEXTURE_3D||A===t.TEXTURE_2D_ARRAY)&&t.texParameteri(A,t.TEXTURE_WRAP_R,_e[b.wrapR]),t.texParameteri(A,t.TEXTURE_MAG_FILTER,ye[b.magFilter]),t.texParameteri(A,t.TEXTURE_MIN_FILTER,ye[b.minFilter])):(t.texParameteri(A,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(A,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),(A===t.TEXTURE_3D||A===t.TEXTURE_2D_ARRAY)&&t.texParameteri(A,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),(b.wrapS!==hn||b.wrapT!==hn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),t.texParameteri(A,t.TEXTURE_MAG_FILTER,T(b.magFilter)),t.texParameteri(A,t.TEXTURE_MIN_FILTER,T(b.minFilter)),b.minFilter!==Ut&&b.minFilter!==en&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(t.texParameteri(A,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(A,t.TEXTURE_COMPARE_FUNC,we[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const te=e.get("EXT_texture_filter_anisotropic");if(b.magFilter===Ut||b.minFilter!==sl&&b.minFilter!==Is||b.type===fi&&e.has("OES_texture_float_linear")===!1||a===!1&&b.type===Ns&&e.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||i.get(b).__currentAnisotropy)&&(t.texParameterf(A,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy)}}function oe(A,b){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,b.addEventListener("dispose",F));const te=b.source;let ae=m.get(te);ae===void 0&&(ae={},m.set(te,ae));const L=ce(b);if(L!==A.__cacheKey){ae[L]===void 0&&(ae[L]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ae[L].usedTimes++;const ne=ae[A.__cacheKey];ne!==void 0&&(ae[A.__cacheKey].usedTimes--,ne.usedTimes===0&&U(b)),A.__cacheKey=L,A.__webglTexture=ae[L].texture}return k}function ue(A,b,k){let te=t.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(te=t.TEXTURE_2D_ARRAY),b.isData3DTexture&&(te=t.TEXTURE_3D);const ae=oe(A,b),L=b.source;n.bindTexture(te,A.__webglTexture,t.TEXTURE0+k);const ne=i.get(L);if(L.version!==ne.__version||ae===!0){n.activeTexture(t.TEXTURE0+k),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE);const pe=S(b)&&y(b.image)===!1;let Z=v(b.image,pe,!1,u);Z=be(b,Z);const Re=y(Z)||a,Pe=s.convert(b.format,b.colorSpace);let Le=s.convert(b.type),xe=P(b.internalFormat,Pe,Le,b.colorSpace);j(te,b,Re);let Me;const Ie=b.mipmaps,je=a&&b.isVideoTexture!==!0,O=ne.__version===void 0||ae===!0,Se=M(b,Z,Re);if(b.isDepthTexture)xe=t.DEPTH_COMPONENT,a?b.type===fi?xe=t.DEPTH_COMPONENT32F:b.type===ui?xe=t.DEPTH_COMPONENT24:b.type===Gi?xe=t.DEPTH24_STENCIL8:xe=t.DEPTH_COMPONENT16:b.type===fi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Vi&&xe===t.DEPTH_COMPONENT&&b.type!==mu&&b.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=ui,Le=s.convert(b.type)),b.format===Gr&&xe===t.DEPTH_COMPONENT&&(xe=t.DEPTH_STENCIL,b.type!==Gi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Gi,Le=s.convert(b.type))),O&&(je?n.texStorage2D(t.TEXTURE_2D,1,xe,Z.width,Z.height):n.texImage2D(t.TEXTURE_2D,0,xe,Z.width,Z.height,0,Pe,Le,null));else if(b.isDataTexture)if(Ie.length>0&&Re){je&&O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Ie[0].width,Ie[0].height);for(let J=0,ge=Ie.length;J<ge;J++)Me=Ie[J],je?n.texSubImage2D(t.TEXTURE_2D,J,0,0,Me.width,Me.height,Pe,Le,Me.data):n.texImage2D(t.TEXTURE_2D,J,xe,Me.width,Me.height,0,Pe,Le,Me.data);b.generateMipmaps=!1}else je?(O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Z.width,Z.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,Z.width,Z.height,Pe,Le,Z.data)):n.texImage2D(t.TEXTURE_2D,0,xe,Z.width,Z.height,0,Pe,Le,Z.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){je&&O&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Se,xe,Ie[0].width,Ie[0].height,Z.depth);for(let J=0,ge=Ie.length;J<ge;J++)Me=Ie[J],b.format!==pn?Pe!==null?je?n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,Me.width,Me.height,Z.depth,Pe,Me.data,0,0):n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,J,xe,Me.width,Me.height,Z.depth,0,Me.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?n.texSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,Me.width,Me.height,Z.depth,Pe,Le,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,J,xe,Me.width,Me.height,Z.depth,0,Pe,Le,Me.data)}else{je&&O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Ie[0].width,Ie[0].height);for(let J=0,ge=Ie.length;J<ge;J++)Me=Ie[J],b.format!==pn?Pe!==null?je?n.compressedTexSubImage2D(t.TEXTURE_2D,J,0,0,Me.width,Me.height,Pe,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,J,xe,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?n.texSubImage2D(t.TEXTURE_2D,J,0,0,Me.width,Me.height,Pe,Le,Me.data):n.texImage2D(t.TEXTURE_2D,J,xe,Me.width,Me.height,0,Pe,Le,Me.data)}else if(b.isDataArrayTexture)je?(O&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Se,xe,Z.width,Z.height,Z.depth),n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Pe,Le,Z.data)):n.texImage3D(t.TEXTURE_2D_ARRAY,0,xe,Z.width,Z.height,Z.depth,0,Pe,Le,Z.data);else if(b.isData3DTexture)je?(O&&n.texStorage3D(t.TEXTURE_3D,Se,xe,Z.width,Z.height,Z.depth),n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Pe,Le,Z.data)):n.texImage3D(t.TEXTURE_3D,0,xe,Z.width,Z.height,Z.depth,0,Pe,Le,Z.data);else if(b.isFramebufferTexture){if(O)if(je)n.texStorage2D(t.TEXTURE_2D,Se,xe,Z.width,Z.height);else{let J=Z.width,ge=Z.height;for(let Te=0;Te<Se;Te++)n.texImage2D(t.TEXTURE_2D,Te,xe,J,ge,0,Pe,Le,null),J>>=1,ge>>=1}}else if(Ie.length>0&&Re){je&&O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Ie[0].width,Ie[0].height);for(let J=0,ge=Ie.length;J<ge;J++)Me=Ie[J],je?n.texSubImage2D(t.TEXTURE_2D,J,0,0,Pe,Le,Me):n.texImage2D(t.TEXTURE_2D,J,xe,Pe,Le,Me);b.generateMipmaps=!1}else je?(O&&n.texStorage2D(t.TEXTURE_2D,Se,xe,Z.width,Z.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,Pe,Le,Z)):n.texImage2D(t.TEXTURE_2D,0,xe,Pe,Le,Z);R(b,Re)&&w(te),ne.__version=L.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function Ee(A,b,k){if(b.image.length!==6)return;const te=oe(A,b),ae=b.source;n.bindTexture(t.TEXTURE_CUBE_MAP,A.__webglTexture,t.TEXTURE0+k);const L=i.get(ae);if(ae.version!==L.__version||te===!0){n.activeTexture(t.TEXTURE0+k),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.NONE);const ne=b.isCompressedTexture||b.image[0].isCompressedTexture,pe=b.image[0]&&b.image[0].isDataTexture,Z=[];for(let J=0;J<6;J++)!ne&&!pe?Z[J]=v(b.image[J],!1,!0,c):Z[J]=pe?b.image[J].image:b.image[J],Z[J]=be(b,Z[J]);const Re=Z[0],Pe=y(Re)||a,Le=s.convert(b.format,b.colorSpace),xe=s.convert(b.type),Me=P(b.internalFormat,Le,xe,b.colorSpace),Ie=a&&b.isVideoTexture!==!0,je=L.__version===void 0||te===!0;let O=M(b,Re,Pe);j(t.TEXTURE_CUBE_MAP,b,Pe);let Se;if(ne){Ie&&je&&n.texStorage2D(t.TEXTURE_CUBE_MAP,O,Me,Re.width,Re.height);for(let J=0;J<6;J++){Se=Z[J].mipmaps;for(let ge=0;ge<Se.length;ge++){const Te=Se[ge];b.format!==pn?Le!==null?Ie?n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,0,0,Te.width,Te.height,Le,Te.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,Me,Te.width,Te.height,0,Te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,0,0,Te.width,Te.height,Le,xe,Te.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,Me,Te.width,Te.height,0,Le,xe,Te.data)}}}else{Se=b.mipmaps,Ie&&je&&(Se.length>0&&O++,n.texStorage2D(t.TEXTURE_CUBE_MAP,O,Me,Z[0].width,Z[0].height));for(let J=0;J<6;J++)if(pe){Ie?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Z[J].width,Z[J].height,Le,xe,Z[J].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Me,Z[J].width,Z[J].height,0,Le,xe,Z[J].data);for(let ge=0;ge<Se.length;ge++){const Ke=Se[ge].image[J].image;Ie?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,0,0,Ke.width,Ke.height,Le,xe,Ke.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,Me,Ke.width,Ke.height,0,Le,xe,Ke.data)}}else{Ie?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Le,xe,Z[J]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Me,Le,xe,Z[J]);for(let ge=0;ge<Se.length;ge++){const Te=Se[ge];Ie?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,0,0,Le,xe,Te.image[J]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,Me,Le,xe,Te.image[J])}}}R(b,Pe)&&w(t.TEXTURE_CUBE_MAP),L.__version=ae.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function Ae(A,b,k,te,ae){const L=s.convert(k.format,k.colorSpace),ne=s.convert(k.type),pe=P(k.internalFormat,L,ne,k.colorSpace);i.get(b).__hasExternalTextures||(ae===t.TEXTURE_3D||ae===t.TEXTURE_2D_ARRAY?n.texImage3D(ae,0,pe,b.width,b.height,b.depth,0,L,ne,null):n.texImage2D(ae,0,pe,b.width,b.height,0,L,ne,null)),n.bindFramebuffer(t.FRAMEBUFFER,A),fe(b)?h.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,te,ae,i.get(k).__webglTexture,0,ee(b)):(ae===t.TEXTURE_2D||ae>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,te,ae,i.get(k).__webglTexture,0),n.bindFramebuffer(t.FRAMEBUFFER,null)}function E(A,b,k){if(t.bindRenderbuffer(t.RENDERBUFFER,A),b.depthBuffer&&!b.stencilBuffer){let te=t.DEPTH_COMPONENT16;if(k||fe(b)){const ae=b.depthTexture;ae&&ae.isDepthTexture&&(ae.type===fi?te=t.DEPTH_COMPONENT32F:ae.type===ui&&(te=t.DEPTH_COMPONENT24));const L=ee(b);fe(b)?h.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,L,te,b.width,b.height):t.renderbufferStorageMultisample(t.RENDERBUFFER,L,te,b.width,b.height)}else t.renderbufferStorage(t.RENDERBUFFER,te,b.width,b.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,A)}else if(b.depthBuffer&&b.stencilBuffer){const te=ee(b);k&&fe(b)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,te,t.DEPTH24_STENCIL8,b.width,b.height):fe(b)?h.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,te,t.DEPTH24_STENCIL8,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,A)}else{const te=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let ae=0;ae<te.length;ae++){const L=te[ae],ne=s.convert(L.format,L.colorSpace),pe=s.convert(L.type),Z=P(L.internalFormat,ne,pe,L.colorSpace),Re=ee(b);k&&fe(b)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Re,Z,b.width,b.height):fe(b)?h.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Re,Z,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,Z,b.width,b.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function D(A,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,A),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),de(b.depthTexture,0);const te=i.get(b.depthTexture).__webglTexture,ae=ee(b);if(b.depthTexture.format===Vi)fe(b)?h.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0);else if(b.depthTexture.format===Gr)fe(b)?h.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function I(A){const b=i.get(A),k=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!b.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");D(b.__webglFramebuffer,A)}else if(k){b.__webglDepthbuffer=[];for(let te=0;te<6;te++)n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[te]),b.__webglDepthbuffer[te]=t.createRenderbuffer(),E(b.__webglDepthbuffer[te],A,!1)}else n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=t.createRenderbuffer(),E(b.__webglDepthbuffer,A,!1);n.bindFramebuffer(t.FRAMEBUFFER,null)}function z(A,b,k){const te=i.get(A);b!==void 0&&Ae(te.__webglFramebuffer,A,A.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D),k!==void 0&&I(A)}function W(A){const b=A.texture,k=i.get(A),te=i.get(b);A.addEventListener("dispose",H),A.isWebGLMultipleRenderTargets!==!0&&(te.__webglTexture===void 0&&(te.__webglTexture=t.createTexture()),te.__version=b.version,o.memory.textures++);const ae=A.isWebGLCubeRenderTarget===!0,L=A.isWebGLMultipleRenderTargets===!0,ne=y(A)||a;if(ae){k.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)k.__webglFramebuffer[pe]=t.createFramebuffer()}else{if(k.__webglFramebuffer=t.createFramebuffer(),L)if(r.drawBuffers){const pe=A.texture;for(let Z=0,Re=pe.length;Z<Re;Z++){const Pe=i.get(pe[Z]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=t.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&fe(A)===!1){const pe=L?b:[b];k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<pe.length;Z++){const Re=pe[Z];k.__webglColorRenderbuffer[Z]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);const Pe=s.convert(Re.format,Re.colorSpace),Le=s.convert(Re.type),xe=P(Re.internalFormat,Pe,Le,Re.colorSpace,A.isXRRenderTarget===!0),Me=ee(A);t.renderbufferStorageMultisample(t.RENDERBUFFER,Me,xe,A.width,A.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Z,t.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}t.bindRenderbuffer(t.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),E(k.__webglDepthRenderbuffer,A,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ae){n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),j(t.TEXTURE_CUBE_MAP,b,ne);for(let pe=0;pe<6;pe++)Ae(k.__webglFramebuffer[pe],A,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+pe);R(b,ne)&&w(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(L){const pe=A.texture;for(let Z=0,Re=pe.length;Z<Re;Z++){const Pe=pe[Z],Le=i.get(Pe);n.bindTexture(t.TEXTURE_2D,Le.__webglTexture),j(t.TEXTURE_2D,Pe,ne),Ae(k.__webglFramebuffer,A,Pe,t.COLOR_ATTACHMENT0+Z,t.TEXTURE_2D),R(Pe,ne)&&w(t.TEXTURE_2D)}n.unbindTexture()}else{let pe=t.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?pe=A.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(pe,te.__webglTexture),j(pe,b,ne),Ae(k.__webglFramebuffer,A,b,t.COLOR_ATTACHMENT0,pe),R(b,ne)&&w(pe),n.unbindTexture()}A.depthBuffer&&I(A)}function ie(A){const b=y(A)||a,k=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let te=0,ae=k.length;te<ae;te++){const L=k[te];if(R(L,b)){const ne=A.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,pe=i.get(L).__webglTexture;n.bindTexture(ne,pe),w(ne),n.unbindTexture()}}}function he(A){if(a&&A.samples>0&&fe(A)===!1){const b=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],k=A.width,te=A.height;let ae=t.COLOR_BUFFER_BIT;const L=[],ne=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,pe=i.get(A),Z=A.isWebGLMultipleRenderTargets===!0;if(Z)for(let Re=0;Re<b.length;Re++)n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let Re=0;Re<b.length;Re++){L.push(t.COLOR_ATTACHMENT0+Re),A.depthBuffer&&L.push(ne);const Pe=pe.__ignoreDepthValues!==void 0?pe.__ignoreDepthValues:!1;if(Pe===!1&&(A.depthBuffer&&(ae|=t.DEPTH_BUFFER_BIT),A.stencilBuffer&&(ae|=t.STENCIL_BUFFER_BIT)),Z&&t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,pe.__webglColorRenderbuffer[Re]),Pe===!0&&(t.invalidateFramebuffer(t.READ_FRAMEBUFFER,[ne]),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[ne])),Z){const Le=i.get(b[Re]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Le,0)}t.blitFramebuffer(0,0,k,te,0,0,k,te,ae,t.NEAREST),p&&t.invalidateFramebuffer(t.READ_FRAMEBUFFER,L)}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),Z)for(let Re=0;Re<b.length;Re++){n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.RENDERBUFFER,pe.__webglColorRenderbuffer[Re]);const Pe=i.get(b[Re]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,pe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Re,t.TEXTURE_2D,Pe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}}function ee(A){return Math.min(f,A.samples)}function fe(A){const b=i.get(A);return a&&A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function le(A){const b=o.render.frame;g.get(A)!==b&&(g.set(A,b),A.update())}function be(A,b){const k=A.colorSpace,te=A.format,ae=A.type;return A.isCompressedTexture===!0||A.format===Tc||k!==Rn&&k!==Xi&&(k===Ge?a===!1?e.has("EXT_sRGB")===!0&&te===pn?(A.format=Tc,A.minFilter=en,A.generateMipmaps=!1):b=ig.sRGBToLinear(b):(te!==pn||ae!==_i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),b}this.allocateTextureUnit=Y,this.resetTextureUnits=q,this.setTexture2D=de,this.setTexture2DArray=V,this.setTexture3D=Q,this.setTextureCube=me,this.rebindTextures=z,this.setupRenderTarget=W,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=he,this.setupDepthRenderbuffer=I,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=fe}function iC(t,e,n){const i=n.isWebGL2;function r(s,o=Xi){let a;if(s===_i)return t.UNSIGNED_BYTE;if(s===Ym)return t.UNSIGNED_SHORT_4_4_4_4;if(s===Km)return t.UNSIGNED_SHORT_5_5_5_1;if(s===OS)return t.BYTE;if(s===FS)return t.SHORT;if(s===mu)return t.UNSIGNED_SHORT;if(s===$m)return t.INT;if(s===ui)return t.UNSIGNED_INT;if(s===fi)return t.FLOAT;if(s===Ns)return i?t.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===BS)return t.ALPHA;if(s===pn)return t.RGBA;if(s===HS)return t.LUMINANCE;if(s===kS)return t.LUMINANCE_ALPHA;if(s===Vi)return t.DEPTH_COMPONENT;if(s===Gr)return t.DEPTH_STENCIL;if(s===Tc)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===zS)return t.RED;if(s===Zm)return t.RED_INTEGER;if(s===GS)return t.RG;if(s===Jm)return t.RG_INTEGER;if(s===Qm)return t.RGBA_INTEGER;if(s===ol||s===al||s===ll||s===cl)if(o===Ge)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===ol)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===al)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===ll)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===cl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===ol)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===al)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===ll)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===cl)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===nd||s===id||s===rd||s===sd)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===nd)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===id)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===rd)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===sd)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===VS)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===od||s===ad)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===od)return o===Ge?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===ad)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===ld||s===cd||s===ud||s===fd||s===dd||s===hd||s===pd||s===md||s===gd||s===_d||s===vd||s===xd||s===yd||s===Md)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===ld)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===cd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===ud)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===fd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===dd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===hd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===pd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===md)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===gd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===_d)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===vd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===xd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===yd)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Md)return o===Ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===ul)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===ul)return o===Ge?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT}else return null;if(s===WS||s===Ed||s===Sd||s===bd)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===ul)return a.COMPRESSED_RED_RGTC1_EXT;if(s===Ed)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Sd)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===bd)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Gi?i?t.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):t[s]!==void 0?t[s]:null}return{convert:r}}class rC extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Fo extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sC={type:"move"};class Il{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const m=n.getJointPose(x,i),d=this._getHandJoint(c,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sC)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Fo;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}class oC extends Kt{constructor(e,n,i,r,s,o,a,l,c,u){if(u=u!==void 0?u:Vi,u!==Vi&&u!==Gr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Vi&&(i=ui),i===void 0&&u===Gr&&(i=Gi),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:Ut,this.minFilter=l!==void 0?l:Ut,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class aC extends Zi{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,p=null,g=null;const x=n.getContextAttributes();let m=null,d=null;const _=[],v=[],y=new $t;y.layers.enable(1),y.viewport=new bt;const S=new $t;S.layers.enable(2),S.viewport=new bt;const R=[y,S],w=new rC;w.layers.enable(1),w.layers.enable(2);let P=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let Q=_[V];return Q===void 0&&(Q=new Il,_[V]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(V){let Q=_[V];return Q===void 0&&(Q=new Il,_[V]=Q),Q.getGripSpace()},this.getHand=function(V){let Q=_[V];return Q===void 0&&(Q=new Il,_[V]=Q),Q.getHandSpace()};function T(V){const Q=v.indexOf(V.inputSource);if(Q===-1)return;const me=_[Q];me!==void 0&&(me.update(V.inputSource,V.frame,c||o),me.dispatchEvent({type:V.type,data:V.inputSource}))}function F(){r.removeEventListener("select",T),r.removeEventListener("selectstart",T),r.removeEventListener("selectend",T),r.removeEventListener("squeeze",T),r.removeEventListener("squeezestart",T),r.removeEventListener("squeezeend",T),r.removeEventListener("end",F),r.removeEventListener("inputsourceschange",H);for(let V=0;V<_.length;V++){const Q=v[V];Q!==null&&(v[V]=null,_[V].disconnect(Q))}P=null,M=null,e.setRenderTarget(m),p=null,h=null,f=null,r=null,d=null,de.stop(),i.isPresenting=!1,i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){s=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(m=e.getRenderTarget(),r.addEventListener("select",T),r.addEventListener("selectstart",T),r.addEventListener("selectend",T),r.addEventListener("squeeze",T),r.addEventListener("squeezestart",T),r.addEventListener("squeezeend",T),r.addEventListener("end",F),r.addEventListener("inputsourceschange",H),x.xrCompatible!==!0&&await n.makeXRCompatible(),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Q={antialias:r.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,Q),r.updateRenderState({baseLayer:p}),d=new qi(p.framebufferWidth,p.framebufferHeight,{format:pn,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let Q=null,me=null,_e=null;x.depth&&(_e=x.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Q=x.stencil?Gr:Vi,me=x.stencil?Gi:ui);const ye={colorFormat:n.RGBA8,depthFormat:_e,scaleFactor:s};f=new XRWebGLBinding(r,n),h=f.createProjectionLayer(ye),r.updateRenderState({layers:[h]}),d=new qi(h.textureWidth,h.textureHeight,{format:pn,type:_i,depthTexture:new oC(h.textureWidth,h.textureHeight,me,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0});const we=e.properties.get(d);we.__ignoreDepthValues=h.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),de.setContext(r),de.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function H(V){for(let Q=0;Q<V.removed.length;Q++){const me=V.removed[Q],_e=v.indexOf(me);_e>=0&&(v[_e]=null,_[_e].disconnect(me))}for(let Q=0;Q<V.added.length;Q++){const me=V.added[Q];let _e=v.indexOf(me);if(_e===-1){for(let we=0;we<_.length;we++)if(we>=v.length){v.push(me),_e=we;break}else if(v[we]===null){v[we]=me,_e=we;break}if(_e===-1)break}const ye=_[_e];ye&&ye.connect(me)}}const N=new X,U=new X;function B(V,Q,me){N.setFromMatrixPosition(Q.matrixWorld),U.setFromMatrixPosition(me.matrixWorld);const _e=N.distanceTo(U),ye=Q.projectionMatrix.elements,we=me.projectionMatrix.elements,j=ye[14]/(ye[10]-1),oe=ye[14]/(ye[10]+1),ue=(ye[9]+1)/ye[5],Ee=(ye[9]-1)/ye[5],Ae=(ye[8]-1)/ye[0],E=(we[8]+1)/we[0],D=j*Ae,I=j*E,z=_e/(-Ae+E),W=z*-Ae;Q.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(W),V.translateZ(z),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const ie=j+z,he=oe+z,ee=D-W,fe=I+(_e-W),le=ue*oe/he*ie,be=Ee*oe/he*ie;V.projectionMatrix.makePerspective(ee,fe,le,be,ie,he),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function K(V,Q){Q===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(Q.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;w.near=S.near=y.near=V.near,w.far=S.far=y.far=V.far,(P!==w.near||M!==w.far)&&(r.updateRenderState({depthNear:w.near,depthFar:w.far}),P=w.near,M=w.far);const Q=V.parent,me=w.cameras;K(w,Q);for(let _e=0;_e<me.length;_e++)K(me[_e],Q);me.length===2?B(w,y,S):w.projectionMatrix.copy(y.projectionMatrix),q(V,w,Q)};function q(V,Q,me){me===null?V.matrix.copy(Q.matrixWorld):(V.matrix.copy(me.matrixWorld),V.matrix.invert(),V.matrix.multiply(Q.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0);const _e=V.children;for(let ye=0,we=_e.length;ye<we;ye++)_e[ye].updateMatrixWorld(!0);V.projectionMatrix.copy(Q.projectionMatrix),V.projectionMatrixInverse.copy(Q.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ac*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(V){l=V,h!==null&&(h.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)};let Y=null;function ce(V,Q){if(u=Q.getViewerPose(c||o),g=Q,u!==null){const me=u.views;p!==null&&(e.setRenderTargetFramebuffer(d,p.framebuffer),e.setRenderTarget(d));let _e=!1;me.length!==w.cameras.length&&(w.cameras.length=0,_e=!0);for(let ye=0;ye<me.length;ye++){const we=me[ye];let j=null;if(p!==null)j=p.getViewport(we);else{const ue=f.getViewSubImage(h,we);j=ue.viewport,ye===0&&(e.setRenderTargetTextures(d,ue.colorTexture,h.ignoreDepthValues?void 0:ue.depthStencilTexture),e.setRenderTarget(d))}let oe=R[ye];oe===void 0&&(oe=new $t,oe.layers.enable(ye),oe.viewport=new bt,R[ye]=oe),oe.matrix.fromArray(we.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(we.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(j.x,j.y,j.width,j.height),ye===0&&(w.matrix.copy(oe.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),_e===!0&&w.cameras.push(oe)}}for(let me=0;me<_.length;me++){const _e=v[me],ye=_[me];_e!==null&&ye!==void 0&&ye.update(_e,Q,c||o)}Y&&Y(V,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const de=new gg;de.setAnimationLoop(ce),this.setAnimationLoop=function(V){Y=V},this.dispose=function(){}}}function lC(t,e){function n(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,dg(t)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,_,v,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),f(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),h(m,d),d.isMeshPhysicalMaterial&&p(m,d,y)):d.isMeshMatcapMaterial?(s(m,d),g(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),x(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,_,v):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,n(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===kt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,n(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===kt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,n(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,n(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const _=e.get(d).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const v=t.useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*v,n(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,_,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*_,m.scale.value=v*.5,d.map&&(m.map.value=d.map,n(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,m.roughnessMapTransform)),e.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,_){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===kt&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){const _=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function cC(t,e,n,i){let r={},s={},o=[];const a=n.isWebGL2?t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,v){const y=v.program;i.uniformBlockBinding(_,y)}function c(_,v){let y=r[_.id];y===void 0&&(g(_),y=u(_),r[_.id]=y,_.addEventListener("dispose",m));const S=v.program;i.updateUBOMapping(_,S);const R=e.render.frame;s[_.id]!==R&&(h(_),s[_.id]=R)}function u(_){const v=f();_.__bindingPointIndex=v;const y=t.createBuffer(),S=_.__size,R=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,S,R),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,v,y),y}function f(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){const v=r[_.id],y=_.uniforms,S=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,v);for(let R=0,w=y.length;R<w;R++){const P=y[R];if(p(P,R,S)===!0){const M=P.__offset,T=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let H=0;H<T.length;H++){const N=T[H],U=x(N);typeof N=="number"?(P.__data[0]=N,t.bufferSubData(t.UNIFORM_BUFFER,M+F,P.__data)):N.isMatrix3?(P.__data[0]=N.elements[0],P.__data[1]=N.elements[1],P.__data[2]=N.elements[2],P.__data[3]=N.elements[0],P.__data[4]=N.elements[3],P.__data[5]=N.elements[4],P.__data[6]=N.elements[5],P.__data[7]=N.elements[0],P.__data[8]=N.elements[6],P.__data[9]=N.elements[7],P.__data[10]=N.elements[8],P.__data[11]=N.elements[0]):(N.toArray(P.__data,F),F+=U.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,M,P.__data)}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(_,v,y){const S=_.value;if(y[v]===void 0){if(typeof S=="number")y[v]=S;else{const R=Array.isArray(S)?S:[S],w=[];for(let P=0;P<R.length;P++)w.push(R[P].clone());y[v]=w}return!0}else if(typeof S=="number"){if(y[v]!==S)return y[v]=S,!0}else{const R=Array.isArray(y[v])?y[v]:[y[v]],w=Array.isArray(S)?S:[S];for(let P=0;P<R.length;P++){const M=R[P];if(M.equals(w[P])===!1)return M.copy(w[P]),!0}}return!1}function g(_){const v=_.uniforms;let y=0;const S=16;let R=0;for(let w=0,P=v.length;w<P;w++){const M=v[w],T={boundary:0,storage:0},F=Array.isArray(M.value)?M.value:[M.value];for(let H=0,N=F.length;H<N;H++){const U=F[H],B=x(U);T.boundary+=B.boundary,T.storage+=B.storage}if(M.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),M.__offset=y,w>0){R=y%S;const H=S-R;R!==0&&H-T.boundary<0&&(y+=S-R,M.__offset=y)}y+=T.storage}return R=y%S,R>0&&(y+=S-R),_.__size=y,_.__cache={},this}function x(_){const v={boundary:0,storage:0};return typeof _=="number"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function d(){for(const _ in r)t.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}function uC(){const t=da("canvas");return t.style.display="block",t}class Mg{constructor(e={}){const{canvas:n=uC(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let h;i!==null?h=i.getContextAttributes().alpha:h=o;const p=new Uint32Array(4),g=new Int32Array(4);let x=null,m=null;const d=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=Ge,this.useLegacyLights=!0,this.toneMapping=Gn,this.toneMappingExposure=1;const v=this;let y=!1,S=0,R=0,w=null,P=-1,M=null;const T=new bt,F=new bt;let H=null;const N=new Qe(0);let U=0,B=n.width,K=n.height,q=1,Y=null,ce=null;const de=new bt(0,0,B,K),V=new bt(0,0,B,K);let Q=!1;const me=new mg;let _e=!1,ye=!1,we=null;const j=new Mt,oe=new Xe,ue=new X,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ae(){return w===null?q:1}let E=i;function D(C,$){for(let re=0;re<C.length;re++){const G=C[re],se=n.getContext(G,$);if(se!==null)return se}return null}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${pu}`),n.addEventListener("webglcontextlost",Se,!1),n.addEventListener("webglcontextrestored",J,!1),n.addEventListener("webglcontextcreationerror",ge,!1),E===null){const $=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&$.shift(),E=D($,C),E===null)throw D($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&E instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),E.getShaderPrecisionFormat===void 0&&(E.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let I,z,W,ie,he,ee,fe,le,be,A,b,k,te,ae,L,ne,pe,Z,Re,Pe,Le,xe,Me,Ie;function je(){I=new yw(E),z=new hw(E,I,e),I.init(z),xe=new iC(E,I,z),W=new tC(E,I,z),ie=new Sw(E),he=new zR,ee=new nC(E,I,W,he,z,xe,ie),fe=new mw(v),le=new xw(v),be=new Db(E,z),Me=new fw(E,I,be,z),A=new Mw(E,be,ie,Me),b=new ww(E,A,be,ie),Re=new Aw(E,z,ee),ne=new pw(he),k=new kR(v,fe,le,I,z,Me,ne),te=new lC(v,he),ae=new VR,L=new YR(I,z),Z=new uw(v,fe,le,W,b,h,l),pe=new eC(v,b,z),Ie=new cC(E,ie,z,W),Pe=new dw(E,I,ie,z),Le=new Ew(E,I,ie,z),ie.programs=k.programs,v.capabilities=z,v.extensions=I,v.properties=he,v.renderLists=ae,v.shadowMap=pe,v.state=W,v.info=ie}je();const O=new aC(v,E);this.xr=O,this.getContext=function(){return E},this.getContextAttributes=function(){return E.getContextAttributes()},this.forceContextLoss=function(){const C=I.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=I.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(C){C!==void 0&&(q=C,this.setSize(B,K,!1))},this.getSize=function(C){return C.set(B,K)},this.setSize=function(C,$,re=!0){if(O.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=C,K=$,n.width=Math.floor(C*q),n.height=Math.floor($*q),re===!0&&(n.style.width=C+"px",n.style.height=$+"px"),this.setViewport(0,0,C,$)},this.getDrawingBufferSize=function(C){return C.set(B*q,K*q).floor()},this.setDrawingBufferSize=function(C,$,re){B=C,K=$,q=re,n.width=Math.floor(C*re),n.height=Math.floor($*re),this.setViewport(0,0,C,$)},this.getCurrentViewport=function(C){return C.copy(T)},this.getViewport=function(C){return C.copy(de)},this.setViewport=function(C,$,re,G){C.isVector4?de.set(C.x,C.y,C.z,C.w):de.set(C,$,re,G),W.viewport(T.copy(de).multiplyScalar(q).floor())},this.getScissor=function(C){return C.copy(V)},this.setScissor=function(C,$,re,G){C.isVector4?V.set(C.x,C.y,C.z,C.w):V.set(C,$,re,G),W.scissor(F.copy(V).multiplyScalar(q).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(C){W.setScissorTest(Q=C)},this.setOpaqueSort=function(C){Y=C},this.setTransparentSort=function(C){ce=C},this.getClearColor=function(C){return C.copy(Z.getClearColor())},this.setClearColor=function(){Z.setClearColor.apply(Z,arguments)},this.getClearAlpha=function(){return Z.getClearAlpha()},this.setClearAlpha=function(){Z.setClearAlpha.apply(Z,arguments)},this.clear=function(C=!0,$=!0,re=!0){let G=0;if(C){let se=!1;if(w!==null){const Ce=w.texture.format;se=Ce===Qm||Ce===Jm||Ce===Zm}if(se){const Ce=w.texture.type,Ne=Ce===_i||Ce===ui||Ce===mu||Ce===Gi||Ce===Ym||Ce===Km,Oe=Z.getClearColor(),Fe=Z.getClearAlpha(),We=Oe.r,He=Oe.g,ke=Oe.b;Ne?(p[0]=We,p[1]=He,p[2]=ke,p[3]=Fe,E.clearBufferuiv(E.COLOR,0,p)):(g[0]=We,g[1]=He,g[2]=ke,g[3]=Fe,E.clearBufferiv(E.COLOR,0,g))}else G|=E.COLOR_BUFFER_BIT}$&&(G|=E.DEPTH_BUFFER_BIT),re&&(G|=E.STENCIL_BUFFER_BIT),E.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Se,!1),n.removeEventListener("webglcontextrestored",J,!1),n.removeEventListener("webglcontextcreationerror",ge,!1),ae.dispose(),L.dispose(),he.dispose(),fe.dispose(),le.dispose(),b.dispose(),Me.dispose(),Ie.dispose(),k.dispose(),O.dispose(),O.removeEventListener("sessionstart",lt),O.removeEventListener("sessionend",yn),we&&(we.dispose(),we=null),Ct.stop()};function Se(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function J(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const C=ie.autoReset,$=pe.enabled,re=pe.autoUpdate,G=pe.needsUpdate,se=pe.type;je(),ie.autoReset=C,pe.enabled=$,pe.autoUpdate=re,pe.needsUpdate=G,pe.type=se}function ge(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Te(C){const $=C.target;$.removeEventListener("dispose",Te),Ke($)}function Ke(C){rt(C),he.remove(C)}function rt(C){const $=he.get(C).programs;$!==void 0&&($.forEach(function(re){k.releaseProgram(re)}),C.isShaderMaterial&&k.releaseShaderCache(C))}this.renderBufferDirect=function(C,$,re,G,se,Ce){$===null&&($=Ee);const Ne=se.isMesh&&se.matrixWorld.determinant()<0,Oe=wg(C,$,re,G,se);W.setMaterial(G,Ne);let Fe=re.index,We=1;G.wireframe===!0&&(Fe=A.getWireframeAttribute(re),We=2);const He=re.drawRange,ke=re.attributes.position;let ct=He.start*We,ut=(He.start+He.count)*We;Ce!==null&&(ct=Math.max(ct,Ce.start*We),ut=Math.min(ut,(Ce.start+Ce.count)*We)),Fe!==null?(ct=Math.max(ct,0),ut=Math.min(ut,Fe.count)):ke!=null&&(ct=Math.max(ct,0),ut=Math.min(ut,ke.count));const sn=ut-ct;if(sn<0||sn===1/0)return;Me.setup(se,G,Oe,re,Fe);let Cn,ft=Pe;if(Fe!==null&&(Cn=be.get(Fe),ft=Le,ft.setIndex(Cn)),se.isMesh)G.wireframe===!0?(W.setLineWidth(G.wireframeLinewidth*Ae()),ft.setMode(E.LINES)):ft.setMode(E.TRIANGLES);else if(se.isLine){let $e=G.linewidth;$e===void 0&&($e=1),W.setLineWidth($e*Ae()),se.isLineSegments?ft.setMode(E.LINES):se.isLineLoop?ft.setMode(E.LINE_LOOP):ft.setMode(E.LINE_STRIP)}else se.isPoints?ft.setMode(E.POINTS):se.isSprite&&ft.setMode(E.TRIANGLES);if(se.isInstancedMesh)ft.renderInstances(ct,sn,se.count);else if(re.isInstancedBufferGeometry){const $e=re._maxInstanceCount!==void 0?re._maxInstanceCount:1/0,Na=Math.min(re.instanceCount,$e);ft.renderInstances(ct,sn,Na)}else ft.render(ct,sn)},this.compile=function(C,$){function re(G,se,Ce){G.transparent===!0&&G.side===Hn&&G.forceSinglePass===!1?(G.side=kt,G.needsUpdate=!0,to(G,se,Ce),G.side=xi,G.needsUpdate=!0,to(G,se,Ce),G.side=Hn):to(G,se,Ce)}m=L.get(C),m.init(),_.push(m),C.traverseVisible(function(G){G.isLight&&G.layers.test($.layers)&&(m.pushLight(G),G.castShadow&&m.pushShadow(G))}),m.setupLights(v.useLegacyLights),C.traverse(function(G){const se=G.material;if(se)if(Array.isArray(se))for(let Ce=0;Ce<se.length;Ce++){const Ne=se[Ce];re(Ne,C,G)}else re(se,C,G)}),_.pop(),m=null};let vt=null;function xn(C){vt&&vt(C)}function lt(){Ct.stop()}function yn(){Ct.start()}const Ct=new gg;Ct.setAnimationLoop(xn),typeof self<"u"&&Ct.setContext(self),this.setAnimationLoop=function(C){vt=C,O.setAnimationLoop(C),C===null?Ct.stop():Ct.start()},O.addEventListener("sessionstart",lt),O.addEventListener("sessionend",yn),this.render=function(C,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),O.enabled===!0&&O.isPresenting===!0&&(O.cameraAutoUpdate===!0&&O.updateCamera($),$=O.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,$,w),m=L.get(C,_.length),m.init(),_.push(m),j.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),me.setFromProjectionMatrix(j),ye=this.localClippingEnabled,_e=ne.init(this.clippingPlanes,ye),x=ae.get(C,d.length),x.init(),d.push(x),vu(C,$,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(Y,ce),this.info.render.frame++,_e===!0&&ne.beginShadows();const re=m.state.shadowsArray;if(pe.render(re,C,$),_e===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset(),Z.render(x,C),m.setupLights(v.useLegacyLights),$.isArrayCamera){const G=$.cameras;for(let se=0,Ce=G.length;se<Ce;se++){const Ne=G[se];xu(x,C,Ne,Ne.viewport)}}else xu(x,C,$);w!==null&&(ee.updateMultisampleRenderTarget(w),ee.updateRenderTargetMipmap(w)),C.isScene===!0&&C.onAfterRender(v,C,$),Me.resetDefaultState(),P=-1,M=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function vu(C,$,re,G){if(C.visible===!1)return;if(C.layers.test($.layers)){if(C.isGroup)re=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update($);else if(C.isLight)m.pushLight(C),C.castShadow&&m.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||me.intersectsSprite(C)){G&&ue.setFromMatrixPosition(C.matrixWorld).applyMatrix4(j);const Ne=b.update(C),Oe=C.material;Oe.visible&&x.push(C,Ne,Oe,re,ue.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||me.intersectsObject(C))){const Ne=b.update(C),Oe=C.material;if(G&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),ue.copy(C.boundingSphere.center)):(Ne.boundingSphere===null&&Ne.computeBoundingSphere(),ue.copy(Ne.boundingSphere.center)),ue.applyMatrix4(C.matrixWorld).applyMatrix4(j)),Array.isArray(Oe)){const Fe=Ne.groups;for(let We=0,He=Fe.length;We<He;We++){const ke=Fe[We],ct=Oe[ke.materialIndex];ct&&ct.visible&&x.push(C,Ne,ct,re,ue.z,ke)}}else Oe.visible&&x.push(C,Ne,Oe,re,ue.z,null)}}const Ce=C.children;for(let Ne=0,Oe=Ce.length;Ne<Oe;Ne++)vu(Ce[Ne],$,re,G)}function xu(C,$,re,G){const se=C.opaque,Ce=C.transmissive,Ne=C.transparent;m.setupLightsView(re),_e===!0&&ne.setGlobalState(v.clippingPlanes,re),Ce.length>0&&Ag(se,Ce,$,re),G&&W.viewport(T.copy(G)),se.length>0&&eo(se,$,re),Ce.length>0&&eo(Ce,$,re),Ne.length>0&&eo(Ne,$,re),W.buffers.depth.setTest(!0),W.buffers.depth.setMask(!0),W.buffers.color.setMask(!0),W.setPolygonOffset(!1)}function Ag(C,$,re,G){const se=z.isWebGL2;we===null&&(we=new qi(1,1,{generateMipmaps:!0,type:I.has("EXT_color_buffer_half_float")?Ns:_i,minFilter:Is,samples:se?4:0})),v.getDrawingBufferSize(oe),se?we.setSize(oe.x,oe.y):we.setSize(wc(oe.x),wc(oe.y));const Ce=v.getRenderTarget();v.setRenderTarget(we),v.getClearColor(N),U=v.getClearAlpha(),U<1&&v.setClearColor(16777215,.5),v.clear();const Ne=v.toneMapping;v.toneMapping=Gn,eo(C,re,G),ee.updateMultisampleRenderTarget(we),ee.updateRenderTargetMipmap(we);let Oe=!1;for(let Fe=0,We=$.length;Fe<We;Fe++){const He=$[Fe],ke=He.object,ct=He.geometry,ut=He.material,sn=He.group;if(ut.side===Hn&&ke.layers.test(G.layers)){const Cn=ut.side;ut.side=kt,ut.needsUpdate=!0,yu(ke,re,G,ct,ut,sn),ut.side=Cn,ut.needsUpdate=!0,Oe=!0}}Oe===!0&&(ee.updateMultisampleRenderTarget(we),ee.updateRenderTargetMipmap(we)),v.setRenderTarget(Ce),v.setClearColor(N,U),v.toneMapping=Ne}function eo(C,$,re){const G=$.isScene===!0?$.overrideMaterial:null;for(let se=0,Ce=C.length;se<Ce;se++){const Ne=C[se],Oe=Ne.object,Fe=Ne.geometry,We=G===null?Ne.material:G,He=Ne.group;Oe.layers.test(re.layers)&&yu(Oe,$,re,Fe,We,He)}}function yu(C,$,re,G,se,Ce){C.onBeforeRender(v,$,re,G,se,Ce),C.modelViewMatrix.multiplyMatrices(re.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),se.onBeforeRender(v,$,re,G,C,Ce),se.transparent===!0&&se.side===Hn&&se.forceSinglePass===!1?(se.side=kt,se.needsUpdate=!0,v.renderBufferDirect(re,$,G,se,C,Ce),se.side=xi,se.needsUpdate=!0,v.renderBufferDirect(re,$,G,se,C,Ce),se.side=Hn):v.renderBufferDirect(re,$,G,se,C,Ce),C.onAfterRender(v,$,re,G,se,Ce)}function to(C,$,re){$.isScene!==!0&&($=Ee);const G=he.get(C),se=m.state.lights,Ce=m.state.shadowsArray,Ne=se.state.version,Oe=k.getParameters(C,se.state,Ce,$,re),Fe=k.getProgramCacheKey(Oe);let We=G.programs;G.environment=C.isMeshStandardMaterial?$.environment:null,G.fog=$.fog,G.envMap=(C.isMeshStandardMaterial?le:fe).get(C.envMap||G.environment),We===void 0&&(C.addEventListener("dispose",Te),We=new Map,G.programs=We);let He=We.get(Fe);if(He!==void 0){if(G.currentProgram===He&&G.lightsStateVersion===Ne)return Mu(C,Oe),He}else Oe.uniforms=k.getUniforms(C),C.onBuild(re,Oe,v),C.onBeforeCompile(Oe,v),He=k.acquireProgram(Oe,Fe),We.set(Fe,He),G.uniforms=Oe.uniforms;const ke=G.uniforms;(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(ke.clippingPlanes=ne.uniform),Mu(C,Oe),G.needsLights=Cg(C),G.lightsStateVersion=Ne,G.needsLights&&(ke.ambientLightColor.value=se.state.ambient,ke.lightProbe.value=se.state.probe,ke.directionalLights.value=se.state.directional,ke.directionalLightShadows.value=se.state.directionalShadow,ke.spotLights.value=se.state.spot,ke.spotLightShadows.value=se.state.spotShadow,ke.rectAreaLights.value=se.state.rectArea,ke.ltc_1.value=se.state.rectAreaLTC1,ke.ltc_2.value=se.state.rectAreaLTC2,ke.pointLights.value=se.state.point,ke.pointLightShadows.value=se.state.pointShadow,ke.hemisphereLights.value=se.state.hemi,ke.directionalShadowMap.value=se.state.directionalShadowMap,ke.directionalShadowMatrix.value=se.state.directionalShadowMatrix,ke.spotShadowMap.value=se.state.spotShadowMap,ke.spotLightMatrix.value=se.state.spotLightMatrix,ke.spotLightMap.value=se.state.spotLightMap,ke.pointShadowMap.value=se.state.pointShadowMap,ke.pointShadowMatrix.value=se.state.pointShadowMatrix);const ct=He.getUniforms(),ut=Vo.seqWithValue(ct.seq,ke);return G.currentProgram=He,G.uniformsList=ut,He}function Mu(C,$){const re=he.get(C);re.outputColorSpace=$.outputColorSpace,re.instancing=$.instancing,re.skinning=$.skinning,re.morphTargets=$.morphTargets,re.morphNormals=$.morphNormals,re.morphColors=$.morphColors,re.morphTargetsCount=$.morphTargetsCount,re.numClippingPlanes=$.numClippingPlanes,re.numIntersection=$.numClipIntersection,re.vertexAlphas=$.vertexAlphas,re.vertexTangents=$.vertexTangents,re.toneMapping=$.toneMapping}function wg(C,$,re,G,se){$.isScene!==!0&&($=Ee),ee.resetTextureUnits();const Ce=$.fog,Ne=G.isMeshStandardMaterial?$.environment:null,Oe=w===null?v.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:Rn,Fe=(G.isMeshStandardMaterial?le:fe).get(G.envMap||Ne),We=G.vertexColors===!0&&!!re.attributes.color&&re.attributes.color.itemSize===4,He=!!re.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),ke=!!re.morphAttributes.position,ct=!!re.morphAttributes.normal,ut=!!re.morphAttributes.color,sn=G.toneMapped?v.toneMapping:Gn,Cn=re.morphAttributes.position||re.morphAttributes.normal||re.morphAttributes.color,ft=Cn!==void 0?Cn.length:0,$e=he.get(G),Na=m.state.lights;if(_e===!0&&(ye===!0||C!==M)){const Vt=C===M&&G.id===P;ne.setState(G,C,Vt)}let xt=!1;G.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==Na.state.version||$e.outputColorSpace!==Oe||se.isInstancedMesh&&$e.instancing===!1||!se.isInstancedMesh&&$e.instancing===!0||se.isSkinnedMesh&&$e.skinning===!1||!se.isSkinnedMesh&&$e.skinning===!0||$e.envMap!==Fe||G.fog===!0&&$e.fog!==Ce||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==ne.numPlanes||$e.numIntersection!==ne.numIntersection)||$e.vertexAlphas!==We||$e.vertexTangents!==He||$e.morphTargets!==ke||$e.morphNormals!==ct||$e.morphColors!==ut||$e.toneMapping!==sn||z.isWebGL2===!0&&$e.morphTargetsCount!==ft)&&(xt=!0):(xt=!0,$e.__version=G.version);let Si=$e.currentProgram;xt===!0&&(Si=to(G,$,se));let Eu=!1,Kr=!1,Oa=!1;const Pt=Si.getUniforms(),bi=$e.uniforms;if(W.useProgram(Si.program)&&(Eu=!0,Kr=!0,Oa=!0),G.id!==P&&(P=G.id,Kr=!0),Eu||M!==C){if(Pt.setValue(E,"projectionMatrix",C.projectionMatrix),z.logarithmicDepthBuffer&&Pt.setValue(E,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),M!==C&&(M=C,Kr=!0,Oa=!0),G.isShaderMaterial||G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshStandardMaterial||G.envMap){const Vt=Pt.map.cameraPosition;Vt!==void 0&&Vt.setValue(E,ue.setFromMatrixPosition(C.matrixWorld))}(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Pt.setValue(E,"isOrthographic",C.isOrthographicCamera===!0),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial||G.isShadowMaterial||se.isSkinnedMesh)&&Pt.setValue(E,"viewMatrix",C.matrixWorldInverse)}if(se.isSkinnedMesh){Pt.setOptional(E,se,"bindMatrix"),Pt.setOptional(E,se,"bindMatrixInverse");const Vt=se.skeleton;Vt&&(z.floatVertexTextures?(Vt.boneTexture===null&&Vt.computeBoneTexture(),Pt.setValue(E,"boneTexture",Vt.boneTexture,ee),Pt.setValue(E,"boneTextureSize",Vt.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const Fa=re.morphAttributes;if((Fa.position!==void 0||Fa.normal!==void 0||Fa.color!==void 0&&z.isWebGL2===!0)&&Re.update(se,re,Si),(Kr||$e.receiveShadow!==se.receiveShadow)&&($e.receiveShadow=se.receiveShadow,Pt.setValue(E,"receiveShadow",se.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(bi.envMap.value=Fe,bi.flipEnvMap.value=Fe.isCubeTexture&&Fe.isRenderTargetTexture===!1?-1:1),Kr&&(Pt.setValue(E,"toneMappingExposure",v.toneMappingExposure),$e.needsLights&&Rg(bi,Oa),Ce&&G.fog===!0&&te.refreshFogUniforms(bi,Ce),te.refreshMaterialUniforms(bi,G,q,K,we),Vo.upload(E,$e.uniformsList,bi,ee)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Vo.upload(E,$e.uniformsList,bi,ee),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Pt.setValue(E,"center",se.center),Pt.setValue(E,"modelViewMatrix",se.modelViewMatrix),Pt.setValue(E,"normalMatrix",se.normalMatrix),Pt.setValue(E,"modelMatrix",se.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Vt=G.uniformsGroups;for(let Ba=0,Pg=Vt.length;Ba<Pg;Ba++)if(z.isWebGL2){const Su=Vt[Ba];Ie.update(Su,Si),Ie.bind(Su,Si)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Si}function Rg(C,$){C.ambientLightColor.needsUpdate=$,C.lightProbe.needsUpdate=$,C.directionalLights.needsUpdate=$,C.directionalLightShadows.needsUpdate=$,C.pointLights.needsUpdate=$,C.pointLightShadows.needsUpdate=$,C.spotLights.needsUpdate=$,C.spotLightShadows.needsUpdate=$,C.rectAreaLights.needsUpdate=$,C.hemisphereLights.needsUpdate=$}function Cg(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(C,$,re){he.get(C.texture).__webglTexture=$,he.get(C.depthTexture).__webglTexture=re;const G=he.get(C);G.__hasExternalTextures=!0,G.__hasExternalTextures&&(G.__autoAllocateDepthBuffer=re===void 0,G.__autoAllocateDepthBuffer||I.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,$){const re=he.get(C);re.__webglFramebuffer=$,re.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(C,$=0,re=0){w=C,S=$,R=re;let G=!0,se=null,Ce=!1,Ne=!1;if(C){const Fe=he.get(C);Fe.__useDefaultFramebuffer!==void 0?(W.bindFramebuffer(E.FRAMEBUFFER,null),G=!1):Fe.__webglFramebuffer===void 0?ee.setupRenderTarget(C):Fe.__hasExternalTextures&&ee.rebindTextures(C,he.get(C.texture).__webglTexture,he.get(C.depthTexture).__webglTexture);const We=C.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Ne=!0);const He=he.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(se=He[$],Ce=!0):z.isWebGL2&&C.samples>0&&ee.useMultisampledRTT(C)===!1?se=he.get(C).__webglMultisampledFramebuffer:se=He,T.copy(C.viewport),F.copy(C.scissor),H=C.scissorTest}else T.copy(de).multiplyScalar(q).floor(),F.copy(V).multiplyScalar(q).floor(),H=Q;if(W.bindFramebuffer(E.FRAMEBUFFER,se)&&z.drawBuffers&&G&&W.drawBuffers(C,se),W.viewport(T),W.scissor(F),W.setScissorTest(H),Ce){const Fe=he.get(C.texture);E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_CUBE_MAP_POSITIVE_X+$,Fe.__webglTexture,re)}else if(Ne){const Fe=he.get(C.texture),We=$||0;E.framebufferTextureLayer(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,Fe.__webglTexture,re||0,We)}P=-1},this.readRenderTargetPixels=function(C,$,re,G,se,Ce,Ne){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=he.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ne!==void 0&&(Oe=Oe[Ne]),Oe){W.bindFramebuffer(E.FRAMEBUFFER,Oe);try{const Fe=C.texture,We=Fe.format,He=Fe.type;if(We!==pn&&xe.convert(We)!==E.getParameter(E.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ke=He===Ns&&(I.has("EXT_color_buffer_half_float")||z.isWebGL2&&I.has("EXT_color_buffer_float"));if(He!==_i&&xe.convert(He)!==E.getParameter(E.IMPLEMENTATION_COLOR_READ_TYPE)&&!(He===fi&&(z.isWebGL2||I.has("OES_texture_float")||I.has("WEBGL_color_buffer_float")))&&!ke){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=C.width-G&&re>=0&&re<=C.height-se&&E.readPixels($,re,G,se,xe.convert(We),xe.convert(He),Ce)}finally{const Fe=w!==null?he.get(w).__webglFramebuffer:null;W.bindFramebuffer(E.FRAMEBUFFER,Fe)}}},this.copyFramebufferToTexture=function(C,$,re=0){const G=Math.pow(2,-re),se=Math.floor($.image.width*G),Ce=Math.floor($.image.height*G);ee.setTexture2D($,0),E.copyTexSubImage2D(E.TEXTURE_2D,re,0,0,C.x,C.y,se,Ce),W.unbindTexture()},this.copyTextureToTexture=function(C,$,re,G=0){const se=$.image.width,Ce=$.image.height,Ne=xe.convert(re.format),Oe=xe.convert(re.type);ee.setTexture2D(re,0),E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL,re.flipY),E.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL,re.premultiplyAlpha),E.pixelStorei(E.UNPACK_ALIGNMENT,re.unpackAlignment),$.isDataTexture?E.texSubImage2D(E.TEXTURE_2D,G,C.x,C.y,se,Ce,Ne,Oe,$.image.data):$.isCompressedTexture?E.compressedTexSubImage2D(E.TEXTURE_2D,G,C.x,C.y,$.mipmaps[0].width,$.mipmaps[0].height,Ne,$.mipmaps[0].data):E.texSubImage2D(E.TEXTURE_2D,G,C.x,C.y,Ne,Oe,$.image),G===0&&re.generateMipmaps&&E.generateMipmap(E.TEXTURE_2D),W.unbindTexture()},this.copyTextureToTexture3D=function(C,$,re,G,se=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ce=C.max.x-C.min.x+1,Ne=C.max.y-C.min.y+1,Oe=C.max.z-C.min.z+1,Fe=xe.convert(G.format),We=xe.convert(G.type);let He;if(G.isData3DTexture)ee.setTexture3D(G,0),He=E.TEXTURE_3D;else if(G.isDataArrayTexture)ee.setTexture2DArray(G,0),He=E.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL,G.flipY),E.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),E.pixelStorei(E.UNPACK_ALIGNMENT,G.unpackAlignment);const ke=E.getParameter(E.UNPACK_ROW_LENGTH),ct=E.getParameter(E.UNPACK_IMAGE_HEIGHT),ut=E.getParameter(E.UNPACK_SKIP_PIXELS),sn=E.getParameter(E.UNPACK_SKIP_ROWS),Cn=E.getParameter(E.UNPACK_SKIP_IMAGES),ft=re.isCompressedTexture?re.mipmaps[0]:re.image;E.pixelStorei(E.UNPACK_ROW_LENGTH,ft.width),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,ft.height),E.pixelStorei(E.UNPACK_SKIP_PIXELS,C.min.x),E.pixelStorei(E.UNPACK_SKIP_ROWS,C.min.y),E.pixelStorei(E.UNPACK_SKIP_IMAGES,C.min.z),re.isDataTexture||re.isData3DTexture?E.texSubImage3D(He,se,$.x,$.y,$.z,Ce,Ne,Oe,Fe,We,ft.data):re.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),E.compressedTexSubImage3D(He,se,$.x,$.y,$.z,Ce,Ne,Oe,Fe,ft.data)):E.texSubImage3D(He,se,$.x,$.y,$.z,Ce,Ne,Oe,Fe,We,ft),E.pixelStorei(E.UNPACK_ROW_LENGTH,ke),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,ct),E.pixelStorei(E.UNPACK_SKIP_PIXELS,ut),E.pixelStorei(E.UNPACK_SKIP_ROWS,sn),E.pixelStorei(E.UNPACK_SKIP_IMAGES,Cn),se===0&&G.generateMipmaps&&E.generateMipmap(He),W.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?ee.setTextureCube(C,0):C.isData3DTexture?ee.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ee.setTexture2DArray(C,0):ee.setTexture2D(C,0),W.unbindTexture()},this.resetState=function(){S=0,R=0,w=null,W.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(e){console.warn("THREE.WebGLRenderer: the property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!e}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ge?Wi:eg}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Wi?Ge:Rn}}class fC extends Mg{}fC.prototype.isWebGL1Renderer=!0;class dC extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n}}class Eg extends Js{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const fh=new X,dh=new X,hh=new Mt,Nl=new og,Bo=new Da;class hC extends zt{constructor(e=new $n,n=new Eg){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)fh.fromBufferAttribute(n,r-1),dh.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=fh.distanceTo(dh);e.setAttribute("lineDistance",new Vn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bo.copy(i.boundingSphere),Bo.applyMatrix4(r),Bo.radius+=s,e.ray.intersectsSphere(Bo)===!1)return;hh.copy(r).invert(),Nl.copy(e.ray).applyMatrix4(hh);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new X,u=new X,f=new X,h=new X,p=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){const d=Math.max(0,o.start),_=Math.min(g.count,o.start+o.count);for(let v=d,y=_-1;v<y;v+=p){const S=g.getX(v),R=g.getX(v+1);if(c.fromBufferAttribute(m,S),u.fromBufferAttribute(m,R),Nl.distanceSqToSegment(c,u,h,f)>l)continue;h.applyMatrix4(this.matrixWorld);const P=e.ray.origin.distanceTo(h);P<e.near||P>e.far||n.push({distance:P,point:f.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,o.start),_=Math.min(m.count,o.start+o.count);for(let v=d,y=_-1;v<y;v+=p){if(c.fromBufferAttribute(m,v),u.fromBufferAttribute(m,v+1),Nl.distanceSqToSegment(c,u,h,f)>l)continue;h.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(h);R<e.near||R>e.far||n.push({distance:R,point:f.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}const ph=new X,mh=new X;class pC extends hC{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)ph.fromBufferAttribute(n,r),mh.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+ph.distanceTo(mh);e.setAttribute("lineDistance",new Vn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class gh{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(It(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pu);const _h={type:"change"},Ol={type:"start"},vh={type:"end"};class mC extends Zi{constructor(e,n){super(),this.object=e,this.domElement=n,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:tr.ROTATE,MIDDLE:tr.DOLLY,RIGHT:tr.PAN},this.touches={ONE:nr.ROTATE,TWO:nr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",fe),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",fe),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(_h),i.update(),s=r.NONE},this.update=function(){const L=new X,ne=new $i().setFromUnitVectors(e.up,new X(0,1,0)),pe=ne.clone().invert(),Z=new X,Re=new $i,Pe=new X,Le=2*Math.PI;return function(){const Me=i.object.position;L.copy(Me).sub(i.target),L.applyQuaternion(ne),a.setFromVector3(L),i.autoRotate&&s===r.NONE&&M(w()),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Ie=i.minAzimuthAngle,je=i.maxAzimuthAngle;return isFinite(Ie)&&isFinite(je)&&(Ie<-Math.PI?Ie+=Le:Ie>Math.PI&&(Ie-=Le),je<-Math.PI?je+=Le:je>Math.PI&&(je-=Le),Ie<=je?a.theta=Math.max(Ie,Math.min(je,a.theta)):a.theta=a.theta>(Ie+je)/2?Math.max(Ie,a.theta):Math.min(je,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),a.radius*=c,a.radius=Math.max(i.minDistance,Math.min(i.maxDistance,a.radius)),i.enableDamping===!0?i.target.addScaledVector(u,i.dampingFactor):i.target.add(u),L.setFromSpherical(a),L.applyQuaternion(pe),Me.copy(i.target).add(L),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,u.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),u.set(0,0,0)),c=1,f||Z.distanceToSquared(i.object.position)>o||8*(1-Re.dot(i.object.quaternion))>o||Pe.distanceToSquared(i.target)>0?(i.dispatchEvent(_h),Z.copy(i.object.position),Re.copy(i.object.quaternion),Pe.copy(i.target),f=!1,!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",A),i.domElement.removeEventListener("pointerdown",I),i.domElement.removeEventListener("pointercancel",W),i.domElement.removeEventListener("wheel",ee),i.domElement.removeEventListener("pointermove",z),i.domElement.removeEventListener("pointerup",W),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",fe),i._domElementKeyEvents=null)};const i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const o=1e-6,a=new gh,l=new gh;let c=1;const u=new X;let f=!1;const h=new Xe,p=new Xe,g=new Xe,x=new Xe,m=new Xe,d=new Xe,_=new Xe,v=new Xe,y=new Xe,S=[],R={};function w(){return 2*Math.PI/60/60*i.autoRotateSpeed}function P(){return Math.pow(.95,i.zoomSpeed)}function M(L){l.theta-=L}function T(L){l.phi-=L}const F=function(){const L=new X;return function(pe,Z){L.setFromMatrixColumn(Z,0),L.multiplyScalar(-pe),u.add(L)}}(),H=function(){const L=new X;return function(pe,Z){i.screenSpacePanning===!0?L.setFromMatrixColumn(Z,1):(L.setFromMatrixColumn(Z,0),L.crossVectors(i.object.up,L)),L.multiplyScalar(pe),u.add(L)}}(),N=function(){const L=new X;return function(pe,Z){const Re=i.domElement;if(i.object.isPerspectiveCamera){const Pe=i.object.position;L.copy(Pe).sub(i.target);let Le=L.length();Le*=Math.tan(i.object.fov/2*Math.PI/180),F(2*pe*Le/Re.clientHeight,i.object.matrix),H(2*Z*Le/Re.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(F(pe*(i.object.right-i.object.left)/i.object.zoom/Re.clientWidth,i.object.matrix),H(Z*(i.object.top-i.object.bottom)/i.object.zoom/Re.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function U(L){i.object.isPerspectiveCamera?c/=L:i.object.isOrthographicCamera?(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom*L)),i.object.updateProjectionMatrix(),f=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function B(L){i.object.isPerspectiveCamera?c*=L:i.object.isOrthographicCamera?(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/L)),i.object.updateProjectionMatrix(),f=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function K(L){h.set(L.clientX,L.clientY)}function q(L){_.set(L.clientX,L.clientY)}function Y(L){x.set(L.clientX,L.clientY)}function ce(L){p.set(L.clientX,L.clientY),g.subVectors(p,h).multiplyScalar(i.rotateSpeed);const ne=i.domElement;M(2*Math.PI*g.x/ne.clientHeight),T(2*Math.PI*g.y/ne.clientHeight),h.copy(p),i.update()}function de(L){v.set(L.clientX,L.clientY),y.subVectors(v,_),y.y>0?U(P()):y.y<0&&B(P()),_.copy(v),i.update()}function V(L){m.set(L.clientX,L.clientY),d.subVectors(m,x).multiplyScalar(i.panSpeed),N(d.x,d.y),x.copy(m),i.update()}function Q(L){L.deltaY<0?B(P()):L.deltaY>0&&U(P()),i.update()}function me(L){let ne=!1;switch(L.code){case i.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?T(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(0,i.keyPanSpeed),ne=!0;break;case i.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?T(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(0,-i.keyPanSpeed),ne=!0;break;case i.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?M(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(i.keyPanSpeed,0),ne=!0;break;case i.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?M(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):N(-i.keyPanSpeed,0),ne=!0;break}ne&&(L.preventDefault(),i.update())}function _e(){if(S.length===1)h.set(S[0].pageX,S[0].pageY);else{const L=.5*(S[0].pageX+S[1].pageX),ne=.5*(S[0].pageY+S[1].pageY);h.set(L,ne)}}function ye(){if(S.length===1)x.set(S[0].pageX,S[0].pageY);else{const L=.5*(S[0].pageX+S[1].pageX),ne=.5*(S[0].pageY+S[1].pageY);x.set(L,ne)}}function we(){const L=S[0].pageX-S[1].pageX,ne=S[0].pageY-S[1].pageY,pe=Math.sqrt(L*L+ne*ne);_.set(0,pe)}function j(){i.enableZoom&&we(),i.enablePan&&ye()}function oe(){i.enableZoom&&we(),i.enableRotate&&_e()}function ue(L){if(S.length==1)p.set(L.pageX,L.pageY);else{const pe=ae(L),Z=.5*(L.pageX+pe.x),Re=.5*(L.pageY+pe.y);p.set(Z,Re)}g.subVectors(p,h).multiplyScalar(i.rotateSpeed);const ne=i.domElement;M(2*Math.PI*g.x/ne.clientHeight),T(2*Math.PI*g.y/ne.clientHeight),h.copy(p)}function Ee(L){if(S.length===1)m.set(L.pageX,L.pageY);else{const ne=ae(L),pe=.5*(L.pageX+ne.x),Z=.5*(L.pageY+ne.y);m.set(pe,Z)}d.subVectors(m,x).multiplyScalar(i.panSpeed),N(d.x,d.y),x.copy(m)}function Ae(L){const ne=ae(L),pe=L.pageX-ne.x,Z=L.pageY-ne.y,Re=Math.sqrt(pe*pe+Z*Z);v.set(0,Re),y.set(0,Math.pow(v.y/_.y,i.zoomSpeed)),U(y.y),_.copy(v)}function E(L){i.enableZoom&&Ae(L),i.enablePan&&Ee(L)}function D(L){i.enableZoom&&Ae(L),i.enableRotate&&ue(L)}function I(L){i.enabled!==!1&&(S.length===0&&(i.domElement.setPointerCapture(L.pointerId),i.domElement.addEventListener("pointermove",z),i.domElement.addEventListener("pointerup",W)),b(L),L.pointerType==="touch"?le(L):ie(L))}function z(L){i.enabled!==!1&&(L.pointerType==="touch"?be(L):he(L))}function W(L){k(L),S.length===0&&(i.domElement.releasePointerCapture(L.pointerId),i.domElement.removeEventListener("pointermove",z),i.domElement.removeEventListener("pointerup",W)),i.dispatchEvent(vh),s=r.NONE}function ie(L){let ne;switch(L.button){case 0:ne=i.mouseButtons.LEFT;break;case 1:ne=i.mouseButtons.MIDDLE;break;case 2:ne=i.mouseButtons.RIGHT;break;default:ne=-1}switch(ne){case tr.DOLLY:if(i.enableZoom===!1)return;q(L),s=r.DOLLY;break;case tr.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(i.enablePan===!1)return;Y(L),s=r.PAN}else{if(i.enableRotate===!1)return;K(L),s=r.ROTATE}break;case tr.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(i.enableRotate===!1)return;K(L),s=r.ROTATE}else{if(i.enablePan===!1)return;Y(L),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Ol)}function he(L){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;ce(L);break;case r.DOLLY:if(i.enableZoom===!1)return;de(L);break;case r.PAN:if(i.enablePan===!1)return;V(L);break}}function ee(L){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(L.preventDefault(),i.dispatchEvent(Ol),Q(L),i.dispatchEvent(vh))}function fe(L){i.enabled===!1||i.enablePan===!1||me(L)}function le(L){switch(te(L),S.length){case 1:switch(i.touches.ONE){case nr.ROTATE:if(i.enableRotate===!1)return;_e(),s=r.TOUCH_ROTATE;break;case nr.PAN:if(i.enablePan===!1)return;ye(),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case nr.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;j(),s=r.TOUCH_DOLLY_PAN;break;case nr.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;oe(),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(Ol)}function be(L){switch(te(L),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;ue(L),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;Ee(L),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;E(L),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;D(L),i.update();break;default:s=r.NONE}}function A(L){i.enabled!==!1&&L.preventDefault()}function b(L){S.push(L)}function k(L){delete R[L.pointerId];for(let ne=0;ne<S.length;ne++)if(S[ne].pointerId==L.pointerId){S.splice(ne,1);return}}function te(L){let ne=R[L.pointerId];ne===void 0&&(ne=new Xe,R[L.pointerId]=ne),ne.set(L.pageX,L.pageY)}function ae(L){const ne=L.pointerId===S[0].pointerId?S[1]:S[0];return R[ne.pointerId]}i.domElement.addEventListener("contextmenu",A),i.domElement.addEventListener("pointerdown",I),i.domElement.addEventListener("pointercancel",W),i.domElement.addEventListener("wheel",ee,{passive:!1}),this.update()}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];function gC(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(wt[t&255]+wt[t>>8&255]+wt[t>>16&255]+wt[t>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[n&63|128]+wt[n>>8&255]+"-"+wt[n>>16&255]+wt[n>>24&255]+wt[i&255]+wt[i>>8&255]+wt[i>>16&255]+wt[i>>24&255]).toLowerCase()}function xh(t,e,n){return(1-n)*t+n*e}function yh(t){const e=t.map(s=>s.probability);if(t.length!==e.length)throw new Error("Items and weights must be of the same size");if(!t.length)throw new Error("Items must not be empty");const n=[];for(let s=0;s<e.length;s+=1)n[s]=e[s]+(n[s-1]||0);const r=n[n.length-1]*Math.random();for(let s=0;s<t.length;s+=1)if(n[s]>=r)return t[s];return t[0]}let De;const mn=new Array(32).fill(void 0);mn.push(void 0,null,!0,!1);function ri(t){return mn[t]}let Ss=mn.length;function _C(t){t<36||(mn[t]=Ss,Ss=t)}function vC(t){const e=ri(t);return _C(t),e}const Sg=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});Sg.decode();let Wo=new Uint8Array;function Xo(){return Wo.byteLength===0&&(Wo=new Uint8Array(De.memory.buffer)),Wo}function Cc(t,e){return Sg.decode(Xo().subarray(t,t+e))}function Mr(t){Ss===mn.length&&mn.push(mn.length+1);const e=Ss;return Ss=mn[e],mn[e]=t,e}let hi=0;const jo=new TextEncoder("utf-8"),xC=typeof jo.encodeInto=="function"?function(t,e){return jo.encodeInto(t,e)}:function(t,e){const n=jo.encode(t);return e.set(n),{read:t.length,written:n.length}};function Tr(t,e,n){if(n===void 0){const a=jo.encode(t),l=e(a.length);return Xo().subarray(l,l+a.length).set(a),hi=a.length,l}let i=t.length,r=e(i);const s=Xo();let o=0;for(;o<i;o++){const a=t.charCodeAt(o);if(a>127)break;s[r+o]=a}if(o!==i){o!==0&&(t=t.slice(o)),r=n(r,i,i=o+t.length*3);const a=Xo().subarray(r+o,r+i),l=xC(t,a);o+=l.written}return hi=o,r}function yC(t,e){if(!(t instanceof e))throw new Error(`expected instance of ${e.name}`);return t.ptr}let qo=32;function MC(t){if(qo==1)throw new Error("out of js stack");return mn[--qo]=t,qo}let $o=new Int32Array;function Mh(){return $o.byteLength===0&&($o=new Int32Array(De.memory.buffer)),$o}function EC(t,e){try{return t.apply(this,e)}catch(n){De.__wbindgen_exn_store(Mr(n))}}class Os{static __wrap(e){const n=Object.create(Os.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();De.__wbg_birdconfig_free(e)}get probability(){return De.__wbg_get_birdconfig_probability(this.ptr)}set probability(e){De.__wbg_set_birdconfig_probability(this.ptr,e)}get neighbor_distance(){return De.__wbg_get_birdconfig_neighbor_distance(this.ptr)}set neighbor_distance(e){De.__wbg_set_birdconfig_neighbor_distance(this.ptr,e)}get desired_separation(){return De.__wbg_get_birdconfig_desired_separation(this.ptr)}set desired_separation(e){De.__wbg_set_birdconfig_desired_separation(this.ptr,e)}get separation_multiplier(){return De.__wbg_get_birdconfig_separation_multiplier(this.ptr)}set separation_multiplier(e){De.__wbg_set_birdconfig_separation_multiplier(this.ptr,e)}get alignment_multiplier(){return De.__wbg_get_birdconfig_alignment_multiplier(this.ptr)}set alignment_multiplier(e){De.__wbg_set_birdconfig_alignment_multiplier(this.ptr,e)}get cohesion_multiplier(){return De.__wbg_get_birdconfig_cohesion_multiplier(this.ptr)}set cohesion_multiplier(e){De.__wbg_set_birdconfig_cohesion_multiplier(this.ptr,e)}get max_speed(){return De.__wbg_get_birdconfig_max_speed(this.ptr)}set max_speed(e){De.__wbg_set_birdconfig_max_speed(this.ptr,e)}get max_force(){return De.__wbg_get_birdconfig_max_force(this.ptr)}set max_force(e){De.__wbg_set_birdconfig_max_force(this.ptr,e)}get bird_size(){return De.__wbg_get_birdconfig_bird_size(this.ptr)}set bird_size(e){De.__wbg_set_birdconfig_bird_size(this.ptr,e)}get color_r(){return De.__wbg_get_birdconfig_color_r(this.ptr)}set color_r(e){De.__wbg_set_birdconfig_color_r(this.ptr,e)}get color_g(){return De.__wbg_get_birdconfig_color_g(this.ptr)}set color_g(e){De.__wbg_set_birdconfig_color_g(this.ptr,e)}get color_b(){return De.__wbg_get_birdconfig_color_b(this.ptr)}set color_b(e){De.__wbg_set_birdconfig_color_b(this.ptr,e)}get id(){try{const i=De.__wbindgen_add_to_stack_pointer(-16);De.birdconfig_id(i,this.ptr);var e=Mh()[i/4+0],n=Mh()[i/4+1];return Cc(e,n)}finally{De.__wbindgen_add_to_stack_pointer(16),De.__wbindgen_free(e,n)}}set id(e){const n=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),i=hi;De.birdconfig_set_id(this.ptr,n,i)}static new(e,n,i,r,s,o,a,l,c,u,f,h,p){const g=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),x=hi,m=De.birdconfig_new(g,x,n,i,r,s,o,a,l,c,u,f,h,p);return Os.__wrap(m)}}class ha{static __wrap(e){const n=Object.create(ha.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();De.__wbg_flock_free(e)}constructor(e,n){const i=De.flock_new(e,n);return ha.__wrap(i)}get max_flock_size(){return De.flock_max_flock_size(this.ptr)>>>0}set max_flock_size(e){De.flock_set_max_flock_size(this.ptr,e)}get current_flock_size(){return De.flock_current_flock_size(this.ptr)>>>0}add_bird(e,n,i){const r=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),s=hi;De.flock_add_bird(this.ptr,r,s,n,i)}add_bird_at_random_position(e,n,i){const r=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),s=hi;De.flock_add_bird_at_random_position(this.ptr,r,s,n,i)}insert_bird_config(e,n){const i=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),r=hi;yC(n,Os);var s=n.ptr;n.ptr=0,De.flock_insert_bird_config(this.ptr,i,r,s)}remove_bird_config(e){const n=Tr(e,De.__wbindgen_malloc,De.__wbindgen_realloc),i=hi;De.flock_remove_bird_config(this.ptr,n,i)}update(e,n,i,r){try{De.flock_update(this.ptr,e,n,i,MC(r))}finally{mn[qo++]=void 0}}}async function SC(t,e){if(typeof Response=="function"&&t instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(t,e)}catch(i){if(t.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",i);else throw i}const n=await t.arrayBuffer();return await WebAssembly.instantiate(n,e)}else{const n=await WebAssembly.instantiate(t,e);return n instanceof WebAssembly.Instance?{instance:n,module:t}:n}}function bC(){const t={};return t.wbg={},t.wbg.__wbindgen_object_drop_ref=function(e){vC(e)},t.wbg.__wbg_log_e22a238abcadd0a4=function(e,n){console.log(Cc(e,n))},t.wbg.__wbg_call_3999bee59e9f7719=function(){return EC(function(e,n,i,r){const s=ri(e).call(ri(n),ri(i),ri(r));return Mr(s)},arguments)},t.wbg.__wbg_buffer_3f3d764d4747d564=function(e){const n=ri(e).buffer;return Mr(n)},t.wbg.__wbg_newwithbyteoffsetandlength_be22e5fcf4f69ab4=function(e,n,i){const r=new Float32Array(ri(e),n>>>0,i>>>0);return Mr(r)},t.wbg.__wbg_new_4d6520efe4ca3e24=function(e){const n=new Float32Array(ri(e));return Mr(n)},t.wbg.__wbindgen_throw=function(e,n){throw new Error(Cc(e,n))},t.wbg.__wbindgen_memory=function(){const e=De.memory;return Mr(e)},t}function TC(t,e){return De=t.exports,bg.__wbindgen_wasm_module=e,$o=new Int32Array,Wo=new Uint8Array,De}async function bg(t){typeof t>"u"&&(t=new URL(""+new URL("flock_bg.03dea8ff.wasm",import.meta.url).href,self.location));const e=bC();(typeof t=="string"||typeof Request=="function"&&t instanceof Request||typeof URL=="function"&&t instanceof URL)&&(t=fetch(t));const{instance:n,module:i}=await SC(await t,e);return TC(n,i)}const Ho=[{navy:{50:"#f6f9f8",100:"#e4f1f7",200:"#c2e1ec",300:"#90c2d4",400:"#579db4",500:"#407c93",600:"#346276",700:"#2b495a",800:"#1e3140",900:"#121e2a"},turquoise:{50:"#eef5f4",100:"#cff0f2",200:"#98e7e1",300:"#5dcdbe",400:"#23af93",500:"#18946b",600:"#167e53",700:"#156142",800:"#104232",900:"#0b2825"},gold:{50:"#fbf9f3",100:"#f8efb9",200:"#f0dd7d",300:"#d9b94c",400:"#b89029",500:"#987114",600:"#7c580d",700:"#5f420c",800:"#412d0b",900:"#2c1c08"},cocoa:{50:"#fcfaf6",100:"#faefce",200:"#f4d89f",300:"#e3b16b",400:"#d18540",500:"#b86424",600:"#9b4a17",700:"#773714",800:"#532610",900:"#36180b"},coral:{50:"#fcfbf9",100:"#fbf0e3",200:"#f7d3c6",300:"#eba798",400:"#e4786a",500:"#d45547",600:"#ba3b30",700:"#932c25",800:"#681f1a",900:"#41130f"}}],Eh={primary:Ho[0].turquoise,secondary:Ho[0].coral,highlight:Ho[0].gold,compliment:Ho[0].navy};function AC(t,e){return t.length>e?t.slice(0,e-1):t}function Tn(t,e){return Math.random()*(e-t)+t}function Fl(t,e){return Math.round(Tn(t,e))}function wC(){const t=Tn(0,1),e=Tn(0,1),n=Tn(0,1);return new Qe(t,e,n)}const RC="default",CC=1200;function Tg(){return AC(gC(),8)}function PC(){return{id:Tg(),probability:Fl(25,75),neighborDistance:Fl(0,50),desiredSeparation:Fl(50,250),separationMultiplier:Tn(.001,1.2),alignmentMultiplier:Tn(.001,1.2),cohesionMultiplier:Tn(.001,1.2),maxForce:Tn(.001,.5),maxSpeed:Tn(.001,10),birdColor:"#"+wC().getHexString(),birdSize:Tn(3,15),wasmObject:void 0}}const Sh=VM("flock",()=>{const t=Ze(new Map),e=Ze(!1),n=Ze(!1),i=Ze(!1),r=Ze(!0),s=Ze(1),o=Ze(CC),a=Ze({});async function l(){await bg(),a.value=new ha(o.value,BigInt(new Date().getUTCMilliseconds())),f({id:Tg(),probability:20,neighborDistance:30,desiredSeparation:40,separationMultiplier:.3,alignmentMultiplier:.01,cohesionMultiplier:.01,maxSpeed:7,maxForce:.7,birdSize:10,birdColor:Eh.secondary[400]}),f({id:RC,probability:80,neighborDistance:40,desiredSeparation:25,separationMultiplier:.5,alignmentMultiplier:.5,cohesionMultiplier:.3,maxSpeed:5,maxForce:.33,birdSize:12,birdColor:Eh.primary[500]}),n.value=!0}function c(){var d;t.value.forEach(_=>{var v;_&&((v=_.wasmObject)==null||v.free())}),(d=a.value)==null||d.free()}function u(d){a.value&&(a.value.max_flock_size=d)}function f(d){if(!a.value)throw new Error("[background.vuex] cannot add config, flock doesn't exist.");const _=new Qe(d.birdColor);if(d.wasmObject=Os.new(d.id,d.probability,d.neighborDistance,d.desiredSeparation,d.separationMultiplier,d.alignmentMultiplier,d.cohesionMultiplier,d.maxSpeed,d.maxForce,d.birdSize,_.r,_.g,_.b),!d.wasmObject)throw new Error("wasm object could not be generated for bird config");t.value.set(d.id,d),a.value.insert_bird_config(d.id,d.wasmObject)}function h(d){if(!a.value)throw new Error("[background.vuex] cannot remove config, flock doesn't exist.");if(!t.value.get(d))throw new Error("[background.vuex] cannot remove config, cannot find matching config.");a.value.remove_bird_config(d),t.value.delete(d)}function p(d){a.value&&a.value.update(d.sceneWidth,d.sceneHeight,d.timeStep?d.timeStep:s.value,d.updateFlockGeometryCallback)}function g(d){if(!a.value)return;const _=yh([...t.value.values()]);a.value.add_bird_at_random_position(_.id,d.viewWidth,d.viewHeight)}function x(d){if(!a.value)return;const _=yh([...t.value.values()]);a.value.add_bird(_.id,d.x,d.y)}function m(){r.value&&t.value.forEach(d=>{const _={...PC(),id:d.id},v=En([0,1e4],[d.neighborDistance,_.neighborDistance]),y=En([0,1e4],[d.desiredSeparation,_.desiredSeparation]),S=En([0,1e4],[d.separationMultiplier,_.separationMultiplier]),R=En([0,1e4],[d.alignmentMultiplier,_.alignmentMultiplier]),w=En([0,1e4],[d.cohesionMultiplier,_.cohesionMultiplier]),P=En([0,1e4],[d.maxForce,_.maxForce]),M=En([0,1e4],[d.maxSpeed,_.maxSpeed]),T=En([0,1e4],[d.birdColor,_.birdColor]);xc({from:0,to:1e4,duration:1e3*2,onUpdate:F=>{f({...d,neighborDistance:v(F),desiredSeparation:y(F),separationMultiplier:S(F),alignmentMultiplier:R(F),cohesionMultiplier:w(F),maxForce:P(F),maxSpeed:M(F),birdColor:T(F)})}})})}return{birdConfigs:t,isDragging:e,isRandomizeAnimationEnabled:r,isReady:n,updating:i,timeStep:s,maxFlockSize:o,updateMaxFlockSize:u,flock:a,init:l,dispose:c,addOrUpdateBirdConfig:f,removeBirdConfig:h,updateFlock:p,addBirdAtRandomPosition:g,addBirdAtPosition:x,cycleAnimateBirdConfigs:m}}),LC={key:0,class:"absolute left-0 top-0 w-full h-full bg-black bg-opacity-60 z-10"},DC=yi({__name:"BackgroundWrapper",setup(t){const e=Sh(),{init:n,dispose:i,addBirdAtRandomPosition:r,addBirdAtPosition:s,cycleAnimateBirdConfigs:o}=e,{isDragging:a,maxFlockSize:l,flock:c}=WM(e),u=Ze(!1),f=Ze(null),h=Ze(),p=Ze(new dC),g=Ze(new $t),x=Ze(null),m=Ze(null),d=Ze(null),_=Ze(null),v=mt(()=>{const U=g.value.position.z,B=g.value.fov*Math.PI/180;return 2*Math.tan(B/2)*Math.abs(U)}),y=mt(()=>v.value*(R.value/S.value)),S=mt(()=>window.innerHeight??0),R=mt(()=>window.innerWidth??0);zs(async()=>{f.value=new Mg({canvas:h.value}),g.value=new $t(75,R.value/S.value,.1,1e4),g.value.position.z=1e3,x.value=new mC(g.value,h.value),x.value.target=new X(0,0,0),p.value.background=new Qe("black"),m.value=new $n,d.value=new Eg({vertexColors:!0}),g.value.aspect=R.value/S.value,_.value=new pC(m.value,d.value),p.value.add(_.value),await n(),xc({from:0,to:l.value,duration:1e3*2,onUpdate:()=>{c.value&&c.value.current_flock_size>l.value||r({viewWidth:y.value,viewHeight:v.value})},onComplete:()=>xc({from:0,to:100,duration:1e3*10,repeat:1/0,onRepeat:o})}),window.addEventListener("resize",w),window.addEventListener("touchstart",er(H,40),!1),window.addEventListener("touchmove",er(H,40),!1),window.addEventListener("mousedown",()=>a.value=!0,!1),window.addEventListener("mousemove",er(F,40),!1),window.addEventListener("mouseup",()=>a.value=!1,!1),T()}),Yc(()=>{window.removeEventListener("resize",w),window.removeEventListener("touchstart",er(H,40),!1),window.removeEventListener("touchmove",er(H,40),!1),window.removeEventListener("mousedown",()=>a.value=!0,!1),window.removeEventListener("mousemove",er(F,40),!1),window.removeEventListener("mouseup",()=>a.value=!1,!1),i()});function w(){if(!f.value)return;const{innerWidth:U,innerHeight:B}=window;f.value.setSize(U,B,!0),g.value.aspect=U/B}function P(U,B){_.value&&(_.value.geometry.setAttribute("position",new rn(U,3)),_.value.geometry.setAttribute("color",new rn(B,3)))}function M(){u.value=!1,T()}function T(){var q,Y;w(),requestAnimationFrame(()=>M());const U=Sh(),{updateFlock:B,timeStep:K}=U;B({sceneWidth:y.value,sceneHeight:v.value,timeStep:K,updateFlockGeometryCallback:P}),(q=f.value)==null||q.render(qe(p.value),g.value),g.value.updateProjectionMatrix(),(Y=x.value)==null||Y.update()}function F(U){a&&N(U.x,U.y)}function H(U){const B=U.touches.item(U.touches.length-1);B&&N(B.clientX,B.clientY)}function N(U,B){const{innerWidth:K,innerHeight:q}=window,Y=U/K,ce=B/q,de=y.value/2,V=v.value/2,Q=xh(-de,de,Y),me=-xh(-V,V,ce);s({x:Q,y:me})}return(U,B)=>(St(),ai(Ft,null,[Vs("canvas",{ref_key:"canvasElement",ref:h,class:"absolute w-full h-full",onMousedown:B[0]||(B[0]=K=>a.value=!0),onMouseup:B[1]||(B[1]=K=>a.value=!1),onMousemove:F,onTouchmove:H},null,544),("useRoute"in U?U.useRoute:et(la))().path!="/projects/flock"?(St(),ai("div",LC)):ls("",!0)],64))}}),UC=(t,e)=>e.path.replace(/(:\w+)\([^)]+\)/g,"$1").replace(/(:\w+)[?+*]/g,"$1").replace(/:\w+/g,n=>{var i;return((i=t.params[n.slice(1)])==null?void 0:i.toString())||""}),Pc=(t,e)=>{const n=t.route.matched.find(r=>{var s;return((s=r.components)==null?void 0:s.default)===t.Component.type}),i=e??(n==null?void 0:n.meta.key)??(n&&UC(t.route,n));return typeof i=="function"?i(t.route):i},IC=(t,e)=>({default:()=>t?_n(Y_,t===!0?{}:t,e):e}),NC=yi({name:"RouteProvider",props:{vnode:{type:Object,required:!0},route:{type:Object,required:!0},vnodeRef:Object,renderKey:String,trackRootNodes:Boolean},setup(t){const e=t.renderKey,n=t.route,i={};for(const r in t.route)Object.defineProperty(i,r,{get:()=>e===t.renderKey?t.route[r]:n[r]});return Lr(Ta,Hs(i)),()=>_n(t.vnode,{ref:t.vnodeRef})}}),OC=(t,e,n)=>(e=e===!0?{}:e,{default:()=>{var i;return e?_n(t,e,n):(i=n.default)==null?void 0:i.call(n)}}),FC=yi({name:"NuxtPage",inheritAttrs:!1,props:{name:{type:String},transition:{type:[Boolean,Object],default:void 0},keepalive:{type:[Boolean,Object],default:void 0},route:{type:Object},pageKey:{type:[Function,String],default:null}},setup(t,{attrs:e,expose:n}){const i=at(),r=Ze(),s=Bt(Ta,null);n({pageRef:r});const o=Bt(yy,null);let a;return()=>_n(gm,{name:t.name,route:t.route,...e},{default:l=>{const c=kC(s,l.route,l.Component),u=s&&s.matched.length===l.route.matched.length;if(!l.Component)return a&&!u?a:void 0;if(a&&o&&!o.isCurrent(l.route))return a;if(c&&s&&(!o||o!=null&&o.isCurrent(s)))return u?a:null;const f=Pc(l,t.pageKey),h=i.deferHydration(),p=!!(t.transition??l.route.meta.pageTransition??nc),g=p&&HC([t.transition,l.route.meta.pageTransition,nc,{onAfterLeave:()=>{i.callHook("page:transition:finish",l.Component)}}].filter(Boolean));return a=OC(ru,p&&g,IC(t.keepalive??l.route.meta.keepalive??ay,_n(sp,{suspensible:!0,onPending:()=>i.callHook("page:start",l.Component),onResolve:()=>{Ki(()=>i.callHook("page:finish",l.Component).finally(h))}},{default:()=>_n(NC,{key:f,vnode:l.Component,route:l.route,renderKey:f,trackRootNodes:p,vnodeRef:r})}))).default(),a}})}});function BC(t){return Array.isArray(t)?t:t?[t]:[]}function HC(t){const e=t.map(n=>({...n,onAfterLeave:BC(n.onAfterLeave)}));return my(...e)}function kC(t,e,n){if(!t)return!1;const i=e.matched.findIndex(r=>{var s;return((s=r.components)==null?void 0:s.default)===(n==null?void 0:n.type)});return!i||i===-1?!1:e.matched.slice(0,i).some((r,s)=>{var o,a,l;return((o=r.components)==null?void 0:o.default)!==((l=(a=t.matched[s])==null?void 0:a.components)==null?void 0:l.default)})||n&&Pc({route:e,Component:n})!==Pc({route:t,Component:n})}const zC={key:0,class:"p-1 flex flex-row"},GC={key:1,class:"rainbow-text-animated"},VC={key:2,class:"ml-1 mr-1"},WC=yi({__name:"NavBar",setup(t){const e=mt(()=>{const r=["projects","notebooks"],s=la().fullPath;return["home",...s.slice(1,s.length).split("/").filter(a=>a!==""&&!r.includes(a))].map(a=>` /${a}`)});function n(r){const s=la().fullPath.split("/").pop();return r.replace("/","").trim()===(((s==null?void 0:s.trim())??"")===""?"home":s==null?void 0:s.trim())}function i(r){switch(r.trim()){case"/home":return"/";case"/2d-inverse-kinematics":return"/projects/notebooks/2d-inverse-kinematics";default:return"/"}}return(r,s)=>{var a;const o=ZM;return((a=et(e))==null?void 0:a.length)!=0?(St(),ai("div",zC,[(St(!0),ai(Ft,null,rv(et(e),(l,c)=>(St(),ai("div",{key:c},[Vs("span",null,[n(l)?ls("",!0):(St(),li(o,{key:0,class:"link",to:i(l)},{default:Xc(()=>[eu(Tu(l),1)]),_:2},1032,["to"])),n(l)?(St(),ai("div",GC,Tu(l),1)):ls("",!0),et(e)[c+1]?(St(),ai("span",VC,">")):ls("",!0)])]))),128))])):ls("",!0)}}});const XC=(t,e)=>{const n=t.__vccOpts||t;for(const[i,r]of e)n[i]=r;return n},jC={},qC={class:"w-screen h-screen"},$C={class:"z-20 fullscreen flex flex-col overflow-scroll"};function YC(t,e){const n=DC,i=FC,r=WC;return St(),ai("div",qC,[st(n),Vs("div",$C,[st(i,{class:"flex-grow overflow-y-scroll"}),st(r,{class:"h-fit"})])])}const KC=XC(jC,[["render",YC]]),ZC={__name:"nuxt-error-page",props:{error:Object},setup(t){const n=t.error;(n.stack||"").split(`
`).splice(1).map(f=>({text:f.replace("webpack:/","").replace(".vue",".js").trim(),internal:f.includes("node_modules")&&!f.includes(".cache")||f.includes("internal")||f.includes("new Promise")})).map(f=>`<span class="stack${f.internal?" internal":""}">${f.text}</span>`).join(`
`);const i=Number(n.statusCode||500),r=i===404,s=n.statusMessage??(r?"Page Not Found":"Internal Server Error"),o=n.message||n.toString(),a=void 0,u=r?Fu(()=>Fi(()=>import("./error-404.1ab4d52f.js"),["./error-404.1ab4d52f.js","./error-404.8bdbaeb8.css"],import.meta.url).then(f=>f.default||f)):Fu(()=>Fi(()=>import("./error-500.69bbdac8.js"),["./error-500.69bbdac8.js","./error-500.b63a96f5.css"],import.meta.url).then(f=>f.default||f));return(f,h)=>(St(),li(et(u),Vg(Pp({statusCode:et(i),statusMessage:et(s),description:et(o),stack:et(a)})),null,16))}},JC=ZC,QC={__name:"nuxt-root",setup(t){const e=()=>null,n=at(),i=n.deferHydration(),r=!1;Lr(Ta,la()),n.hooks.callHookWith(a=>a.map(l=>l()),"vue:setup");const s=Aa();mp((a,l,c)=>{if(n.hooks.callHook("vue:error",a,l,c).catch(u=>console.error("[nuxt] Error in `vue:error` hook",u)),by(a)&&(a.fatal||a.unhandled))return n.runWithContext(()=>Sr(a)),!1});const{islandContext:o}=!1;return(a,l)=>(St(),li(sp,{onResolve:et(i)},{default:Xc(()=>[et(s)?(St(),li(et(JC),{key:0,error:et(s)},null,8,["error"])):et(o)?(St(),li(et(e),{key:1,context:et(o)},null,8,["context"])):et(r)?(St(),li(iv(et(r)),{key:2})):(St(),li(et(KC),{key:3}))]),_:1},8,["onResolve"]))}},bh=QC;globalThis.$fetch||(globalThis.$fetch=X0.create({baseURL:q0()}));let Th;{let t;Th=async function(){var s,o;if(t)return t;const i=!!((s=window.__NUXT__)!=null&&s.serverRendered||((o=document.getElementById("__NUXT_DATA__"))==null?void 0:o.dataset.ssr)==="true")?o0(bh):s0(bh),r=ox({vueApp:i});try{await lx(r,sE)}catch(a){await r.callHook("app:error",a),r.payload.error=r.payload.error||a}try{await r.hooks.callHook("app:created",i),await r.hooks.callHook("app:beforeMount",i),i.mount("#"+ly),await r.hooks.callHook("app:mounted",i),await Ki()}catch(a){await r.callHook("app:error",a),r.payload.error=r.payload.error||a}return i},t=Th().catch(e=>{console.error("Error while mounting app:",e)})}export{RC as D,Ft as F,XC as _,Vs as a,st as b,ai as c,eu as d,ZM as e,t1 as f,yi as g,Ze as h,zs as i,li as j,Sh as k,mt as l,ki as m,PC as n,St as o,e1 as p,et as q,rv as r,WM as s,Tu as t,n1 as u,ls as v,Xc as w};
