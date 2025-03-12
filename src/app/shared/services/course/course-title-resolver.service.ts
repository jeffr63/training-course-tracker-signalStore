import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { map } from 'rxjs';

import { CoursesService } from '@services/course/courses.service';

export const courseTitleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  if (id == 'new') {
    return 'New Course';
  } else {
    return inject(CoursesService)
      .getCourse(id)
      .pipe(map((course) => course.title));
  }
};
