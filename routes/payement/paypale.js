const express = require("express");
const router = express.Router();
const paypal = require("@paypal/checkout-server-sdk");

//Configuration de l’environnement PayPal
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

//Créer une commande
router.post("/create-paypal-order", async (req, res) => {
  const  amount  = 200;
  console.log(amount)
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: amount
      }
    }]
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({ orderID: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création de la commande PayPal");
  }
});

//  Capturer le paiement
router.post("/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  console.log("capture : ",orderID)
  const request = new paypal.orders.OrdersCaptureRequest(orderID);

  try {
    const capture = await client.execute(request);
    res.status(200).json(capture.result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la capture de paiement PayPal");
  }
});

module.exports = router;
