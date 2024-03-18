import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Course } from '@models/course';

export const coursesActions = createActionGroup({
  source: 'Courses',
  events: {
    'Delete Course': props<{ id: number; current: number; pageSize: number }>(),
    'Delete Course Failure': props<{ error: string }>(),
    'Delete Course Success': emptyProps(),
    'Get Course': props<{ id: number }>(),
    'Get Course Failure': props<{ error: string }>(),
    'Get Course Success': props<{ course: Course }>(),
    'Get Total Courses': emptyProps(),
    'Get Total Courses Failure': props<{ error: string }>(),
    'Get Total Courses Success': props<{ courses: Course[] }>(),
    'Load Courses': props<{ current: number; pageSize: number }>(),
    'Load Courses Failure': props<{ error: string }>(),
    'Load Courses Success': props<{ courses: Course[] }>(),
    'Save Course': props<{ course: Course }>(),
    'Save Course Failure': props<{ error: string }>(),
    'Save Course Success': props<{ course: Course }>(),
  },
});
