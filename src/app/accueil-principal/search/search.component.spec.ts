import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHomePrincipalComponent } from './search.component';

describe('SearchHomePrincipalComponent', () => {
  let component: SearchHomePrincipalComponent;
  let fixture: ComponentFixture<SearchHomePrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchHomePrincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHomePrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
