import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionEmailComponent } from './email.component';

describe('ConnexionEmailComponent', () => {
  let component: ConnexionEmailComponent;
  let fixture: ComponentFixture<ConnexionEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnexionEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnexionEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
