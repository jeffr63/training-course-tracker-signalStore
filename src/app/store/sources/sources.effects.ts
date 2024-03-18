import { inject } from '@angular/core';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, concatMap } from 'rxjs/operators';

import { sourcesActions } from './sources.actions';
import { Source } from '@models/sources';
import { SourcesService } from '@services/sources.service';

const deleteSource$ = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(sourcesActions.deleteSource),
      switchMap(({ id }) =>
        sourcesService.delete(id).pipe(
          map(() => sourcesActions.deleteSourceSuccess({ id })),
          catchError((err) => of(sourcesActions.deleteSourceFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const getSource$ = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(sourcesActions.getSource),
      concatMap(({ id }) =>
        sourcesService.get(id).pipe(
          map((source: Source) => sourcesActions.getSourceSuccess({ source })),
          catchError((err) => of(sourcesActions.getSourceFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const loadSources$ = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(sourcesActions.loadSources),
      switchMap(() =>
        sourcesService.load().pipe(
          map((sources: Source[]) => sourcesActions.loadSourcesSuccess({ sources })),
          catchError((err) => of(sourcesActions.loadSourcesFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const saveSource$ = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(sourcesActions.saveSource),
      concatMap(({ source }) =>
        sourcesService.save(source).pipe(
          concatMap((_res) => [sourcesActions.loadSources(), sourcesActions.saveSourceSuccess({ source })]),
          catchError((err) => of(sourcesActions.saveSourceFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

export const sourcesEffects = {
  deleteSource$,
  getSource$,
  loadSources$,
  saveSource$,
};
