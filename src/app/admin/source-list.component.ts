import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromRoot from '@store/index';
import { sourcesActions } from '@store/sources/sources.actions';
import { sourcesFeature } from '@store/sources/sources.state';
import { DeleteComponent } from '@modals/delete.component';
import { ListDisplayComponent } from '@shared/list/list-display.component';
import { ListHeaderComponent } from '@shared/list/list-header.component';
import { ModalDataService } from '@modals/modal-data.service';
import { Source } from '@models/sources';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [AsyncPipe, NgbModule, ListDisplayComponent, ListHeaderComponent],

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
            [items]="source$ | async"
            [isAuthenticated]="isAuthenticated"
            (deleteItem)="deleteSource($event)"
            (editItem)="editSource($event)"
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
export default class SourceListComponent implements OnInit {
  private modal = inject(NgbModal);
  private modalDataService = inject(ModalDataService);
  private router = inject(Router);
  private store = inject(Store<fromRoot.State>);

  columns = ['name'];
  headers = ['Source'];
  isAuthenticated = true;
  source$: Observable<any[]>;
  selectPath = <Source>{};

  ngOnInit() {
    this.store.dispatch(sourcesActions.loadSources());
    this.source$ = this.store.pipe(select(sourcesFeature.selectSources));
  }

  deleteSource(id) {
    const modalOptions = {
      title: 'Are you sure you want to delete this source?',
      body: 'All information associated to this source will be permanently deleted.',
      warning: 'This operation cannot be undone.',
    };
    this.modalDataService.setDeleteModalOptions(modalOptions);
    this.modal.open(DeleteComponent).result.then((_result) => {
      this.store.dispatch(sourcesActions.deleteSource({ id }));
    });
  }

  editSource(id: number) {
    this.router.navigate(['/admin/sources', id]);
  }

  newSource() {
    this.router.navigate(['/admin/sources/new']);
  }
}
