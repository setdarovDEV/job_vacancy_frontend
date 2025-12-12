// src/pages/ProfilePage.jsx
import React from "react";
import ProfilePageMobile from "../components/mobile/ProfileMobilePage";
import ProfilePageTablet from "../components/tablet/ProfileTabletPage";
import ProfilePageDesktop from "./ProfilePageDesktop.jsx";

export default function ProfilePage() {
    return (
        <>
            {/* Mobile (default) */}
            <div className="block md:hidden">
                <ProfilePageMobile />
            </div>

            {/* Tablet (md:lg) */}
            <div className="hidden md:block lg:hidden">
                <ProfilePageTablet />
            </div>

            {/* Desktop (lg:) */}
            <div className="hidden lg:block">
                <ProfilePageDesktop />
            </div>
        </>
    );
}