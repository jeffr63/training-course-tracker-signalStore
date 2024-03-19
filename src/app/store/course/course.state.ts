import { createFeature, createReducer, on } from '@ngrx/store';
import { chain, orderBy, reduce } from 'lodash';

import { coursesActions } from './course.actions';
import { Course, CourseData } from '@models/course';

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

const reducer = createReducer(
  initialState,
  on(coursesActions.deleteCourseFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(coursesActions.deleteCourseSuccess, (state) => ({
    ...state,
    error: '',
  })),
  on(coursesActions.getCourseFailure, (state, { error }) => ({
    ...state,
    currentCourse: null,
    error: error,
  })),
  on(coursesActions.getCourseSuccess, (state, { course }) => ({
    ...state,
    currentCourse: course,
    error: '',
  })),
  on(coursesActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    courses: [],
    error: error,
  })),
  on(coursesActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses: courses,
    error: '',
  })),
  on(coursesActions.saveCourseFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(coursesActions.saveCourseSuccess, (state, { course }) => ({
    ...state,
    courses: state.courses.map((item) =>
      course.id === item.id ? course : item
    ),
    error: '',
  })),
  on(coursesActions.getTotalCoursesFailure, (state, { error }) => ({
    ...state,
    totalCourses: 0,
    error: error,
  })),
  on(coursesActions.getTotalCoursesSuccess, (state, { courses }) => ({
    ...state,
    totalCourses: courses.length,
    coursesByPath: getByPathValue(courses),
    coursesBySource: getBySourceValue(courses),
    error: '',
  }))
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

export const coursesFeature = createFeature({
  name: 'courseFeature',
  reducer,
});
