import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceiverMixteComponent } from './edit.component';

describe('EditReceiverMixteComponent', () => {
  let component: EditReceiverMixteComponent;
  let fixture: ComponentFixture<EditReceiverMixteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReceiverMixteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReceiverMixteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

