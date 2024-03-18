import { coursesActions } from './course.actions';

describe('Courses Actions', () => {
  describe('DeleteCourse', () => {
    it(`should create an action`, () => {
      const id = 1;
      const current = 1;
      const pageSize = 3;
      const action = coursesActions.deleteCourse({ id, current, pageSize });

      expect({ ...action }).toEqual({
        type: '[Courses] Delete Course',
        id,
        current,
        pageSize,
      });
    });
  });

  describe('DeleteCourseFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = coursesActions.deleteCourseFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Courses] Delete Course Failure',
        error,
      });
    });
  });

  describe('DeleteCourseSuccess', () => {
    it(`should create an action`, () => {
      const action = coursesActions.deleteCourseSuccess();

      expect({ ...action }).toEqual({
        type: '[Courses] Delete Course Success',
      });
    });
  });

  describe('GetCourse', () => {
    it(`should create an action`, () => {
      const id = 1;
      const action = coursesActions.getCourse({ id });

      expect({ ...action }).toEqual({
        type: '[Courses] Get Course',
        id,
      });
    });
  });

  describe('GetCourseFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = coursesActions.getCourseFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Courses] Get Course Failure',
        error,
      });
    });
  });

  describe('GetCourseSuccess', () => {
    it(`should create an action`, () => {
      const course = { id: 1, title: 'ABC', instructor: 'John', path: 'A', source: 'B' };
      const action = coursesActions.getCourseSuccess({ course });

      expect({ ...action }).toEqual({
        type: '[Courses] Get Course Success',
        course,
      });
    });
  });

  describe('GetTotalCourses', () => {
    it(`should create an action`, () => {
      const action = coursesActions.getTotalCourses();

      expect({ ...action }).toEqual({
        type: '[Courses] Get Total Courses',
      });
    });
  });

  describe('GetTotalCoursesFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = coursesActions.getTotalCoursesFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Courses] Get Total Courses Failure',
        error,
      });
    });
  });

  describe('GetTotalCoursesSuccess', () => {
    it(`should create an action`, () => {
      const courses = [
        { id: 1, title: 'ABC', instructor: 'John', path: 'A', source: 'B', yearCompleted: '2019' },
        { id: 2, title: 'DEF', instructor: 'Jack', path: 'A', source: 'B', yearCompleted: '2019' },
      ];
      const action = coursesActions.getTotalCoursesSuccess({ courses });

      expect({ ...action }).toEqual({
        type: '[Courses] Get Total Courses Success',
        courses,
      });
    });
  });

  describe('LoadCourse', () => {
    it(`should create an action`, () => {
      const current = 1;
      const pageSize = 3;
      const action = coursesActions.loadCourses({ current, pageSize });

      expect({ ...action }).toEqual({
        type: '[Courses] Load Courses',
        current,
        pageSize,
      });
    });
  });

  describe('LoadCoursesFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = coursesActions.loadCoursesFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Courses] Load Courses Failure',
        error,
      });
    });
  });

  describe('LoadCoursesSuccess', () => {
    it(`should create an action`, () => {
      const courses = [
        { id: 1, title: 'ABC', instructor: 'John', path: 'A', source: 'B', yearCompleted: '2019' },
        { id: 2, title: 'DEF', instructor: 'Jack', path: 'A', source: 'B', yearCompleted: '2019' },
      ];
      const action = coursesActions.loadCoursesSuccess({ courses });

      expect({ ...action }).toEqual({
        type: '[Courses] Load Courses Success',
        courses,
      });
    });
  });

  describe('SaveCourse', () => {
    it(`should create an action`, () => {
      const course = { id: 1, title: 'ABC', instructor: 'John', path: 'A', source: 'B', yearCompleted: '2019' };
      const action = coursesActions.saveCourse({ course });

      expect({ ...action }).toEqual({
        type: '[Courses] Save Course',
        course,
      });
    });
  });

  describe('SaveCourseFailure', () => {
    it(`should create an action`, () => {
      const error = 'Error';
      const action = coursesActions.saveCourseFailure({ error });

      expect({ ...action }).toEqual({
        type: '[Courses] Save Course Failure',
        error,
      });
    });
  });

  describe('SaveCourseSuccess', () => {
    it(`should create an action`, () => {
      const course = { id: 1, title: 'ABC', instructor: 'John', path: 'A', source: 'B', yearCompleted: '2019' };
      const action = coursesActions.saveCourseSuccess({ course });

      expect({ ...action }).toEqual({
        type: '[Courses] Save Course Success',
        course,
      });
    });
  });
});
