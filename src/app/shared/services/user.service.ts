import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '@models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #http = inject(HttpClient);

  readonly #baseUrl = 'http://localhost:3000';

  public delete(id: number) {
    return this.#http.delete<User>(`${this.#baseUrl}/users/${id}`);
  }

  public get(id: number) {
    return this.#http.get<User>(`${this.#baseUrl}/users/${id}`);
  }

  public load() {
    return this.#http.get<User[]>(`${this.#baseUrl}/users?_sort=name&_order=asc`);
  }

  public patch(id: number, data: any) {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.#http.patch<any>(`${this.#baseUrl}/users/${id}`, data, { headers: httpHeaders });
  }
}
