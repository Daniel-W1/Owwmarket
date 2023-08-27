import axios from "axios";
import { GetProfileForUser } from "./helpers";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem('token');

const handleUpdate = async (endPoint, selectedImage, textData) => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('name', textData.name);
    formData.append('location', textData.location);
    formData.append('bio', textData.bio);

    try {
        const res = await axios.put('http://localhost:3000'+endPoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.data.success === true) {
            localStorage.setItem(profile, JSON.stringify(res.data));
            const new_user = await updateUser(res.data.seller);
            localStorage.setItem('user', JSON.stringify(new_user));
        }


    } catch (err) {
        console.log(err);
    }
}

const updateUser = async (seller) => {

    const user_id = user._id;
    const profile = localStorage.getItem('profile')


    const textData = {
        name: profile.name,
        location: profile.location,
        bio: profile.bio,
        isSeller: seller
    }

    try {
        const res = await axios.put(`localhost:3000/users/${user_id}`, textData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export {updateUser, handleUpdate};