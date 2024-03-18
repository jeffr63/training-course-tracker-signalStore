import * as courseState from '@store/course/course.state';
import * as pathsState from '@store/paths/paths.state';
import * as sourcesState from '@store/sources/sources.state';
import * as usersState from '@store/users/users.state';

export interface State {
  courses: courseState.State;
  paths: pathsState.State;
  sources: sourcesState.State;
  users: usersState.State;
}
