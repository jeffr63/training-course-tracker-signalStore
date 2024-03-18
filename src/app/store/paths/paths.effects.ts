import { inject } from '@angular/core';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, concatMap } from 'rxjs/operators';

import { pathsActions } from './paths.actions';
import { Path } from '@models/paths';
import { PathsService } from '@services/paths.service';

const deletePath$ = createEffect(
  (actions$ = inject(Actions), pathsService = inject(PathsService)) => {
    return actions$.pipe(
      ofType(pathsActions.deletePath),
      switchMap(({ id }) =>
        pathsService.delete(id).pipe(
          map(() => pathsActions.deletePathSuccess({ id })),
          catchError((err) => of(pathsActions.deletePathFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const getPath$ = createEffect(
  (actions$ = inject(Actions), pathsService = inject(PathsService)) => {
    return actions$.pipe(
      ofType(pathsActions.getPath),
      concatMap(({ id }) =>
        pathsService.get(id).pipe(
          map((path: Path) => pathsActions.getPathSuccess({ path })),
          catchError((err) => of(pathsActions.getPathFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const loadPaths$ = createEffect(
  (actions$ = inject(Actions), pathsService = inject(PathsService)) => {
    return actions$.pipe(
      ofType(pathsActions.loadPaths),
      switchMap(() =>
        pathsService.load().pipe(
          map((paths: any[]) => pathsActions.loadPathsSuccess({ paths: paths })),
          catchError((err) => of(pathsActions.loadPathsFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const savePath$ = createEffect(
  (actions$ = inject(Actions), pathsService = inject(PathsService)) => {
    return actions$.pipe(
      ofType(pathsActions.savePath),
      concatMap(({ path }) =>
        pathsService.save(path).pipe(
          concatMap((path: Path) => [pathsActions.loadPaths(), pathsActions.savePathSuccess({ path: path })]),
          catchError((err) => of(pathsActions.savePathFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

export const pathsEffects = {
  deletePath$,
  getPath$,
  loadPaths$,
  savePath$,
};
