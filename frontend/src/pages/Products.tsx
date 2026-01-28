import { useEffect, useState } from 'react';

interface Product {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  available: boolean;
  created_at: string;
  owner_name?: string;
  provider_id?: number;
  offer_status?: string;
  provider_name?: string;
}

interface ProductOffer {
  id: number;
  product_id: number;
  provider_id: number;
  status: string;
  provider_name: string;
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const [showOffers, setShowOffers] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    fetchProducts();
    fetchUserOffers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOfferItem = async (productId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch('/api/product-offers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          provider_id: currentUser.id
        }),
      });

      if (response.ok) {
        alert('Offer sent successfully! The product requester will be notified.');
        fetchProducts(); // Refresh products to show updated status
      } else if (response.status === 400) {
        alert('You have already sent an offer for this product.');
      } else {
        alert('Error sending offer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending offer');
    }
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
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: user.id,
          ...formData
        }),
      });

      if (response.ok) {
        setFormData({ title: '', description: '' });
        setShowForm(false);
        fetchProducts();
      } else {
        alert('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOffers = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) return;

    try {
      const response = await fetch(`/api/product-offers/user/${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleOfferResponse = async (offerId: number, status: 'accepted' | 'declined') => {
    try {
      const response = await fetch(`/api/product-offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`Offer ${status} successfully!`);
        fetchProducts();
        fetchUserOffers();
      } else {
        alert('Error updating offer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating offer');
    }
  };

  const toggleOffers = (productId: number) => {
    setShowOffers(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isCurrentUser = currentUser.id === product.owner_id;
          const productOffers = offers.filter(offer => offer.product_id === product.id);
          
          console.log('Product:', product);
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-blue-600 font-medium mb-2">
                Posted by: {isCurrentUser ? 'You' : product.owner_name || `User ${product.owner_id}`}
              </p>
              
              {product.provider_name && (
                <p className="text-sm text-green-600 font-medium mb-2">
                  ✅ Provided by: {product.provider_name}
                </p>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 rounded text-sm ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.available ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>

              {isCurrentUser && productOffers.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => toggleOffers(product.id)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-sm mb-2"
                  >
                    {showOffers[product.id] ? 'Hide Offers' : `View Offers (${productOffers.length})`}
                  </button>
                  
                  {showOffers[product.id] && (
                    <div className="space-y-2">
                      {productOffers.map((offer) => (
                        <div key={offer.id} className="border rounded p-2 bg-gray-50">
                          <p className="text-sm font-medium">{offer.provider_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(offer.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleOfferResponse(offer.id, 'accepted')}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleOfferResponse(offer.id, 'declined')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isCurrentUser && product.available && !product.provider_name && (
                <button
                  onClick={() => handleOfferItem(product.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
                >
                  I can provide this
                </button>
              )}
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available yet.</p>
          <p className="text-gray-400">Be the first to share something with your neighbors!</p>
        </div>
      )}
    </div>
  );
};

export default Products;