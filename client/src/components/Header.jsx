import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const [initialSearchTerm, setInitialSearchTerm] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl !== null) {
      setSearchTerm(searchTermFromUrl);
      setInitialSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className='bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/'>
          <h1 className='font-extrabold text-xl sm:text-2xl flex flex-wrap tracking-tight'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>Real</span>
            <span className='text-slate-800'>Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100/50 p-2.5 px-4 rounded-full flex items-center border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all'
        >
          <input
            type='text'
            placeholder='Search homes...'
            className='bg-transparent focus:outline-none w-24 sm:w-64 text-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-500 hover:text-blue-600 transition-colors' />
          </button>
        </form>
        <ul className='flex gap-6 items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-600 hover:text-blue-600 font-medium transition-colors cursor-pointer'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-600 hover:text-blue-600 font-medium transition-colors cursor-pointer'>
              About
            </li>
          </Link>
          {currentUser && currentUser.role === 'admin' && (
            <Link to='/admin'>
              <li className='hidden sm:inline text-slate-600 hover:text-blue-600 font-medium transition-colors cursor-pointer'>
                Admin
              </li>
            </Link>
          )}
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-8 w-8 object-cover border-2 border-white shadow-sm hover:scale-105 transition-transform'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-medium transition-colors'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
