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
        if(!societyPreference['bestMatch']) {
    
          done = false;
          //going through a selected society's own preference list of sponsors
          if (listIndex < societyPreference['preferenceList'].length) {
            var sponsorId = societyPreference['preferenceList'][listIndex].sponsor;
            listIndex++;

            this.sponsorService.getSponsorPreferenceBySponsor(sponsorId).subscribe(res => {
              sponsorPreference = res;
              if(!sponsorPreference['bestMatch'] || this.prefers(sponsorPreference, societyPreference)) {
                this.engage(sponsorPreference, societyPreference);
              }
            })
          }
        }
      }
    } while (!done);
  }

  engage(sponsorPreference, societyPreference) {
    console.log("sponsorPreference  best match" + sponsorPreference['bestMatch']);
    if(sponsorPreference['bestMatch']) {
      this.updateSocietyPreferenceBestMatch(sponsorPreference['bestMatch'], null);
    }
    if (societyPreference['bestMatch']) {
      this.updateSponsorPreferenceBestMatch(societyPreference['bestMatch'], null);
    }

    this.updateSponsorPreferenceBestMatch(sponsorPreference['sponsor'], societyPreference['society']);
    this.updateSocietyPreferenceBestMatch(societyPreference['society'], sponsorPreference['sponsor']);
  }

  testing(){
    console.log("HERe");
    this.sponsorService.getSponsorPreference().subscribe(res =>{
      this.sponsorsPreference = res;
      this.sponsorService.getSocietyPreference().subscribe(res =>{
        this.societiesPreference = res;
        console.log("sponsors pre" + this.sponsorsPreference[0]['sponsor']);
        this.engage(this.sponsorsPreference[0], this.societiesPreference[0]);
      });
    });
  }

  updateSocietyPreferenceBestMatch(society, bestMatch) {
    console.log("update society, society " + society);
    console.log("update society, best match " + bestMatch);
    this.sponsorService.editSocietyPreferenceBestMatch(society, bestMatch).subscribe(() => {});
  }

  updateSponsorPreferenceBestMatch(sponsor, bestMatch) {
    console.log("update sponsor, sponsor" + sponsor);
    console.log("udpate sponsor, best match " + bestMatch);
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
  prefers (user, societyPreference) {
    return this.rank(user, societyPreference['preferenceList']) < this.rank(societyPreference['bestMatch'], societyPreference['preferenceList']);
  }

  editEverything(societyId){
    //this.editAllSocietyPreferenceLists();
    this.editSocietyPreference(societyId);
    this.editAllSponsorPreferenceLists();
    this.applyMarriage();
  }

  

  editSocietyPreference(societyId) {
    this.sponsorService.getSocietiesById(societyId).subscribe(res => {
      this.society = res;
      this.sponsorService.getSponsors().subscribe(res=> {
        this.sponsors = res;
        for (var i = 0; i < this.sponsors.length; i++) {
          this.sponsor = this.sponsors[i];
          this.modifySocietyPreference(this.sponsor, this.society);
        }
      }); 
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

  updateSocietyPreference(society, bestMatch, preferenceList) {
    this.sponsorService.editSocietyPreference(society, bestMatch, preferenceList).subscribe(() => {});
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

  ngOnInit() {
    this.testing();
    
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
