import React, { useState } from "react";
import { LineLogin } from "reactjs-line-login";
import "reactjs-line-login/dist/index.css";

function Login() {
  const [payload, setPayload] = useState(null);
  const [idToken, setIdToken] = useState(null);
  localStorage.clear();
  return (
    <div className="bg-yellow-500 flex flex-col justify-center items-center min-h-screen text-white">
      <p className="font-sans text-7xl font-bold	">PRAWNY</p>
      <div>
        <LineLogin
          clientID="1655743694"
          clientSecret="30bc0843c7433f660f5606915a03c4e3"
          state="b41c8fd15b895f0fc28bfwb9d7da89054d931e7s"
          nonce="d78a51235f6ee189e831q9c68523cfa336917ada"
          scope="profile openid email"
          setPayload={setPayload}
          setIdToken={setIdToken}
          redirectURI="http://localhost:4000/Home"
        />
      </div>
    </div>
  );
}

export default Login;
