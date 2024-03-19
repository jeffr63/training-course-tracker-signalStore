import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap } from 'rxjs';

import { chain, orderBy, reduce } from 'lodash';

import { Course, CourseData } from '@models/course';
import { CoursesService } from '@shared/services/courses.service';

export interface State {
  courses: Course[];
  currentPage: Course[];
  currentCourse: Course;
  error: string;
}

export const initialState: State = {
  courses: [],
  currentPage: [],
  currentCourse: null,
  error: '',
};

export const CoursesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ courses }) => {
    return {
      totalCourses: computed(() => courses().length),
      coursesByPath: computed(() => getByPathValue(courses())),
      coursesBySource: computed(() => getBySourceValue(courses())),
    };
  }),
  withMethods((state) => {
    const coursesService = inject(CoursesService);
    return {
      getCourse: rxMethod<number>(
        pipe(
          switchMap((id) => coursesService.getCourse(id)),
          tapResponse({
            next: (course: Course) => patchState(state, { currentCourse: course }),
            error: (error: string) => patchState(state, { error }),
          })
        )
      ),
      loadAllCourses: rxMethod<void>(
        pipe(
          switchMap(() => coursesService.getCourses()),
          tapResponse({
            next: (courses: Course[]) => patchState(state, { courses }),
            error: (error: string) => patchState(state, { error }),
          })
        )
      ),
      loadCourses: rxMethod<{ current: number; pageSize: number }>(
        pipe(
          switchMap(({ current, pageSize }) => coursesService.getCoursesPaged(current, pageSize)),
          tapResponse({
            next: (courses: Course[]) => patchState(state, { currentPage: courses }),
            error: (error: string) => patchState(state, { error }),
          })
        )
      ),
    };
  }),
  // add second withMethods so it can call other store methods
  withMethods((state) => {
    const coursesService = inject(CoursesService);
    return {
      deleteCourse: rxMethod<{ id: number; current: number; pageSize: number }>(
        pipe(
          concatMap(({ id }) => coursesService.deleteCourse(id)),
          tapResponse({
            next: ({ current, pageSize }) => {
              state.loadAllCourses();
              state.loadCourses({ current, pageSize });
            },
            error: (error: string) => patchState(state, { error }),
          })
        )
      ),
      saveCourse: rxMethod<{ course: Course }>(
        pipe(
          concatMap(({ course }) => coursesService.saveCourse(course)),
          tapResponse({
            next: () => state.loadAllCourses(),
            error: (error: string) => patchState(state, { error }),
          })
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.loadAllCourses();
    },
  })
);

function getByPathValue(courses: Course[]): CourseData[] {
  let byPath = chain(courses)
    .groupBy('path')
    .map((values, key) => {
      return {
        name: key,
        value: reduce(
          values,
          function (value, number) {
            return value + 1;
          },
          0
        ),
      };
    })
    .value();
  byPath = orderBy(byPath, 'value', 'desc');
  return byPath;
}

function getBySourceValue(course: Course[]): CourseData[] {
  let bySource = chain(course)
    .groupBy('source')
    .map((values, key) => {
      return {
        name: key,
        value: reduce(
          values,
          function (value, number) {
            return value + 1;
          },
          0
        ),
      };
    })
    .value();
  bySource = orderBy(bySource, 'value', 'desc');
  return bySource;
}
