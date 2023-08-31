import axios from 'axios';

async function EmailPasswordSignup (name, email, password)  {
    const Headers = {
        'Content-Type': 'application/json',
    }
    try {
        const res = await axios.post('http://localhost:3000/auth/signup', {
            name: name,
            email: email,
            password: password,
        }  , {
            headers: Headers
        });
        
        if (res.data.success === true) {
            window.location.href = `/login?success=true&message=${res.data.message}`   
        }
    } catch (error) {
        return error.response.data;
    }
}

export default EmailPasswordSignup;


