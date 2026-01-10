import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs';

// Add food item with Cloudinary upload
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Image is required" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "vinotreats/food",
            resource_type: "image"
        });

        // Delete local temp file after upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.log("Error deleting temp file:", err);
        });

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url // Cloudinary URL
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log("Error adding food:", error);
        res.json({ success: false, message: "Error adding food" });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        // Delete from Cloudinary if it's a Cloudinary URL
        if (food.image && food.image.includes('cloudinary')) {
            const publicId = food.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`vinotreats/${publicId}`);
        } else if (food.image) {
            // Delete local file (for old images)
            fs.unlink(`uploads/${food.image}`, () => { });
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Update food item
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Food ID is required" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (category) updateData.category = category;

        const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedFood) {
            return res.json({ success: false, message: "Food item not found" });
        }

        res.json({ success: true, message: "Food Updated", data: updatedFood });
    } catch (error) {
        console.log("Error updating food:", error);
        res.json({ success: false, message: "Error updating food" });
    }
};

export { addFood, listFood, removeFood, updateFood };