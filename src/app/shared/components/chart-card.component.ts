import { Component, input } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CourseData } from '@models/course';

@Component({
  selector: 'app-chart-card',
  imports: [NgbModule, NgxChartsModule],
  template: `
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">{{ title() }}</h4>
        <ngx-charts-pie-chart [view]="[400, 400]" [results]="data()" [labels]="true" [doughnut]="true" [arcWidth]="0.5">
        </ngx-charts-pie-chart>
      </div>
    </div>
  `,
  styles: ``,
})
export class ChartCardComponent {
  data = input.required<CourseData[]>();
  title = input<string>('');
}
