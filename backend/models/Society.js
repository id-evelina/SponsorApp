import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Society = new Schema({

    /* My modified code starts here */
    email: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    about: {
        type: String 
    },
    contactType: {
        type: String
    },
    contact: {
        type: String
    },

    money: {
        type: Number
    },
    moneyCounter: {
        type: Number
    },
    discount: {
        type: Boolean
    },
    discountCounter: {
        type: Number
    },
    deals: {
        type: Boolean
    },
    dealsCounter: {
        type: Number
    },
    promotionWant: {
        type: Boolean
    },
    promotionWantCounter: {
        type: Number
    },
    size: {
        type: Number
    },
    socials: {
        type: Number
    },
    publicity: {
        type: Boolean
    },
    promotionOffer: {
        type: Boolean
    },
    useServices: {
        type: Boolean
    },
    additional: {
        type: Boolean
    }
});

export default mongoose.model('Society', Society);