import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matches-society',
  templateUrl: './matches-society.component.html',
  styleUrls: ['./matches-society.component.css']
})
export class MatchesSocietyComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
  }

}
