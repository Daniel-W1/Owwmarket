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
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            window.location.href = "/profile/of/" + res.data.user._id;
        }
    } catch (error) {
        console.log(error);
    }
}

export default EmailPasswordLogin;


