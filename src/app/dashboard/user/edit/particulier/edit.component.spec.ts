import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParticulierComponent } from './edit.component';

describe('EditParticulierComponent', () => {
  let component: EditParticulierComponent;
  let fixture: ComponentFixture<EditParticulierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditParticulierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

