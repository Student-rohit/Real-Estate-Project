import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    contactNumber: '',
    area: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 2 * 1024 * 1024) {
          setImageUploadError('Image too large (2 mb max per image)');
          setUploading(false);
          return;
        }
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.error('Cloudinary upload error:', err);
          setImageUploadError(`Image upload failed: ${err.message || 'Please try again.'}`);
          setUploading(false);
        });
    } else {
      if (files.length === 0) {
        setImageUploadError('Please select at least one image to upload');
      } else {
        setImageUploadError('You can only upload 6 images per listing');
      }
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'mern_estate');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await res.json();
      return uploadData.secure_url;
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return setError('Geolocation is not supported by your browser');
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          if (data && data.display_name) {
            setFormData({
              ...formData,
              address: data.display_name,
            });
          } else {
            setError('Could not fetch address for your location');
          }
        } catch (error) {
          setError('Error fetching address: ' + error.message);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setError('Geolocation error: ' + error.message);
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-6 max-w-5xl mx-auto my-10'>
      <div className='bg-white p-8 sm:p-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50'>
        <h1 className='text-4xl font-extrabold text-center mb-10 text-slate-800 tracking-tight'>
          Create a <span className='text-blue-600'>New Listing</span>
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-12'>
          <div className='flex flex-col gap-6 flex-1'>
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm ml-1'>Name </label>
              <input
                type='text'
                placeholder='e.g. name of owner'
                className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50 transition-all font-medium placeholder:text-slate-400'
                id='name'
                maxLength='62'
                minLength='10'
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm ml-1'>Description</label>
              <textarea
                type='text'
                placeholder='Describe the property features, neighborhood...'
                className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50 transition-all font-medium min-h-[120px]'
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm ml-1'>Address</label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Property Address'
                  className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50 flex-1'
                  id='address'
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
                <button
                  type='button'
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className='bg-white border border-slate-200 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors shadow-sm'
                  title='Get current location'
                >
                  {locationLoading ? (
                    <div className='w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin'></div>
                  ) : (
                    <FaMapMarkerAlt className='text-xl' />
                  )}
                </button>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='font-bold text-slate-700 text-sm ml-1'>Contact Number</label>
              <input
                type='text'
                placeholder='10-digit mobile number'
                className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50'
                id='contactNumber'
                required
                pattern='[0-9]{10}'
                title='Phone number must be exactly 10 digits'
                maxLength='10'
                minLength='10'
                onChange={handleChange}
                value={formData.contactNumber}
              />
            </div>

            <div className='flex flex-wrap gap-4 mt-2'>
              <label className='w-full font-bold text-slate-700 text-sm ml-1'>Property Features</label>
              <div className='flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-5 h-5 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.type === 'sale'}
                />
                <span className='font-semibold text-slate-600'>Sell</span>
              </div>
              <div className='flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-5 h-5 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.type === 'rent'}
                />
                <span className='font-semibold text-slate-600'>Rent</span>
              </div>
              <div className='flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5 h-5 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className='font-semibold text-slate-600'>Parking</span>
              </div>
              <div className='flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5 h-5 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className='font-semibold text-slate-600'>Furnished</span>
              </div>
              <div className='flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-5 h-5 rounded text-blue-600'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className='font-semibold text-slate-600'>Offer</span>
              </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4'>
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-500 text-xs uppercase'>Beds</label>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-4 border border-slate-100 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-500 text-xs uppercase'>Baths</label>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-4 border border-slate-100 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-500 text-xs uppercase'>Area (sqft)</label>
                <input
                  type='number'
                  id='area'
                  required
                  className='p-4 border border-slate-100 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-700'
                  onChange={handleChange}
                  value={formData.area}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='font-bold text-slate-500 text-xs uppercase'>Regular Price {formData.type === 'rent' && '(₹ / mo)'}</label>
                <input
                  type='number'
                  id='regularPrice'
                  required
                  className='p-4 border border-slate-100 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-blue-600'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
              </div>
              {formData.offer && (
                <div className='flex flex-col gap-2'>
                  <label className='font-bold text-slate-500 text-xs uppercase'>Discounted Price</label>
                  <input
                    type='number'
                    id='discountPrice'
                    required
                    className='p-4 border border-slate-100 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none font-bold text-emerald-600'
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col flex-1 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 self-start'>
            <div className='flex flex-col gap-1'>
              <p className='font-bold text-slate-800'>Property Images</p>
              <p className='text-xs text-slate-500'>First image will be the cover (max 6 images, under 2MB each)</p>
            </div>
            
            <div className='flex gap-3'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 w-full bg-white border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='px-6 py-3 text-blue-600 border border-blue-600 rounded-xl font-bold uppercase text-xs hover:bg-blue-50 transition-colors disabled:opacity-50'
              >
                {uploading ? '...' : 'Upload'}
              </button>
            </div>
            
            {imageUploadError && (
              <p className='text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl'>{imageUploadError}</p>
            )}

            <div className='grid grid-cols-2 gap-4 mt-2'>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='relative group overflow-hidden rounded-2xl border border-slate-200 bg-white p-1'
                  >
                    <img
                      src={url}
                      alt='listing'
                      className='w-full h-32 object-cover rounded-xl transition-transform group-hover:scale-110 duration-500'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                      className='absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>

            <button
              disabled={loading || uploading}
              className='p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all disabled:opacity-50 mt-4'
            >
              {loading ? 'Creating Listing...' : 'Publish Property'}
            </button>
            {error && <p className='text-red-500 text-sm bg-red-50 p-3 rounded-xl text-center font-bold'>{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
