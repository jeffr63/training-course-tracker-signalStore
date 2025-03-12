import { inject } from '@angular/core';

import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap } from 'rxjs';

import { User } from '@models/user';
import { UsersService } from '@services/user/user.service';

export interface State {
  users: User[];
  currentUser: User;
  error: string;
}

const initialState: State = {
  users: [],
  currentUser: null,
  error: '',
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const usersService = inject(UsersService);
    return {
      getUser: rxMethod<number>(
        pipe(
          switchMap((id) => {
            return usersService.get(id).pipe(
              tapResponse({
                next: (user: User) => patchState(store, { currentUser: user }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      loadUsers: rxMethod<void>(
        pipe(
          switchMap(() => {
            return usersService.load().pipe(
              tapResponse({
                next: (users: User[]) => patchState(store, { users }),
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
    const usersService = inject(UsersService);
    return {
      deleteUser: rxMethod<number>(
        pipe(
          concatMap((id) => {
            return usersService.delete(id).pipe(
              tapResponse({
                next: () => store.loadUsers(),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      patchUser: rxMethod<{ id: number; user: any }>(
        pipe(
          concatMap(({ id, user }) => {
            return usersService.patch(id, user).pipe(
              tapResponse({
                next: () => store.loadUsers(),
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
      store.loadUsers();
    },
  })
);
