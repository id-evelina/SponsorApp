export interface Society {
    /* My modified code starts here */
    id: String;
    name: String;
    about: String;
    contactType: String;
    contact: String;

    money: Number;
    moneyCounter: Number;
    discount: Boolean;
    discountCounter: Number;
    deals: Boolean;
    dealsCounter: Number;
    promotionWant: Boolean;
    promotionWantCounter: Number;
    
    size: Number;
    socials: Number;
    publicity: Boolean;
    promotionOffer: Boolean;
    useServices: Boolean;
    additional: Boolean;
}