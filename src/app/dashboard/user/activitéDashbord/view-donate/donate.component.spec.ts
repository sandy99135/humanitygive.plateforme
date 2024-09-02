import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteDonateViewComponent } from './donate.component';

describe(' ActiviteDonateViewComponent', () => {
  let component:  ActiviteDonateViewComponent;
  let fixture: ComponentFixture< ActiviteDonateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  ActiviteDonateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( ActiviteDonateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

