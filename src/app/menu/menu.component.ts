import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '@services/auth.service';
import { LoginComponent } from '@modals/login.component';

@Component({
  selector: 'app-menu',
  standalone: true,
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
        (click)="toggleNavigation()">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div (ngbCollapse)="isNavbarCollapsed()" class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <a class="nav-item nav-link active" [routerLink]="['/']" id="home">Home</a>
          <a class="nav-item nav-link" [routerLink]="['/courses']" id="courses">Courses</a>
          @if (isLoggedIn()) { @if (isAdmin()) {
          <a class="nav-item nav-link" [routerLink]="['/admin']" id="admin">Admin</a>
          }
          <a class="nav-item nav-link" (click)="logout()" id="logout">Logout</a>
          } @else {
          <a class="nav-item nav-link" (click)="open()" id="login">Login</a>
          }
        </div>
      </div>
    </nav>
  `,

  styles: [
    `
      div .nav-item {
        cursor: pointer;
      }
    `,
  ],
})
export class MenuComponent {
  readonly #auth = inject(AuthService);
  readonly #modalService = inject(NgbModal);
  readonly #router = inject(Router);

  protected readonly isNavbarCollapsed = signal(false);
  protected readonly isLoggedIn = this.#auth.isLoggedIn;
  protected readonly isAdmin = this.#auth.isLoggedInAsAdmin;

  protected open() {
    this.#modalService.open(LoginComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result) {
        this.#auth.login(result.email, result.password).subscribe();
      }
    });
  }

  protected logout() {
    this.#auth.logout();
    this.#router.navigate(['/']);
  }

  protected toggleNavigation(): void {
    this.isNavbarCollapsed.set(!this.isNavbarCollapsed());
  }
}
