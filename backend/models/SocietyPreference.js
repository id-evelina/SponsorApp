import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SocietyPreference = new Schema({
    /* My modified code starts here */

    society: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society'
    },
    bestMatch: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sponsor',
        default: null
    },
    preferenceList : [{
        sponsor : String,
        matchScore : String,
        notMatch : []
    }]
});

export default mongoose.model('SocietyPreference', SocietyPreference);