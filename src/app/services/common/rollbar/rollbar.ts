import * as Rollbar from 'rollbar';  
import { environment } from 'src/environments/environment';
import {
  Injectable,
  Inject,
  InjectionToken,
  ErrorHandler
} from '@angular/core'; 
const rollbarConfig = {
  accessToken: environment.rollbarAccessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        guess_uncaught_frames: true,
        code_version: '3'
        
      }
    }
  } 
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {
    
  }

  handleError(err:any) : void {
    // this.rollbar.error(err)
    // this.rollbar.error(new Error(err.message).stack);
    // this.rollbar.log(new Error(err).toString());
    this.rollbar.log(new Error(err).stack)
    // this.rollbar.debug(err)
    7
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}