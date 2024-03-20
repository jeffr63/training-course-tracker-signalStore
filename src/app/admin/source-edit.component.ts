import { Component, OnInit, inject, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Source } from '@models/sources';
import { SourcesStore } from '@store/sources.store';

@Component({
  selector: 'app-source-edit',
  standalone: true,
  imports: [NgbModule, ReactiveFormsModule, RouterLink],

  template: `
    <section class="container">
      <section class="card">
        @if (sourceEditForm) {
        <form [formGroup]="sourceEditForm">
          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="name">Source Name</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" formControlName="name" placeholder="Enter source name" />
              @if (sourceEditForm.controls.name.errors?.required && sourceEditForm.controls.name.touched) {
              <small class="text-danger">Name is required</small>
              }
            </div>
          </fieldset>

          <div class="d-grid gap-2 m-2 d-sm-flex justify-content-sm-end">
            <button class="btn btn-primary me-sm-2" (click)="save()" title="Save" [disabled]="!sourceEditForm.valid">
              <i class="bi bi-save"></i> Save
            </button>
            <a class="btn btn-secondary" [routerLink]="['/admin/sources']" title="Cancel">
              <i class="bi bi-x-circle"></i> Cancel
            </a>
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
export default class SourceEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #sourcesStore = inject(SourcesStore);

  id = input<string>();
  sourceEditForm: FormGroup;
  #source: Source;

  constructor() {
    effect(() => this.setSource(this.#sourcesStore.currentSource()));
  }

  ngOnInit() {
    this.sourceEditForm = this.#fb.group({
      name: ['', Validators.required],
    });

    if (this.id() === 'new') return;

    this.#sourcesStore.getSource(+this.id());
  }

  save() {
    this.#source.name = this.sourceEditForm.controls.name.value;
    this.#sourcesStore.saveSource({ source: this.#source });
    this.#location.back();
  }

  setSource(source: Source) {
    if (this.id() == 'new') return;

    this.#source = source;
    this.sourceEditForm.get('name').setValue(source.name);
  }
}
