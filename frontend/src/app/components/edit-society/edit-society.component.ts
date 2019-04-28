import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-society',
  templateUrl: './edit-society.component.html',
  styleUrls: ['./edit-society.component.css']
})
export class EditSocietyComponent implements OnInit {

  constructor(private sponsorService: SponsorService) { }

  ngOnInit() {
  }

}
