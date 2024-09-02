import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitéComponent} from './activité.component';

describe('ActivitéComponent', () => {
  let component: ActivitéComponent;
  let fixture: ComponentFixture<ActivitéComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitéComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitéComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

