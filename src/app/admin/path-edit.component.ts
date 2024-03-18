import { Component, OnInit, OnDestroy, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import * as fromRoot from '@store/index';
import { pathsActions } from '@store/paths/paths.actions';
import { pathsFeature } from '@store/paths/paths.state';
import { Path } from '@models/paths';

@Component({
  selector: 'app-path-edit',
  standalone: true,
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
            <button class="btn btn-primary me-sm-2" (click)="save()" title="Save" [disabled]="!pathEditForm.valid">
              <i class="bi bi-save"></i> Save
            </button>
            <a class="btn btn-secondary" [routerLink]="['/admin/paths']" title="Cancel">
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
export default class PathEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private store = inject(Store<fromRoot.State>);

  @Input() id;
  destroy$ = new ReplaySubject<void>(1);
  pathEditForm!: FormGroup;
  path = <Path>{};

  ngOnInit() {
    this.pathEditForm = this.fb.group({
      name: ['', Validators.required],
    });

    if (this.id === 'new') return;

    this.store.dispatch(pathsActions.getPath({ id: +this.id }));
    this.store
      .pipe(select(pathsFeature.selectCurrentPath))
      .pipe(takeUntil(this.destroy$))
      .subscribe((path: Path) => {
        this.path = { ...path };
        this.pathEditForm.get('name').setValue(this.path.name);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  save() {
    this.path.name = this.pathEditForm.controls.name.value;
    this.store.dispatch(pathsActions.savePath({ path: this.path }));
    this.location.back();
  }
}
