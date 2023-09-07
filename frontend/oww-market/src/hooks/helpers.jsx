import axios from "axios";

const token = localStorage.getItem('token');

const current_headers = {
    'Content-Type': 'application/json',
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
        
        console.log('we are here in the get products for shop', response.data);
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



export { GetProfileForUser, GetShopForUser, GetProductsForShop, GetUserById, GetRandomProfiles, FollowUser, UnfollowUser};
