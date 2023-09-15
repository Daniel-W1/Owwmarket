import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdHotelClass, MdShoppingCart, MdSend, MdClose } from "react-icons/md";
import LoadingScreen from "./loading";
import {
  GetProductsForShop,
  GetProfileForUser,
  GetShopById,
  GetProductById,
} from "../hooks/helpers";
import { Link, useParams } from "react-router-dom";
import { imagefrombuffer } from "imagefrombuffer"; //first import 


const ProductPage = () => {
  const params = useParams();
  const [images, setImages] = useState();

  const [activeImg, setActiveImage] = useState(0);
  const [amount, setAmount] = useState(1);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState("");
  const [shop, setShop] = useState("");
  const [allproducts, setAllproducts] = useState("");
  const [profile, setProfile] = useState("");
  const [bids, setBids] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidprice, setBidprice] = useState(0)

  const [modalerror, setModalerror] = useState("");
  const [success, setSuccess] = useState(false);

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
    if (bids.length > 0){
      setBidprice(bids[0].bid + 1) // add one dollar for make it start with example(150$ top price we should put 151$ for bidding) 
    } 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBidChange = (e) => {
    const newBid = parseFloat(e.target.value);

    // Check if the newBid is greater than or equal to the initial bid (bids[0].bid)
    if (!isNaN(newBid) && newBid > (bids.length === 0 ? product.startedprice : bids[0].bid)) {
      setModalerror("")
    } else {
      setModalerror(`you can't bid with a price less than $${bids.length === 0 ? product.startedprice : bids[0].bid}`)
      // Handle the case where the newBid is invalid (less than initial bid)
      // You can show an error message or take any other appropriate action.
    }
    setBidprice(newBid);


  };

  const handleSubmitBid = () => {
    // Handle the submitted number here, e.g., you can log it to the console
    console.log("Submitted number:", bidprice);

    // Close the modal
    closeModal();
    setModalerror("");
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false)
    }, 3000);
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
        const p = await GetProductById(params.shopId, params.productId);
        setProduct(p);
        setImages(p.productImages)
        if (p.auction) {
          setBids(p.bids.slice().sort((a, b) => b.bid - a.bid))
        }
        const s = await GetShopById(params.shopId);
        setShop(s);
        const allproducts = await GetProductsForShop(params.shopId, s.owner);
        setAllproducts(allproducts.products);
        // setBids(product.bids.sort((a, b) => new Date(b.biddingAt) - new Date(a.biddingAt)));

        const pr = await GetProfileForUser(s.owner);
        setProfile(pr);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    })();
  }, []);



  if (loading) {
    return <LoadingScreen text={"Loading..."} />;
  }

  return (
    <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center">
      <div className="flex flex-col gap-6 lg:w-2/5">
        <img
          src={
            imagefrombuffer(
              { data: images[activeImg].data.data }
            )
          }
          alt=""
          className="w-full h-full aspect-square object-cover rounded-xl"
        />

        <div className="flex justify-center w-64 flex-wrap mx-2 gap-y-2">
          {

            images.map((image, index) => {
              return (
                <img
                  src={imagefrombuffer({ data: image.data.data })}
                  alt=""
                  className={`w-24 h-24 rounded-md cursor-pointer mx-2 ${index === activeImg ? 'border-2 border-purple-600' : null}}`}
                  onClick={() => setActiveImage(index)}
                />
              )
            })
          }
        </div>
      </div>
      {/* ABOUT */}
      <div className="flex flex-col gap-4 lg:w-3/5  my-4">
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
              <button onClick={openModal} className="bg-black text-white flex items-center justify-center font-semibold py-3 px-16 rounded-xl h-full">
                <MdHotelClass />
                <span className="ml-2">Bid Now</span>
              </button>

              {/* Modal */}
              <div
                className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isModalOpen || success ? 'block' : 'hidden'
                  } bg-black bg-opacity-50`}
              >
                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
                      <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>
                      {modalerror && (
                        <p className="text-red-600 text-center text-sm mb-4">{modalerror}</p>
                      )}
                      <div className="flex flex-col">
                        <input
                          type="number"
                          className={`w-full p-2 border rounded-md mb-2 outline-none ${modalerror ? 'border-red-600' : 'border-gray-300'
                            }`}
                          placeholder="Enter bid amount"
                          value={bidprice}
                          onChange={handleBidChange}
                        />
                        <div className="flex justify-end">
                          <button
                            className={`flex items-center justify-center bg-black text-white py-2 px-8 rounded-md ${modalerror ? 'cursor-not-allowed' : null
                              }`}
                            onClick={handleSubmitBid}
                            disabled={modalerror}
                          >
                            <MdSend />
                            <span className="ml-2">Submit Bid</span>
                          </button>
                          <button
                            className="ml-2 text-black-500 text-xl"
                            onClick={closeModal}
                          >
                            <MdClose />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="success-animation">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                    <center>
                      <p className='text-white font-semibold mt-4 text-3xl'>Your bid has been placed successfully.</p>
                    </center>
                  </div>
                )}
              </div>

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
        ) : null}
      </div>
    </div>
  );
};

export default ProductPage;
