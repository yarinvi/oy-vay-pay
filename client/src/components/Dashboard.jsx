import React, { useState, useEffect } from 'react'
import { LineChart, BarChart } from './charts';
import { useAuth } from './AuthProvider';
import '../styles/Dashboard.css';
import { getTotalExpenses } from '../api/expense';
import { CURRENCY_SYMBOLS } from '../constants';

export const Dashboard = () => {
  const {user} = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchTotalExpenses = async () => {

      try {
        setIsPending(true);
        const data = await getTotalExpenses(user.id);
        setTotalExpenses(data.total);
      } catch (error) {
        console.error('Error fetching total expenses:', error);
      } finally {
        setIsPending(false);
      }
    };
    fetchTotalExpenses();
  }, []);

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1>Welcome {user.fullName}</h1>
      </header>

      <div className='summary'>
        <div className='card income'>
          <h2>Total Incomes</h2>
          <p>{CURRENCY_SYMBOLS['ILS']}1000</p>
        </div>

        <div className='card expenses'>
          <h2>Total Expenses</h2>
          {isPending ? <p>...</p> : <p>{CURRENCY_SYMBOLS['ILS']}{totalExpenses.toFixed(2)}</p>}
        </div>

        <div className='card balance'>
          <h2>Total Balance</h2>
          <p>{CURRENCY_SYMBOLS['ILS']}100000</p>
        </div>
      </div>
      <div className='charts'>
        <LineChart />
        <BarChart />
      </div>
    </div>
  );
};
