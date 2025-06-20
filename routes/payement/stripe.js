const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.CLE_STRIPE);
router.post('/payementStrip', async (req, res) => {
  const {montant,infoReservation} = req.body;
  // montanant : prix de reservation
  //inforReservation : reservatin de terrain tennis 
  console.log(montant,infoReservation)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mad',
          unit_amount: montant*100,
          product_data: {
            name: infoReservation,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:4200/resultPayement?status=success`,
      cancel_url: `http://localhost:4200/resultPayement?status=cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports=router