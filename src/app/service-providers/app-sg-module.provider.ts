import { environment } from 'src/environments/environment';
import { ApiSG } from '../services/sg/api/api-sg.service';
import {
  API_SERVICE_KEY,
  NOTIFY_API_KEY,
  USER_SERVICE_KEY,
  MENU_API_KEY,
  CONTACT_SERVICE_KEY,
  CONTACT_VALIDATOR_KEY,
  DOCUMENT_SERVICE_KEY,
  OPPORTUNITY_SERVICE_KEY,
  TESTDRIVE_SERVICE_KEY,
  OFFER_SERVICE_KEY,
  TRADEIN_SERVICE_KEY,
  TASK_SERVICE_KEY,
  EVENT_SERVICE_KEY,
} from './dynamic-key.provider';
import { UserAPISG } from '../services/sg/user/user-sg.service';
import { NotificationAPISG } from '../services/sg/notification-api-sg/notification-api-sg.service';
import { MenuAPISG } from '../services/sg/menu-sg/menu-sg.service';
import { ContactServiceSG } from '../services/sg/contact-sg/contact-sg.service';
import { ContactSGValidators } from '../pages/contact/edit-contact/validators/sg/edit-contact-sg.validator';
import { DocumentServiceSG } from '../services/sg/document/document.service';
import { OpportunityServiceSG } from '../services/sg/opportunity/opportunity-sg.service';
import { TestdriveServiceSG } from '../services/sg/testdrive/testdrive.service';
import { OfferServiceSG } from '../services/sg/offer/offer.service';
import { TradeinServiceSG } from '../services/sg/tradein/tradein.service';
import { EventServiceMY } from '../services/my/event/event.service';
import { TaskServiceSG } from '../services/sg/task/task.service';
import { EventServiceSG } from '../services/sg/event/event.service';

export const SG_PROVIDERS =
  environment.countryCode === 'sg'
    ? [
        { provide: API_SERVICE_KEY, useClass: ApiSG },
        { provide: CONTACT_SERVICE_KEY, useClass: ContactServiceSG },
        { provide: DOCUMENT_SERVICE_KEY, useClass: DocumentServiceSG },
        { provide: USER_SERVICE_KEY, useClass: UserAPISG },
        { provide: CONTACT_VALIDATOR_KEY, useClass: ContactSGValidators },
        { provide: OPPORTUNITY_SERVICE_KEY, useClass: OpportunityServiceSG },
        { provide: TESTDRIVE_SERVICE_KEY, useClass: TestdriveServiceSG },
        { provide: OFFER_SERVICE_KEY, useClass: OfferServiceSG },
        { provide: TRADEIN_SERVICE_KEY, useClass: TradeinServiceSG },
        { provide: TASK_SERVICE_KEY, useClass: TaskServiceSG },
        { provide: EVENT_SERVICE_KEY, useClass: EventServiceSG },
        // { provide: VEH_API_KEY, useClass: VehicleAPIServiceSG },
        // { provide: FILE_API_KEY, useClass: FileAPISG },
        // { provide: PA_API_KEY, useClass: PASGService },
        // { provide: BIZ_ACC_API_KEY, useClass: BusinessAccountSGService },
        { provide: NOTIFY_API_KEY, useClass: NotificationAPISG },
        { provide: MENU_API_KEY, useClass: MenuAPISG },
      ]
    : [];
