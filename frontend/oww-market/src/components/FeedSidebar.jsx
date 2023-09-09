import React, { useEffect, useState } from 'react'
import useScreenSize from '../hooks/useScreenSize'
import profileImage from '../assets/images/twitter-icon.png'
import { GetProductsForShop, GetProfileForUser, GetShopForUser } from '../hooks/helpers'
import LoadingScreen from './loading'
import { imagefrombuffer } from "imagefrombuffer"; //first import
import { Link } from 'react-router-dom'

const FeedSidebar = () => {

    
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const [loading, setLoading] = useState(true)
    const [shops, setShops] = useState(null)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        (
            async () => {
                const user_profile = await GetProfileForUser(userId);
                const user_shops = await GetShopForUser(userId);
                setProfile(user_profile.profile)
                setShops(user_shops)
            }
        )();
    }, [])

    useEffect(() => {
        if (profile && shops) {
            setLoading(false)
        }
    }, [profile, shops])

    const fakerealisticshopnames = [
        'Shoe House',
        'Shorts',
        'Shirts',
        'Pants',
        'Socks',
        'Hats',
        'Gloves',
        'Jackets',
    ]

    const screenSize = useScreenSize();
    return ( loading ? <div className={`flex-col sticky top-0 w-56 xl:w-72  ${screenSize.width < 1200 ? 'hidden' : 'block'}`}><LoadingScreen text={'loading..'} /> </div>:
        <div className={`flex-col sticky top-0 w-56 xl:w-72  ${screenSize.width < 1200 ? 'hidden' : 'block'}`}>

            <div className=' flex flex-col rounded-lg shadow-md py-2 items-center justify-center w-full'>
                <div className='w-16 h-18 rounded-full border-2 border-gray-400'>
                    <img src={imagefrombuffer(
                                { data: profile?.image.data.data }
                            )} alt="profile image" />
                </div>
                <h1>{profile.name}</h1>
                <p className='text-gray-400'>@{profile.email}</p>
                
                <Link to={`/profile/of/${userId}`}>
                    <button className='border-none text-primary-700 py-2'>Edit Profile</button>
                </Link>

                <hr className='w-full bg-gray-300' />

                <div className='py-2 px-4 w-full text-center'>
                    <h1 className='font-semibold'>Status</h1>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Shops:
                        </span>
                        <h2>{shops.length}</h2>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Followers:
                        </span>
                        <h2>{profile.followers.length}</h2>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Following:
                        </span>
                        <h2>{profile.following.length}</h2>
                    </div>
                </div>
            </div>

            <div className='flex flex-col rounded-lg shadow-md items-center justify-center w-full my-3'>
                <div className='flex w-full items-center justify-between px-4'>
                    <span className='font-semibold'>My Shops</span>
                    <Link to= {`#`}>
                        <button className='text-primary-700'>create</button>
                    </Link>
                </div>

                <hr className='w-full bg-gray-300 my-2' />

                <div className='flex flex-col w-full items-center justify-center'>
                    {
                        shops.map((shop, index) => {
                            return (
                                <div key={index} className='flex w-full items-center justify-center px-4 py-2 cursor-pointer hover:bg-gray-200'>
                                    <span className='text-primary-100 font-semibold'>{shop.name}</span>
                                </div>
                            )
                        })
                    }
                    </div>
            </div>

        </div>
    )
}

export default FeedSidebar