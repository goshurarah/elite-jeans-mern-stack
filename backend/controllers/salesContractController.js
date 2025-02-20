const SalesContract = require('../models/salesContractModel');

exports.getAllSalesContracts = async (req, res) => {
  try {
    const salesContracts = await SalesContract.find();
    res.status(200).json(salesContracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSalesContract = async (req, res) => {
  const salesContract = new SalesContract({
    currentSalesNumber: req.body.currentSalesNumber,
    startDate: req.body.startDate,
  });

  try {
    const savedSalesContract = await salesContract.save();
    res.status(201).json(savedSalesContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSalesContract = async (req, res) => {
  try {
    const deletedSalesContract = await SalesContract.findByIdAndDelete(req.params.id);
    if (!deletedSalesContract) {
      return res.status(404).json({ message: "Sales contract not found" });
    }
    res.status(200).json({ message: "Sales contract deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSalesContract = async (req, res) => {
  try {
    const updatedSalesContract = await SalesContract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSalesContract) {
      return res.status(404).json({ message: "Sales contract not found" });
    }
    res.status(200).json(updatedSalesContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
