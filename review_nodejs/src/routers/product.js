import { Router } from "express";
import { createProduct, getProductByID, getProducts, getProductsPaginate, getRelatedProducts, removeProduct, updateProduct } from "../controllers/ProductController";
import { checkAuth } from "../middlewares/checkAuth";

const router = Router();

// router.get("/products", getProducts);
router.get("/products", getProductsPaginate);
router.get("/products/:id", getProductByID);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", removeProduct);
router.get("/products/related/:productId", getRelatedProducts);

export default router;