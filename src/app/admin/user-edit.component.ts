import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { takeUntil } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import * as fromRoot from '@store/index';
import { usersActions } from '@store/users/users.actions';
import { usersFeature } from '@store/users/users.state';
import { User } from '@models/user';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [NgbModule, ReactiveFormsModule, RouterLink],

  template: `
    <section class="container">
      <section class="card">
        @if (userEditForm) {
        <form [formGroup]="userEditForm">
          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="name">Name</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" formControlName="name" placeholder="Enter user's name" />
              @if (userEditForm.controls.name.errors?.required) {
              <small class="text-danger">Name is required</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="email">Email</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" formControlName="email" placeholder="Enter email address" />
              @if (userEditForm.controls.email.errors?.required) {
              <small class="text-danger">Email is required</small>
              } @if (userEditForm.controls.email.errors?.email) {
              <small class="text-danger">Must be a valid email</small>
              }
            </div>
          </fieldset>

          <fieldset class="m-2 row">
            <label class="col-form-label col-sm-2" for="email">Roles</label>
            <div class="form-check col-sm-3" style="margin-left:20px">
              <input type="radio" class="form-check-input" id="role1" value="admin" formControlName="role" />
              <label class="form-check-label" for="check1">Admin</label>
              @if (userEditForm.controls.role.errors?.required) {
              <small class="text-danger">Role is required</small>
              }
            </div>
            <div class="form-check col-sm-3">
              <input type="radio" class="form-check-input" value="user" id="role2" formControlName="role" />
              <label class="form-check-label" for="check1">User</label>
            </div>
          </fieldset>

          <div class="d-grid gap-2 m-2 d-sm-flex justify-content-sm-end">
            <button class="btn btn-primary me-sm-2" (click)="save()" title="Save" [disabled]="!userEditForm.valid">
              <i class="bi bi-save"></i> Save
            </button>
            <a class="btn btn-secondary" [routerLink]="['/admin/users']" title="Cancel">
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
export default class UserEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private store = inject(Store<fromRoot.State>);

  @Input() id;
  destroy$ = new ReplaySubject<void>(1);
  userEditForm!: FormGroup;
  private user = <User>{};

  ngOnInit() {
    this.userEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    this.store.dispatch(usersActions.getUser({ id: +this.id }));
    this.store
      .pipe(select(usersFeature.selectCurrentUser))
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.user = { ...user };
        this.userEditForm.get('name').setValue(this.user.name);
        this.userEditForm.get('email').setValue(this.user.email);
        this.userEditForm.get('role').setValue(this.user.role);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  save() {
    const patchData = {
      email: this.userEditForm.controls.email.value,
      name: this.userEditForm.controls.name.value,
      role: this.userEditForm.controls.role.value,
    };

    this.store.dispatch(usersActions.patchUser({ id: this.user.id, user: patchData }));
    this.location.back();
  }
}
