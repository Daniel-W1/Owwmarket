import React, { useState } from 'react';
import LoadingScreen from './loading';
import { GetProductsForShop, GetProfileForUser, CreateNewShop } from '../hooks/helpers';

const CreateShop = (props) => {
  const [name, setname] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setsuccess] = useState(false);

  const handleShopNameChange = (e) => {
    setname(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const response = await CreateNewShop(props.userId, name, description, image);
    console.log(response);
    if(response.success === true) {
        setsuccess(true)
        setname('');
        setDescription('');
        setImage(null);
        setLoading(false)
    }

  };

  const CreateAgain = (e) => {
    setsuccess(false)
  }
 

  return (
    <>
        {
            loading ? (
                <LoadingScreen text={'loading..'} />
            ) : (
               success ? (
                <div className="success-animation">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                    <center>
                    <p className=' text-black font-semibold mt-4'>To create another shop, <button className="underline" onClick={CreateAgain}>Click here!</button></p>
                    </center>
               </div>
               ) : (<div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create a New Shop</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto bg-gray-200">
            {image ? (
              <img
                className="object-cover w-full h-full"
                src={URL.createObjectURL(image)}
                alt="Shop Image"
              />
            ) : (
              <svg
                className="w-full h-full text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c-.14 0-.28.01-.42.03 4.65.34 8.36 4.05 8.7 8.7.02.14.03.28.03.42h-1.5a6.5 6.5 0 0 1-6.5-6.5V3zm-6.5-1H9c0 .56.08 1.11.23 1.64-1.87.39-3.34 1.85-3.73 3.73-.53-.15-1.08-.23-1.64-.23zm-3.22 1.91l3.85 3.85-2.12 2.12-3.85-3.85 2.12-2.12zm-.71-.71L7.21 7.21l2.12-2.12 1.06 1.06-3.85 3.85z"
                />
              </svg>
            )}
          </div>
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2 cursor-pointer text-center mx-auto mt-4"
          >
            Choose Image
          </label>
          <input
            className="hidden"
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Shop Name
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            id="name"
            value={name}
            onChange={handleShopNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            required
          ></textarea>
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
          type="submit"
        >
          Create Shop
        </button>
      </form>
    </div>)
            )
        }
    </>
  );
};

export default CreateShop;
