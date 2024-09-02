import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteNeedComponent } from './need.component';

describe(' ActiviteNeedComponent', () => {
  let component:  ActiviteNeedComponent;
  let fixture: ComponentFixture< ActiviteNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  ActiviteNeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent( ActiviteNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

