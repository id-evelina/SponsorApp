import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Sponsor = new Schema({

    //_id: mongoose.Schema.Types.ObjectId, 
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

    size: {
        type: Number
    },
    sizeCounter: {
        type: Number
    },
    socials: {
        type: Number
    },
    socialsCounter: {
        type: Number
    },
    publicity: {
        type: Boolean
    },
    publicityCounter: {
        type: Number
    },
    promotionWant: {
        type: Boolean
    },
    promotionWantCounter: {
        type: Number
    },
    useServices: {
        type: Boolean
    },
    useServicesCounter: {
        type: Number
    },
    additional: {
        type: Boolean
    },
    additionalCounter: {
        type: Number
    },

    money: {
        type: Number
    },
    discount: {
        type: Boolean
    },
    deals: {
        type: Boolean
    },
    promotionOffer: {
        type: Boolean
    }
});

export default mongoose.model('Sponsor', Sponsor);