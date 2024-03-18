import { inject } from '@angular/core';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, concatMap } from 'rxjs/operators';

import { usersActions } from './users.actions';
import { User } from '@models/user';
import { UsersService } from '@services/user.service';

const deleteUser$ = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(usersActions.deleteUser),
      switchMap(({ id }) =>
        usersService.delete(id).pipe(
          map(() => usersActions.deleteUserSuccess({ id })),
          catchError((err) => of(usersActions.deleteUserFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const getUser$ = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(usersActions.getUser),
      concatMap(({ id }) =>
        usersService.get(id).pipe(
          map((user: User) => usersActions.getUserSuccess({ user })),
          catchError((err) => of(usersActions.getUserFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const loadUsers$ = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(usersActions.loadUsers),
      switchMap(() =>
        usersService.load().pipe(
          map((users: User[]) => usersActions.loadUsersSuccess({ users })),
          catchError((err) => of(usersActions.loadUsersFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const patchUser$ = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(usersActions.patchUser),
      concatMap(({ id, user }) =>
        usersService.patch(id, user).pipe(
          concatMap((res) => [usersActions.loadUsers(), usersActions.patchUserSuccess({ user: res })]),
          catchError((err) => of(usersActions.patchUserFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

export const usersEffects = {
  deleteUser$,
  getUser$,
  loadUsers$,
  patchUser$,
};
