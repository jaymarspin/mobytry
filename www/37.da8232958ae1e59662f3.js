(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{MzSi:function(e,r,t){"use strict";t.r(r),t.d(r,"TradeinProfilePageModule",function(){return T});var o=t("ofXK"),a=t("3Pt+"),s=t("TEn/"),n=t("tyNb"),i=t("quSY"),l=t("Cfvw"),c=t("cp0P"),m=t("25G8"),d=t("AytR"),b=t("5+tZ"),h=t("vkgz"),p=t("Z/zd"),u=t("+q+r"),g=t("wdbY"),f=t("rrCD"),C=t("vscJ"),M=t("fXoL"),N=t("sYmb"),I=t("iQyQ"),v=t("nC5Y"),x=t("gE7l");let y=(()=>{class e{constructor(e){this.translate=e,this.tdChange=new M.o}ngOnInit(){this.addToForm()}ngOnChanges(e){}emit(){this.tradein.Chassis=this.form.get("chassis").value,this.tradein.RegDate=this.form.get("regDate").value,this.tradein.YearMake=this.form.get("yearMake").value,this.tradein.Make=this.form.get("make").value,this.tradein.Model=this.form.get("model").value,this.tradein.Variant=this.form.get("variant").value,this.tradein.Color=this.form.get("color").value,this.tradein.TradeInSource=this.form.get("tradeInSource").value,this.tradein.ExpectedPrice=this.form.get("expectedPrice").value,this.tradein.Overtrade=this.form.get("overtrade").value,this.tradein.Warranty=this.form.get("warranty").value,this.tdChange.emit(this.tradein)}addToForm(){this.form&&(this.form.addControl("chassis",new a.b("",[a.l.required])),this.form.addControl("regDate",new a.b("",[a.l.required])),this.form.addControl("yearMake",new a.b("")),this.form.addControl("make",new a.b("",[a.l.required])),this.form.addControl("model",new a.b("",[a.l.required])),this.form.addControl("variant",new a.b("")),this.form.addControl("color",new a.b("")),this.form.addControl("tradeInSource",new a.b("",[a.l.required])),this.form.addControl("expectedPrice",new a.b("")),this.form.addControl("overtrade",new a.b("")),this.form.addControl("warranty",new a.b("")),this.updateFormMsg())}updateFormMsg(){this.translate.get("Error_CannotBeEmpty").subscribe(e=>{this.messages.chassis={required:e},this.messages.make={required:e},this.messages.model={required:e},this.messages.tradeInSource={required:e}})}}return e.\u0275fac=function(r){return new(r||e)(M.Ib(N.d))},e.\u0275cmp=M.Cb({type:e,selectors:[["app-tradein-form-my"]],inputs:{form:"form",messages:"messages",tradein:"tradein"},outputs:{tdChange:"tdChange"},features:[M.vb],decls:45,vars:56,consts:[[3,"formGroup"],["formControlName","chassis",3,"placeholder"],[3,"control","messages"],["displayFormat","MM/DD/YYYY","formControlName","regDate",3,"placeholder"],["displayFormat","YYYY","formControlName","yearMake",3,"placeholder"],["formControlName","make",3,"placeholder"],["formControlName","model",3,"placeholder"],["formControlName","variant",3,"placeholder"],["formControlName","color",3,"placeholder"],["formControlName","tradeInSource",3,"placeholder"],["formControlName","expectedPrice",3,"placeholder"],["formControlName","overtrade",3,"placeholder"],["displayFormat","YYYY","formControlName","warranty",3,"placeholder"]],template:function(e,r){1&e&&(M.Nb(0,"form",0),M.Nb(1,"ion-item"),M.Jb(2,"ion-input",1),M.ac(3,"translate"),M.Mb(),M.Jb(4,"app-item-err",2),M.Nb(5,"ion-item"),M.Jb(6,"ion-datetime",3),M.ac(7,"translate"),M.Mb(),M.Jb(8,"app-item-err",2),M.Nb(9,"ion-item"),M.Jb(10,"ion-datetime",4),M.ac(11,"translate"),M.Mb(),M.Jb(12,"app-item-err",2),M.Nb(13,"ion-item"),M.Jb(14,"ion-input",5),M.ac(15,"translate"),M.Mb(),M.Jb(16,"app-item-err",2),M.Nb(17,"ion-item"),M.Jb(18,"ion-input",6),M.ac(19,"translate"),M.Mb(),M.Jb(20,"app-item-err",2),M.Nb(21,"ion-item"),M.Jb(22,"ion-input",7),M.ac(23,"translate"),M.Mb(),M.Jb(24,"app-item-err",2),M.Nb(25,"ion-item"),M.Jb(26,"ion-input",8),M.ac(27,"translate"),M.Mb(),M.Jb(28,"app-item-err",2),M.Nb(29,"ion-item"),M.Jb(30,"ion-input",9),M.ac(31,"translate"),M.Mb(),M.Jb(32,"app-item-err",2),M.Nb(33,"ion-item"),M.Jb(34,"ion-input",10),M.ac(35,"translate"),M.Mb(),M.Jb(36,"app-item-err",2),M.Nb(37,"ion-item"),M.Jb(38,"ion-input",11),M.ac(39,"translate"),M.Mb(),M.Jb(40,"app-item-err",2),M.Nb(41,"ion-item"),M.Jb(42,"ion-datetime",12),M.ac(43,"translate"),M.Mb(),M.Jb(44,"app-item-err",2),M.Mb()),2&e&&(M.gc("formGroup",r.form),M.xb(2),M.hc("placeholder",M.bc(3,34,"TradeInProfile_ChassisNo")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.chassis)("messages",r.messages.chassis),M.xb(2),M.hc("placeholder",M.bc(7,36,"TradeInProfile_RegistrationDate")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.regDate)("messages",r.messages.regDate),M.xb(2),M.hc("placeholder",M.bc(11,38,"TradeInProfile_YearMake")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.yearMake)("messages",r.messages.yearMake),M.xb(2),M.hc("placeholder",M.bc(15,40,"TradeInProfile_Make")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.make)("messages",r.messages.make),M.xb(2),M.hc("placeholder",M.bc(19,42,"TradeInProfile_Model")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.model)("messages",r.messages.model),M.xb(2),M.hc("placeholder",M.bc(23,44,"TradeInProfile_Variant")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.variant)("messages",r.messages.variant),M.xb(2),M.hc("placeholder",M.bc(27,46,"TradeInProfile_Color")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.color)("messages",r.messages.color),M.xb(2),M.hc("placeholder",M.bc(31,48,"TradeInProfile_TradeInSource")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.tradeInSource)("messages",r.messages.tradeInSource),M.xb(2),M.hc("placeholder",M.bc(35,50,"TradeInProfile_ExpectedPrice")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.expectedPrice)("messages",r.messages.expectedPrice),M.xb(2),M.hc("placeholder",M.bc(39,52,"TradeInProfile_Overtrade")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.overtrade)("messages",r.messages.overtrade),M.xb(2),M.hc("placeholder",M.bc(43,54,"TradeInProfile_WarrantyValidity")),M.xb(2),M.gc("control",null==r.form.controls?null:r.form.controls.warranty)("messages",r.messages.warranty))},directives:[a.m,a.i,a.d,s.B,s.A,s.tb,a.h,a.c,x.a,s.r,s.sb],pipes:[N.c],styles:[""]}),e})();function w(e,r){if(1&e){const e=M.Ob();M.Nb(0,"app-tradein-form-my",12),M.Vb("tdChange",function(r){return M.qc(e),M.Zb().setTradein(r)}),M.Mb()}if(2&e){const e=M.Zb();M.gc("form",e.tradeinForm)("tradein",e.tradein)("messages",e.formErrorMessages)}}const P=[{path:`:${u.a.PARAM_ID}/:contact`,children:[{path:"",component:(()=>{class e{constructor(e,r,t,o,a,s,n,l){this.formBuilder=e,this.translate=r,this.navCtrl=t,this.loadingCtrl=o,this.tradeinSrvc=a,this.route=s,this.oppSrvc=n,this.modalCtrl=l,this.subs=new i.a,this.countryCode=d.a.countryCode}ngOnInit(){this.tradeinForm=this.initTradeInForm(),this.subs.add(this.parseURL())}parseURL(){return this.tradein=new m.b,this.opp=new g.a,this.route.paramMap.subscribe(e=>{console.log(e),this.tradein.OpportunityId=e.get(u.a.PARAM_ID),this.tradein.ContactId=e.get(u.a.CONTACT_ID),this.getData()})}getData(){this.translate.get("Common_Loading").pipe(Object(b.b)(e=>Object(l.a)(this.loadingCtrl.create({message:e}))),Object(b.b)(e=>(e.present(),Object(c.a)([this.oppSrvc.getOpportunityById(this.tradein.OpportunityId).pipe(Object(h.a)(r=>{this.opp=r,e.dismiss()},r=>{e.dismiss()}))]).pipe(Object(h.a)(r=>{e.dismiss()},r=>{e.dismiss()}))))).subscribe()}selectPurchaser(){Object(l.a)(this.modalCtrl.create({component:f.a,componentProps:{callbackFn:e=>this.tradeinSrvc.getPurchasers(e),transformFn:e=>new C.a({Title:e.Name}),noResultFn:e=>{},backdropDismiss:!1}})).subscribe(e=>{Object(l.a)(e.onDidDismiss()).subscribe(e=>{console.log(e),e&&e.data&&(this.tradein.Purchaser=e.data.Id,this.tradein.Company=e.data.Company,this.tradeinForm.get("purchaser").setValue(e.data.Name))}),e.present()})}initTradeInForm(){const e=this.formBuilder.group({id:[""],regNo:["",[a.l.required]],purchaser:["",[a.l.required]],mileage:["",[a.l.required]],remarks:[""]});return this.initErrorMessages(e),e}initErrorMessages(e){this.translate.get("Error_CannotBeEmpty").subscribe(r=>{if(this.formErrorMessages={group:{}},e)for(const t of Object.keys(e.controls))switch(t){case"regNo":case"purchaser":case"mileage":this.formErrorMessages[t]={required:r}}})}setTradein(e){this.tradein=e}done(){this.tradein.RegNo=this.tradeinForm.get("regNo").value,this.tradein.Mileage=this.tradeinForm.get("mileage").value,this.tradein.Notes=this.tradeinForm.get("remarks").value,this.translate.get("Common_Saving").pipe(Object(b.b)(e=>Object(l.a)(this.loadingCtrl.create({message:e}))),Object(b.b)(e=>(e.present(),this.tradeinSrvc.upsertTradeIn(this.tradein).pipe(Object(h.a)(r=>{this.tradein=r[0],e.dismiss()},r=>{e.dismiss()}))))).subscribe(e=>{this.navCtrl.back(),setTimeout(e=>{this.navCtrl.navigateForward(p.a.BASE+"/"+this.tradein.Id)},1e3)})}}return e.\u0275fac=function(r){return new(r||e)(M.Ib(a.a),M.Ib(N.d),M.Ib(s.ob),M.Ib(s.mb),M.Ib(I.a),M.Ib(n.a),M.Ib(v.a),M.Ib(s.nb))},e.\u0275cmp=M.Cb({type:e,selectors:[["app-tradein-profile"]],decls:31,vars:31,consts:[["color","primary","mode","ios"],["slot","start"],["defaultHref","",3,"text"],["slot","end"],[3,"click"],[3,"formGroup"],["formControlName","regNo",3,"placeholder"],[3,"control","messages"],["formControlName","purchaser",3,"placeholder","click"],["formControlName","mileage",3,"placeholder"],[3,"form","tradein","messages","tdChange",4,"ngIf"],["rows","6","formControlName","remarks",3,"placeholder"],[3,"form","tradein","messages","tdChange"]],template:function(e,r){1&e&&(M.Nb(0,"ion-header"),M.Nb(1,"ion-toolbar",0),M.Nb(2,"ion-buttons",1),M.Jb(3,"ion-back-button",2),M.ac(4,"translate"),M.Mb(),M.Nb(5,"ion-buttons",3),M.Nb(6,"ion-button",4),M.Vb("click",function(){return r.done()}),M.xc(7),M.ac(8,"translate"),M.Mb(),M.Mb(),M.Nb(9,"ion-title"),M.xc(10),M.ac(11,"translate"),M.Mb(),M.Mb(),M.Mb(),M.Nb(12,"ion-content"),M.Nb(13,"form",5),M.Nb(14,"ion-item"),M.Jb(15,"ion-input",6),M.ac(16,"translate"),M.Mb(),M.Jb(17,"app-item-err",7),M.Nb(18,"ion-item"),M.Nb(19,"ion-input",8),M.Vb("click",function(){return r.selectPurchaser()}),M.ac(20,"translate"),M.Mb(),M.Mb(),M.Jb(21,"app-item-err",7),M.Nb(22,"ion-item"),M.Jb(23,"ion-input",9),M.ac(24,"translate"),M.Mb(),M.Jb(25,"app-item-err",7),M.vc(26,w,1,3,"app-tradein-form-my",10),M.Nb(27,"ion-item"),M.Jb(28,"ion-textarea",11),M.ac(29,"translate"),M.Mb(),M.Jb(30,"app-item-err",7),M.Mb(),M.Mb()),2&e&&(M.xb(3),M.hc("text",M.bc(4,17,"Common_Cancel")),M.xb(4),M.yc(M.bc(8,19,"Common_Done")),M.xb(3),M.yc(M.bc(11,21,"TradeInProfile_NewTradeIn")),M.xb(3),M.gc("formGroup",r.tradeinForm),M.xb(2),M.hc("placeholder",M.bc(16,23,"TradeInProfile_RegistrationNo")),M.xb(2),M.gc("control",null==r.tradeinForm.controls?null:r.tradeinForm.controls.regNo)("messages",r.formErrorMessages.regNo),M.xb(2),M.hc("placeholder",M.bc(20,25,"TradeInProfile_Purchaser")),M.xb(2),M.gc("control",null==r.tradeinForm.controls?null:r.tradeinForm.controls.purchaser)("messages",r.formErrorMessages.purchaser),M.xb(2),M.hc("placeholder",M.bc(24,27,"TradeInProfile_Mileage")),M.xb(2),M.gc("control",null==r.tradeinForm.controls?null:r.tradeinForm.controls.mileage)("messages",r.formErrorMessages.mileage),M.xb(1),M.gc("ngIf","my"==r.countryCode),M.xb(2),M.hc("placeholder",M.bc(29,29,"TradeInProfile_Notes")),M.xb(2),M.gc("control",null==r.tradeinForm.controls?null:r.tradeinForm.controls.remarks)("messages",r.formErrorMessages.remarks))},directives:[s.w,s.ib,s.i,s.f,s.g,s.h,s.hb,s.q,a.m,a.i,a.d,s.B,s.A,s.tb,a.h,a.c,x.a,o.m,s.gb,y],pipes:[N.c],styles:["ion-content[_ngcontent-%COMP%]{--background:var(--ion-color-content-color)}form[_ngcontent-%COMP%]{background:#fff}ion-select[_ngcontent-%COMP%]{width:100%}"]}),e})(),pathMatch:"full"}]}];let k=(()=>{class e{}return e.\u0275mod=M.Gb({type:e}),e.\u0275inj=M.Fb({factory:function(r){return new(r||e)},imports:[[n.i.forChild(P)],n.i]}),e})();var J=t("CJCG");let T=(()=>{class e{}return e.\u0275mod=M.Gb({type:e}),e.\u0275inj=M.Fb({factory:function(r){return new(r||e)},imports:[[o.c,a.e,s.kb,a.k,N.b,J.a,k]]}),e})()}}]);
//# sourceMappingURL=37.da8232958ae1e59662f3.js.map