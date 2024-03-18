import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Store, select } from '@ngrx/store';

import * as fromRoot from '@store/index';
import { coursesActions } from '@store/course/course.actions';
import { coursesFeature } from '@store/course/course.state';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgbModule, NgxChartsModule],

  template: `
    <section>
      <div class="container-fluid">
        <div class="row first-row">
          <div class="card col-xm-12 col-sm-6">
            <div class="card-body">
              <h4 class="card-title">Completed Courses - Paths</h4>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="courses()"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
              >
              </ngx-charts-pie-chart>
            </div>
          </div>

          <div class="card col-xm-12 col-sm-6">
            <div class="card-body">
              <h4 class="card-title">Completed Courses - Sources</h4>
              <ngx-charts-pie-chart
                [view]="[400, 400]"
                [results]="sources()"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.5"
              >
              </ngx-charts-pie-chart>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  styles: [],
})
export class DashboardComponent implements OnInit {
  private store = inject(Store<fromRoot.State>);

  courses = toSignal(this.store.pipe(select(coursesFeature.selectCoursesByPath)), { initialValue: [] });
  sources = toSignal(this.store.pipe(select(coursesFeature.selectCoursesBySource)), { initialValue: [] });

  ngOnInit() {
    this.store.dispatch(coursesActions.getTotalCourses());
  }
}
