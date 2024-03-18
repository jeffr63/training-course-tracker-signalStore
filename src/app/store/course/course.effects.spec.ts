import { Observable, of, skip, take, throwError } from 'rxjs';

import { coursesActions } from './course.actions';
import { Course } from '@models/course';
import { courseEffects } from './course.effects';
import { CoursesService } from '@services/courses.service';

const course: Course = {
  id: 1,
  title: 'ABC',
  instructor: 'Joe',
  path: 'A',
  source: 'B',
};

const courses: Course[] = [
  {
    id: 1,
    title: 'ABC',
    instructor: 'Joe',
    path: 'A',
    source: 'B',
  },
];

describe(`Course Effects`, () => {
  describe(`deleteCourse$ effect`, () => {
    it(`should return deleteCoursesSuccess, with courses, on success`, (done) => {
      const courseServiceMock = {
        deleteCourse: (id) => of(1),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.deleteCourse({ id: 1, current: 1, pageSize: 1 }));
      courseEffects
        .deleteCourse$(action$, courseServiceMock)
        .pipe(take(1))
        .subscribe((action) => {
          expect(action).toEqual(coursesActions.loadCourses({ current: 1, pageSize: 1 }));
        });
      courseEffects
        .deleteCourse$(action$, courseServiceMock)
        .pipe(skip(1), take(1))
        .subscribe((action) => {
          expect(action).toEqual(coursesActions.getTotalCourses());
        });
      courseEffects
        .deleteCourse$(action$, courseServiceMock)
        .pipe(skip(2))
        .subscribe((action) => {
          expect(action).toEqual(coursesActions.deleteCourseSuccess());
        });
      done();
    });

    it(`should return deleteCoursesFailure, with error, on failure`, (done) => {
      const courseServiceMock = {
        deleteCourse: (id) => throwError(() => 'Failure'),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.deleteCourse({ id: 1, current: 1, pageSize: 1 }));
      courseEffects.deleteCourse$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.deleteCourseFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`getCourse$ effect`, () => {
    it(`should return getCourseSuccess, with course, on success`, (done) => {
      const courseServiceMock = {
        getCourse: () => of(course),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.getCourse({ id: 1 }));
      courseEffects.getCourse$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.getCourseSuccess({ course }));
      });
      done();
    });

    it(`should return getCoursesFailure, with error, on failure`, (done) => {
      const courseServiceMock = {
        getCourse: () => throwError(() => 'Failure'),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.getCourse({ id: 1 }));
      courseEffects.getCourse$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.getCourseFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`loadCourses$ effect`, () => {
    it(`should return loadCoursesSuccess, with courses, on success`, (done) => {
      const courseServiceMock = {
        getCoursesPaged: () => of(courses),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.loadCourses({ current: 1, pageSize: 1 }));
      courseEffects.loadCourses$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.loadCoursesSuccess({ courses }));
      });
      done();
    });

    it(`should return loadCoursesFailure, with error, on failure`, (done) => {
      const courseServiceMock = {
        getCoursesPaged: () => throwError(() => 'Failure'),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.loadCourses({ current: 1, pageSize: 1 }));
      courseEffects.loadCourses$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.loadCoursesFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`saveCourse$ effect`, () => {
    it(`should return saveCoursesSuccess, with courses, on success`, (done) => {
      const courseServiceMock = {
        saveCourse: () => of(course),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.saveCourse({ course }));
      courseEffects
        .saveCourse$(action$, courseServiceMock)
        .pipe(take(1))
        .subscribe((action) => {
          expect(action).toEqual(coursesActions.getTotalCourses());
        });
      courseEffects
        .saveCourse$(action$, courseServiceMock)
        .pipe(skip(1))
        .subscribe((action) => {
          expect(action).toEqual(coursesActions.saveCourseSuccess({ course }));
        });
      done();
    });

    it(`should return saveCoursesFailure, with error, on failure`, (done) => {
      const courseServiceMock = {
        saveCourse: () => throwError(() => 'Failure'),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.saveCourse({ course }));
      courseEffects.saveCourse$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.saveCourseFailure({ error: 'Failure' }));
      });
      done();
    });
  });

  describe(`totalsCourses$ effect`, () => {
    it(`should return totalCoursesSuccess, with courses, on success`, (done) => {
      const courseServiceMock = {
        getCourses: () => of(courses),
      } as unknown as CoursesService;
      const action$ = of(coursesActions.getTotalCourses());
      courseEffects.totalCourses$(action$, courseServiceMock).subscribe((action) => {
        expect(action).toEqual(coursesActions.getTotalCoursesSuccess({ courses }));
      });
      done();
    });
  });
});
