import React from 'react'
import { GrLocation } from 'react-icons/gr';
import { AiOutlineMail } from 'react-icons/ai';
import { BiShoppingBag } from 'react-icons/bi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';

const Profile = ({ profile }) => {

    console.log(profile);

    return (
        <div class="relative flex flex-col min-w-0 break-words shadow-2xl w-full mx-auto md:w-2/3 xl:w-1/2 2xl:w-1/3 px-4 ">
            <div class="px-6">
                <div class="flex flex-wrap justify-center">
                    <div class="w-full px-4 flex justify-center">
                        <div class="relative w-40 h-40">
                            <img alt="..." src={profile.image} className={`w-full h-full`} />
                        </div>
                    </div>
                    <div class="w-full px-4 text-center">
                        <div class="flex justify-around py-4 lg:pt-4 pt-8 flex-wrap items-center">
                            <div class="mr-4 p-3 text-center">
                                <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                    {profile.shops.length}
                                </span>
                                <span class="text-sm text-blueGray-400">Shops</span>
                            </div>
                            <div class="mr-4 p-3 text-center">
                                <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                    {profile.products.length}
                                </span>
                                <span class="text-sm text-blueGray-400">Products</span>
                            </div>
                            <div class="lg:mr-4 p-3 text-center">
                                <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                    {profile.followers.length}
                                </span>
                                <span class="text-sm text-blueGray-400">Followers</span>
                            </div>
                            <div class="lg:mr-4 p-3 text-center">
                                <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                    {profile.following.length}
                                </span>
                                <span class="text-sm text-blueGray-400">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center flex justify-center items-center mb-2">
                    <h3 class="text-2xl font-semibold leading-normal text-blueGray-700 ">
                        {profile.name}
                    </h3>
                </div>
                <div class="py-2 text-blueGray-600  flex justify-around items-center flex-wrap ">
                    <span class="text-sm leading-normal flex items-center text-blueGray-400 font-bold uppercase">
                        <GrLocation className='inline-block mr-2' />
                        {profile.location}
                    </span>
                    <div class="text-sm leading-normal flex items-center text-blueGray-400 font-bold uppercase">
                        <AiOutlineMail className='inline-block mr-2' />
                        {profile.email}
                    </div>
                </div>

                <div className='border-t border-blueGray-200 mb-2'></div>
                <div class="text-blueGray-600">
                    <button className='border-none px-6 py-2 w-full flex items-center justify-center text-center  hover:bg-gray-400 duration-300'>
                        <BiShoppingBag className='inline-block mr-2' />
                    </button>
                </div>
                <div class="mb-2 text-blueGray-600">
                    <button className='border-none px-6 py-2 w-full text-center hover:bg-gray-400 duration-300'>
                        <MdOutlineProductionQuantityLimits className='inline-block mr-2' />
                    </button>
                </div>

                <div class="mt-5 py-10 border-t border-blueGray-200 text-center">
                    <div class="flex flex-wrap justify-center">
                        <div class="w-full lg:w-9/12">
                            <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                                {profile.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile