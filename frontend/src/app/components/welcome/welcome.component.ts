import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { FormControl, FormGroupDirective} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { SponsorService } from '../../sponsor.service';
import { SponsorPreference } from '../../sponsorPreference.model';


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
    console.log("society " + society['_id']);
    console.log("sponsor " + sponsor['_id']);

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

    console.log("the score returned at the calculation function " + (sponsorScore+societyScore))
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
    console.log("the result of the match score " + scoreMatch);
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

  ngOnInit() {
  }
}
