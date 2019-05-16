import { Component, OnInit, ViewChild } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-matches-society',
  templateUrl: './matches-society.component.html',
  styleUrls: ['./matches-society.component.css', './../../app.component.css']
})
export class MatchesSocietyComponent implements OnInit {

  /* My modified code starts here */

  @ViewChild('table') table: MatTable<Element>;
  sponsor: any = [];
  sponsors: any = [];
  societyPreference: any = {};
  societyId: String;
  wants = "";
  offers = "";
  number = 1;

  displayedColumns = ['number', 'name', 'contact', 'wants', 'offers', 'score'];

  constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) {    }

  updateTable (societyPreference) {
    for (var i = 0; i < societyPreference['preferenceList'].length; i++) {
      if(societyPreference['preferenceList'][i].sponsor == societyPreference.bestMatch) {
        this.gatherSponsorData(societyPreference['preferenceList'], i);
        var k = 0;
          
        for(var j = 0; j < societyPreference['preferenceList'].length; j++) {
          if (i != j && k < 4) {
            this.gatherSponsorData(societyPreference['preferenceList'], j);
            k++;
          }
        }
      }
    }
  }

  gatherSponsorData (preferenceList, i) {
    this.sponsorService.getSponsorsById(preferenceList[i].sponsor).subscribe(res => {
      this.sponsor = res;
      for (var j = 0; j < preferenceList[i].notMatch.length; j++) {
        if (preferenceList[i].notMatch[j] === "money")
          this.wants = "Money; ";
        if (preferenceList[i].notMatch[j] === "discount")
          this.wants += "Discounts; ";
        if (preferenceList[i].notMatch[j] === "deals")
          this.wants += "Deals; ";
        if (preferenceList[i].notMatch[j] === "promotion")
          this.wants += "Promotion; ";
        if (preferenceList[i].notMatch[j] === "size")
          this.offers = "Size of society; ";
        if (preferenceList[i].notMatch[j] === "socials")
          this.offers += "Promotion; "
        if (preferenceList[i].notMatch[j] === "publicity")
          this.offers += "Publicity; ";
        if (preferenceList[i].notMatch[j] === "promotion")
          this.offers += "Promotion; ";
        if (preferenceList[i].notMatch[j] === "useServices")
          this.offers += "Use services; ";
        if (preferenceList[i].notMatch[j] === "additional")
          this.offers += "Additional services; ";
        }
      var sponsorPush = {number: this.number, name: this.sponsor.name, contact: this.sponsor.contact, about: this.sponsor.about, wants: this.wants, offers: this.offers,score: preferenceList[i].matchScore};
      this.sponsors.push(sponsorPush);
      this.number++;

      this.table.dataSource = this.sponsors;
      this.table.renderRows();
      });
  }

  back(){
    this.router.navigate([`/profileSociety/${this.societyId}`]);
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.societyId = params.id;
      this.sponsorService.getSocietyPreferenceBySociety(this.societyId).subscribe(res => {
        this.societyPreference = res;
        this.updateTable(this.societyPreference);
      });
    });
  }
}