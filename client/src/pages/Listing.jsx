import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaWhatsapp,
  FaExpand,
} from 'react-icons/fa';
import Contact from '../components/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);
  const [buySuccess, setBuySuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleBuyNow = async () => {
    try {
      setBuying(true);
      setBuyError(null);
      
      const res = await fetch('/api/wallet/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ propertyId: listing._id })
      });
      const data = await res.json();
      
      if (data.success === false) {
        setBuyError(data.message);
        setBuying(false);
        return;
      }
      
      setBuySuccess(true);
      setBuying(false);
      
      window.location.reload();
      
    } catch (error) {
      setBuyError(error.message);
      setBuying(false);
    }
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          {listing.imageUrls && listing.imageUrls.length > 0 ? (
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[550px]'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              className='h-[550px]'
              style={{
                background: `url(https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          )}
          {/* Share Button */}
          <div className='fixed top-[13%] right-[3%] z-10 border border-white/20 rounded-full w-12 h-12 flex justify-center items-center bg-white/80 backdrop-blur-md shadow-lg cursor-pointer hover:scale-110 transition-all'>
            <FaShare
              className='text-slate-600'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-xl bg-white/90 backdrop-blur-md shadow-xl p-3 text-sm font-bold text-slate-700 border border-slate-100'>
              Link copied!
            </p>
          )}

          <div className='flex flex-col max-w-6xl mx-auto p-6 my-10 gap-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>
              {/* Left Column: Essential Info */}
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <h1 className='text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight'>
                    {listing.name}
                  </h1>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 text-slate-500 font-medium text-lg hover:text-blue-600 transition-colors'
                  >
                    <FaMapMarkerAlt className='text-rose-500' />
                    {listing.address}
                  </a>
                </div>

                <div className='flex gap-4 items-center'>
                  <p className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-blue-100'>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </p>
                  {listing.offer && (
                    <p className='bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald-100'>
                      ₹{+listing.regularPrice - +listing.discountPrice} Discounted
                    </p>
                  )}
                </div>

                <div className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm'>
                  <p className='text-slate-800 text-lg leading-relaxed'>
                    <span className='font-bold block text-2xl text-slate-900 mb-2'>Property Description</span>
                    {listing.description}
                  </p>
                </div>

                <ul className='grid grid-cols-2 sm:grid-cols-3 gap-4 text-slate-600 font-bold'>
                  <li className='flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <FaBed className='text-2xl text-blue-600' />
                    <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
                  </li>
                  <li className='flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <FaBath className='text-2xl text-blue-600' />
                    <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
                  </li>
                  <li className='flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <FaParking className='text-2xl text-blue-600' />
                    <span>{listing.parking ? 'Parking' : 'None'}</span>
                  </li>
                  <li className='flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <FaChair className='text-2xl text-blue-600' />
                    <span>{listing.furnished ? 'Furnished' : 'Basic'}</span>
                  </li>
                  <li className='flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1'>
                    <FaExpand className='text-2xl text-blue-600' />
                    <span>{listing.area} sqft</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Pricing & Action Card */}
              <div className='bg-white p-8 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-50 sticky top-28'>
                <div className='flex flex-col gap-6'>
                  <div>
                    <span className='text-slate-400 font-bold text-sm uppercase tracking-widest'>Price Information</span>
                    <p className='text-5xl font-black text-blue-600 mt-2 flex items-baseline gap-2'>
                      ₹{listing.offer
                        ? listing.discountPrice.toLocaleString('en-IN')
                        : listing.regularPrice.toLocaleString('en-IN')}
                      {listing.type === 'rent' && <span className='text-xl font-bold text-slate-400'>/mo</span>}
                    </p>
                    {listing.offer && (
                      <p className='text-slate-400 line-through font-bold text-lg mt-1'>
                        ₹{listing.regularPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col gap-4 py-6 border-y border-slate-50'>
                    {listing.contactNumber && (
                      <div className='flex flex-col gap-4'>
                        <a
                          href={`tel:${listing.contactNumber}`}
                          className='flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-800 p-4 rounded-2xl font-bold transition-all hover:border-slate-400'
                        >
                          📞 Call Agent
                        </a>
                        <a
                          href={`https://wa.me/91${listing.contactNumber}?text=${encodeURIComponent(`Hi, I'm interested in your property listing: ${listing.name}`)}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center justify-center gap-3 bg-emerald-500 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all hover:scale-[1.02]'
                        >
                          <FaWhatsapp className='text-2xl' />
                          WhatsApp
                        </a>
                      </div>
                    )}

                    {currentUser && listing.userRef !== currentUser._id && (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        disabled={buying || buySuccess}
                        className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-3xl font-black uppercase tracking-wider shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50 mt-2'
                      >
                        {buying ? 'Processing...' : buySuccess ? 'Payment Successful' : `Pay & ${listing.type === 'rent' ? 'Rent' : 'Buy'} Now`}
                      </button>
                    )}
                  </div>

                  {currentUser && listing.userRef !== currentUser._id && !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className='text-slate-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-widest text-xs'
                    >
                      Need more info? Contact Landlord
                    </button>
                  )}
                  {contact && <Contact listing={listing} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-xl shadow-2xl p-6 w-full max-w-md'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-slate-800 flex items-center gap-2'>
                <span className='text-blue-600'>💳</span> Payment Gateway
              </h2>
              <button onClick={() => setShowPaymentModal(false)} className='text-slate-500 hover:text-slate-800 text-3xl leading-none'>&times;</button>
            </div>
            
            <div className='mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200'>
              <p className='text-sm text-slate-500 mb-1'>Amount Payable</p>
              <p className='text-3xl font-bold text-slate-800'>₹{listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}</p>
            </div>

            <p className='text-sm font-semibold text-slate-700 mb-3'>Select Payment Method</p>
            <div className='flex flex-col gap-3 mb-6'>
              <button 
                onClick={() => {
                  const amount = listing.offer ? listing.discountPrice : listing.regularPrice;
                  const upiId = 'merchant@ybl';
                  const name = encodeURIComponent('RealEstate Platform');
                  
                  const isMobile = /Android|webOS|iPhone|Opera Mini/i.test(navigator.userAgent);

                  if (isMobile) {
                    // Native PhonePe Android/iOS deep link
                    window.location.href = `phonepe://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
                    // Also trigger standard intent for broad compatibility
                    setTimeout(() => {
                      window.location.href = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
                    }, 500);
                  } else {
                    // Desktop fallback: Open PhonePe Web as Desktop does not have the PhonePe App
                    window.open(`https://www.phonepe.com/business-solutions/payment-gateway/`, "_blank");
                  }
                  
                  // Finally, proceed with unlocking the property
                  setTimeout(() => {
                    handleBuyNow();
                  }, 3000);
                }} 
                disabled={buying || buySuccess} 
                className='flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left disabled:opacity-50'
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className='h-8 w-12 object-contain' />
                <div>
                  <p className='font-semibold text-slate-800'>Pay with UPI (PhonePe)</p>
                  <p className='text-xs text-slate-500'>Directly opens PhonePe App</p>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  // Simulate card payment redirect to PhonePe Gateway
                  window.open("https://www.phonepe.com/business-solutions/payment-gateway/", "_blank");
                  handleBuyNow();
                }} 
                disabled={buying || buySuccess} 
                className='flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left disabled:opacity-50'
              >
                <div className='bg-slate-800 text-white rounded px-2 py-1 text-xs font-bold w-12 text-center'>CARD</div>
                <div>
                  <p className='font-semibold text-slate-800'>Credit/Debit Card (PhonePe Gateway)</p>
                  <p className='text-xs text-slate-500'>Visa, Mastercard, RuPay</p>
                </div>
              </button>
            </div>
            
            {buying && <p className='text-center text-blue-600 animate-pulse font-semibold mt-4'>Processing your secure payment...</p>}
            {buySuccess && <p className='text-center text-green-600 font-semibold mt-4'>Payment successful! Redirecting...</p>}
            {buyError && <p className='text-center text-red-600 font-semibold mt-4'>{buyError}</p>}
          </div>
        </div>
      )}
    </main>
  );
}
