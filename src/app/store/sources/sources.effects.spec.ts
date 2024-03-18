import { of, skip, take, throwError } from 'rxjs';

import { sourcesActions } from './sources.actions';
import { sourcesEffects } from './sources.effects';
import { SourcesService } from '@services/sources.service';

const source = { id: 1, name: 'ABC' };

const sources = [
  { id: 1, name: 'ABC' },
  { id: 2, name: 'DEF' },
];

describe(`Sources Effects`, () => {
  describe(`deleteSource$ effect`, () => {
    it(`should return deleteSourcesSuccess, with id, on success`, (done) => {
      const sourceServiceMock = {
        delete: (id) => of(id),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.deleteSource({ id: 1 }));
      sourcesEffects.deleteSource$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.deleteSourceSuccess({ id: 1 }));
      });
      done();
    });

    it(`should return deleteSourceFailure, with error, on failure`, (done) => {
      const sourceServiceMock = {
        delete: (id) => throwError(() => 'Failure'),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.deleteSource({ id: 1 }));
      sourcesEffects.deleteSource$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.deleteSourceFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`getSource$ effect`, () => {
    it(`should return getSourceSuccess, with source, on success`, (done) => {
      const sourceServiceMock = {
        get: (id) => of(source),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.getSource({ id: 1 }));
      sourcesEffects.getSource$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.getSourceSuccess({ source }));
      });
      done();
    });

    it(`should return getSourceFailure, with error, on failure`, (done) => {
      const sourceServiceMock = {
        get: (id) => throwError(() => 'Failure'),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.getSource({ id: 1 }));
      sourcesEffects.getSource$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.getSourceFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`loadSources$ effect`, () => {
    it(`should return LoadSuccess, with sources, on success`, () => {
      const sourceServiceMock = {
        load: () => of(sources),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.loadSources());
      sourcesEffects.loadSources$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.loadSourcesSuccess({ sources }));
      });
    });

    it(`should return loadSourcesFailure, with error, on failure`, (done) => {
      const sourceServiceMock = {
        load: () => throwError(() => 'Failure'),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.loadSources());
      sourcesEffects.loadSources$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.loadSourcesFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`saveSource$ effect`, () => {
    it(`should return SaveSuccess, with source, on success`, (done) => {
      const sourceServiceMock = {
        save: () => of(source),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.saveSource({ source }));
      sourcesEffects
        .saveSource$(action$, sourceServiceMock)
        .pipe(take(1))
        .subscribe((action) => {
          expect(action).toEqual(sourcesActions.loadSources());
        });
      sourcesEffects
        .saveSource$(action$, sourceServiceMock)
        .pipe(skip(1))
        .subscribe((action) => {
          expect(action).toEqual(sourcesActions.saveSourceSuccess({ source }));
        });
      done();
    });

    it(`should return deleteSourceFailure, with error, on failure`, (done) => {
      const sourceServiceMock = {
        save: () => throwError(() => 'Failure'),
      } as unknown as SourcesService;
      const action$ = of(sourcesActions.saveSource({ source }));
      sourcesEffects.saveSource$(action$, sourceServiceMock).subscribe((action) => {
        expect(action).toEqual(sourcesActions.saveSourceFailure({ error: 'Failure' }));
      });
      done();
    });
  });
});
