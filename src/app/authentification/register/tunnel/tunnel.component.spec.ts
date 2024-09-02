import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTunnelComponent } from './tunnel.component';

describe('RegisterTunnelComponent', () => {
  let component: RegisterTunnelComponent;
  let fixture: ComponentFixture<RegisterTunnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTunnelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
