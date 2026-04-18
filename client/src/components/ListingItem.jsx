import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white group shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl w-full sm:w-[280px] border border-slate-100 flex flex-col'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative overflow-hidden aspect-[4/3]'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-500'
            loading='lazy'
          />
          <div className='absolute top-3 left-3'>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${listing.type === 'rent' ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'}`}>
              For {listing.type}
            </span>
          </div>
        </div>
        <div className='p-5 flex flex-col gap-3 flex-1'>
          <div>
            <p className='truncate text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors'>
              {listing.name}
            </p>
            <div className='flex items-center gap-1 mt-1'>
              <MdLocationOn className='h-4 w-4 text-rose-500' />
              <p className='text-sm text-slate-500 truncate'>
                {listing.address}
              </p>
            </div>
          </div>
          
          <p className='text-sm text-slate-500 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>
          
          <div className='mt-auto pt-3 border-t border-slate-50'>
            <p className='text-blue-600 text-xl font-extrabold flex items-baseline gap-1'>
              ₹{listing.offer
                ? listing.discountPrice.toLocaleString('en-IN')
                : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && <span className='text-xs font-medium text-slate-400'>/ month</span>}
            </p>
            
            <div className='flex items-center gap-3 mt-3 text-slate-500'>
              <div className='flex items-center gap-1 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md'>
                <span className='text-slate-800'>{listing.bedrooms}</span> Beds
              </div>
              <div className='flex items-center gap-1 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md'>
                <span className='text-slate-800'>{listing.bathrooms}</span> Baths
              </div>
              <div className='flex items-center gap-1 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-md'>
                <span className='text-slate-800'>{listing.area}</span> sqft
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
