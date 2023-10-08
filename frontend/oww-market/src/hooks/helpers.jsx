import axios from "axios";

const token = localStorage.getItem('token');

// create a header for form data
const current_headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + token
}

const second_headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
}

const GetAllProfiles = async () => {
    const url = `http://localhost:3000/profile`;
    try {
        const response = await axios.get(url, { headers: current_headers }).then((res) => {
            return res;
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


const GetProfileForUser = async (userId) => {
    const url = `http://localhost:3000/profile/of/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            return res;
        });
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
        console.log('this is the response', response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetProductsForShop = async (shopId, userId) => {
    const url = `http://localhost:3000/by/${userId}/from/${shopId}/products`;

    try {
        const response = await axios.get(url, {withCredentials : true}).then((res) => {
            return res;
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}
const GetBids = async (productId) => {
    const url = `http://localhost:3000/products/${productId}/bids`;

    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            // console.log(res.data, 'this is the response');
            return res;
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetProductById = async (shopId, productId) => {
    const url = `http://localhost:3000/from/${shopId}/products/${productId}`;

    try {
        const response = await axios.get(url, { withCredentials: true }).then((res) => {
            return res;
        });
        console.log(response.data);
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

const GetRandomProfiles = async () => {
    const url = `http://localhost:3000/profile/random`;
    try {
        const response = await axios.get(url, { headers: current_headers }).then((res) => {
            return res;
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const FollowUser = async (userId, followedId) => {
    const url = `http://localhost:3000/profile/follow`;

    const data = {
        followerId: userId,
        followedId: followedId
    }
    try {
        const response = await axios.put(url, data, { headers: current_headers }).then((res) => {
            return res;
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const UnfollowUser = async (userId, followedId) => {
    const url = `http://localhost:3000/profile/unfollow`;

    const data = {
        removerId: userId,
        removedId: followedId    
    }
    try {
        const response = await axios.put(url, data, { headers: current_headers }).then((res) => {
            return res;
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }

}

const GetFeedForUser = async (pageNum) => {
    const url = `http://localhost:3000/feed`;
    try {
        const response = await axios.get(url, { headers: current_headers, 
            params: {
                page: pageNum
            }
        }).then((res) => {
            return res;
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}   

const GetShopById = async (shopId) => {
    const url = `http://localhost:3000/shops/${shopId}`;
    try {
        const response = await axios.get(url, { headers: current_headers }).then((res) => {
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

const SetBid = async (productId, amount) => {
    const url = `http://localhost:3000/products/${productId}/bids`;
    const data = {
        bid: amount
    }
    try {
        const response = await axios.put(url, data, { headers: second_headers }).then((res) => {
            return res;
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export {GetProfileForUser, GetBids, GetShopForUser, GetAllProfiles, GetProductsForShop, GetUserById, GetProductById, CreateNewShop , GetShopById, GetRandomProfiles, FollowUser, UnfollowUser, GetFeedForUser, SetBid};
