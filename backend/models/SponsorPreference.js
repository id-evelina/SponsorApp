import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SponsorPreference = new Schema({

    sponsor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sponsor'
    },
    bestMatch: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society'
    },
    preferenceList: [ 
        {
            name: String,
            score : Number
        }
    ]
});

export default mongoose.model('SponsorPreference', SponsorPreference);