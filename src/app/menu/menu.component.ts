import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '@services/auth/auth.service';
import { LoginComponent } from '@modals/login.component';
import { MenuNavbarComponent } from './menu-navbar.component';

@Component({
  selector: 'app-menu',
  imports: [MenuNavbarComponent],
  template: `<app-menu-navbar
    [isAdmin]="isAdmin()"
    [isLoggedIn]="isLoggedIn()"
    [isNavbarCollapsed]="isNavbarCollapsed()"
    (login)="login()"
    (logout)="logout()"
    (toggleNavigation)="toggleNavigation()" />`,
})
export class MenuComponent {
  readonly #auth = inject(AuthService);
  readonly #modalService = inject(NgbModal);
  readonly #router = inject(Router);

  protected readonly isNavbarCollapsed = signal(false);
  protected readonly isLoggedIn = this.#auth.isLoggedIn;
  protected readonly isAdmin = this.#auth.isLoggedInAsAdmin;

  protected login() {
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
