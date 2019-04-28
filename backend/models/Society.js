import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Society = new Schema({

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
    money: {
        type: Number
    },
    discount: {
        type: Boolean
    },
    promotionWant: {
        type: Boolean
    },
    deals: {
        type: Boolean
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
    additional: {
        type: Boolean
    },
    useServices: {
        type: Boolean
    }
});

export default mongoose.model('Society', Society);