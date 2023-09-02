import { Children, useEffect, useState } from 'react'
import { ReactComponent as ProfileIcon } from "feather-icons/dist/icons/user.svg";
import { DiGoogleAnalytics } from 'react-icons/di'
import { AiFillShopping } from 'react-icons/ai'
import { AiFillSetting } from 'react-icons/ai'
import { BiLogOutCircle } from 'react-icons/bi'
import useScreenSize from '../hooks/useScreenSize';
import { AiOutlineDoubleLeft } from 'react-icons/ai'
import LoadingScreen from '../components/loading';
import { imagefrombuffer } from "imagefrombuffer"; //first import 
import { Link, useParams } from 'react-router-dom';
import { GetProfileForUser } from '../hooks/helpers';


const Sidebar = () => {
    const [open, setopen] = useState(true)
    const [active, setactive] = useState(0)
    const [loading, setloading] = useState(true);
    const [profile, setprofile] = useState(null);
    const [isOwner, setisOwner] = useState(false);
    const params = useParams();

    const screenSize = useScreenSize();

    const userdata = localStorage.getItem('user');
    let user = null;
    if (userdata && userdata !== 'undefined') {
        user = JSON.parse(userdata);
    }

    useEffect(() => {
        (
            async () => {
                const fetched_profile = await GetProfileForUser(user._id)
                setprofile(fetched_profile.profile)
            }
        )();

        // check if the user is logged in and the owner is looking at his profile
        if (user && user._id === params.userId) {
            setisOwner(true)
        }
    }
    , [])

    useEffect(() => {
        if (profile !== null) {
            setloading(false)
        }
    }, [profile])


    useEffect(() => {
        if (screenSize.width < 768) {
            setopen(false)
        }
    }, [screenSize])


    const menu = [
        { title: 'Profile', src: ProfileIcon, path: `/profile/of/${user._id}` },
        { title: 'Analytics', src: DiGoogleAnalytics, bottom: true, path: `/user/${user._id}/analytics` },
        { title: 'Shops', src: AiFillShopping, path: `/shops/by/${user._id}` },
        { title: 'Settings', src: AiFillSetting, bottom: true, path: `/user/${user._id}/settings` },
        { title: 'Logout', src: BiLogOutCircle, path: '/logout' }
    ]


    return (loading ?  <div className={`mx-auto px-4 ${isOwner ? '': 'hidden'}`}><LoadingScreen text={'..'} /></div> :

            <div className={` ${open ? 'w-72' : ' w-20' } ${isOwner ? '': 'hidden'} h-screen relative  duration-300 bg-primary-200 border-r-2 border-r-gray-400`}>
                <div className={`absolute cursor-pointer rounded-full bg-white w-5 h-5 border-2 border-primary-200 ${!open && 'rotate-180'} ${screenSize.width < 600 && 'hidden'}`} style={{
                    top: '20px',
                    right: '-8px',
                }}

                    onClick={() => setopen(!open)}>
                    <AiOutlineDoubleLeft>
                    </AiOutlineDoubleLeft>
                </div>

                <h1 className={`text-white origin-left font-medium text-xl duration-300 flex items-center  p-4 ${!open && 'scale-0'}`}>
                    <div className='w-12 h-12 rounded-full'>
                        <img src={profile != null ? imagefrombuffer({
                            data: profile.image.data.data,
                        }) : ''} alt="" className='w-full h-full rounded-full' />
                    </div>
                    <div className='ml-1 text-2xl text-white'>
                        {`${user != null ? profile.name : ''}`}
                    </div>
                </h1>
                <hr className={`border-gray-500 duration-300 ${!open && 'scale-0'}`}></hr>
                <ul className='pt-6'>
                    {menu.map((item, index) => (
                        <div key={item.title}>
                            {item.bottom && <hr className='border-gray-500' />}
                            <Link to={item.path}>
                                <li onClick={() => setactive(index)} className={`flex items-center p-4 cursor-pointer gap-x-4 hover:bg-primary-100  ${index === active && 'bg-primary-100'} ${!open && 'justify-center'}`}>
                                    <item.src className={`w-5 h-5 mr-4 text-white ${!open && 'mx-auto'}`}></item.src>
                                    <span className={`${!open && 'hidden'} duration-300 text-white  font-semibold`}>{item.title}</span>
                                </li>
                            </Link>
                        </div>
                    ))}

                </ul>
            </div>
    )
}

export default Sidebar