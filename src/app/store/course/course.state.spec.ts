import { coursesActions } from '@store/course/course.actions';
import { reducer, initialState } from '@store/course/course.state';

import { Course } from '@models/course';

describe('Courses Reducer', () => {
  it('should return state when passed an undefined action', () => {
    const action = {} as any;
    const state = reducer(undefined, action);

    expect(state).toBe(initialState);
  });

  describe('COURSE_FAIL action', () => {
    it(`should clear currentCourse and set error`, () => {
      const newState = {
        ...initialState,
        currentCourse: { id: 1, title: 'Course 1', instructor: 'Joe', path: 'A', source: 'B' },
      };
      const action = coursesActions.getCourseFailure({ error: 'Error' });
      const state = reducer(newState, action);

      expect(state.currentCourse).toEqual(null);
      expect(state.error).toEqual('Error');
      expect(state.courses).toEqual(newState.courses);
      expect(state.totalCourses).toEqual(newState.totalCourses);
    });
  });

  describe('COURSE_SUCCESS action', () => {
    it(`should clear error`, () => {
      const course = { id: 1, title: 'Course 1', instructor: 'Joe', path: 'A', source: 'B' };
      const action = coursesActions.getCourseSuccess({ course });
      const state = reducer(initialState, action);

      expect(state.currentCourse).toEqual(course);
      expect(state.error).toEqual('');
      expect(state.courses).toEqual(initialState.courses);
      expect(state.totalCourses).toEqual(initialState.totalCourses);
    });
  });

  describe('DELETE_FAIL action', () => {
    it(`should set error`, () => {
      const action = coursesActions.deleteCourseFailure({ error: 'Error' });
      const state = reducer(initialState, action);

      expect(state.error).toEqual('Error');
      expect(state.courses).toEqual(initialState.courses);
      expect(state.currentCourse).toEqual(initialState.currentCourse);
      expect(state.totalCourses).toEqual(initialState.totalCourses);
    });
  });

  describe('DELETE_SUCCESS action', () => {
    it(`should clear error`, () => {
      const action = coursesActions.deleteCourseSuccess();
      const state = reducer(initialState, action);

      expect(state.error).toEqual('');
      expect(state.courses).toEqual(initialState.courses);
      expect(state.currentCourse).toEqual(initialState.currentCourse);
      expect(state.totalCourses).toEqual(initialState.totalCourses);
    });
  });

  describe('LOAD_FAIL action', () => {
    it(`should populate courses from the array and clear error`, () => {
      const action = coursesActions.loadCoursesFailure({ error: 'Error' });
      const state = reducer(initialState, action);

      expect(state.courses).toEqual([]);
      expect(state.error).toEqual('Error');
      expect(state.currentCourse).toEqual(initialState.currentCourse);
      expect(state.totalCourses).toEqual(initialState.totalCourses);
    });
  });

  describe('LOAD_SUCCESS action', () => {
    it(`should populate courses from the array`, () => {
      const courses: Course[] = [
        { id: 1, title: 'Course 1', instructor: 'Joe', path: 'A', source: 'B' },
        { id: 2, title: 'Course 2', instructor: 'Jack', path: 'C', source: 'D' },
      ];
      const action = coursesActions.loadCoursesSuccess({ courses });
      const state = reducer(initialState, action);

      expect(state.courses).toEqual(courses);
      expect(state.error).toEqual('');
      expect(state.currentCourse).toEqual(initialState.currentCourse);
      expect(state.totalCourses).toEqual(initialState.totalCourses);
    });
  });

  describe(`SAVE_FAIL action`, () => {
    it(`should set error`, () => {
      const action = coursesActions.saveCourseFailure({ error: 'Error' });
      const state = reducer(initialState, action);

      expect(state.error).toEqual('Error');
      expect(state.courses).toEqual(initialState.courses);
      expect(state.currentCourse).toEqual(initialState.currentCourse);
      expect(state.totalCourses).toEqual(initialState.totalCourses);
    });
  });

  describe('SAVE action', () => {
    it(`should update courses array with saved course information and clear error`, () => {
      const newState = {
        ...initialState,
        courses: [
          { id: 1, title: 'Course 1', instructor: 'Joe', path: 'A', source: 'B' },
          { id: 2, title: 'Course 2', instructor: 'Jack', path: 'C', source: 'D' },
        ],
      };
      const course = { id: 2, title: 'Update Course 2', instructor: 'John', path: 'A', source: 'D' };
      const action = coursesActions.saveCourseSuccess({ course });
      const state = reducer(newState, action);

      expect(state.courses[0]).toEqual(newState.courses[0]);
      expect(state.courses[1]).toEqual(course);
      expect(state.error).toEqual('');
      expect(state.currentCourse).toEqual(newState.currentCourse);
      expect(state.totalCourses).toEqual(newState.totalCourses);
    });
  });

  describe('TOTAL_FAIL action', () => {
    it(`should set totalCourses to 0 and set error`, () => {
      const newState = {
        ...initialState,
        totalCourses: 10,
      };
      const action = coursesActions.getTotalCoursesFailure({ error: 'Error' });
      const state = reducer(newState, action);

      expect(state.totalCourses).toBe(0);
      expect(state.error).toEqual('Error');
      expect(state.courses).toEqual(newState.courses);
      expect(state.currentCourse).toEqual(null);
    });
  });

  describe('TOTAL_SUCCESS action', () => {
    it(`should set totalCourses and clear error`, () => {
      const courses: Course[] = [
        { id: 1, title: 'Course 1', instructor: 'Joe', path: 'A', source: 'B' },
        { id: 2, title: 'Course 2', instructor: 'Jack', path: 'C', source: 'D' },
      ];
      const action = coursesActions.getTotalCoursesSuccess({ courses });
      const state = reducer(initialState, action);

      expect(state.totalCourses).toEqual(2);
      expect(state.error).toEqual('');
      expect(state.courses).toEqual(initialState.courses);
      expect(state.currentCourse).toEqual(initialState.currentCourse);
    });
  });
});
