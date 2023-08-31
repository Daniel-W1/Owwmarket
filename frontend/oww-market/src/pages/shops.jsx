import React, { useEffect, useState } from 'react'
import { GetShopForUser, GetUserById } from '../hooks/helpers';
import LoadingScreen from '../components/loading';
import ShopCard from '../components/ShopCard';
import { useParams } from 'react-router-dom';


const Shops = () => {

  const params = useParams();
  const [loading, setloading] = useState(true)
  const [shops, setshops] = useState([])
  const [user, setuser] = useState(null);

  const the_userId = params.userId ? params.userId: JSON.parse(localStorage.getItem("user"))._id;
  useEffect(() => {
    (
      async () => {
        const response = await GetShopForUser(the_userId).then((res) => {
          return res;
        });

        const user = GetUserById(the_userId);

        setuser(user)
        setshops(response)
      }
      ) ();
    }, [])
    
    useEffect(() => {
      if (shops && user) {
        setloading(false)
      }
    }, [shops, user])

  return (
    <div>
      {
        loading ? <LoadingScreen text={'loading..'} /> : (
          shops.map((shop) => {
            return (
              <ShopCard shop = {shop} />
            )
          })

        )
      }
    </div>
  )
}

export default Shops