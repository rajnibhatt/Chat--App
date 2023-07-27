import React from "react";
import { Redirect } from "react-router";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../Context/Profile.Context";
import { Container, Loader } from "rsuite";

const PrivateRoute = ({children, ...routeProps}) =>{
    const {profile, isLoading} = useProfile();
    if(isLoading && !profile){
        return <Container>
            <Loader center vertical size="md" content="loading" speed="slow">
                
            </Loader>
        </Container>
    }
    if(!profile && !isLoading){
        return <Redirect to="/SignIn"></Redirect>
    }
    return <Route {...routeProps}>{children}</Route>;
}

export default PrivateRoute;