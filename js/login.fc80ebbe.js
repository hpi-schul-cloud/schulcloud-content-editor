(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{"02f4":function(t,e,n){var r=n("4588"),i=n("be13");t.exports=function(t){return function(e,n){var o,a,c=String(i(e)),u=r(n),s=c.length;return u<0||u>=s?t?"":void 0:(o=c.charCodeAt(u),o<55296||o>56319||u+1===s||(a=c.charCodeAt(u+1))<56320||a>57343?t?c.charAt(u):o:t?c.slice(u,u+2):a-56320+(o-55296<<10)+65536)}}},"0390":function(t,e,n){"use strict";var r=n("02f4")(!0);t.exports=function(t,e,n){return e+(n?r(t,e).length:1)}},"07e3":function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},"0a0d":function(t,e,n){t.exports=n("e829")},"0bfb":function(t,e,n){"use strict";var r=n("cb7c");t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},1830:function(t,e,n){"use strict";var r=n("8991"),i=n.n(r);i.a},1954:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("MdCard",{staticClass:"card-content",attrs:{id:"login-card"}},[n("MdCardHeader",[n("h2",{staticClass:"md-title"},[t._v("\n\t\t\t"+t._s(t.$lang.login.title)+"\n\t\t")])]),n("MdCardContent",[n("form",{attrs:{id:"loginForm"},on:{submit:function(e){return e.preventDefault(),t.validateBeforeSubmit(e)}}},[n("MdField",[n("label",[t._v(t._s(t.$lang.login.username))]),n("MdInput",{attrs:{name:"username",required:""},model:{value:t.login.username,callback:function(e){t.$set(t.login,"username",e)},expression:"login.username"}})],1),n("MdField",{attrs:{"md-has-password":""}},[n("label",[t._v(t._s(t.$lang.login.password))]),n("MdInput",{attrs:{name:"password",type:"password",required:""},model:{value:t.login.password,callback:function(e){t.$set(t.login,"password",e)},expression:"login.password"}})],1),n("a",{attrs:{href:this.$config.API.baseUrl+this.$config.API.pwRecoveryPath}},[t._v("\n\t\t\t\t"+t._s(t.$lang.login.forgot_password)+"?\n\t\t\t")])],1)]),n("MdCardActions",[n("MdButton",{staticClass:"md-primary",attrs:{type:"submit",form:"loginForm"}},[t._v("\n\t\t\t"+t._s(t.$lang.buttons.login)+"\n\t\t")])],1)],1)},i=[],o=n("f499"),a=n.n(o),c=(n("a481"),n("28a5"),n("0a0d")),u=n.n(c),s={name:"Login",data:function(){return{login:{username:"",password:""}}},created:function(){this.$cookies.get("jwt")&&(localStorage.setItem("jwt",this.$cookies.get("jwt")),this.$router.go())},methods:{validateBeforeSubmit:function(){if(""!=this.login.username&&""!=this.login.password)return this.getToken()},getToken:function(){var t=this;this.$http.post(this.$config.API.serverServerUrl+this.$config.API.authPath,this.login).then(function(e){var n=e.data.accessToken;localStorage.setItem("jwt",n),t.$cookies.set("jwt",n,new Date(u()()+2592e6)),t.getUserInfo(n)}).catch(function(t){alert("Login fehlgeschlagen!"),console.error(t)})},getUserInfo:function(t){var e=this,n=t.split(".")[1],r=n.replace("-","+").replace("_","/"),i=JSON.parse(window.atob(r));this.$http.get(this.$config.API.serverServerUrl+this.$config.API.userInfoPath+i.userId,{headers:{Authorization:"Bearer ".concat(t)}}).then(function(t){localStorage.setItem("userInfo",a()(t.data)),e.$router.go()}).catch(function(t){console.error(t)})}}},f=s,l=(n("7c55"),n("1830"),n("2877")),p=Object(l["a"])(f,r,i,!1,null,"516ccde2",null);e["default"]=p.exports},"1bc3":function(t,e,n){var r=n("f772");t.exports=function(t,e){if(!r(t))return t;var n,i;if(e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;if("function"==typeof(n=t.valueOf)&&!r(i=n.call(t)))return i;if(!e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},"1ec9":function(t,e,n){var r=n("f772"),i=n("e53d").document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},"214f":function(t,e,n){"use strict";n("b0c5");var r=n("2aba"),i=n("32e9"),o=n("79e5"),a=n("be13"),c=n("2b4c"),u=n("520a"),s=c("species"),f=!o(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),l=function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2===n.length&&"a"===n[0]&&"b"===n[1]}();t.exports=function(t,e,n){var p=c(t),d=!o(function(){var e={};return e[p]=function(){return 7},7!=""[t](e)}),v=d?!o(function(){var e=!1,n=/a/;return n.exec=function(){return e=!0,null},"split"===t&&(n.constructor={},n.constructor[s]=function(){return n}),n[p](""),!e}):void 0;if(!d||!v||"replace"===t&&!f||"split"===t&&!l){var g=/./[p],h=n(a,p,""[t],function(t,e,n,r,i){return e.exec===u?d&&!i?{done:!0,value:g.call(e,n,r)}:{done:!0,value:t.call(n,e,r)}:{done:!1}}),b=h[0],x=h[1];r(String.prototype,t,b),i(RegExp.prototype,p,2==e?function(t,e){return x.call(t,this,e)}:function(t){return x.call(t,this)})}}},"28a5":function(t,e,n){"use strict";var r=n("aae3"),i=n("cb7c"),o=n("ebd6"),a=n("0390"),c=n("9def"),u=n("5f1b"),s=n("520a"),f=n("79e5"),l=Math.min,p=[].push,d="split",v="length",g="lastIndex",h=4294967295,b=!f(function(){RegExp(h,"y")});n("214f")("split",2,function(t,e,n,f){var x;return x="c"=="abbc"[d](/(b)*/)[1]||4!="test"[d](/(?:)/,-1)[v]||2!="ab"[d](/(?:ab)*/)[v]||4!="."[d](/(.?)(.?)/)[v]||"."[d](/()()/)[v]>1||""[d](/.?/)[v]?function(t,e){var i=String(this);if(void 0===t&&0===e)return[];if(!r(t))return n.call(i,t,e);var o,a,c,u=[],f=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),l=0,d=void 0===e?h:e>>>0,b=new RegExp(t.source,f+"g");while(o=s.call(b,i)){if(a=b[g],a>l&&(u.push(i.slice(l,o.index)),o[v]>1&&o.index<i[v]&&p.apply(u,o.slice(1)),c=o[0][v],l=a,u[v]>=d))break;b[g]===o.index&&b[g]++}return l===i[v]?!c&&b.test("")||u.push(""):u.push(i.slice(l)),u[v]>d?u.slice(0,d):u}:"0"[d](void 0,0)[v]?function(t,e){return void 0===t&&0===e?[]:n.call(this,t,e)}:n,[function(n,r){var i=t(this),o=void 0==n?void 0:n[e];return void 0!==o?o.call(n,i,r):x.call(String(i),n,r)},function(t,e){var r=f(x,t,this,e,x!==n);if(r.done)return r.value;var s=i(t),p=String(this),d=o(s,RegExp),v=s.unicode,g=(s.ignoreCase?"i":"")+(s.multiline?"m":"")+(s.unicode?"u":"")+(b?"y":"g"),w=new d(b?s:"^(?:"+s.source+")",g),y=void 0===e?h:e>>>0;if(0===y)return[];if(0===p.length)return null===u(w,p)?[p]:[];var m=0,S=0,$=[];while(S<p.length){w.lastIndex=b?S:0;var I,_=u(w,b?p:p.slice(S));if(null===_||(I=l(c(w.lastIndex+(b?0:S)),p.length))===m)S=a(p,S,v);else{if($.push(p.slice(m,S)),$.length===y)return $;for(var E=1;E<=_.length-1;E++)if($.push(_[E]),$.length===y)return $;S=m=I}}return $.push(p.slice(m)),$}]})},"294c":function(t,e){t.exports=function(t){try{return!!t()}catch(e){return!0}}},"2f37":function(t,e,n){var r=n("63b6");r(r.S,"Date",{now:function(){return(new Date).getTime()}})},"35e8":function(t,e,n){var r=n("d9f6"),i=n("aebd");t.exports=n("8e60")?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},"520a":function(t,e,n){"use strict";var r=n("0bfb"),i=RegExp.prototype.exec,o=String.prototype.replace,a=i,c="lastIndex",u=function(){var t=/a/,e=/b*/g;return i.call(t,"a"),i.call(e,"a"),0!==t[c]||0!==e[c]}(),s=void 0!==/()??/.exec("")[1],f=u||s;f&&(a=function(t){var e,n,a,f,l=this;return s&&(n=new RegExp("^"+l.source+"$(?!\\s)",r.call(l))),u&&(e=l[c]),a=i.call(l,t),u&&a&&(l[c]=l.global?a.index+a[0].length:e),s&&a&&a.length>1&&o.call(a[0],n,function(){for(f=1;f<arguments.length-2;f++)void 0===arguments[f]&&(a[f]=void 0)}),a}),t.exports=a},"584a":function(t,e){var n=t.exports={version:"2.6.2"};"number"==typeof __e&&(__e=n)},"5f1b":function(t,e,n){"use strict";var r=n("23c6"),i=RegExp.prototype.exec;t.exports=function(t,e){var n=t.exec;if("function"===typeof n){var o=n.call(t,e);if("object"!==typeof o)throw new TypeError("RegExp exec method returned something other than an Object or null");return o}if("RegExp"!==r(t))throw new TypeError("RegExp#exec called on incompatible receiver");return i.call(t,e)}},"63b6":function(t,e,n){var r=n("e53d"),i=n("584a"),o=n("d864"),a=n("35e8"),c=n("07e3"),u="prototype",s=function(t,e,n){var f,l,p,d=t&s.F,v=t&s.G,g=t&s.S,h=t&s.P,b=t&s.B,x=t&s.W,w=v?i:i[e]||(i[e]={}),y=w[u],m=v?r:g?r[e]:(r[e]||{})[u];for(f in v&&(n=e),n)l=!d&&m&&void 0!==m[f],l&&c(w,f)||(p=l?m[f]:n[f],w[f]=v&&"function"!=typeof m[f]?n[f]:b&&l?o(p,r):x&&m[f]==p?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e[u]=t[u],e}(p):h&&"function"==typeof p?o(Function.call,p):p,h&&((w.virtual||(w.virtual={}))[f]=p,t&s.R&&y&&!y[f]&&a(y,f,p)))};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s},"794b":function(t,e,n){t.exports=!n("8e60")&&!n("294c")(function(){return 7!=Object.defineProperty(n("1ec9")("div"),"a",{get:function(){return 7}}).a})},"79aa":function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},"7c55":function(t,e,n){"use strict";var r=n("b17e"),i=n.n(r);i.a},8991:function(t,e,n){},"8e60":function(t,e,n){t.exports=!n("294c")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},a21f:function(t,e,n){var r=n("584a"),i=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return i.stringify.apply(i,arguments)}},a481:function(t,e,n){"use strict";var r=n("cb7c"),i=n("4bf8"),o=n("9def"),a=n("4588"),c=n("0390"),u=n("5f1b"),s=Math.max,f=Math.min,l=Math.floor,p=/\$([$&`']|\d\d?|<[^>]*>)/g,d=/\$([$&`']|\d\d?)/g,v=function(t){return void 0===t?t:String(t)};n("214f")("replace",2,function(t,e,n,g){return[function(r,i){var o=t(this),a=void 0==r?void 0:r[e];return void 0!==a?a.call(r,o,i):n.call(String(o),r,i)},function(t,e){var i=g(n,t,this,e);if(i.done)return i.value;var l=r(t),p=String(this),d="function"===typeof e;d||(e=String(e));var b=l.global;if(b){var x=l.unicode;l.lastIndex=0}var w=[];while(1){var y=u(l,p);if(null===y)break;if(w.push(y),!b)break;var m=String(y[0]);""===m&&(l.lastIndex=c(p,o(l.lastIndex),x))}for(var S="",$=0,I=0;I<w.length;I++){y=w[I];for(var _=String(y[0]),E=s(f(a(y.index),p.length),0),M=[],k=1;k<y.length;k++)M.push(v(y[k]));var P=y.groups;if(d){var j=[_].concat(M,E,p);void 0!==P&&j.push(P);var A=String(e.apply(void 0,j))}else A=h(_,p,E,M,P,e);E>=$&&(S+=p.slice($,E)+A,$=E+_.length)}return S+p.slice($)}];function h(t,e,r,o,a,c){var u=r+t.length,s=o.length,f=d;return void 0!==a&&(a=i(a),f=p),n.call(c,f,function(n,i){var c;switch(i.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,r);case"'":return e.slice(u);case"<":c=a[i.slice(1,-1)];break;default:var f=+i;if(0===f)return n;if(f>s){var p=l(f/10);return 0===p?n:p<=s?void 0===o[p-1]?i.charAt(1):o[p-1]+i.charAt(1):n}c=o[f-1]}return void 0===c?"":c})}})},aae3:function(t,e,n){var r=n("d3f4"),i=n("2d95"),o=n("2b4c")("match");t.exports=function(t){var e;return r(t)&&(void 0!==(e=t[o])?!!e:"RegExp"==i(t))}},aebd:function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},b0c5:function(t,e,n){"use strict";var r=n("520a");n("5ca1")({target:"RegExp",proto:!0,forced:r!==/./.exec},{exec:r})},b17e:function(t,e,n){},d864:function(t,e,n){var r=n("79aa");t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,i){return t.call(e,n,r,i)}}return function(){return t.apply(e,arguments)}}},d9f6:function(t,e,n){var r=n("e4ae"),i=n("794b"),o=n("1bc3"),a=Object.defineProperty;e.f=n("8e60")?Object.defineProperty:function(t,e,n){if(r(t),e=o(e,!0),r(n),i)try{return a(t,e,n)}catch(c){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},e4ae:function(t,e,n){var r=n("f772");t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},e53d:function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},e829:function(t,e,n){n("2f37"),t.exports=n("584a").Date.now},f499:function(t,e,n){t.exports=n("a21f")},f772:function(t,e){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}}}]);
//# sourceMappingURL=login.fc80ebbe.js.map