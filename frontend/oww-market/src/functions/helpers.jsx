import axios from "axios";

const GetProfileForUser = async (userId) => {
    const url = `http://localhost:3000/profile/of/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const GetShopForUser = async (userId) => {
    const url = `http://localhost:3000/shops/by/${userId}`;
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export { GetProfileForUser, GetShopForUser};
