import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SocietyPreference = new Schema({

    society: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Society'
    },
    bestMatch: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sponsor'
    },
    preferenceList: [ 
        {
            name: String,
            score : Number
        }
    ]
});

export default mongoose.model('SocietyPreference', SocietyPreference);