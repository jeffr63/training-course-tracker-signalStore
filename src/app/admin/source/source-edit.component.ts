import { Component, OnInit, inject, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Source } from '@models/sources';
import { SourcesStore } from '@store/sources.store';
import { SourceEditCardComponent } from './source-edit-card.component';

@Component({
  selector: 'app-source-edit',
  imports: [SourceEditCardComponent],
  template: `<app-source-edit-card [(sourceEditForm)]="sourceEditForm" (cancel)="cancel()" (save)="save()" />`,
})
export default class SourceEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #router = inject(Router);
  readonly #sourcesStore = inject(SourcesStore);

  protected readonly id = input<string>();
  protected sourceEditForm: FormGroup;
  #source = <Source>{ name: '' };

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

  protected cancel() {
    this.#router.navigate(['/admin/sources']);
  }

  protected save() {
    this.#source.name = this.sourceEditForm.controls.name.value;
    this.#sourcesStore.saveSource({ source: this.#source });
    this.#location.back();
  }

  private setSource(source: Source) {
    if (this.id() == 'new') return;

    this.#source = source;
    this.sourceEditForm.get('name').setValue(source.name);
  }
}
