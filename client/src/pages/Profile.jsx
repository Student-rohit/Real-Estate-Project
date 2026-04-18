import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError(true);
      return;
    }
    setFileUploadError(false);
    setFilePerc(0);

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
      setFilePerc(100);
      setFormData((prev) => ({ ...prev, avatar: uploadData.secure_url }));
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      setFileUploadError('Image upload failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto py-10'>
      <div className='bg-white p-8 rounded-3xl shadow-xl border border-slate-100'>
        <h1 className='text-3xl font-bold text-center my-7 text-slate-800'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <div className='relative self-center group'>
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer border-4 border-white shadow-md group-hover:opacity-80 transition-all'
            />
            <div className='absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-sm pointer-events-none'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700 font-medium'>
                {fileUploadError === true ? 'Error Image upload (image must be less than 2 mb)' : fileUploadError}
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700 font-medium'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700 font-medium'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input
            type='text'
            placeholder='username'
            defaultValue={currentUser.username}
            id='username'
            className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            defaultValue={currentUser.email}
            className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
            onChange={handleChange}
            id='password'
            className='border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50'
          />
          <button
            disabled={loading}
            className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 font-bold uppercase hover:opacity-95 disabled:opacity-80 transition-all shadow-lg shadow-blue-100'
          >
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
          {currentUser.role !== 'buyer' && (
            <Link
              className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl font-bold uppercase text-center hover:opacity-95 shadow-lg shadow-emerald-100'
              to={'/create-listing'}
            >
              Create Listing
            </Link>
          )}
        </form>
        <div className='flex justify-between mt-8 px-2'>
          <span
            onClick={handleDeleteUser}
            className='text-red-500 cursor-pointer font-semibold hover:text-red-700 transition-colors'
          >
            Delete account
          </span>
          <span
            onClick={handleSignOut}
            className='text-amber-600 cursor-pointer font-semibold hover:text-amber-800 transition-colors'
          >
            Sign out
          </span>
        </div>

        <p className='text-red-700 mt-5 text-center font-medium'>{error ? error : ''}</p>
        <p className='text-green-700 mt-5 text-center font-medium'>
          {updateSuccess ? 'User is updated successfully!' : ''}
        </p>
        <button
          onClick={handleShowListings}
          className='text-blue-600 font-bold w-full mt-4 hover:underline'
        >
          Show Listings
        </button>
        <p className='text-red-700 mt-5 text-center font-medium'>
          {showListingsError ? 'Error showing listings' : ''}
        </p>

        {userListings && userListings.length > 0 && (
          <div className='flex flex-col gap-4 mt-10'>
            <h1 className='text-center mt-7 text-2xl font-bold text-slate-800'>
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border border-slate-100 rounded-2xl p-4 flex justify-between items-center gap-4 bg-slate-50/50 hover:shadow-md transition-shadow'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-contain rounded-xl shadow-sm'
                  />
                </Link>
                <Link
                  className='text-slate-700 font-bold hover:underline truncate flex-1'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col items-center gap-1'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-rose-500 text-xs font-bold uppercase hover:bg-rose-50 px-3 py-1 rounded-lg transition-colors'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-emerald-600 text-xs font-bold uppercase hover:bg-emerald-50 px-3 py-1 rounded-lg transition-colors'>
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
