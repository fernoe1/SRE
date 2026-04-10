import mongoose from "mongoose";

const { Schema } = mongoose;

const basketItemSchema = new Schema({
  basketId: {
    type: Schema.Types.ObjectId,
    ref: 'Basket',
    required: true
  },
  sneakerId: {
    type: Schema.Types.ObjectId,
    ref: 'Sneaker',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  size: {
    type: Number,
    required: true  
  }
});

export default mongoose.model('BasketItem', basketItemSchema);
