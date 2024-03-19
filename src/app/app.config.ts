import { ApplicationConfig } from '@angular/core';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { APP_ROUTES } from './app.routes';
import { CustomTitleStrategyService } from '@resolvers/custom-title-strategy.service';
import { pathsEffects } from '@store/paths/paths.effects';
import { pathsFeature } from '@store/paths/paths.state';
import { sourcesEffects } from '@store/sources/sources.effects';
import { sourcesFeature } from '@store/sources/sources.state';
import { usersEffects } from '@store/users/users.effects';
import { usersFeature } from '@store/users/users.state';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    provideAnimations(),
    provideHttpClient(),
    provideStore(),
    provideState(pathsFeature),
    provideState(sourcesFeature),
    provideState(usersFeature),
    provideEffects([pathsEffects, sourcesEffects, usersEffects]),
    provideStoreDevtools({
      maxAge: 5,
      logOnly: environment.production,
      connectInZone: true,
    }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
  ],
};
