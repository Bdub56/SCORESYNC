import Home from './pages/Home';
import Reference from './pages/Reference';
import TestSubjects from './pages/TestSubjects';
import Landing from './pages/Landing';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reference": Reference,
    "TestSubjects": TestSubjects,
    "Landing": Landing,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};