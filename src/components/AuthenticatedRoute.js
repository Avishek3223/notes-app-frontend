import React from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
export default function AuthenticatedRoute({ children, ...rest }) {
    const { pathname, search } = useLocation();
    const { isAuthenticated } = useAppContext();
    return (
        <Route {...rest}>
            {isAuthenticated ? (
                children
            ) : (
                <Navigate to={
                    `/login?redirect=${pathname}${search}`
                } />
            )}
        </Route>
    );
}
