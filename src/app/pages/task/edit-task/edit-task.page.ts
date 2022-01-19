import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, tap } from 'rxjs/operators';
import { AutocompleteComponent } from 'src/app/components/common/autocomplete/autocomplete.component';
import { AutoCompleteModel } from 'src/app/models/common/auto-complete.model';
import { ContactModel } from 'src/app/models/common/contact.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Task } from 'src/app/models/common/task.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { CommonTaskService } from 'src/app/services/common/task/task.service';
import { EditTaskPageRoutingKeys } from './edit-task-routing.keys';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {
  pageTitle: string;
  private subs = new Subscription();
  task: Task;
  states: object;
  taskForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  showTDField = false;
  showLeadField = false;
  maxdate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).getFullYear();
  mindate = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getFullYear();
  status = this.taskSrvc.getStatus();
  alert = this.taskSrvc.getAlertTypes();

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private taskSrvc: CommonTaskService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private contactSrvc: CommonContactService
  ) {}

  ngOnInit() {
    this.taskForm = this.initTaskForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.task = new Task();
    return this.route.paramMap.subscribe((params) => {
      this.task.Id = params.get(EditTaskPageRoutingKeys.PARAM_ID);
      if (this.task.Id === EditTaskPageRoutingKeys.PARAM_ID) {
        this.translate.get('EditTaskPage_NewTask').subscribe((e) => {
          this.pageTitle = e;
          this.task.Id = null;
        });
      } else {
        this.translate.get('EditTaskPage_EditTask').subscribe((e) => {
          this.pageTitle = e;
          this.getData();
        });
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.states = this.router.getCurrentNavigation().extras.state;
        this.task.OpportunityId = this.states[EditTaskPageRoutingKeys.STATE_OPPID];
        console.log(this.task.OpportunityId);
      }
    });
  }

  private initTaskForm(): FormGroup {
    const taskForm = this.formBuilder.group({
      id: [''],
      taskName: ['', [Validators.required]],
      status: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      allDay: [false],
      alert: [''],
      notes: [''],
      custAct: [''],
      custInfo: [''],
      custFeel: [''],
    });
    this.initSGValidation(taskForm);
    this.initErrorMessages(taskForm);
    return taskForm;
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
          case 'status':
          case 'contact':
          case 'endDate':
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
            this.taskSrvc.getTaskById(this.task.Id).pipe(
              tap((task) => {
                this.task = task;
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
    this.taskForm.get('id').setValue(this.task.Id);
    this.taskForm.get('taskName').setValue(this.task.TaskName);
    this.taskForm.get('status').setValue(this.task.Status);
    this.taskForm.get('contact').setValue(this.task.ContactName);
    this.taskForm.get('dueDate').setValue(this.task.DueDate);
    this.taskForm.get('alert').setValue(this.task.Alert);
    this.taskForm.get('notes').setValue(this.task.Notes);
  }

  done() {
    this.task.TaskName = this.taskForm.get('taskName').value;
    this.task.Status = this.taskForm.get('status').value;
    this.task.ContactName = this.taskForm.get('contact').value;
    // this.task.StartDate = this.taskForm.get('startDate').value;
    this.task.DueDate = this.taskForm.get('dueDate').value;
    this.task.Alert = this.taskForm.get('alert').value;
    this.task.Notes = this.taskForm.get('notes').value;
    this.task.isComplete = this.task?.Status === 'Open' ? false : true;
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
          return this.taskSrvc.upsertTask(this.task).pipe(
            tap(
              (e) => {
                console.log(e);
                loading.dismiss();
                this.navCtrl.back();
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
          console.log(modalData.data);
          this.task.ContactId = modalData.data.PersonContactId;
          this.task.ContactName = modalData.data.Name;
          this.taskForm.get('contact').setValue(modalData.data.Name);
        }
      });
      modal.present();
    });
  }

  private initSGValidation(form: FormGroup) {
    const tdFollowUp = 'follow up after test drive';
    const leadFollowUp = 'you have a new lead';
    form
      .get('taskName')
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(800))
      .subscribe((val) => {
        this.showTDField = val.toLowerCase().includes(tdFollowUp);
        this.showLeadField = val.toLowerCase().includes(leadFollowUp);
        if (this.showTDField || this.showLeadField) {
          this.taskForm.controls['custAct'].setValidators([Validators.required, Validators.minLength(40)]);
          this.formErrorMessages['custAct'] = {
            required: 'Minimum 40 Characters',
            minlength: 'Minimum 40 Characters',
          };
        }
        if (this.showTDField) {
          this.taskForm.controls['custFeel'].setValidators([Validators.required, Validators.minLength(40)]);
          this.formErrorMessages['custFeel'] = {
            required: 'Minimum 40 Characters',
            minlength: 'Minimum 40 Characters',
          };
        }
        if (this.showLeadField) {
          this.taskForm.controls['custInfo'].setValidators([Validators.required, Validators.minLength(40)]);
          this.formErrorMessages['custInfo'] = {
            required: 'Minimum 40 Characters',
            minlength: 'Minimum 40 Characters',
          };
        }
        if (!this.showLeadField && !this.showTDField) {
          this.taskForm.controls['custAct'].clearValidators();
          this.taskForm.controls['custFeel'].clearValidators();
        }
      });
  }
}
