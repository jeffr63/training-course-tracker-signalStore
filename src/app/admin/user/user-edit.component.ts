import { Component, OnInit, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { User } from '@models/user';
import { UserEditCardComponent } from './user-edit-card.component';
import { UsersStore } from '@store/users.store';

@Component({
    selector: 'app-user-edit',
    imports: [UserEditCardComponent],
    template: `<app-user-edit-card [(userEditForm)]="userEditForm" (cancel)="cancel()" (save)="save()" />`,
})
export default class UserEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #usersStore = inject(UsersStore);
  readonly #router = inject(Router);

  protected readonly id = input<string>();
  protected userEditForm!: FormGroup;
  #user = <User>{email: '', password: '', name: '', role: ''};

  constructor() {
    effect(() => this.setUser(this.#usersStore.currentUser()));
  }

  ngOnInit() {
    this.userEditForm = this.#fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });

    if (this.id() == 'new') return;

    this.#usersStore.getUser(+this.id());
  }

  protected cancel() {
    this.#router.navigate(['/admin/users']);
  }

  protected save() {
    const patchData = {
      email: this.userEditForm.controls.email.value,
      name: this.userEditForm.controls.name.value,
      role: this.userEditForm.controls.role.value,
    };

    this.#usersStore.patchUser({ id: this.#user.id, user: patchData });
    this.#location.back();
  }

  private setUser(user: User) {
    if (this.id() == 'new') return;

    this.#user = user;
    this.userEditForm.get('name').setValue(user.name);
    this.userEditForm.get('email').setValue(user.email);
    this.userEditForm.get('role').setValue(user.role);
  }
}
