import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEmailComponent } from './email.component';

describe('RegisterEmailComponent', () => {
  let component: RegisterEmailComponent;
  let fixture: ComponentFixture<RegisterEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
