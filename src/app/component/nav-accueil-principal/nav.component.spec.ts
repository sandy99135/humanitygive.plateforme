import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPrincipalComponent } from './nav.component';

describe('NavPrincipalComponent', () => {
  let component: NavPrincipalComponent;
  let fixture: ComponentFixture<NavPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavPrincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
