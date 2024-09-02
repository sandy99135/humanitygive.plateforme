import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunnelReceiverComponent } from './tunnel.component';

describe('TunnelReceiverComponent', () => {
  let component: TunnelReceiverComponent;
  let fixture: ComponentFixture<TunnelReceiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TunnelReceiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TunnelReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
