import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalDataService {
  #deleteModalOptions = {
    title: '',
    body: '',
    warning: '',
  };

  public setDeleteModalOptions(options: any) {
    this.#deleteModalOptions = options;
  }

  public getDeleteModalOtions(): any {
    return this.#deleteModalOptions;
  }
}
