import { inject } from '@angular/core';

import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap } from 'rxjs';

import { Path } from '@models/paths';
import { PathsService } from '@services/path/paths.service';

export interface State {
  paths: Path[];
  currentPath: Path;
  error: string;
}

const initialState: State = {
  paths: [],
  currentPath: null,
  error: '',
};

export const PathsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const pathsService = inject(PathsService);
    return {
      deletePath: rxMethod<{ id: number }>(
        pipe(
          concatMap(({ id }) => {
            return pathsService.delete(id).pipe(
              tapResponse({
                next: () => {},
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      getPath: rxMethod<number>(
        pipe(
          switchMap((id) => {
            return pathsService.get(id).pipe(
              tapResponse({
                next: (path: Path) => patchState(store, { currentPath: path }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      loadPaths: rxMethod<void>(
        pipe(
          switchMap(() => {
            return pathsService.load().pipe(
              tapResponse({
                next: (paths: Path[]) => patchState(store, { paths }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
    };
  }),
  // add second withMethods so it can call other store methods
  withMethods((store) => {
    const pathsService = inject(PathsService);
    return {
      savePath: rxMethod<{ path: Path }>(
        pipe(
          concatMap(({ path }) => {
            return pathsService.save(path).pipe(
              tapResponse({
                next: () => store.loadPaths(),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.loadPaths();
    },
  })
);
