import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiverPreviewListeComponent } from './preview.component';

describe('GiverPreviewListeComponent', () => {
  let component: GiverPreviewListeComponent;
  let fixture: ComponentFixture<GiverPreviewListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiverPreviewListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiverPreviewListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
