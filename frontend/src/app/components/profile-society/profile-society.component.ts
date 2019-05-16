import { Component, OnInit, ViewChild } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTable } from '@angular/material';


@Component({
  selector: 'app-profile-society',
  templateUrl: './profile-society.component.html',
  styleUrls: ['./profile-society.component.css', './../../app.component.css']
})
export class ProfileSocietyComponent implements OnInit {

  /* My modified code starts here */

  @ViewChild('wantsTable') wantsTable: MatTable<Element>;
  @ViewChild('offersTable') offersTable: MatTable<Element>;

  id: String;
  name: String;
  contact : any;
  about: String;

  society : any = {};
  societyWants : any = [];
  societyOffers : any = [];

  categoriesWant : any = [];
  yesnoWant : any = [];
  scores : any = [];
  categoriesOffer : any = [];
  yesnoOffer : any = [];

  wantsColumns = ['category', 'yesno', 'points'];
  offersColumns = ['category', 'yesno'];

constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) {}

updateWantsTable (society) {
  if(society['money'] != 0) {
    this.categoriesWant.push("Funding wanted");
    this.yesnoWant.push(society['money']);
    this.scores.push(society['moneyCounter']);
  }
  if(society['discount'] != 0) {
    this.categoriesWant.push("Discounts offered by companies");
    this.yesnoWant.push("Yes");
    this.scores.push(society['discountCounter']);
  }
  if(!society['deals']) {
    this.categoriesWant.push("Deals with companies wanted");
    this.yesnoWant.push("Yes");
    this.scores.push(society['dealsCounter']);
  }
  if(!society['promotionWant']) {
    this.categoriesWant.push("Promotion wanted");
    this.yesnoWant.push("Yes");
    this.scores.push(society['promotionWantCounter']);
  }
 
  for (var i = 0; i < this.categoriesWant.length; i++) {
    var societyPush = {category: this.categoriesWant[i], yesno: this.yesnoWant[i], points : this.scores[i]};
    this.societyWants.push(societyPush);
  }
}

updateOffersTable (society) {
  if(society['size'] != 0) {
    this.categoriesOffer.push("Size of society");
    this.yesnoOffer.push(society['size']);
  }
  if(!society['socials']) {
    this.categoriesOffer.push("Number of socials willing to be hosted");
    this.yesnoOffer.push(society['socials']);
  }
  if(society['publicity'] != 0) {
    this.categoriesOffer.push("Publicity");
    this.yesnoOffer.push("Yes");
  }
  if(!society['promotionOffer']) {
    this.categoriesOffer.push("Offer promotion");
    this.yesnoOffer.push("Yes");
  }

  if(!society['useServices']) {
    this.categoriesOffer.push("Usage of your services");
    this.yesnoOffer.push("Yes");
  }
  if(!society['additional']) {
    this.categoriesOffer.push("Additional offers");
    this.yesnoOffer.push("Yes");
  }

  for (var i = 0; i < this.categoriesOffer.length; i++) {
    var societyPush = {category: this.categoriesOffer[i], yesno: this.yesnoOffer[i]};
    this.societyOffers.push(societyPush);
  }
}

editSociety() {
  this.router.navigate([`/editSociety/${this.id}`]);
}

findMatches() {
  this.applyMarriage();
  this.router.navigate([`/matchesSociety/${this.id}`]);
}

applyMarriage(){
  var societiesPreference : any = [];
  var sponsorsPreference : any = [];

  this.sponsorService.getSocietyPreference().subscribe(res => {
    societiesPreference = res;
    this.sponsorService.getSponsorPreference().subscribe(res => {
        sponsorsPreference = res;
        this.engageEveryone(sponsorsPreference, societiesPreference)
    });
  });
}
engageEveryone(sponsorsPreference, societiesPreference) {
  var societyPreference : any = {};
  var sponsorPreference : any = {};
  var done;
  do {
    done = true;
    for (var i = 0; i < societiesPreference.length; i++) {
      societyPreference = societiesPreference[i];
      var listIndex = 0;
      if(societyPreference.bestMatch) {
        done = false;
        //going through a selected society's own preference list of sponsors
        if (listIndex < societyPreference['preferenceList'].length) {
          var sponsorId = societyPreference['preferenceList'][listIndex].sponsor;
          listIndex++;

          //going through sponsorsPreference to find the selected sponsor's details such as their best match
          for (i = 0; i < sponsorsPreference.length; i++) {
            if(sponsorsPreference[i].sponsor === sponsorId)
              sponsorPreference = sponsorsPreference[i];
          }
          if(!sponsorPreference.bestMatch || prefers(sponsorPreference, societyPreference)) {
            engage(sponsorPreference, societyPreference);
          }
        }
      }
    }
  } while (!done);

  //returns true if the given user is preferred over the current bestMatch
  function prefers (user, societyPreference) {
    return rank(user, societyPreference['preferenceList']) < rank(societyPreference.bestMatch, societyPreference['preferenceList']);
  }

  //returns the rank of a user in the list 
  function rank (user, preferenceList) {
    for (var i = 0; i < preferenceList.length; i++) {
      if (preferenceList[i] === user)
        return i;
    }
    return preferenceList.length + 1;
  }

  function engage(sponsorPreference, societyPreference) {
    if(sponsorPreference.bestMatch) {
      for (var i = 0; i < societiesPreference.length; i++) {
        if (societiesPreference.society === sponsorPreference.bestMatch)
          societiesPreference.society = null;
      }
      sponsorPreference.bestMatch = societyPreference.society; 
    }
    if (societyPreference.bestMatch) {
      for (var i = 0; i < sponsorsPreference.length; i++) {
        if (sponsorsPreference.sponsor === societyPreference.bestMatch)
          sponsorsPreference.sponsor = null;
      }
      societyPreference.bestMatch = sponsorPreference.sponsor;
    }
  }
}

ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.sponsorService.getSocietiesById(this.id).subscribe(res => {
        this.society = res;
        this.name = this.society.name;
        this.contact = this.society.contact;
        this.about = this.society.about; 
        this.updateWantsTable(this.society);
        this.updateOffersTable(this.society);
        this.wantsTable.renderRows();
        this.offersTable.renderRows();
      });
    });
  }
}