import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ContactModel } from 'src/app/models/common/contact.model';
import { ViewContactPageRoutingKeys } from 'src/app/pages/contact/view-contact/view-contact-routing.keys';
import { TradeinUpdateProfilePageRoutingKeys } from 'src/app/pages/tradein/edit-tradein/update-profile/update-profile-routing.keys';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnChanges {
  @Input() searchParam: ContactModel;
  @Input() isKeyword: boolean;
  @Input() oppId: string;
  contactList: ContactModel[];
  isLoading = false;
  countryCode = environment.countryCode;

  constructor(private contactService: CommonContactService, private navCtrl: NavController) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchParam) {
      this.searchContact();
    } else {
      this.getRecentContacts();
    }
  }

  ngOnInit() {
    this.getRecentContacts();
    console.log('bengdebug');
    console.log(this.oppId);
  }

  searchContact() {
    this.contactList = [];
    this.isLoading = true;
    if (this.isKeyword) {
      this.contactService.searchContactByKeyword(this.searchParam.Name).subscribe(
        (e) => {
          this.contactList = e;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    } else {
      this.contactService.searchByPhoneAndName(this.searchParam.MobileNo, this.searchParam.Name).subscribe(
        (e) => {
          this.contactList = e;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    }
  }

  getRecentContacts() {
    this.contactList = [];
    this.isLoading = true;
    this.contactService.getRecentContacts().subscribe(
      (e) => {
        this.contactList = e;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  viewContact(item: ContactModel) {
    if (this.oppId === 'oppId') {
      this.navCtrl.navigateForward(ViewContactPageRoutingKeys.BASE + '/' + item.Id);
    } else {
      this.navCtrl.navigateForward([`${TradeinUpdateProfilePageRoutingKeys.BASE}/${this.oppId}/${item.Id}`]);
    }
  }

  getFavIcon(item: ContactModel) {
    if (item.Flag) {
      return 'heart';
    } else {
      return 'heart-outline';
    }
  }
}
