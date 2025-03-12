import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '@services/auth/auth.service';
import { Course } from '@models/course';
import { CoursesStore } from '@store/course.store';
import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/components/list-display.component';
import { ModalDataService } from '@modals/modal-data.service';
import { PagerListHeaderComponent } from '@shared/components/pager-list-header.component';

@Component({
  selector: 'app-course-list',
  imports: [NgbModule, PagerListHeaderComponent, ListDisplayComponent],
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
            (newCourse)="newCourse()">
          </app-pager-list-header>

          <app-list-display
            [headers]="headers"
            [columns]="columns"
            [items]="courses()"
            [isAuthenticated]="isLoggedIn()"
            (deleteItem)="deleteCourse($event)"
            (editItem)="editCourse($event)">
          </app-list-display>
        </section>
      </section>
    </section>
  `,
  styles: [],
})
export default class CourseListComponent implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #coursesStore = inject(CoursesStore);
  readonly #modal = inject(NgbModal);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);

  protected readonly closedResult = '';
  protected readonly columns = ['title', 'instructor', 'path', 'source'];
  protected readonly courses = this.#coursesStore.currentPage;
  protected readonly current = 1;
  protected readonly headers = ['Title', 'Instructor', 'Path', 'Source'];
  protected readonly isLoggedIn = this.#authService.isLoggedIn;
  protected readonly loading = signal(false);
  protected readonly pageSize = 10;
  protected readonly selectCourse = signal<Course>({} as Course);
  protected readonly totalCourses = this.#coursesStore.totalCourses;

  ngOnInit() {
    this.#coursesStore.loadCourses({ current: this.current, pageSize: this.pageSize });
  }

  protected deleteCourse(id) {
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

  protected editCourse(id) {
    this.#router.navigate(['/courses', id]);
  }

  protected newCourse() {
    this.#router.navigate(['/courses/new']);
  }

  protected refreshTable() {
    this.#coursesStore.loadCourses({ current: this.current, pageSize: this.pageSize });
  }
}
