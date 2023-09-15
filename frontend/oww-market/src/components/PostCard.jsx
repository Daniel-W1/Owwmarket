import React, { useEffect, useState } from 'react'
import tw from 'twin.macro'
import { motion } from 'framer-motion'
import profileImage from '../assets/images/twitter-icon.png'
import { ReactComponent as StarIcon } from "../assets/images/star-icon.svg";
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { imagefrombuffer } from "imagefrombuffer"; //first import 
import { GetProfileForUser, GetShopById, GetShopForUser } from '../hooks/helpers';
import LoadingScreen from './loading';
import { Link } from 'react-router-dom';

const images = [
    profileImage,
    profileImage
]

const SvgContainer = styled.div`
    svg {
        ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
    }
`

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
}

const PostCard = ({ post }) => {
    const [loading, setloading] = useState(true);
    const [isHovering, setIsHovering] = useState(true);
    const [profile, setprofile] = useState(null);
    const [shop, setshop] = useState(null);


    console.log(post);
    useEffect(() => {
        (async () => {
            const response = await GetProfileForUser(post.owner)
            const shop_response = await GetShopById(post.shopId)

            const real_profile = response.profile;

            setshop(shop_response)
            setprofile(real_profile)
        }

        )();
    }, [])

    useEffect(() => {
        if (profile && shop) {
            setloading(false)
        }
    }, [profile, shop])


    return ( loading ? <LoadingScreen text={'loading..'} /> :
        <div className='flex-col w-full justify-center items-center mx-auto border-2 border-gray-200 rounded-xl overflow-hidden'>
            <div className='flex flex-wrap justify-start items-center px-2 py-2 bg-gray-200'>
                <div className='w-12 h-12  lg:w-16 lg:h-16 mx-3 rounded-full'>
                    <img src={
                        imagefrombuffer(
                            { data: profile?.image.data.data }
                        )
                    } alt="profile image" className='w-full h-full rounded-full' />
                </div>
                <div className='flex-col items-start'>
                    <div className='text-xl'>
                        {profile.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                        {formatDate(post.createdAt)}
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <Carousel emulateTouch={true} className='w-full'>
                    {
                        post.productImages.map((image, index) => {
                            return (
                                <div key={index} className='h-72'>
                                    <img src={
                                        imagefrombuffer(
                                            { data: image.data.data }
                                        )
                                    } className='h-full' alt="post image" />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </div>

            <div className='flex-col items-start px-4'>
                <div className='text-xl'>
                    {post.productname}
                </div>
                <div className='text-sm text-gray-500 flex'>
                    <span>{shop.name}</span>
                    <span className='mx-2'>|</span>
                    <span className='flex items-center'>
                        <SvgContainer>
                            <StarIcon className='w-4 h-4' />
                        </SvgContainer>
                        <span>{Math.round(Math.random()*50)/10} {Math.round(Math.random()*200)}</span>
                    </span>
                </div>
                <hr className='w-full bg-gray-600 my-2' />
                <div className='my-2'>
                    {post.productdescription}
                </div>

                <Link to={`/shops/${post.shopId}/products/${post._id}`}>
                    <button className='my-2 border-none bg-primary-200 rounded-lg text-white px-2 py-1 lg:px-3 lg:py-2'>
                        View Details
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default PostCard