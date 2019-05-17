import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-sponsor',
  templateUrl: './edit-sponsor.component.html',
  styleUrls: ['./edit-sponsor.component.css', './../../app.component.css']
})

export class EditSponsorComponent implements OnInit {

  /* My modified code starts here */
  profileSponsorForm: FormGroup;

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

  sponsors : any = [];
  societies : any = [];
  societitiesPreference : any = [];
  sponsorsPreference : any = [];
  societyPreference : {};
  sponsorPreference : {};
  society: {};

  constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MatSnackBar) { 

    this.profileSponsorForm = this.fb.group({
      name: ['', Validators.required],
      about: ['', Validators.required],
      contact: ['', Validators.required],
      size: '', 
      sizeCounter: [{value: 0, disabled: true}],
      socials: '',
      socialsCounter: [{value: 0, disabled: true}],
      publicityCounter: [{value: 0, disabled: true}],
      promotionWantCounter: [{value: 0, disabled: true}],
      useServicesCounter: [{value: 0, disabled: true}],
      additionalCounter: [{value: 0, disabled: true}],
      money: ''
    }, { validator: this.countChecker });
  }

  countChecker(sf: FormGroup) { 
    let sum = 0;
    
    let sizeCounter = sf.get("sizeCounter").value;
    let socialsCounter = sf.get("socialsCounter").value;
    let publicityCounter = sf.get("publicityCounter").value;
    let promotionWantCounter = sf.get("promotionWantCounter").value;
    let useServicesCounter = sf.get("useServicesCounter").value;
    let additionalCounter = sf.get("additionalCounter").value;
    sum = sizeCounter + socialsCounter + publicityCounter + promotionWantCounter + useServicesCounter + additionalCounter;

    return sum < 10 ? {morePoints:true} : sum < 11 ? null : {maxNumbers : true}
  }

  calculatePoints(sizeCounter, socialsCounter, publicityCounter, promotionWantCounter, useServicesCounter, additionalCounter) {
    if(!sizeCounter)
      sizeCounter = 0;
    if(!socialsCounter)
      socialsCounter = 0;
    if(!publicityCounter)
      publicityCounter = 0;
    if(!promotionWantCounter)
      promotionWantCounter = 0;
    if(!useServicesCounter)
      useServicesCounter = 0;
    if(!additionalCounter)
      additionalCounter = 0;
    return parseInt(sizeCounter) + parseInt(socialsCounter) + parseInt(publicityCounter) + parseInt(promotionWantCounter) + parseInt(useServicesCounter) + parseInt(additionalCounter);
  }

  changedSizeCounter(sizeCounter, size) {
    if(size == 0)
      this.profileSponsorForm.get("sizeCounter").setValue(0);
    sizeCounter.disabled = (size == 0) ;
  }

  changedSocials(socialsCounter, socials) {
    if(socials == 0) 
      this.profileSponsorForm.get("socialsCounter").setValue(0);
    socialsCounter.disabled = (socials == 0) ;
  }

  changedPublicity(publicityCounter) {
    if(!this.publicity) 
      this.profileSponsorForm.get("publicityCounter").setValue(0);
    publicityCounter.disabled = !this.publicity;
  }

  changedPromotionWant(promotionCounter) {
    if(!this.promotionWant) 
      this.profileSponsorForm.get("promotionWantCounter").setValue(0);
    promotionCounter.disabled = !this.promotionWant;
  }

  changedUseServices(useServicesCounter) {
    if(!this.useServices) 
      this.profileSponsorForm.get("useServicesCounter").setValue(0);
    useServicesCounter.disabled = !this.useServices;
  }

  changedAdditional(additionalCounter) {
    if(!this.additional) 
      this.profileSponsorForm.get("additionalCounter").setValue(0);
    additionalCounter.disabled = !this.additional;
  }

  editSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer) {
    if (!size) 
      size = 0;
    if(!socials)
      socials = 0;
    if(!money)
      money = 0;
    if(!sizeCounter)
      sizeCounter = 0;
    if(!socialsCounter)
      socialsCounter = 0;
    if(!publicityCounter)
      publicityCounter = 0;
    if(!promotionWantCounter)
      promotionWantCounter = 0;
    if(!useServicesCounter)
      useServicesCounter = 0;
    if(!additionalCounter)
      additionalCounter = 0;
    
    this.sponsorService.editSponsor(this.id, name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer).subscribe(() => {
      this.editEverything(this.id);
      this.snackBar.open('Profile updated successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate([`/profileSponsor/${this.id}`]);
    });
  }

  back() {
    this.router.navigate([`/profileSponsor/${this.id}`]);
  }
  

  editEverything(sponsorId){
    this.editSponsorPreference(sponsorId);
    this.editAllSocietyPreferenceLists();
    this.applyMarriage();
  }

  editSponsorPreference(sponsorId) {
    this.sponsorService.getSponsorPreferenceBySponsor(sponsorId).subscribe( res => {
      this.sponsorPreference = res;
      this.sponsorService.getSponsorsById(sponsorId).subscribe(res=>{
        this.sponsor = res;
        this.sponsorService.getSocieties().subscribe( res => {
          this.societies = res;
          var preferenceList = [];
          for (var i = 0; i < this.societies.length; i++) {
            preferenceList.push(this.addPreferenceForSponsor(this.sponsor, this.societies[i]));
          }
          preferenceList.sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
          preferenceList.reverse();
          this.sponsorService.editSponsorPreference(sponsorId, this.sponsorPreference['bestMatch'], preferenceList).subscribe(() => {});
        });
      });
    });
  }

  editAllSocietyPreferenceLists() {
    this.sponsorService.getSocieties().subscribe(res =>{
      this.societies = res; 
      this.sponsorService.getSponsors().subscribe(res => {
        this.sponsors = res;
        for (var i = 0; i < this.societies.length; i++) {
          var preferenceList = [];
          for(var j = 0; j < this.sponsors.length; j++) {
            preferenceList.push(this.addPreferenceForSociety(this.societies[i], this.sponsors[j]));
          }
          preferenceList.sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
          preferenceList.reverse();
          this.updateSocietyPreference(this.societies[i]['_id'], this.societies[i]['bestMatch'], preferenceList);
        }
      });
    });
  }

  updateSocietyPreference(id, bestMatch, preferenceList) {
    this.sponsorService.editSocietyPreference(id, bestMatch, preferenceList).subscribe(() => {});
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
      this.sponsorService.getSponsorsById(this.id).subscribe(res => {
        this.sponsor = res;
        this.profileSponsorForm.get('name').setValue(this.sponsor.name);
        this.profileSponsorForm.get('about').setValue(this.sponsor.about);
        this.contactType = this.sponsor.contactType;
        this.profileSponsorForm.get('contact').setValue(this.sponsor.contact);
        this.profileSponsorForm.get('size').setValue(this.sponsor.size);
        this.profileSponsorForm.get('sizeCounter').setValue(this.sponsor.sizeCounter);
        this.profileSponsorForm.get('socials').setValue(this.sponsor.socials);
        this.profileSponsorForm.get('socialsCounter').setValue(this.sponsor.socialsCounter);
        this.publicity = this.sponsor.publicity;
        this.profileSponsorForm.get('publicityCounter').setValue(this.sponsor.publicityCounter);
        this.promotionWant = this.sponsor.promotionWant;
        this.profileSponsorForm.get('promotionWantCounter').setValue(this.sponsor.promotionWantCounter);
        this.useServices = this.sponsor.useServices;
        this.profileSponsorForm.get('useServicesCounter').setValue(this.sponsor.useServicesCounter);
        this.additional = this.sponsor.additional;
        this.profileSponsorForm.get('additionalCounter').setValue(this.sponsor.additionalCounter);
        this.profileSponsorForm.get('money').setValue(this.sponsor.money);
        this.discount = this.sponsor.discount;
        this.deals = this.sponsor.deals;
        this.promotionOffer = this.sponsor.promotionOffer;


        if(this.sponsor.sizeCounter > 0) {
          this.profileSponsorForm.get('sizeCounter').enable();
        }
        if(this.sponsor.socialsCounter > 0) {
          this.profileSponsorForm.get('socialsCounter').enable();
        }
        if(this.sponsor.publicityCounter > 0) {
          this.profileSponsorForm.get('publicityCounter').enable();
        }
        if(this.sponsor.promotionWantCounter > 0) {
          this.profileSponsorForm.get('promotionWantCounter').enable();
        }
        if(this.sponsor.useServicesCounter > 0) {
          this.profileSponsorForm.get('useServicesCounter').enable();
        }
        if(this.sponsor.additionalCounter > 0) {
          this.profileSponsorForm.get('additionalCounter').enable();
        }
      });
    });
  }
}