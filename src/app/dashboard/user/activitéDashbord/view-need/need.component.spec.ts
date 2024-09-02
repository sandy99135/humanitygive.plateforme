import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteNeedViewComponent } from './need.component';

describe(' ActiviteNeedViewComponent', () => {
  let component:  ActiviteNeedViewComponent;
  let fixture: ComponentFixture< ActiviteNeedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  ActiviteNeedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( ActiviteNeedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

