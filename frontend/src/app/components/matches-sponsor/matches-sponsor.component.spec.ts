import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesSponsorComponent } from './matches-sponsor.component';

describe('MatchesSponsorComponent', () => {
  let component: MatchesSponsorComponent;
  let fixture: ComponentFixture<MatchesSponsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesSponsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
