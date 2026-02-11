var Je=Object.defineProperty;var Ye=(r,e,t)=>e in r?Je(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var d=(r,e,t)=>Ye(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const se=globalThis,ge=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),we=new WeakMap;let ze=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ge&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=we.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&we.set(t,e))}return e}toString(){return this.cssText}};const Ge=r=>new ze(typeof r=="string"?r:r+"",void 0,ye),ne=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ze(t,r,ye)},Qe=(r,e)=>{if(ge)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),i=se.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},Ae=ge?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return Ge(t)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ze,defineProperty:Xe,getOwnPropertyDescriptor:et,getOwnPropertyNames:tt,getOwnPropertySymbols:st,getPrototypeOf:it}=Object,k=globalThis,Se=k.trustedTypes,rt=Se?Se.emptyScript:"",pe=k.reactiveElementPolyfillSupport,K=(r,e)=>r,ie={toAttribute(r,e){switch(e){case Boolean:r=r?rt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},be=(r,e)=>!Ze(r,e),Ee={attribute:!0,type:String,converter:ie,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);let L=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ee){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Xe(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:n}=et(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){const a=i==null?void 0:i.call(this);n==null||n.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ee}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;const e=it(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){const t=this.properties,s=[...tt(t),...st(t)];for(const i of s)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(Ae(i))}else e!==void 0&&t.push(Ae(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qe(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var n;const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:ie).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){var n,o;const s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:ie;this._$Em=i;const p=l.fromAttribute(t,a.type);this[i]=p??((o=this._$Ej)==null?void 0:o.get(i))??p,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){var o;if(e!==void 0){const a=this.constructor;if(i===!1&&(n=this[e]),s??(s=a.getPropertyOptions(e)),!((s.hasChanged??be)(n,t)||s.useDefault&&s.reflect&&n===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i){const{wrapped:a}=o,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,o,l)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};L.elementStyles=[],L.shadowRootOptions={mode:"open"},L[K("elementProperties")]=new Map,L[K("finalized")]=new Map,pe==null||pe({ReactiveElement:L}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const V=globalThis,ke=r=>r,re=V.trustedTypes,Ce=re?re.createPolicy("lit-html",{createHTML:r=>r}):void 0,De="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,je="?"+E,nt=`<${je}>`,I=document,J=()=>I.createComment(""),Y=r=>r===null||typeof r!="object"&&typeof r!="function",$e=Array.isArray,ot=r=>$e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",de=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Te=/-->/g,Pe=/>/g,T=RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Oe=/'/g,Ue=/"/g,He=/^(?:script|style|textarea|title)$/i,at=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),y=at(1),R=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Ie=new WeakMap,O=I.createTreeWalker(I,129);function Fe(r,e){if(!$e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ce!==void 0?Ce.createHTML(e):e}const lt=(r,e)=>{const t=r.length-1,s=[];let i,n=e===2?"<svg>":e===3?"<math>":"",o=W;for(let a=0;a<t;a++){const l=r[a];let p,m,c=-1,h=0;for(;h<l.length&&(o.lastIndex=h,m=o.exec(l),m!==null);)h=o.lastIndex,o===W?m[1]==="!--"?o=Te:m[1]!==void 0?o=Pe:m[2]!==void 0?(He.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=T):m[3]!==void 0&&(o=T):o===T?m[0]===">"?(o=i??W,c=-1):m[1]===void 0?c=-2:(c=o.lastIndex-m[2].length,p=m[1],o=m[3]===void 0?T:m[3]==='"'?Ue:Oe):o===Ue||o===Oe?o=T:o===Te||o===Pe?o=W:(o=T,i=void 0);const u=o===T&&r[a+1].startsWith("/>")?" ":"";n+=o===W?l+nt:c>=0?(s.push(p),l.slice(0,c)+De+l.slice(c)+E+u):l+E+(c===-2?a:u)}return[Fe(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class G{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0;const a=e.length-1,l=this.parts,[p,m]=lt(e,t);if(this.el=G.createElement(p,s),O.currentNode=this.el.content,t===2||t===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=O.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const c of i.getAttributeNames())if(c.endsWith(De)){const h=m[o++],u=i.getAttribute(c).split(E),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:n,name:g[2],strings:u,ctor:g[1]==="."?pt:g[1]==="?"?dt:g[1]==="@"?ut:oe}),i.removeAttribute(c)}else c.startsWith(E)&&(l.push({type:6,index:n}),i.removeAttribute(c));if(He.test(i.tagName)){const c=i.textContent.split(E),h=c.length-1;if(h>0){i.textContent=re?re.emptyScript:"";for(let u=0;u<h;u++)i.append(c[u],J()),O.nextNode(),l.push({type:2,index:++n});i.append(c[h],J())}}}else if(i.nodeType===8)if(i.data===je)l.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(E,c+1))!==-1;)l.push({type:7,index:n}),c+=E.length-1}n++}}static createElement(e,t){const s=I.createElement("template");return s.innerHTML=e,s}}function z(r,e,t=r,s){var o,a;if(e===R)return e;let i=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const n=Y(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=z(r,i._$AS(r,e.values),i,s)),e}class ct{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=((e==null?void 0:e.creationScope)??I).importNode(t,!0);O.currentNode=i;let n=O.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new D(n,n.nextSibling,this,e):l.type===1?p=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(p=new ht(n,this,e)),this._$AV.push(p),l=s[++a]}o!==(l==null?void 0:l.index)&&(n=O.nextNode(),o++)}return O.currentNode=I,i}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class D{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),Y(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==R&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ot(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&Y(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){var n;const{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=G.createElement(Fe(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(t);else{const o=new ct(i,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=Ie.get(e.strings);return t===void 0&&Ie.set(e.strings,t=new G(e)),t}k(e){$e(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const n of e)i===t.length?t.push(s=new D(this.O(J()),this.O(J()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){const i=ke(e).nextSibling;ke(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(e,t=this,s,i){const n=this.strings;let o=!1;if(n===void 0)e=z(this,e,t,0),o=!Y(e)||e!==this._$AH&&e!==R,o&&(this._$AH=e);else{const a=e;let l,p;for(e=n[0],l=0;l<n.length-1;l++)p=z(this,a[s+l],t,l),p===R&&(p=this._$AH[l]),o||(o=!Y(p)||p!==this._$AH[l]),p===f?e=f:e!==f&&(e+=(p??"")+n[l+1]),this._$AH[l]=p}o&&!i&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class pt extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}}class dt extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}}class ut extends oe{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=z(this,e,t,0)??f)===R)return;const s=this._$AH,i=e===f&&s!==f||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==f&&(s===f||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class ht{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}}const ft={I:D},ue=V.litHtmlPolyfillSupport;ue==null||ue(G,D),(V.litHtmlVersions??(V.litHtmlVersions=[])).push("3.3.2");const mt=(r,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let i=s._$litPart$;if(i===void 0){const n=(t==null?void 0:t.renderBefore)??null;s._$litPart$=i=new D(e.insertBefore(J(),n),n,void 0,t??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=globalThis;let C=class extends L{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=mt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return R}};var Le;C._$litElement$=!0,C.finalized=!0,(Le=U.litElementHydrateSupport)==null||Le.call(U,{LitElement:C});const he=U.litElementPolyfillSupport;he==null||he({LitElement:C});(U.litElementVersions??(U.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ae=r=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(r,e)}):customElements.define(r,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt={attribute:!0,type:String,converter:ie,reflect:!1,hasChanged:be},yt=(r=gt,e,t)=>{const{kind:s,metadata:i}=t;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(t.name,r),s==="accessor"){const{name:o}=t;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,r,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,r,a),a}}}if(s==="setter"){const{name:o}=t;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,r,!0,a)}}throw Error("Unsupported decorator location: "+s)};function le(r){return(e,t)=>typeof t=="object"?yt(r,e,t):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(r){return le({...r,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=(r,e,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(r,e,t),t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $t(r,e){return(t,s,i)=>{const n=o=>{var a;return((a=o.renderRoot)==null?void 0:a.querySelector(r))??null};return bt(t,s,{get(){return n(this)}})}}class vt{constructor(){d(this,"tools",[]);d(this,"eventListeners",[]);d(this,"_requestUserInput",null)}setUserInputHandler(e){this._requestUserInput=e}createAPI(){return{registerTool:e=>{this.tools.push(e)},on:(e,t)=>e==="agent_event"?(this.eventListeners.push(t),()=>{this.eventListeners=this.eventListeners.filter(s=>s!==t)}):()=>{},requestUserInput:e=>this._requestUserInput?this._requestUserInput(e):Promise.reject(new Error("No user input handler registered"))}}async load(e){const t=this.createAPI();for(const s of e)await s(t)}getTools(){return[...this.tools]}emit(e){for(const t of this.eventListeners)t(e)}}class xt{constructor(){d(this,"skills",new Map)}register(e){if(!e.name||!e.description||!e.content){console.warn("[skills] Skipping invalid skill: missing required fields");return}if(this.skills.has(e.name)){console.warn(`[skills] Duplicate skill "${e.name}", keeping first`);return}this.skills.set(e.name,e)}registerAll(e){for(const t of e)this.register(t)}get(e){return this.skills.get(e)}getAll(){return[...this.skills.values()]}systemPromptFragment(){const e=this.getAll();return e.length===0?"":`
The following skills provide specialized instructions for specific tasks.
Use the read_skill tool to load a skill's full content when the task matches its description.

<available_skills>
${e.map(s=>`  <skill>
    <name>${s.name}</name>
    <description>${s.description}</description>
  </skill>`).join(`
`)}
</available_skills>`}createReadSkillTool(){return{name:"read_skill",description:"Load the full content of a skill by name. Use this when a task matches an available skill's description.",parameters:{type:"object",properties:{name:{type:"string",description:"The skill name to load"}},required:["name"]},execute:async e=>{const t=e.name,s=this.get(t);if(!s){const i=this.getAll().map(n=>n.name).join(", ");return{content:`Skill "${t}" not found. Available skills: ${i||"none"}`,isError:!0}}return{content:s.content,isError:!1}}}}}class _t{constructor(){d(this,"templates",new Map)}register(e){this.templates.set(e.name,e)}registerAll(e){for(const t of e)this.register(t)}get(e){return this.templates.get(e)}getAll(){return[...this.templates.values()]}search(e){const t=e.toLowerCase();return this.getAll().filter(s=>s.name.toLowerCase().startsWith(t))}expand(e){const t=e.trim();if(!t.startsWith("/"))return null;const s=t.slice(1),i=wt(s);if(i.length===0)return null;const n=i[0],o=i.slice(1),a=this.get(n);return a?At(a.body,o):null}}function wt(r){const e=[];let t="",s=null;for(let i=0;i<r.length;i++){const n=r[i];s?n===s?s=null:t+=n:n==='"'||n==="'"?s=n:n===" "||n==="	"?t&&(e.push(t),t=""):t+=n}return t&&e.push(t),e}function At(r,e){let t=r;return t=t.replace(/\$\{@:(\d+):(\d+)\}/g,(s,i,n)=>{const o=parseInt(i,10)-1,a=parseInt(n,10);return e.slice(o,o+a).join(" ")}),t=t.replace(/\$\{@:(\d+)\}/g,(s,i)=>{const n=parseInt(i,10)-1;return e.slice(n).join(" ")}),t=t.replace(/\$@/g,e.join(" ")),t=t.replace(/\$ARGUMENTS/g,e.join(" ")),t=t.replace(/\$(\d+)/g,(s,i)=>{const n=parseInt(i,10)-1;return e[n]??""}),t}const St="https://openrouter.ai/api/v1/chat/completions",Et="anthropic/claude-sonnet-4";function kt(r){return r.map(e=>({type:"function",function:{name:e.name,description:e.description,parameters:e.parameters}}))}async function*Ct(r,e,t,s){var o,a,l,p,m;const i=t.model??Et;let n=r.map(c=>({role:c.role,content:c.content}));for(;;){const c=await fetch(St,{method:"POST",headers:{Authorization:`Bearer ${t.apiKey}`,"Content-Type":"application/json","HTTP-Referer":window.location.origin,"X-Title":"pi-browser"},body:JSON.stringify({model:i,messages:n,tools:e.length>0?kt(e):void 0,stream:!0}),signal:s});if(!c.ok){const b=await c.text();yield{type:"error",error:`OpenRouter ${c.status}: ${b}`};return}const h=c.body.getReader(),u=new TextDecoder;let g="",v="";const w=new Map;for(;;){const{done:b,value:H}=await h.read();if(b)break;g+=u.decode(H,{stream:!0});const M=g.split(`
`);g=M.pop()??"";for(const F of M){if(!F.startsWith("data: "))continue;const S=F.slice(6).trim();if(S==="[DONE]")continue;let q;try{q=JSON.parse(S)}catch{continue}const N=(a=(o=q.choices)==null?void 0:o[0])==null?void 0:a.delta;if(N&&(N.content&&(v+=N.content,yield{type:"text_delta",delta:N.content}),N.tool_calls))for(const A of N.tool_calls){const te=A.index??0;w.has(te)||w.set(te,{id:A.id??`call_${te}`,name:((l=A.function)==null?void 0:l.name)??"",argsJson:""});const ce=w.get(te);A.id&&(ce.id=A.id),(p=A.function)!=null&&p.name&&(ce.name=A.function.name),(m=A.function)!=null&&m.arguments&&(ce.argsJson+=A.function.arguments)}}}if(w.size===0){yield{type:"turn_end"};return}const j=[];for(const[,b]of w){let H={};try{H=JSON.parse(b.argsJson)}catch{}const M={id:b.id,name:b.name,arguments:H};yield{type:"tool_call_start",toolCall:M};const F=e.find(q=>q.name===b.name);let S;if(F)try{S=await F.execute(H)}catch(q){S={content:`Tool error: ${q}`,isError:!0}}else S={content:`Unknown tool: ${b.name}`,isError:!0};M.result=S,yield{type:"tool_call_end",toolCall:M},j.push({tool_call_id:b.id,role:"tool",content:S.content})}n.push({role:"assistant",content:v||null,tool_calls:[...w.values()].map(b=>({id:b.id,type:"function",function:{name:b.name,arguments:b.argsJson}}))});for(const b of j)n.push(b)}}function Q(r){return{content:r,isError:!1}}function me(r){return{content:r,isError:!0}}class Tt{constructor(){d(this,"files",new Map)}read(e){return this.files.get(this.normalize(e))}write(e,t){this.files.set(this.normalize(e),t)}delete(e){return this.files.delete(this.normalize(e))}list(e="/"){const t=this.normalize(e);return[...this.files.keys()].filter(s=>s===t||s.startsWith(t.endsWith("/")?t:t+"/"))}exists(e){return this.files.has(this.normalize(e))}normalize(e){let t=e.startsWith("/")?e:"/"+e;return t=t.replace(/\/+/g,"/"),t}}function Pt(r){return[Ot(r),Ut(r),It(r),Rt(r)]}function Ot(r){return{name:"read",description:"Read the contents of a file from the virtual filesystem.",parameters:{type:"object",properties:{path:{type:"string",description:"Path to the file to read"}},required:["path"]},execute:async e=>{const t=e.path,s=r.read(t);return s===void 0?me(`File not found: ${t}`):Q(s)}}}function Ut(r){return{name:"write",description:"Write content to a file in the virtual filesystem. Creates or overwrites.",parameters:{type:"object",properties:{path:{type:"string",description:"Path to write to"},content:{type:"string",description:"Content to write"}},required:["path","content"]},execute:async e=>{const t=e.path,s=e.content;return r.write(t,s),Q(`Wrote ${s.length} bytes to ${t}`)}}}function It(r){return{name:"edit",description:"Edit a file by replacing exact text. The oldText must match exactly.",parameters:{type:"object",properties:{path:{type:"string",description:"Path to the file to edit"},oldText:{type:"string",description:"Exact text to find and replace"},newText:{type:"string",description:"Replacement text"}},required:["path","oldText","newText"]},execute:async e=>{const t=e.path,s=e.oldText,i=e.newText,n=r.read(t);return n===void 0?me(`File not found: ${t}`):n.includes(s)?(r.write(t,n.replace(s,i)),Q(`Edited ${t}`)):me(`oldText not found in ${t}`)}}}function Rt(r){return{name:"list",description:"List files in the virtual filesystem.",parameters:{type:"object",properties:{prefix:{type:"string",description:"Directory prefix to list (default: /)"}}},execute:async e=>{const t=e.prefix??"/",s=r.list(t);return s.length===0?Q("No files found."):Q(s.join(`
`))}}}const Mt=`You are a helpful coding assistant running in a browser environment.

You have access to a virtual in-memory filesystem. You can read, write, edit, and list files.
You can also ask the user questions using the ask_user tool when you need clarification.

When the user asks you to create or modify code, use the tools to do so.
Be concise in your responses.`;class qt{constructor(e){d(this,"fs");d(this,"extensions");d(this,"skills");d(this,"promptTemplates");d(this,"builtinTools");d(this,"messages",[]);d(this,"config");d(this,"abortController",null);d(this,"_ready");this.config=e,this.fs=new Tt,this.builtinTools=Pt(this.fs),this.extensions=new vt,this.skills=new xt,e.skills&&this.skills.registerAll(e.skills),this.promptTemplates=new _t,e.promptTemplates&&this.promptTemplates.registerAll(e.promptTemplates);const t=e.systemPrompt??Mt,s=this.skills.systemPromptFragment(),i=s?t+`
`+s:t;this.messages=[{role:"system",content:i}],this._ready=this.extensions.load(e.extensions??[])}async ready(){await this._ready}get tools(){const e=[...this.builtinTools,...this.extensions.getTools()];return this.skills.getAll().length>0&&e.push(this.skills.createReadSkillTool()),e}setUserInputHandler(e){this.extensions.setUserInputHandler(e)}getMessages(){return[...this.messages]}async*prompt(e){await this._ready;const s=this.promptTemplates.expand(e)??e;this.messages.push({role:"user",content:s}),this.abortController=new AbortController;let i="";try{for await(const n of Ct(this.messages,this.tools,{apiKey:this.config.apiKey,model:this.config.model},this.abortController.signal))n.type==="text_delta"&&(i+=n.delta),this.extensions.emit(n),yield n;i&&this.messages.push({role:"assistant",content:i})}finally{this.abortController=null}}abort(){var e;(e=this.abortController)==null||e.abort()}}const Nt=r=>{r.registerTool({name:"ask_user",description:`Ask the user a question and wait for their answer via a browser form.
Use this whenever you need clarification, a decision, or any input from the user.

The simplest form is a single question (renders as a text input):
  { "question": "What should the project be called?" }

For structured input, provide fields:
  {
    "question": "Project setup",
    "description": "I need a few details before I start.",
    "fields": [
      { "name": "name", "label": "Project name", "type": "text", "required": true },
      { "name": "description", "label": "Describe the project", "type": "textarea" },
      { "name": "language", "label": "Language", "type": "select", "options": ["TypeScript", "Python", "Rust"] },
      { "name": "confirm", "label": "Ready to start?", "type": "confirm" }
    ]
  }

Field types:
  - "text": single-line text input
  - "textarea": multi-line text input
  - "select": dropdown (requires "options" array)
  - "confirm": yes/no toggle

Returns a JSON object mapping field names to the user's answers.
If no fields are specified, returns { "answer": "<user's text>" }.`,parameters:{type:"object",properties:{question:{type:"string",description:"The headline question to show the user"},description:{type:"string",description:"Optional longer description shown below the question"},fields:{type:"array",description:"Form fields. If omitted, a single text input is shown.",items:{type:"object",properties:{name:{type:"string",description:"Field key in the response"},label:{type:"string",description:"Label shown to the user"},type:{type:"string",enum:["text","textarea","select","confirm"],description:"Input type"},placeholder:{type:"string",description:"Placeholder text"},options:{type:"array",items:{type:"string"},description:"Options for select fields"},defaultValue:{type:"string",description:"Default value"},required:{type:"boolean",description:"Whether field is required"}},required:["name","label","type"]}}},required:["question"]},execute:async e=>{const t=e.question,s=e.description,i=e.fields;try{const n=await r.requestUserInput({question:t,description:s,fields:i??[{name:"answer",label:t,type:"text",required:!0}]});return{content:JSON.stringify(n,null,2),isError:!1}}catch(n){return{content:`User input cancelled or failed: ${n}`,isError:!0}}}})},Lt={name:"code-review",description:"Review code for bugs, security issues, performance problems, and style. Use when asked to review or audit code.",content:`# Code Review

## Process

1. Read the file(s) to review using the \`read\` tool
2. Analyze for the following categories:

### Bugs & Logic Errors
- Off-by-one errors
- Null/undefined access
- Race conditions
- Incorrect boolean logic
- Missing error handling

### Security
- Injection vulnerabilities (SQL, XSS, command)
- Hardcoded secrets or credentials
- Insecure data handling
- Missing input validation

### Performance
- Unnecessary re-renders (React)
- N+1 query patterns
- Missing memoization for expensive computations
- Unbounded data structures

### Style & Maintainability
- Inconsistent naming
- Dead code
- Missing types (TypeScript)
- Overly complex functions (suggest extraction)

## Output Format

For each finding, report:
- **Severity**: 🔴 Critical | 🟡 Warning | 🔵 Info
- **Location**: file and line/region
- **Issue**: what's wrong
- **Fix**: suggested correction

Summarize with a count of findings by severity.`},zt={name:"lit-component",description:"Create well-structured Lit web components with TypeScript. Use when asked to build UI components, pages, or web component features.",content:`# Lit Web Component Creation

## Guidelines

When creating Lit web components:

### Structure
- One component per file
- Use the \`@customElement\` decorator
- Extend \`LitElement\`
- Use \`static styles = css\\\`...\\\`\` for scoped styles
- Use TypeScript decorators for properties and state

### Properties & State
\`\`\`typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  /** Public reactive properties (set via attributes/properties) */
  @property() title = "";
  @property({ type: Boolean }) disabled = false;

  /** Internal reactive state */
  @state() private count = 0;
}
\`\`\`

### Events
- Dispatch CustomEvents for parent communication
- Use \`bubbles: true, composed: true\` to cross shadow DOM boundaries
\`\`\`typescript
this.dispatchEvent(new CustomEvent("my-event", {
  detail: { value: 42 },
  bubbles: true,
  composed: true,
}));
\`\`\`

### Accessibility
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Patterns
- Loading states: show skeleton or spinner
- Error states: show error message with retry option
- Empty states: show helpful message or call to action
- Use \`nothing\` from lit for conditional rendering
- Use \`repeat\` directive for keyed lists

## File Template

Write each component as a single .ts file with styles co-located using \`static styles\`.`},Dt=[{name:"review",description:"Review code in a file for issues",body:"Review the code in $1. Focus on bugs, security issues, and maintainability. Be specific about line numbers and suggest fixes."},{name:"explain",description:"Explain how code works",body:"Explain how the code in $1 works. Walk through the logic step by step. ${@:2}"},{name:"refactor",description:"Refactor code for improvement",body:"Refactor the code in $1 to improve ${@:2}. Show the changes using the edit tool."},{name:"test",description:"Write tests for a file",body:"Write tests for $1. Cover the main functionality, edge cases, and error conditions."},{name:"component",description:"Create a Lit web component",body:`Create a Lit web component named $1. Requirements: \${@:2}

Use TypeScript with decorators. Put styles in static styles using css tagged template.`},{name:"fix",description:"Fix a bug or issue",body:`Fix the following issue: $@

Read the relevant files, identify the root cause, and apply the fix using the edit tool.`},{name:"help",description:"Show available prompt templates",body:"List all the prompt templates I can use. For each one, show the /command name, what it does, and example usage."}];var We=Object.defineProperty,jt=Object.getOwnPropertyDescriptor,Ht=(r,e,t)=>e in r?We(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,ve=(r,e,t,s)=>{for(var i=s>1?void 0:s?jt(e,t):e,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&We(e,t,i),i},Ft=(r,e,t)=>Ht(r,e+"",t);let Z=class extends C{constructor(){super(...arguments);d(this,"initialKey","");d(this,"key","")}connectedCallback(){super.connectedCallback(),this.key=this.initialKey}handleInput(e){this.key=e.target.value}handleKeyDown(e){e.key==="Enter"&&this.key.trim()&&this.fireStart()}fireStart(){this.dispatchEvent(new CustomEvent("start-agent",{detail:this.key.trim(),bubbles:!0,composed:!0}))}render(){return y`
      <div class="card">
        <h1>π browser</h1>
        <p class="subtitle">A browser-based coding agent</p>
        <label for="api-key">OpenRouter API Key</label>
        <input
          id="api-key"
          type="password"
          .value=${this.key}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
          placeholder="sk-or-..."
          autofocus
        />
        <button ?disabled=${!this.key.trim()} @click=${this.fireStart}>
          Start
        </button>
        <p class="hint">
          Key is stored in localStorage. Get one at
          <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer"
            >openrouter.ai/keys</a
          >
        </p>
      </div>
    `}};Ft(Z,"styles",ne`
    :host {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 32px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-secondary);
      width: 400px;
      max-width: 90vw;
    }

    h1 {
      font-size: 24px;
      color: var(--accent);
      margin: 0;
    }

    .subtitle {
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input {
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg-input);
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      outline: none;
    }

    input:focus {
      border-color: var(--accent);
    }

    button {
      padding: 10px;
      border: none;
      border-radius: 4px;
      background: var(--accent);
      color: var(--bg);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .hint {
      font-size: 12px;
      color: var(--text-muted);
    }

    .hint a {
      color: var(--accent);
    }
  `);ve([le()],Z.prototype,"initialKey",2);ve([x()],Z.prototype,"key",2);Z=ve([ae("api-key-screen")],Z);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wt={CHILD:2},Bt=r=>(...e)=>({_$litDirective$:r,values:e});let Kt=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Vt}=ft,Re=r=>r,Me=()=>document.createComment(""),B=(r,e,t)=>{var n;const s=r._$AA.parentNode,i=e===void 0?r._$AB:e._$AA;if(t===void 0){const o=s.insertBefore(Me(),i),a=s.insertBefore(Me(),i);t=new Vt(o,a,r,r.options)}else{const o=t._$AB.nextSibling,a=t._$AM,l=a!==r;if(l){let p;(n=t._$AQ)==null||n.call(t,r),t._$AM=r,t._$AP!==void 0&&(p=r._$AU)!==a._$AU&&t._$AP(p)}if(o!==i||l){let p=t._$AA;for(;p!==o;){const m=Re(p).nextSibling;Re(s).insertBefore(p,i),p=m}}}return t},P=(r,e,t=r)=>(r._$AI(e,t),r),Jt={},Yt=(r,e=Jt)=>r._$AH=e,Gt=r=>r._$AH,fe=r=>{r._$AR(),r._$AA.remove()};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qe=(r,e,t)=>{const s=new Map;for(let i=e;i<=t;i++)s.set(r[i],i);return s},Qt=Bt(class extends Kt{constructor(r){if(super(r),r.type!==Wt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);const i=[],n=[];let o=0;for(const a of r)i[o]=s?s(a,o):o,n[o]=t(a,o),o++;return{values:n,keys:i}}render(r,e,t){return this.dt(r,e,t).values}update(r,[e,t,s]){const i=Gt(r),{values:n,keys:o}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=o,n;const a=this.ut??(this.ut=[]),l=[];let p,m,c=0,h=i.length-1,u=0,g=n.length-1;for(;c<=h&&u<=g;)if(i[c]===null)c++;else if(i[h]===null)h--;else if(a[c]===o[u])l[u]=P(i[c],n[u]),c++,u++;else if(a[h]===o[g])l[g]=P(i[h],n[g]),h--,g--;else if(a[c]===o[g])l[g]=P(i[c],n[g]),B(r,l[g+1],i[c]),c++,g--;else if(a[h]===o[u])l[u]=P(i[h],n[u]),B(r,i[c],i[h]),h--,u++;else if(p===void 0&&(p=qe(o,u,g),m=qe(a,c,h)),p.has(a[c]))if(p.has(a[h])){const v=m.get(o[u]),w=v!==void 0?i[v]:null;if(w===null){const j=B(r,i[c]);P(j,n[u]),l[u]=j}else l[u]=P(w,n[u]),B(r,i[c],w),i[v]=null;u++}else fe(i[h]),h--;else fe(i[c]),c++;for(;u<=g;){const v=B(r,l[g+1]);P(v,n[u]),l[u++]=v}for(;c<=h;){const v=i[c++];v!==null&&fe(v)}return this.ut=o,Yt(r,l),R}});var Be=Object.defineProperty,Zt=Object.getOwnPropertyDescriptor,Xt=(r,e,t)=>e in r?Be(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,xe=(r,e,t,s)=>{for(var i=s>1?void 0:s?Zt(e,t):e,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&Be(e,t,i),i},es=(r,e,t)=>Xt(r,e+"",t);let X=class extends C{constructor(){super(...arguments);d(this,"request");d(this,"values",{})}get fields(){return this.request.fields??[{name:"answer",label:this.request.question,type:"text",required:!0}]}connectedCallback(){var t;super.connectedCallback();const e={};for(const s of this.fields)s.type==="confirm"?e[s.name]=s.defaultValue??"no":s.type==="select"&&((t=s.options)!=null&&t.length)?e[s.name]=s.defaultValue??s.options[0]:e[s.name]=s.defaultValue??"";this.values=e}setValue(e,t){this.values={...this.values,[e]:t}}get canSubmit(){return this.fields.filter(e=>e.required).every(e=>{var t;return(t=this.values[e.name])==null?void 0:t.trim()})}handleSubmit(e){e.preventDefault(),this.canSubmit&&this.dispatchEvent(new CustomEvent("user-input-submit",{detail:this.values,bubbles:!0,composed:!0}))}renderField(e){const t=y`
      <span class="field-label">
        ${e.label}${e.required?y`<span class="field-required">*</span>`:f}
      </span>
    `;switch(e.type){case"textarea":return y`
          <div class="field">
            ${t}
            <textarea
              .value=${this.values[e.name]??""}
              @input=${s=>this.setValue(e.name,s.target.value)}
              placeholder=${e.placeholder??""}
              rows="4"
            ></textarea>
          </div>
        `;case"select":return y`
          <div class="field">
            ${t}
            <select
              .value=${this.values[e.name]??""}
              @change=${s=>this.setValue(e.name,s.target.value)}
            >
              ${(e.options??[]).map(s=>y`<option value=${s}>${s}</option>`)}
            </select>
          </div>
        `;case"confirm":return y`
          <div class="field field-confirm">
            ${t}
            <div class="confirm-toggle">
              <button
                type="button"
                class="confirm-btn ${this.values[e.name]==="yes"?"active":""}"
                @click=${()=>this.setValue(e.name,"yes")}
              >
                Yes
              </button>
              <button
                type="button"
                class="confirm-btn ${this.values[e.name]==="no"?"active":""}"
                @click=${()=>this.setValue(e.name,"no")}
              >
                No
              </button>
            </div>
          </div>
        `;case"text":default:return y`
          <div class="field">
            ${t}
            <input
              type="text"
              .value=${this.values[e.name]??""}
              @input=${s=>this.setValue(e.name,s.target.value)}
              placeholder=${e.placeholder??""}
            />
          </div>
        `}}render(){return y`
      <form @submit=${this.handleSubmit}>
        <div class="header">
          <span class="icon">💬</span>
          <h2>${this.request.question}</h2>
        </div>

        ${this.request.description?y`<p class="description">${this.request.description}</p>`:f}

        <div class="fields">
          ${this.fields.map(e=>this.renderField(e))}
        </div>

        <button type="submit" class="submit-btn" ?disabled=${!this.canSubmit}>
          Submit
        </button>
      </form>
    `}};es(X,"styles",ne`
    :host {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 20, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      animation: overlay-in 0.15s ease-out;
    }

    @keyframes overlay-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    form {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px 32px;
      width: 480px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: form-in 0.2s ease-out;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    @keyframes form-in {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .icon { font-size: 20px; }

    h2 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.3;
      margin: 0;
    }

    .description {
      color: var(--text-muted);
      font-size: 13px;
      line-height: 1.5;
      margin-top: -8px;
    }

    .fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .field-required {
      color: var(--accent);
      margin-left: 3px;
    }

    input[type="text"],
    textarea,
    select {
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg-input);
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
    }

    input[type="text"]:focus,
    textarea:focus,
    select:focus {
      border-color: var(--accent);
    }

    textarea {
      resize: vertical;
      min-height: 80px;
      line-height: 1.5;
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238888aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
    }

    .field-confirm {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .confirm-toggle {
      display: flex;
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
    }

    .confirm-btn {
      padding: 8px 20px;
      border: none;
      background: var(--bg-input);
      color: var(--text-muted);
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .confirm-btn + .confirm-btn {
      border-left: 1px solid var(--border);
    }

    .confirm-btn.active {
      background: var(--accent);
      color: var(--bg);
    }

    .submit-btn {
      padding: 12px;
      border: none;
      border-radius: 6px;
      background: var(--accent);
      color: var(--bg);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .submit-btn:hover { opacity: 0.9; }
    .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  `);xe([le({attribute:!1})],X.prototype,"request",2);xe([x()],X.prototype,"values",2);X=xe([ae("user-input-form")],X);var Ke=Object.defineProperty,ts=Object.getOwnPropertyDescriptor,ss=(r,e,t)=>e in r?Ke(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,_=(r,e,t,s)=>{for(var i=s>1?void 0:s?ts(e,t):e,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&Ke(e,t,i),i},is=(r,e,t)=>ss(r,e+"",t);let Ne=0,$=class extends C{constructor(){super(...arguments);d(this,"agent");d(this,"messages",[]);d(this,"input","");d(this,"streaming",!1);d(this,"streamText","");d(this,"streamToolCalls",[]);d(this,"suggestions",[]);d(this,"selectedSuggestion",0);d(this,"pendingInput",null);d(this,"messagesEl")}connectedCallback(){super.connectedCallback(),this.agent.setUserInputHandler(e=>new Promise(t=>{this.pendingInput={request:e,resolve:t}}))}scrollToBottom(){requestAnimationFrame(()=>{this.messagesEl&&(this.messagesEl.scrollTop=this.messagesEl.scrollHeight)})}updated(){this.scrollToBottom()}handleInputChange(e){this.input=e.target.value,this.updateSuggestions()}updateSuggestions(){const e=this.input.trim();if(e.startsWith("/")&&!e.includes(" ")){const t=e.slice(1);this.suggestions=this.agent.promptTemplates.search(t),this.selectedSuggestion=0}else this.suggestions=[]}acceptSuggestion(e){this.input=`/${e.name} `,this.suggestions=[]}handleUserInputSubmit(e){this.pendingInput&&(this.pendingInput.resolve(e.detail),this.pendingInput=null)}handleKeyDown(e){if(this.suggestions.length>0){if(e.key==="ArrowDown"){e.preventDefault(),this.selectedSuggestion=this.selectedSuggestion<this.suggestions.length-1?this.selectedSuggestion+1:0;return}if(e.key==="ArrowUp"){e.preventDefault(),this.selectedSuggestion=this.selectedSuggestion>0?this.selectedSuggestion-1:this.suggestions.length-1;return}if(e.key==="Tab"||e.key==="Enter"&&!e.shiftKey){e.preventDefault(),this.acceptSuggestion(this.suggestions[this.selectedSuggestion]);return}if(e.key==="Escape"){this.suggestions=[];return}}e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this.handleSubmit())}async handleSubmit(){const e=this.input.trim();if(!e||this.streaming)return;this.input="",this.suggestions=[],this.messages=[...this.messages,{id:Ne++,role:"user",content:e}],this.streaming=!0,this.streamText="",this.streamToolCalls=[];let t="";const s=[];try{for await(const i of this.agent.prompt(e))switch(i.type){case"text_delta":t+=i.delta,this.streamText=t;break;case"tool_call_start":s.push(i.toolCall),this.streamToolCalls=[...s];break;case"tool_call_end":{const n=s.findIndex(o=>o.id===i.toolCall.id);n>=0&&(s[n]=i.toolCall,this.streamToolCalls=[...s]);break}case"error":t+=`

**Error:** ${i.error}`,this.streamText=t;break}}catch(i){i.name!=="AbortError"&&(t+=`

**Error:** ${i}`)}this.messages=[...this.messages,{id:Ne++,role:"assistant",content:t,toolCalls:s.length>0?s:void 0}],this.streamText="",this.streamToolCalls=[],this.streaming=!1}renderToolCalls(e){return y`
      <div class="tool-calls">
        ${e.map(t=>y`
            <div class="tool-call">
              <div class="tool-call-name">
                🔧 ${t.name}(${JSON.stringify(t.arguments).slice(0,80)}${JSON.stringify(t.arguments).length>80?"…":""})
              </div>
              ${t.result?y`<div
                    class="tool-call-result ${t.result.isError?"tool-error":""}"
                  >
                    ${t.result.content.slice(0,200)}${t.result.content.length>200?"…":""}
                  </div>`:f}
            </div>
          `)}
      </div>
    `}renderMessage(e,t=!1){return y`
      <div class="message message-${e.role}">
        <div class="message-role">
          ${e.role==="user"?"you":"assistant"}
        </div>
        ${e.toolCalls&&e.toolCalls.length>0?this.renderToolCalls(e.toolCalls):f}
        <div class="message-content">
          ${e.content}${t?y`<span class="cursor">▊</span>`:f}
        </div>
      </div>
    `}render(){return y`
      <div class="header">
        <span class="title">π browser</span>
        <span class="model">anthropic/claude-sonnet-4</span>
      </div>

      <div class="messages">
        ${Qt(this.messages,e=>e.id,e=>this.renderMessage(e))}
        ${this.streaming&&(this.streamText||this.streamToolCalls.length>0)?this.renderMessage({id:-1,role:"assistant",content:this.streamText,toolCalls:this.streamToolCalls.length>0?this.streamToolCalls:void 0},!0):f}
      </div>

      <div class="input-area">
        <div class="input-wrapper">
          ${this.suggestions.length>0?y`
                <div class="autocomplete">
                  ${this.suggestions.map((e,t)=>y`
                      <div
                        class="autocomplete-item ${t===this.selectedSuggestion?"selected":""}"
                        @mouseenter=${()=>{this.selectedSuggestion=t}}
                        @click=${()=>this.acceptSuggestion(e)}
                      >
                        <span class="autocomplete-name">/${e.name}</span>
                        <span class="autocomplete-desc">${e.description}</span>
                      </div>
                    `)}
                </div>
              `:f}
          <textarea
            .value=${this.input}
            @input=${this.handleInputChange}
            placeholder="Send a message… (type / for templates)"
            rows="1"
            @keydown=${this.handleKeyDown}
            ?disabled=${this.streaming}
          ></textarea>
        </div>
        <button
          class="send-btn"
          @click=${this.streaming?()=>this.agent.abort():()=>this.handleSubmit()}
          ?disabled=${!this.streaming&&!this.input.trim()}
        >
          ${this.streaming?"Stop":"Send"}
        </button>
      </div>

      ${this.pendingInput?y`<user-input-form
            .request=${this.pendingInput.request}
            @user-input-submit=${this.handleUserInputSubmit}
          ></user-input-form>`:f}
    `}};is($,"styles",ne`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-secondary);
    }

    .title {
      font-weight: 600;
      color: var(--accent);
    }

    .model {
      font-size: 12px;
      color: var(--text-muted);
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
    }

    .message-role {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .message-user .message-role {
      color: var(--accent);
    }

    .message-content {
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.5;
    }

    .cursor {
      animation: blink 1s step-end infinite;
      color: var(--accent);
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }

    /* Tool calls */
    .tool-calls {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 8px;
    }

    .tool-call {
      padding: 8px 10px;
      border-radius: 4px;
      background: var(--tool-bg);
      border-left: 3px solid var(--accent-dim);
      font-size: 12px;
    }

    .tool-call-name {
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .tool-call-result {
      color: var(--text-muted);
      white-space: pre-wrap;
    }

    .tool-call-result.tool-error {
      color: var(--error);
    }

    /* Input area */
    .input-area {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      background: var(--bg-secondary);
    }

    .input-wrapper {
      flex: 1;
      position: relative;
    }

    textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg-input);
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      resize: none;
      outline: none;
      line-height: 1.4;
      box-sizing: border-box;
    }

    textarea:focus {
      border-color: var(--accent);
    }

    .send-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background: var(--accent);
      color: var(--bg);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    .send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Autocomplete */
    .autocomplete {
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      margin-bottom: 4px;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.3);
      z-index: 50;
      max-height: 240px;
      overflow-y: auto;
    }

    .autocomplete-item {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.1s;
    }

    .autocomplete-item:hover,
    .autocomplete-item.selected {
      background: var(--bg-input);
    }

    .autocomplete-name {
      color: var(--accent);
      font-weight: 600;
      white-space: nowrap;
    }

    .autocomplete-desc {
      color: var(--text-muted);
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `);_([le({attribute:!1})],$.prototype,"agent",2);_([x()],$.prototype,"messages",2);_([x()],$.prototype,"input",2);_([x()],$.prototype,"streaming",2);_([x()],$.prototype,"streamText",2);_([x()],$.prototype,"streamToolCalls",2);_([x()],$.prototype,"suggestions",2);_([x()],$.prototype,"selectedSuggestion",2);_([x()],$.prototype,"pendingInput",2);_([$t(".messages")],$.prototype,"messagesEl",2);$=_([ae("chat-view")],$);var Ve=Object.defineProperty,rs=Object.getOwnPropertyDescriptor,ns=(r,e,t)=>e in r?Ve(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,_e=(r,e,t,s)=>{for(var i=s>1?void 0:s?rs(e,t):e,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&Ve(e,t,i),i},os=(r,e,t)=>ns(r,e+"",t);let ee=class extends C{constructor(){super(...arguments);d(this,"started",!1);d(this,"apiKey",localStorage.getItem("pi-browser-api-key")??"");d(this,"agent",null)}handleStart(e){const t=e.detail;localStorage.setItem("pi-browser-api-key",t),this.apiKey=t,this.agent=new qt({apiKey:t,extensions:[Nt],skills:[Lt,zt],promptTemplates:Dt}),this.started=!0}render(){return this.started?y`<chat-view .agent=${this.agent}></chat-view>`:y`<api-key-screen
        .initialKey=${this.apiKey}
        @start-agent=${this.handleStart}
      ></api-key-screen>`}};os(ee,"styles",ne`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `);_e([x()],ee.prototype,"started",2);_e([x()],ee.prototype,"apiKey",2);ee=_e([ae("app-root")],ee);const as=document.getElementById("root");as.innerHTML="<app-root></app-root>";
