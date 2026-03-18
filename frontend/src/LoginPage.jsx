import React, { useState, useId, useEffect, useActionState } from "react"
import { Link, Navigate, useNavigate} from "react-router"
import { MainLayout } from "./MainLayout.jsx";
import "./LoginPage.css";

export function LoginPage({ needToReg, setToken }) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();
    const emailInputId = React.useId();
    const isRegistering = needToReg;
    const navigate = useNavigate();

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
          const email = formData.get("email");
          const username = formData.get("username");
          const password = formData.get("password");

          let response=null

          try {
              response = await fetch(
                  isRegistering ? "/api/users" : "/api/auth/tokens",
                  { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({email, password, username}) }
                  );
              if (!response.ok) {
                if (response.status === 409) {
                    return "Username taken, please choose a different username or sign in";
                }
                if (response.status === 401) {
                    return "That username / password combination does not exist";
                }
                if (response.status === 400) {
                    return "Please fill out all required fields.";
                }
                return `Error: HTTP ${response.status} ${response.statusText}`;
            }

              const result = await response.json(); //parses to JSON
              setToken(result.token);
              navigate("/")
              return null
          } catch (error) {
              return(error.message)
          }
          return null
        },
        null
    );

    return (
        <div>
            {isRegistering ? <h2>Register a new account</h2> : <h2>Login</h2>}
            {result && <p role="alert">{result}</p>}

            <form className="LoginPage-form" action={submitAction}>

                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} required name="username" disabled={isPending}/>

                {isRegistering &&
                    <div>
                        <label htmlFor={emailInputId}>Email</label>
                        <input id={emailInputId} required name="email" disabled={isPending}/>
                    </div>
                }

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" required  name="password" disabled={isPending}/>

                <input type="submit" value="Submit" disabled={isPending}/>
            </form>

            {isRegistering ? (
                <p> Already have an account? <Link to="/login">Login here</Link></p>
            ) : (
                <p> Don't have an account? <Link to="/register">Register here</Link></p>
            ) }


        </div>
    );
}
