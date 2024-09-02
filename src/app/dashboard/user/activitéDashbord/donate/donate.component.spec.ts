import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteDonateComponent } from './donate.component';

describe('ActiviteDonateComponent', () => {
  let component: ActiviteDonateComponent;
  let fixture: ComponentFixture<ActiviteDonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiviteDonateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

