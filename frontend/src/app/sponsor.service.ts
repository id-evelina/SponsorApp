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

  addSponsor(name, about, contactType, contact, size, socials, publicity, promotionWant, additional, useServices, money, discount, deals, promotionOffer) {
    const sponsor = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      size: size,
      socials: socials,
      publicity: publicity,
      promotionWant: promotionWant,
      additional: additional,
      useServices: useServices,

      money: money,
      discount: discount,
      deals: deals,
      promotionOffer: promotionOffer
    };
    return this.http.post(`${this.uri}/sponsors/add`, sponsor);
  }

  addSociety(name, about, contactType, contact, money, discount, promotionWant, deals, size, socials, publicity, promotionOffer, additional, useServices) {
    const society = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      money: money,
      discount: discount,
      promotionWant: promotionWant,
      deals: deals,

      size: size,
      socials: socials,
      publicity: publicity,
      promotionOffer: promotionOffer,
      additional: additional,
      useServices: useServices, 
    };
    return this.http.post(`${this.uri}/socities/add`, society);
  }

  editSponsor(id, name, about, contactType, contact, size, socials, publicity, promotionWant, additional, useServices, money, discount, deals, promotionOffer) {
    const sponsor = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      size: size,
      socials: socials,
      publicity: publicity,
      promotionWant: promotionWant,
      additional: additional,
      useServices: useServices,

      money: money,
      discount: discount,
      deals: deals,
      promotionOffer: promotionOffer
    };
    return this.http.post(`${this.uri}/sponsors/edit/${id}`, sponsor);
  }

  editSociety(id, name, about, contactType, contact, money, discount, promotionWant, deals, size, socials, publicity, promotionOffer, additional, useServices) {
    const society = {
      name: name,
      about: about,
      contactType: contactType,
      contact: contact,

      money: money,
      discount: discount,
      promotionWant: promotionWant,
      deals: deals,

      size: size,
      socials: socials,
      publicity: publicity,
      promotionOffer: promotionOffer,
      additional: additional,
      useServices: useServices,
    };
    return this.http.post(`${this.uri}/societies/edit/${id}`, society);
  }
  
}
