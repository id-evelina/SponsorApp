import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Society from './models/Society';
import Sponsor from './models/Sponsor';
import SocietyPreference from './models/SocietyPreference';
import SponsorPreference from './models/SponsorPreference';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sponsorApp', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/societies').get((req, res) => {
    Society.find((err, societies) => {
        if (err)
            console.log(err);
        else
            res.json(societies);
    });
});

router.route('/sponsors').get((req, res) => {
    Sponsor.find((err, sponsors) => {
        if (err)
            console.log(err);
        else
            res.json(sponsors);
    });
});

router.route('/societyPreference').get((req, res) => {
    SocietyPreference.find((err, societiesPreference) => {
        if (err)
            console.log(err);
        else
            res.json(societiesPreference);
    });
});

router.route('/sponsorPreference').get((req, res) => {
    SponsorPreference.find((err, sponsorsPreference) => {
        if (err)
            console.log(err);
        else
            res.json(sponsorsPreference);
    });
});

router.route('/sponsors/:id').get((req, res) => {
    Sponsor.findById(req.params.id, (err, sponsor) => {
        if (err) 
            console.log(err);
        else
            res.json(sponsor);
    })
});

router.route('/societies/:id').get((req, res) => {
    Society.findById(req.params.id, (err, society) => {
        if (err) 
            console.log(err);
        else
            res.json(society);
    })
});

router.route('/sponsorPreference/:id').get((req, res) => {
    SponsorPreference.findById(req.params.id, (err, sponsorPreference) => {
        if (err)  
            console.log(err);
        else
            res.json(sponsorPreference);
    })
});

router.route('/societyPreference/:id').get((req, res) => {
    SocietyPreference.findById(req.params.id, (err, societyPreference) => {
        if (err)
            console.log(err);
        else
            res.json(societyPreference);
    })
});

router.route('/sponsorPreference/sponsor/:sponsor').get((req, res) => {
    var sponsor = new mongoose.Types.ObjectId(req.params.sponsor);
    SponsorPreference.findOne({sponsor: sponsor}, function(err, sponsorPreference) {
        if(err)
            console.log(err);
        else
            res.json(sponsorPreference);
    });
});

router.route('/societyPreference/society/:society').get((req, res) => {
    //var societyId = new mongoose.Types.ObjectId(req.params.society);
    SocietyPreference.findOne({society: req.params.society}, function(err, societyPreference) {
        if(err)
            console.log(err);
        else
            //res.render('societyPreference', { societyPreference : societyPreference });
           res.json(societyPreference);
    });
});

router.route('/societies/add').post((req, res) => {
    let society = new Society(req.body);
    society.save()
        .then(society => {
            res.json(society.id);
            //res.status(200).json({'Society': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/societyPreference/add').post((req, res) => {
    let societyPreference = new SocietyPreference(req.body);
    societyPreference.save()
        .then(societyPreference => {
            res.status(200).json({'societyPreference': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/sponsors/add').post((req, res) => {
    let sponsor = new Sponsor(req.body);
    sponsor.save()
        .then(sponsor => {
            res.json(sponsor.id);
            //res.status(200).json({'Sponsor': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/sponsorPreference/add').post((req, res) => {
    let sponsorPreference = new SponsorPreference(req.body);
    sponsorPreference.save()
        .then(sponsorPreference => {
            res.status(200).json({'SponsorPreference': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/sponsors/edit/:id').post((req, res) => {
    Sponsor.findById(req.params.id, (err, sponsor) => {
        if (!sponsor)
            return next(new Error('Could not load Document'));
        else {
            sponsor.name = req.body.name;
            sponsor.about = req.body.about;
            sponsor.contactType = req.body.contactType;
            sponsor.contact = req.body.contact;

            sponsor.size = req.body.size;
            sponsor.sizeCounter = req.body.sizeCounter;
            sponsor.socials = req.body.socials;
            sponsor.socialsCounter = req.body.socialsCounter;
            sponsor.publicity = req.body.publicity;
            sponsor.publicityCounter = req.body.publicityCounter;
            sponsor.promotionWant = req.body.promotionWant;
            sponsor.promotionWantCounter = req.body.promotionWantCounter;
            sponsor.useServices = req.body.useServices;
            sponsor.useServicesCounter = req.body.useServicesCounter;
            sponsor.additional = req.body.additional;
            sponsor.additionalCounter = req.body.additionalCounter;

            sponsor.money = req.body.money;
            sponsor.discount = req.body.discount;
            sponsor.deals = req.body.deals;
            sponsor.promotionOffer = req.body.promotionOffer;

            sponsor.save().then(sponsor => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/societies/edit/:id').post((req, res) => {
    Society.findById(req.params.id, (err, society) => {
        if (!society)
            return next(new Error('Could not load Document'));
        else {
            society.name = req.body.name;
            society.about = req.body.about;
            society.contactType = req.body.contactType;
            society.contact = req.body.contact;

            society.money = req.body.money;
            society.moneyCounter = req.body.moneyCounter;
            society.discount = req.body.discount;
            society.discountCounter = req.body.discountCounter;
            society.deals = req.body.deals;
            society.dealsCounter = req.body.dealsCounter;
            society.promotionWant = req.body.promotionWant;
            society.promotionWantCounter = req.body.promotionWantCounter;

            society.size = req.body.size;
            society.socials = req.body.socials;
            society.publicity = req.body.publicity;
            society.promotionOffer = req.body.promotionOffer;
            society.useServices = req.body.useServices;
            society.additional= req.body.additional;

            society.save().then(society => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});


router.route('/societyPreference/edit').post((req, res) => {
    SocietyPreference.findOneAndUpdate({society: req.body.society}, req.body, function(err){})
    .then(societyPreference => {
        res.json('Update done');
    }).catch(err => {
        res.status(400).send('Update failed');
    });
});

router.route('/societyPreference/editBestMatch').post((req, res) => {
    SocietyPreference.findOneAndUpdate({society: req.body.society}, {society: req.body.society, bestMatch: req.body.bestMatch}, {new: true}, function(err, societyPreference){})
    .then(societyPreference => {
        res.json('Update done');
    }).catch(err => {
        res.status(400).send('Update failed');
    });
});

router.route('/sponsorPreference/edit').post((req, res) => {

    SponsorPreference.findOneAndUpdate({sponsor: req.body.sponsor}, req.body, function(err){})
    .then(sponsorPreference => {
        res.json('Update done');
    }).catch(err => {
        res.status(400).send('Update failed');
    });
});

router.route('/sponsorPreference/editBestMatch').post((req, res) => {
    SponsorPreference.findOneAndUpdate({sponsor: req.body.sponsor}, {sponsor: req.body.sponsor, bestMatch: req.body.bestMatch}, {new: true}, function(err, sponsorPreference){})
    .then(sponsorPreference => {
        res.json('Update done');
    }).catch(err => {
        res.status(400).send('Update failed');
    });
});

app.use('/sponsorApp', router);

app.listen(3000, () => console.log(`Express server running on port 3000`));