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
  if(society['discount']) {
    this.categoriesWant.push("Discounts offered by companies");
    this.yesnoWant.push("Yes");
    this.scores.push(society['discountCounter']);
  }
  if(society['deals']) {
    this.categoriesWant.push("Deals with companies wanted");
    this.yesnoWant.push("Yes");
    this.scores.push(society['dealsCounter']);
  }
  if(society['promotionWant']) {
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
  if(society['socials'] != 0) {
    this.categoriesOffer.push("Number of socials willing to be hosted");
    this.yesnoOffer.push(society['socials']);
  }
  if(society['publicity']) {
    this.categoriesOffer.push("Publicity");
    this.yesnoOffer.push("Yes");
  }
  if(society['promotionOffer']) {
    this.categoriesOffer.push("Offer promotion");
    this.yesnoOffer.push("Yes");
  }

  if(society['useServices']) {
    this.categoriesOffer.push("Usage of your services");
    this.yesnoOffer.push("Yes");
  }
  if(society['additional']) {
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
  var societies : any = [];
  var sponsors : any = [];

  this.sponsorService.getSocietyPreference().subscribe(res => {
    societiesPreference = res;
    this.sponsorService.getSponsorPreference().subscribe( res => {
      sponsorsPreference = res;
      this.sponsorService.getSocieties().subscribe(res=> {
        societies = res;
        this.sponsorService.getSponsors().subscribe(res =>{
          sponsors = res;
          this.engageEveryone(sponsorsPreference, societiesPreference, societies, sponsors);
        });
      });
    });
  });
}
        
engageEveryone(sponsorsPreference, societiesPreference, societies, sponsors) {

  var societyPreference : any = {};
  var sponsorPreference : any = {};
  var done;
  var location = 0;

  var societyList;
  var sponsorList;

  var societiesList :any = [];
  var sponsorsList : any = [];

  //creating a list for societies that contains the society ID and their best match, will be used for the algorithm only
  for (var i = 0; i < societies.length; i++) {
    societiesList.push({society: societies[i]["_id"], bestMatch: null})
  }

  //creating a list for sponsors that contains the sponsor ID and their best match, will be used for the algorithm only
  for (var i = 0; i < sponsors.length; i++) {
    sponsorsList.push({sponsor: sponsors[i]["_id"], bestMatch: null})
  }

  var listIndex = 0;
  if(sponsorsList.length < societiesList.length) {
    do {
      done = true;
      for (var i = 0; i < sponsorsList.length; i++) {
        //if the selected sponsor doesn't have a best match
        if(!sponsorsList[i]['bestMatch']) {
          done = false;

          //find the selected sponsor's preference information
          for (var k = 0; k < sponsorsPreference.length; k++) {
            if(sponsorsPreference[k]['sponsor'] == sponsorsList[i]['sponsor'])
              sponsorPreference = sponsorsPreference[k];
          }
        
          //proceed until done with the sponsor's preference list
          if (listIndex < sponsorPreference['preferenceList'].length) {
            //select a society from the sponsor's preference list
            var societyId = sponsorPreference['preferenceList'][listIndex]["society"];
            listIndex++;

            //iterate through the societies to find the selected society's preference list and info
            for (var j = 0; j < societiesList.length; j++) {
              if (societiesList[j]["society"] == societyId){
                societyList = societiesList[j];
                location = j;  
              }
              if (societiesPreference[j]["society"] == societyId) {
                societyPreference = societiesPreference[j];
              }
            }
      
            //proceed if the society doesn't have a best match OR the society prefers the current sponsor to their best match
            if(!societyList['bestMatch'] || this.prefers(sponsorsList[i]["sponsor"], societyPreference, societyList['bestMatch'])) {   
                  if(sponsorsList[i]['bestMatch']) {
                    for (var j = 0; j < societiesList.length; j++) {
                      if (societiesList[j]["society"] == sponsorsList[i]['bestMatch']){
                        societiesList[j]['bestMatch'] = null;
                      }
                    }
                  }
                  //if the society has a best match sponsor already, make that sponsor's best match null (break off the marriage)
                  if(societyList['bestMatch']) {
                    for (var j = 0; j < sponsorsList.length; j++) {
                      if (sponsorsList[j]["sponsor"] == societyList['bestMatch']){
                        sponsorsList[j]['bestMatch'] = null;
                      }
                    }
                  }
                  //make the selected sponsor and society each others' best matches
                  sponsorsList[i]['bestMatch'] = societyList['society'];
                  societiesList[location]['bestMatch'] = sponsorsList[i]['sponsor'];
            }
          }
        }   
      } 
    } while (!done);
  } else {
    do {
      done = true;
      for (var i = 0; i < societiesList.length; i++) {
        //if the selected society doesn't have a best match
        if(!societiesList[i]['bestMatch']) {
          done = false;

          //find the selected society's preference information
          for (var k = 0; k < societiesPreference.length; k++) {
            if(societiesPreference[k]['society'] == societiesList[i]['society'])
              societyPreference = societiesPreference[k];
          }
        
          //proceed until done with the society's preference list
          if (listIndex < societyPreference['preferenceList'].length) {
            //select a sponsor from the society's preference list
            var sponsorId = societyPreference['preferenceList'][listIndex]["sponsor"];
            listIndex++;

            //iterate through the sponsors to find the selected sponsor's preference list and info
            for (var j = 0; j < sponsorsList.length; j++) {
              if (sponsorsList[j]["sponsor"] == sponsorId){
                sponsorList = sponsorsList[j];
                location = j;  
              }
              if (sponsorsPreference[j]["sponsor"] == sponsorId) {
                sponsorPreference = sponsorsPreference[j];
              }
            }
      
            //proceed if the sponsor doesn't have a best match OR the sponsor prefers the current society to their best match
            if(!sponsorList['bestMatch'] || this.prefers(societiesList[i]["society"], sponsorPreference, sponsorList['bestMatch'])) {   
                  if(societiesList[i]['bestMatch']) {
                    for (var j = 0; j < sponsorsList.length; j++) {
                      if (sponsorsList[j]["sponsor"] == societiesList[i]['bestMatch']){
                        sponsorsList[j]['bestMatch'] = null;
                      }
                    }
                  }
                  //if the sponsor has a best match society already, make that society's best match null (break off the marriage)
                  if(sponsorList['bestMatch']) {
                    for (var j = 0; j < societiesList.length; j++) {
                      if (societiesList[j]["society"] == sponsorList['bestMatch']){
                        societiesList[j]['bestMatch'] = null;
                      }
                    }
                  }
                  //make the selected sponsor and society each others' best matches
                  societiesList[i]['bestMatch'] = sponsorList["sponsor"];
                  sponsorsList[location]['bestMatch'] = societiesList[i]['society'];
            }
          }
        }   
      } 
    } while (!done);
  }


  //update the database with the new matches
  for (var j = 0; j < sponsorsList.length; j++) {
    this.updateSponsorPreferenceBestMatch(sponsorsList[j]['sponsor'], sponsorsList[j]['bestMatch']);
  }

  for (var j = 0; j < societiesList.length; j++) {
    this.updateSocietyPreferenceBestMatch(societiesList[j]['society'], societiesList[j]['bestMatch']); 
  }
  
  /** Check whether the Stable Marriage algorithm has worked correctly**/
  for (var i = 0; i < sponsorsList.length; i++){
    for (var j = 0; j < societiesList.length; j++) {
      for (var k = 0; k < sponsorsPreference.length; k++) {
          if(sponsorsPreference[k]['sponsor'] == sponsorsList[i]['sponsor'])
            sponsorPreference = sponsorsPreference[k];
        }
        for (var k = 0; k < societiesPreference.length; k++) {
          if(societiesPreference[k]['society'] == societiesList[j]['sponsor'])
            societyPreference = societiesPreference[k];
        }
        if (this.prefers(sponsorsList[i]["sponsor"], societyPreference, societiesList[j]['bestMatch'])  && this.prefers(societiesList[j]["ociety"], sponsorPreference, sponsorsList[i]['bestMatch']))
            console.log("Stable marriage is not stable");
      }
    }
    console.log("Stable Marriage Algorithm is stable");
}

updateSocietyPreferenceBestMatch(society, bestMatch) {
  this.sponsorService.editSocietyPreferenceBestMatch(society, bestMatch).subscribe(() => {});
}

updateSponsorPreferenceBestMatch(sponsor, bestMatch) {
  this.sponsorService.editSponsorPreferenceBestMatch(sponsor, bestMatch).subscribe(() => {});
}

//returns the rank of a user in the list 
rank(user, preferenceList) {
  for (var i = 0; i < preferenceList.length; i++) {
    if (preferenceList[i] === user)
      return i;
  }
  return preferenceList.length + 1;
}

//returns true if the given user is preferred over the current bestMatch
prefers (user, preferenceList, bestMatch) {
  return this.rank(user, preferenceList['preferenceList']) < this.rank(bestMatch, preferenceList['preferenceList']);
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