import Home from './pages/Home';
import Reference from './pages/Reference';
import TestSubjects from './pages/TestSubjects';
import Converter from './pages/Converter';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reference": Reference,
    "TestSubjects": TestSubjects,
    "Converter": Converter,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};