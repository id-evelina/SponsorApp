import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SponsorPreference = new Schema({
    /* My modified code starts here */

    sponsor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sponsor'
    },
    bestMatch: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society',
        default: null
    },
    preferenceList : [{
        society : String,
        matchScore : String,
        notMatch : []
    }]
});

export default mongoose.model('SponsorPreference', SponsorPreference);