import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-society',
  templateUrl: './profile-society.component.html',
  styleUrls: ['./profile-society.component.css']
})
export class ProfileSocietyComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
  }

}
