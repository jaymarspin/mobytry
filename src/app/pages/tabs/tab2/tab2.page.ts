import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { CategorizedContact, ContactModel } from 'src/app/models/common/contact.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { environment } from 'src/environments/environment';
import { ViewContactPageRoutingKeys } from '../../contact/view-contact/view-contact-routing.keys';
import { NewLeadsRoutingKeys } from '../../new-leads/new-leads-routing.keys';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  letters = this.contact.getLetterScroll();
  contacts = [];
  recentContacts: ContactModel[];
  searchInput: string;
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  countryCode = environment.countryCode;
  offset = 0;

  constructor(
    private contact: CommonContactService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getRecentContacts();
  }

  getRecentContacts() {
    forkJoin([
      this.contact.getRecentContacts().pipe(
        tap((e) => {
          console.log(e);
          this.recentContacts = e;
        })
      ),
      this.getContacts(),
    ]).subscribe();
  }

  getContacts() {
    if (this.countryCode === 'my') {
      this.contacts = [];
      return this.translate.get('Common_Loading').pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return this.contact.getCategorizedContact().pipe(
            tap(
              (e) => {
                this.contacts = e;
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      );
    } else {
      return of(new Array<CategorizedContact>());
    }
  }

  getFavIcon(item: ContactModel) {
    if (item.Flag) {
      return 'heart';
    } else {
      return 'heart-outline';
    }
  }

  loadData(event) {
    // this.searchInput = this.searchInput && this.searchInput.trim() ? this.searchInput : null;
    // this.contact.getCategorizedContact(true, this.searchInput).subscribe((contacts) => {
    //   this.contacts = contacts;
    //   if (this.contact.getCurrContactArrLength() > 0) {
    //     event.target.complete();
    //   } else {
    //     event.target.disabled = true;
    //   }
    // });
  }

  search() {
    // if (this.searchInput && this.searchInput.trim()) {
    //   this.contact.getCategorizedContact(false, this.searchInput).subscribe((e) => {
    //     this.contacts = e;
    //   });
    // } else {
    //   this.getRecentContacts();
    // }
  }

  viewContact(item: ContactModel) {
    this.navCtrl.navigateForward(ViewContactPageRoutingKeys.BASE + '/' + item.Id);
  }

  getLetterClicked(letter: string) {
    const target = document.getElementById(letter);
    console.log(letter);
    if (document.getElementById(letter)) {
      this.myContent.scrollToPoint(0, target.offsetTop - 40, 1000);
    }
  }

  add() {
    this.router.navigate([`${NewLeadsRoutingKeys.BASE}`]);
  }

  showContactList() {
    if (this.searchInput) {
      return true;
    } else {
      if (environment.countryCode === 'my') {
        return true;
      } else {
        return false;
      }
    }
  }
}
