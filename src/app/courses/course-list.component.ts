import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '@services/auth.service';
import { Course } from '@models/course';
import { CoursesStore } from '@store/course/course.store';
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
            [total]="totalCourses()"
            [pageSize]="pageSize"
            [maxSize]="5"
            [(current)]="current"
            [isAuthenticated]="isLoggedIn()"
            (refreshTable)="refreshTable()"
            (newCourse)="newCourse()"></app-pager-list-header>

          <app-list-display
            [headers]="headers"
            [columns]="columns"
            [items]="courses()"
            [isAuthenticated]="isLoggedIn()"
            (deleteItem)="deleteCourse($event)"
            (editItem)="editCourse($event)"></app-list-display>
        </section>
      </section>
    </section>
  `,

  styles: [],
})
export default class CourseListComponent implements OnInit {
  public authService = inject(AuthService);
  readonly #coursesStore = inject(CoursesStore);
  readonly #modal = inject(NgbModal);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);

  courses = this.#coursesStore.currentPage;
  selectCourse = signal<Course>({} as Course);
  current = 1;
  loading = signal(false);
  pageSize = 10;
  totalCourses = this.#coursesStore.totalCourses;
  closedResult = '';
  columns = ['title', 'instructor', 'path', 'source'];
  headers = ['Title', 'Instructor', 'Path', 'Source'];

  isLoggedIn = this.authService.isLoggedIn;

  ngOnInit() {
    if (this.#coursesStore.totalCourses() == 0) {
      this.#coursesStore.loadAllCourses();
    }
    this.#coursesStore.loadCourses({ current: this.current, pageSize: this.pageSize });
  }

  deleteCourse(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this course?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    this.#modal.open(DeleteComponent).result.then((_result) => {
      this.#coursesStore.deleteCourse({
        id: id,
        current: this.current,
        pageSize: this.pageSize,
      });
    });
  }

  editCourse(id) {
    this.#router.navigate(['/courses', id]);
  }

  newCourse() {
    this.#router.navigate(['/courses/new']);
  }

  refreshTable() {
    this.#coursesStore.loadCourses({ current: this.current, pageSize: this.pageSize });
  }
}
