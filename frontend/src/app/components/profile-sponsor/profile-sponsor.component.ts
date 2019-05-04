import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-sponsor',
  templateUrl: './profile-sponsor.component.html',
  styleUrls: ['./profile-sponsor.component.css']
})
export class ProfileSponsorComponent implements OnInit {

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

  constructor(private sponsorService: SponsorService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MatSnackBar) { 

    this.profileSponsorForm = this.fb.group({
      name: '',
      about: '',
      contact: '',
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

    return sum < 11 ? null: {maxNumbers : true}
  }

  changedSizeCounter(sizeCounter, size) {
    sizeCounter.disabled = (size == 0) ;
  }

  changedSocials(socialsCounter, socials) {
    socialsCounter.disabled = (socials == 0) ;
  }

  changedPublicity(publicityCounter) {
    publicityCounter.disabled = !this.publicity;
  }

  changedPromotionWant(promotionCounter) {
    promotionCounter.disabled = !this.promotionWant;
  }

  changedUseServices(useServicesCounter) {
    useServicesCounter.disabled = !this.useServices;
  }

  changedAdditional(additionalCounter) {
    additionalCounter.disabled = !this.additional;
  }

  editSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer) {
    this.sponsorService.editSponsor(this.id, name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer).subscribe(() => {
      this.snackBar.open('Profile updated successfully', 'Ok', {
        duration: 3000
      });
    });
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
        console.log(this.sponsor.promotionWantCounter);
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
