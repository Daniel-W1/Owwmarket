import axios from "axios";

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

    } catch (err) {
        console.log(err);
    }
}

export default handleUpdate;