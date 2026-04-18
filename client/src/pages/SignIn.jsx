import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto min-h-[80vh] flex flex-col justify-center'>
      <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100'>
        <h1 className='text-3xl text-center font-bold my-7 text-slate-800'>
          Welcome <span className='text-blue-600'>Back</span>
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50'
            id='password'
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-bold uppercase hover:opacity-95 disabled:opacity-80 transition-all shadow-lg shadow-blue-200'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
        <div className='flex gap-2 mt-5 justify-center'>
          <p className='text-slate-500'>Dont have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-600 font-semibold hover:underline'>Sign up</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center font-medium bg-red-50 p-3 rounded-xl'>{error}</p>}
      </div>
    </div>
  );
}
