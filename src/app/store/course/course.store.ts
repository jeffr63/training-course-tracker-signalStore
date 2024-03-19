import { computed, inject } from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';

import { chain, orderBy, reduce } from 'lodash';

import { initialState } from './course.state';
import { Course, CourseData } from '@models/course';
import { CoursesService } from '@shared/services/courses.service';
import { map, take, tap } from 'rxjs';

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
      loadAllCourses(): void {
        coursesService.getCourses().pipe(
          tapResponse({
            next: (courses: Course[]) => patchState(state, { courses }),
            error: (error: string) => patchState(state, { error }),
          })
        );
      },
      loadCourses(current: number, pageSize: number): void {
        coursesService.getCoursesPaged(current, pageSize).pipe(
          tapResponse({
            next: (courses: Course[]) =>
              patchState(state, { currentPage: courses }),
            error: (error: string) => patchState(state, { error }),
          })
        );
      },
    };
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
