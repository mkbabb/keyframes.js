(function(S,O){typeof exports=="object"&&typeof module<"u"?O(exports):typeof define=="function"&&define.amd?define(["exports"],O):(S=typeof globalThis<"u"?globalThis:S||self,O(S.Keyframes={}))})(this,function(S){"use strict";var kn=Object.defineProperty;var Sn=(S,O,N)=>O in S?kn(S,O,{enumerable:!0,configurable:!0,writable:!0,value:N}):S[O]=N;var k=(S,O,N)=>(Sn(S,typeof O!="symbol"?O+"":O,N),N);function O(t,n,i,o=0,l=1){const s=(l-o)/(i-n);return(t-n)*s+o}function N(t,n,i){return(1-t)*n+t*i}function wt(t,n){const i=n.length-1;let o=[...n];for(let l=1;l<=i;l++)for(let s=0;s<=i-l;s++)o[s]=N(t,o[s],o[s+1]);return o[0]}function ke(t,n,i,o,l){return[wt(t,[0,n,o,1]),wt(t,[0,i,l,1])]}function Se(t,n){const i=n.map(l=>l[0]),o=n.map(l=>l[1]);return[wt(t,i),wt(t,o)]}function $e(t){return t*t}function je(t){return-t*(t-2)}function Fe(t){return(t/=.5)<1?.5*t*t:-.5*(--t*(t-2)-1)}function Oe(t){return t*t*t}function Be(t){return(t=t-1)*t*t+1}function zt(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}function Pe(t){return t*t*(3-2*t)}const Ut=(t,n,i,o)=>l=>(l=ke(l,t,n,i,o)[1],l);function Me(t){return t=Ut(.09,.91,.5,1.5)(t),t}function Ne(t){return t=Ut(.09,.91,.5,1.5)(t),t}function Te(t){return t=Se(t,[[0,0],[.026,1.746],[.633,1.06],[1,0]])[1],t}function Vt(t,n,i){t.prototype=n.prototype=i,i.constructor=t}function Wt(t,n){var i=Object.create(t.prototype);for(var o in n)i[o]=n[o];return i}function ft(){}var ct=.7,vt=1/ct,J="\\s*([+-]?\\d+)\\s*",lt="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",L="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",_e=/^#([0-9a-f]{3,8})$/,Ce=new RegExp(`^rgb\\(${J},${J},${J}\\)$`),Le=new RegExp(`^rgb\\(${L},${L},${L}\\)$`),Ve=new RegExp(`^rgba\\(${J},${J},${J},${lt}\\)$`),qe=new RegExp(`^rgba\\(${L},${L},${L},${lt}\\)$`),Ae=new RegExp(`^hsl\\(${lt},${L},${L}\\)$`),Ie=new RegExp(`^hsla\\(${lt},${L},${L},${lt}\\)$`),Dt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Vt(ft,ht,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:Kt,formatHex:Kt,formatHex8:He,formatHsl:Re,formatRgb:Gt,toString:Gt});function Kt(){return this.rgb().formatHex()}function He(){return this.rgb().formatHex8()}function Re(){return Yt(this).formatHsl()}function Gt(){return this.rgb().formatRgb()}function ht(t){var n,i;return t=(t+"").trim().toLowerCase(),(n=_e.exec(t))?(i=n[1].length,n=parseInt(n[1],16),i===6?Qt(n):i===3?new F(n>>8&15|n>>4&240,n>>4&15|n&240,(n&15)<<4|n&15,1):i===8?yt(n>>24&255,n>>16&255,n>>8&255,(n&255)/255):i===4?yt(n>>12&15|n>>8&240,n>>8&15|n>>4&240,n>>4&15|n&240,((n&15)<<4|n&15)/255):null):(n=Ce.exec(t))?new F(n[1],n[2],n[3],1):(n=Le.exec(t))?new F(n[1]*255/100,n[2]*255/100,n[3]*255/100,1):(n=Ve.exec(t))?yt(n[1],n[2],n[3],n[4]):(n=qe.exec(t))?yt(n[1]*255/100,n[2]*255/100,n[3]*255/100,n[4]):(n=Ae.exec(t))?Xt(n[1],n[2]/100,n[3]/100,1):(n=Ie.exec(t))?Xt(n[1],n[2]/100,n[3]/100,n[4]):Dt.hasOwnProperty(t)?Qt(Dt[t]):t==="transparent"?new F(NaN,NaN,NaN,0):null}function Qt(t){return new F(t>>16&255,t>>8&255,t&255,1)}function yt(t,n,i,o){return o<=0&&(t=n=i=NaN),new F(t,n,i,o)}function ze(t){return t instanceof ft||(t=ht(t)),t?(t=t.rgb(),new F(t.r,t.g,t.b,t.opacity)):new F}function Ue(t,n,i,o){return arguments.length===1?ze(t):new F(t,n,i,o??1)}function F(t,n,i,o){this.r=+t,this.g=+n,this.b=+i,this.opacity=+o}Vt(F,Ue,Wt(ft,{brighter(t){return t=t==null?vt:Math.pow(vt,t),new F(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=t==null?ct:Math.pow(ct,t),new F(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new F(R(this.r),R(this.g),R(this.b),Et(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Zt,formatHex:Zt,formatHex8:We,formatRgb:Jt,toString:Jt}));function Zt(){return`#${z(this.r)}${z(this.g)}${z(this.b)}`}function We(){return`#${z(this.r)}${z(this.g)}${z(this.b)}${z((isNaN(this.opacity)?1:this.opacity)*255)}`}function Jt(){const t=Et(this.opacity);return`${t===1?"rgb(":"rgba("}${R(this.r)}, ${R(this.g)}, ${R(this.b)}${t===1?")":`, ${t})`}`}function Et(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function R(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function z(t){return t=R(t),(t<16?"0":"")+t.toString(16)}function Xt(t,n,i,o){return o<=0?t=n=i=NaN:i<=0||i>=1?t=n=NaN:n<=0&&(t=NaN),new C(t,n,i,o)}function Yt(t){if(t instanceof C)return new C(t.h,t.s,t.l,t.opacity);if(t instanceof ft||(t=ht(t)),!t)return new C;if(t instanceof C)return t;t=t.rgb();var n=t.r/255,i=t.g/255,o=t.b/255,l=Math.min(n,i,o),s=Math.max(n,i,o),f=NaN,g=s-l,b=(s+l)/2;return g?(n===s?f=(i-o)/g+(i<o)*6:i===s?f=(o-n)/g+2:f=(n-i)/g+4,g/=b<.5?s+l:2-s-l,f*=60):g=b>0&&b<1?0:f,new C(f,g,b,t.opacity)}function De(t,n,i,o){return arguments.length===1?Yt(t):new C(t,n,i,o??1)}function C(t,n,i,o){this.h=+t,this.s=+n,this.l=+i,this.opacity=+o}Vt(C,De,Wt(ft,{brighter(t){return t=t==null?vt:Math.pow(vt,t),new C(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=t==null?ct:Math.pow(ct,t),new C(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+(this.h<0)*360,n=isNaN(t)||isNaN(this.s)?0:this.s,i=this.l,o=i+(i<.5?i:1-i)*n,l=2*i-o;return new F(qt(t>=240?t-240:t+120,l,o),qt(t,l,o),qt(t<120?t+240:t-120,l,o),this.opacity)},clamp(){return new C(te(this.h),kt(this.s),kt(this.l),Et(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=Et(this.opacity);return`${t===1?"hsl(":"hsla("}${te(this.h)}, ${kt(this.s)*100}%, ${kt(this.l)*100}%${t===1?")":`, ${t})`}`}}));function te(t){return t=(t||0)%360,t<0?t+360:t}function kt(t){return Math.max(0,Math.min(1,t||0))}function qt(t,n,i){return(t<60?n+(i-n)*t/60:t<180?i:t<240?n+(i-n)*(240-t)/60:n)*255}var Ke=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Ge(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var At={},Qe={get exports(){return At},set exports(t){At=t}};(function(t,n){(function(i,o){t.exports=o()})(typeof self<"u"?self:Ke,function(){return function(i){var o={};function l(s){if(o[s])return o[s].exports;var f=o[s]={i:s,l:!1,exports:{}};return i[s].call(f.exports,f,f.exports,l),f.l=!0,f.exports}return l.m=i,l.c=o,l.d=function(s,f,g){l.o(s,f)||Object.defineProperty(s,f,{configurable:!1,enumerable:!0,get:g})},l.r=function(s){Object.defineProperty(s,"__esModule",{value:!0})},l.n=function(s){var f=s&&s.__esModule?function(){return s.default}:function(){return s};return l.d(f,"a",f),f},l.o=function(s,f){return Object.prototype.hasOwnProperty.call(s,f)},l.p="",l(l.s=0)}([function(i,o,l){function s(e){if(!(this instanceof s))return new s(e);this._=e}var f=s.prototype;function g(e,r){for(var a=0;a<e;a++)r(a)}function b(e,r,a){return function(u,c){g(c.length,function(h){u(c[h],h,c)})}(function(u,c,h){r=e(r,u,c,h)},a),r}function $(e,r){return b(function(a,u,c,h){return a.concat([e(u,c,h)])},[],r)}function W(e,r){var a={v:0,buf:r};return g(e,function(){var u;a={v:a.v<<1|(u=a.buf,u[0]>>7),buf:function(c){var h=b(function(p,d,x,j){return p.concat(x===j.length-1?Buffer.from([d,0]).readUInt16BE(0):j.readUInt16BE(x))},[],c);return Buffer.from($(function(p){return(p<<1&65535)>>8},h))}(a.buf)}}),a}function X(){return typeof Buffer<"u"}function D(){if(!X())throw new Error("Buffer global does not exist; please use webpack if you need to parse Buffers in the browser.")}function Y(e){D();var r=b(function(h,p){return h+p},0,e);if(r%8!=0)throw new Error("The bits ["+e.join(", ")+"] add up to "+r+" which is not an even number of bytes; the total should be divisible by 8");var a,u=r/8,c=(a=function(h){return h>48},b(function(h,p){return h||(a(p)?p:h)},null,e));if(c)throw new Error(c+" bit range requested exceeds 48 bit (6 byte) Number max.");return new s(function(h,p){var d=u+p;return d>h.length?P(p,u.toString()+" bytes"):v(d,b(function(x,j){var E=W(j,x.buf);return{coll:x.coll.concat(E.v),buf:E.buf}},{coll:[],buf:h.slice(p,d)},e).coll)})}function w(e,r){return new s(function(a,u){return D(),u+r>a.length?P(u,r+" bytes for "+e):v(u+r,a.slice(u,u+r))})}function B(e,r){if(typeof(a=r)!="number"||Math.floor(a)!==a||r<0||r>6)throw new Error(e+" requires integer length in range [0, 6].");var a}function V(e){return B("uintBE",e),w("uintBE("+e+")",e).map(function(r){return r.readUIntBE(0,e)})}function tt(e){return B("uintLE",e),w("uintLE("+e+")",e).map(function(r){return r.readUIntLE(0,e)})}function jt(e){return B("intBE",e),w("intBE("+e+")",e).map(function(r){return r.readIntBE(0,e)})}function Ft(e){return B("intLE",e),w("intLE("+e+")",e).map(function(r){return r.readIntLE(0,e)})}function dt(e){return e instanceof s}function et(e){return{}.toString.call(e)==="[object Array]"}function mt(e){return X()&&Buffer.isBuffer(e)}function v(e,r){return{status:!0,index:e,value:r,furthest:-1,expected:[]}}function P(e,r){return et(r)||(r=[r]),{status:!1,index:-1,value:null,furthest:e,expected:r}}function _(e,r){if(!r||e.furthest>r.furthest)return e;var a=e.furthest===r.furthest?function(u,c){if(function(){if(s._supportsSet!==void 0)return s._supportsSet;var I=typeof Set<"u";return s._supportsSet=I,I}()&&Array.from){for(var h=new Set(u),p=0;p<c.length;p++)h.add(c[p]);var d=Array.from(h);return d.sort(),d}for(var x={},j=0;j<u.length;j++)x[u[j]]=!0;for(var E=0;E<c.length;E++)x[c[E]]=!0;var A=[];for(var M in x)({}).hasOwnProperty.call(x,M)&&A.push(M);return A.sort(),A}(e.expected,r.expected):r.expected;return{status:e.status,index:e.index,value:e.value,furthest:r.furthest,expected:a}}var Ot={};function le(e,r){if(mt(e))return{offset:r,line:-1,column:-1};e in Ot||(Ot[e]={});for(var a=Ot[e],u=0,c=0,h=0,p=r;p>=0;){if(p in a){u=a[p].line,h===0&&(h=a[p].lineStart);break}(e.charAt(p)===`
`||e.charAt(p)==="\r"&&e.charAt(p+1)!==`
`)&&(c++,h===0&&(h=p+1)),p--}var d=u+c,x=r-h;return a[r]={line:d,lineStart:h},{offset:r,line:d+1,column:x+1}}function nt(e){if(!dt(e))throw new Error("not a parser: "+e)}function Bt(e,r){return typeof e=="string"?e.charAt(r):e[r]}function rt(e){if(typeof e!="number")throw new Error("not a number: "+e)}function K(e){if(typeof e!="function")throw new Error("not a function: "+e)}function gt(e){if(typeof e!="string")throw new Error("not a string: "+e)}var un=2,fn=3,H=8,cn=5*H,ln=4*H,he="  ";function Pt(e,r){return new Array(r+1).join(e)}function Mt(e,r,a){var u=r-e.length;return u<=0?e:Pt(a,u)+e}function pe(e,r,a,u){return{from:e-r>0?e-r:0,to:e+a>u?u:e+a}}function hn(e,r){var a,u,c,h,p,d=r.index,x=d.offset,j=1;if(x===e.length)return"Got the end of the input";if(mt(e)){var E=x-x%H,A=x-E,M=pe(E,cn,ln+H,e.length),I=$(function(y){return $(function(st){return Mt(st.toString(16),2,"0")},y)},function(y,st){var at=y.length,Z=[],ot=0;if(at<=st)return[y.slice()];for(var ut=0;ut<at;ut++)Z[ot]||Z.push([]),Z[ot].push(y[ut]),(ut+1)%st==0&&ot++;return Z}(e.slice(M.from,M.to).toJSON().data,H));h=function(y){return y.from===0&&y.to===1?{from:y.from,to:y.to}:{from:y.from/H,to:Math.floor(y.to/H)}}(M),u=E/H,a=3*A,A>=4&&(a+=1),j=2,c=$(function(y){return y.length<=4?y.join(" "):y.slice(0,4).join(" ")+"  "+y.slice(4).join(" ")},I),(p=(8*(h.to>0?h.to-1:h.to)).toString(16).length)<2&&(p=2)}else{var it=e.split(/\r\n|[\n\r\u2028\u2029]/);a=d.column-1,u=d.line-1,h=pe(u,un,fn,it.length),c=it.slice(h.from,h.to),p=h.to.toString().length}var En=u-h.from;return mt(e)&&(p=(8*(h.to>0?h.to-1:h.to)).toString(16).length)<2&&(p=2),b(function(y,st,at){var Z,ot=at===En,ut=ot?"> ":he;return Z=mt(e)?Mt((8*(h.from+at)).toString(16),p,"0"):Mt((h.from+at+1).toString(),p," "),[].concat(y,[ut+Z+" | "+st],ot?[he+Pt(" ",p)+" | "+Mt("",a," ")+Pt("^",j)]:[])},[],c).join(`
`)}function de(e,r){return[`
`,"-- PARSING FAILED "+Pt("-",50),`

`,hn(e,r),`

`,(a=r.expected,a.length===1?`Expected:

`+a[0]:`Expected one of the following: 

`+a.join(", ")),`
`].join("");var a}function me(e){return e.flags!==void 0?e.flags:[e.global?"g":"",e.ignoreCase?"i":"",e.multiline?"m":"",e.unicode?"u":"",e.sticky?"y":""].join("")}function Nt(){for(var e=[].slice.call(arguments),r=e.length,a=0;a<r;a+=1)nt(e[a]);return s(function(u,c){for(var h,p=new Array(r),d=0;d<r;d+=1){if(!(h=_(e[d]._(u,c),h)).status)return h;p[d]=h.value,c=h.index}return _(v(c,p),h)})}function G(){var e=[].slice.call(arguments);if(e.length===0)throw new Error("seqMap needs at least one argument");var r=e.pop();return K(r),Nt.apply(null,e).map(function(a){return r.apply(null,a)})}function Tt(){var e=[].slice.call(arguments),r=e.length;if(r===0)return _t("zero alternates");for(var a=0;a<r;a+=1)nt(e[a]);return s(function(u,c){for(var h,p=0;p<e.length;p+=1)if((h=_(e[p]._(u,c),h)).status)return h;return h})}function ge(e,r){return It(e,r).or(Q([]))}function It(e,r){return nt(e),nt(r),G(e,r.then(e).many(),function(a,u){return[a].concat(u)})}function xt(e){gt(e);var r="'"+e+"'";return s(function(a,u){var c=u+e.length,h=a.slice(u,c);return h===e?v(c,h):P(u,r)})}function q(e,r){(function(c){if(!(c instanceof RegExp))throw new Error("not a regexp: "+c);for(var h=me(c),p=0;p<h.length;p++){var d=h.charAt(p);if(d!=="i"&&d!=="m"&&d!=="u"&&d!=="s")throw new Error('unsupported regexp flag "'+d+'": '+c)}})(e),arguments.length>=2?rt(r):r=0;var a=function(c){return RegExp("^(?:"+c.source+")",me(c))}(e),u=""+e;return s(function(c,h){var p=a.exec(c.slice(h));if(p){if(0<=r&&r<=p.length){var d=p[0],x=p[r];return v(h+d.length,x)}return P(h,"valid match group (0 to "+p.length+") in "+u)}return P(h,u)})}function Q(e){return s(function(r,a){return v(a,e)})}function _t(e){return s(function(r,a){return P(a,e)})}function Ct(e){if(dt(e))return s(function(r,a){var u=e._(r,a);return u.index=a,u.value="",u});if(typeof e=="string")return Ct(xt(e));if(e instanceof RegExp)return Ct(q(e));throw new Error("not a string, regexp, or parser: "+e)}function xe(e){return nt(e),s(function(r,a){var u=e._(r,a),c=r.slice(a,u.index);return u.status?P(a,'not "'+c+'"'):v(a,null)})}function Lt(e){return K(e),s(function(r,a){var u=Bt(r,a);return a<r.length&&e(u)?v(a+1,u):P(a,"a character/byte matching "+e)})}function be(e,r){arguments.length<2&&(r=e,e=void 0);var a=s(function(u,c){return a._=r()._,a._(u,c)});return e?a.desc(e):a}function Ht(){return _t("fantasy-land/empty")}f.parse=function(e){if(typeof e!="string"&&!mt(e))throw new Error(".parse must be called with a string or Buffer as its argument");var r,a=this.skip(Rt)._(e,0);return r=a.status?{status:!0,value:a.value}:{status:!1,index:le(e,a.furthest),expected:a.expected},delete Ot[e],r},f.tryParse=function(e){var r=this.parse(e);if(r.status)return r.value;var a=de(e,r),u=new Error(a);throw u.type="ParsimmonError",u.result=r,u},f.assert=function(e,r){return this.chain(function(a){return e(a)?Q(a):_t(r)})},f.or=function(e){return Tt(this,e)},f.trim=function(e){return this.wrap(e,e)},f.wrap=function(e,r){return G(e,this,r,function(a,u){return u})},f.thru=function(e){return e(this)},f.then=function(e){return nt(e),Nt(this,e).map(function(r){return r[1]})},f.many=function(){var e=this;return s(function(r,a){for(var u=[],c=void 0;;){if(!(c=_(e._(r,a),c)).status)return _(v(a,u),c);if(a===c.index)throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");a=c.index,u.push(c.value)}})},f.tieWith=function(e){return gt(e),this.map(function(r){if(function(c){if(!et(c))throw new Error("not an array: "+c)}(r),r.length){gt(r[0]);for(var a=r[0],u=1;u<r.length;u++)gt(r[u]),a+=e+r[u];return a}return""})},f.tie=function(){return this.tieWith("")},f.times=function(e,r){var a=this;return arguments.length<2&&(r=e),rt(e),rt(r),s(function(u,c){for(var h=[],p=void 0,d=void 0,x=0;x<e;x+=1){if(d=_(p=a._(u,c),d),!p.status)return d;c=p.index,h.push(p.value)}for(;x<r&&(d=_(p=a._(u,c),d),p.status);x+=1)c=p.index,h.push(p.value);return _(v(c,h),d)})},f.result=function(e){return this.map(function(){return e})},f.atMost=function(e){return this.times(0,e)},f.atLeast=function(e){return G(this.times(e),this.many(),function(r,a){return r.concat(a)})},f.map=function(e){K(e);var r=this;return s(function(a,u){var c=r._(a,u);return c.status?_(v(c.index,e(c.value)),c):c})},f.contramap=function(e){K(e);var r=this;return s(function(a,u){var c=r.parse(e(a.slice(u)));return c.status?v(u+a.length,c.value):c})},f.promap=function(e,r){return K(e),K(r),this.contramap(e).map(r)},f.skip=function(e){return Nt(this,e).map(function(r){return r[0]})},f.mark=function(){return G(bt,this,bt,function(e,r,a){return{start:e,value:r,end:a}})},f.node=function(e){return G(bt,this,bt,function(r,a,u){return{name:e,value:a,start:r,end:u}})},f.sepBy=function(e){return ge(this,e)},f.sepBy1=function(e){return It(this,e)},f.lookahead=function(e){return this.skip(Ct(e))},f.notFollowedBy=function(e){return this.skip(xe(e))},f.desc=function(e){et(e)||(e=[e]);var r=this;return s(function(a,u){var c=r._(a,u);return c.status||(c.expected=e),c})},f.fallback=function(e){return this.or(Q(e))},f.ap=function(e){return G(e,this,function(r,a){return r(a)})},f.chain=function(e){var r=this;return s(function(a,u){var c=r._(a,u);return c.status?_(e(c.value)._(a,c.index),c):c})},f.concat=f.or,f.empty=Ht,f.of=Q,f["fantasy-land/ap"]=f.ap,f["fantasy-land/chain"]=f.chain,f["fantasy-land/concat"]=f.concat,f["fantasy-land/empty"]=f.empty,f["fantasy-land/of"]=f.of,f["fantasy-land/map"]=f.map;var bt=s(function(e,r){return v(r,le(e,r))}),pn=s(function(e,r){return r>=e.length?P(r,"any character/byte"):v(r+1,Bt(e,r))}),dn=s(function(e,r){return v(e.length,e.slice(r))}),Rt=s(function(e,r){return r<e.length?P(r,"EOF"):v(r,null)}),mn=q(/[0-9]/).desc("a digit"),gn=q(/[0-9]*/).desc("optional digits"),xn=q(/[a-z]/i).desc("a letter"),bn=q(/[a-z]*/i).desc("optional letters"),wn=q(/\s*/).desc("optional whitespace"),vn=q(/\s+/).desc("whitespace"),we=xt("\r"),ve=xt(`
`),ye=xt(`\r
`),Ee=Tt(ye,ve,we).desc("newline"),yn=Tt(Ee,Rt);s.all=dn,s.alt=Tt,s.any=pn,s.cr=we,s.createLanguage=function(e){var r={};for(var a in e)({}).hasOwnProperty.call(e,a)&&function(u){r[u]=be(function(){return e[u](r)})}(a);return r},s.crlf=ye,s.custom=function(e){return s(e(v,P))},s.digit=mn,s.digits=gn,s.empty=Ht,s.end=yn,s.eof=Rt,s.fail=_t,s.formatError=de,s.index=bt,s.isParser=dt,s.lazy=be,s.letter=xn,s.letters=bn,s.lf=ve,s.lookahead=Ct,s.makeFailure=P,s.makeSuccess=v,s.newline=Ee,s.noneOf=function(e){return Lt(function(r){return e.indexOf(r)<0}).desc("none of '"+e+"'")},s.notFollowedBy=xe,s.of=Q,s.oneOf=function(e){for(var r=e.split(""),a=0;a<r.length;a++)r[a]="'"+r[a]+"'";return Lt(function(u){return e.indexOf(u)>=0}).desc(r)},s.optWhitespace=wn,s.Parser=s,s.range=function(e,r){return Lt(function(a){return e<=a&&a<=r}).desc(e+"-"+r)},s.regex=q,s.regexp=q,s.sepBy=ge,s.sepBy1=It,s.seq=Nt,s.seqMap=G,s.seqObj=function(){for(var e,r={},a=0,u=(e=arguments,Array.prototype.slice.call(e)),c=u.length,h=0;h<c;h+=1){var p=u[h];if(!dt(p)){if(et(p)&&p.length===2&&typeof p[0]=="string"&&dt(p[1])){var d=p[0];if(Object.prototype.hasOwnProperty.call(r,d))throw new Error("seqObj: duplicate key "+d);r[d]=!0,a++;continue}throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.")}}if(a===0)throw new Error("seqObj expects at least one named parser, found zero");return s(function(x,j){for(var E,A={},M=0;M<c;M+=1){var I,it;if(et(u[M])?(I=u[M][0],it=u[M][1]):(I=null,it=u[M]),!(E=_(it._(x,j),E)).status)return E;I&&(A[I]=E.value),j=E.index}return _(v(j,A),E)})},s.string=xt,s.succeed=Q,s.takeWhile=function(e){return K(e),s(function(r,a){for(var u=a;u<r.length&&e(Bt(r,u));)u++;return v(u,r.slice(a,u))})},s.test=Lt,s.whitespace=vn,s["fantasy-land/empty"]=Ht,s["fantasy-land/of"]=Q,s.Binary={bitSeq:Y,bitSeqObj:function(e){D();var r={},a=0,u=$(function(h){if(et(h)){var p=h;if(p.length!==2)throw new Error("["+p.join(", ")+"] should be length 2, got length "+p.length);if(gt(p[0]),rt(p[1]),Object.prototype.hasOwnProperty.call(r,p[0]))throw new Error("duplicate key in bitSeqObj: "+p[0]);return r[p[0]]=!0,a++,p}return rt(h),[null,h]},e);if(a<1)throw new Error("bitSeqObj expects at least one named pair, got ["+e.join(", ")+"]");var c=$(function(h){return h[0]},u);return Y($(function(h){return h[1]},u)).map(function(h){return b(function(p,d){return d[0]!==null&&(p[d[0]]=d[1]),p},{},$(function(p,d){return[p,h[d]]},c))})},byte:function(e){if(D(),rt(e),e>255)throw new Error("Value specified to byte constructor ("+e+"=0x"+e.toString(16)+") is larger in value than a single byte.");var r=(e>15?"0x":"0x0")+e.toString(16);return s(function(a,u){var c=Bt(a,u);return c===e?v(u+1,c):P(u,r)})},buffer:function(e){return w("buffer",e).map(function(r){return Buffer.from(r)})},encodedString:function(e,r){return w("string",r).map(function(a){return a.toString(e)})},uintBE:V,uint8BE:V(1),uint16BE:V(2),uint32BE:V(4),uintLE:tt,uint8LE:tt(1),uint16LE:tt(2),uint32LE:tt(4),intBE:jt,int8BE:jt(1),int16BE:jt(2),int32BE:jt(4),intLE:Ft,int8LE:Ft(1),int16LE:Ft(2),int32LE:Ft(4),floatBE:w("floatBE",4).map(function(e){return e.readFloatBE(0)}),floatLE:w("floatLE",4).map(function(e){return e.readFloatLE(0)}),doubleBE:w("doubleBE",8).map(function(e){return e.readDoubleBE(0)}),doubleLE:w("doubleLE",8).map(function(e){return e.readDoubleLE(0)})},i.exports=s}])})})(Qe);const m=Ge(At),ee=(t,n)=>{const i=getComputedStyle(t).getPropertyValue("--"+n),o=$t.valueUnit.parse(i);return o.status?o.value:void 0};class T{constructor(n,i){this.value=n,this.unit=i;const o=ht(n);o&&(this.unit="color",this.value=o)}toString(){if(this.unit==="color"){const n=this.value;return`rgb(${n.r}, ${n.g}, ${n.b})`}else return this.unit&&this.unit!=="var"?`${this.value}${this.unit}`:`${this.value}`}lerp(n,i,o){if(this.unit==="color"){const l={r:N(n,this.value.r,i.value.r),g:N(n,this.value.g,i.value.g),b:N(n,this.value.b,i.value.b)};return new T(l,this.unit)}else if(o&&(this.unit==="var"||i.unit==="var")){const l=this.unit==="var"?ee(o,this.value):this,s=i.unit==="var"?ee(o,i.value):i;return l.lerp(n,s,o)}else if(this.unit!==i.unit){const l=ne(this.value,this.unit,o),s=ne(i.value,i.unit,o),f=N(n,l,s);return new T(f,"px")}else{const l=N(n,this.value,i.value);return new T(l,this.unit)}}}class U{constructor(n,i){this.name=n,this.values=i}toString(){const n=this.values.map(i=>i.toString()).join(", ");return`${this.name}(${n})`}lerp(n,i,o){const l=Math.min(this.values.length,i.values.length),s=[];for(let f=0;f<l;f++){const g=this.values[f],b=i.values[f];s.push(g.lerp(n,b,o))}return new U(this.name,s)}}class pt{constructor(n){this.values=n}toString(){return this.values.map(n=>n.toString()).join(" ")}lerp(n,i,o){const l=Math.min(this.values.length,i.values.length),s=[];for(let f=0;f<l;f++){const g=this.values[f],b=i.values[f];s.push(g.lerp(n,b,o))}return new pt(s)}}function Ze(t,n){let i=t;return n==="cm"?i*=96/2.54:n==="mm"?i*=96/25.4:n==="in"?i*=96:n==="pt"?i*=4/3:n==="pc"&&(i*=16),i}function ne(t,n,i,o){if(n==="em"&&i)t*=parseFloat(getComputedStyle(i).fontSize);else if(n==="rem")t*=parseFloat(getComputedStyle(document.documentElement).fontSize);else if(n==="vh")t*=window.innerHeight/100;else if(n==="vw")t*=window.innerWidth/100;else if(n==="vmin")t*=Math.min(window.innerHeight,window.innerWidth)/100;else if(n==="vmax")t*=Math.max(window.innerHeight,window.innerWidth)/100;else if(n==="%"&&(i!=null&&i.parentElement)&&o){const l=parseFloat(getComputedStyle(i.parentElement).getPropertyValue(o));t=t/100*l}else t=Ze(t,n);return t}const Je=t=>t.replace(/([-_][a-z])/gi,n=>n.toUpperCase().replace("-","").replace("_","")),re=t=>m((n,i)=>n.slice(i).toLowerCase().startsWith(t.toLowerCase())?m.makeSuccess(i+t.length,t):m.makeFailure(i,`Expected ${t}`)),St=(t,n,i,o)=>(i=i??t.lparen,o=o??t.rparen,t.ws.skip(i).skip(t.ws).then(n).skip(t.ws).skip(o).skip(t.ws)),Xe=m.createLanguage({number:()=>m.regexp(/-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/).map(Number),unit:()=>m.regexp(/[a-zA-Z%]+/),numberValue:t=>t.number.map(n=>new T(n)),unitValue:t=>m.seq(t.number,t.unit).map(([n,i])=>new T(n,i)),colorValue:()=>m((t,n)=>{var l;const i=t.slice(n),o=(l=ht(i))==null?void 0:l.rgb();return o?m.makeSuccess(n+t.length,new T(o,"color")):m.makeFailure(n,"Invalid color")}),value:t=>m.alt(t.colorValue,t.unitValue,t.numberValue)}),Ye=["translate","scale","rotate","skew"].map(re),tn=["x","y","z"].map(re),$t=m.createLanguage({identifier:()=>m.regexp(/[a-zA-Z][a-zA-Z0-9-]+/),ws:()=>m.optWhitespace,rule:t=>t.ws.then(m.string("@keyframes")).skip(t.ws).then(t.identifier),semi:()=>m.string(";"),colon:()=>m.string(":"),lcurly:()=>m.string("{"),rcurly:()=>m.string("}"),lparen:()=>m.string("("),rparen:()=>m.string(")"),commaWhitespace:t=>t.ws.then(m.string(",")).skip(t.ws),percent:t=>t.ws.then(m.alt(m.regexp(/\d+/).skip(m.string("%").or(m.string(""))),m.string("from").map(()=>"0"),m.string("to").map(()=>"100"))).skip(t.ws).map(Number),unitValue:()=>m.regexp(/[^(){},;\s]+/).map(t=>new T(t)),valueUnit:t=>t.ws.then(m.alt(Xe.value,t.unitValue)).skip(t.ws),transforms:t=>m.seq(m.alt(...Ye),m.alt(...tn,m.string("")),St(t,t.functionValuePart)).map(([n,i,o])=>(n=n.toLowerCase(),i?new U(n+i.toUpperCase(),[o[0]]):o.length===1?new U(n,[o[0]]):new U(n,o))),variable:t=>m.string("var").then(St(t,m.string("--").then(t.identifier))).map(n=>new T(n,"var")),calc:t=>m.string("calc").then(St(t,t.valuePart.many())).map(n=>new T(n,"calc")),functionValuePart:t=>t.valuePart.sepBy(t.commaWhitespace),functionValue:t=>m.alt(t.transforms,t.variable,t.calc,m.seq(t.identifier,St(t,t.functionValuePart)).map(([n,i])=>new U(n,i))),valuePart:t=>m.alt(t.functionValue,t.valueUnit).skip(t.ws),value:t=>t.valuePart.sepBy(t.ws).map(n=>new pt(n)),values:t=>m.seq(t.identifier.skip(t.ws).skip(t.colon).skip(t.ws).map(n=>Je(n)),t.value.skip(t.ws).skip(t.semi).skip(t.ws)).map(([n,i])=>({[n]:i})),frame:t=>m.seq(t.percent.skip(t.ws).skip(t.lcurly).skip(t.ws),t.values.atLeast(1).skip(t.ws).skip(t.rcurly)).map(([n,i])=>({[n]:Object.assign({},...i)})),keyframe:t=>t.rule.skip(t.ws).skip(t.lcurly).skip(t.ws).then(t.frame.many()).skip(t.ws).skip(t.rcurly).skip(t.ws).map(n=>Object.assign({},...n))}),en=t=>$t.keyframe.tryParse(t),ie=t=>$t.percent.tryParse(String(t));async function se(t){return await new Promise(n=>setTimeout(n,t))}function nn(t){const n={},i=(o,l="")=>{if(o instanceof T||o instanceof U||o instanceof pt)return o instanceof T?new pt([o]):o;if(typeof o=="object")for(const[f,g]of Object.entries(o)){const b=l?`${l}.${f}`:f,$=i(g,b);$!==void 0&&(n[b]=$)}else{const f=$t.value.parse(String(o));return f.status?f.value:void 0}};return i(t),n}function rn(t,n,i){const o=t.split(".");let l=i;for(let s=0;s<o.length;s++){const f=o[s];n!==void 0&&s===o.length-1?l[f]=n.toString():l=l[f]??(l[f]={})}return i}async function sn(t,n=1e3/60){return await new Promise(i=>{const o=setInterval(()=>{t()&&(clearInterval(o),i())},n)})}const an={easeInQuad:$e,easeOutQuad:je,easeInOutQuad:Fe,easeInCubic:Oe,easeOutCubic:Be,easeInOutCubic:zt,easeInBounce:Me,bounceInEase:Ne,bounceInEaseHalf:Te,smoothStep3:Pe};function ae(t,n,i){let[o,l]=[t.start,n.start];return o=o*i/100,l=l*i/100,{start:o,stop:l}}function oe(t,n,i){for(let o=t-1;o>=0;o--)if(i(n[o]))return o}function ue(t,n,i,o,l){const[s,f]=[n[t],n[t+1]],[g,b]=[i[t],i[t+1]],$=ae(s,f,o),W={},X=[...new Set([...Object.keys(g),...Object.keys(b)])],D=(w,B,V)=>({start:i[B][w],stop:i[V][w]});X.forEach(w=>{if(w in g&&w in b)W[w]=D(w,t,t+1);else if(!(w in g)&&w in b){const B=oe(t,i,tt=>w in tt);if(B==null)return;const V=l[B];V.time=ae(n[B],f,o),V.interpVars[w]=D(w,B,t+1)}});let Y=s.transform;if(Y==null){const w=oe(t,l,B=>B.transform!=null);Y=l[w].transform}return{id:s.id,time:$,interpVars:W,transform:Y,timingFunction:s.timingFunction}}const fe={duration:1e3,delay:0,iterationCount:1,direction:"normal",fillMode:"forwards",timingFunction:zt};class ce{constructor(n,i=document.documentElement){k(this,"options");k(this,"templateFrames",[]);k(this,"transformedVars",[]);k(this,"frameId",0);k(this,"frames",[]);k(this,"startTime");k(this,"pausedTime",0);k(this,"prevTime",0);k(this,"t");k(this,"started",!1);k(this,"done",!1);k(this,"reversed",!1);k(this,"paused",!1);this.target=i,this.options={...fe,...n}}frame(n,i,o,l){const s={id:this.frameId,start:n,vars:i,transform:o,timingFunction:l??this.options.timingFunction};return this.templateFrames.push(s),this.frameId+=1,this}transformVars(){return this.transformedVars=this.templateFrames.map(n=>nn(n.vars)),this}parseFrames(){this.templateFrames.sort((n,i)=>n.start-i.start);for(let n=0;n<this.templateFrames.length-1;n++){const i=ue(n,this.templateFrames,this.transformedVars,this.options.duration,this.frames);this.frames.push(i)}return this}parse(){return this.transformVars().parseFrames(),this}reverse(){return this.reversed=!this.reversed,this}pause(){return this.paused=!this.paused,this}reset(){return this.startTime=void 0,this.pausedTime=0,this.prevTime=0,this.t=0,this.started=!1,this.done=!0,this.reversed=!1,this.paused=!1,this}fillForwards(){this.interpFrames(this.options.duration)}fillBackwards(){this.interpFrames(0)}interpFrames(n,i={}){n=this.reversed?this.options.duration-n:n;for(let o=0;o<this.frames.length;o++){const l=this.frames[o],{start:s,stop:f}=l.time;if(n<s||n>f)continue;const g=O(n,s,f,0,1),b=l.timingFunction(g);for(const[$,W]of Object.entries(l.interpVars)){const X=W.start.lerp(b,W.stop,this.target);rn($,X,i)}l.transform(n,i)}}async onStart(){(this.options.fillMode==="backwards"||this.options.fillMode==="both")&&this.fillBackwards(),this.options.delay>0&&await se(this.options.delay),this.started=!0,this.done=!1}onEnd(){this.options.fillMode==="forwards"||this.options.fillMode==="both"?this.fillForwards():(this.options.fillMode==="none"||this.options.fillMode==="backwards")&&this.fillBackwards(),this.done=!0,this.startTime=void 0,this.pausedTime=0,this.prevTime=0}async draw(n){this.startTime===void 0&&(await this.onStart(),this.startTime=n+this.options.delay),n=n-this.startTime;const i=n-this.prevTime;return this.prevTime=n,this.paused?(this.pausedTime+=i,requestAnimationFrame(this.draw.bind(this))):(this.startTime+=this.pausedTime,n-=this.pausedTime,this.pausedTime=0,this.t=n,n>=this.options.duration?this.onEnd():(this.interpFrames(n),requestAnimationFrame(this.draw.bind(this))))}async play(){(this.options.direction==="reverse"||this.options.direction==="alternate-reverse")&&this.reverse();for(let n=0;n<this.options.iterationCount;n++)n>0&&(this.options.direction==="alternate"||this.options.direction==="alternate-reverse")&&this.reverse(),requestAnimationFrame(this.draw.bind(this)),await se(this.options.duration),await sn(()=>this.done);this.started=!1}}class on{constructor(n={},...i){k(this,"options");k(this,"targets");k(this,"animation");this.options={...fe,...n},this.targets=i}initAnimation(){var n;return this.animation=new ce(this.options,(n=this.targets)==null?void 0:n[0]),this}fromFramesDefaultTransform(n){this.initAnimation();for(const[i,o]of Object.entries(n))this.animation.frame(ie(i),o,this.transform.bind(this));return this.animation.parse(),this}fromVars(n,i){this.initAnimation();for(let o=0;o<n.length;o++){const l=n[o],s=Math.round(o/(n.length-1)*100);this.animation.frame(s,l,i)}return this.animation.parse(),this}fromFrames(n){this.initAnimation();for(const[i,o]of Object.entries(n)){const[l,s,f]=o;this.animation.frame(ie(i),l,s,f)}return this.animation.parse(),this}fromCSSKeyframes(n){this.initAnimation();const i=en(n);for(const[o,l]of Object.entries(i))this.animation.frame(Number(o),l,this.transform.bind(this)),this.animation.transformedVars.push(l);return this.animation.parseFrames(),this}transform(n,i){for(const[o,l]of Object.entries(i)){if(typeof l=="object"){let s="";for(const[f,g]of Object.entries(l))s+=g.includes("(")?g:`${f}(${g}) `;i[o]=s}this.targets.forEach(s=>{s.style[o]=i[o]})}}async play(){return await this.animation.play()}pause(){return this.animation.pause(),this}}S.Animation=ce,S.CSSKeyframesAnimation=on,S.easingFunctions=an,S.parseTemplateFrame=ue,Object.defineProperty(S,Symbol.toStringTag,{value:"Module"})});
