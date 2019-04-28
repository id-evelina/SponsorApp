import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-sponsor',
  templateUrl: './profile-sponsor.component.html',
  styleUrls: ['./profile-sponsor.component.css']
})
export class ProfileSponsorComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
  }

}
