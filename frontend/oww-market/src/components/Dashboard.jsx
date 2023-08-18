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
import profileImage from '../assets/images/food.png'


const fakeProfile = {
  name: "John Doe",
  email: "john@gmail.com", 
  bio: "I am a software engineer and I love to code and build things. Oh and I love to play video games too!",
  image: profileImage,
  location: "Lagos, Nigeria",
  shops: [
    {
      name: "John's Shop",
      products: [
        {
          name: "Shoe",
          price: 1000,
          description: "This is a very nice shoe",
          image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
        },
        {
          name: "Shirt",
          price: 500,
          description: "This is a very nice shirt",
          image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
        },
      ]
    }
  ]
  ,
  followers: [
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },]
    ,
  following: [
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      name: "Jane Doe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },],
  products: [
    {
      name: "Shoe",
      price: 1000,
      description: "This is a very nice shoe",
      image: "https://images.unsplash.com/photo-1612837017391-0e3b5a5b0b0b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
    },
  ]
}

const Dashboard = () => {
  const [open, setopen] = useState(true)
  const [active, setactive] = useState(0)
  const [activePage, setactivePage] = useState(<Profile profile={fakeProfile}/>)
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
      setactivePage(<Profile profile={fakeProfile}/>)
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
    <div className='flex overflow-hidden w-full'>
        <div className={` ${open ? 'w-72' :' w-20'} duration-300 bg-primary-200 relative border-r-2 border-r-gray-400 float-left`}>
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

        <div className='p-10 text-2xl font-semibold h-screen flex-1 overflow-x-hidden overflow-y-scroll float-right'>
            {activePage}
        </div>
    </div>
  )
}

export default Dashboard