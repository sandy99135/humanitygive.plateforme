import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunnelMixteComponent } from './tunnel.component';

describe('TunnelMixteComponent', () => {
  let component: TunnelMixteComponent;
  let fixture: ComponentFixture<TunnelMixteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TunnelMixteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TunnelMixteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
