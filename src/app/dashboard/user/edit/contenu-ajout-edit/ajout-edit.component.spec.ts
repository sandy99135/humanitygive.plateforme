import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEditComponent } from './ajout-edit.component';

describe('AjoutEditComponent', () => {
  let component: AjoutEditComponent;
  let fixture: ComponentFixture<AjoutEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

