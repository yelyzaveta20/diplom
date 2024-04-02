
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {AuthProvider} from "./constans/AuthContext";



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
    </AuthProvider>



);


