import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, of, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { CategorizedContact, ContactModel } from 'src/app/models/common/contact.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { environment } from 'src/environments/environment';
import { ViewContactPageRoutingKeys } from '../../contact/view-contact/view-contact-routing.keys';
import { NewLeadsRoutingKeys } from '../../new-leads/new-leads-routing.keys';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit, OnDestroy {
  letters = this.contact.getLetterScroll();
  contacts: CategorizedContact[] = [];
  recentContacts: ContactModel[];
  searchInput: string;
  isLoadingRecent = false;
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  countryCode = environment.countryCode;
  offset = 0;

  private sub = new Subscription();

  constructor(
    private contact: CommonContactService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getRecentContacts();
    this.sub.add(
      this.contact.subRecentContacts().subscribe((recentList) => {
        this.recentContacts = recentList;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getRecentContacts() {
    this.isLoadingRecent = true;
    const obsList = [];
    if (!this.recentContacts || this.recentContacts.length <= 0) {
      obsList.push(this.contact.getRecentContacts());
    }
    if (environment.countryCode === 'my') {
      obsList.push(this.getContacts());
    }
    if (obsList.length > 0) {
      forkJoin(obsList).subscribe(
        (res) => {
          this.isLoadingRecent = false;
        },
        (err) => {
          this.isLoadingRecent = false;
        }
      );
    }
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
    this.searchInput = this.searchInput && this.searchInput.trim() ? this.searchInput : null;
    this.contact.getCategorizedContact(this.searchInput).subscribe((contacts) => {
      const origLen = this.contacts.length;
      this.contacts = contacts;
      if (origLen != contacts.length) {
        event.target.complete();
      } else {
        event.target.disabled = true;
      }
    });
  }

  edit(contact: ContactModel) {} // TODO

  delete(contact: ContactModel) {} // TODO

  search() {
    if (this.searchInput && this.searchInput.trim()) {
      this.contact.getCategorizedContact(this.searchInput).subscribe((e) => {
        this.contacts = e;
      });
    } else {
      this.getRecentContacts();
    }
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
    this.router.navigate([`${NewLeadsRoutingKeys.BASE}/${NewLeadsRoutingKeys.OPPID}`]);
  }

  showContactList() {
    return this.searchInput || environment.countryCode === 'my';
  }
}
