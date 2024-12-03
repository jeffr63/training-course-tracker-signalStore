import { Component, OnInit, inject, ChangeDetectionStrategy, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Course } from '@models/course';
import { CoursesStore } from '@store/course.store';
import { PathsStore } from '@store/paths.store';
import { SourcesStore } from '@store/sources.store';

@Component({
    selector: 'app-course-edit',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbModule, ReactiveFormsModule, RouterLink],
    template: `
    <section class="container">
      <section class="card">
        @if (courseEditForm) {
        <form [formGroup]="courseEditForm">
          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="title">Title</label>
            <div class="col-sm-6">
              <input id="title" type="text" class="form-control" formControlName="title" placeholder="Enter title of course taken" />
              @if (courseEditForm.controls.title.errors?.required && courseEditForm.controls.title.touched) {
              <small class="text-danger">Title is required</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="instructor">Instructor</label>
            <div class="col-sm-6">
              <input id="instructor" type="text" class="form-control" formControlName="instructor" placeholder="Enter name of course's intructor" />
              @if (courseEditForm.controls.instructor.errors?.required && courseEditForm.controls.instructor.touched) {
              <small class="text-danger">Instructor is required</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="path">Path</label>
            <div class="col-sm-6">
              <input id="path" type="text" class="form-control" formControlName="path" list="path-helpers" placeholder="Enter techical path of course (ex: Angular or React)" />
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
              <input id="source" type="text" class="form-control" formControlName="source" list="source-helpers" placeholder="Enter where the course was sourced from (ex: Pluralsite)" />
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
            <button class="btn btn-primary me-sm-2" (click)="save()" title="Save" [disabled]="!courseEditForm.valid"><i class="bi bi-save"></i> Save</button>
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
    ]
})
export default class CourseEditComponent implements OnInit {
  readonly #coursesStore = inject(CoursesStore);
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #pathsStore = inject(PathsStore);
  readonly #sourcesStore = inject(SourcesStore);

  #course: Course;
  protected courseEditForm: FormGroup;
  protected readonly id = input<string>();
  protected readonly paths = this.#pathsStore.paths;
  protected readonly sources = this.#sourcesStore.sources;

  constructor() {
    effect(() => this.setCourse(this.#coursesStore.currentCourse()));
  }

  ngOnInit() {
    this.courseEditForm = this.#fb.group({
      title: ['', Validators.required],
      instructor: ['', Validators.required],
      path: ['', Validators.required],
      source: ['', Validators.required],
    });

    if (this.id() === 'new') return;

    this.#coursesStore.getCourse(+this.id());
  }

  protected save() {
    this.#course.title = this.courseEditForm.controls.title.value;
    this.#course.instructor = this.courseEditForm.controls.instructor.value;
    this.#course.path = this.courseEditForm.controls.path.value;
    this.#course.source = this.courseEditForm.controls.source.value;
    this.#coursesStore.saveCourse({ course: this.#course });
    this.#location.back();
  }

  private setCourse(course: Course) {
    if (this.id() == 'new') return;
    this.#course = course;
    this.courseEditForm.get('title').setValue(course.title);
    this.courseEditForm.get('instructor').setValue(course.instructor);
    this.courseEditForm.get('path').setValue(course.path);
    this.courseEditForm.get('source').setValue(course.source);
  }
}
