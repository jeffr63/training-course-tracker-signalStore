import { createFeature, createReducer, on } from '@ngrx/store';

import { pathsActions } from './paths.actions';
import { Path } from '@models/paths';

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

const reducer = createReducer(
  initialState,
  on(pathsActions.deletePathFailure, (state, { error }) => ({
    ...state,
    currentPath: null,
    error: error,
  })),
  on(pathsActions.deletePathSuccess, (state, { id }) => ({
    ...state,
    currentPath: null,
    error: '',
    paths: state.paths.filter((path) => path.id !== id),
  })),
  on(pathsActions.getPathFailure, (state, { error }) => ({
    ...state,
    currentPath: null,
    error: error,
  })),
  on(pathsActions.getPathSuccess, (state, { path }) => ({
    ...state,
    currentPath: path,
    error: '',
  })),
  on(pathsActions.loadPathsFailure, (state, { error }) => ({
    ...state,
    paths: [],
    error: error,
  })),
  on(pathsActions.loadPathsSuccess, (state, { paths }) => ({
    ...state,
    paths: paths,
    error: '',
  })),
  on(pathsActions.savePathFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(pathsActions.savePathSuccess, (state, { path }) => ({
    ...state,
    paths: state.paths.map((item) => (path.id === item.id ? path : item)),
    currentPath: null,
    error: '',
  }))
);

export const pathsFeature = createFeature({
  name: 'pathsFeature',
  reducer,
});
