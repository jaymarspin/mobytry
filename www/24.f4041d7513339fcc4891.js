(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{IVQU:function(t,e,o){"use strict";o.r(e),o.d(e,"NewLeadsPageModule",function(){return P});var n=o("ofXK"),r=o("3Pt+"),a=o("TEn/"),i=o("tyNb"),s=o("Kiwt"),c=o("quSY"),b=o("nQkn"),l=o("fXoL"),p=o("Cfvw"),m=o("cp0P"),u=o("LRne"),h=o("5+tZ"),d=o("vkgz"),g=o("v6Tj"),f=o("2cgm"),C=o("j1fY"),M=o("sYmb"),N=o("FpxV"),w=o("gE7l"),I=o("TLVE");let v=(()=>{class t{constructor(t,e,o,n){this.router=t,this.alertCtrl=e,this.translate=o,this.contactService=n,this.contact=null}ngOnInit(){}search(){this.form.get("name").value.trim()||this.form.get("mobile").value.trim()?(this.contact=new g.a,this.contact.Name=this.form.get("name").value,this.contact.MobileNo=this.form.get("mobile").value):this.contact=null}add(){const t=[];Object(p.a)(this.alertCtrl.create()).pipe(Object(h.b)(e=>Object(m.a)([this.translate.get("ContactComponent_NewContact").pipe(Object(d.a)(t=>{e.header=t})),this.translate.get("ContactComponent_NewContactMessage").pipe(Object(d.a)(t=>{e.message=t})),this.translate.get("ContactComponent_CreateNew").pipe(Object(d.a)(e=>{t.push({text:e,handler:()=>{this.addContact()}})})),this.translate.get("ContactComponent_Import").pipe(Object(d.a)(e=>{t.push({text:e,handler:()=>{this.importContact()}})}))]).pipe(Object(h.b)(t=>Object(u.a)(e))))).subscribe(e=>{e.buttons=t,e.present()})}addContact(){const t=new Object,e=new g.a;e.Name=this.form.get("name").value,e.MobileNo=this.form.get("mobile").value,t[f.a.STATE_CONTACT]=e,t[f.a.STATE_VALIDATORS]=["mobile","fullName","countryCode"],"oppId"===this.oppId?this.router.navigate([`${f.a.BASE}/${f.a.PARAM_ID}`],{state:t}):this.router.navigate([`${C.a.BASE}/${this.oppId}/false`]),this.form.reset({name:"",mobile:""})}importContact(){this.contactService.importContact().subscribe(t=>{this.form.get("name").setValue(t.Name),this.form.get("mobile").setValue(t.MobileNo)})}}return t.\u0275fac=function(e){return new(e||t)(l.Ib(i.g),l.Ib(a.b),l.Ib(M.d),l.Ib(N.a))},t.\u0275cmp=l.Cb({type:t,selectors:[["app-contact-search"]],inputs:{form:"form",messages:"messages",oppId:"oppId"},decls:26,vars:17,consts:[[3,"formGroup"],[1,"ion-no-padding","ht-100"],[1,"ion-padding","white"],["size","12"],[1,"ion-no-margin"],["lines","none"],["name","phone-portrait-outline","slot","start"],["formControlName","mobile","debounce","500","clearInput","true",3,"placeholder","ionChange"],[3,"control","messages"],["lines","none",1,"ion-margin-top"],["name","person","slot","start"],["formControlName","name","debounce","500","clearInput","true",3,"placeholder","ionChange"],[1,"ion-margin-top"],["color","primary","expand","block",3,"click"],[1,"ion-no-padding","ion-margin-top","white","flex"],[3,"searchParam","isKeyword","oppId"]],template:function(t,e){1&t&&(l.Lb(0,0),l.Nb(1,"ion-grid",1),l.Nb(2,"ion-row",2),l.Nb(3,"ion-col",3),l.Nb(4,"ion-row",4),l.Nb(5,"ion-col"),l.Nb(6,"ion-item",5),l.Jb(7,"ion-icon",6),l.Nb(8,"ion-input",7),l.Vb("ionChange",function(){return e.search()}),l.ac(9,"translate"),l.Mb(),l.Mb(),l.Jb(10,"app-item-err",8),l.Mb(),l.Mb(),l.Nb(11,"ion-row"),l.Nb(12,"ion-col"),l.Nb(13,"ion-item",9),l.Jb(14,"ion-icon",10),l.Nb(15,"ion-input",11),l.Vb("ionChange",function(){return e.search()}),l.ac(16,"translate"),l.Mb(),l.Mb(),l.Jb(17,"app-item-err",8),l.Mb(),l.Mb(),l.Nb(18,"ion-row",12),l.Nb(19,"ion-col"),l.Nb(20,"ion-button",13),l.Vb("click",function(){return e.add()}),l.xc(21),l.ac(22,"translate"),l.Mb(),l.Mb(),l.Mb(),l.Mb(),l.Mb(),l.Nb(23,"ion-row",14),l.Nb(24,"ion-col",3),l.Jb(25,"app-search-result",15),l.Mb(),l.Mb(),l.Mb(),l.Kb()),2&t&&(l.gc("formGroup",e.form),l.xb(8),l.hc("placeholder",l.bc(9,11,"ContactComponent_MobileNumber")),l.xb(2),l.gc("control",null==e.form.controls?null:e.form.controls.mobile)("messages",e.messages.mobile),l.xb(5),l.hc("placeholder",l.bc(16,13,"ContactComponent_ContactName")),l.xb(2),l.gc("control",null==e.form.controls?null:e.form.controls.name)("messages",e.messages.name),l.xb(4),l.zc(" ",l.bc(22,15,"ContactComponent_AddNew")," "),l.xb(4),l.gc("searchParam",e.contact)("isKeyword",!1)("oppId",e.oppId))},directives:[r.i,r.d,a.v,a.T,a.p,a.B,a.x,a.A,a.tb,r.h,r.c,w.a,a.h,I.a],pipes:[M.c],styles:["ion-item[_ngcontent-%COMP%]{--background:var(--ion-color-content-color);border-radius:10px}div[_ngcontent-%COMP%]{background:var(--ion-color-content-color)}.white[_ngcontent-%COMP%]{background:#fff}.ht-100[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column}.flex[_ngcontent-%COMP%]{flex-grow:1}.border-gap[_ngcontent-%COMP%]{height:15px;background-color:#e8eaed}"]}),t})();const x=[{path:":"+s.a.OPPID,component:(()=>{class t{constructor(t,e,o,n){this.formBuilder=t,this.validator=e,this.route=o,this.router=n,this.subs=new c.a,this.form=this.initContactForm()}ngOnInit(){this.subs.add(this.parseURL())}parseURL(){return this.route.paramMap.subscribe(t=>{console.log(t),this.oppId=t.get(s.a.OPPID)})}initContactForm(){let t=this.formBuilder.group({mobile:["",[r.l.required]],name:["",[r.l.required]]});return this.initErrorMessages(t),t=this.validator.setMobileValidator(t,this.formErrorMessages),t}initErrorMessages(t){if(this.formErrorMessages={group:{}},t)for(const e of Object.keys(t.controls))switch(e){case"mobile":case"name":this.formErrorMessages[e]={required:"Cannot be empty."}}}}return t.\u0275fac=function(e){return new(e||t)(l.Ib(r.a),l.Ib(b.c),l.Ib(i.a),l.Ib(i.g))},t.\u0275cmp=l.Cb({type:t,selectors:[["app-new-leads"]],decls:10,vars:9,consts:[["color","primary","mode","ios"],["slot","start"],["defaultHref","",3,"text"],[3,"form","messages","oppId"]],template:function(t,e){1&t&&(l.Nb(0,"ion-header"),l.Nb(1,"ion-toolbar",0),l.Nb(2,"ion-buttons",1),l.Jb(3,"ion-back-button",2),l.ac(4,"translate"),l.Mb(),l.Nb(5,"ion-title"),l.xc(6),l.ac(7,"translate"),l.Mb(),l.Mb(),l.Mb(),l.Nb(8,"ion-content"),l.Jb(9,"app-contact-search",3),l.Mb()),2&t&&(l.xb(3),l.hc("text",l.bc(4,5,"Common_Back")),l.xb(3),l.yc(l.bc(7,7,"NewLeadsPage_NewLeads")),l.xb(3),l.gc("form",e.form)("messages",e.formErrorMessages)("oppId",e.oppId))},directives:[a.w,a.ib,a.i,a.f,a.g,a.hb,a.q,v],pipes:[M.c],styles:["ion-content[_ngcontent-%COMP%]{--background:var(--ion-color-content-color)}"]}),t})()}];let O=(()=>{class t{}return t.\u0275mod=l.Gb({type:t}),t.\u0275inj=l.Fb({factory:function(e){return new(e||t)},imports:[[i.i.forChild(x)],i.i]}),t})();var k=o("klUD"),y=o("CJCG");let _=(()=>{class t{}return t.\u0275mod=l.Gb({type:t}),t.\u0275inj=l.Fb({factory:function(e){return new(e||t)},imports:[[n.c,a.kb,M.b,r.e,r.k,k.a,y.a]]}),t})(),P=(()=>{class t{}return t.\u0275mod=l.Gb({type:t}),t.\u0275inj=l.Fb({factory:function(e){return new(e||t)},imports:[[n.c,r.e,a.kb,r.k,M.b,_,O]]}),t})()}}]);
//# sourceMappingURL=24.f4041d7513339fcc4891.js.map