import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRoot from '@store/index';
import { usersActions } from '@store/users/users.actions';
import { usersFeature } from '@store/users/users.state';
import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/list/list-display.component';
import { ModalDataService } from '@modals/modal-data.service';
import { User } from '@models/user';

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
            [items]="users$ | async"
            [isAuthenticated]="isAuthenticated"
            (deleteItem)="deleteUser($event)"
            (editItem)="editUser($event)"
          ></app-list-display>
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
export default class UserListComponent implements OnInit {
  private modal = inject(NgbModal);
  private modalDataService = inject(ModalDataService);
  private router = inject(Router);
  private store = inject(Store<fromRoot.State>);

  columns = ['name', 'email', 'role'];
  headers = ['Name', 'Email', 'Role'];
  isAuthenticated = true;
  users$: Observable<any[]>;
  selectedUser = <User>{};

  ngOnInit() {
    this.store.dispatch(usersActions.loadUsers());
    this.users$ = this.store.pipe(select(usersFeature.selectUsers));
  }

  deleteUser(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this user?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    this.modal.open(DeleteComponent).result.then((_result) => {
      this.store.dispatch(usersActions.deleteUser({ id }));
    });
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users', id]);
  }
}
