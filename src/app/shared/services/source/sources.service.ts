import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Source } from '@models/sources';

@Injectable({
  providedIn: 'root',
})
export class SourcesService {
  readonly #http = inject(HttpClient);

  readonly #baseUrl = 'http://localhost:3000';

  public add(source: Source) {
    return this.#http.post(`${this.#baseUrl}/sources`, source);
  }

  public delete(id) {
    return this.#http.delete<Source>(`${this.#baseUrl}/sources/${id}`);
  }

  public get(id) {
    return this.#http.get<Source>(`${this.#baseUrl}/sources/${id}`);
  }

  public load() {
    return this.#http.get<Source[]>(`${this.#baseUrl}/sources?_sort=name&_order=asc`);
  }

  public save(source: Source) {
    if (source.id) {
      return this.update(source);
    } else {
      return this.add(source);
    }
  }

  public update(source: Source) {
    return this.#http.put(`${this.#baseUrl}/sources/${source.id}`, source);
  }
}
