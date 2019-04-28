import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSponsorComponent } from './profile-sponsor.component';

describe('ProfileSponsorComponent', () => {
  let component: ProfileSponsorComponent;
  let fixture: ComponentFixture<ProfileSponsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSponsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
