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
        
        console.log(res.data, 'the data');
        
        if (res.data.success === true) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            window.location.href = "/dashboard";
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

export default EmailPasswordLogin;


