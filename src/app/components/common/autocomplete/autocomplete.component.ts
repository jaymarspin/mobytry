import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AutoCompleteModel } from 'src/app/models/common/auto-complete.model';
import { ErrorService } from 'src/app/services/common/error/error.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @Input() callbackFn: (param?: string) => Observable<any[]>;
  @Input() transformFn: (val: any) => AutoCompleteModel;
  @Input() noResultFn: (searchStr: string) => void;
  @Input() searchType: string;
  @Input() searchInput: string;
  @Output() selectedResult = new EventEmitter<any>();
  public searchResult: Array<AutoCompleteModel>;
  public rawResult: Array<any>;

  private searchSubj = new Subject<string>();
  isLoading = false;

  constructor(private modalCtrl: ModalController, private errService: ErrorService) {}

  ngOnInit() {
    if (!this.callbackFn) {
      return;
    }
    this.searchSubj
      .asObservable()
      .pipe(
        switchMap((key) => {
          return this.callbackFn(key).pipe(tap((e) => console.log(e)));
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.rawResult = res;
          this.searchResult = res.map(this.transformFn);
        },
        (err) => {
          this.isLoading = false;
          this.errService.logError(err);
        }
      );
    this.getData('');
  }

  ngAfterViewInit() {}

  dismiss(paramInd?: number) {
    if (paramInd != null && paramInd >= 0 && paramInd < this.rawResult.length) {
      const result = this.rawResult[paramInd];
      this.selectedResult.emit(result);
      this.modalCtrl.dismiss(result);
    } else {
      this.modalCtrl.dismiss();
    }
  }

  search() {
    if (this.searchInput && this.searchInput.trim()) {
      this.searchInput = this.searchInput.trim();
      this.getData(this.searchInput);
    }
  }

  notFound() {
    this.noResultFn(this.searchInput);
    this.dismiss();
  }

  getData(key?: string) {
    this.isLoading = true;
    this.searchSubj.next(key);
  }

  onBlur() {
    if (!this.searchInput || this.searchInput.trim() === '') {
      this.dismiss();
    }
  }
}
