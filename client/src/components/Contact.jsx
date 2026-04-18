import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100'>
          <p className='text-slate-700 font-medium'>
            Message <span className='font-bold text-slate-900'>{landlord.username}</span> about{' '}
            <span className='font-bold text-blue-600'>{listing.name}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='3'
            value={message}
            onChange={onChange}
            placeholder='Ask about availability, viewing times, or details...'
            className='w-full border-slate-200 border p-4 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 font-medium'
          ></textarea>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center p-4 uppercase rounded-2xl font-black tracking-wider shadow-lg shadow-blue-100 hover:scale-[1.02] transition-transform'
          >
            Send Email Inquiry
          </Link>
        </div>
      )}
    </>
  );
}
