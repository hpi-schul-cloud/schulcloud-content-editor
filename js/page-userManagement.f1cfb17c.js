(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["page-userManagement","chunk-445380a0"],{"07b0":function(t,e,n){},"0d51":function(t,e,n){},"0ed6":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return void 0!==t.to?n("RouterLink",{attrs:{to:t.to}},[n("button",t._g(t._b({class:t.getClass(),attrs:{type:t.type,disabled:t.disabled}},"button",t.$attrs,!1),t.$listeners),[t._t("default")],2)]):n("button",t._g(t._b({class:t.getClass(),attrs:{type:t.type,disabled:t.disabled}},"button",t.$attrs,!1),t.$listeners),[t._t("default")],2)},r=[],a={props:{type:{type:String,default:"button"},disabled:{type:Boolean,default:!1},raised:{type:Boolean,default:!1},roundShape:{type:Boolean,default:!1},styling:{type:String,default:"secondary"},to:{type:[String,Object,void 0],default:void 0}},methods:{getClass:function(){return{btn:!0,submit_btn:"submit"===this.type,secondary_btn:"button"===this.type&&"secondary"===this.styling,primary_btn:"button"===this.type&&"primary"===this.styling,disabled:!0===this.disabled,raised:!0===this.raised,round:!0===this.roundShape}}}},o=a,s=(n("e63e"),n("2877")),c=Object(s["a"])(o,i,r,!1,null,"1639c912",null);e["a"]=c.exports},"11e9":function(t,e,n){var i=n("52a7"),r=n("4630"),a=n("6821"),o=n("6a99"),s=n("69a8"),c=n("c69a"),u=Object.getOwnPropertyDescriptor;e.f=n("9e1e")?u:function(t,e){if(t=a(t),e=o(e,!0),c)try{return u(t,e)}catch(n){}if(s(t,e))return r(!i.f.call(t,e),t[e])}},2011:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("input",t._b({attrs:{"aria-label":t.label},domProps:{value:t.value},on:{input:function(e){return t.$emit("input",e.target.value)}}},"input",t.$attrs,!1))},r=[],a={props:{value:{type:String,default:""},type:{type:String,required:!0},label:{type:String,required:!0}}},o=a,s=(n("365f"),n("2877")),c=Object(s["a"])(o,i,r,!1,null,"8e38615c",null);e["a"]=c.exports},"24dc":function(t,e,n){},"365f":function(t,e,n){"use strict";var i=n("d7de"),r=n.n(i);r.a},5118:function(t,e,n){(function(t){var i="undefined"!==typeof t&&t||"undefined"!==typeof self&&self||window,r=Function.prototype.apply;function a(t,e){this._id=t,this._clearFn=e}e.setTimeout=function(){return new a(r.call(setTimeout,i,arguments),clearTimeout)},e.setInterval=function(){return new a(r.call(setInterval,i,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},a.prototype.unref=a.prototype.ref=function(){},a.prototype.close=function(){this._clearFn.call(i,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},n("6017"),e.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof t&&t.clearImmediate||this&&this.clearImmediate}).call(this,n("c8ba"))},"5dbc":function(t,e,n){var i=n("d3f4"),r=n("8b97").set;t.exports=function(t,e,n){var a,o=e.constructor;return o!==n&&"function"==typeof o&&(a=o.prototype)!==n.prototype&&i(a)&&r&&r(t,a),t}},6017:function(t,e,n){(function(t,e){(function(t,n){"use strict";if(!t.setImmediate){var i,r=1,a={},o=!1,s=t.document,c=Object.getPrototypeOf&&Object.getPrototypeOf(t);c=c&&c.setTimeout?c:t,"[object process]"==={}.toString.call(t.process)?p():m()?h():t.MessageChannel?v():s&&"onreadystatechange"in s.createElement("script")?y():b(),c.setImmediate=u,c.clearImmediate=l}function u(t){"function"!==typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var o={callback:t,args:e};return a[r]=o,i(r),r++}function l(t){delete a[t]}function f(t){var e=t.callback,i=t.args;switch(i.length){case 0:e();break;case 1:e(i[0]);break;case 2:e(i[0],i[1]);break;case 3:e(i[0],i[1],i[2]);break;default:e.apply(n,i);break}}function d(t){if(o)setTimeout(d,0,t);else{var e=a[t];if(e){o=!0;try{f(e)}finally{l(t),o=!1}}}}function p(){i=function(t){e.nextTick(function(){d(t)})}}function m(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=n,e}}function h(){var e="setImmediate$"+Math.random()+"$",n=function(n){n.source===t&&"string"===typeof n.data&&0===n.data.indexOf(e)&&d(+n.data.slice(e.length))};t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("onmessage",n),i=function(n){t.postMessage(e+n,"*")}}function v(){var t=new MessageChannel;t.port1.onmessage=function(t){var e=t.data;d(e)},i=function(e){t.port2.postMessage(e)}}function y(){var t=s.documentElement;i=function(e){var n=s.createElement("script");n.onreadystatechange=function(){d(e),n.onreadystatechange=null,t.removeChild(n),n=null},t.appendChild(n)}}function b(){i=function(t){setTimeout(d,0,t)}}})("undefined"===typeof self?"undefined"===typeof t?this:t:self)}).call(this,n("c8ba"),n("f28c"))},"689e":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h2",[t._v("Verwaltung")]),n("table",[t._m(0),n("tbody",t._l(t.tmpUsers,function(e,i){return n("TableRow",{key:e._id,attrs:{resource:e,rowName:i+1,visibleColoumns:t.TableMapping.map(function(t){return t.key}),keyInputMapping:t.TableMapping,actionConfig:{submit:!0,delete:!0}},on:{submit:t.submitUser,delete:t.deleteUser}})}),1)])])},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("thead",[n("tr",[n("th"),n("th",[t._v("Benutzername")]),n("th",[t._v("Vorname")]),n("th",[t._v("Nachname")]),n("th",[t._v("Email")])])])}],a=n("cebc"),o=n("2f62"),s=n("e79f"),c=n("2011"),u={components:{TableRow:s["a"]},data:function(){return{TableMapping:[{key:"username",component:c["a"],attributes:{type:"text"},wrapperAttributes:{},type:String},{key:"forename",component:c["a"],attributes:{type:"text"},wrapperAttributes:{},type:String},{key:"familyname",component:c["a"],attributes:{type:"text"},wrapperAttributes:{},type:String},{key:"email",component:c["a"],attributes:{type:"email"},wrapperAttributes:{},type:String}],tmpUsers:[]}},computed:Object(a["a"])({},Object(o["c"])("user",{users:"GET_USERS"})),watch:{users:function(t){this.tmpUsers=JSON.parse(JSON.stringify(t))}},created:function(){var t={path:this.$route.path,actions:[{icon:"add",text:"Registrieren",event:"navigate",payload:{name:"userManagement/registration"}}]};this.registerFab(t),this.fetchUsers()},methods:Object(a["a"])({},Object(o["d"])("ui",{registerFab:"REGISTER_FAB"}),Object(o["b"])("user",{fetchUsers:"FETCH_USERS",patchUser:"PATCH_USER",removeUser:"REMOVE_USER"}),{submitUser:function(t){var e=this;this.patchUser(t).then(function(t){e.$toasted.show("Changed")},function(t){e.$toasted.error("Failed to change user"+t)})},deleteUser:function(t){var e=this;this.removeUser(t).then(function(t){e.$toasted.show("Deleted")},function(t){e.$toasted.error("Failed to delete user"+t)})}})},l=u,f=(n("cf68"),n("2877")),d=Object(f["a"])(l,i,r,!1,null,"e15982d4",null);e["default"]=d.exports},7885:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("portal",{attrs:{to:"app"}},[n("transition",{attrs:{name:"fade"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.active,expression:"active"}],staticClass:"dialog-container",attrs:{role:"dialog"}},[n("div",{staticClass:"title"},[t._t("title",[t._v(t._s(t.title))])],2),n("div",{staticClass:"content"},[t._t("default",[t._v(t._s(t.content))])],2),t.cancelText||t.confirmText?n("div",{staticClass:"action"},[t.cancelText?n("BaseButton",{attrs:{styling:"secondary"},on:{click:t.handleCancel}},[t._v("\n\t\t\t\t\t"+t._s(t.cancelText)+"\n\t\t\t\t")]):t._e(),t.confirmText?n("BaseButton",{ref:"confirm",attrs:{styling:"primary"},on:{click:t.handleConfirm}},[t._v("\n\t\t\t\t\t"+t._s(t.confirmText)+"\n\t\t\t\t")]):t._e()],1):t._e()])]),n("transition",{attrs:{name:"fade"}},[t.active?n("div",{staticClass:"overlay",on:{click:t.handleCancel}}):t._e()])],1)},r=[],a=n("0ed6"),o=n("5118"),s={components:{BaseButton:a["a"]},props:{active:{type:Boolean,default:!1},title:{type:String,default:""},content:{type:String,default:""},confirmText:{type:String,default:""},cancelText:{type:String,default:""}},watch:{active:function(t){var e=this;t&&Object(o["setTimeout"])(function(){e.$refs.confirm.$el.focus()},300)}},methods:{handleConfirm:function(t){this.$emit("update:active",!1),this.$emit("confirm")},handleCancel:function(t){this.$emit("update:active",!1),this.$emit("cancel")}}},c=s,u=(n("f5df"),n("2877")),l=Object(u["a"])(c,i,r,!1,null,"752f793c",null);e["default"]=l.exports},8855:function(t,e,n){"use strict";var i=n("0d51"),r=n.n(i);r.a},"8b97":function(t,e,n){var i=n("d3f4"),r=n("cb7c"),a=function(t,e){if(r(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n("9b43")(Function.call,n("11e9").f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array)}catch(r){e=!0}return function(t,n){return a(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:a}},9093:function(t,e,n){var i=n("ce10"),r=n("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)}},"9e38":function(t,e,n){},aa77:function(t,e,n){var i=n("5ca1"),r=n("be13"),a=n("79e5"),o=n("fdef"),s="["+o+"]",c="​",u=RegExp("^"+s+s+"*"),l=RegExp(s+s+"*$"),f=function(t,e,n){var r={},s=a(function(){return!!o[t]()||c[t]()!=c}),u=r[t]=s?e(d):o[t];n&&(r[n]=u),i(i.P+i.F*s,"String",r)},d=f.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(u,"")),2&e&&(t=t.replace(l,"")),t};t.exports=f},c5f6:function(t,e,n){"use strict";var i=n("7726"),r=n("69a8"),a=n("2d95"),o=n("5dbc"),s=n("6a99"),c=n("79e5"),u=n("9093").f,l=n("11e9").f,f=n("86cc").f,d=n("aa77").trim,p="Number",m=i[p],h=m,v=m.prototype,y=a(n("2aeb")(v))==p,b="trim"in String.prototype,g=function(t){var e=s(t,!1);if("string"==typeof e&&e.length>2){e=b?e.trim():d(e,3);var n,i,r,a=e.charCodeAt(0);if(43===a||45===a){if(n=e.charCodeAt(2),88===n||120===n)return NaN}else if(48===a){switch(e.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return+e}for(var o,c=e.slice(2),u=0,l=c.length;u<l;u++)if(o=c.charCodeAt(u),o<48||o>r)return NaN;return parseInt(c,i)}}return+e};if(!m(" 0o1")||!m("0b1")||m("+0x1")){m=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof m&&(y?c(function(){v.valueOf.call(n)}):a(n)!=p)?o(new h(g(e)),n,m):g(e)};for(var _,T=n("9e1e")?u(h):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),w=0;T.length>w;w++)r(h,_=T[w])&&!r(m,_)&&f(m,_,l(h,_));m.prototype=v,v.constructor=m,n("2aba")(i,p,m)}},cf68:function(t,e,n){"use strict";var i=n("07b0"),r=n.n(i);r.a},d7de:function(t,e,n){},e63e:function(t,e,n){"use strict";var i=n("24dc"),r=n.n(i);r.a},e79f:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("tr",[n("td",{staticStyle:{"text-align":"right"}},[t._v(t._s(t.rowName))]),t._l(t.visibleColoumns,function(e,i){return n("td",t._b({key:e},"td",t.getComponent(e).wrapperAttributes,!1),[0===i?n("form",{attrs:{id:t.formId},on:{submit:function(e){return e.preventDefault(),t.handleFormSubmit(t.resource)}}}):t._e(),n(t.getComponent(e).component,t._b({tag:"component",attrs:{form:t.formId,label:e,name:e},model:{value:t.resource[e],callback:function(n){t.$set(t.resource,e,n)},expression:"resource[coloumn]"}},"component",t.getComponent(e).attributes,!1))],1)}),n("td",{staticStyle:{"text-align":"right"}},[t.actionConfig.submit?n("BaseButton",{staticClass:"action",attrs:{form:t.formId,type:"submit",title:"Änderungen speichern"}},[n("i",{staticClass:"material-icons"},[t._v("\n\t\t\t\tcheck\n\t\t\t")])]):t._e(),t.resource._id&&t.actionConfig.edit?n("RouterLink",{staticClass:"action",attrs:{to:{name:"resourceManagement/edit",params:{id:t.resource._id}},title:"Eintrag in Detailansicht bearbeiten"}},[n("i",{staticClass:"material-icons"},[t._v("\n\t\t\t\tedit\n\t\t\t")])]):t._e(),t.actionConfig.delete?n("BaseButton",{staticClass:"action",attrs:{title:"Eintrag löschen"},on:{click:function(e){t.isModalActive=!0}}},[n("i",{staticClass:"material-icons"},[t._v("\n\t\t\t\tdelete\n\t\t\t")])]):t._e(),t.isModalActive?[n("BaseConfirm",{attrs:{active:t.isModalActive,content:"Soll der Eintrag "+t.rowName+" wirklich gelöscht werden",title:"Eintrag löschen?","confirm-text":"Ja","cancel-text":"Nein"},on:{"update:active":function(e){t.isModalActive=e},confirm:function(e){return t.handleDelete()},cancle:function(e){t.isModalActive=!1}}})]:t._e()],2)],2)},r=[],a=(n("7514"),n("c5f6"),n("0ed6")),o=n("7885"),s={components:{BaseButton:a["a"],BaseConfirm:o["default"]},props:{resource:{type:Object,required:!0},rowName:{type:[Number,String],default:0},visibleColoumns:{type:Array,default:function(){return[]}},keyInputMapping:{type:Array,required:!0},actionConfig:{type:Object,default:function(){return{submit:!0,edit:!0,delete:!0}}}},data:function(){return{isModalActive:!1}},computed:{formId:function(){return"table-form-".concat(this.rowName)}},methods:{getComponent:function(t){return this.keyInputMapping.find(function(e){return e.key===t})},handleFormSubmit:function(t){this.$emit("submit",t),this.isModalActive=!1},handleDelete:function(){this.$emit("delete",this.resource),this.isModalActive=!1}}},c=s,u=(n("8855"),n("2877")),l=Object(u["a"])(c,i,r,!1,null,"0c6f036d",null);e["a"]=l.exports},f28c:function(t,e){var n,i,r=t.exports={};function a(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function s(t){if(n===setTimeout)return setTimeout(t,0);if((n===a||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}function c(t){if(i===clearTimeout)return clearTimeout(t);if((i===o||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{return i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(function(){try{n="function"===typeof setTimeout?setTimeout:a}catch(t){n=a}try{i="function"===typeof clearTimeout?clearTimeout:o}catch(t){i=o}})();var u,l=[],f=!1,d=-1;function p(){f&&u&&(f=!1,u.length?l=u.concat(l):d=-1,l.length&&m())}function m(){if(!f){var t=s(p);f=!0;var e=l.length;while(e){u=l,l=[];while(++d<e)u&&u[d].run();d=-1,e=l.length}u=null,f=!1,c(t)}}function h(t,e){this.fun=t,this.array=e}function v(){}r.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];l.push(new h(t,e)),1!==l.length||f||s(m)},h.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=v,r.addListener=v,r.once=v,r.off=v,r.removeListener=v,r.removeAllListeners=v,r.emit=v,r.prependListener=v,r.prependOnceListener=v,r.listeners=function(t){return[]},r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(t){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},f5df:function(t,e,n){"use strict";var i=n("9e38"),r=n.n(i);r.a},fdef:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);
//# sourceMappingURL=page-userManagement.f1cfb17c.js.map