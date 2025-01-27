import React from 'react';

export const FormItem = ({ children, className = '' }) => {
    return <div className={`space-y-2 ${className}`}>{children}</div>;
};

export const FormLabel = ({ children }) => {
    return <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>;
};

export const FormMessage = ({ children }) => {
    return children ? <p className="text-sm font-medium text-red-500">{children}</p> : null;
};

export const FormControl = ({ children }) => {
    return <div className="relative">{children}</div>;
};
