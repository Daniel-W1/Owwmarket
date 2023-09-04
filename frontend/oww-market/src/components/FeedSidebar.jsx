import React from 'react'
import useScreenSize from '../hooks/useScreenSize'
import profileImage from '../assets/images/twitter-icon.png'

const FeedSidebar = () => {

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
    return (
        <div className={`flex-col sticky top-0 w-56 xl:w-72  ${screenSize.width < 1200 ? 'hidden' : 'block'}`}>

            <div className=' flex flex-col rounded-lg shadow-md py-2 items-center justify-center w-full'>
                <div className='w-16 h-18 rounded-full border-2 border-gray-400'>
                    <img src={profileImage} alt="profile image" />
                </div>
                <h1>Jennifer Smith</h1>
                <p className='text-gray-400'>@jennifersmith@gmail.com</p>
                <button className='border-none text-primary-700 py-2'>Edit Profile</button>

                <hr className='w-full bg-gray-300' />

                <div className='py-2 px-4 w-full text-center'>
                    <h1 className='font-semibold'>Status</h1>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Products:
                        </span>
                        <h2>40</h2>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Shops:
                        </span>
                        <h2>5</h2>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Followers:
                        </span>
                        <h2>5</h2>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Following:
                        </span>
                        <h2>40</h2>
                    </div>
                </div>
            </div>

            <div className='flex flex-col rounded-lg shadow-md items-center justify-center w-full my-3'>
                <div className='flex w-full items-center justify-between px-4'>
                    <span className='font-semibold'>My Shops</span>
                    <button className='text-primary-700'>create</button>
                </div>

                <hr className='w-full bg-gray-300 my-2' />

                <div className='flex flex-col w-full items-center justify-center'>
                    {
                        fakerealisticshopnames.map((shopname, index) => {
                            return (
                                <div key={index} className='flex w-full items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-200'>
                                    <span className='text-primary-100 font-semibold'>{shopname}</span>
                                    <span>{Math.floor(Math.random()*15)}</span>                              
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