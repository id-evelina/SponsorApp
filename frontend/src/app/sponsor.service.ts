import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {

  uri = 'http://localhost:3000/SponsorApp';

  constructor(private http: HttpClient) {
    }

  getSponsors() {
    return this.http.get(`${this.uri}/sponsors`);
  }
  
  getSponsorsById(id) {
    return this.http.get(`${this.uri}/sponsors/${id}`);
  }

  getSocieties() {
    return this.http.get(`${this.uri}/societies`);
  }
  
  getSocietiesById(id) {
    return this.http.get(`${this.uri}/societies/${id}`);
  }

  addSponsor(name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer) {
    const sponsor = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      size: size,
      sizeCounter: sizeCounter,
      socials: socials,
      socialsCounter: socialsCounter,
      publicity: publicity,
      publicityCounter: publicityCounter,
      promotionWant: promotionWant,
      promotionWantCounter: promotionWantCounter,
      useServices: useServices,
      useServicesCounter: useServicesCounter,
      additional: additional,
      additionalCounter: additionalCounter,

      money: money,
      discount: discount,
      deals: deals,
      promotionOffer: promotionOffer
    };
    return this.http.post(`${this.uri}/sponsors/add`, sponsor);
  }

  addSociety(name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional) {
    const society = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      money: money,
      moneyCounter: moneyCounter,
      discount: discount,
      discountCounter: discountCounter,
      deals: deals,
      dealsCounter: dealsCounter,
      promotionWant: promotionWant,
      promotionWantCounter: promotionWantCounter,

      size: size,
      socials: socials,
      publicity: publicity,
      promotionOffer: promotionOffer,
      useServices: useServices, 
      additional: additional
    };
    return this.http.post(`${this.uri}/societies/add`, society);
  }

  editSponsor(id, name, about, contactType, contact, size, sizeCounter, socials, socialsCounter, publicity, publicityCounter, promotionWant, promotionWantCounter, useServices, useServicesCounter, additional, additionalCounter, money, discount, deals, promotionOffer) {
    const sponsor = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      size: size,
      sizeCounter: sizeCounter,
      socials: socials,
      socialsCounter: socialsCounter,
      publicity: publicity,
      publicityCounter: publicityCounter,
      promotionWant: promotionWant,
      promotionWantCounter: promotionWantCounter,
      useServices: useServices,
      useServicesCounter: useServicesCounter,
      additional: additional,
      additionalCounter: additionalCounter,

      money: money,
      discount: discount,
      deals: deals,
      promotionOffer: promotionOffer
    };
    return this.http.post(`${this.uri}/sponsors/edit/${id}`, sponsor);
  }

  editSociety(id, name, about, contactType, contact, money, moneyCounter, discount, discountCounter, deals, dealsCounter, promotionWant, promotionWantCounter, size, socials, publicity, promotionOffer, useServices, additional) {
    const society = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      money: money,
      moneyCounter: moneyCounter,
      discount: discount,
      discountCounter: discountCounter,
      deals: deals,
      dealsCounter: dealsCounter,
      promotionWant: promotionWant,
      promotionWantCounter: promotionWantCounter,

      size: size,
      socials: socials,
      publicity: publicity,
      promotionOffer: promotionOffer,
      useServices: useServices,
      additional: additional
    };
    return this.http.post(`${this.uri}/societies/edit/${id}`, society);
  }

  //TODO
  loginCheck(name, password) {
    return this.http.get(`${this.uri}/societies/${name}`);
  }
  
}
