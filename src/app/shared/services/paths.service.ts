import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Path } from '@models/paths';

@Injectable({
  providedIn: 'root',
})
export class PathsService {
  readonly #http = inject(HttpClient);

  readonly #baseUrl = 'http://localhost:3000';

  public add(path: Path) {
    return this.#http.post(`${this.#baseUrl}/paths`, path);
  }

  public delete(id) {
    return this.#http.delete<Path>(`${this.#baseUrl}/paths/${id}`);
  }

  public get(id) {
    return this.#http.get<Path>(`${this.#baseUrl}/paths/${id}`);
  }

  public load() {
    return this.#http.get<Path[]>(`${this.#baseUrl}/paths?_sort=name&_order=asc`);
  }

  public save(path: Path) {
    if (path.id) {
      return this.update(path);
    } else {
      return this.add(path);
    }
  }

  public update(path: Path) {
    return this.#http.put(`${this.#baseUrl}/paths/${path.id}`, path);
  }
}
