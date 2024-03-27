import {createBrowserRouter, Navigate} from "react-router-dom";
import {MainLayout} from "./layout";
import {InformationsPage} from "./pages/InformationsPage";
import {RecordPage} from "./pages/RecordPage";
import {ConfirmationPage} from "./pages/ConfirmationPage";
import {RegisterPage} from "./pages/RegisterPage";
import {LoginPage} from "./pages/LoginPage";


const router=createBrowserRouter([
    {
        path:'', element:<MainLayout/> , children:[
            {
                index:true, element:<Navigate to={'informations'}/>
            },
            {
                path:'informations', element: <InformationsPage/>
            },
            {
                path:'confirmation', element:<ConfirmationPage/>
            },
            {
                path:'record', element:<RecordPage/>
            },
            {
                path:'login', element:<LoginPage/>
            },
            {
                path:'register', element:<RegisterPage/>
            }
        ]
    }
])
export {router}