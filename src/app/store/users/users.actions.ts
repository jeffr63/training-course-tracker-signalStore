import { props, emptyProps, createActionGroup } from '@ngrx/store';

import { User } from '@models/user';

export const usersActions = createActionGroup({
  source: 'Users',
  events: {
    'Delete User': props<{ id: number }>(),
    'Delete User Failure': props<{ error: string }>(),
    'Delete User Success': props<{ id: number }>(),
    'Get User': props<{ id: number }>(),
    'Get User Failure': props<{ error: string }>(),
    'Get User Success': props<{ user: User }>(),
    'Load Users': emptyProps(),
    'Load Users Failure': props<{ error: string }>(),
    'Load Users Success': props<{ users: User[] }>(),
    'Patch User': props<{ id: number; user: any }>(),
    'Patch User Failure': props<{ error: string }>(),
    'Patch User Success': props<{ user: User }>(),
  },
});
