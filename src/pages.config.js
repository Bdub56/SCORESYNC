import Home from './pages/Home';
import Reference from './pages/Reference';
import TestSubjects from './pages/TestSubjects';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reference": Reference,
    "TestSubjects": TestSubjects,
}

export const pagesConfig = {
    mainPage: "TestSubjects",
    Pages: PAGES,
    Layout: __Layout,
};