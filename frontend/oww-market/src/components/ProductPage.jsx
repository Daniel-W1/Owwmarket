import React, { useEffect, useState } from "react";
import { MdHotelClass, MdShoppingCart } from "react-icons/md";
import LoadingScreen from "./loading";
import {
  GetProductsForShop,
  GetProfileForUser,
  GetShopById,
  GetProductById,
} from "../hooks/helpers";
import { Link, useParams } from "react-router-dom";

const ProductPage = () => {
  const params = useParams();
  const [images, setImages] = useState({
    img1: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,b_rgb:f5f5f5/3396ee3c-08cc-4ada-baa9-655af12e3120/scarpa-da-running-su-strada-invincible-3-xk5gLh.png",
    img2: "https://static.nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/e44d151a-e27a-4f7b-8650-68bc2e8cd37e/scarpa-da-running-su-strada-invincible-3-xk5gLh.png",
    img3: "https://static.nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/44fc74b6-0553-4eef-a0cc-db4f815c9450/scarpa-da-running-su-strada-invincible-3-xk5gLh.png",
    img4: "https://static.nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/d3eb254d-0901-4158-956a-4610180545e5/scarpa-da-running-su-strada-invincible-3-xk5gLh.png",
  });

  const [activeImg, setActiveImage] = useState(images.img1);
  const [amount, setAmount] = useState(1);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [shop, setShop] = useState(null);
  const [allproducts, setAllproducts] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bids, setBids] = useState([
    { user: 'User 1', bid: 100, biddingAt: new Date("2023-09-09T10:10:00Z") },
    { user: 'User 2', bid: 120, biddingAt: new Date("2023-09-09T10:20:00Z")},
    { user: 'User 3', bid: 150, biddingAt: new Date("2023-09-09T10:30:00Z")},
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidprice, setBidprice] = useState(0)
  const handleIncrease = () => {
    // Get the available stock from the product object
    const availableStock = product.itemsLeft;

    // Check if increasing the quantity exceeds the available stock
    if (amount < availableStock) {
      setAmount((prev) => prev + 1);
    }
  };
  const handleDecrease = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBidChange = (e) => {
    setBidprice(e.target.value);
  };

  const handleSubmitBid = () => {
    // Handle the submitted number here, e.g., you can log it to the console
    console.log("Submitted number:", number);

    // Close the modal
    closeModal();
  };

  function formatDate(date) {
    const options = { 
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-GB', options);
  }

  useEffect(() => {
    (async () => {
      try {
        const shop = await GetShopById(params.shopId);
          setShop(shop);
        const allproducts = await GetProductsForShop(params.shopId, shop.owner);
          setAllproducts(allproducts.products);
        const product = await GetProductById(params.shopId, params.productId);      
          // setBids(product.bids.sort((a, b) => new Date(b.biddingAt) - new Date(a.biddingAt)));
          setBids(product.bids.slice().sort((a, b) => b.bid - a.bid))
        const profile = await GetProfileForUser(shop.owner);
          setProfile(profile);
        const { name } = profile.profile;
        setName(name);
        setProduct(product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    })();
  }, [params.shopId, params.productId]);

  if (loading) {
    return <LoadingScreen text={"Loading..."} />;
  }

  return (
    <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center">
      <div className="flex flex-col gap-6 lg:w-2/5">
        <img
          src={activeImg}
          alt=""
          className="w-full h-full aspect-square object-cover rounded-xl"
        />
        <div className="flex flex-row justify-between h-24">
          <img
            src={images.img1}
            alt=""
            className="w-24 h-24 rounded-md cursor-pointer"
            onClick={() => setActiveImage(images.img1)}
          />
          <img
            src={images.img2}
            alt=""
            className="w-24 h-24 rounded-md cursor-pointer"
            onClick={() => setActiveImage(images.img2)}
          />
          <img
            src={images.img3}
            alt=""
            className="w-24 h-24 rounded-md cursor-pointer"
            onClick={() => setActiveImage(images.img3)}
          />
          <img
            src={images.img4}
            alt=""
            className="w-24 h-24 rounded-md cursor-pointer"
            onClick={() => setActiveImage(images.img4)}
          />
        </div>
      </div>
      {/* ABOUT */}
      <div className="flex flex-col gap-4 lg:w-3/5">
        <div>
          <span className="text-purple-600 font-semibold">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold">{product.productname}</h1>
        </div>
        <p className="text-gray-700">{product.productdescription}</p>
        <h6 className="text-2xl font-semibold">
          $ {product.auction ? (bids.length === 0 ? product.startedprice : bids[0].bid) : product.price}
        </h6>
        <div className="flex flex-row items-center gap-12">
          <div className="flex flex-row items-center">
            <button
              className="bg-gray-200 py-2 px-5 rounded-lg text-purple-800 text-3xl"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="py-4 px-6 rounded-lg">{amount}</span>
            <button
              className="bg-gray-200 py-2 px-4 rounded-lg text-purple-800 text-3xl"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
          {product.auction ? (
            <>
            <button className="bg-black text-white flex items-center justify-center font-semibold py-3 px-16 rounded-xl h-full">
              <MdHotelClass />
              <span className="ml-2" onClick={openModal}>Bid Now</span>
            </button>

            {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter bid amount"
              value={bidprice}
              onChange={handleBidChange}
            />
            <div className="flex justify-end">
              <button
                className="bg-black text-white py-2 px-4 rounded-md"
                onClick={handleSubmitBid}
              >
                Submit Bid
              </button>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
            </>
          ) : (
            <button className="bg-black text-white flex items-center justify-center font-semibold py-3 px-16 rounded-xl h-full">
              <MdShoppingCart />
              <span className="ml-2">Buy Now</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:w-3/5">
        {/* Shop Profile */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="rounded-full overflow-hidden w-16 h-16">
            <img
              src={`http://localhost:3000/shops/logo/${shop._id}`}
              alt={`Profile of hh`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <Link to={`/shops/${shop._id}`}>
            <h2 className="text-xl font-semibold">{shop.name}</h2>
            </Link>
            <div className="text-gray-600">
              <p>Products: {allproducts.length}</p>
              <p>Followers: {profile.profile.followers.length}</p>
            </div>
          </div>
        </div>
        {/* Bids Box */}
        {product.auction ? (
         <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold mb-4">Bids</h2>
         <ul className="divide-y divide-gray-300">
           {bids.map((bid, index) => (
             <li key={index} className="py-2">
               <div className="flex justify-between items-center">
                 <div className="text-gray-800">
                  <Link to={`/profile/of/${bid.userid._id}`}>
                   <span className="text-lg font-semibold">{index + 1}. {bid.userid.name}</span>
                  </Link>
                   <br />
                   <span className="text-gray-600">Amount: ${bid.bid}</span>
                 </div>
                 <div className="text-gray-500">
                   <span className="text-sm">{formatDate(bid.biddingAt)}</span>
                 </div>
               </div>
             </li>
           ))}
         </ul>
       </div>
        ): null}
      </div>
    </div>
  );
};

export default ProductPage;
