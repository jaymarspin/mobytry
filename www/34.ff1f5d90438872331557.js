(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{"7UAx":function(t,e,s){"use strict";s.r(e),s.d(e,"EditTaskPageModule",function(){return j});var a=s("ofXK"),o=s("3Pt+"),i=s("TEn/"),n=s("tyNb"),r=s("quSY"),c=s("Cfvw"),l=s("cp0P"),u=s("5+tZ"),h=s("vkgz"),b=s("/uUt"),m=s("7o/Q"),d=s("D0XW");class g{constructor(t,e){this.dueTime=t,this.scheduler=e}call(t,e){return e.subscribe(new k(t,this.dueTime,this.scheduler))}}class k extends m.a{constructor(t,e,s){super(t),this.dueTime=e,this.scheduler=s,this.debouncedSubscription=null,this.lastValue=null,this.hasValue=!1}_next(t){this.clearDebounce(),this.lastValue=t,this.hasValue=!0,this.add(this.debouncedSubscription=this.scheduler.schedule(p,this.dueTime,this))}_complete(){this.debouncedNext(),this.destination.complete()}debouncedNext(){if(this.clearDebounce(),this.hasValue){const{lastValue:t}=this;this.lastValue=null,this.hasValue=!1,this.destination.next(t)}}clearDebounce(){const t=this.debouncedSubscription;null!==t&&(this.remove(t),t.unsubscribe(),this.debouncedSubscription=null)}}function p(t){t.debouncedNext()}var f=s("rrCD"),F=s("vscJ"),M=s("G1OA"),N=s("eQq2"),x=s("fXoL"),C=s("sYmb"),v=s("/dMj"),w=s("FpxV"),D=s("gE7l");function I(t,e){if(1&t&&(x.Nb(0,"ion-select-option",14),x.xc(1),x.Mb()),2&t){const t=e.$implicit;x.gc("value",t.value),x.xb(1),x.zc(" ",t.label," ")}}function T(t,e){1&t&&(x.Nb(0,"ion-item",15),x.Jb(1,"ion-textarea",21),x.ac(2,"translate"),x.Mb()),2&t&&(x.xb(1),x.hc("placeholder",x.bc(2,1,"EditTaskPage_CustInfo")))}function E(t,e){if(1&t&&(x.Nb(0,"ion-item",17),x.Nb(1,"ion-note"),x.xc(2),x.Mb(),x.Mb()),2&t){const t=x.Zb(2);x.xb(2),x.zc("Character count: ",null==t.taskForm.get("custInfo").value?null:t.taskForm.get("custInfo").value.length,"")}}function O(t,e){if(1&t&&x.Jb(0,"app-item-err",7),2&t){const t=x.Zb(2);x.gc("control",null==t.taskForm.controls?null:t.taskForm.controls.custInfo)("messages",t.formErrorMessages.custInfo)}}function V(t,e){1&t&&(x.Nb(0,"ion-item",15),x.Jb(1,"ion-textarea",22),x.ac(2,"translate"),x.Mb()),2&t&&(x.xb(1),x.hc("placeholder",x.bc(2,1,"EditTaskPage_CustFeel")))}function _(t,e){if(1&t&&(x.Nb(0,"ion-item",17),x.Nb(1,"ion-note"),x.xc(2),x.Mb(),x.Mb()),2&t){const t=x.Zb(2);x.xb(2),x.zc("Character count: ",null==t.taskForm.get("custFeel").value?null:t.taskForm.get("custFeel").value.length,"")}}function P(t,e){if(1&t&&x.Jb(0,"app-item-err",7),2&t){const t=x.Zb(2);x.gc("control",null==t.taskForm.controls?null:t.taskForm.controls.custFeel)("messages",t.formErrorMessages.custFeel)}}function A(t,e){if(1&t&&(x.Lb(0),x.Nb(1,"ion-item",15),x.Jb(2,"ion-textarea",16),x.ac(3,"translate"),x.Mb(),x.Nb(4,"ion-item",17),x.Nb(5,"ion-note"),x.xc(6),x.Mb(),x.Mb(),x.Jb(7,"app-item-err",7),x.vc(8,T,3,3,"ion-item",18),x.vc(9,E,3,1,"ion-item",19),x.vc(10,O,1,2,"app-item-err",20),x.vc(11,V,3,3,"ion-item",18),x.vc(12,_,3,1,"ion-item",19),x.vc(13,P,1,2,"app-item-err",20),x.Kb()),2&t){const t=x.Zb();x.xb(2),x.hc("placeholder",x.bc(3,10,"EditTaskPage_CustAct")),x.xb(4),x.zc("Character count: ",null==t.taskForm.get("custAct").value?null:t.taskForm.get("custAct").value.length,""),x.xb(1),x.gc("control",null==t.taskForm.controls?null:t.taskForm.controls.custAct)("messages",t.formErrorMessages.custAct),x.xb(1),x.gc("ngIf",t.showLeadField),x.xb(1),x.gc("ngIf",t.showLeadField),x.xb(1),x.gc("ngIf",t.showLeadField),x.xb(1),x.gc("ngIf",t.showTDField),x.xb(1),x.gc("ngIf",t.showTDField),x.xb(1),x.gc("ngIf",t.showTDField)}}const y=[{path:":"+N.a.PARAM_ID,children:[{path:"",component:(()=>{class t{constructor(t,e,s,a,o,i,n,c,l){this.route=t,this.translate=e,this.taskSrvc=s,this.formBuilder=a,this.navCtrl=o,this.router=i,this.loadingCtrl=n,this.modalCtrl=c,this.contactSrvc=l,this.subs=new r.a,this.showTDField=!1,this.showLeadField=!1,this.maxdate=new Date((new Date).setFullYear((new Date).getFullYear()+5)).getFullYear(),this.mindate=new Date((new Date).setFullYear((new Date).getFullYear()-5)).getFullYear(),this.status=this.taskSrvc.getStatus(),this.alert=this.taskSrvc.getAlertTypes()}ngOnInit(){this.taskForm=this.initTaskForm(),this.subs.add(this.parseURL())}parseURL(){return this.task=new M.a,this.route.paramMap.subscribe(t=>{this.task.Id=t.get(N.a.PARAM_ID),this.task.Id===N.a.PARAM_ID?this.translate.get("EditTaskPage_NewTask").subscribe(t=>{this.pageTitle=t,this.task.Id=null}):this.translate.get("EditTaskPage_EditTask").subscribe(t=>{this.pageTitle=t,this.getData()}),this.router.getCurrentNavigation().extras.state&&(this.states=this.router.getCurrentNavigation().extras.state,this.task.OpportunityId=this.states[N.a.STATE_OPPID],console.log(this.task.OpportunityId))})}initTaskForm(){const t=this.formBuilder.group({id:[""],taskName:["",[o.l.required]],status:["",[o.l.required]],contact:["",[o.l.required]],dueDate:["",[o.l.required]],allDay:[!1],alert:[""],notes:[""],custAct:[""],custInfo:[""],custFeel:[""]});return this.initSGValidation(t),this.initErrorMessages(t),t}initErrorMessages(t){this.translate.get("Error_CannotBeEmpty").subscribe(e=>{if(this.formErrorMessages={group:{}},t)for(const s of Object.keys(t.controls))switch(s){case"taskName":case"status":case"contact":case"endDate":this.formErrorMessages[s]={required:e}}})}getData(){this.translate.get("Common_Loading").pipe(Object(u.b)(t=>Object(c.a)(this.loadingCtrl.create({message:t}))),Object(u.b)(t=>(t.present(),Object(l.a)([this.taskSrvc.getTaskById(this.task.Id).pipe(Object(h.a)(t=>{this.task=t,this.setValues()}))]).pipe(Object(h.a)(e=>{t.dismiss()},e=>{t.dismiss()}))))).subscribe()}setValues(){this.taskForm.get("id").setValue(this.task.Id),this.taskForm.get("taskName").setValue(this.task.TaskName),this.taskForm.get("status").setValue(this.task.Status),this.taskForm.get("contact").setValue(this.task.ContactName),this.taskForm.get("dueDate").setValue(this.task.DueDate),this.taskForm.get("alert").setValue(this.task.Alert),this.taskForm.get("notes").setValue(this.task.Notes)}done(){var t;this.task.TaskName=this.taskForm.get("taskName").value,this.task.Status=this.taskForm.get("status").value,this.task.ContactName=this.taskForm.get("contact").value,this.task.DueDate=this.taskForm.get("dueDate").value,this.task.Alert=this.taskForm.get("alert").value,this.task.Notes=this.taskForm.get("notes").value,this.task.isComplete="Open"!==(null===(t=this.task)||void 0===t?void 0:t.Status),this.translate.get("Common_Saving").pipe(Object(u.b)(t=>Object(c.a)(this.loadingCtrl.create({message:t}))),Object(u.b)(t=>(t.present(),this.taskSrvc.upsertTask(this.task).pipe(Object(h.a)(e=>{console.log(e),t.dismiss(),this.navCtrl.back()},e=>{t.dismiss()}))))).subscribe(t=>{this.navCtrl.back()})}selectContact(){Object(c.a)(this.modalCtrl.create({component:f.a,componentProps:{callbackFn:t=>this.contactSrvc.searchByName(t),transformFn:t=>new F.a({Title:t.Name,Label:`(${t.MobileNo})`,Note:t.Id}),noResultFn:t=>{},backdropDismiss:!1}})).subscribe(t=>{Object(c.a)(t.onDidDismiss()).subscribe(t=>{t&&t.data&&(console.log(t.data),this.task.ContactId=t.data.PersonContactId,this.task.ContactName=t.data.Name,this.taskForm.get("contact").setValue(t.data.Name))}),t.present()})}initSGValidation(t){t.get("taskName").valueChanges.pipe(Object(b.a)(),function(t,e=d.a){return s=>s.lift(new g(t,e))}(800)).subscribe(t=>{this.showTDField=t.toLowerCase().includes("follow up after test drive"),this.showLeadField=t.toLowerCase().includes("you have a new lead"),(this.showTDField||this.showLeadField)&&(this.taskForm.controls.custAct.setValidators([o.l.required,o.l.minLength(40)]),this.formErrorMessages.custAct={required:"Minimum 40 Characters",minlength:"Minimum 40 Characters"}),this.showTDField&&(this.taskForm.controls.custFeel.setValidators([o.l.required,o.l.minLength(40)]),this.formErrorMessages.custFeel={required:"Minimum 40 Characters",minlength:"Minimum 40 Characters"}),this.showLeadField&&(this.taskForm.controls.custInfo.setValidators([o.l.required,o.l.minLength(40)]),this.formErrorMessages.custInfo={required:"Minimum 40 Characters",minlength:"Minimum 40 Characters"}),this.showLeadField||this.showTDField||(this.taskForm.controls.custAct.clearValidators(),this.taskForm.controls.custFeel.clearValidators())})}}return t.\u0275fac=function(e){return new(e||t)(x.Ib(n.a),x.Ib(C.d),x.Ib(v.a),x.Ib(o.a),x.Ib(i.ob),x.Ib(n.g),x.Ib(i.mb),x.Ib(i.nb),x.Ib(w.a))},t.\u0275cmp=x.Cb({type:t,selectors:[["app-edit-task"]],decls:35,vars:38,consts:[["color","primary","mode","ios"],["slot","start"],["defaultHref","",3,"text"],["slot","end"],[3,"disabled","click"],[3,"formGroup"],["formControlName","taskName",3,"placeholder"],[3,"control","messages"],["formControlName","status",3,"placeholder"],[3,"value",4,"ngFor","ngForOf"],["formControlName","contact",3,"placeholder","click"],["formControlName","dueDate","displayFormat","DD MMM YYYY",3,"placeholder","min","max"],[4,"ngIf"],["rows","6","formControlName","notes",3,"placeholder"],[3,"value"],["lines","none"],["formControlName","custAct","autoGrow","true",3,"placeholder"],[1,"ion-no-margin","ion-no-padding","ion-text-end"],["lines","none",4,"ngIf"],["class","ion-no-margin ion-no-padding ion-text-end",4,"ngIf"],[3,"control","messages",4,"ngIf"],["formControlName","custInfo","autoGrow","true",3,"placeholder"],["formControlName","custFeel","autoGrow","true",3,"placeholder"]],template:function(t,e){1&t&&(x.Nb(0,"ion-header"),x.Nb(1,"ion-toolbar",0),x.Nb(2,"ion-buttons",1),x.Jb(3,"ion-back-button",2),x.ac(4,"translate"),x.Mb(),x.Nb(5,"ion-buttons",3),x.Nb(6,"ion-button",4),x.Vb("click",function(){return e.done()}),x.xc(7),x.ac(8,"translate"),x.Mb(),x.Mb(),x.Nb(9,"ion-title"),x.xc(10),x.Mb(),x.Mb(),x.Mb(),x.Nb(11,"ion-content"),x.Nb(12,"form",5),x.Nb(13,"ion-item"),x.Jb(14,"ion-input",6),x.ac(15,"translate"),x.Mb(),x.Jb(16,"app-item-err",7),x.Nb(17,"ion-item"),x.Nb(18,"ion-select",8),x.ac(19,"translate"),x.vc(20,I,2,2,"ion-select-option",9),x.Mb(),x.Mb(),x.Jb(21,"app-item-err",7),x.Nb(22,"ion-item"),x.Nb(23,"ion-input",10),x.Vb("click",function(){return e.selectContact()}),x.ac(24,"translate"),x.Mb(),x.Mb(),x.Jb(25,"app-item-err",7),x.Nb(26,"ion-item"),x.Jb(27,"ion-datetime",11),x.ac(28,"translate"),x.Mb(),x.Jb(29,"app-item-err",7),x.vc(30,A,14,12,"ng-container",12),x.Nb(31,"ion-item"),x.Jb(32,"ion-textarea",13),x.ac(33,"translate"),x.Mb(),x.Jb(34,"app-item-err",7),x.Mb(),x.Mb()),2&t&&(x.xb(3),x.hc("text",x.bc(4,24,"Common_Back")),x.xb(3),x.gc("disabled",e.taskForm.invalid),x.xb(1),x.yc(x.bc(8,26,"Common_Done")),x.xb(3),x.yc(e.pageTitle),x.xb(2),x.gc("formGroup",e.taskForm),x.xb(2),x.hc("placeholder",x.bc(15,28,"EditTaskPage_TaskName")),x.xb(2),x.gc("control",null==e.taskForm.controls?null:e.taskForm.controls.taskName)("messages",e.formErrorMessages.taskName),x.xb(2),x.hc("placeholder",x.bc(19,30,"EditTaskPage_Status")),x.xb(2),x.gc("ngForOf",e.status),x.xb(1),x.gc("control",null==e.taskForm.controls?null:e.taskForm.controls.status)("messages",e.formErrorMessages.status),x.xb(2),x.hc("placeholder",x.bc(24,32,"EditTaskPage_Contacts")),x.xb(2),x.gc("control",null==e.taskForm.controls?null:e.taskForm.controls.contact)("messages",e.formErrorMessages.contact),x.xb(2),x.hc("placeholder",x.bc(28,34,"EditTaskPage_EndDate")),x.hc("min",e.mindate),x.hc("max",e.maxdate),x.xb(2),x.gc("control",null==e.taskForm.controls?null:e.taskForm.controls.dueDate)("messages",e.formErrorMessages.dueDate),x.xb(1),x.gc("ngIf",e.showLeadField||e.showTDField),x.xb(2),x.hc("placeholder",x.bc(33,36,"EditTaskPage_Notes")),x.xb(2),x.gc("control",null==e.taskForm.controls?null:e.taskForm.controls.notes)("messages",e.formErrorMessages.notes))},directives:[i.w,i.ib,i.i,i.f,i.g,i.h,i.hb,i.q,o.m,o.i,o.d,i.B,i.A,i.tb,o.h,o.c,D.a,i.X,i.sb,a.l,i.r,a.m,i.gb,i.Y,i.M],pipes:[C.c],styles:["ion-content[_ngcontent-%COMP%]{--background:var(--ion-color-content-color)}div[_ngcontent-%COMP%]{background:#fff}ion-select[_ngcontent-%COMP%]{width:100%}.no-opacity[_ngcontent-%COMP%]{opacity:1!important}ion-datetime[_ngcontent-%COMP%], ion-note[_ngcontent-%COMP%]{width:100%}"]}),t})(),pathMatch:"full"}]}];let S=(()=>{class t{}return t.\u0275mod=x.Gb({type:t}),t.\u0275inj=x.Fb({factory:function(e){return new(e||t)},imports:[[n.i.forChild(y)],n.i]}),t})();var L=s("CJCG"),J=s("Xdcg");let j=(()=>{class t{}return t.\u0275mod=x.Gb({type:t}),t.\u0275inj=x.Fb({factory:function(e){return new(e||t)},imports:[[a.c,o.e,i.kb,o.k,C.b,S,L.a,J.a]]}),t})()}}]);
//# sourceMappingURL=34.ff1f5d90438872331557.js.map