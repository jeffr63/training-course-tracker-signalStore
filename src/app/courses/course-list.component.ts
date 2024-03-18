import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from '@store/index';
import { coursesActions } from '@store/course/course.actions';
import { coursesFeature } from '@store/course/course.state';
import { AuthService } from '@services/auth.service';
import { Course } from '@models/course';
import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/list/list-display.component';
import { ModalDataService } from '@modals/modal-data.service';
import { PagerListHeaderComponent } from '@shared/list/pager-list-header.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [AsyncPipe, NgbModule, PagerListHeaderComponent, ListDisplayComponent],

  template: `
    <section>
      <section class="card">
        <header>
          <h1 class="card-header">Training Courses</h1>
        </header>

        <section class="card-body">
          <app-pager-list-header
            includePager="true"
            [total]="totalCourses$ | async"
            [pageSize]="pageSize"
            [maxSize]="5"
            [(current)]="current"
            [isAuthenticated]="isLoggedIn()"
            (refreshTable)="refreshTable()"
            (newCourse)="newCourse()"
          ></app-pager-list-header>

          <app-list-display
            [headers]="headers"
            [columns]="columns"
            [items]="courses$ | async"
            [isAuthenticated]="isLoggedIn()"
            (deleteItem)="deleteCourse($event)"
            (editItem)="editCourse($event)"
          ></app-list-display>
        </section>
      </section>
    </section>
  `,

  styles: [],
})
export default class CourseListComponent implements OnInit {
  private store = inject(Store<fromRoot.State>);
  private modal = inject(NgbModal);
  public authService = inject(AuthService);
  private modalDataService = inject(ModalDataService);
  private router = inject(Router);

  courses$: Observable<Course[]>;
  selectCourse = signal<Course>({} as Course);
  current = 1;
  loading = signal(false);
  pageSize = 10;
  totalCourses$: Observable<number>;
  closedResult = '';
  columns = ['title', 'instructor', 'path', 'source'];
  headers = ['Title', 'Instructor', 'Path', 'Source'];

  isLoggedIn = this.authService.isLoggedIn;

  ngOnInit() {
    this.store.dispatch(
      coursesActions.loadCourses({
        current: this.current,
        pageSize: this.pageSize,
      })
    );
    this.store.dispatch(coursesActions.getTotalCourses());
    this.courses$ = this.store.pipe(select(coursesFeature.selectCourses));
    this.totalCourses$ = this.store.pipe(select(coursesFeature.selectTotalCourses));
  }

  deleteCourse(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    this.modal.open(DeleteComponent).result.then((_result) => {
      this.store.dispatch(
        coursesActions.deleteCourse({
          id: id,
          current: this.current,
          pageSize: this.pageSize,
        })
      );
    });
  }

  editCourse(id) {
    this.router.navigate(['/courses', id]);
  }

  newCourse() {
    this.router.navigate(['/courses/new']);
  }

  refreshTable() {
    this.store.dispatch(
      coursesActions.loadCourses({
        current: this.current,
        pageSize: this.pageSize,
      })
    );
  }
}
