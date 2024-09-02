import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReiceiverComponent } from './search-receiver.component';

describe('SearchReiceiverComponent', () => {
  let component: SearchReiceiverComponent;
  let fixture: ComponentFixture<SearchReiceiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchReiceiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchReiceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

