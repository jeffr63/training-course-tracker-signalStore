import { usersActions } from './users.actions';
import { reducer } from './users.state';
import { initialState } from './users.state';
import { User } from '@models/user';

describe('Users Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('DELETE_FAIL action', () => {
    it(`should set error`, () => {
      const action = usersActions.deleteUserFailure({ error: 'Error' });
      const state = reducer(initialState, action);

      expect(state.error).toEqual('Error');
      expect(state.users).toEqual(initialState.users);
      expect(state.currentUser).toEqual(initialState.currentUser);
    });
  });

  describe('DELETE_SUCCESS action', () => {
    const beforeUsers: User[] = [
      { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' },
      { id: 2, name: 'Sam', email: 'sam@joe.com', password: 'abc', role: 'user' },
    ];
    const afterUsers: User[] = [{ id: 2, name: 'Sam', email: 'sam@joe.com', password: 'abc', role: 'user' }];
    const newState = {
      ...initialState,
      users: beforeUsers,
    };
    it(`should clear error`, () => {
      const action = usersActions.deleteUserSuccess({ id: 1 });
      const state = reducer(newState, action);

      expect(state.error).toEqual('');
      expect(state.users.length).toBe(1);
      expect(state.users).toEqual(afterUsers);
      expect(state.currentUser).toEqual(initialState.currentUser);
    });
  });

  describe('GET_FAIL action', () => {
    it(`should clear currentUser and set error`, () => {
      const newState = {
        ...initialState,
        currentUser: { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' },
      };
      const action = usersActions.getUserFailure({ error: 'Error' });
      const state = reducer(newState, action);

      expect(state.currentUser).toEqual(null);
      expect(state.error).toEqual('Error');
      expect(state.users).toEqual(newState.users);
    });
  });

  describe('GET_SUCCESS action', () => {
    it(`should clear error`, () => {
      const user = { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' };
      const action = usersActions.getUserSuccess({ user });
      const state = reducer(initialState, action);

      expect(state.currentUser).toEqual(user);
      expect(state.error).toEqual('');
      expect(state.users).toEqual(initialState.users);
    });
  });

  describe(`LOAD_FAIL action`, () => {
    it(`should clear users and set error`, () => {
      const action = usersActions.loadUsersFailure({ error: 'Error' });
      const state = reducer(initialState, action);

      expect(state.users).toEqual([]);
      expect(state.error).toEqual('Error');
    });
  });

  describe(`LOAD_SUCCESS action`, () => {
    it(`should populate users from the array and clear error`, () => {
      const users: User[] = [
        { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' },
        { id: 2, name: 'Sam', email: 'sam@joe.com', password: 'abc', role: 'user' },
      ];
      const action = usersActions.loadUsersSuccess({ users });
      const state = reducer(initialState, action);

      expect(state.users).toEqual(users);
      expect(state.error).toEqual('');
    });
  });

  describe(`PATCH_FAIL action`, () => {
    it(`should set error`, () => {
      const action = usersActions.patchUserFailure({ error: 'Error' });
      const state = reducer(initialState, action);

      expect(state.error).toEqual('Error');
      expect(state.users).toEqual(initialState.users);
      expect(state.currentUser).toEqual(initialState.currentUser);
    });
  });

  describe('PATCH action', () => {
    it(`should update users array with patched user information and clear error`, () => {
      let users = [
        { id: 1, name: 'Joe', email: 'joe@joe.com', password: 'abc', role: 'admin' },
        { id: 2, name: 'Sam', email: 'sam@joe.com', password: 'abc', role: 'user' },
      ];

      const newState = {
        ...initialState,
        users: users,
      };

      let user = users[0];
      const action = usersActions.patchUserSuccess({ user });
      const state = reducer(newState, action);

      expect(state.users).toEqual(users);
      expect(state.error).toEqual('');
      expect(state.currentUser).toEqual(newState.currentUser);
    });
  });
});
