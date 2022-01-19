import { environment } from 'src/environments/environment';
import { ApiMY } from '../services/my/api/api-my.service';
import {
  API_SERVICE_KEY,
  USER_SERVICE_KEY,
  NOTIFY_API_KEY,
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
import { UserAPIMY } from '../services/my/user/user-my.service';
import { NotificationAPIMY } from '../services/my/notification-api-my/notification-api-my.service';
import { MenuAPIMY } from '../services/my/menu-my/menu-my.service';
import { ContactServiceMY } from '../services/my/contact-my/contact-my.service';
import { ContactMYValidators } from '../pages/contact/edit-contact/validators/my/edit-contact-my.validator';
import { DocumentServiceMY } from '../services/my/document/document.service';
import { OpportunityServiceMY } from '../services/my/opportunity/opportunity-my.service';
import { TestdriveServiceMY } from '../services/my/testdrive/testdrive.service';
import { OfferServiceMY } from '../services/my/offer/offer.service';
import { TradeinServiceMY } from '../services/my/tradein/tradein.service';
import { EventServiceMY } from '../services/my/event/event.service';
import { TaskServiceMY } from '../services/my/task/task.service';

export const MY_PROVIDERS =
  environment.countryCode === 'my'
    ? [
        { provide: API_SERVICE_KEY, useClass: ApiMY },
        { provide: CONTACT_SERVICE_KEY, useClass: ContactServiceMY },
        { provide: DOCUMENT_SERVICE_KEY, useClass: DocumentServiceMY },
        { provide: USER_SERVICE_KEY, useClass: UserAPIMY },
        { provide: CONTACT_VALIDATOR_KEY, useClass: ContactMYValidators },
        { provide: OPPORTUNITY_SERVICE_KEY, useClass: OpportunityServiceMY },
        { provide: TESTDRIVE_SERVICE_KEY, useClass: TestdriveServiceMY },
        { provide: OFFER_SERVICE_KEY, useClass: OfferServiceMY },
        { provide: TRADEIN_SERVICE_KEY, useClass: TradeinServiceMY },
        { provide: TASK_SERVICE_KEY, useClass: TaskServiceMY },
        { provide: EVENT_SERVICE_KEY, useClass: EventServiceMY },
        //   { provide: VEH_API_KEY, useClass: VehicleAPIServiceMY },
        //   { provide: FILE_API_KEY, useClass: FileAPIMY },
        //   { provide: PA_API_KEY, useClass: PAMYService },
        { provide: NOTIFY_API_KEY, useClass: NotificationAPIMY },
        { provide: MENU_API_KEY, useClass: MenuAPIMY },
      ]
    : [];
