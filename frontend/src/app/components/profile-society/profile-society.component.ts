import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile-society',
  templateUrl: './profile-society.component.html',
  styleUrls: ['./profile-society.component.css']
})
export class ProfileSocietyComponent implements OnInit {

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
  society: any = {};

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

    return sum < 11 ? null: {maxNumbers : true}
  }

  changedMoney(moneyCounter, money) {
    moneyCounter.disabled = (money == 0) ;
  }

  changedDiscount(discountCounter) {
    discountCounter.disabled = !this.discount;
  }

  changedDeals(dealsCounter) {
    dealsCounter.disabled = !this.deals;
  }

  changedPromotion(promotionSponsorCounter) {
    promotionSponsorCounter.disabled = !this.promotionWant;
  }
  
  editSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional) {
    this.sponsorService.editSociety(this.id, name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional).subscribe(() => {
      this.snackBar.open('Profile updated successfully', 'Ok', {
        duration: 3000
      });
    });
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
          this.profileSocietyForm.get('discountsCounter').enable();
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
