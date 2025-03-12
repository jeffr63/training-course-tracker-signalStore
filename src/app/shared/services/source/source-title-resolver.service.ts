import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { SourcesService } from '@services/source/sources.service';

export const sourceNameResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Source';
  } else {
    return inject(SourcesService)
      .get(id)
      .pipe(map((source) => source.name));
  }
};
