import express from "express";
import {
  getSneakersByBasketId,
  checkIfBasketContainsSneaker,
  addSneakerToBasket,
  removeSneakerFromBasket,
  updateSneakerQuantity
} from "../controllers/basketController.js"; 

const router = express.Router();

router.get("/:basketId", async (req, res) => {
  try {
    const { basketId } = req.params;
    const items = await getSneakersByBasketId(basketId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:basketId/contains/:sneakerId/:size", async (req, res) => {
  try {
    const { basketId, sneakerId, size } = req.params;
    const exists = await checkIfBasketContainsSneaker(basketId, sneakerId, Number(size));
    res.json({ exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:basketId/add", async (req, res) => {
  try {
    const { basketId } = req.params;
    const { sneakerId, size, price } = req.body;

    const item = await addSneakerToBasket(
      basketId,
      sneakerId,
      Number(size),
      Number(price),
      1
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:basketId/remove/:sneakerId/:size", async (req, res) => {
  try {
    const { basketId, sneakerId, size } = req.params;
    const removed = await removeSneakerFromBasket(basketId, sneakerId, Number(size));
    res.json({ removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/:basketId/update/:sneakerId/:size", async (req, res) => {
  try {
    const { basketId, sneakerId, size } = req.params;
    const { changeBy } = req.body;

    if (typeof changeBy !== "number") {
      return res.status(400).json({ error: "changeBy must be a number" });
    }

    const updatedItem = await updateSneakerQuantity(basketId, sneakerId, Number(size), changeBy);

    res.json({ updatedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
