import React, { useState } from 'react'
import tw from 'twin.macro'
import { motion } from 'framer-motion'
import profileImage from '../assets/images/twitter-icon.png'
import { ReactComponent as StarIcon } from "../assets/images/star-icon.svg";
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const images = [
    profileImage,
    profileImage
]

const SvgContainer = styled.div`
    svg {
        ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
    }
`

const PostCard = () => {
    const [isHovering, setIsHovering] = useState(true);

    return (
        <div className='flex-col w-full justify-center items-center mx-auto border-2 border-gray-200 rounded-xl overflow-hidden'>
            <div className='flex flex-wrap justify-start items-center px-2 py-2 bg-gray-200'>
                <div className='w-12 h-12  lg:w-16 lg:h-16 mx-3 rounded-full'>
                    <img src={profileImage} alt="profile image" className='w-full h-full rounded-full' />
                </div>
                <div className='flex-col items-start'>
                    <div className='text-xl'>
                        John Doe
                    </div>
                    <div className='text-sm text-gray-500'>
                        2 hours ago
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <Carousel emulateTouch = {true} className='w-full'>
                    {
                        images.map((image, index) => {
                            return (
                                <div key={index} className='h-72'>
                                    <img src={image} className='h-full' alt="post image" />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </div>

            <div className='flex-col items-start px-4'>
                <div className='text-xl'>
                    Product Name
                </div>
                <div className='text-sm text-gray-500 flex'>
                    <span>Shop Name</span>
                    <span className='mx-2'>|</span>
                    <span className='flex items-center'>
                        <SvgContainer>
                            <StarIcon className='w-4 h-4' />
                        </SvgContainer>
                        <span>4.8 (200)</span>
                    </span>
                </div>
                <hr className='w-full bg-gray-600 my-2' />
                <div className='my-2'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, doloremque dolores 
                    cupiditate corrupti molestiae earum voluptatibus. 
                    Aperiam autem aspernatur omnis quibusdam quos suscipit deserunt, ad aliquam consequuntur eum odio hic!
                </div>

                <button className='my-2 border-none bg-primary-200 rounded-lg text-white px-2 py-1 lg:px-3 lg:py-2'>
                    View Details
                </button>
            </div>
        </div>
    )
}

export default PostCard