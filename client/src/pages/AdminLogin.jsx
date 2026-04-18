import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';

export default function AdminLogin() {
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
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      
      if (data.role !== 'admin') {
        dispatch(signInFailure('Access denied: You are not an administrator.'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/admin');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-6 bg-slate-50'>
      <div className='max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100'>
        <div className='bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white text-center'>
          <div className='bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm'>
            <FaUserShield className='text-3xl' />
          </div>
          <h1 className='text-2xl font-bold'>Admin Portal</h1>
          <p className='text-blue-100 text-sm mt-2'>Secure access for administrators only</p>
        </div>
        
        <div className='p-8'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='relative'>
              <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='email'
                placeholder='Admin Email'
                className='w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all'
                id='email'
                onChange={handleChange}
                required
              />
            </div>
            <div className='relative'>
              <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='password'
                placeholder='Password'
                className='w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all'
                id='password'
                onChange={handleChange}
                required
              />
            </div>
            <button
              disabled={loading}
              className='bg-blue-600 text-white p-3.5 rounded-xl font-bold uppercase hover:bg-blue-700 disabled:opacity-80 transition-all shadow-md hover:shadow-lg mt-2'
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>
          
          {error && <p className='text-red-500 mt-4 text-center font-medium bg-red-50 p-2 rounded-lg'>{error}</p>}
          
          <div className='mt-8 pt-6 border-t border-slate-100 text-center'>
            <Link to='/' className='text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors'>
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
