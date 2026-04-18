import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.set('searchTerm', searchTerm);
    urlParams.set('type', searchType);
    navigate(`/search?${urlParams.toString()}`);
  };
  return (
    <div className='pb-20'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-slate-50/50 pt-20 pb-32 px-3'>
        {/* Background blobs for color */}
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-3xl'></div>
        
        <div className='flex flex-col gap-8 max-w-6xl mx-auto relative z-10 items-center text-center'>
          <h1 className='text-slate-800 font-extrabold text-4xl lg:text-7xl tracking-tight max-w-4xl'>
            Discover Your <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'>Dream Home</span> 
            <br />
            with Unmatched Style
          </h1>
          <p className='text-slate-500 text-sm sm:text-lg max-w-2xl leading-relaxed'>
            RealEstate is the premier destination for finding modern living spaces tailored to your lifestyle. 
            Browse our curated collection of high-end properties.
          </p>
          
          {/* Floating Search Widget */}
          <div className='w-full max-w-4xl mt-10 bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col md:flex-row gap-2 items-stretch'>
            <div className='flex-1 flex flex-col md:flex-row'>
              <div className='flex border-b md:border-b-0 md:border-r border-slate-100 p-2 gap-2'>
                <button
                  className={`px-6 py-2 rounded-2xl font-semibold transition-all ${searchType === 'sale' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                  onClick={() => setSearchType('sale')}
                >
                  Buy
                </button>
                <button
                  className={`px-6 py-2 rounded-2xl font-semibold transition-all ${searchType === 'rent' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                  onClick={() => setSearchType('rent')}
                >
                  Rent
                </button>
              </div>
              <form className='flex-1 flex items-center p-3 sm:px-6' onSubmit={handleSearchSubmit}>
                <input
                  type='text'
                  placeholder='Enter city, neighborhood, or zip...'
                  className='w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder:text-slate-400'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
            <button 
              onClick={handleSearchSubmit}
              className='bg-slate-900 text-white px-10 py-4 rounded-[20px] hover:bg-slate-800 transition-all font-bold shadow-lg flex items-center justify-center gap-2'
            >
              Search properties
            </button>
          </div>
        </div>
      </div>

      {/* Swiper / Featured Section */}
      <div className='max-w-7xl mx-auto px-3 -mt-16 relative z-20'>
        <Swiper navigation className='rounded-3xl overflow-hidden shadow-2xl border-8 border-white'>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[400px] sm:h-[550px]'
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listing results */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-16 my-20'>
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='text-3xl font-bold text-slate-800'>Special Offers</h2>
                <p className='text-slate-500 mt-1'>Exclusive deals on premium properties</p>
              </div>
              <Link className='text-sm font-semibold text-blue-600 hover:underline px-4 py-2 bg-blue-50 rounded-full' to={'/search?offer=true'}>
                View All
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {rentListings && rentListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='text-3xl font-bold text-slate-800'>Rental Properties</h2>
                <p className='text-slate-500 mt-1'>Perfect places to call home for a while</p>
              </div>
              <Link className='text-sm font-semibold text-blue-600 hover:underline px-4 py-2 bg-blue-50 rounded-full' to={'/search?type=rent'}>
                View All
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {saleListings && saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-end mb-6'>
              <div>
                <h2 className='text-3xl font-bold text-slate-800'>Properties for Sale</h2>
                <p className='text-slate-500 mt-1'>Find your forever home today</p>
              </div>
              <Link className='text-sm font-semibold text-blue-600 hover:underline px-4 py-2 bg-blue-50 rounded-full' to={'/search?type=sale'}>
                View All
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
