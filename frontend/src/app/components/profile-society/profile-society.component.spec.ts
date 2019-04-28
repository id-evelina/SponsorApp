import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSocietyComponent } from './profile-society.component';

describe('ProfileSocietyComponent', () => {
  let component: ProfileSocietyComponent;
  let fixture: ComponentFixture<ProfileSocietyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSocietyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
