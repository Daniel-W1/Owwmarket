import axios from "axios";

const token = localStorage.getItem('token');

// create a header for form data
const current_headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + token
}


const GetProfileForUser = async (userId) => {
    const url = `http://localhost:3000/profile/of/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            return res;
        });
        // console.log('this is the response', response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetShopForUser = async (userId) => {
    const url = `http://localhost:3000/shops/by/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            return res;
        });
        // console.log('this is the response', response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetProductsForShop = async (shopId, userId) => {
    const url = `http://localhost:3000/by/${userId}/from/${shopId}/products`;

    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            // console.log(res.data, 'this is the response');

            return res;
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetUserById = async (userId) => {
    const url = `http://localhost:3000/users/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            return res;
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const CreateNewShop = async (userId, name, description, image) => {
    const url = `http://localhost:3000/shops/by/${userId}`;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
        formData.append('image', image);
    }
    try {
        const response = await axios.post(url, formData, {
            headers: current_headers
        }).then((res) => {
            return res;
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
    }

}

export { GetProfileForUser, GetShopForUser, GetProductsForShop, GetUserById, CreateNewShop };
