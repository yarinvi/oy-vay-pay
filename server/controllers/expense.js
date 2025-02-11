const { z } = require("zod");
const User = require("../models/user");
const { userIdValidation } = require("../lib/validation/user");
const { expenseSchema, expenseIdValidation } = require("../lib/validation/expense");
const Expense = require("../models/expense");

const addExpense = async (req, res) => {
    try {
        if(!req.user){
            return res.status(403).json({ message: "Forbidden" });
        }
        const userId = userIdValidation.parse(req.params.userId);
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        let exchangedAmount = amount;
        const BASE_CURRENCY='ILS';
        
        if (currency !== BASE_CURRENCY) {
            try {
                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${currency}/ILS/${amount}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rate');
                }
                const data = await response.json();
                exchangedAmount = data.conversion_result;
            } catch (error) {
                console.error("Exchange rate error:", error);
                return res.status(500).json({ message: "Failed to convert currency" });
            }
        }

        const expense = new Expense({
            title,
            description,
            amount,
            tag,
            currency,
            exchangedAmount
        });

        await expense.save();
        userExists.expenses.push(expense);
        await userExists.save();

        return res.status(200).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getExpenses = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" }); 
        }

        const expenses = await Expense.find({ _id: { $in: userExists.expenses } });

        return res.status(200).json(expenses); 
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message }); 
        }
        return res.status(500).json({ message: "Internal server error" }); 
    }
}

const updateExpense = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        const expenseId = expenseIdValidation.parse(req.params.expenseId);
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userExists.expenses.includes(expenseId)) {
            return res.status(404).json({ message: "Expense not found" });
        }

        let exchangedAmount = amount;
        const BASE_CURRENCY = 'ILS';
        
        if (currency !== BASE_CURRENCY) {
            try {
                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${currency}/ILS/${amount}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rate');
                }
                const data = await response.json();
                exchangedAmount = data.conversion_result;
            } catch (error) {
                console.error("Exchange rate error:", error);
                return res.status(500).json({ message: "Failed to convert currency" });
            }
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                title,
                description,
                amount,
                tag,
                currency,
                exchangedAmount
            },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        return res.status(200).json({ 
            message: "Expense updated successfully",
            expense: updatedExpense 
        });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        const expenseId = expenseIdValidation.parse(req.params.expenseId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" }); 
        }

        if (!userExists.expenses.includes(expenseId)) {
            return res.status(404).json({ message: "Expense not found" }); 
        }

        const deletedExpense = await Expense.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not deleted" }); 
        }

        return res.status(200).json({ message: "Expense deleted successfully" }); 
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message }); 
        }
        return res.status(500).json({ message: "Internal server error" }); 
    }
    
}

const getTotalExpenses = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const expenses = await Expense.find({ _id: { $in: userExists.expenses } });
        
        // Calculate total using exchangedAmount
        const totalExpenses = expenses.reduce((total, expense) => {
            return total + expense.exchangedAmount;
        }, 0);

        return res.status(200).json({ 
            total: totalExpenses,
            currency: 'ILS'
        });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getTotalExpenses
};
