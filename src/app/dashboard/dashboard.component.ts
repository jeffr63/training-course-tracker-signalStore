import { Component, inject } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CoursesStore } from '@store/course.store';
import { DashboardContentComponent } from './dashboard-content.component';

@Component({
    selector: 'app-dashboard',
    imports: [DashboardContentComponent],
    template: `<app-dashboard-content [paths]="paths()" [sources]="sources()" />`,
    styles: []
})
export class DashboardComponent {
  readonly #courseStore = inject(CoursesStore);

  protected readonly paths = this.#courseStore.coursesByPath;
  protected readonly sources = this.#courseStore.coursesBySource;
}
