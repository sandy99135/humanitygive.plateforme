import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TunnelGiverComponent } from './tunnel.component';

describe('TunnelGiverComponent', () => {
  let component: TunnelGiverComponent;
  let fixture: ComponentFixture<TunnelGiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TunnelGiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TunnelGiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
