import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDonateComponent } from './donate.component';

describe('AdminDonateComponent', () => {
  let component: AdminDonateComponent;
  let fixture: ComponentFixture<AdminDonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDonateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

