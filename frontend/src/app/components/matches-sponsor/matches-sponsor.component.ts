import { Component, OnInit, ViewChild } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-matches-sponsor',
  templateUrl: './matches-sponsor.component.html',
  styleUrls: ['./matches-sponsor.component.css', './../../app.component.css']
})
export class MatchesSponsorComponent implements OnInit {

  /* My modified code starts here */
  @ViewChild('table') table: MatTable<Element>;
  society: any = [];
  societies: any = [];
  sponsorPreference: any = {};
  sponsorId: String;
  wants = "";
  offers = "";
  number = 1; 

  displayedColumns = ['number', 'name', 'contact', 'wants', 'offers', 'score'];

  constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) {  }

  updateTable (sponsorPreference) {
    if(sponsorPreference['bestMatch']) {
    for (var i = 0; i < sponsorPreference['preferenceList'].length; i++) {
      if(sponsorPreference['preferenceList'][i].society == sponsorPreference.bestMatch) {
        this.gatherSocietyData(sponsorPreference['preferenceList'], i);
        var k = 0;
        for(var j = 0; j < sponsorPreference['preferenceList'].length; j++) {
          if (i != j && k < 4) {
            this.gatherSocietyData(sponsorPreference['preferenceList'], j);
            k++;
          }
        }
      }
    }
    } else {
    document.getElementById("matchExists").style.display = "none";
    document.getElementById("noMatch").style.display = "block";
    for(var j = 0; j < 5; j++)
      this.gatherSocietyData(sponsorPreference['preferenceList'], j);
    }
  }

  gatherSocietyData (preferenceList, i) {
    this.sponsorService.getSocietiesById(preferenceList[i].society).subscribe(res => {
      this.society = res;
      for (var j = 0; j < preferenceList[i].notMatch.length; j++) {
        if (preferenceList[i].notMatch[j] === "money")
          this.offers = "Money; ";
        if (preferenceList[i].notMatch[j] === "discount")
          this.offers += "Discounts; ";
        if (preferenceList[i].notMatch[j] === "deals")
          this.offers += "Deals; ";
        if (preferenceList[i].notMatch[j] === "promotion")
          this.offers += "Promotion; ";
        if (preferenceList[i].notMatch[j] === "size")
          this.wants = "Size of society; ";
        if (preferenceList[i].notMatch[j] === "socials")
          this.wants += "Promotion; "
        if (preferenceList[i].notMatch[j] === "publicity")
          this.wants += "Publicity; ";
        if (preferenceList[i].notMatch[j] === "promotion")
          this.wants += "Promotion; ";
        if (preferenceList[i].notMatch[j] === "useServices")
          this.wants += "Use services; ";
        if (preferenceList[i].notMatch[j] === "additional")
          this.wants += "Additional services; ";
        }
        var score : any;
        score = +preferenceList[i].matchScore;
        score = score.toFixed(2);
      var societyPush = {number: this.number, name: this.society.name, contact: this.society.contact, about: this.society.about, wants: this.wants, offers: this.offers,score: score};
      this.societies.push(societyPush);
      this.number++;
     
      this.table.dataSource = this.societies;
      this.table.renderRows();
      });
  }

  back(){
    this.router.navigate([`/profileSponsor/${this.sponsorId}`]);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sponsorId = params.id;
      this.sponsorService.getSponsorPreferenceBySponsor(this.sponsorId).subscribe(res => {
        this.sponsorPreference = res;
        this.updateTable(this.sponsorPreference);
      });
    });
  }
}
