import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AutocompleteComponent } from 'src/app/components/common/autocomplete/autocomplete.component';
import { AutoCompleteModel } from 'src/app/models/common/auto-complete.model';
import { ContactModel } from 'src/app/models/common/contact.model';
import { Event } from 'src/app/models/common/event.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { CommonEventService } from 'src/app/services/common/event/event.service';
import { EditEventPageRoutingKeys } from './edit-event-routing.keys';
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  pageTitle: string;
  private subs = new Subscription();
  event: Event;
  states: object;
  eventForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  maxdate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).getFullYear();
  mindate = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getFullYear();
  alert = this.eventSrvc.getAlertTypes();

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private eventSrvc: CommonEventService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private contactSrvc: CommonContactService
  ) {}

  ngOnInit() {
    this.eventForm = this.initEventForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.event = new Event();
    return this.route.paramMap.subscribe((params) => {
      this.event.Id = params.get(EditEventPageRoutingKeys.PARAM_ID);
      if (this.event.Id === EditEventPageRoutingKeys.NEW) {
        this.translate.get('TasksPage_NewEvent').subscribe((e) => {
          this.pageTitle = e;
          this.event.Id = null;
        });
      } else {
        this.translate.get('TasksPage_EditEvent').subscribe((e) => {
          this.pageTitle = e;
          this.getData();
        });
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.states = this.router.getCurrentNavigation().extras.state;
        this.event.OpportunityId = this.states[EditEventPageRoutingKeys.STATE_OPPID];
      }
    });
  }

  private initEventForm(): FormGroup {
    const eventForm = this.formBuilder.group({
      id: [''],
      taskName: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      allDay: [false, [Validators.required]],
      alert: [''],
      notes: [''],
    });
    this.initErrorMessages(eventForm);
    return eventForm;
  }

  private initErrorMessages(form: FormGroup) {
    this.translate.get('Error_CannotBeEmpty').subscribe((lang) => {
      this.formErrorMessages = {
        group: {},
      };
      if (!form) {
        return;
      }
      for (const key of Object.keys(form.controls)) {
        switch (key) {
          case 'taskName':
          case 'contact':
          case 'startDate':
          case 'endDate':
          case 'allDay':
            this.formErrorMessages[key] = {
              required: lang,
            };
            break;
          default:
            break;
        }
      }
    });
  }

  getData() {
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
            this.eventSrvc.getEventById(this.event.Id).pipe(
              tap((event) => {
                this.event = event;
                this.setValues();
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

  setValues() {
    this.eventForm.get('id').setValue(this.event.Id);
    this.eventForm.get('taskName').setValue(this.event.TaskName);
    this.eventForm.get('contact').setValue(this.event.ContactName);
    this.eventForm.get('startDate').setValue(this.event.StartDate);
    this.eventForm.get('allDay').setValue(this.event.AllDay);
    this.eventForm.get('endDate').setValue(this.event.EndDate);
    this.eventForm.get('alert').setValue(this.event.Alert);
    this.eventForm.get('notes').setValue(this.event.Notes);
  }

  getEndDate() {
    if (this.event.StartDate) {
      return new Date(this.event.StartDate).toISOString();
    } else {
      return this.mindate;
    }
  }

  done() {
    this.event.TaskName = this.eventForm.get('taskName').value;
    this.event.ContactName = this.eventForm.get('contact').value;
    this.event.StartDate = this.eventForm.get('startDate').value;
    this.event.AllDay = this.eventForm.get('allDay').value;
    this.event.EndDate = this.eventForm.get('endDate').value;
    this.event.Alert = this.eventForm.get('alert').value;
    this.event.Notes = this.eventForm.get('notes').value;
    console.log(this.event.Id);
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
          return this.eventSrvc.upsertEvent(this.event).pipe(
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
      .subscribe((e) => {
        this.navCtrl.back();
      });
  }

  selectContact() {
    from(
      this.modalCtrl.create({
        component: AutocompleteComponent,
        componentProps: {
          callbackFn: (searchStr: string) => {
            return this.contactSrvc.searchByName(searchStr);
          },
          transformFn: (contact: ContactModel) => {
            return new AutoCompleteModel({
              Title: contact.Name,
              Label: `(${contact.MobileNo})`,
              Note: contact.Id,
            });
          },
          noResultFn: (searchStr: string) => {},
          backdropDismiss: false,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((modalData) => {
        if (modalData && modalData.data) {
          this.event.ContactId = modalData.data.PersonContactId;
          this.event.ContactName = modalData.data.Name;
          this.eventForm.get('contact').setValue(modalData.data.Name);
        }
      });
      modal.present();
    });
  }
}
