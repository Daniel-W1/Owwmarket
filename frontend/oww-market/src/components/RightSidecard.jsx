import React, { useEffect, useState } from 'react'
import profileImage from '../assets/images/twitter-icon.png'
import { BsPersonAdd } from 'react-icons/bs'
import useScreenSize from '../hooks/useScreenSize'
import { FollowUser, GetRandomProfiles } from '../hooks/helpers'
import LoadingScreen from './loading'
import { imagefrombuffer } from "imagefrombuffer"; //first import
import { Link } from 'react-router-dom'

const RightSidecard = () => {

    const [loading, setLoading] = useState(true)
    const [profiles, setProfiles] = useState(null)
    const owner_id = JSON.parse(localStorage.getItem('user'))._id

    useEffect(() => {
        (
            async () => {
                const profiles = await GetRandomProfiles();

                // let's make sure the profiles aren't followed by the user
                let filtered_profiles = []

                for (let i = 0; i < profiles.profiles.length; i++) {
                    const profile = profiles.profiles[i];
                    if (profile.owner !== owner_id) {
                        filtered_profiles.push(profile)
                    }
                }

                setProfiles(filtered_profiles)
            }
        )();
    }, [])

    useEffect(() => {
        if (profiles) {
            setLoading(false)
        }
    }, [profiles])

    const screenSize = useScreenSize()
    return (loading ? <div className={`flex-col sticky top-0 w-56 xl:w-72  ${screenSize.width < 1200 ? 'hidden' : 'block'}`}> <LoadingScreen text={'loading..'} /> </div> :
        <div className={profiles.length > 0 ? 'block': 'hidden'}>   
            <div className={`sticky top-1/2  flex flex-col rounded-lg shadow-md items-center justify-center w-full my-3 pb-3 ${screenSize.width < 800 ? 'hidden' : 'block'}`}>
                <div className='flex w-full items-center justify-between px-4'>
                    <span className='font-semibold'>Add Network</span>
                </div>

                <hr className='w-full bg-gray-300 my-2' />
    
                 <div className='flex-col px-2'>
                    {
                        profiles.map((profile, index) => {
                            return (
                                
                                    <div  className='flex items-center justify-between hover:bg-gray-100 rounded-md px-2'>
                                        <div className='flex'>

                                            <div className='w-12 h-12 rounded-full overflow-hidden'>
                                                <img src={profile.image ? imagefrombuffer(
                                                    { data: profile.image.data.data }
                                                ) : profileImage} className='w-full h-full' alt="profile image" />
                                            </div>
                                            <div className='flex-col mx-2'>
                                                <Link to={`/profile/of/${profile.owner}`} key={index}>
                                                <h1 className='hover:underline'>{profile.name}</h1>
                                                </Link>
                                                <p className='text-gray-400'>@{profile.email}</p>
                                            </div>
                                        </div>
                                        {
                                            !profile.followers.includes(owner_id) && <BsPersonAdd className='cursor-pointer' onClick={
                                            async () => {
                                                setLoading(true)
                                                await FollowUser(owner_id, profile.owner);
                                                const new_profiles = profiles.filter((item) => item.owner !== profile.owner)
                                                setProfiles(new_profiles)
                                            }
                                        } />}
                                    </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default RightSidecard