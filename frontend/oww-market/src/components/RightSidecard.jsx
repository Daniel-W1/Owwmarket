import React from 'react'
import profileImage from '../assets/images/twitter-icon.png'
import {BsPersonAdd} from 'react-icons/bs'
import useScreenSize from '../hooks/useScreenSize'

const RightSidecard = () => {

    const screenSize = useScreenSize()
    return (
        <div>
            <div className={`sticky top-0 flex flex-col rounded-lg shadow-md items-center justify-center w-full my-3 pb-3 ${screenSize.width < 800 ? 'hidden': 'block'}`}>
                <div className='flex w-full items-center justify-between px-4'>
                    <span className='font-semibold'>Add Network</span>
                </div>

                <hr className='w-full bg-gray-300 my-2' />

                <div className='flex-col px-4'>
                    <div className='flex items-center'>
                        <div className='w-12 h-12 rounded-full'>
                            <img src={profileImage} alt="profile image" />
                        </div>
                        <div className='flex-col mx-2'>
                            <h1>Jennifer Smith</h1>
                            <p className='text-gray-400'>@jennifersmith@gmail.com</p>
                        </div>
                        <BsPersonAdd className='cursor-pointer'/>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default RightSidecard