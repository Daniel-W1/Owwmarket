import React, { useState, useEffect } from 'react';
import { GetBids } from '../hooks/helpers';
import { Link } from 'react-router-dom';

const ProductItem = ({ product, shop }) => {
  const [productBid, setProductBid] = useState(null);

  useEffect(() => {
    // Function to fetch the bid for a product
    const fetchProductBid = async (productId) => {
      try {
        const res = await GetBids(productId);
        const bid = res.bids[0].bid || product.startedprice;
        setProductBid(bid);
      } catch (error) {
        console.error('Error fetching product bid:', error);
      }
    };

    fetchProductBid(product._id);
  }, [productBid]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
                <img
              src={`http://localhost:3000/products/${product._id}/images`}  // Replace with the actual image source URL
              alt={product.productname}
              className="w-full h-40 object-cover rounded-t-lg"
            />
              <h2 className="text-lg font-semibold text-primary-500">
              <Link to={`/shops/${shop._id}/products/${product._id}`}>{product.productname}</Link> {product.auction ? <span className='text-yellow-500'>(Auction)</span> : null}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                {product.productdescription}
              </p>
              <div className="flex justify-between mt-4">
                <div className="text-lg font-semibold text-primary-500">
                  $ {product.auction ? (product.bids?.length === 0 ? product.startedprice : productBid) : product.price}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {product.itemsLeft}/{product.intialItemCount} left
                </div>
              </div>
            </div>
  );
};

export default ProductItem;
