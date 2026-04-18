import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-white border-t border-slate-100 mt-20 py-12'>
      <div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10'>
        <div className='flex flex-col items-center md:items-start text-center md:text-left'>
          <Link to='/'>
            <h2 className='font-extrabold text-2xl tracking-tight'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>Real</span>
              <span className='text-slate-800'>Estate</span>
            </h2>
          </Link>
          <p className='text-slate-500 mt-3 max-w-xs leading-relaxed'>
            We help you find the perfect place to call home with ease, style, and total transparency.
          </p>
        </div>
        
        <div className='flex gap-10 text-sm font-bold text-slate-600'>
          <Link to='/' className='hover:text-blue-600 transition-colors uppercase tracking-widest'>Home</Link>
          <Link to='/about' className='hover:text-blue-600 transition-colors uppercase tracking-widest'>About</Link>
          <Link to='/search' className='hover:text-blue-600 transition-colors uppercase tracking-widest'>Cards</Link>
        </div>

        <div className='flex flex-col items-center md:items-end gap-2'>
          <p className='text-sm text-slate-400 font-medium'>
            &copy; {new Date().getFullYear()} RealEstate Inc.
          </p>
          <div className='flex gap-4'>
            <div className='w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-colors'>f</div>
            <div className='w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-400 cursor-pointer transition-colors'>t</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
