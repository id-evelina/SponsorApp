import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-sponsor',
  templateUrl: './edit-sponsor.component.html',
  styleUrls: ['./edit-sponsor.component.css']
})
export class EditSponsorComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
  }

}
