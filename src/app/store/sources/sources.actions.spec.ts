import { sourcesActions } from './sources.actions';

describe('Sources Actions', () => {
  describe('Delete Source', () => {
    it(`should create an action`, () => {
      const id = 1;
      const action = sourcesActions.deleteSource({ id });

      expect({ ...action }).toEqual({
        type: '[Sources] Delete Source',
        id,
      });
    });
  });

  describe('DeleteSourceFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = sourcesActions.deleteSourceFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Sources] Delete Source Failure',
        error,
      });
    });
  });

  describe('DeleteSourceSuccess', () => {
    it(`should create an action`, () => {
      const id = 1;
      const action = sourcesActions.deleteSourceSuccess({ id });

      expect({ ...action }).toEqual({
        type: '[Sources] Delete Source Success',
        id,
      });
    });
  });

  describe('GetSource', () => {
    it(`should create an action`, () => {
      const id = 1;
      const action = sourcesActions.getSource({ id });

      expect({ ...action }).toEqual({
        type: '[Sources] Get Source',
        id,
      });
    });
  });

  describe('GetSourceFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = sourcesActions.getSourceFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Sources] Get Source Failure',
        error,
      });
    });
  });

  describe('GetSourceSuccess', () => {
    it(`should create an action`, () => {
      const source = { id: 1, name: 'ABC' };
      const action = sourcesActions.getSourceSuccess({ source });

      expect({ ...action }).toEqual({
        type: '[Sources] Get Source Success',
        source,
      });
    });
  });

  describe('LoadSources', () => {
    it(`should create an action`, () => {
      const action = sourcesActions.loadSources();

      expect({ ...action }).toEqual({
        type: '[Sources] Load Sources',
      });
    });
  });

  describe('LoadSourceFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = sourcesActions.loadSourcesFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Sources] Load Sources Failure',
        error,
      });
    });
  });

  describe('LoadSourcesSuccess', () => {
    it(`should create an action`, () => {
      const sources = [
        { id: 1, name: 'ABC' },
        { id: 2, name: 'DEF' },
      ];
      const action = sourcesActions.loadSourcesSuccess({ sources });

      expect({ ...action }).toEqual({
        type: '[Sources] Load Sources Success',
        sources,
      });
    });
  });

  describe('SaveSource', () => {
    it(`should create an action`, () => {
      const source = { id: 1, name: 'ABC' };
      const action = sourcesActions.saveSource({ source });

      expect({ ...action }).toEqual({
        type: '[Sources] Save Source',
        source,
      });
    });
  });

  describe('SaveSourceFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = sourcesActions.saveSourceFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Sources] Save Source Failure',
        error,
      });
    });
  });

  describe('SaveSourceSuccess', () => {
    it(`should create an action`, () => {
      const source = { id: 1, name: 'ABC' };
      const action = sourcesActions.saveSourceSuccess({ source });

      expect({ ...action }).toEqual({
        type: '[Sources] Save Source Success',
        source,
      });
    });
  });
});
