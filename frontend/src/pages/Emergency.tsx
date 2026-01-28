import { useEffect, useState } from 'react';

interface Emergency {
  id: number;
  user_id: number;
  message: string;
  location: string;
  resolved: boolean;
  created_at: string;
}

const Emergency = () => {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch('/api/emergencies/');
      if (response.ok) {
        const data = await response.json();
        setEmergencies(data);
      } else {
        console.error('Failed to fetch emergencies');
      }
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    }
  };

  const handleOfferHelp = async (emergencyId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
      alert('Please login first');
      return;
    }

    // For now, just show an alert. In a real app, this would send a notification
    alert(`You offered to help with emergency #${emergencyId}. The person who reported it will be notified.`);
    
    // TODO: Implement backend endpoint to send help offer
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch('/api/emergencies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ...formData
        }),
      });

      if (response.ok) {
        setFormData({ message: '', location: '' });
        setShowForm(false);
        fetchEmergencies();
        alert('Emergency alert sent! Help is on the way.');
      } else {
        alert('Error sending emergency alert');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending emergency alert');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong>Emergency Services:</strong> Use this feature only for real emergencies. Your neighbors will be notified immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Emergency Alerts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Send Alert'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Send Emergency Alert</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the emergency situation..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your current location"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Emergency Alert'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {emergencies.map((emergency) => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isCurrentUser = currentUser.id === emergency.user_id;
          
          console.log('Current user:', currentUser, 'Emergency user_id:', emergency.user_id, 'Is current user:', isCurrentUser);
          
          return (
            <div key={emergency.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${emergency.resolved ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{emergency.message}</p>
                  <p className="text-sm text-gray-600">Location: {emergency.location}</p>
                  <p className="text-sm text-blue-600 font-medium">
                    Reported by: {isCurrentUser ? 'You' : `User ${emergency.user_id}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(emergency.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded text-sm ${emergency.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {emergency.resolved ? 'Resolved' : 'Active'}
                  </span>
                  {!isCurrentUser && !emergency.resolved && (
                    <button
                      onClick={() => handleOfferHelp(emergency.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      I can help
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {emergencies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No emergency alerts.</p>
          <p className="text-gray-400">Stay safe and help your neighbors!</p>
        </div>
      )}
    </div>
  );
};

export default Emergency;