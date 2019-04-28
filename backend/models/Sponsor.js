import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Sponsor = new Schema({

    //_id: mongoose.Schema.Types.ObjectId, 
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
    socials: {
        type: Number
    },
    publicity: {
        type: Boolean
    },
    promotionWant: {
        type: Boolean
    },
    additional: {
        type: Boolean
    },
    useServices: {
        type: Boolean
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