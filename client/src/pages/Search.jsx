import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
    minPrice: 0,
    maxPrice: 100000000,
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const minPriceFromUrl = urlParams.get('minPrice');
    const maxPriceFromUrl = urlParams.get('maxPrice');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      minPriceFromUrl ||
      maxPriceFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
        minPrice: minPriceFromUrl ? parseFloat(minPriceFromUrl) : 0,
        maxPrice: maxPriceFromUrl ? parseFloat(maxPriceFromUrl) : 100000000,
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }

    if (e.target.id === 'minPrice' || e.target.id === 'maxPrice') {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    urlParams.set('minPrice', sidebardata.minPrice);
    urlParams.set('maxPrice', sidebardata.maxPrice);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row max-w-7xl mx-auto'>
      <div className='p-7 md:w-1/3 lg:w-1/4'>
        <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-8 sticky top-24'>
          <h2 className='text-2xl font-bold text-slate-800 border-b pb-4'>Filters</h2>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm'>Keyword</label>
              <input
                type='text'
                id='searchTerm'
                placeholder='City, address...'
                className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>
            
            <div className='flex flex-col gap-3'>
              <label className='font-bold text-slate-700 text-sm'>Property Type</label>
              <div className='flex flex-wrap gap-3 mt-1'>
                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors'>
                  <input
                    type='checkbox'
                    id='all'
                    className='w-4 h-4 rounded text-blue-600'
                    onChange={handleChange}
                    checked={sidebardata.type === 'all'}
                  />
                  <span className='text-sm font-medium text-slate-600'>All</span>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors'>
                  <input
                    type='checkbox'
                    id='rent'
                    className='w-4 h-4 rounded text-blue-600'
                    onChange={handleChange}
                    checked={sidebardata.type === 'rent'}
                  />
                  <span className='text-sm font-medium text-slate-600'>Rent</span>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors'>
                  <input
                    type='checkbox'
                    id='sale'
                    className='w-4 h-4 rounded text-blue-600'
                    onChange={handleChange}
                    checked={sidebardata.type === 'sale'}
                  />
                  <span className='text-sm font-medium text-slate-600'>Sale</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <label className='font-bold text-slate-700 text-sm'>Features</label>
              <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors'>
                  <input
                    type='checkbox'
                    id='offer'
                    className='w-4 h-4 rounded text-blue-600'
                    onChange={handleChange}
                    checked={sidebardata.offer}
                  />
                  <span className='text-sm font-medium text-slate-600'>Offer</span>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors'>
                  <input
                    type='checkbox'
                    id='parking'
                    className='w-4 h-4 rounded text-blue-600'
                    onChange={handleChange}
                    checked={sidebardata.parking}
                  />
                  <span className='text-sm font-medium text-slate-600'>Parking</span>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors'>
                  <input
                    type='checkbox'
                    id='furnished'
                    className='w-4 h-4 rounded text-blue-600'
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                  />
                  <span className='text-sm font-medium text-slate-600'>Furnished</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm'>Price Range (₹)</label>
              <div className='flex gap-2 items-center'>
                <input
                  type='number'
                  id='minPrice'
                  className='border rounded-xl p-3 w-full text-sm bg-slate-50'
                  placeholder='Min'
                  value={sidebardata.minPrice}
                  onChange={handleChange}
                />
                <span className='text-slate-400'>-</span>
                <input
                  type='number'
                  id='maxPrice'
                  className='border rounded-xl p-3 w-full text-sm bg-slate-50'
                  placeholder='Max'
                  value={sidebardata.maxPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm'>Sort Order</label>
              <select
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort_order'
                className='border rounded-2xl p-4 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100'
              >
                <option value='regularPrice_desc'>Price High to Low</option>
                <option value='regularPrice_asc'>Price Low to High</option>
                <option value='createdAt_desc'>Newest Listing</option>
                <option value='createdAt_asc'>Oldest Listing</option>
              </select>
            </div>

            <button className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-bold uppercase hover:opacity-95 shadow-lg shadow-blue-100 mt-2'>
              Search Properties
            </button>
          </form>
        </div>
      </div>
      
      <div className='flex-1 p-7'>
        <div className='flex justify-between items-center border-b pb-4 mb-8'>
          <h1 className='text-3xl font-extrabold text-slate-800'>
            Results
          </h1>
          <p className='text-slate-500 font-medium'>{listings.length} listings found</p>
        </div>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
