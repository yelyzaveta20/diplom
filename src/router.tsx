import {createBrowserRouter, Navigate} from "react-router-dom";
import {MainLayout} from "./layout";
import {InformationsPage} from "./pages/InformationsPage";
import {RecordPage} from "./pages/RecordPage";
import {ConfirmationPage} from "./pages/ConfirmationPage";
import {RegisterPage} from "./pages/RegisterPage";
import {LoginPage} from "./pages/LoginPage";
import {Admin} from "./components/Admin";
import {RecordAuth} from "./components/recordAuth/recordAuth";
import {useState} from "react";
import {DonorPage} from "./pages/DonorPage";
import {RecordAuthPage} from "./pages/RecordAuthPage";
import {RegistrationDonationPage} from "./pages/RegistrationDonationPage";


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
                path:'/record-auth/:id_registration', element:<RecordAuthPage/>
            },
            {
                path:'login', element:<LoginPage />
            },
            {
                path:'register', element:<RegisterPage/>
            },
            {
                path:'admin', element:<Admin/>
            },
            {
                path:'/donor/:id_registration', element:<DonorPage/>
            },
            {
            path:'/registration-donation/:id_registration', element:<RegistrationDonationPage/>
            }
        ]
    }
])
export {router}