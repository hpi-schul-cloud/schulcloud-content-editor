(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["contentCard"],{"0658":function(t,a,e){},"0ed6":function(t,a,e){"use strict";var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("button",{class:t.getClass(),attrs:{type:t.type,disabled:t.disabled},on:{click:function(a){return t.$emit("ButtonClicked")}}},[t._t("default")],2)},i=[],s={name:"BaseButton",props:{type:{type:String,default:"button"},secondary:{type:Boolean,dafault:!0},primary:{type:Boolean,dafault:!1},disabled:{type:Boolean,default:!1},raised:{type:Boolean,default:!1},roundShape:{type:Boolean,default:!1}},methods:{getClass:function(){return{btn:!0,submit_btn:"submit"===this.type,secondary_btn:"button"===this.type&&!0===this.secondary,primary_btn:"button"===this.type&&!0===this.primary,disabled:!0===this.disabled,raised:!0===this.raised,round:!0===this.round_shape}}}},o=s,r=(e("1854"),e("2877")),d=Object(r["a"])(o,n,i,!1,null,"261b4bfc",null);a["a"]=d.exports},1854:function(t,a,e){"use strict";var n=e("0658"),i=e.n(n);i.a},"8e4e":function(t,a,e){"use strict";var n=e("d9a8"),i=e.n(n);i.a},"915b":function(t,a,e){},"98fa":function(t,a,e){"use strict";var n=e("915b"),i=e.n(n);i.a},d9a8:function(t,a,e){},dd27:function(t,a,e){t.exports=e.p+"img/icon-label.5c6410e7.svg"},df2d:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("article",[n("BaseCard",{attrs:{"with-media":!0}},[n("template",{slot:"media"},[n("img",{attrs:{src:t.data.thumbnail||"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",alt:"Thumbnail for ~"+t.data.title+"~"}})]),n("template",{slot:"head"},[n("h2",{staticClass:"title"},[t._v(t._s(t.data.title||"Titel"))]),n("div",{staticClass:"tags"},[n("img",{staticClass:"icon",attrs:{src:e("dd27")}}),t._l((t.data.tags||[]).slice(0,this.$config.card.displayedTags),function(a,e){return n("span",{key:e+"-"+a},[t._v("\n\t\t\t\t\t"+t._s(a)+",\n\t\t\t\t")])})],2)]),n("template",{slot:"content"},[t._v("\n\t\t\t"+t._s((t.data.description||"Beschreibung...").substring(0,300))+"\n\t\t\t"+t._s((t.data.description||"").length>300?"...":"")+"\n\t\t")]),n("template",{slot:"footer"},[n("div",{staticClass:"button_wrapper"},[n("div",{staticClass:"provider-name"},[t._v(t._s(t.data.providerName))]),n("div",[t.data._id?n("BaseButton",{attrs:{secondary:!0},on:{ButtonClicked:function(a){t.dialog.active=!0}}},[t._v(t._s(t.$lang.buttons.open)+"\n\t\t\t\t\t")]):t._e(),1!=t.readOnly?n("RouterLink",{attrs:{to:{path:"/edit/"+t.data._id}}},[n("BaseButton",{attrs:{secondary:!0}},[t._v(t._s(t.$lang.buttons.edit))])],1):t._e()],1)])])],2),n("ConfirmDialog",{attrs:{config:t.dialog},on:{confirm:t.onConfirm}})],1)},i=[],s=e("e2d2"),o=e("0ed6"),r=function(){return e.e("ConfirmDialog").then(e.bind(null,"9135"))},d={name:"ContentForm",components:{ConfirmDialog:r,BaseCard:s["a"],BaseButton:o["a"]},props:{data:{type:Object,required:!0},readOnly:{type:Boolean,default:!1}},data:function(){return{dialog:{active:!1,title:this.$lang.contentCard.dialog.title,content:this.$lang.contentCard.dialog.content,confirm:this.$lang.contentCard.dialog.confirm,cancle:this.$lang.contentCard.dialog.cancle}}},methods:{onConfirm:function(){window.open(this.$config.API.serverServerUrl+this.$config.API.viewContentPath+this.data._id,"_blank")}}},l=d,c=(e("98fa"),e("2877")),u=Object(c["a"])(l,n,i,!1,null,"e8432420",null);a["default"]=u.exports},e2d2:function(t,a,e){"use strict";var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"card"},[!0===t.withMedia?e("div",{staticClass:"media"},[t._t("media")],2):t._e(),e("div",{staticClass:"header"},[t._t("head")],2),e("div",{staticClass:"content"},[t._t("content")],2),e("div",{staticClass:"footer"},[t._t("footer")],2)])},i=[],s={name:"BaseCard",props:{withMedia:{type:Boolean,default:!1}}},o=s,r=(e("8e4e"),e("2877")),d=Object(r["a"])(o,n,i,!1,null,"92fed4be",null);a["a"]=d.exports}}]);
//# sourceMappingURL=contentCard.f8ce85ae.js.map