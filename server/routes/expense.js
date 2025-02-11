const { addExpense, getExpenses, updateExpense, deleteExpense, getTotalExpenses } = require("../controllers/expense");

const router = require("express").Router();

router.post("/add-expense/:userId", addExpense);

router.get("/get-expenses/:userId", getExpenses);

router.get("/get-total-expenses/:userId", getTotalExpenses);

router.patch("/update-expense/:userId/:expenseId", updateExpense);   

router.delete("/delete-expense/:userId/:expenseId", deleteExpense);

module.exports = router;    