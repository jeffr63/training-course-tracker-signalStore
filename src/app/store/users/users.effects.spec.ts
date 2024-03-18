import { of, skip, take, throwError } from 'rxjs';

import { usersActions } from './users.actions';
import { usersEffects } from './users.effects';
import { UsersService } from '@services/user.service';
import { User } from '@models/user';

const user = { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' };

const users: User[] = [
  { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' },
  { id: 2, name: 'Sam', email: 'sam@joe.com', password: 'abc', role: 'user' },
];

describe(`Users Effects`, () => {
  describe(`deleteUser$ effect`, () => {
    it(`should return deleteUserSuccess, with id, on success`, (done) => {
      const userServiceMock = {
        delete: (id) => of(id),
      } as unknown as UsersService;
      const action$ = of(usersActions.deleteUser({ id: 1 }));
      usersEffects.deleteUser$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.deleteUserSuccess({ id: 1 }));
      });
      done();
    });

    it(`should return deleteUserFailure, with error, on failure`, (done) => {
      const userServiceMock = {
        delete: (id) => throwError(() => 'Failure'),
      } as unknown as UsersService;
      const action$ = of(usersActions.deleteUser({ id: 1 }));
      usersEffects.deleteUser$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.deleteUserFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`getUser$ effect`, () => {
    it(`should return getUserSuccess, with user, on success`, (done) => {
      const userServiceMock = {
        get: (id) => of(user),
      } as unknown as UsersService;
      const action$ = of(usersActions.getUser({ id: 1 }));
      usersEffects.getUser$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.getUserSuccess({ user }));
      });
      done();
    });

    it(`should return getUserFailure, with error, on failure`, (done) => {
      const userServiceMock = {
        get: (id) => throwError(() => 'Failure'),
      } as unknown as UsersService;
      const action$ = of(usersActions.getUser({ id: 1 }));
      usersEffects.getUser$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.getUserFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`loadUsers$ effect`, () => {
    it(`should return loadUsersSuccess, with sources, on success`, () => {
      const userServiceMock = {
        load: () => of(users),
      } as unknown as UsersService;
      const action$ = of(usersActions.loadUsers());
      usersEffects.loadUsers$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.loadUsersSuccess({ users }));
      });
    });

    it(`should return loadUserFailure, with error, on failure`, (done) => {
      const userServiceMock = {
        load: () => throwError(() => 'Failure'),
      } as unknown as UsersService;
      const action$ = of(usersActions.loadUsers());
      usersEffects.loadUsers$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.loadUsersFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`patchUser$ effect`, () => {
    it(`should return patchUsersSuccess, with user, on success`, (done) => {
      const userServiceMock = {
        patch: () => of(user),
      } as unknown as UsersService;
      const action$ = of(usersActions.patchUser({ id: 1, user }));
      usersEffects
        .patchUser$(action$, userServiceMock)
        .pipe(take(1))
        .subscribe((action) => {
          expect(action).toEqual(usersActions.loadUsers());
        });
      usersEffects
        .patchUser$(action$, userServiceMock)
        .pipe(skip(1))
        .subscribe((action) => {
          expect(action).toEqual(usersActions.patchUserSuccess({ user }));
        });
      done();
    });

    it(`should return patchUserFailure, with error, on failure`, (done) => {
      const userServiceMock = {
        patch: () => throwError(() => 'Failure'),
      } as unknown as UsersService;
      const action$ = of(usersActions.patchUser({ id: 1, user }));
      usersEffects.patchUser$(action$, userServiceMock).subscribe((action) => {
        expect(action).toEqual(usersActions.patchUserFailure({ error: 'Failure' }));
      });
      done();
    });
  });
});
