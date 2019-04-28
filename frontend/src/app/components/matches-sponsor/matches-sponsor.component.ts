import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matches-sponsor',
  templateUrl: './matches-sponsor.component.html',
  styleUrls: ['./matches-sponsor.component.css']
})
export class MatchesSponsorComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
  }

}
