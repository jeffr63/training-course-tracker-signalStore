import { inject } from '@angular/core';

import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap } from 'rxjs';

import { Source } from '@models/sources';
import { SourcesService } from '@services/source/sources.service';

export interface State {
  sources: Source[];
  currentSource: Source;
  error: string;
}

const initialState: State = {
  sources: [],
  currentSource: null,
  error: '',
};

export const SourcesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const sourcesService = inject(SourcesService);
    return {
      getSource: rxMethod<number>(
        pipe(
          switchMap((id) => {
            return sourcesService.get(id).pipe(
              tapResponse({
                next: (source: Source) => patchState(store, { currentSource: source }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      loadSources: rxMethod<void>(
        pipe(
          switchMap(() => {
            return sourcesService.load().pipe(
              tapResponse({
                next: (sources: Source[]) => patchState(store, { sources }),
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
    const sourcesService = inject(SourcesService);
    return {
      deleteSource: rxMethod<{ id: number }>(
        pipe(
          concatMap((id) => {
            return sourcesService.delete(id).pipe(
              tapResponse({
                next: () => store.loadSources(),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      saveSource: rxMethod<{ source: Source }>(
        pipe(
          concatMap(({ source }) => {
            return sourcesService.save(source).pipe(
              tapResponse({
                next: () => store.loadSources(),
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
      store.loadSources();
    },
  })
);
