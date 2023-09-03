import React, { useEffect, useState } from 'react';
import { GetShopForUser, GetUserById } from '../hooks/helpers';
import LoadingScreen from '../components/loading';
import ShopCard from '../components/ShopCard';
import { useParams } from 'react-router-dom';
import CreateShop from '../components/CreateShop';

const Shops = (props) => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [user, setUser] = useState(null);

  const the_userId = params.userId ? params.userId : JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await GetUserById(the_userId);
        setUser(user);

        if (props.type === "create") {
          // Handle create mode if needed
        } else {
          const response = await GetShopForUser(the_userId);
          setShops(response);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [the_userId, props.type]);

  return (
    <div>
      {loading ? (
        <LoadingScreen text={'loading..'} />
      ) : props.type !== "create" ? (
        shops.map((shop) => {
          return <ShopCard shop={shop} key={shop.id} />;
        })
      ) : (
        <>
          <CreateShop userId={the_userId} />
        </>
      )}
    </div>
  );
};

export default Shops;
