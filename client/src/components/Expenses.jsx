import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../api/expense';
import { CURRENCY_SYMBOLS } from '../constants';
import '../styles/Expenses.css';
import { useAuth } from './AuthProvider';
import { Filters } from './Filters';

export const Expenses = () => {
  const [isPending, setIsPending] = useState(false)
  const [expenses, setExpenses] = useState([])
  const { user } = useAuth();
  const titleRef = useRef(null);
  const descrptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);

  const maxAmount = expenses.length ? 
  Math.max(...expenses.map(expense => expense.amount)) 
  : 0;


  const filteredExpenses = expenses?.filter(expense =>{
    const matchSearch = expense.title.toLowerCase().includes(inputSearch.toLowerCase());
    if(selectedFilter && selectedFilter.type === 'amount'){
      return (
        matchSearch &&
        expense.amount >= selectedFilter.min &&
        expense.amount <= selectedFilter.max
      )
    }
    return matchSearch;
  });

  const resetFields = () => {
    titleRef.current.value = "";
    descrptionRef.current.value = "";
    amountRef.current.value = "";
    tagRef.current.value = "";
    currencyRef.current.value = "";
  }

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = descrptionRef.current?.value;
    const tag = tagRef.current.value;
    const amount = amountRef.current.value;
    const currency = currencyRef.current.value;
    const payload = {
      userId: user.id,
      title,
      description,
      tag,
      amount: Number(amount),
      currency
    };

    try {
      setIsPending(true);
      let data;
      if (editMode) {
        data = await updateExpense(user.id, currentExpense._id, payload);
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense._id === currentExpense._id ? data.expense : expense
          )
        );
        toast.success("Expense updated successfully");
      } else {
        data = await addExpense(payload);
        setExpenses((prevExpenses) => [...prevExpenses, data.expense]);
        toast.success(data.message);
      }
      resetFields();
      setEditMode(false);
      setCurrentExpense(null);
    } catch (error) {
      toast.error("Failed to submit expense.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await deleteExpense(user.id, expenseId);
      setExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== expenseId));
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditClick = (expense) => {
    try {
      setCurrentExpense(expense);
      titleRef.current.value = expense.title;
      descrptionRef.current.value = expense.description || '';
      amountRef.current.value = expense.amount;
      tagRef.current.value = expense.tag;
      currencyRef.current.value = expense.currency || 'ILS';
      setEditMode(true);
    } catch (error) {
      toast.error("Failed to load expense for editing.");
    }
  };

  return (
    <main className='expense-container'>
      <h1>Expenses</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' ref={titleRef} id='title' placeholder='Enter the title' required />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input type='text' ref={descrptionRef} id='description' placeholder='Enter the description' />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input type='number' ref={amountRef} inputMode='numeric' id='amount' placeholder='Enter the amount' required />
        </div>
        <div><label htmlFor='tag'>Tag</label>
          <select id="tag" ref={tagRef} required>
            <option value="food">Food</option>
            <option value="rent">Rent</option>
            <option value="transport">Transport</option>
            <option value="clothing">Clothing</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select></div>
        <div><label htmlFor='currency'>Currency</label>
          <select id="currency" ref={currencyRef} required>
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select></div>
        <button type='submit' className='expense-button' disabled={isPending}>
          {editMode ? 'Edit Expense' : 'Add Expense'}
        </button>
      </form>
      <Filters 
        inputSearch={inputSearch} 
        setInputSearch={setInputSearch} 
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        maxAmount={maxAmount}
      />
      <table className='expenses-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.title}</td>
                <td>{expense.description}</td>
                <td>{expense.amount} {CURRENCY_SYMBOLS[expense.currency]}</td>
                <td>{expense.tag}</td>
                <td>
                  <div className='action-buttons'>
                    <button className='edit-button' onClick={() => handleEditClick(expense)}>Edit</button>
                    <button className='delete-button' onClick={() => handleDelete(expense._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className='not-found'>
                {inputSearch ? `"${inputSearch}" not found.` : 'No expenses found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}