import mongoose from "mongoose";

const Schema = mongoose.Schema;

const basketSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
});

basketSchema.pre('remove', async function(next) {
  const BasketItem = mongoose.model('BasketItem');
  await BasketItem.deleteMany({ basketId: this._id });
  next();
});

export default mongoose.model('Basket', basketSchema);
