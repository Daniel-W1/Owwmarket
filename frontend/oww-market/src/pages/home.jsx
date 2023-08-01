function Home() {
    const googleAuth = () => {
      window.open(`http://localhost:3000/auth/google/`, "_self");
    };
  
    const userdata = localStorage.getItem("user");
    let user = null;
    if (userdata) {
      user = JSON.parse(userdata);
    }

    return (
      <>
       <h1>Hello {user ? user.name : "World"}</h1>
       {!user && (
        <button onClick={googleAuth} className="bg-green-600 p-2 border rounded-lg text-white">Google Auth</button>
       )}
      </>
    );
  }
  
  export default Home;