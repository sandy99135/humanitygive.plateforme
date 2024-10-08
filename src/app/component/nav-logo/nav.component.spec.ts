import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLogoComponent } from './nav.component';

describe('NavLogoComponent', () => {
  let component: NavLogoComponent;
  let fixture: ComponentFixture<NavLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
