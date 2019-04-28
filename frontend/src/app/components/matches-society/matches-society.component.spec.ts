import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesSocietyComponent } from './matches-society.component';

describe('MatchesSocietyComponent', () => {
  let component: MatchesSocietyComponent;
  let fixture: ComponentFixture<MatchesSocietyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesSocietyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
