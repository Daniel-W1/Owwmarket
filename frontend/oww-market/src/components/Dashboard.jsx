import React, { useEffect, useState } from 'react'
import {AiFillCaretLeft} from 'react-icons/ai'
import {ReactComponent as ProfileIcon} from "feather-icons/dist/icons/user.svg";
import {GrAnalytics} from 'react-icons/gr'
import {AiFillShopping} from 'react-icons/ai'
import {AiFillSetting} from 'react-icons/ai'
import {BiLogOutCircle} from 'react-icons/bi'
import useScreenSize from '../hooks/useScreenSize';

const Dashboard = () => {
  const [open, setopen] = useState(true)
  const [active, setactive] = useState(0)
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


  const menu = [
    {title : 'Profile', src: ProfileIcon, link: '/profile'},
    {title : 'Analytics', src: GrAnalytics, link: '/analytics'},
    {title : 'Shops', src: AiFillShopping, link: '/shops'},
    {title : 'Settings', src: AiFillSetting, link: '/settings'},
    {title : 'Logout', src: BiLogOutCircle, link: '/logout'}
  ]


  return (
    <div className='flex'>
        <div className={` ${open ? 'w-72' :' w-20'} h-screen duration-300 bg-primary-200 relative`}>
            <div className = {`absolute cursor-pointer rounded-full bg-white w-5 h-5 border-2 border-primary-200 ${!open && 'rotate-180'} ${screenSize.width < 600 && 'hidden'}`}  style = {{
                        top:'20px',
                        right: '-8px',
                    }}

                    onClick = {() => setopen(!open)}>
                <AiFillCaretLeft >
                </AiFillCaretLeft>
            </div>

            <h1 className={`text-white origin-left font-medium text-xl duration-300 p-4 ${!open && 'scale-0'}`}>
                {`Welcome ${user != null ? user.name : ''}`}
            </h1>
            <ul className='pt-6'>
                {menu.map((item, index) => (
                    <li key = {index} onClick={() => setactive(index)} className={`flex items-center p-4 cursor-pointer gap-x-4 hover:bg-primary-100 ${!open && 'justify-center'} ${index === active && 'bg-primary-100'}`}>
                        <item.src className={`w-5 h-5 mr-4 ${!open && 'mx-auto'}`}></item.src>
                        <span className={`${!open && 'hidden'} duration-300`}>{item.title}</span>
                    </li>
                ))}

            </ul>
        </div>

        <div className='p-10 text-2xl font-semibold h-screen'>
            {menu[active].title}
        </div>
    </div>
  )
}

export default Dashboard