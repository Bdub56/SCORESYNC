import Home from './pages/Home';
import Reference from './pages/Reference';
import TestSubjects from './pages/TestSubjects';
import Converter from './pages/Converter';
import ActivityLog from './pages/ActivityLog';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Reference": Reference,
    "TestSubjects": TestSubjects,
    "Converter": Converter,
    "ActivityLog": ActivityLog,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};