import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedCreatComponent } from './need.component';

describe('NeedCreatComponent', () => {
  let component: NeedCreatComponent;
  let fixture: ComponentFixture<NeedCreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeedCreatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

