(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["page-userManagement-registration"],{"0ed6":function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return void 0!==e.to?a("RouterLink",{attrs:{to:e.to}},[a("button",e._g(e._b({class:e.getClass(),attrs:{type:e.type,disabled:e.disabled}},"button",e.$attrs,!1),e.$listeners),[e._t("default")],2)]):a("button",e._g(e._b({class:e.getClass(),attrs:{type:e.type,disabled:e.disabled}},"button",e.$attrs,!1),e.$listeners),[e._t("default")],2)},s=[],i={props:{type:{type:String,default:"button"},disabled:{type:Boolean,default:!1},raised:{type:Boolean,default:!1},roundShape:{type:Boolean,default:!1},styling:{type:String,default:"secondary"},to:{type:[String,Object,void 0],default:void 0}},methods:{getClass:function(){return{btn:!0,submit_btn:"submit"===this.type,secondary_btn:"button"===this.type&&"secondary"===this.styling,primary_btn:"button"===this.type&&"primary"===this.styling,disabled:!0===this.disabled,raised:!0===this.raised,round:!0===this.roundShape}}}},n=i,o=(a("e63e"),a("2877")),u=Object(o["a"])(n,r,s,!1,null,"1639c912",null);t["a"]=u.exports},"24dc":function(e,t,a){},"3e2e":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("form",{attrs:{id:"loginForm"},on:{submit:function(t){return t.preventDefault(),e.validateBeforeSubmit(t)}}},[a("h2",[e._v("Registrierung")]),"superhero"===e.userRole?a("div",[a("h3",[e._v("Anbieter")]),a("ProviderDataInput",{model:{value:e.providerData,callback:function(t){e.providerData=t},expression:"providerData"}})],1):e._e(),a("h3",[e._v("Nutzer")]),a("UserDataInput",{model:{value:e.userData,callback:function(t){e.userData=t},expression:"userData"}}),a("div",{staticClass:"button_wrapper"},[a("BaseButton",{attrs:{type:"submit"}},[e._v(e._s(e.$lang.buttons.registrate))])],1)],1)},s=[],i=(a("7f7f"),a("cebc")),n=a("0ed6"),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("BaseInput",{attrs:{label:e.$lang.registration.username,name:"username",type:"text",placeholder:"Benutzername *",required:""},model:{value:e.userData.username,callback:function(t){e.$set(e.userData,"username",t)},expression:"userData.username"}}),a("BaseInput",{ref:"passwordInput",attrs:{type:e.pwInputType,label:e.$lang.registration.password,name:"password",placeholder:"Passwort *",required:""},model:{value:e.userData.password,callback:function(t){e.$set(e.userData,"password",t)},expression:"userData.password"}},[a("template",{slot:"icon"},[a("span",{staticClass:"visibility-icon-wrapper"},[e.pwVisible?a("BaseButton",{attrs:{"round-shape":!0,styling:"secondary"},on:{click:e.toggleVisibility}},[a("i",{staticClass:"material-icons"},[e._v("visibility")])]):a("BaseButton",{attrs:{"round-shape":!0,styling:"secondary"},on:{click:e.toggleVisibility}},[a("i",{staticClass:"material-icons"},[e._v("visibility_off")])])],1)])],2),a("BaseInput",{attrs:{label:e.$lang.registration.email,name:"email",type:"email",placeholder:"E-Mail-Adresse *",required:""},model:{value:e.userData.email,callback:function(t){e.$set(e.userData,"email",t)},expression:"userData.email"}}),a("BaseInput",{attrs:{label:e.$lang.registration.forename,name:"forename",type:"text",placeholder:"Vorname *",required:""},model:{value:e.userData.forename,callback:function(t){e.$set(e.userData,"forename",t)},expression:"userData.forename"}}),a("BaseInput",{attrs:{label:e.$lang.registration.familyname,name:"familyname",type:"text",placeholder:"Nachname *",required:""},model:{value:e.userData.familyname,callback:function(t){e.$set(e.userData,"familyname",t)},expression:"userData.familyname"}})],1)},u=[],l=a("b8dc"),d=a("2f62"),p={components:{BaseButton:n["a"],BaseInput:l["a"]},props:{value:{type:Object,required:!0}},data:function(){return{pwInputType:"password",pwVisible:!1}},computed:{userData:{get:function(){return this.value},set:function(e){this.$emit("input",e)}}},methods:{toggleVisibility:function(){this.pwVisible=!this.pwVisible,"password"===this.pwInputType?this.pwInputType="text":this.pwInputType="password"}}},c=p,m=(a("f57e"),a("2877")),f=Object(m["a"])(c,o,u,!1,null,"8d917762",null),b=f.exports,h=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("BaseInput",{attrs:{label:"Firmenname des Anbieters",name:"name",type:"text",placeholder:"Firmenname *",required:""},model:{value:e.providerData.name,callback:function(t){e.$set(e.providerData,"name",t)},expression:"providerData.name"}})],1)},v=[],y=(a("a8dc"),{components:{BaseInput:l["a"]},props:{value:{type:Object,required:!0}},computed:{providerData:{get:function(){return this.value},set:function(e){this.$emit("input",e)}}}}),g=y,D=Object(m["a"])(g,h,v,!1,null,null,null),_=D.exports,w={components:{BaseButton:n["a"],UserDataInput:b,ProviderDataInput:_},data:function(){return this.initialDataState()},computed:Object(i["a"])({},Object(d["c"])("user",{userInfo:"GET_USER"}),{userRole:function(){return(this.userInfo||{}).role||"superhero"}}),methods:Object(i["a"])({},Object(d["b"])("user",{submitProviderRegistration:"REGISTER_PROVIDER",submitUserRegistration:"REGISTER_USER"}),{validateBeforeSubmit:function(){""!=this.userData.email&&""!=this.userData.password&&""!=this.userData.forename&&""!=this.userData.familyname&&""!=this.userData.username&&("superhero"===this.userRole&&""!=this.providerData.name?this.registerProviderWithAdmin():"admin"===this.userRole&&this.registerUser())},registerUser:function(){var e=this;this.userData.providerId=this.userInfo.providerId,this.userData.role="user",this.submitUserRegistration(this.userData).then(function(t){e.$toasted.show("Registrated ".concat(e.userData.forename," ").concat(e.userData.familyname)),e.clearForm()},function(t){e.$toasted.error("Failed to registrate user"+t)})},registerProviderWithAdmin:function(){var e=this;return this.submitProviderRegistration(this.providerData).then(function(t){e.userData.providerId=t._id,e.userData.role="admin",e.submitUserRegistration(e.userData).then(function(t){e.$toasted.show("Registrated ".concat(e.userData.forename," ").concat(e.userData.familyname)),e.clearForm()},function(t){e.$toasted.error("Failed to registrate user"+t)})},function(t){e.$toasted.error("Failed to registrate provider"+t)})},clearForm:function(){Object.assign(this.$data,this.initialDataState())},initialDataState:function(){return{userData:{familyname:"",forename:"",email:"",username:"",password:"",providerId:""},providerData:{name:""}}}})},$=w,I=(a("8118"),Object(m["a"])($,r,s,!1,null,"0adfd7fb",null));t["default"]=I.exports},8118:function(e,t,a){"use strict";var r=a("b05b"),s=a.n(r);s.a},8727:function(e,t,a){"use strict";var r=a("ce75"),s=a.n(r);s.a},9127:function(e,t,a){},b05b:function(e,t,a){},b8dc:function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrapper"},[!e.hiddenLabel&&e.label?a("label",{class:{invalid:!!e.error},attrs:{for:e.name}},[e._v("\n\t\t"+e._s(e.label)+"\n\t")]):e._e(),a("input",e._b({staticClass:"input",attrs:{name:e.name,type:e.type,placeholder:e.placeholder,"aria-label":e.hiddenLabel?e.label:void 0},domProps:{value:e.value},on:{input:function(t){return e.$emit("input",t.target.value)}}},"input",e.$attrs,!1)),e._t("icon"),e.error?a("span",{staticClass:"invalid"},[e._v(e._s(e.error))]):e._e()],2)},s=[],i={props:{value:{type:String,default:""},type:{type:String,default:"text"},label:{type:String,required:!0},hiddenLabel:{type:Boolean},placeholder:{type:String,default:""},error:{type:String,default:""},name:{type:String,default:""}}},n=i,o=(a("8727"),a("2877")),u=Object(o["a"])(n,r,s,!1,null,"952f0abc",null);t["a"]=u.exports},ce75:function(e,t,a){},e63e:function(e,t,a){"use strict";var r=a("24dc"),s=a.n(r);s.a},f57e:function(e,t,a){"use strict";var r=a("9127"),s=a.n(r);s.a}}]);
//# sourceMappingURL=page-userManagement-registration.2d9552ba.js.map