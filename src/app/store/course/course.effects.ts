import { inject } from '@angular/core';

import { of } from 'rxjs';
import { map, catchError, concatMap } from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { coursesActions } from './course.actions';
import { Course } from '@models/course';
import { CoursesService } from '@services/courses.service';

const deleteCourse$ = createEffect(
  (actions$ = inject(Actions), courseService = inject(CoursesService)) => {
    return actions$.pipe(
      ofType(coursesActions.deleteCourse),
      concatMap(({ id, current, pageSize }) =>
        courseService.deleteCourse(id).pipe(
          concatMap((_res) => [
            coursesActions.loadCourses({ current, pageSize }),
            coursesActions.getTotalCourses(),
            coursesActions.deleteCourseSuccess(),
          ]),
          catchError((err) => of(coursesActions.deleteCourseFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const getCourse$ = createEffect(
  (actions$ = inject(Actions), courseService = inject(CoursesService)) => {
    return actions$.pipe(
      ofType(coursesActions.getCourse),
      concatMap(({ id }) =>
        courseService.getCourse(id).pipe(
          map((course: Course) => coursesActions.getCourseSuccess({ course })),
          catchError((err) => of(coursesActions.getCourseFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const loadCourses$ = createEffect(
  (actions$ = inject(Actions), courseService = inject(CoursesService)) => {
    return actions$.pipe(
      ofType(coursesActions.loadCourses),
      concatMap(({ current, pageSize }) =>
        courseService.getCoursesPaged(current, pageSize).pipe(
          map((courses: Course[]) => coursesActions.loadCoursesSuccess({ courses })),
          catchError((err) => of(coursesActions.loadCoursesFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const saveCourse$ = createEffect(
  (actions$ = inject(Actions), courseService = inject(CoursesService)) => {
    return actions$.pipe(
      ofType(coursesActions.saveCourse),
      concatMap(({ course }) =>
        courseService.saveCourse(course).pipe(
          concatMap((_res) => [coursesActions.getTotalCourses(), coursesActions.saveCourseSuccess({ course })]),
          catchError((err) => of(coursesActions.saveCourseFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

const totalCourses$ = createEffect(
  (actions$ = inject(Actions), courseService = inject(CoursesService)) => {
    return actions$.pipe(
      ofType(coursesActions.getTotalCourses),
      concatMap(() =>
        courseService.getCourses().pipe(
          map((courses: Course[]) => coursesActions.getTotalCoursesSuccess({ courses })),
          catchError((err) => of(coursesActions.getTotalCoursesFailure({ error: err })))
        )
      )
    );
  },
  { functional: true }
);

export const courseEffects = {
  deleteCourse$,
  getCourse$,
  loadCourses$,
  saveCourse$,
  totalCourses$,
};
