export interface Sponsor {
    /* My modified code starts here */
    id: String;
    name: String;
    about: String;
    contactType: String;
    contact: String;
    
    size: Number;
    sizeCounter: Number;
    socials: Number;
    socialsCounter: Number;
    publicity: Boolean;
    publicityCounter: Number;
    promotionWant: Boolean;
    promotionWantCounter: Number;
    useServices: Boolean;
    useServicesCounter: Number;
    additional: Boolean;
    additionalCounter: Number;

    money: Number;
    discount: Boolean;
    deals: Boolean;
    promotionOffer: Boolean;
}