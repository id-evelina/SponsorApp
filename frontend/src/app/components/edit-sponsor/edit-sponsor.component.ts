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
      //this.editEverything();
      this.snackBar.open('Profile updated successfully', 'Ok', {
        duration: 3000
      });
      this.router.navigate([`/profileSponsor/${this.id}`]);
    });
  }

  back() {
    this.router.navigate([`/profileSponsor/${this.id}`]);
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

    for (var k = 0; k < societiesPreference.length; k++){ 
      this.updateSocietyPreference(societyPreference['_id'], societyPreference['bestMatch'], societyPreference['preferenceList']);
    }

    for (var k = 0; k < sponsorsPreference.length; k++){ 
      this.updateSponsorPreference(sponsorPreference['_id'], sponsorPreference['bestMatch'], sponsorPreference['preferenceList']);
    }
    
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

  editEverything(){
    this.editAllSocietyPreferenceLists();
    this.editAllSponsorPreferenceLists();
    this.applyMarriage();
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

  updateSponsorPreference(id, bestMatch, preferenceList) {
    this.sponsorService.editSponsorPreference(id, bestMatch, preferenceList).subscribe(() => {});
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