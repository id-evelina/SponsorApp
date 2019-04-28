import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
    this.sponsorService.getSocieties().subscribe((societies) => {
      console.log(societies);
    });
  }
}
