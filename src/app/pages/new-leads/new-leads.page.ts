import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IContactValidator } from 'src/app/interfaces/contact-validator.interface';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { CONTACT_VALIDATOR_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { NewLeadsRoutingKeys } from './new-leads-routing.keys';

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.page.html',
  styleUrls: ['./new-leads.page.scss'],
})
export class NewLeadsPage implements OnInit {
  form: FormGroup;
  formErrorMessages: FormErrorMessages;
  private subs = new Subscription();
  oppId: string;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(CONTACT_VALIDATOR_KEY) private validator: IContactValidator,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.initContactForm();
  }

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    return this.route.paramMap.subscribe((params) => {
      console.log(params);
      this.oppId = params.get(NewLeadsRoutingKeys.OPPID);
    });
  }

  private initContactForm(): FormGroup {
    let contactForm = this.formBuilder.group({
      mobile: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
    this.initErrorMessages(contactForm);
    contactForm = this.validator.setMobileValidator(contactForm, this.formErrorMessages);
    return contactForm;
  }

  private initErrorMessages(form: FormGroup) {
    this.formErrorMessages = {
      group: {},
    };
    if (!form) {
      return;
    }
    for (const key of Object.keys(form.controls)) {
      switch (key) {
        case 'mobile':
        case 'name':
          this.formErrorMessages[key] = {
            required: 'Cannot be empty.',
          };
          break;
        default:
          break;
      }
    }
  }
}
