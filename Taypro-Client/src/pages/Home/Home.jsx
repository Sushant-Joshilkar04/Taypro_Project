import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroImage from '../../Assets/hero.png';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to section based on hash
    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.div 
            className="bg-green-50"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <section id="home" className="pt-24 pb-12 px-4 md:px-8 lg:px-16 bg-green-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <motion.div variants={itemVariants}>
                        <motion.h1 
                            className="text-4xl md:text-5xl font-bold text-green-800 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Let TayPro Cleaning Services Brighten Your Day!
                        </motion.h1>
                        <motion.p 
                            className="mt-4 text-gray-600 max-w-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Enhancing Your Solar Power with Professional Cleaning Services. 
                            Let TayPro Brighten Your Panels and Maximize Your Energy Output!
                        </motion.p>
                        <motion.button 
                            onClick={() => navigate('/signup')}
                            className="mt-6 bg-green-800 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Get Started
                        </motion.button>
                    </motion.div>
                    <motion.div 
                        className="rounded-lg overflow-hidden shadow-xl"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <img 
                            src={HeroImage} 
                            alt="Solar panel cleaning" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 px-4 md:px-8 bg-green-50">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { number: "10+", text: "Years of Experience" },
                        { number: "5000+", text: "Cleaned & Maintained" },
                        { number: "20+", text: "Cleaning Experts" },
                        { number: "1000+", text: "Customer Satisfaction" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <motion.p 
                                className="text-3xl font-bold text-green-800"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                {stat.number}
                            </motion.p>
                            <motion.p 
                                className="text-sm text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.2 + 0.2 }}
                            >
                                {stat.text}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Advantages Section */}
            <section id="about" className="py-16 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div variants={itemVariants}>
                            <motion.h2 
                                className="text-3xl font-bold text-green-800 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Our Advantages
                            </motion.h2>
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Over a decade of experience", text: "in solar panel cleaning." },
                                    { icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Dedicated to exceeding", text: "client expectations." },
                                    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Fully licensed and insured", text: "for peace of mind." },
                                    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Honest rates, no hidden fees", text: "clear communication." }
                                ].map((advantage, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-green-50 p-5 rounded-lg"
                                        variants={cardVariants}
                                        whileHover="hover"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                    <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={advantage.icon} />
                                        </svg>
                                    </div>
                                        <h3 className="font-semibold mb-2">{advantage.title}</h3>
                                        <p className="text-sm text-gray-600">{advantage.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <motion.h2 
                                className="text-3xl font-bold text-green-800 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Our Commitment to Sustainable Energy & Environmental Stewardship.
                            </motion.h2>
                            <motion.p 
                                className="text-gray-600 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                With over a decade of experience in the industry, TayPro Cleaning Services specializes in providing top-notch cleaning solutions for solar panels.
                            </motion.p>
                            <motion.p 
                                className="text-gray-600 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                Our team of trained professionals ensures that your solar panels are cleaned thoroughly and efficiently, maximizing their energy output.
                            </motion.p>
                            <motion.button 
                                onClick={() => navigate('/login')}
                                className="bg-green-800 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                Learn More
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Energy Efficiency Section */}
            <section className="py-16 px-4 md:px-8 bg-green-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <motion.div 
                        className="rounded-lg overflow-hidden shadow-xl order-2 md:order-1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2344&q=80" 
                            alt="Solar panel cleaning process" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.div 
                        className="order-1 md:order-2"
                        variants={itemVariants}
                    >
                        <motion.h2 
                            className="text-3xl font-bold text-green-800 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Unleash Maximum Energy Efficiency
                        </motion.h2>
                        <motion.p 
                            className="text-gray-600 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Discover the transformative power of clean solar panels.
                        </motion.p>
                        {[
                            { title: "Enhanced Performance", text: "Maximize energy production for lower bills." },
                            { title: "Longevity", text: "Extend panel lifespan and safeguard your investment." },
                            { title: "Environmental Impact", text: "Reduce reliance on non-renewable energy sources." }
                        ].map((item, index) => (
                            <motion.div 
                                key={index}
                                className="mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.2 }}
                            >
                                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="py-16 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        className="text-3xl font-bold text-green-800 mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Customer Reviews
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "John D.",
                                text: "Their team was professional, thorough, and efficient. My solar panels look brand new, and I've noticed a significant improvement in energy production. Highly recommend!"
                            },
                            {
                                name: "Sarah L.",
                                text: "Not only were they friendly & knowledgeable, but their attention to detail was also impeccable. I'm looking forward to working with them again in the future!"
                            },
                            {
                                name: "Michael P.",
                                text: "They always go the extra mile to ensure customer satisfaction. I appreciate their commitment to quality and reliability. I wouldn't hesitate to recommend them!"
                            }
                        ].map((review, index) => (
                            <motion.div
                                key={index}
                                className="bg-green-50 p-6 rounded-lg shadow"
                                variants={cardVariants}
                                whileHover="hover"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.2 }}
                            >
                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                                <motion.p 
                                    className="text-gray-600 mb-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 + index * 0.2 }}
                                >
                                    {review.text}
                                </motion.p>
                                <motion.p 
                                    className="font-semibold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 + index * 0.2 }}
                                >
                                    {review.name}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 px-4 md:px-8 bg-green-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <motion.div variants={itemVariants}>
                        <motion.h2 
                            className="text-3xl font-bold text-green-800 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Have a Question? Contact Us Today!
                        </motion.h2>
                        <motion.p 
                            className="text-gray-600 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Ready to learn more about our services or schedule an appointment? Our team is here to help!
                        </motion.p>
                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="text-xl font-bold">Call Us: <span className="text-green-800">+123 456 7890</span></p>
                        </motion.div>
                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <p className="text-xl font-bold">Email: <span className="text-green-800">info@taypro.com</span></p>
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className="rounded-lg overflow-hidden shadow-xl"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <img 
                            src={HeroImage} 
                            alt="Solar panel cleaner" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;