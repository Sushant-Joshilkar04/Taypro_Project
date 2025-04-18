import React from "react";

const Footer = () => (
    <footer className="w-full bg-green-800 text-white py-6">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold">TayPro</h3>
                    <p className="text-sm mt-1">Solar panel cleaning and maintenance services</p>
                </div>
                <div className="text-center md:text-right">
                    <p>&copy; {new Date().getFullYear()} TayPro. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
