const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { calculeTarif } = require('../../services/calculePayement');
const stripe = Stripe(process.env.CLE_STRIPE);

router.post('/payementStripe', async (req, res) => {
  const { reservation } = req.body;
  console.log(reservation)
  const tarif=await calculeTarif(reservation)
  console.log("stripe : ",tarif)
  try {
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mad',
          unit_amount: tarif * 100, // récupérable dynamiquement
          product_data: {
            name: 'Réservation '+reservation.activite,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',

      metadata: {
        reservation: JSON.stringify(reservation)
      },

     success_url: `http://192.168.11.116:4200/resultPayement?status=success&activiter=${reservation.activite}&idRes=${reservation.id}&session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `http://192.168.11.116:4200/resultPayement?status=cancel&activiter=${reservation.activite}&idRes=${reservation.id}`,

    });

    res.json({ id: session.id });

  } catch (err) {
    console.error('Erreur lors de la création de session Stripe :', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
