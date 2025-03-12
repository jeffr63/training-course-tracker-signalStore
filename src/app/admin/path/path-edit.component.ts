import { Component, OnInit, inject, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Path } from '@models/paths';
import { PathsStore } from '@store/paths.store';

@Component({
    selector: 'app-path-edit',
    imports: [NgbModule, ReactiveFormsModule, RouterLink],
    template: `
    <section class="container">
      <section class="card">
        @if (pathEditForm) {
        <form [formGroup]="pathEditForm">
          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="name">Path Name</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" formControlName="name" placeholder="Enter path name" />
              @if (pathEditForm.controls.name.errors?.required && pathEditForm.controls.name.touched) {
              <small class="text-danger">Name is required</small>
              }
            </div>
          </fieldset>

          <div class="d-grid gap-2 m-2 d-sm-flex justify-content-sm-end">
            <button class="btn btn-primary me-sm-2" (click)="save()" title="Save" [disabled]="!pathEditForm.valid"><i class="bi bi-save"></i> Save</button>
            <a class="btn btn-secondary" [routerLink]="['/admin/paths']" title="Cancel"> <i class="bi bi-x-circle"></i> Cancel </a>
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
export default class PathEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #pathsStore = inject(PathsStore);

  protected readonly id = input<string>();
  protected pathEditForm!: FormGroup;
  #path: Path;

  constructor() {
    effect(() => this.setPath(this.#pathsStore.currentPath()));
  }

  ngOnInit() {
    this.pathEditForm = this.#fb.group({
      name: ['', Validators.required],
    });

    if (this.id() === 'new') return;

    this.#pathsStore.getPath(+this.id());
  }
  protected save() {
    this.#path.name = this.pathEditForm.controls.name.value;
    this.#pathsStore.savePath({ path: this.#path });
    this.#location.back();
  }

  private setPath(path: Path) {
    if (this.id() == 'new') return;
    this.#path = path;
    this.pathEditForm.get('name').setValue(path.name);
  }
}
