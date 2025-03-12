import { Component, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu-navbar',
  imports: [NgbModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" [routerLink]="['/']" id="brand">Training Courses Tracker</a>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
        (click)="toggleNavigation.emit()">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div (ngbCollapse)="isNavbarCollapsed()" class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <a class="nav-item nav-link active" [routerLink]="['/']" id="home">Home</a>
          <a class="nav-item nav-link" [routerLink]="['/courses']" id="courses">Courses</a>
          @if (isLoggedIn()) { @if (isAdmin()) {
          <a class="nav-item nav-link" [routerLink]="['/admin']" id="admin">Admin</a>
          }
          <a class="nav-item nav-link" (click)="logout.emit()" id="logout">Logout</a>
          } @else {
          <a class="nav-item nav-link" (click)="login.emit()" id="login">Login</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: `
    div .nav-item {
      cursor: pointer;
    }
  `,
})
export class MenuNavbarComponent {
  isAdmin = input.required<boolean>();
  isLoggedIn = input.required<boolean>();
  isNavbarCollapsed = input.required<boolean>();
  login = output();
  logout = output();
  toggleNavigation = output();
}
