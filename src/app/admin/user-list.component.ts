import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/list/list-display.component';
import { ModalDataService } from '@modals/modal-data.service';
import { UsersStore } from '@store/users.store';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [AsyncPipe, NgbModule, ListDisplayComponent],

  template: `
    <section>
      <section class="card">
        <header>
          <h1 class="card-header">Users</h1>
        </header>

        <section class="card-body">
          <app-list-display
            [headers]="headers"
            [columns]="columns"
            [items]="users()"
            [isAuthenticated]="isAuthenticated"
            (deleteItem)="deleteUser($event)"
            (editItem)="editUser($event)"></app-list-display>
        </section>
      </section>
    </section>
  `,

  styles: [
    `
      header {
        padding-bottom: 10px;
      }
    `,
  ],
})
export default class UserListComponent {
  readonly #modal = inject(NgbModal);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);
  readonly #usersStore = inject(UsersStore);

  protected readonly columns = ['name', 'email', 'role'];
  protected readonly headers = ['Name', 'Email', 'Role'];
  protected readonly isAuthenticated = true;
  protected readonly users = this.#usersStore.users;

  protected deleteUser(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this user?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    this.#modal.open(DeleteComponent).result.then((_result) => {
      this.#usersStore.deleteUser(id);
    });
  }

  protected editUser(id: number) {
    this.#router.navigate(['/admin/users', id]);
  }
}
