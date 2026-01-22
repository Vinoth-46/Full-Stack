import express from "express";
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodControllers.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const foodRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", authMiddleware, adminMiddleware, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", authMiddleware, adminMiddleware, removeFood);
foodRouter.post("/update", authMiddleware, adminMiddleware, updateFood);

export default foodRouter;
