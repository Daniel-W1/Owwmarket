import axios from 'axios';

async function EmailPasswordLogin (email, password)  {
    const Headers = {
        'Content-Type': 'application/json',
    }

    try {
        const res = await axios.post('http://localhost:3000/auth/signin', {
            email,
            password
        }  , {
            headers: Headers
            });
        
        if (res.data.success === true) {
            const profile = await axios.get(`http://localhost:3000/profile/of/${res.data.user._id}`);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("profile", JSON.stringify(profile.data.profile));
            window.location.href = "/dashboard";
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

export default EmailPasswordLogin;


