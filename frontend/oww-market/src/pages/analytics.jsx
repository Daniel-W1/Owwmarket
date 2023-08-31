import React, { useEffect, useState } from 'react'
import { GetProductsForShop, GetShopForUser } from '../hooks/helpers';
import { Pie, Bar } from 'react-chartjs-2';
import LoadingScreen from '../components/loading';
import { Chart, registerables } from 'chart.js'
import { useParams } from 'react-router-dom';

Chart.register(...registerables)

const Analytics = () => {
  const params = useParams();
  
  const the_userId = params.userId ? params.userId: JSON.parse(localStorage.getItem("user"))._id;
  const [shops, setshops] = useState([]);
  const [products, setproducts] = useState([]);
  const [revenue, setrevenue] = useState([]);
  const [productNames, setproductNames] = useState([]);
  const [productRevenues, setproductRevenues] = useState([]);
  const [productsChartData, setproductsChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Products',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,

      },
    ],
  });

  const [shopChartData, setshopChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,

      },
    ],
  });
  const [loading, setloading] = useState(true);


  const Shops = async () => {
    const shops = await GetShopForUser(the_userId).then((res)=> {
      return res;
    })
    return shops
  }

  useEffect(() => {
    (async () =>{
      const res = await Shops().then((res)=>{
        return res;
      });    
      
      setshops(res)
    }) ();
  }, [])
  
  useEffect(() => {

    (async () => {
      const productLengths = []
      const totalRevenue = []
      const productNames = []
      const productRevenues = []
    

      for (let i = 0; i < shops.length; i++) {
        
        const fetched_products = await GetProductsForShop(shops[i]._id, the_userId).then((res) => {
          if (i === shops.length - 1){
            setloading(false);
          }
          return res;
          });
        const real_products = fetched_products.products
        
        let shopRevenue = 0;
        let productRevenue = 0;
        
        for (let j = 0; j < real_products.length; j++) {
          let res = real_products[j].price * (real_products[j].intialItemCount - real_products[j].itemsLeft);
          shopRevenue += res >= 0 ? res : 0;
          productNames.push(real_products[j].productname);
          productRevenue = res >= 0 ? res : 0;
          productRevenues.push(productRevenue >= 0 ? productRevenue : 0);
        }
        
        productLengths.push(real_products.length);
        totalRevenue.push(shopRevenue >= 0 ? shopRevenue : 0);
      }

      setrevenue(totalRevenue);
      setproducts(productLengths);
      setproductNames(productNames);
      setproductRevenues(productRevenues);
      
      if (shops.length > 0) {
        setshopChartData({
          labels: shops.map(shop => shop.name),
          datasets: [
            {
              label: 'Revenue',
              data: [10, 90],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1,
              
            },
          ],
        })
      }

      if (productNames.length > 0) {
        setproductsChartData({
          labels: productNames,
          datasets: [
            {
              label: 'Products',
              data: productRevenues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',

              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',

              ],
              borderWidth: 1,

            },
          ],
        })
      }

    })();

  }, [shops])

return (loading ? <LoadingScreen text={'loading..'} /> :
  <>
  <div className='flex justify-center sm:justify-around items-center flex-wrap'>
      <div className='w-96 lg:w-1/2'>
        <table className='w-full border-collapse mb-5'>
          <thead>
            <tr>
              <th className='text-left text-sm font-normal border-2 border-gray-600'>Shop</th>
              <th className='text-left text-sm font-normal border-2 border-gray-600'>Products</th>
              <th className='text-left text-sm font-normal border-2 border-gray-600'>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {
              shops.length > 0 && shops?.map((shop, index) => {
                return (
                  <tr key={index} className={index%2 == 0 ? 'bg-gray-300': 'bg-white'}>
                  <td className='border-2 text-sm font-normal border-gray-600'>{shop.name}</td>
                  <td className='border-2 text-sm font-normal border-gray-600'>{products[index]}</td>
                  <td className='border-2 text-sm font-normal border-gray-600'>{revenue[index]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

        <div className='inline-block relative '>
          <Pie
              data={shopChartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Revenue Per Shop"
                  }
                },
                responsive: true
              }}
              />
        </div>
      </div>

      <hr className='w-full my-10' />

      <div className='inline-block relative w-full h-96 py-20 sm:py-0'>
          <Bar data={productsChartData} options={{
            plugins: {
              title: {
                display: true,
                text: "Revenue Per Product"
              }
            },
            responsive: true
          }}/>

      </div>
  </>
  )
}

export default Analytics