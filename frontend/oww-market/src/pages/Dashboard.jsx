import { useEffect, useState } from 'react'
import {ReactComponent as ProfileIcon} from "feather-icons/dist/icons/user.svg";
import {DiGoogleAnalytics} from 'react-icons/di'
import {AiFillShopping} from 'react-icons/ai'
import {AiFillSetting} from 'react-icons/ai'
import {BiLogOutCircle} from 'react-icons/bi'
import useScreenSize from '../hooks/useScreenSize';
import {AiOutlineDoubleLeft} from 'react-icons/ai'
import Analytics from './analytics';
import Shops from './shops';
import Settings from './settings';
import Profile from '../components/ProfileTop';
import Logout from '../functions/logout';
import LoadingScreen from '../components/loading';
import { imagefrombuffer } from "imagefrombuffer"; //first import 


const Dashboard = () => {
  const [open, setopen] = useState(true)
  const [active, setactive] = useState(0)
  const [loading, setloading] = useState(false);
  const screenSize = useScreenSize();

  
  const userdata = localStorage.getItem("user");
  const profiledata = localStorage.getItem("profile");

  let user = null;
  let profile = null;

  if (userdata && userdata !== 'undefined') {
    user = JSON.parse(userdata);
  }
  
  if (profiledata && profiledata !== 'undefined') {
    profile = JSON.parse(profiledata);
  }

  useEffect(() => {
    if(screenSize.width < 768){
        setopen(false)
    }
    }, [screenSize])


  const menu = [
    {title : 'Profile', src: ProfileIcon, link: <Profile/>},
    {title : 'Analytics', src: DiGoogleAnalytics, link: <Analytics/>, bottom: true},
    {title : 'Shops', src: AiFillShopping, link: <Shops/>},
    {title : 'Settings', src: AiFillSetting, link: <Settings/>, bottom: true},
    {title : 'Logout', src: BiLogOutCircle, link: <Logout/>}
  ]


  return (
    <div className='flex overflow-hidden w-full'>
        <div className={` ${open ? 'w-72' :' w-20'} duration-300 bg-primary-200 relative border-r-2 border-r-gray-400 float-left`}>
            <div className = {`absolute cursor-pointer rounded-full bg-white w-5 h-5 border-2 border-primary-200 ${!open && 'rotate-180'} ${screenSize.width < 600 && 'hidden'}`}  style = {{
                        top:'20px',
                        right: '-8px',
                    }}

                    onClick = {() => setopen(!open)}>
                <AiOutlineDoubleLeft>
                </AiOutlineDoubleLeft>
            </div>

            <h1 className={`text-white origin-left font-medium text-xl duration-300 flex items-center  p-4 ${!open && 'scale-0'}`}>
                <div className='w-12 h-12 rounded-full'>
                    <img src={profile != null ? imagefrombuffer({
                      data: profile.image.data.data,
                    }) : ''} alt="" className='w-full h-full rounded-full'/>
                </div>
                <div className='ml-1 text-2xl text-white'>
                  {`${user != null ? profile.name : ''}`}
                </div>
            </h1>
            <hr className={`border-gray-500 duration-300 ${!open && 'scale-0'}`}></hr>
            <ul className='pt-6'>
                {menu.map((item, index) => (
                  <>
                    {item.bottom && <hr className='border-gray-500'/>}
                    <li key = {index} onClick={() => setactive(index)} className={`flex items-center p-4 cursor-pointer gap-x-4 hover:bg-primary-100  ${index === active && 'bg-primary-100'} ${!open && 'justify-center'}`}>
                          <item.src className={`w-5 h-5 mr-4 text-white ${!open && 'mx-auto'} `}></item.src>
                          <span className={`${!open && 'hidden'} duration-300 text-white  font-semibold`}>{item.title}</span>
                    </li>
                  </>
                ))}

            </ul>
        </div>

        <div className='p-10 text-2xl font-semibold h-screen flex-1 overflow-x-hidden overflow-y-scroll float-right'>
            {loading ? <LoadingScreen/> : menu[active].link}
        </div>
    </div>
  )
}

export default Dashboard