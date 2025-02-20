const ItemType = require('../models/itemTypeModel');

exports.getAllItemTypes = async (req, res) => {
  try {
    const itemTypes = await ItemType.find();
    res.status(200).json(itemTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItemType = async (req, res) => {
  const itemType = new ItemType({
    name: req.body.name,
  });

  try {
    const savedItemType = await itemType.save();
    res.status(201).json(savedItemType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteItemType = async (req, res) => {
  try {
    const deletedItemType = await ItemType.findByIdAndDelete(req.params.id);
    if (!deletedItemType) {
      return res.status(404).json({ message: "ItemType not found" });
    }
    res.status(200).json({ message: "ItemType deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItemType = async (req, res) => {
  try {
    const updatedItemType = await ItemType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItemType) {
      return res.status(404).json({ message: "ItemType not found" });
    }
    res.status(200).json(updatedItemType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
