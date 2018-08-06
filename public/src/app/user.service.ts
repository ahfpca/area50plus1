import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get('/api/users');
  }

  getOne(id: string) {
    return this._http.get('/api/users/' + id);
  }

  getByName(name: String) {
    return this._http.get('/api/users/' + name + '/name');
  }

  create(user: any) {
    return this._http.post('/api/users', user);
  }

  update(user: any) {
    return this._http.put('/api/users/' + user._id, user);
  }

  delete(id: string) {
    return this._http.delete('/api/users/' + id);
  }
}
