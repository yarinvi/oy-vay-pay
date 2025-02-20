import React, { useState, useRef } from 'react';
import '../styles/AuthForm.css';
import { signIn, signUp } from '../api/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export const AuthForm = () => {
const [isLogin, setIsLogin] = useState(true);
const [isPending, setIsPending] = useState(false);

const navigate = useNavigate();
const fullNameRef = useRef(null)
const usernameRef = useRef(null)
const emailRef = useRef(null)
const passwordRef = useRef(null)
console.log('render')

async function handleSubmit(e){
  e.preventDefault();
  console.log(fullNameRef);
  const fullName = fullNameRef.current?.value;
  const username = usernameRef.current.value;
  const email = emailRef.current?.value;
  const password = passwordRef.current.value;

  const payload ={
    fullName,
    username,
    email,
    password,
  };
  try{
    setIsPending(true);

  if(isLogin){
    const payload ={
      username,
      password,
    };
    const data = await signIn(payload);
    toast.success(data.message);
    window.location.href = '/';
    return;
  }

  console.log("is login:",isLogin);
  const data = await signUp(payload);
  toast.success(data.message);
  window.location.href = '/';


} catch(error){
  toast.error(error.message);
}
finally{
  setIsPending(false);
}

  // const data = await signUp(payload);
  // console.log(data);
  
}
 

return (
<div className="container">
<div className="form-container">
<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
<form onSubmit={handleSubmit}>
{!isLogin && (
    <>
    <div className="form-group">
<label htmlFor="fullName">Full Name</label>
<input type="text" id="fullName" placeholder="Enter your fullname" required ref={fullNameRef}/>
</div>
<div className="form-group">
<label htmlFor="email">Email</label>
<input type="email" id="email" placeholder="Enter your email" required ref={emailRef}/>
</div>

</>
)}
<div className="form-group">
<label htmlFor="username">Username</label>
<input type="text" id="username" placeholder="Enter your username" required ref={usernameRef}/>
</div>
<div className="form-group">
<label htmlFor="password">Password</label>
<input type="password" id="password" placeholder="Enter your password" required ref={passwordRef}/>
</div>
<button type="submit" className="btn" disabled={isPending}>
{isLogin ? 'Login' : 'Sign Up'}
</button>
</form>
<p>
{isLogin ? "Don't have an account?" : 'Already have an account?'}
<span onClick={() => setIsLogin(!isLogin)} className='auth-mode'>
{isLogin ? ' Sign Up' : ' Login'}
</span>
</p>
</div>
</div>
);
};
