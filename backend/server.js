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

router.route('/societiesPreference').get((req, res) => {
    SocietyPreference.find((err, societiesPreference) => {
        if (err)
            console.log(err);
        else
            res.json(societiesPreference);
    });
});

router.route('/sponsorsPreference').get((req, res) => {
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

router.route('/societies/add').post((req, res) => {
    let society = new Society(req.body);
    society.save()
        .then(society => {
            res.status(200).json({'Society': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/sponsors/add').post((req, res) => {
    let sponsor = new Sponsor(req.body);
    sponsor.save()
        .then(sponsor => {
            res.status(200).json({'Sponsor': 'Added successfully'});
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
            sponsor.contact = req.body.contactType;
            sponsor.money = req.body.money;
            sponsor.discount = req.body.discount;
            sponsor.promotionWant = req.body.promotionWant;
            sponsor.deals = req.body.deals;
            sponsor.size = req.body.size;
            sponsor.socials = req.body.socials;
            sponsor.publicity = req.body.publicity;
            sponsor.promotionWant = req.body.promotionWant;
            sponsor.additional= req.body.additional;
            sponsor.useServices = req.body.useServices;

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
            society.contact = req.body.contactType;
            society.money = req.body.money;
            society.discount = req.body.discount;
            society.promotionWant = req.body.promotionWant;
            society.deals = req.body.deals;
            society.size = req.body.size;
            society.socials = req.body.socials;
            society.publicity = req.body.publicity;
            society.promotionOffer = req.body.promotionOffer;
            society.additional= req.body.additional;
            society.useServices = req.body.useServices;

            society.save().then(society => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

app.use('/sponsorApp', router);

app.listen(3000, () => console.log(`Express server running on port 3000`));