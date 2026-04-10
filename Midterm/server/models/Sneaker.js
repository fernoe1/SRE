import mongoose from "mongoose";

const sneakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  brand: {
    type: String,
    required: true,
    maxlength: 100
  },
  fit: {
    type: String,
    required: true,
    maxlength: 6
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  images: {
    type: [String], 
    default: []
  }
});

export default mongoose.model('Sneaker', sneakerSchema);
