import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ContactModel } from 'src/app/models/common/contact.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { EditContactPageRoutingKeys } from 'src/app/pages/contact/edit-contact/edit-contact-routing.keys';
import { TradeinUpdateProfilePageRoutingKeys } from 'src/app/pages/tradein/edit-tradein/update-profile/update-profile-routing.keys';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.scss'],
})
export class ContactSearchComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() messages: FormErrorMessages;
  @Input() oppId: string;
  contact: ContactModel = null;

  constructor(private router: Router, private alertCtrl: AlertController, private translate: TranslateService, private contactService: CommonContactService) {}
  ngOnInit() {}
  search() {
    if (!this.form.get('name').value.trim() && !this.form.get('mobile').value.trim()) {
      this.contact = null;
    } else {
      this.contact = new ContactModel();
      this.contact.Name = this.form.get('name').value;
      this.contact.MobileNo = this.form.get('mobile').value;
    }
  }
  add() {
    const btns = [];
    from(this.alertCtrl.create())
      .pipe(
        mergeMap((alert) => {
          return forkJoin([
            this.translate.get('ContactComponent_NewContact').pipe(
              tap((e) => {
                alert.header = e;
              })
            ),
            this.translate.get('ContactComponent_NewContactMessage').pipe(
              tap((e) => {
                alert.message = e;
              })
            ),
            this.translate.get('ContactComponent_CreateNew').pipe(
              tap((e) => {
                btns.push({
                  text: e,
                  handler: () => {
                    this.addContact();
                  },
                });
              })
            ),
            this.translate.get('ContactComponent_Import').pipe(
              tap((e) => {
                btns.push({
                  text: e,
                  handler: () => {
                    this.importContact();
                  },
                });
              })
            ),
          ]).pipe(
            mergeMap((e) => {
              return of(alert);
            })
          );
        })
      )
      .subscribe((alert) => {
        alert.buttons = btns;
        alert.present();
      });
  }
  addContact() {
    const state = new Object();
    const contact = new ContactModel();
    contact.Name = this.form.get('name').value;
    contact.MobileNo = this.form.get('mobile').value;
    state[EditContactPageRoutingKeys.STATE_CONTACT] = contact;
    state[EditContactPageRoutingKeys.STATE_VALIDATORS] = ['mobile', 'fullName', 'countryCode'];
    const navigationExtras: NavigationExtras = {
      state,
    };
    if (this.oppId === 'oppId') {
      this.router.navigate([`${EditContactPageRoutingKeys.BASE}/${EditContactPageRoutingKeys.PARAM_ID}`], navigationExtras);
    } else {
      this.router.navigate([`${TradeinUpdateProfilePageRoutingKeys.BASE}/${this.oppId}/false`]);
    }

    this.form.reset({
      name: '',
      mobile: '',
    });
  }
  importContact() {
    this.contactService.importContact().subscribe((e) => {
      this.form.get('name').setValue(e.Name);
      this.form.get('mobile').setValue(e.MobileNo);
    });
  }
}
