import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateEditComponent } from './event.component';

describe('DonateEditComponent', () => {
  let component: DonateEditComponent;
  let fixture: ComponentFixture<DonateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

