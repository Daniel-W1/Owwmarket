import { useEffect, useRef, useState } from 'react'
import { GrLocation, GrUpdate } from 'react-icons/gr';
import { AiOutlineMail } from 'react-icons/ai';
import { BiShoppingBag } from 'react-icons/bi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { AiFillCamera, AiFillEdit } from 'react-icons/ai';
import {handleUpdate} from '../functions/update';
import { GetProfileForUser, GetShopForUser } from '../functions/helpers';
import LoadingScreen from './loading';
import { imagefrombuffer } from "imagefrombuffer"; //first import 
import { MdDownloadDone } from 'react-icons/md'
import { GiCancel } from 'react-icons/gi'
import { useParams } from 'react-router-dom';


const Profile = () => {
    const params = useParams();
    const [theProfile, settheProfile] = useState(null)
    const [loading, setloading] = useState({
        loading_bool: true,
        loading_text: 'Loading...'
    })
    const [changed, setchanged] = useState(false)
    const [formMode, setformMode] = useState(false)
    const [formHovered, setformHovered] = useState(false)
    const [newForm, setnewForm] = useState({
        name: '',
        location: '',
        bio: ''
    })
    const inputref = useRef(null)
    const [selectedImage, setselectedImage] = useState(null)
    const [imageHovered, setimageHovered] = useState(false);
    const the_userId = params.userId ? params.userId : JSON.parse(localStorage.getItem('user'))._id;


    useEffect(()=> {
        (
            async () => {
                const response = await GetShopForUser(the_userId);
                const shopdata = await GetShopForUser(the_userId);

                let theProfile = response.profile;
                theProfile.shops = shopdata;

                settheProfile(response.profile);
            }
        )();
    }, [])

    useEffect(() => {
        (async ()=>{
            const data = await GetProfileForUser(the_userId)
            const shopdata = await GetShopForUser(the_userId);

            let theProfile = data.profile;
            theProfile.shops = shopdata;

            newForm.name = theProfile.name;
            newForm.location = theProfile.location ? theProfile.location : 'No Location';
            newForm.bio = theProfile.bio ? theProfile.bio : 'Add a bio and tell your buyers about yourself!';

            settheProfile(theProfile);
        }
        )();

    }, [changed])

    useEffect(()=>{
        if (theProfile) {
        setloading({
            loading_bool: false,
            loading_text: 'Loading...'
        })
        }
    }, [theProfile])

    const nameRef = useRef(null)
    const locationRef = useRef(null)
    const bioRef = useRef(null)

    useEffect(() => {
        if (formMode) {
            nameRef.current.focus()
        }
    }, [formMode])



    const handleButtonClick = () => {
        inputref.current?.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            setselectedImage(file);
        } else {
            setselectedImage(null);
        }
    };

    let profile = theProfile;
    // console.log(profile, loadin

    return (loading.loading_bool ? <LoadingScreen text={loading.loading_text} /> :
        <div class="relative flex flex-col min-w-0 break-words shadow-2xl w-full mx-auto md:w-2/3 xl:w-1/2 2xl:w-1/3 px-4 ">
            <div class="px-6">
                <div class="flex flex-wrap justify-center">
                    <div class="w-full px-4 flex justify-center relative">
                        {!formMode && selectedImage && <GiCancel className='absolute top-1/2 left-0  cursor-pointer' onClick={() => setselectedImage(null)} />}
                        {!formMode && selectedImage && <MdDownloadDone className='absolute top-1/2 right-0 cursor-pointer' onClick={async () => {
                            setloading({
                                loading_bool: true,
                                loading_text: 'Updating Profile...'
                            })
                            await handleUpdate(`/profile/of/${the_userId}`, selectedImage, newForm, setselectedImage)
                            setselectedImage(null)
                            setchanged(!changed)
                        }} />
                        }

                        <div className={"relative w-32 h-32 sm:w-40 sm:h-40 cursor-pointer border-2 border-gray-600 rounded-full "} onMouseEnter={() => setimageHovered(true)} onMouseLeave={() => setimageHovered(false)}>
                            <img alt="..." src={selectedImage ? URL.createObjectURL(selectedImage) : imagefrombuffer(
                                { data: profile?.image.data.data }
                            )} className={`w-full h-full mx-auto rounded-full`} />
                            <input ref={inputref} style={{ display: 'none' }} type='file' onChange={handleFileChange} />
                            {!formMode && <AiFillCamera className={`duration-200 absolute m-auto left-0 right-0 top-0 bottom-0 text-3xl shadow-2xl shadow-white text-black ${imageHovered ? 'opacity-100' : 'opacity-0'}`} onClick={handleButtonClick} />}                        </div>
                    </div>
                    <div class="w-full flex justify-around py-4 lg:pt-4 pt-8 flex-wrap items-center ">
                        <div class="p-3 text-center w-24">
                            <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                {profile.shops.length}
                            </span>
                            <span class="text-sm text-blueGray-400">Shops</span>
                        </div>

                        <div class="p-3 text-center w-24">
                            <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                {profile.followers.length}
                            </span>
                            <span class="text-sm text-blueGray-400">Followers</span>
                        </div>
                        <div class="p-3 text-center w-24">
                            <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                                {profile.following.length}
                            </span>
                            <span class="text-sm text-blueGray-400">Following</span>
                        </div>
                    </div>
                </div>

                <div className='relative' onMouseEnter={() => setformHovered(true)} onMouseLeave={() => setformHovered(false)}>

                    {!formMode && !selectedImage && <AiFillEdit className={`absolute top-0 right-0 text-2xl text-blueGray-400 cursor-pointer duration-300 ${formHovered ? 'opacity-100' : 'opacity-0'}`} onClick={() => setformMode(!formMode)} />}
                    {formMode && <MdDownloadDone className={`absolute top-0 right-0 text-2xl text-blueGray-400 cursor-pointer duration-300`} onClick={async () => {
                        setloading({
                            loading_bool: true,
                            loading_text: 'Updating Profile...'
                        })
                        await handleUpdate(`/profile/of/${the_userId}`, selectedImage, newForm, setselectedImage)
                        setchanged(!changed)
                        setformMode(!formMode)
                    }} />}

                    <div class="text-center flex justify-center items-center mb-2">
                        <h3 className={`text-2xl font-semibold leading-normal text-blueGray-700 ${formMode ? 'hidden' : 'block'}`}>
                            {newForm.name}
                        </h3>
                        <input ref={nameRef} value={newForm.name} type="text" className={`border-none text-2xl font-semibold leading-normal text-blueGray-700  ${formMode ? 'block' : 'hidden'}`} onChange={(e) => {
                            setnewForm({ ...newForm, name: e.target.value })
                        }} />

                    </div>
                    <div class="py-2 text-blueGray-600  flex justify-around items-center flex-wrap ">
                        <span class="text-sm leading-normal flex items-center  text-blueGray-400 font-bold uppercase">
                            <GrLocation className='inline-block mr-2' />
                            {!formMode && newForm.location}
                            <input value={newForm.location} ref={locationRef} type="text" className={`border-none text-sm leading-normal flex items-center text-blueGray-400 font-bold uppercase ${formMode ? 'block' : 'hidden'}`} onChange={(e) => {
                                setnewForm({ ...newForm, location: e.target.value })

                            }} />
                        </span>
                        <div class="text-sm leading-normal flex items-center text-blueGray-400 font-bold uppercase">
                            <AiOutlineMail className='inline-block mr-2' />
                            {profile.email}
                        </div>
                    </div>
                </div>


                <div class="mt-5 py-10 border-t border-blueGray-200 text-center">
                    <div class="flex flex-wrap justify-center">
                        <div class="w-full lg:w-9/12">
                            {!formMode && <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                                {newForm.bio}
                            </p>}
                            <textarea value={newForm.bio} ref={bioRef} type="text" className={`border-none text-lg leading-relaxed text-blueGray-700 w-full h-32 ${formMode ? 'block' : 'hidden'}`} onChange={(e) => {
                                setnewForm({ ...newForm, bio: e.target.value })
                            }} />
                        </div>
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
            </div>
        </div>
    )
}

export default Profile