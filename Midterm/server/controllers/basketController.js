import Basket from "../models/Basket.js";
import BasketItem from "../models/BasketItem.js";
import Sneaker from "../models/Sneaker.js";

export const getSneakersByBasketId = async (basketId) => {
  if (!basketId) {
    throw new Error("basketId is required");
  }

  const basketItems = await BasketItem.find({ basketId }).populate("sneakerId");

  return basketItems.map(item => ({
    sneaker: {
      _id: item.sneakerId._id,
      name: item.sneakerId.name,
      brand: item.sneakerId.brand,
      fit: item.sneakerId.fit,
      price: item.sneakerId.price,
      firstImage: item.sneakerId.images?.[0] || null 
    },
    quantity: item.quantity,
    size: item.size,
    price: item.price
  }));
};

export const checkIfBasketContainsSneaker = async (basketId, sneakerId, size) => {
  if (!basketId || !sneakerId || !size) {
    throw new Error("basketId, sneakerId, and size are required");
  }

  const existingItem = await BasketItem.findOne({
    basketId,
    sneakerId,
    size
  });

  return !!existingItem; 
};

export const addSneakerToBasket = async (basketId, sneakerId, size, price, quantity = 1) => {
  if (!basketId || !sneakerId || !size || !price) {
    throw new Error("basketId, sneakerId, size, and price are required");
  }

  let basketItem = await BasketItem.findOne({ basketId, sneakerId, size });

  if (basketItem) {
    basketItem.quantity += quantity;
  } else {
    basketItem = new BasketItem({
      basketId,
      sneakerId,
      size,
      price,
      quantity
    });
  }

  await basketItem.save();
  return basketItem;
};

export const removeSneakerFromBasket = async (basketId, sneakerId, size) => {
  if (!basketId || !sneakerId || !size) {
    throw new Error("basketId, sneakerId, and size are required");
  }

  const result = await BasketItem.deleteOne({ basketId, sneakerId, size });
  return result.deletedCount > 0;
};

export const updateSneakerQuantity = async (basketId, sneakerId, size, changeBy) => {
  if (!basketId || !sneakerId || !size || !changeBy) {
    throw new Error("basketId, sneakerId, size, and changeBy are required");
  }

  const basketItem = await BasketItem.findOne({ basketId, sneakerId, size });

  if (!basketItem) {
    throw new Error("Basket item not found");
  }

  basketItem.quantity += changeBy;

  if (basketItem.quantity <= 0) {
    await basketItem.deleteOne();
    return null;
  }

  await basketItem.save();
  return basketItem;
};

