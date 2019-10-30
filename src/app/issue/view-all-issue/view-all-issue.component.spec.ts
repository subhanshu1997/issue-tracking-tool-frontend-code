import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllIssueComponent } from './view-all-issue.component';

describe('ViewAllIssueComponent', () => {
  let component: ViewAllIssueComponent;
  let fixture: ComponentFixture<ViewAllIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
