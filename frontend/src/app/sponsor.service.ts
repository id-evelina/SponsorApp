import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SponsorService {
  /* My modified code starts here */

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

  getSponsorPreference() {
    return this.http.get(`${this.uri}/sponsorPreference`);
  }

  getSocietyPreference() {
    return this.http.get(`${this.uri}/societyPreference`);
  }
  
  getSocietyPreferenceById(id) {
    return this.http.get(`${this.uri}/societyPreference/${id}`);
  }

  getSponsorPreferenceBySponsor(sponsor) {
    return this.http.get(`${this.uri}/sponsorPreference/sponsor/${sponsor}`, sponsor);
  }

  getSocietyPreferenceBySociety(society) {
    return this.http.get(`${this.uri}/societyPreference/society/${society}`, society);
  }

  addSponsorPreference(sponsor, preferenceList) {

    const sponsorPreference = {
      sponsor : sponsor,
      preferenceList : preferenceList
    };

    return this.http.post(`${this.uri}/sponsorPreference/add`, sponsorPreference);
  }

  addSocietyPreference(society, preferenceList) {

    const societyPreference = {
      society : society,
      preferenceList : preferenceList
    };

    return this.http.post(`${this.uri}/societyPreference/add`, societyPreference);
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

  editSocietyPreference(societyId, bestMatch, preferenceList) {
    const societyPreference = {
      society: societyId,
      bestMatch: bestMatch,
      preferenceList: preferenceList
    };
    return this.http.post(`${this.uri}/societyPreference/edit`, societyPreference);
  }

  editSponsorPreference(sponsorId, bestMatch, preferenceList) {
    const sponsorPreference = {
      sponsor: sponsorId,
      bestMatch: bestMatch,
      preferenceList: preferenceList
    };
    return this.http.post(`${this.uri}/sponsorPreference/edit`, sponsorPreference);
  }

  editSocietyPreferenceBestMatch(society, bestMatch){
    const societyPreference = {
      society: society,
      bestMatch: bestMatch
    }
    return this.http.post(`${this.uri}/societyPreference/editBestMatch`, societyPreference);
  }

  editSponsorPreferenceBestMatch(sponsor, bestMatch){
    const sponsorPreference = {
      sponsor : sponsor,
      bestMatch : bestMatch
    }
    return this.http.post(`${this.uri}/sponsorPreference/editBestMatch`, sponsorPreference);
  }

  deleteSponsor (sponsorId) {
    return this.http.delete(`${this.uri}/sponsors/delete/${sponsorId}`);
  }

  deleteSociety (societyId) {
    return this.http.delete(`${this.uri}/societies/delete/${societyId}`);
  }

  deleteSponsorPreference (sponsorId) {
    return this.http.delete(`${this.uri}/sponsorPreference/delete/${sponsorId}`);
  }

  deleteSocietyPreference (societyId) {
    return this.http.delete(`${this.uri}/societyPreference/delete/${societyId}`);
  }

  loginCheck(name, password) {
    return this.http.get(`${this.uri}/societies/${name}`);
  }
  
}
