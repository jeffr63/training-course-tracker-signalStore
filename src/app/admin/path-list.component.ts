import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/list/list-display.component';
import { ListHeaderComponent } from '@shared/list/list-header.component';
import { ModalDataService } from '@modals/modal-data.service';
import { PathsStore } from '@store/paths.store';

@Component({
  selector: 'app-path-list',
  standalone: true,
  imports: [AsyncPipe, NgbModule, ListDisplayComponent, ListHeaderComponent],

  template: `
    <section>
      <section class="card">
        <header>
          <h1 class="card-header">Paths</h1>
        </header>

        <section class="card-body">
          <app-list-header (newItem)="newPath()"></app-list-header>

          <app-list-display
            [headers]="headers"
            [columns]="columns"
            [items]="paths()"
            [isAuthenticated]="isAuthenticated"
            (deleteItem)="deletePath($event)"
            (editItem)="editPath($event)"></app-list-display>
        </section>
      </section>
    </section>
  `,

  styles: ['header { padding-bottom: 10px; }'],
})
export default class PathListComponent {
  readonly #modal = inject(NgbModal);
  readonly #modalDataService = inject(ModalDataService);
  readonly #pathsStore = inject(PathsStore);
  readonly #router = inject(Router);

  protected readonly columns = ['name'];
  protected readonly headers = ['Path'];
  protected readonly isAuthenticated = true;
  protected readonly paths = this.#pathsStore.paths;

  protected deletePath(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this path?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    this.#modal.open(DeleteComponent).result.then((_result) => {
      this.#pathsStore.deletePath(id);
    });
  }

  protected editPath(id: number) {
    this.#router.navigate(['/admin/paths', id]);
  }

  protected newPath() {
    this.#router.navigate(['/admin/paths/new']);
  }
}
