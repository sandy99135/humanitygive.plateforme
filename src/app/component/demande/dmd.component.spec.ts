import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmdComponent } from './dmd.component';

describe('DmdComponent', () => {
  let component: DmdComponent;
  let fixture: ComponentFixture<DmdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

