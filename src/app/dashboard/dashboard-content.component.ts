import { Component, input } from '@angular/core';
import { CourseData } from '@models/course';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartCardComponent } from '@shared/components/chart-card.component';

@Component({
  selector: 'app-dashboard-content',
  imports: [NgbModule, ChartCardComponent],
  template: `
    <section>
      <div class="container-fluid">
        <div class="row first-row">
          <div class="col-xm-12 col-sm-6">
            <app-chart-card [data]="paths()" title="Completed Courses - Path" />
          </div>

          <div class="col-xm-12 col-sm-6">
            <app-chart-card [data]="sources()" title="Completed Courses - Source" />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class DashboardContentComponent {
  paths = input.required<CourseData[]>();
  sources = input.required<CourseData[]>();
}
