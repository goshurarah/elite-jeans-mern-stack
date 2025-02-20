const SpecsTemplate = require('../models/specsTemplateModel'); // Path to your model file

exports.getAllSpecsTemplates = async (req, res) => {
    try {
        const specsTemplates = await SpecsTemplate.find()
            .populate('Garment_Type')
            .populate('Size_Range')
            .populate('pom_ids');
        res.status(200).json(specsTemplates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getSpecsTemplateById = async (req, res) => {
    try {
        console.log("Looking for SpecsTemplate with id:", req.params.id); // Debug log

        const specsTemplate = await SpecsTemplate.findById(req.params.id)
            .populate('Garment_Type')
            .populate('Size_Range')
            .populate('pom_ids');

        if (!specsTemplate) {
            return res.status(404).json({ message: 'SpecsTemplate not found' });
        }

        console.log("SpecsTemplate found:", specsTemplate); // Log the result

        res.status(200).json(specsTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createSpecsTemplate = async (req, res) => {
    try {
        const { Name, Garment_Type, Size_Range, Point_of_Measure, pom_ids } = req.body;

        const newSpecsTemplate = new SpecsTemplate({
            Name,
            Garment_Type,
            Size_Range,
            Point_of_Measure,
            pom_ids,
        });

        const savedSpecsTemplate = await newSpecsTemplate.save();
        res.status(201).json(savedSpecsTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateSpecsTemplate = async (req, res) => {
    try {
        const updatedSpecsTemplate = await SpecsTemplate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('Garment_Type')
            .populate('Size_Range')
            .populate('pom_ids');

        if (!updatedSpecsTemplate) {
            return res.status(404).json({ message: 'SpecsTemplate not found' });
        }
        res.status(200).json(updatedSpecsTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteSpecsTemplate = async (req, res) => {
    try {
        const deletedSpecsTemplate = await SpecsTemplate.findByIdAndDelete(req.params.id);
        if (!deletedSpecsTemplate) {
            return res.status(404).json({ message: 'SpecsTemplate not found' });
        }
        res.status(200).json({ message: 'SpecsTemplate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};