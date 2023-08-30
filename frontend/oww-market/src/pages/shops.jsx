import React, { useEffect, useState } from 'react'
import { GetShopForUser } from '../functions/helpers';
import LoadingScreen from '../components/loading';
import ShopCard from '../components/ShopCard';

const user = JSON.parse(localStorage.getItem("user"));

const Shops = () => {

  const [loading, setloading] = useState(true)
  const [shops, setshops] = useState([])

  useEffect(() => {
    (
      async () => {
        const response = await GetShopForUser(user._id).then((res) => {
          return res;
        });

        setshops(response)
        setloading(false)
      }
    ) ();
  }, [])

  console.log(shops);
  return (
    <div>
      {
        loading ? <LoadingScreen text={'loading..'} /> : (
          shops.map((shop) => {
            return (
              <ShopCard shop={shop} name={user.name} />
            )
          })

        )
      }
    </div>
  )
}

export default Shops