import React, { useEffect, useState } from 'react';
import { MdOutlineProductionQuantityLimits, MdContactPage, MdAnnouncement } from 'react-icons/md';
import LoadingScreen from './loading';
import { GetProductsForShop, GetProfileForUser, GetShopById, GetBids } from '../hooks/helpers';
import { Link, useParams } from 'react-router-dom';
import ProductItem from './ProductItem';

const ShopDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [productsLength, setProductsLength] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [name, setName] = useState('');
  const [shop, setShop] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const response1 = await GetShopById(params.shopId);
        setShop(response1);

        const response2 = await GetProductsForShop(params.shopId, response1.owner);
        const profile = await GetProfileForUser(response1.owner);

        const { name } = profile.profile;
        setName(name);
        setProducts(response2.products);
        setProductsLength(response2.products.length);
        setFollowers(profile.profile.followers.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    })();
  }, [params.shopId]);


  if (loading) {
    return <LoadingScreen text={'Loading...'} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={`http://localhost:3000/shops/logo/${shop._id}`}
              alt=""
              className="w-32 h-32 lg:w-56 lg:h-56 mx-auto mb-4 rounded-full"
            />
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-semibold text-primary-500">
                {shop.name}
              </div>
              <div className="text-sm font-medium text-gray-600">by {name}</div>
            </div>
          </div>
        </div>
        <div className="lg:w-2/3 lg:ml-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-xl lg:text-2xl font-semibold text-primary-500">
              About {shop.name}
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {shop.description}. Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Possimus quas consequatur quia culpa maxime.
            </p>
            <div className="flex justify-end mt-6">
              <div className="text-center mr-4">
                <div className="text-lg font-semibold text-primary-500">
                  {followers}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Customers
                </div>
              </div>
              <div className="text-center mr-4">
                <div className="text-lg font-semibold text-primary-500">
                  {productsLength}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Products
                </div>
              </div>
              
            </div>

            <div className="mt-6 text-center lg:text-left">
              <button className="bg-purple-600 hover:bg-purple-500 duration-300 text-xl lg:text-xl text-white font-semibold py-2 px-4 lg:w-1/3 rounded-lg">
                <MdContactPage className="inline-block -mt-1 mr-2" />
                Contact Seller
              </button>
            </div>
            <div className="text-sm font-medium text-gray-600 mt-4">
              Created At: {new Date(shop.createdAt).toLocaleDateString()}
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Display Products in Rows */}
      <div className="container mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} shop={shop}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
