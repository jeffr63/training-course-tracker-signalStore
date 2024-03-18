import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Path } from '@models/paths';

export const pathsActions = createActionGroup({
  source: 'Paths',
  events: {
    'Delete Path': props<{ id: number }>(),
    'Delete Path Failure': props<{ error: string }>(),
    'Delete Path Success': props<{ id: number }>(),
    'Get Path': props<{ id: number }>(),
    'Get Path Failure': props<{ error: string }>(),
    'Get Path Success': props<{ path: Path }>(),
    'Load Paths': emptyProps(),
    'Load Paths Failure': props<{ error: string }>(),
    'Load Paths Success': props<{ paths: Path[] }>(),
    'Save Path': props<{ path: Path }>(),
    'Save Path Failure': props<{ error: string }>(),
    'Save Path Success': props<{ path: Path }>(),
  },
});
