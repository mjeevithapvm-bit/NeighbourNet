import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch products and emergencies
    fetchProducts();
    fetchEmergencies();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.slice(0, 5)); // Show latest 5
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchEmergencies = async () => {
    try {
      const response = await fetch('/api/emergencies/');
      if (response.ok) {
        const data = await response.json();
        setEmergencies(data.slice(0, 5)); // Show latest 5
      }
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to NeighbourNet 2.0</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with your neighbors, share resources, and help each other in times of need.
        </p>
        <div className="space-x-4">
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg">
            Login
          </Link>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
            Join Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome back, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/products" className="block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Browse Products
            </Link>
            <Link to="/emergency" className="block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
              Send Emergency Alert
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Products</h2>
          {products.length > 0 ? (
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.id} className="text-sm text-gray-600">
                  {product.title} - {product.owner_id === user.id ? 'Yours' : 'Available'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No products yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Emergencies</h2>
          {emergencies.length > 0 ? (
            <ul className="space-y-2">
              {emergencies.map((emergency) => (
                <li key={emergency.id} className="text-sm text-gray-600">
                  {emergency.message.substring(0, 50)}...
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No emergencies reported</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;