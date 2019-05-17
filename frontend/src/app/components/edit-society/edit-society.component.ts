import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-society',
  templateUrl: './edit-society.component.html',
  styleUrls: ['./edit-society.component.css', './../../app.component.css']
})
export class EditSocietyComponent implements OnInit {

  /* My modified code starts here */
  profileSocietyForm : FormGroup;

  contactType: String;
  discount = false;
  deals = false;
  promotionWant = false;
  publicity = false;
  promotionOffer = false;
  useServices = false;
  additional = false;
 
  id: String;
  sponsor: any = {};
  society: any = {}; 

  sponsors : any = [];
  societies : any = [];
  societiesPreference : any = [];
  sponsorsPreference : any = [];
  societyPreference : {};
  sponsorPreference : {};

  constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MatSnackBar) { 

    this.profileSocietyForm = this.fb.group({
      name: '',
      about: '',
      contact: '',
      money: '',
      moneyCounter: [{value: 0, disabled: true}],
      discountCounter: [{value: 0, disabled: true}],
      dealsCounter: [{value: 0, disabled: true}],
      promotionWantCounter: [{value: 0, disabled: true}],
      size: '',
      socials: ''
    }, { validator: this.countChecker });
  }

  countChecker(sf: FormGroup) { 
    let sum = 0;
    let moneyCounter = sf.get("moneyCounter").value;
    let dealsCounter = sf.get("dealsCounter").value;
    let discountCounter = sf.get("discountCounter").value;
    let promotionWantCounter = sf.get("promotionWantCounter").value;
    sum = moneyCounter + dealsCounter + discountCounter + promotionWantCounter;

    return sum < 10 ? {morePoints:true} : sum < 11 ? null : {maxNumbers : true}
  }

  calculatePoints(moneyCounter, dealsCounter, discountCounter, promotionWantCounter) {
    if(!moneyCounter)
      moneyCounter = 0;
    if(!dealsCounter)
      dealsCounter = 0;
    if(!discountCounter)
      discountCounter = 0;
    if(!promotionWantCounter)
      promotionWantCounter = 0;
    return parseInt(moneyCounter) + parseInt(dealsCounter) + parseInt(discountCounter) + parseInt(promotionWantCounter);
  }

  changedMoney(moneyCounter, money) {
    if(money == 0) 
      this.profileSocietyForm.get("moneyCounter").setValue(0);
    moneyCounter.disabled = (money == 0) ;
  }

  changedDiscount(discountCounter) {
    if(!this.discount) 
      this.profileSocietyForm.get("discountCounter").setValue(0);
    discountCounter.disabled = !this.discount;
  }

  changedDeals(dealsCounter) {
    if(!this.deals) 
      this.profileSocietyForm.get("dealsCounter").setValue(0);
    dealsCounter.disabled = !this.deals;
  }

  changedPromotion(promotionSponsorCounter) {
    if(!this.promotionWant) 
      this.profileSocietyForm.get("promotionWantCounter").setValue(0);
    promotionSponsorCounter.disabled = !this.promotionWant;
  }
  
  editSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional) {
    if (!size) 
      size = 0;
    if(!socials)
      socials = 0;
    if(!money)
      money = 0;
    if(!moneyCounter)
      moneyCounter = 0;
    if(!dealsCounter)
      dealsCounter = 0;
    if(!discountCounter)
      discountCounter = 0;
    if(!promotionWantCounter)
      promotionWantCounter = 0;
    this.sponsorService.editSociety(this.id, name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional).subscribe(() => {
      this.editEverything(this.id);
      this.snackBar.open('Profile updated successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate([`/profileSociety/${this.id}`]);
    });
  }

  back() {
    this.router.navigate([`/profileSociety/${this.id}`]);
  }

  editEverything(societyId){
    this.editSocietyPreference(societyId);
    this.editAllSponsorPreferenceLists();
    this.applyMarriage();
  }

  editSocietyPreference(societyId) {
    this.sponsorService.getSocietyPreferenceBySociety(societyId).subscribe( res => {
      this.societyPreference = res;
      this.sponsorService.getSocietiesById(societyId).subscribe(res=>{
        this.society = res;
        this.sponsorService.getSponsors().subscribe( res => {
          this.sponsors = res;
          var preferenceList = [];
          for (var i = 0; i < this.sponsors.length; i++) {
            preferenceList.push(this.addPreferenceForSociety(this.society, this.sponsors[i]));
          }
          preferenceList.sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
          preferenceList.reverse();
          this.sponsorService.editSocietyPreference(societyId, this.societyPreference['bestMatch'], preferenceList).subscribe(() => {});
        });
      });
    });
  }

  editAllSponsorPreferenceLists() {
    this.sponsorService.getSponsors().subscribe(res =>{
      this.sponsors = res; 
      this.sponsorService.getSocieties().subscribe(res => {
        this.societies = res;
        for (var i = 0; i < this.sponsors.length; i++) {
          var preferenceList = [];
          for(var j = 0; j < this.societies.length; j++) {
            preferenceList.push(this.addPreferenceForSponsor(this.sponsors[i], this.societies[j]));
          }
          preferenceList.sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
          preferenceList.reverse();
          this.updateSponsorPreference(this.sponsors[i]['_id'], this.sponsors[i]['bestMatch'], preferenceList);
        }
      });
    });
  }

  updateSponsorPreference(sponsor, bestMatch, preferenceList) {
    this.sponsorService.editSponsorPreference(sponsor, bestMatch, preferenceList).subscribe(() => {});
  }

  addPreferenceForSociety(society, sponsor) {
    var scoreMatch = 0;
    var notMatch = [];
    scoreMatch = this.calculateMatchScore(sponsor, society);
    notMatch = this.notMatch(sponsor, society);
    var preference = {sponsor : sponsor['_id'], matchScore : scoreMatch, notMatch : notMatch};
    return preference;
  }

  addPreferenceForSponsor(sponsor, society) {
    var scoreMatch = 0;
    var notMatch = [];
    scoreMatch = this.calculateMatchScore(sponsor, society);
    notMatch = this.notMatch(sponsor, society);
    var preference = {society : society['_id'], matchScore : scoreMatch, notMatch : notMatch};
    return preference;
  }

  calculateMatchScore(sponsor, society) {
    var sponsor = sponsor;
    var society = society;

    var societyScore = 0;
    var sponsorScore = 0;

    var percentageMoney = 0;
    var percentageSize = 0;
    var percentageSocials = 0;

    if(society['money'] != 0 && sponsor['money'] != 0) {
      if (society['money'] > sponsor['money']) 
        percentageMoney = sponsor['money'] / society['money'];
      else 
        percentageMoney = 1;
      societyScore += percentageMoney * society['moneyCounter'] * 5;
    }
    if(society['discount'] == sponsor['discount'] && sponsor['discount'] == true && society['discount'] == true) {
      societyScore += society['discountCounter'] * 5;
    }
    if(society['deals'] == sponsor['deals'] && sponsor['deals'] == true && society['deals'] == true) {
      societyScore += society['dealsCounter'] * 5;
    }
    if(society['promotionWant'] == sponsor['promotionOffer'] && sponsor['promotionOffer'] == true && society['promotionWant'] == true) {
      societyScore += society['promotionWantCounter'] * 5;
    }
    if(society['size'] != 0 && sponsor['size'] != 0) {
      if (society['size'] > sponsor['size']) 
        percentageSize = 1;
      else 
        percentageSize = society['size'] / society['size'];
      sponsorScore += percentageSize * sponsor['sizeCounter'] * 5;
    }
    if(society['socials'] != 0 && sponsor['socials'] != 0) {
      if (society['socials'] > sponsor['socials']) 
        percentageSocials = 1;
      else 
        percentageSocials = society['socials'] / society['socials'];
      sponsorScore += percentageSocials * sponsor['socialsCounter'] * 5;
    }
    if(society['publicity'] == sponsor['publicty'] && sponsor['publicity'] == true && society['publicity'] == true) {
      sponsorScore += sponsor['publicityCounter'] * 5;
    }
    if(society['promotionOffer'] == sponsor['promotionWant'] && sponsor['promotionWant'] == true && society['promotionOffer'] == true) {
      sponsorScore += sponsor['promotionWantCounter'] * 5;
    }
    if(society['useServices'] == sponsor['useServices'] && sponsor['useServices'] == true && society['useServices'] == true) {
      sponsorScore += sponsor['useServicesCounter'] * 5;
    }
    if(society['additional'] == sponsor['additional'] && sponsor['additional'] == true && society['additional'] == true) {
      sponsorScore += sponsor['additional'] * 5;
    }
    return (sponsorScore + societyScore);
  }

  notMatch(sponsor, society) {
    var society = society;
    var sponsor = sponsor;
    var notMatch = [];

    if(society['money'] != sponsor['money']) { 
      notMatch.push("money");
    }

    if(society['discount'] != sponsor['discount']) { 
      notMatch.push("discount");
    }

    if(society['deals'] != sponsor['deals']) { 
      notMatch.push("deals");
    }

    if(society['promotionWant'] != sponsor['promotionWant']) { 
      notMatch.push("promotionWant");
    }

    if(society['size'] != sponsor['size']) { 
      notMatch.push("size");
    }

    if(society['socials'] != sponsor['socials']) { 
      notMatch.push("socials");
    }

    if(society['publicity'] != sponsor['publicity']) { 
      notMatch.push("publicity");
    }
    
    if(society['promotionOffer'] != sponsor['promotionOffer']) { 
      notMatch.push("promotionOffer");
    }

    if(society['useServices'] != sponsor['useServices']) { 
      notMatch.push("useServices");
    }

    if(society['additional'] != sponsor['additional']) { 
      notMatch.push("additional");
    }    
    return notMatch;
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
          if (this.prefers(sponsorsList[i]["sponsor"], societyPreference, societiesList[j]['bestMatch'])  && this.prefers(societiesList[j]["society"], sponsorPreference, sponsorsList[i]['bestMatch']))
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
        this.profileSocietyForm.get('name').setValue(this.society.name);
        this.profileSocietyForm.get('about').setValue(this.society.about);
        this.contactType = this.society.contactType;
        this.profileSocietyForm.get('contact').setValue(this.society.contact);
        this.profileSocietyForm.get('money').setValue(this.society.money);
        this.profileSocietyForm.get('moneyCounter').setValue(this.society.moneyCounter);
        this.discount = this.society.discount;
        this.profileSocietyForm.get('dealsCounter').setValue(this.society.dealsCounter);
        this.deals = this.society.deals;
        this.profileSocietyForm.get('discountCounter').setValue(this.society.discountCounter);
        this.promotionWant = this.society.promotionWant;
        this.profileSocietyForm.get('promotionWantCounter').setValue(this.society.promotionWantCounter);
        this.profileSocietyForm.get('size').setValue(this.society.size);
        this.profileSocietyForm.get('socials').setValue(this.society.socials);
        this.publicity = this.society.publicity;
        this.promotionOffer = this.society.promotionOffer;
        this.useServices = this.society.useServices;
        this.additional = this.society.additional; 

        if(this.society.moneyCounter > 0) {
          this.profileSocietyForm.get('moneyCounter').enable();
        }
        if(this.society.discountCounter > 0) {
          this.profileSocietyForm.get('discountCounter').enable();
        }
        if(this.society.dealsCounter > 0) {
          this.profileSocietyForm.get('dealsCounter').enable();
        }
        if(this.society.promotionWantCounter > 0) {
          this.profileSocietyForm.get('promotionWantCounter').enable();
        }
      });
    });
  }
}
