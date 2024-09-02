import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profil3Component } from './profil.component';

describe('Profil3Component', () => {
  let component: Profil3Component;
  let fixture: ComponentFixture<Profil3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Profil3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Profil3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

