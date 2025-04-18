import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-green-50 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="mx-auto mb-4"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray="314"
            strokeDashoffset="0"
            animate={{
              strokeDashoffset: [0, 314],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-green-800"
          />
          <motion.path
            d="M60 10 L60 110"
            stroke="currentColor"
            strokeWidth="4"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-green-600"
          />
        </motion.svg>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-green-800"
        >
          TayPro Cleaning Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-600 mt-2"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader; 