import { Component, OnInit } from '@angular/core';
import { CommonUserService } from 'src/app/services/common/user/user.service';
import { UserInfo } from 'src/app/models/common/user.model';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  user: UserInfo;

  constructor(private userApi: CommonUserService) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userApi.getUserInfo('1').subscribe((e) => {
      this.user = e;
    });
  }
}
