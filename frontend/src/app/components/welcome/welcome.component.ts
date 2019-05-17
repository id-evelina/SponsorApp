import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { FormControl, FormGroupDirective} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { SponsorService } from '../../sponsor.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidControl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty && control.touched);

    return (invalidControl || invalidParent);
  }
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css', './../../app.component.css']
})
export class WelcomeComponent implements OnInit {

  /* My modified code starts here */
  registerForm : FormGroup;
  loginForm : FormGroup;
  addSponsorForm: FormGroup;
  addSocietyForm: FormGroup;
  
  accountSelected : String;

  discount = false;
  deals = false;
  promotionWant = false;
  publicity = false;
  promotionOffer = false;
  useServices = false;
  additional = false;
  
  discountSociety = false;
  dealsSociety = false;
  promotionWantSociety = false;
  publicitySociety = false;
  promotionOfferSociety = false;
  useServicesSociety = false;
  additionalSociety = false;

  typePassword = false;
  typeConfirmPassword = false;
  typeLoginPassword = false;

  matcher = new MyErrorStateMatcher();

  sponsors : any = [];
  societies : any = [];
  sponsor: {};
  society: {};

  constructor(private sponsorService: SponsorService, private fb: FormBuilder, private router: Router) { 
    this.registerForm = this.fb.group({
      emailRegister: ['', Validators.compose([Validators.email, Validators.required])],
      passwordRegister: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      passwordConfirm: ['']
    }, { validator: this.confirmPasswords });

    this.loginForm = this.fb.group({
      emailLogin: ['', Validators.compose([Validators.email, Validators.required])],
      passwordLogin: ['', Validators.required]
    });

    this.addSponsorForm = this.fb.group({
      name: '',
      about: '',
      contact: '',
      size: '',
      sizeCounter: [{value: 0, disabled: true}],
      socials: '',
      socialsCounter: [{value: 0, disabled: true}],
      publicityCounter: [{value: 0, disabled: true}],
      promotionSponsorCounter: [{value: 0, disabled: true}],
      useServicesCounter: [{value: 0, disabled: true}],
      additionalCounter: [{value: 0, disabled: true}],
      money: ''
    }, { validator: this.countChecker });

    this.addSocietyForm = this.fb.group({
      nameSociety: '',
      aboutSociety: '',
      contactSociety: '',
      moneySociety: '',
      moneyCounter: [{value: 0, disabled: true}],
      discountCounter: [{value: 0, disabled: true}],
      dealsCounter: [{value: 0, disabled: true}],
      promotionSocietyCounter: [{value: 0, disabled: true}],
      sizeSociety: '',
      socialsSociety: ''
    }, { validator: this.countCheckerSociety });
  }

  confirmPasswords(rf: FormGroup) { 
    let pass = rf.get("passwordRegister").value;
    let confirmPass = rf.get("passwordConfirm").value;

    return pass === confirmPass ? null : { notSame: true }
  }

  togglePassword() { 
    this.typePassword = !this.typePassword; 
  }

  toggleConfirmPassword() { 
    this.typeConfirmPassword = !this.typeConfirmPassword; 
  }

  toggleLoginPassword() { 
    this.typeLoginPassword = !this.typeLoginPassword; 
  }

  //checks that the points for categories equal 10
  countChecker(sf: FormGroup) { 
    let sum = 0;

    let sizeCounter = sf.get("sizeCounter").value;
    let socialsCounter = sf.get("socialsCounter").value;
    let publicityCounter = sf.get("publicityCounter").value;
    let promotionSponsorCounter = sf.get("promotionSponsorCounter").value;
    let useServicesCounter = sf.get("useServicesCounter").value;
    let additionalCounter = sf.get("additionalCounter").value;
    sum = sizeCounter + socialsCounter + publicityCounter + promotionSponsorCounter + useServicesCounter + additionalCounter;

    return sum < 10 ? {morePoints:true} : sum < 11 ? null : {maxNumbers : true}
  }

  //checks that the points for categoties equal 10
  countCheckerSociety(sf: FormGroup) { 
    let sum = 0;
    let moneyCounter = sf.get("moneyCounter").value;
    let dealsCounter = sf.get("dealsCounter").value;
    let discountCounter = sf.get("discountCounter").value;
    let promotionSocietyCounter = sf.get("promotionSocietyCounter").value;
    sum = moneyCounter + dealsCounter + discountCounter + promotionSocietyCounter;

    return sum < 10 ? {morePoints:true} : sum < 11 ? null : {maxNumbers : true}
  }

  calculatePointsSociety(moneyCounter, dealsCounter, discountCounter, promotionWantCounter) {
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

  calculatePointsSponsor(sizeCounter, socialsCounter, publicityCounter, promotionWantCounter, useServicesCounter, additionalCounter) {
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

  loginCheck(email, password) {
    this.sponsorService.loginCheck(email, password).subscribe((res) => {
      this.router.navigate([`/profileSociety/${res}`]);
    });
  }

  //switch to the required element based on what the user has selected
  //e.g. if they want to make a sponsor account, show them the sponsir sign up form
  changeView(accountSelected) {
    if(!accountSelected.localeCompare("Sponsor")) {
      document.getElementById("registerSponsorDiv").style.display = "block";
      document.getElementById("registerSocietyDiv").style.display = "none";
      document.getElementById("welcomeDiv").style.display = "none"; 
    } else if (!accountSelected.localeCompare("Society")) {
      document.getElementById("registerSocietyDiv").style.display = "block";
      document.getElementById("registerSponsorDiv").style.display = "none";
      document.getElementById("welcomeDiv").style.display = "none";
    } 
  }

  //goes back to the front page
  back() {
    document.getElementById("registerSponsorDiv").style.display = "none";
    document.getElementById("registerSocietyDiv").style.display = "none";
    document.getElementById("welcomeDiv").style.display = "block"; 
    this.registerForm.reset();
    this.loginForm.reset();
    this.accountSelected = "";
  }

  addSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer) {
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

    this.sponsorService.addSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer).subscribe((res) => {
      this.addSponsorPreference(res);
      this.router.navigate([`/profileSponsor/${res}`]);
    });
  }

  addSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional) {
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
    this.sponsorService.addSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional).subscribe((res) => {
      this.addSocietyPreference(res);
      this.router.navigate([`/profileSociety/${res}`]);
    });
  }

  changedSizeCounter(sizeCounter, size) {
    if(size == 0)
      this.addSponsorForm.get("sizeCounter").setValue(0);
    sizeCounter.disabled = (size == 0) ;
  }

  changedSocials(socialsCounter, socials) {
    if(socials == 0) 
      this.addSponsorForm.get("socialsCounter").setValue(0);
    socialsCounter.disabled = (socials == 0) ;
  }

  changedPublicity(publicityCounter) {
    if(!this.publicity) 
      this.addSponsorForm.get("publicityCounter").setValue(0);
    publicityCounter.disabled = !this.publicity;
  }

  changedPromotionSponsor(promotionCounter) {
    if(!this.promotionWant) 
      this.addSponsorForm.get("promotionSponsorCounter").setValue(0);
    promotionCounter.disabled = !this.promotionWant;
  }

  changedUseServices(useServicesCounter) {
    if(!this.useServices) 
      this.addSponsorForm.get("useServicesCounter").setValue(0);
    useServicesCounter.disabled = !this.useServices;
  }

  changedAdditional(additionalCounter) {
    if(!this.additional) 
      this.addSponsorForm.get("additionalCounter").setValue(0);
    additionalCounter.disabled = !this.additional;
  }

  changedMoney(moneyCounter, money) {
    if(money == 0) 
      this.addSocietyForm.get("moneyCounter").setValue(0);
    moneyCounter.disabled = (money == 0) ;
  }

  changedDiscount(discountCounter) {
    if(!this.discountSociety) 
      this.addSocietyForm.get("discountCounter").setValue(0);
    discountCounter.disabled = !this.discountSociety;
  }

  changedDeals(dealsCounter) {
    if(!this.dealsSociety) 
      this.addSocietyForm.get("dealsCounter").setValue(0);
    dealsCounter.disabled = !this.dealsSociety;
  }

  changedPromotionSociety(promotionSponsorCounter) {
    if(!this.promotionWantSociety) 
      this.addSocietyForm.get("promotionSocietyCounter").setValue(0);
    promotionSponsorCounter.disabled = !this.promotionWantSociety;
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

  addSocietyPreference(societyId) {
    this.sponsorService.getSponsors().subscribe(res=> {
      this.sponsors = res;
      this.sponsorService.getSocietiesById(societyId).subscribe(res => {
        this.society = res;
        var preferenceList = [];
        for (var i = 0; i < this.sponsors.length; i++) {
          preferenceList.push(this.addPreferenceForSociety(this.society, this.sponsors[i]));
        }
        preferenceList.sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
        preferenceList.reverse();
        this.addSocietytotheSponsorsPreferenceList(this.society, this.sponsors);
        this.sponsorService.addSocietyPreference(societyId, preferenceList).subscribe(() => {});
        this.applyMarriage();
      });
    }); 
  }

  addSponsorPreference(sponsorId) {
    this.sponsorService.getSocieties().subscribe(res=> {
      this.societies = res;
      this.sponsorService.getSponsorsById(sponsorId).subscribe(res => {
        this.sponsor = res;
        var preferenceList = [];
        for (var i = 0; i < this.societies.length; i++) {
          preferenceList.push(this.addPreferenceForSponsor(this.sponsor, this.societies[i]));
        }
        preferenceList.sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
        preferenceList.reverse();
        this.addSponsortotheSocietiesPreferenceList(this.sponsor, this.societies);
        this.sponsorService.addSponsorPreference(sponsorId, preferenceList).subscribe(() => {});
        this.applyMarriage();
      });
    });
  }

  addSocietytotheSponsorsPreferenceList(society, sponsors){
    this.sponsorService.getSponsors().subscribe(res=> {
      this.sponsors = res;
      for (var i = 0; i < this.sponsors.length; i++) {
        this.sponsor = this.sponsors[i];
        this.modifySponsorPreference(society, this.sponsor);
      }
    }); 
  }

  addSponsortotheSocietiesPreferenceList(sponsor, societies){
    this.sponsorService.getSocieties().subscribe(res=> {
      this.societies = res;
      for (var i = 0; i < this.societies.length; i++) {
        this.society = this.societies[i];
        this.modifySocietyPreference(sponsor, this.society);
      }
    }); 
  }

  modifySocietyPreference(sponsor, society) {
    this.sponsorService.getSocietyPreferenceBySociety(society['_id']).subscribe(res => {
      var societyPreference = res;    
      societyPreference['preferenceList'].push(this.addPreferenceForSociety(society, sponsor));
      societyPreference['preferenceList'].sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
      societyPreference['preferenceList'].reverse();
    this.sponsorService.editSocietyPreference(society['_id'], societyPreference['bestMatch'], societyPreference['preferenceList']).subscribe(() => {});
    });
  }

  modifySponsorPreference(society, sponsor) {
    this.sponsorService.getSponsorPreferenceBySponsor(sponsor['_id']).subscribe(res => {
      var sponsorPreference = res;    
      sponsorPreference['preferenceList'].push(this.addPreferenceForSponsor(sponsor, society));
      sponsorPreference['preferenceList'].sort((a, b) => (a.matchScore > b.matchScore) ? 1 : -1);
      sponsorPreference['preferenceList'].reverse();
    this.sponsorService.editSponsorPreference(sponsor['_id'], sponsorPreference['bestMatch'], sponsorPreference['preferenceList']).subscribe(() => {});
    });
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
  }
}
