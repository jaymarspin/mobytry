import { Component, OnInit } from '@angular/core';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { MenuService } from 'src/app/services/common/menu/menu.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  languages: SelectOption[];
  prefLang = 'English';

  constructor(private menu: MenuService) {}

  ngOnInit() {
    this.languages = this.menu.getLanguages();
  }
}
