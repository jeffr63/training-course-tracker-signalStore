import { Component, inject } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CoursesStore } from '@store/course.store';

@Component({
    selector: 'app-dashboard',
    imports: [NgbModule, NgxChartsModule],
    template: `
    <section>
      <div class="container-fluid">
        <div class="row first-row">
          <div class="card col-xm-12 col-sm-6">
            <div class="card-body">
              <h4 class="card-title">Completed Courses - Paths</h4>
              <ngx-charts-pie-chart [view]="[400, 400]" [results]="courses()" [labels]="true" [doughnut]="true" [arcWidth]="0.5"> </ngx-charts-pie-chart>
            </div>
          </div>

          <div class="card col-xm-12 col-sm-6">
            <div class="card-body">
              <h4 class="card-title">Completed Courses - Sources</h4>
              <ngx-charts-pie-chart [view]="[400, 400]" [results]="sources()" [labels]="true" [doughnut]="true" [arcWidth]="0.5"> </ngx-charts-pie-chart>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: []
})
export class DashboardComponent {
  readonly #courseStore = inject(CoursesStore);

  protected readonly courses = this.#courseStore.coursesByPath;
  protected readonly sources = this.#courseStore.coursesBySource;
}
