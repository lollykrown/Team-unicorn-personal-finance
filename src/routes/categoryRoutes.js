const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../../auth");

const incomeController = require('../controllers/incomeController')

const { authMiddleware } = incomeController()

router.use(auth, authMiddleware)
router.post("/category",auth, categoryController.addACategory);
router.get("/category",auth, categoryController.getAllUserCategories);

module.exports = router;