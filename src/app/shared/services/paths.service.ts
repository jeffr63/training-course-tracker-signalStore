import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Path } from '@models/paths';

@Injectable({
  providedIn: 'root',
})
export class PathsService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:3000';

  add(path: Path) {
    return this.http.post(`${this.baseUrl}/paths`, path);
  }

  delete(id) {
    return this.http.delete<Path>(`${this.baseUrl}/paths/${id}`);
  }

  get(id) {
    return this.http.get<Path>(`${this.baseUrl}/paths/${id}`);
  }

  load() {
    return this.http.get<Path[]>(`${this.baseUrl}/paths?_sort=name&_order=asc`);
  }

  save(path: Path) {
    if (path.id) {
      return this.update(path);
    } else {
      return this.add(path);
    }
  }

  update(path: Path) {
    return this.http.put(`${this.baseUrl}/paths/${path.id}`, path);
  }
}
