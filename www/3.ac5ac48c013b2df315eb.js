(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{yhsd:function(t,n,e){"use strict";e.r(n),e.d(n,"HometestdrivesPageModule",function(){return j});var o=e("ofXK"),i=e("3Pt+"),l=e("TEn/"),c=e("tyNb"),b=e("mrSG"),r=e("quSY"),s=e("Cfvw"),a=e("VOuF"),u=e("fXoL"),d=e("sYmb");let g=(()=>{class t{constructor(t){this.modalCtrl=t}ngOnInit(){this.filterObj||this.reset()}getData(){}reset(){this.filterObj={tdStatus:"all"}}apply(){this.modalCtrl.dismiss(this.filterObj)}cancel(){this.modalCtrl.dismiss()}getUpcomingIcon(){return"upcoming"===this.filterObj.tdStatus?"assets/icon/opportunity/upcoming.svg":"assets/icon/opportunity/upcoming-disabled.svg"}updateTdStatus(t){this.filterObj.tdStatus="ongoing"===t?"ongoing":"upcoming"===t?"upcoming":"all"===t?"all":"completed"}}return t.\u0275fac=function(n){return new(n||t)(u.Ib(l.nb))},t.\u0275cmp=u.Cb({type:t,selectors:[["app-filter-testdrive"]],inputs:{filterObj:"filterObj"},decls:45,vars:36,consts:[[1,"ion-no-border"],["color","primary","mode","ios"],["slot","start"],[3,"click"],["slot","icon-only","name","arrow-back"],["slot","end"],[1,"ion-padding"],[1,"ion-no-margin","ion-no-padding"],["size","12"],[1,"ion-text-center","ion-padding-top"],[1,"header-btn",3,"click"],["name","apps",3,"color"],[1,"mat-small"],["name","play",3,"color"],["name","checkmark",3,"color"],[3,"src"],["fill","solid","expand","block","color","primary",3,"click"]],template:function(t,n){1&t&&(u.Nb(0,"ion-header",0),u.Nb(1,"ion-toolbar",1),u.Nb(2,"ion-buttons",2),u.Nb(3,"ion-button",3),u.Vb("click",function(){return n.cancel()}),u.Jb(4,"ion-icon",4),u.Mb(),u.Mb(),u.Nb(5,"ion-buttons",5),u.Nb(6,"ion-button",3),u.Vb("click",function(){return n.reset()}),u.xc(7),u.ac(8,"translate"),u.Mb(),u.Mb(),u.Nb(9,"ion-title"),u.xc(10),u.ac(11,"translate"),u.Mb(),u.Mb(),u.Mb(),u.Nb(12,"ion-content"),u.Nb(13,"div",6),u.Nb(14,"ion-grid",7),u.Nb(15,"ion-row"),u.Nb(16,"ion-col",8),u.Nb(17,"ion-label"),u.xc(18),u.ac(19,"translate"),u.Mb(),u.Mb(),u.Mb(),u.Nb(20,"ion-row",9),u.Nb(21,"ion-col",10),u.Vb("click",function(){return n.updateTdStatus("all")}),u.Jb(22,"ion-icon",11),u.Nb(23,"ion-label",12),u.xc(24),u.ac(25,"translate"),u.Mb(),u.Mb(),u.Nb(26,"ion-col",10),u.Vb("click",function(){return n.updateTdStatus("ongoing")}),u.Jb(27,"ion-icon",13),u.Nb(28,"ion-label",12),u.xc(29),u.ac(30,"translate"),u.Mb(),u.Mb(),u.Nb(31,"ion-col",10),u.Vb("click",function(){return n.updateTdStatus("completed")}),u.Jb(32,"ion-icon",14),u.Nb(33,"ion-label",12),u.xc(34),u.ac(35,"translate"),u.Mb(),u.Mb(),u.Nb(36,"ion-col",10),u.Vb("click",function(){return n.updateTdStatus("upcoming")}),u.Jb(37,"ion-icon",15),u.Nb(38,"ion-label",12),u.xc(39),u.ac(40,"translate"),u.Mb(),u.Mb(),u.Mb(),u.Mb(),u.Mb(),u.Mb(),u.Nb(41,"ion-footer",6),u.Nb(42,"ion-button",16),u.Vb("click",function(){return n.apply()}),u.xc(43),u.ac(44,"translate"),u.Mb(),u.Mb()),2&t&&(u.xb(7),u.zc(" ",u.bc(8,20,"TestdriveFilter_Reset")," "),u.xb(3),u.yc(u.bc(11,22,"TestdriveFilter_Filter")),u.xb(8),u.zc(" ",u.bc(19,24,"TestdriveFilter_TestDriveStatus")," "),u.xb(3),u.Ab("activated","all"===n.filterObj.tdStatus),u.xb(1),u.gc("color","all"===n.filterObj.tdStatus?"primary":"medium"),u.xb(2),u.zc(" ",u.bc(25,26,"TestdriveFilter_All")," "),u.xb(2),u.Ab("activated","ongoing"===n.filterObj.tdStatus),u.xb(1),u.gc("color","ongoing"===n.filterObj.tdStatus?"primary":"medium"),u.xb(2),u.zc(" ",u.bc(30,28,"TestdriveFilter_Ongoing")," "),u.xb(2),u.Ab("activated","completed"===n.filterObj.tdStatus),u.xb(1),u.gc("color","completed"===n.filterObj.tdStatus?"primary":"medium"),u.xb(2),u.zc(" ",u.bc(35,30,"TestdriveFilter_Completed")," "),u.xb(2),u.Ab("activated","upcoming"===n.filterObj.tdStatus),u.xb(1),u.hc("src",n.getUpcomingIcon()),u.xb(2),u.zc(" ",u.bc(40,32,"TestdriveFilter_Upcoming")," "),u.xb(4),u.zc(" ",u.bc(44,34,"Common_Apply")," "))},directives:[l.w,l.ib,l.i,l.h,l.x,l.hb,l.q,l.v,l.T,l.p,l.H,l.u],pipes:[d.c],styles:[".activated[_ngcontent-%COMP%]{border:1px solid var(--ion-color-primary)}.header-btn[_ngcontent-%COMP%]{margin-right:5px;margin-left:5px;padding-top:5px;padding-bottom:5px;border-radius:10px}.header-btn[_ngcontent-%COMP%], .header-btn[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{background:#eff8f8}.header-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{display:block;margin:auto;clear:both}ion-icon[_ngcontent-%COMP%]{font-size:25px}"]}),t})();var p=e("U+RE"),m=e("5+tZ"),h=e("vkgz"),x=e("AytR"),M=e("SJsC"),f=e("6GcI"),v=e("0C1u"),N=e("nC5Y");function C(t,n){if(1&t){const t=u.Ob();u.Nb(0,"ion-buttons",9),u.Nb(1,"ion-button",10),u.Vb("click",function(){return u.qc(t),u.Zb().showModelInterestComp()}),u.Jb(2,"ion-icon",11),u.Mb(),u.Mb()}}function y(t,n){if(1&t&&(u.Nb(0,"ion-text",12),u.xc(1),u.ac(2,"translate"),u.Mb()),2&t){const t=u.Zb();u.xb(1),u.Ac(" ",u.bc(2,2,"TestdrivePage_OpportunityID"),": ",t.oppId," ")}}function O(t,n){if(1&t){const t=u.Ob();u.Nb(0,"ion-toolbar",13),u.Nb(1,"ion-segment",14),u.Vb("ngModelChange",function(n){return u.qc(t),u.Zb().segment=n})("ionChange",function(n){return u.qc(t),u.Zb().segmentChanged(n)}),u.Nb(2,"ion-segment-button",15),u.Nb(3,"ion-label"),u.xc(4),u.ac(5,"translate"),u.Mb(),u.Mb(),u.Nb(6,"ion-segment-button",16),u.Nb(7,"ion-label"),u.xc(8),u.ac(9,"translate"),u.Mb(),u.Mb(),u.Mb(),u.Mb()}if(2&t){const t=u.Zb();u.xb(1),u.gc("ngModel",t.segment),u.xb(3),u.zc(" ",u.bc(5,3,"Testdrive_MyTestDrive")," "),u.xb(4),u.zc(" ",u.bc(9,5,"Testdrive_AllTestDrive")," ")}}function V(t,n){if(1&t){const t=u.Ob();u.Nb(0,"ion-grid",18),u.Nb(1,"ion-row",19),u.Nb(2,"ion-col"),u.Nb(3,"ion-label",20),u.Nb(4,"b"),u.xc(5),u.Mb(),u.Mb(),u.Jb(6,"ion-icon",21),u.Mb(),u.Nb(7,"ion-col",22),u.Nb(8,"ion-label",20),u.xc(9),u.Mb(),u.Nb(10,"ion-label",20),u.xc(11),u.Mb(),u.Nb(12,"ion-label",20),u.Nb(13,"b"),u.xc(14),u.Mb(),u.Mb(),u.Nb(15,"ion-label",20),u.xc(16),u.ac(17,"date"),u.Mb(),u.Nb(18,"ion-label",20),u.xc(19),u.ac(20,"date"),u.Mb(),u.Nb(21,"ion-label"),u.Nb(22,"a",10),u.Vb("click",function(){u.qc(t);const e=n.$implicit;return u.Zb(2).goToTestdrive(e)}),u.xc(23),u.ac(24,"translate"),u.Mb(),u.Mb(),u.Mb(),u.Mb(),u.Mb()}if(2&t){const t=n.$implicit,e=u.Zb(2);u.xb(3),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(2),u.yc(null==t||null==t.Vehicle?null:t.Vehicle.Status),u.xb(1),u.hc("src",e.getIcon(null==t?null:t.Vehicle)),u.xb(2),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(null==t?null:t.ContactName),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(null==t||null==t.Vehicle?null:t.Vehicle.RegNum),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(2),u.yc(null==t||null==t.Vehicle?null:t.Vehicle.Name),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(u.cc(17,14,null==t?null:t.ExpiryDate,"dd MMM y")),u.xb(2),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.zc(" ",u.cc(20,17,null==t?null:t.PlannedStartDate,"dd MMM y hh:mm a")," "),u.xb(4),u.zc(" ",u.bc(24,20,"OpportunityTab_ViewDetails")," ")}}function I(t,n){if(1&t&&(u.Lb(0),u.vc(1,V,25,22,"ion-grid",17),u.Kb()),2&t){const t=u.Zb();u.xb(1),u.gc("ngForOf",t.mytestdrives)}}function _(t,n){if(1&t&&(u.Nb(0,"ion-label",20),u.xc(1),u.Mb()),2&t){const t=u.Zb().$implicit,n=u.Zb(2);u.hc("color",n.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(null==t?null:t.DrivingLicense)}}function T(t,n){if(1&t){const t=u.Ob();u.Nb(0,"ion-grid",18),u.Nb(1,"ion-row",19),u.Nb(2,"ion-col"),u.Nb(3,"ion-label",20),u.Nb(4,"b"),u.xc(5),u.Mb(),u.Mb(),u.Nb(6,"ion-label",20),u.Nb(7,"b"),u.xc(8),u.Mb(),u.Mb(),u.Jb(9,"ion-icon",21),u.Mb(),u.Nb(10,"ion-col",22),u.Nb(11,"ion-label",20),u.xc(12),u.Mb(),u.Nb(13,"ion-label",20),u.xc(14),u.Mb(),u.Nb(15,"ion-label",20),u.Nb(16,"b"),u.xc(17),u.Mb(),u.Mb(),u.vc(18,_,2,2,"ion-label",23),u.Nb(19,"ion-label",20),u.xc(20),u.ac(21,"date"),u.Mb(),u.Nb(22,"ion-label",20),u.xc(23),u.ac(24,"date"),u.Mb(),u.Nb(25,"ion-label"),u.Nb(26,"a",10),u.Vb("click",function(){u.qc(t);const e=n.$implicit;return u.Zb(2).goToTestdrive(e)}),u.xc(27),u.ac(28,"translate"),u.Mb(),u.Mb(),u.Mb(),u.Mb(),u.Mb()}if(2&t){const t=n.$implicit,e=u.Zb(2);u.xb(3),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(2),u.yc(null==t||null==t.Vehicle?null:t.Vehicle.Status),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(2),u.yc(null==t?null:t.SalesRep),u.xb(1),u.hc("src",e.getIcon(null==t?null:t.Vehicle)),u.xb(2),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(null==t?null:t.ContactName),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(null==t||null==t.Vehicle?null:t.Vehicle.RegNum),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(2),u.yc(null==t||null==t.Vehicle?null:t.Vehicle.Name),u.xb(1),u.gc("nfIf","my"==e.countryCode),u.xb(1),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.yc(u.cc(21,17,null==t?null:t.ExpiryDate,"dd MMM y")),u.xb(2),u.hc("color",e.getColor(null==t?null:t.Vehicle)),u.xb(1),u.zc(" ",u.cc(24,20,null==t?null:t.PlannedStartDate,"dd MMM y hh:mm a")," "),u.xb(4),u.zc(" ",u.bc(28,23,"OpportunityTab_ViewDetails")," ")}}function S(t,n){if(1&t&&(u.Lb(0),u.vc(1,T,29,25,"ion-grid",17),u.Kb()),2&t){const t=u.Zb();u.xb(1),u.gc("ngForOf",t.testdrives)}}const P=[{path:":"+p.a.OPP_PARAM_ID,children:[{path:"",component:(()=>{class t{constructor(t,n,e,o,i,l,c,b){this.route=t,this.router=n,this.testdriveSrvc=e,this.modalCtrl=o,this.translate=i,this.loadingCtrl=l,this.auth=c,this.opportunityService=b,this.subs=new r.a,this.countryCode=x.a.countryCode,this.segment="mytestdrive",this.auth.subUser().subscribe(t=>{this.user=t,console.log(t)})}ngOnInit(){this.subs.add(this.parseURL())}parseURL(){return this.route.paramMap.subscribe(t=>{this.oppId=t.get(p.a.OPP_PARAM_ID),this.getTestdrives(null,null,this.segment)})}getTestdrives(t,n,e){return Object(b.a)(this,void 0,void 0,function*(){return this.translate.get("Common_Loading").pipe(Object(m.b)(t=>Object(s.a)(this.loadingCtrl.create({message:t}))),Object(m.b)(o=>(o.present(),this.testdriveSrvc.getTestdrives(t,n,e).pipe(Object(h.a)(t=>{"mytestdrive"===e?this.mytestdrives=t:this.testdrives=t,o.dismiss()},t=>{o.dismiss()}))))).subscribe()})}segmentChanged(t){this.getTestdrives(null,null,this.segment)}goToTestdrive(t){this.router.navigate([`${a.a.BASE}/${t.Id}`])}getColor(t){if(t&&this.checkStatus(t.Status))return"primary"}getIcon(t){return t&&this.checkStatus(t.Status)?"assets/icon/testdrive/active-td.svg":"assets/icon/testdrive/inactive-td.svg"}checkStatus(t){return"VEHICLE OUT"===t||"SCHEDULED"===t}showFilter(){Object(s.a)(this.modalCtrl.create({component:g,backdropDismiss:!1,animated:!0,cssClass:"full-screen",componentProps:{filterObj:this.filterObj?Object.assign({},this.filterObj):null}})).subscribe(t=>{Object(s.a)(t.onDidDismiss()).subscribe(t=>{t&&t.data&&(this.filterObj=t.data,this.getTestdrives(this.filterObj,this.oppId,this.segment))}),t.present()})}showModelInterestComp(){Object(s.a)(this.modalCtrl.create({component:M.a,componentProps:{cmp:"02",team:"",selectedValues:"",singleSelect:!0}})).subscribe(t=>{Object(s.a)(t.onDidDismiss()).subscribe(t=>{t&&t.data&&t.data.map(t=>t.label)}),t.present()})}}return t.\u0275fac=function(n){return new(n||t)(u.Ib(c.a),u.Ib(c.g),u.Ib(f.a),u.Ib(l.nb),u.Ib(d.d),u.Ib(l.mb),u.Ib(v.a),u.Ib(N.a))},t.\u0275cmp=u.Cb({type:t,selectors:[["app-hometestdrives"]],decls:15,vars:11,consts:[[1,"ion-no-border"],["color","primary","mode","ios"],["slot","start"],["defaultHref","",3,"text"],["slot","end",4,"ngIf"],["class","sub-header",4,"ngIf"],["mode","ios",4,"ngIf"],[1,"ion-padding-start","ion-padding-end","ion-padding-bottom"],[4,"ngIf"],["slot","end"],[3,"click"],["slot","icon-only","name","funnel"],[1,"sub-header"],["mode","ios"],["mode","ios",1,"ion-no-margin",3,"ngModel","ngModelChange","ionChange"],["value","mytestdrive"],["value","alltestdrive"],["class","ion-margin-top ion-margin-bottom border-radius bg-white",4,"ngFor","ngForOf"],[1,"ion-margin-top","ion-margin-bottom","border-radius","bg-white"],[1,"ion-no-margin"],[3,"color"],[1,"bottom-icon",3,"src"],[1,"ion-text-start"],[3,"color",4,"nfIf"]],template:function(t,n){1&t&&(u.Nb(0,"ion-header",0),u.Nb(1,"ion-toolbar",1),u.Nb(2,"ion-buttons",2),u.Jb(3,"ion-back-button",3),u.ac(4,"translate"),u.Mb(),u.vc(5,C,3,0,"ion-buttons",4),u.Nb(6,"ion-title"),u.xc(7),u.ac(8,"translate"),u.Jb(9,"br"),u.vc(10,y,3,4,"ion-text",5),u.Mb(),u.Mb(),u.vc(11,O,10,7,"ion-toolbar",6),u.Mb(),u.Nb(12,"ion-content",7),u.vc(13,I,2,1,"ng-container",8),u.vc(14,S,2,1,"ng-container",8),u.Mb()),2&t&&(u.xb(3),u.hc("text",u.bc(4,7,"Common_Back")),u.xb(2),u.gc("ngIf","mytestdrive"===n.oppId&&"alltestdrive"===n.segment),u.xb(2),u.zc(" ",u.bc(8,9,"TestdrivePage_Testdrives"),""),u.xb(3),u.gc("ngIf",n.oppId&&"my"===n.countryCode),u.xb(1),u.gc("ngIf","mytestdrive"===n.oppId||"all"===n.oppId),u.xb(2),u.gc("ngIf","mytestdrive"===n.segment),u.xb(1),u.gc("ngIf","alltestdrive"===n.segment))},directives:[l.w,l.ib,l.i,l.f,l.g,o.m,l.hb,l.q,l.h,l.x,l.fb,l.V,l.sb,i.h,i.j,l.W,l.H,o.l,l.v,l.T,l.p],pipes:[d.c,o.f],styles:[".bg[_ngcontent-%COMP%], ion-content[_ngcontent-%COMP%]{--background:var(--ion-color-content-color)}.sub-header[_ngcontent-%COMP%]{font-size:12px}.add-icon[_ngcontent-%COMP%]{font-size:20px;margin-right:5px;vertical-align:middle;margin-top:-3px}.bottom-icon[_ngcontent-%COMP%]{bottom:0;position:absolute;font-size:20px}.border[_ngcontent-%COMP%]{border:3px dashed #cacaca}.bg-white[_ngcontent-%COMP%]{background:#fff}ion-segment[_ngcontent-%COMP%]{width:100%}.bottom-icon[_ngcontent-%COMP%], b[_ngcontent-%COMP%], ion-label[_ngcontent-%COMP%]{float:left;clear:left;position:relative}.bottom-icon[_ngcontent-%COMP%]{display:block;margin-top:3px}"]}),t})(),pathMatch:"full"}]}];let k=(()=>{class t{}return t.\u0275mod=u.Gb({type:t}),t.\u0275inj=u.Fb({factory:function(n){return new(n||t)},imports:[[c.i.forChild(P)],c.i]}),t})(),j=(()=>{class t{}return t.\u0275mod=u.Gb({type:t}),t.\u0275inj=u.Fb({factory:function(n){return new(n||t)},imports:[[o.c,i.e,l.kb,d.b,k]]}),t})()}}]);
//# sourceMappingURL=3.ac5ac48c013b2df315eb.js.map