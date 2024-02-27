const express = require('express');
const axios = require('axios');
const router = express.Router();
const Sneaker = require('../models/Sneaker');
const UserAction = require('../models/UserDetails');
const userMiddleware = require('../middleware/userMiddleware');

//The Sneaker Database API. Your Ultimate Sneaker Encyclopedia
router.get('/sneakers', userMiddleware, async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const response1 = await axios.get('https://the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com/search', {
            params: {
                query: 'Jordan'
            },
            headers: {
                'X-RapidAPI-Key': '9f6c10973emsh772aabd5082f541p1ae6adjsndc5badf619fa',
                'X-RapidAPI-Host': 'the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com'
            }
        });
        const response2 = await axios.get('https://the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com/search', {
            params: {
                query: 'New Balance'
            },
            headers: {
                'X-RapidAPI-Key': '9f6c10973emsh772aabd5082f541p1ae6adjsndc5badf619fa',
                'X-RapidAPI-Host': 'the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com'
            }
        });
        const response3 = await axios.get('https://the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com/search', {
            params: {
                query: 'ASICS'
            },
            headers: {
                'X-RapidAPI-Key': '9f6c10973emsh772aabd5082f541p1ae6adjsndc5badf619fa',
                'X-RapidAPI-Host': 'the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com'
            }
        });
        res.render('client/dashboard', { lang: lang, sneakers: response1.data.hits, sneakersNew: response2.data.hits, sneakersAsics: response3.data.hits, userId: req.session.userId, user: req.user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//ASOS
router.get('/last-collection', userMiddleware, async (req, res) => {
    const lang = req.query.lang || 'en';
    const options = {
        method: 'GET',
        url: 'https://asos10.p.rapidapi.com/api/v1/getProductListBySearchTerm',
        params: {
            searchTerm: 'sneakers',
            currency: 'USD',
            country: 'US',
            store: 'US',
            languageShort: 'en',
            sizeSchema: 'US',
            limit: '50',
            offset: '0'
        },
        headers: {
            'X-RapidAPI-Key': '9f6c10973emsh772aabd5082f541p1ae6adjsndc5badf619fa',
            'X-RapidAPI-Host': 'asos10.p.rapidapi.com'
        }
    };

    try {
        console.log('Request options:', options); // Log options object
        const response = await axios.request(options);
        console.log('Response:', response.data); // Log response data
        res.render('client/sneakers/lastcollection', { lang: lang, sneakers: response.data.data.products, userId: req.session.userId, user: req.user });
    } catch (error) {
        console.error('Error:', error); // Log any errors
        res.status(500).json({error: 'Internal Server Error'});
    }
});
router.get('/sneakers/:id/search', userMiddleware, async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const userId = req.session.userId || null;
        const sneakersId = req.params.id;
        const response = await axios.get(`https://the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com/product/${sneakersId}`, {
            headers: {
                'X-RapidAPI-Key': '9f6c10973emsh772aabd5082f541p1ae6adjsndc5badf619fa',
                'X-RapidAPI-Host': 'the-sneaker-database-api-your-ultimate-sneaker-encyclopedia.p.rapidapi.com'
            }
        });
        const sneaker = response.data;
        const existingSneaker = await Sneaker.findOne({ title: sneaker.title });
        if (!existingSneaker) {
            // If the sneaker does not exist, create a new one
            await Sneaker.create({
                image: sneaker.image,
                title: sneaker.title,
                price: sneaker.base_price,
            });

            if (userId) {
                await UserAction.create({
                    userId: userId,
                    action: 'search',
                    actionDetails: `Поиск кроссовок: ${sneaker.title}`,
                });
            }
        }
        res.render('client/sneakers/index', { lang: lang, sneaker: sneaker, userId: req.session.userId, user: req.user});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;