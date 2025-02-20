const GarmentType = require('../models/garmentTypeModel');
const getAllGarmentTypes = async (req, res) => {
    try {
        const garmentTypes = await GarmentType.find();
        res.json(garmentTypes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
const getGarmentTypeById = async (req, res) => {
    try {
        const garmentType = await GarmentType.findById(req.params.id);
        if (!garmentType) return res.status(404).json({ message: "Garment type not found" });
        res.json(garmentType);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
const createGarmentType = async (req, res) => {
    try {
        const newGarmentType = new GarmentType({ Garment_Type: req.body.Garment_Type });
        await newGarmentType.save();
        res.status(201).json(newGarmentType);
    } catch (error) {
        res.status(400).json({ message: "Error creating garment type", error });
    }
};
const updateGarmentType = async (req, res) => {
    try {
        const updatedGarmentType = await GarmentType.findByIdAndUpdate(
            req.params.id,
            { Garment_Type: req.body.Garment_Type },
            { new: true }
        );
        if (!updatedGarmentType) return res.status(404).json({ message: "Garment type not found" });
        res.json(updatedGarmentType);
    } catch (error) {
        res.status(400).json({ message: "Error updating garment type", error });
    }
};
const deleteGarmentType = async (req, res) => {
    try {
        const deletedGarmentType = await GarmentType.findByIdAndDelete(req.params.id);
        if (!deletedGarmentType) return res.status(404).json({ message: "Garment type not found" });
        res.json({ message: "Garment type deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
module.exports = {
    getAllGarmentTypes,
    getGarmentTypeById,
    createGarmentType,
    updateGarmentType,
    deleteGarmentType
};