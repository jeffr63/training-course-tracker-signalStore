import { createFeature, createReducer, on } from '@ngrx/store';

import { usersActions } from './users.actions';
import { User } from '@models/user';

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

const reducer = createReducer(
  initialState,
  on(usersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    currentUser: null,
    error: error,
  })),
  on(usersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    currentUser: null,
    error: '',
    users: state.users.filter((user) => user.id !== id),
  })),
  on(usersActions.getUserFailure, (state, { error }) => ({
    ...state,
    currentUser: null,
    error: error,
  })),
  on(usersActions.getUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    error: '',
  })),
  on(usersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    users: [],
    error: error,
  })),
  on(usersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users,
    error: '',
  })),
  on(usersActions.patchUserFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(usersActions.patchUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((item) => (user.id === item.id ? user : item)),
    currentSource: null,
    error: '',
  }))
);

export const usersFeature = createFeature({
  name: 'usersFeature',
  reducer,
});
