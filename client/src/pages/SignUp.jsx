import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto min-h-[80vh] flex flex-col justify-center'>
      <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100'>
        <h1 className='text-3xl text-center font-bold my-7 text-slate-800'>
          Create <span className='text-blue-600'>Account</span>
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Username'
            className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50'
            id='username'
            onChange={handleChange}
          />
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
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <div className='flex gap-2 mt-5 justify-center'>
          <p className='text-slate-500'>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-600 font-semibold hover:underline text-center'>Sign in</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center font-medium bg-red-50 p-3 rounded-xl'>{error}</p>}
      </div>
    </div>
  );
}
