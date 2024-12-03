import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/list/list-display.component';
import { ListHeaderComponent } from '@shared/list/list-header.component';
import { ModalDataService } from '@modals/modal-data.service';
import { Source } from '@models/sources';
import { SourcesStore } from '@store/sources.store';

@Component({
    selector: 'app-source-list',
    imports: [NgbModule, ListDisplayComponent, ListHeaderComponent],
    template: `
    <section>
      <section class="card">
        <header>
          <h1 class="card-header">Sources</h1>
        </header>

        <section class="card-body">
          <app-list-header (newItem)="newSource()"></app-list-header>

          <app-list-display
            [headers]="headers"
            [columns]="columns"
            [items]="sources()"
            [isAuthenticated]="isAuthenticated"
            (deleteItem)="deleteSource($event)"
            (editItem)="editSource($event)"></app-list-display>
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
    ]
})
export default class SourceListComponent {
  readonly #modal = inject(NgbModal);
  readonly #modalDataService = inject(ModalDataService);
  readonly #router = inject(Router);
  readonly #sourcesStore = inject(SourcesStore);

  protected readonly columns = ['name'];
  protected readonly headers = ['Source'];
  protected readonly isAuthenticated = true;
  protected readonly sources = this.#sourcesStore.sources;

  protected deleteSource(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this source?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.#modalDataService.setDeleteModalOptions(modalOptions);
    this.#modal.open(DeleteComponent).result.then((_result) => {
      this.#sourcesStore.deleteSource(id);
    });
  }

  protected editSource(id: number) {
    this.#router.navigate(['/admin/sources', id]);
  }

  protected newSource() {
    this.#router.navigate(['/admin/sources/new']);
  }
}
