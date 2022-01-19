import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ContactModel } from 'src/app/models/common/contact.model';
import { Document } from 'src/app/models/common/document.model';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { Task } from 'src/app/models/common/task.model';
import { VehicleOwnership } from 'src/app/models/common/vehicle-ownership.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { CommonDocumentService } from 'src/app/services/common/document/document.service';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { CommonTaskService } from 'src/app/services/common/task/task.service';
import { OpportunityServiceSG } from 'src/app/services/sg/opportunity/opportunity-sg.service';
import { EditContactPageRoutingKeys } from '../edit-contact/edit-contact-routing.keys';
@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.page.html',
  styleUrls: ['./view-contact.page.scss'],
})
export class ViewContactPage implements OnInit {
  private subs = new Subscription();
  contact: ContactModel;
  vehOwnership: VehicleOwnership[];
  documents: Document[];
  opportunities: Opportunity[];
  segment = 'info';

  pause: any;
  resume: any;
  task = new Task();
  contactBtn: string;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private contactService: CommonContactService,
    private documentService: CommonDocumentService,
    private opportunityService: CommonOpportunityService,
    private opportunityServiceSG: OpportunityServiceSG,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    public platform: Platform,
    private taskService: CommonTaskService
  ) {

  }

  ionViewWillEnter() {

    this.platform.ready().then(() => {

      this.pause = this.platform.pause.subscribe(() => {

      });
      this.resume = this.platform.resume.subscribe(() => {
        window['paused'] = 0;
        if (this.contactBtn) {
          this.opportunityServiceSG.getTaskRT().subscribe(res => {

            this.insertTask(res)
          })
        }


      });

    });
  }
  ionViewWillLeave() {

    this.pause.unsubscribe();


    this.resume.unsubscribe();
  }
  contactMedium(medium: string) {
    this.contactBtn = medium
  }

  insertTask(recordTypeid) {

    this.task.TaskName = `Contacted Customer Via ${this.contactBtn} in Moby Sales 2.0`
    this.task.Status = `Completed`
    this.task.DueDate = new Date().toString();
    this.task.Id = null
    this.task.ContactId = this.contact.PersonContactId
    this.task.RecordTypeId = recordTypeid
    this.translate
      .get('Common_Saving')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return this.taskService.upsertTask(this.task).pipe(
            tap(
              (e) => {
                delete (this.contactBtn)
                loading.dismiss();

              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      )
      .subscribe((e) => {

      });
  }

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.contact = new ContactModel();
    return this.route.paramMap.subscribe((params) => {
      this.contact.Id = params.get(EditContactPageRoutingKeys.PARAM_ID);
      this.getContactInfo(this.contact.Id);
    });
  }




  editContact() {
    this.navCtrl.navigateForward(EditContactPageRoutingKeys.BASE + '/' + this.contact.Id);
  }

  getContactInfo(id: string) {
    this.translate
      .get('Common_Loading')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return forkJoin([
            this.contactService.getContactById(id).pipe(
              tap((e) => {
                console.log(e);
                this.contact = e;
              })
            ),
            this.contactService.getContactVehicleById(id).pipe(
              tap((e) => {
                this.vehOwnership = e;
              })
            ),
            this.documentService.getDocList(id).pipe(
              tap((e) => {
                this.documents = e;
              })
            ),
            this.opportunityService.getOpportunities(null, id).pipe(
              tap((e) => {
                this.opportunities = e;
              })
            ),
          ]).pipe(
            tap(
              (e) => {
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      )
      .subscribe();
  }
}
