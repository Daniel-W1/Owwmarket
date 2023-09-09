import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { GetAllProfiles } from '../hooks/helpers'
import { imagefrombuffer } from "imagefrombuffer"; //first import
import { Link } from 'react-router-dom';

const SearchBar = () => {

    const [loading, setLoading] = useState(true)
    const [profiles, setProfiles] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [searchText, setSearchText] = useState('')

    const handleChange = (e) => {
        if (e.target.value.length > 0) {
            setSearchText(e.target.value)
            setIsSearching(true)
        } else {
            setIsSearching(false)
        }
    }

    useEffect(() => {
        (
            async () => {
                const all_profiles = await GetAllProfiles();
                const real_profiles = all_profiles.profiles;

                setProfiles(real_profiles)
            }
        )();
    }, [])

    useEffect(() => {
        if (profiles) {
            setLoading(false)
        }
    }, [profiles])


    console.log('this is the profiles', profiles, searchText);
    return (
        <div>
            {!loading && <div className='flex-col gap-y-2'>
                <div className='w-56 h-8'>
                    <input type="text" placeholder='search..' onChange={handleChange} className='w-full h-full border-2 border-gray-300 rounded-md pl-8 pb-1' />
                    <BsSearch className='absolute text-2xl top-1/2 pl-2 transform -translate-y-1/2  text-black-500' />
                </div>
                
                <div className='bg-red-200'>

                {
                    isSearching && <div className='w-56 h-32 absolute py-2  bg-white rounded-md shadow-md overflow-y-scroll'>
                        {
                            // first filter the profiles by the text and name
                            profiles.filter(profile => profile.name.toLowerCase().includes(searchText.toLowerCase())).map((profile, index) => {
                                return (
                                    <Link to={`/profile/of/${profile.owner}`}>
                                        <div key={index} className='flex-col gap-y-1 px-2 hover:bg-gray-200'>
                                            <div className='font-semibold'>{profile.name}</div>
                                            <div className='text-sm text-gray-500'>{profile.email}</div>
                                        </div>
                                    </Link>
                                )
                        }
                        )
                        }
                    </div>
                }
            </div>
            </div>
            }
        </div>
    )
}

export default SearchBar