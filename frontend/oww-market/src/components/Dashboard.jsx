import { useEffect, useState } from 'react'
import {ReactComponent as ProfileIcon} from "feather-icons/dist/icons/user.svg";
import {GrAnalytics} from 'react-icons/gr'
import {AiFillShopping} from 'react-icons/ai'
import {AiFillSetting} from 'react-icons/ai'
import {BiLogOutCircle} from 'react-icons/bi'
import useScreenSize from '../hooks/useScreenSize';
import {AiOutlineDoubleLeft} from 'react-icons/ai'
import Analytics from '../pages/analytics';
import Shops from '../pages/shops';
import Settings from '../pages/settings';
import Profile from './ProfileTop';
import Logout from '../functions/logout';


const Dashboard = () => {
  const [open, setopen] = useState(true)
  const [active, setactive] = useState(0)
  const [activePage, setactivePage] = useState(<Profile/>)
  const screenSize = useScreenSize();
  
  const userdata = localStorage.getItem("user");
  let user = null;
  if (userdata) {
    user = JSON.parse(userdata);
  }

  useEffect(() => {
    if(screenSize.width < 768){
        setopen(false)
    }
    }, [screenSize])

  useEffect(() => {
    if(active === 0){
      setactivePage(<Profile/>)
    }
    else if(active === 1){
      setactivePage(<Analytics/>)
    }
    else if(active === 2){
      setactivePage(<Shops/>)
    }
    else if(active === 3){
      setactivePage(<Settings/>)
    }
    else if(active === 4){
      setactivePage(<Logout/>)
    }
  }, [active])

  const menu = [
    {title : 'Profile', src: ProfileIcon, link: '/profile'},
    {title : 'Analytics', src: GrAnalytics, link: '/analytics', bottom: true},
    {title : 'Shops', src: AiFillShopping, link: '/shops'},
    {title : 'Settings', src: AiFillSetting, link: '/settings', bottom: true},
    {title : 'Logout', src: BiLogOutCircle, link: '/logout'}
  ]


  return (
    <div className='flex'>
        <div className={` ${open ? 'w-72' :' w-20'} h-screen duration-300 bg-primary-200 relative border-r-2 border-r-gray-400`}>
            <div className = {`absolute cursor-pointer rounded-full bg-white w-5 h-5 border-2 border-primary-200 ${!open && 'rotate-180'} ${screenSize.width < 600 && 'hidden'}`}  style = {{
                        top:'20px',
                        right: '-8px',
                    }}

                    onClick = {() => setopen(!open)}>
                <AiOutlineDoubleLeft >
                </AiOutlineDoubleLeft>
            </div>

            <h1 className={`text-white origin-left font-medium text-xl duration-300 p-4 pl-10 ${!open && 'scale-0'}`}>
                {`Welcome ${user != null ? user.name : ''}`}
            </h1>
            <hr className={`border-gray-500 duration-300 ${!open && 'scale-0'}`}></hr>
            <ul className='pt-6'>
                {menu.map((item, index) => (
                  <>
                    {item.bottom && <hr className='border-gray-500'/>}
                    <li key = {index} onClick={() => setactive(index)} className={`flex items-center p-4 cursor-pointer gap-x-4 hover:bg-primary-100  ${index === active && 'bg-primary-100'} ${!open && 'justify-center'}`}>
                          <item.src className={`w-5 h-5 mr-4 ${!open && 'mx-auto'}`}></item.src>
                          <span className={`${!open && 'hidden'} duration-300`}>{item.title}</span>
                    </li>
                  </>
                ))}

            </ul>
        </div>

        <div className='p-10 text-2xl font-semibold h-screen flex-1'>
            {activePage}
        </div>
    </div>
  )
}

export default Dashboard