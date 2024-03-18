import { createFeature, createReducer, on } from '@ngrx/store';

import { sourcesActions } from './sources.actions';
import { Source } from '@models/sources';

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

const reducer = createReducer(
  initialState,
  on(sourcesActions.deleteSourceFailure, (state, { error }) => ({
    ...state,
    currentSource: null,
    error: error,
  })),
  on(sourcesActions.deleteSourceSuccess, (state, { id }) => ({
    ...state,
    currentSource: null,
    error: '',
    sources: state.sources.filter((source) => source.id !== id),
  })),
  on(sourcesActions.getSourceFailure, (state, { error }) => ({
    ...state,
    currentSource: null,
    error: error,
  })),
  on(sourcesActions.getSourceSuccess, (state, { source }) => ({
    ...state,
    currentSource: source,
    error: '',
  })),
  on(sourcesActions.loadSourcesFailure, (state, { error }) => ({
    ...state,
    sources: [],
    error: error,
  })),
  on(sourcesActions.loadSourcesSuccess, (state, { sources }) => ({
    ...state,
    sources: sources,
    error: '',
  })),
  on(sourcesActions.saveSourceFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(sourcesActions.saveSourceSuccess, (state, { source }) => ({
    ...state,
    sources: state.sources.map((item) => (source.id === item.id ? source : item)),
    currentSource: null,
    error: '',
  }))
);

export const sourcesFeature = createFeature({
  name: 'sourceFeature',
  reducer,
});
