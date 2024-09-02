import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNeedComponent } from './search-need.component';

describe('SearchNeedComponent', () => {
  let component: SearchNeedComponent;
  let fixture: ComponentFixture<SearchNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

