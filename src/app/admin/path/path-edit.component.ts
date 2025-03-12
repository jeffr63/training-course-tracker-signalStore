import { Component, OnInit, inject, effect, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Path } from '@models/paths';
import { PathEditCardComponent } from './path-edit-card.component';
import { PathsStore } from '@store/paths.store';

@Component({
  selector: 'app-path-edit',
  imports: [PathEditCardComponent],
  template: `<app-path-edit-card [(pathEditForm)]="pathEditForm" (cancel)="cancel()" (save)="save()" />`,
})
export default class PathEditComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #location = inject(Location);
  readonly #pathsStore = inject(PathsStore);
  readonly #router = inject(Router);

  protected readonly id = input<string>();
  protected pathEditForm!: FormGroup;
  #path = <Path>{name: '', };

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

  protected cancel() {
    this.#router.navigate(['/admin/paths']);
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
