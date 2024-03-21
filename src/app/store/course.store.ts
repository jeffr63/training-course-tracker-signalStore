import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

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
  currentCourse: { id: 0, title: '', instructor: '', path: '' } as Course,
  error: '',
};

export const CoursesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const getByValue = (courses: Course[], groupBy: string): CourseData[] => {
      let byPath = chain(courses)
        .groupBy(groupBy)
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
    };

    return {
      totalCourses: computed(() => store.courses().length),
      coursesByPath: computed(() => getByValue(store.courses(), 'path')),
      coursesBySource: computed(() => getByValue(store.courses(), 'source')),
    };
  }),
  withMethods((store) => {
    const coursesService = inject(CoursesService);
    return {
      getCourse: rxMethod<number>(
        pipe(
          switchMap((id) => {
            return coursesService.getCourse(id).pipe(
              tapResponse({
                next: (course: Course) => patchState(store, { currentCourse: course }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      loadAllCourses: rxMethod<void>(
        pipe(
          switchMap(() => {
            return coursesService.getCourses().pipe(
              tapResponse({
                next: (courses: Course[]) => patchState(store, { courses }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      loadCourses: rxMethod<{ current: number; pageSize: number }>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(({ current, pageSize }) => {
            return coursesService.getCoursesPaged(current, pageSize).pipe(
              tapResponse({
                next: (courses: Course[]) => patchState(store, { currentPage: courses }),
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
    };
  }),
  // add second withMethods so it can call other store methods
  withMethods((store) => {
    const coursesService = inject(CoursesService);

    return {
      deleteCourse: rxMethod<{ id: number; current: number; pageSize: number }>(
        pipe(
          concatMap(({ id, current, pageSize }) => {
            return coursesService.deleteCourse(id).pipe(
              tapResponse({
                next: () => {
                  store.loadAllCourses();
                  store.loadCourses({ current, pageSize });
                },
                error: (error: string) => patchState(store, { error }),
              })
            );
          })
        )
      ),
      saveCourse: rxMethod<{ course: Course }>(
        pipe(
          concatMap(({ course }) => {
            return coursesService.saveCourse(course).pipe(
              tapResponse({
                next: () => store.loadAllCourses(),
                error: (error: string) => patchState(store, { error }),
              })
            );
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
