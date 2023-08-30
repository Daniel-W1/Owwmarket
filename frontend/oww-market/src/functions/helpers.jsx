import axios from "axios";

const token = localStorage.getItem('token');

const Headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
}

const GetProfileForUser = async (userId) => {
    const url = `http://localhost:3000/profile/of/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true }, Headers);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetShopForUser = async (userId) => {
    const url = `http://localhost:3000/shops/by/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true }, Headers).then((res) => {
            return res;
        });
        console.log('this are the shops', response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetProductsForShop = async (shopId, userId) => {
    const url = `http://localhost:3000/by/${userId}/from/${shopId}/products`;

    try {
        const response = await axios.get(url, { withCredentials: true }, {
            headers: Headers
        }).then((res) => {
            console.log(res.data, 'this is the response');

            return res;
        });
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


export { GetProfileForUser, GetShopForUser, GetProductsForShop};
