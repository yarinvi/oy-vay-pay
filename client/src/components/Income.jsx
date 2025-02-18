import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import '../styles/Expenses.css'; // Reuse the same styles
import { addIncome, getIncomes } from '../api/income';
import { toast } from 'react-toastify';
import { CURRENCY_SYMBOLS } from '../constants';

export const Income = () => {
  const [isPending, setIsPending] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const { user } = useAuth();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);

  const resetFields = () => {
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    amountRef.current.value = "";
    tagRef.current.value = "";
    currencyRef.current.value = "";
  };

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes(user.id);
      setIncomes(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current?.value;
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
      const data = await addIncome(payload);
      resetFields();
      toast.success(data.message);
      setIncomes((prevIncomes) => [...prevIncomes, data.income]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className='expense-container'>
      <h1>Incomes</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' ref={titleRef} id='title' placeholder='Enter the title' required />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input type='text' ref={descriptionRef} id='description' placeholder='Enter the description' />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input type='number' ref={amountRef} inputMode='numeric' id='amount' placeholder='Enter the amount' required />
        </div>
        <div>
          <label htmlFor='tag'>Tag</label>
          <select id="tag" ref={tagRef} required>
            <option value="salary">Salary</option>
            <option value="bonus">Bonus</option>
            <option value="gift">Gift</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor='currency'>Currency</label>
          <select id="currency" ref={currencyRef} required>
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <button type='submit' className='expense-button' disabled={isPending}>Add Income</button>
      </form>
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
          {incomes && incomes.length > 0 ? (
            incomes.map((income) => (
              <tr key={income._id}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{income.amount} {CURRENCY_SYMBOLS[income.currency]}</td>
                <td>{income.tag}</td>
                <td>
                  <div className='action-buttons'>
                    <button className='edit-button'>Edit</button>
                    <button className='delete-button'>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No incomes found</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Income; 