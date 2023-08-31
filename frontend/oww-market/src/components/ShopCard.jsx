import React, { useEffect, useState } from 'react'
import {MdOutlineProductionQuantityLimits} from 'react-icons/md'
import { imagefrombuffer } from "imagefrombuffer"; //first import 
import axios from 'axios';
import LoadingScreen from './loading';
import { GetProductsForShop, GetProfileForUser } from '../hooks/helpers';
import { useParams } from 'react-router-dom';



const ShopCard = ({shop}) => {

  const params = useParams();
  const [loading, setloading] = useState(true)
  const [productsLength , setproductsLength] = useState(0)
  const [followers , setfollowers] = useState(0)
  const the_userId = params.userId ? params.userId : JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    (
      async () => {
        const response = await GetProductsForShop(shop._id, the_userId).then((res) => {
          return res;
        }
        );

        let profile = await GetProfileForUser(the_userId).then((res) => {
          return res;
        }
        );

        profile = profile.profile;  
        setproductsLength(response.products.length)
        setfollowers(profile.followers.length)
      }) ();
  }, [])

  useEffect(() => {
    setloading(false)
    
  }, [productsLength, followers])

  return ( loading ? <LoadingScreen text={'loading..'} /> :
    <div className='my-4 pt-4 w-full lg:w-full mx-auto rounded-xl  flex flex-wrap justify-center lg:justify-around  items-center md:items-stretch md:flex-row md:justify-center shadow-lg'>
      <div className='flex-col justify-center items-center'>
        <div className='p-4 mb-2 mx-auto w-32 h-32 lg:w-56 lg:h-56 md:mx-3 lg:mx-6  md:w-56 flex items-center  max-w-xs md:max-w-none border-4 '>
          <img src= {`http://localhost:3000/shops/logo/${shop._id}`} className='w-full h-full' alt="" />
        </div>

        <div className='text-center mt-4 md:mt-0'>
          <div className='font-bold text-lg lg:text-xl xl:text-2xl text-primary-500'>{shop.name}</div>
          <div className='font-medium text-sm'>by {name}</div>
        </div>
      </div>


      <div className='md:mx-3 lg:mx-8 md:w-6/12 py-4 flex flex-col justify-between'>

        <div className='text-center text-sm md:text-left lg:text-xl xl:text-2xl px-4'>
          {shop.description + '. ' }
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus quas
           consequatur quia culpa maxime.
        </div>

        <div className='flex justify-around my-4'>
        <div className='text-center mt-4 md:mt-0'>
          <div className='font-bold text-sm lg:text-xl xl:text-2xl text-primary-500'>{followers}</div>
          <div className='font-medium text-sm'>Customers</div>
        </div>
        <div className='text-center mt-4 md:mt-0'>
          <div className='font-bold text-sm lg:text-xl xl:text-2xl text-primary-500'>{productsLength}</div>
          <div className='font-medium text-sm'>Products</div>
        </div>
        </div>

        <div className='px-2 lg:px-4 mt-2 mb-6 flex justify-center items-center'>
          <button className='border-none text-sm lg:text-xl  px-4 py-1 w-2/3 lg:w-full flex-col items-center justify-center bg-gray-300 hover:bg-gray-400 duration-300'>
            <MdOutlineProductionQuantityLimits className='hidden lg:inline-block mr-2' />
            <span className='font-semibold'>Products</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShopCard