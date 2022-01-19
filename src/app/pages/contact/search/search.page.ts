import { Component, OnInit } from '@angular/core';
import { ContactModel } from 'src/app/models/common/contact.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchInput: string;
  contact: ContactModel;

  constructor() {}

  ngOnInit() {}

  search() {
    if (!this.searchInput) {
      this.contact = null;
    } else {
      this.contact = new ContactModel();
      this.contact.Name = this.searchInput;
      // this.contact.Name = this.form.get('name').value;
      // this.contact.MobileNo = this.form.get('mobile').value;
    }
  }
}
