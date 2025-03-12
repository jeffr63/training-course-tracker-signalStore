import { Component, OnInit, inject, ChangeDetectionStrategy, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Course } from '@models/course';
import { CourseEditCardComponent } from './course-edit-card.component';
import { CoursesStore } from '@store/course.store';
import { PathsStore } from '@store/paths.store';
import { SourcesStore } from '@store/sources.store';

@Component({
  selector: 'app-course-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CourseEditCardComponent],
  template: `<app-course-edit-card
    [(courseEditForm)]="courseEditForm"
    [paths]="paths()"
    [sources]="sources()"
    (cancel)="cancel()"
    (save)="save()" />`,
})
export default class CourseEditComponent implements OnInit {
  readonly #coursesStore = inject(CoursesStore);
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #pathsStore = inject(PathsStore);
  readonly #sourcesStore = inject(SourcesStore);
  readonly #router = inject(Router);

  #course = <Course>{ title: '', instructor: '', path: '', source: '' };
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

  protected cancel() {
    this.#router.navigate(['/courses']);
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
