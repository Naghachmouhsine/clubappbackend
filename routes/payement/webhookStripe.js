// routes/stripeWebhook.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.CLE_STRIPE);
const { reserver } = require('../reservations');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  console.log("good1")

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erreur de signature webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const reservation = JSON.parse(session.metadata.reservation);
      await reserver(reservation); // exécute la réservation

      res.status(200).send('Réservation enregistrée');
    } catch (err) {
      console.error('Erreur lors de l’enregistrement de la réservation :', err.message);

      try {
        await stripe.refunds.create({ payment_intent: session.payment_intent });
        console.log('Paiement remboursé');
      } catch (refundErr) {
        console.error('Erreur lors du remboursement :', refundErr.message);
      }

      res.status(500).send('Erreur BDD : réservation annulée et remboursement effectué');
    }
  } else {
    res.status(200).send('Événement ignoré');
  }
});

module.exports = router;
