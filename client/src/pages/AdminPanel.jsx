import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUserShield, FaHome, FaUsers, FaCheckCircle, FaTrashAlt, FaRobot } from 'react-icons/fa';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingListings();
    fetchAllListings();
    fetchUsers();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const res = await fetch('/api/admin/listings/pending');
      const data = await res.json();
      if (res.ok) setPendingListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllListings = async () => {
    try {
      const res = await fetch('/api/admin/listings/all');
      const data = await res.json();
      if (res.ok) setAllListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/listings/approve/${id}`, {
        method: 'PUT',
      });
      if (res.ok) {
        setPendingListings(pendingListings.filter((l) => l._id !== id));
        setMessage('Listing approved successfully!');
        fetchAllListings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPendingListings(pendingListings.filter((l) => l._id !== id));
        setAllListings(allListings.filter((l) => l._id !== id));
        setMessage('Listing deleted successfully!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        setMessage('User deleted successfully!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAutoClean = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/listings/auto-clean', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data);
        fetchPendingListings();
        fetchAllListings();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-slate-800 flex items-center gap-3'>
          <FaUserShield className='text-blue-600' /> Admin Dashboard
        </h1>
        <button
          onClick={handleAutoClean}
          disabled={loading}
          className='flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50'
        >
          <FaRobot /> {loading ? 'Cleaning...' : 'Auto-Clean Spam'}
        </button>
      </div>

      {message && (
        <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r shadow-sm flex justify-between items-center'>
          <span>{message}</span>
          <button onClick={() => setMessage('')} className='text-green-700 font-bold'>&times;</button>
        </div>
      )}

      {/* Tabs */}
      <div className='flex gap-4 border-b border-slate-200 mb-8'>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-4 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-slate-500 hover:text-blue-500'
          }`}
        >
          <FaCheckCircle /> Pending Listings ({pendingListings.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 px-4 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-slate-500 hover:text-blue-500'
          }`}
        >
          <FaHome /> All Listings ({allListings.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-4 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-slate-500 hover:text-blue-500'
          }`}
        >
          <FaUsers /> User Management ({users.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
        {activeTab === 'pending' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-slate-50 border-b border-slate-100'>
                <tr>
                  <th className='p-4 font-bold text-slate-600'>Property</th>
                  <th className='p-4 font-bold text-slate-600'>Price</th>
                  <th className='p-4 font-bold text-slate-600'>Created At</th>
                  <th className='p-4 font-bold text-slate-600'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingListings.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400">No pending listings</td></tr>
                ) : (
                  pendingListings.map((listing) => (
                    <tr key={listing._id} className='border-b border-slate-50 hover:bg-slate-50/50 transition-colors'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <img src={listing.imageUrls[0]} alt="" className='w-12 h-12 rounded object-cover' />
                          <div className='flex flex-col'>
                            <span className='font-medium text-slate-700 truncate max-w-xs'>{listing.name}</span>
                            {listing.flagged && (
                              <span className='text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold w-fit'>FLAGGED</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='p-4 font-semibold text-blue-600'>${listing.regularPrice.toLocaleString()}</td>
                      <td className='p-4 text-slate-500 text-sm'>{new Date(listing.createdAt).toLocaleDateString()}</td>
                      <td className='p-4'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleApprove(listing._id)}
                            className='bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-600 hover:text-white transition-all'
                            title="Approve"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className='bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all'
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'all' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-slate-50 border-b border-slate-100'>
                <tr>
                  <th className='p-4 font-bold text-slate-600'>Property</th>
                  <th className='p-4 font-bold text-slate-600'>Price</th>
                  <th className='p-4 font-bold text-slate-600'>Status</th>
                  <th className='p-4 font-bold text-slate-600'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allListings.map((listing) => (
                  <tr key={listing._id} className='border-b border-slate-50 hover:bg-slate-50/50 transition-colors'>
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <img src={listing.imageUrls[0]} alt="" className='w-12 h-12 rounded object-cover' />
                        <span className='font-medium text-slate-700 truncate max-w-xs'>{listing.name}</span>
                      </div>
                    </td>
                    <td className='p-4 font-semibold text-blue-600'>${listing.regularPrice.toLocaleString()}</td>
                    <td className='p-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${listing.approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {listing.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className='p-4'>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className='bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all'
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-slate-50 border-b border-slate-100'>
                <tr>
                  <th className='p-4 font-bold text-slate-600'>User</th>
                  <th className='p-4 font-bold text-slate-600'>Email</th>
                  <th className='p-4 font-bold text-slate-600'>Role</th>
                  <th className='p-4 font-bold text-slate-600'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className='border-b border-slate-50 hover:bg-slate-50/50 transition-colors'>
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <img src={user.avatar} alt="" className='w-8 h-8 rounded-full object-cover' />
                        <span className='font-medium text-slate-700'>{user.username}</span>
                      </div>
                    </td>
                    <td className='p-4 text-slate-500'>{user.email}</td>
                    <td className='p-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className='p-4'>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className='bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all'
                          title="Delete"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
