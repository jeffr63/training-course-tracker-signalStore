import { Component, OnInit, OnDestroy, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, Location } from '@angular/common';

import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRoot from '@store/index';
import { coursesActions } from '@store/course/course.actions';
import { coursesFeature } from '@store/course/course.state';
import { pathsActions } from '@store/paths/paths.actions';
import { pathsFeature } from '@store/paths/paths.state';
import { sourcesActions } from '@store/sources/sources.actions';
import { sourcesFeature } from '@store/sources/sources.state';
import { Course } from '@models/course';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [AsyncPipe, NgbModule, ReactiveFormsModule, RouterLink],

  template: `
    <section class="container">
      <section class="card">
        @if (courseEditForm) {
        <form [formGroup]="courseEditForm">
          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="title">Title</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                formControlName="title"
                placeholder="Enter title of course taken" />
              @if (courseEditForm.controls.title.errors?.required && courseEditForm.controls.title.touched) {
              <small class="text-danger">Title is required</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="instructor">Instructor</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                formControlName="instructor"
                placeholder="Enter name of course's intructor" />
              @if (courseEditForm.controls.instructor.errors?.required && courseEditForm.controls.instructor.touched) {
              <small class="text-danger">Instructor is required</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="path">Path</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                formControlName="path"
                list="path-helpers"
                placeholder="Enter techical path of course (ex: Angular or React)" />
              <datalist id="path-helpers">
                @for (path of paths(); track path.id) {
                <option value="{{ path.name }}"></option>
                }
              </datalist>
              @if (courseEditForm.controls.path.errors?.required && courseEditForm.controls.path.touched) {
              <small class="text-danger">Path is required</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="source">Source</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                formControlName="source"
                list="source-helpers"
                placeholder="Enter where the course was sourced from (ex: Pluralsite)" />
              <datalist id="source-helpers">
                @for (source of sources(); track source.id) {
                <option value="{{ source.name }}"></option>
                }
              </datalist>
              @if (courseEditForm.controls.source.errors?.required && courseEditForm.controls.source.touched) {
              <small class="text-danger">Source is required</small>
              }
            </div>
          </fieldset>

          <div class="d-grid gap-2 m-2 d-sm-flex justify-content-sm-end">
            <button class="btn btn-primary me-sm-2" (click)="save()" title="Save" [disabled]="!courseEditForm.valid">
              <i class="bi bi-save"></i> Save
            </button>
            <a class="btn btn-secondary" [routerLink]="['/courses']"> <i class="bi bi-x-circle"></i> Cancel </a>
          </div>
        </form>
        }
      </section>
    </section>
  `,

  styles: [
    `
      section .card {
        margin-top: 30px;
        padding-left: 15px;
        padding-right: 15px;
      }

      .form-buttons {
        margin-left: 3px;
      }
    `,
  ],
})
export default class CourseEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private store = inject(Store<fromRoot.State>);

  @Input() id;
  destroy$ = new ReplaySubject<void>(1);
  paths = toSignal(this.store.pipe(select(pathsFeature.selectPaths)), { initialValue: [] });
  sources = toSignal(this.store.pipe(select(sourcesFeature.selectSources)), { initialValue: [] });
  courseEditForm: FormGroup;
  course = <Course>{};

  ngOnInit() {
    this.courseEditForm = this.fb.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      path: ['', Validators.required],
      source: ['', Validators.required],
    });

    this.store.dispatch(pathsActions.loadPaths());
    this.store.dispatch(sourcesActions.loadSources());

    if (this.id === 'new') return;

    this.store.dispatch(coursesActions.getCourse({ id: +this.id }));
    this.store
      .pipe(select(coursesFeature.selectCurrentCourse))
      .pipe(takeUntil(this.destroy$))
      .subscribe((course: Course) => {
        this.course = { ...course };
        this.courseEditForm.get('title').setValue(this.course.title);
        this.courseEditForm.get('instructor').setValue(this.course.instructor);
        this.courseEditForm.get('path').setValue(this.course.path);
        this.courseEditForm.get('source').setValue(this.course.source);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  save() {
    this.course.title = this.courseEditForm.controls.title.value;
    this.course.instructor = this.courseEditForm.controls.instructor.value;
    this.course.path = this.courseEditForm.controls.path.value;
    this.course.source = this.courseEditForm.controls.source.value;
    this.store.dispatch(coursesActions.saveCourse({ course: this.course }));
    this.location.back();
  }
}
