import { Component, OnInit } from '@angular/core';
import { SponsorService } from '../../sponsor.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { FormControl, FormGroupDirective} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';



/** https://stackoverflow.com/questions/51605737/confirm-password-validation-in-angular-6 */
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
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

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

  matcher = new MyErrorStateMatcher();

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

  countChecker(sf: FormGroup) { 
    let sum = 0;
    let sizeCounter = sf.get("sizeCounter").value;
    let socialsCounter = sf.get("socialsCounter").value;
    let publicityCounter = sf.get("publicityCounter").value;
    let promotionSponsorCounter = sf.get("promotionSponsorCounter").value;
    let useServicesCounter = sf.get("useServicesCounter").value;
    let additionalCounter = sf.get("additionalCounter").value;
    sum = sizeCounter + socialsCounter + publicityCounter + promotionSponsorCounter + useServicesCounter + additionalCounter;

    return sum < 11 ? null: {maxNumbers : true}
  }

  countCheckerSociety(sf: FormGroup) { 
    let sum = 0;
    let moneyCounter = sf.get("moneyCounter").value;
    let dealsCounter = sf.get("dealsCounter").value;
    let discountCounter = sf.get("discountCounter").value;
    let promotionSocietyCounter = sf.get("promotionSocietyCounter").value;
    sum = moneyCounter + dealsCounter + discountCounter + promotionSocietyCounter;

    return sum < 11 ? null: {maxNumbers : true}
  }

  //TODO
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

  addSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer) {
    this.sponsorService.addSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer).subscribe((res) => {
      this.router.navigate([`/profileSponsor/${res}`]);
    });
  }

  addSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional) {
    this.sponsorService.addSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional).subscribe((res) => {
      this.router.navigate([`/profileSociety/${res}`]);
    });
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

  changedPromotionSponsor(promotionCounter) {
    promotionCounter.disabled = !this.promotionWant;
  }

  changedUseServices(useServicesCounter) {
    useServicesCounter.disabled = !this.useServices;
  }

  changedAdditional(additionalCounter) {
    additionalCounter.disabled = !this.additional;
  }

  changedMoney(moneyCounter, money) {
    moneyCounter.disabled = (money == 0) ;
  }

  changedDiscount(discountCounter) {
    discountCounter.disabled = !this.discountSociety;
  }

  changedDeals(dealsCounter) {
    dealsCounter.disabled = !this.dealsSociety;
  }

  changedPromotionSociety(promotionSponsorCounter) {
    promotionSponsorCounter.disabled = !this.promotionWantSociety;
  }

  ngOnInit() {
    this.sponsorService.getSocieties().subscribe((societies) => {
      console.log(societies);
    });
  }
}
