import Sneaker from "../models/Sneaker.js";

export const getAllSneakers = async (req, res) => {
  try {
    const sneakers = await Sneaker.find();

    res.status(200).json({ sneakers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSneakerById = async (req, res) => {
  const { id } = req.params;
  try {
    const sneaker = await Sneaker.findById(id);

    if (!sneaker) {
      return res.status(404).json({ msg: "Sneaker not found" });
    }

    res.status(200).json({ sneaker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addSneaker = async (req, res) => {
  const { name, brand, fit, price, images } = req.body;
  try {
    const newSneaker = new Sneaker({
      name,
      brand,
      fit,
      price,
      images: images || []
    });
    
    const sneaker = await newSneaker.save();
    res.status(201).json({ sneaker });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSneaker = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSneaker = await Sneaker.findByIdAndDelete(id);

    if (!deletedSneaker) {
      return res.status(404).json({ msg: "Sneaker not found" });
    }

    res.status(200).json({ msg: "Sneaker deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
