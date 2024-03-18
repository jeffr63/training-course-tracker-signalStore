import { props, createActionGroup, emptyProps } from '@ngrx/store';

import { Source } from '@models/sources';

export const sourcesActions = createActionGroup({
  source: 'Sources',
  events: {
    'Delete Source': props<{ id: number }>(),
    'Delete Source Failure': props<{ error: string }>(),
    'Delete Source Success': props<{ id: number }>(),
    'Get Source': props<{ id: number }>(),
    'Get Source Failure': props<{ error: string }>(),
    'Get Source Success': props<{ source: Source }>(),
    'Load Sources': emptyProps(),
    'Load Sources Failure': props<{ error: string }>(),
    'Load Sources Success': props<{ sources: Source[] }>(),
    'Save Source': props<{ source: Source }>(),
    'Save Source Failure': props<{ error: string }>(),
    'Save Source Success': props<{ source: Source }>(),
  },
});
