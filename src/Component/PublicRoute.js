import React from "react";
import { Redirect } from "react-router";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { useProfile } from "../Context/Profile.Context";
import { Container, Loader } from "rsuite";

const PublicRoute = ({children, ...routeProps}) =>{
    const {profile,isLoading} = useProfile();
    if(isLoading && !profile){
        return <Container>
            <Loader center vertical size="md" content="Loading" speed="slow">

            </Loader>
        </Container>

    }
    if(profile && !isLoading){
        return <Redirect to="/"></Redirect>
    }
    return(
        <Route {...routeProps}>
            {children}
        </Route>
    );
}
export default PublicRoute;
