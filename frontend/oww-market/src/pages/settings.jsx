import React, { useState } from 'react'
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import shortid from 'shortid';


const Settings = () => {
  const [currentIndex, setcurrentIndex] = useState(0)
  const [loading, setloading] = useState(true)

  const menu = [
    {
      name: 'Profile Settings',
      component: <div></div>
    },
    {
      name: 'Feed Settings',
      component: <div></div>
    },
  ]

  const profileSettings = [
    {
      text: 'Show my profile to Everyone',
    },
    {
      text: 'Show my email to my Followers only',
    },
    {
      text: 'Show my phone number to my Followers only',
    },
  ]

  const feedSettings = [
    {
      text: 'Show me recommended Products',
    },
    {
      text: 'Show me recommended Shops',
    },
    {
      text: 'Show me recommended Users',
    },
  ]

  console.log('we are here');

  return (
    <div>
      <div className='w-full flex justify-around mb-8'>
        {
          menu.map((item, index) => {
            return (
              <div key={item.name} className={`${currentIndex === index ? 'border-b-2 border-primary-500' : ''} cursor-pointer mx-4 text-sm lg:text-xl`} onClick={() => setcurrentIndex(index)}>
                {item.name}
              </div>
            )
          })
        }
      </div>

      <div className='mx-auto lg:px-10 py-4'>
        {
          currentIndex === 0 ? (
            profileSettings.map((item, index) => {
              return (
                <div key={index}>
                  <div className='flex justify-between items-center lg:text-xl lg:justify-between text-sm'>
                    <div>{item.text}</div>
                    <div className='py-4'>
                      <Toggle />
                    </div>
                  </div>
                  <hr className='border-gray-300' />
                </div>
              )
            }
            )
          ) : (
            feedSettings.map((item, index) => {
              return (
                <div key={index}>
                  <div className='flex justify-between items-center lg:text-xl lg:justify-between text-sm'>
                    <div>{item.text}</div>
                    <div className='py-4'>
                      <Toggle />
                    </div>
                  </div>
                  <hr className='border-gray-300' />
                </div>
              )
            }
            )
          )
        }
      </div>
    </div>
  )
}

export default Settings