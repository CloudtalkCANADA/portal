const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../utils/prisma');
const { resCode, resMessage } = require('../utils/resCode');
const { isEmpty } = require('../utils/isEmpty');
const { squareClient } = require('../utils/square');

exports.addPayment = async (req, res) => {
    const { checkoutApi, locationsApi } = squareClient;
    try {
        const locationResponse = await locationsApi.listLocations();

        if (locationResponse.result.locations) {
            const locationId = locationResponse.result.locations[0].id;

            const body = {
                idempotencyKey: uuidv4(),
                quickPay: {
                        name: 'Phone Count purchase',
                        priceMoney: {
                        amount: 10000,
                        currency: 'USD'
                    },
                    locationId: locationId,
                }
            };

            const response = await checkoutApi.createPaymentLink(body);
            console.log('Payment Link URL:', response.result);

        } else throw new Error('No locations found.');
    } catch (error) {
        console.log(error);
        return res.status(resCode.PAYMENT_FAILED).json({ msg: resMessage.PAYMENT_FAILED });
    }
}