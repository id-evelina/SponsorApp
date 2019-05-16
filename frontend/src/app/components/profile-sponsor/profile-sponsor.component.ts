import { Component, OnInit, ViewChild } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-profile-sponsor',
  templateUrl: './profile-sponsor.component.html',
  styleUrls: ['./profile-sponsor.component.css', './../../app.component.css']
})
export class ProfileSponsorComponent implements OnInit {

  /* My modified code starts here */

  @ViewChild('wantsTable') wantsTable: MatTable<Element>;
  @ViewChild('offersTable') offersTable: MatTable<Element>;

  id: String;
  name: String;
  contact : any;
  about: String;

  sponsor : any = {};
  sponsorWants : any = [];
  sponsorOffers : any = [];

  categoriesWant : any = [];
  yesnoWant : any = [];
  scores : any = [];
  categoriesOffer : any = [];
  yesnoOffer : any = [];

  wantsColumns = ['category', 'yesno', 'points'];
  offersColumns = ['category', 'yesno'];

  constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute) {}

  updateWantsTable (sponsor) {
    if(sponsor['size'] != 0) {
      this.categoriesWant.push("Size of society");
      this.yesnoWant.push(sponsor['size']);
      this.scores.push(sponsor['sizeCounter']);
    }
    if(sponsor['socials'] != 0) {
      this.categoriesWant.push("Socials wanted");
      this.yesnoWant.push(sponsor['socials']);
      this.scores.push(sponsor['socialsCounter']);
    }
    if(!sponsor['publicity']) {
      this.categoriesWant.push("Publicity wanted");
      this.yesnoWant.push("Yes");
      this.scores.push(sponsor['publicityCounter']);
    }
    if(!sponsor['promotionWant']) {
      this.categoriesWant.push("Promotion wanted");
      this.yesnoWant.push("Yes");
      this.scores.push(sponsor['promotionWantCounter']);
    }
    if(!sponsor['useServices']) {
      this.categoriesWant.push("Usage of your services");
      this.yesnoWant.push("Yes");
      this.scores.push(sponsor['useServicesCounter']);
    }
    if(!sponsor['additional']) {
      this.categoriesWant.push("Additional offers");
      this.yesnoWant.push("Yes");
      this.scores.push(sponsor['additionalCounter']);
    }

    for (var i = 0; i < this.categoriesWant.length; i++) {
      var sponsorPush = {category: this.categoriesWant[i], yesno: this.yesnoWant[i], points : this.scores[i]};
      this.sponsorWants.push(sponsorPush);
    }
  }

  updateOffersTable (sponsor) {
    if(sponsor['money'] != 0) {
      this.categoriesOffer.push("Funding available");
      this.yesnoOffer.push(sponsor['money']);
    }
    if(!sponsor['discount']) {
      this.categoriesOffer.push("Offer discounts");
      this.yesnoOffer.push("Yes");
    }
    if(sponsor['deals'] != 0) {
      this.categoriesOffer.push("Offer deals");
      this.yesnoOffer.push("Yes");
    }
    if(!sponsor['promotionOffer']) {
      this.categoriesOffer.push("Offer promotion");
      this.yesnoOffer.push("Yes");
    }

    for (var i = 0; i < this.categoriesOffer.length; i++) {
      var sponsorPush = {category: this.categoriesOffer[i], yesno: this.yesnoOffer[i]};
      this.sponsorOffers.push(sponsorPush);
    }
  }

  editSponsor() {
    this.router.navigate([`/editSponsor/${this.id}`]);
  }

  deleteSponsor() {
    this.router.navigate([`/`]);
  }

  findMatches() {
    this.applyMarriage();
    this.router.navigate([`/matchesSponsor/${this.id}`]);
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
      this.sponsorService.getSponsorsById(this.id).subscribe(res => {
        this.sponsor = res;
        this.name = this.sponsor.name;
        this.contact = this.sponsor.contact;
        this.about = this.sponsor.about; 
        this.updateWantsTable(this.sponsor);
        this.updateOffersTable(this.sponsor);
        this.wantsTable.renderRows();
        this.offersTable.renderRows();
      });
    });
  }
}
