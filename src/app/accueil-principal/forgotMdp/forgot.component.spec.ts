import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotMdpComponent } from './forgot.component';

describe('ForgotMdpComponent', () => {
  let component: ForgotMdpComponent;
  let fixture: ComponentFixture<ForgotMdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotMdpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotMdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
