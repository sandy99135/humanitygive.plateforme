import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreatComponent } from './event.component';

describe('EventCreatComponent', () => {
  let component: EventCreatComponent;
  let fixture: ComponentFixture<EventCreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCreatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

