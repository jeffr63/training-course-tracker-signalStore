import { ApplicationConfig } from '@angular/core';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { provideStoreDevtools } from '@ngrx/store-devtools';

import { APP_ROUTES } from './app.routes';
import { CustomTitleStrategyService } from '@resolvers/custom-title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    provideAnimations(),
    provideHttpClient(),
    provideStoreDevtools({
      maxAge: 5,
      logOnly: environment.production,
      connectInZone: true,
    }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
  ],
};
