import React from 'react';

type AvatarProps = {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
};

const Avatar: React.FC<AvatarProps> = ({ imageUrl, name, size = 'md' }) => {
    const initials = "U";

    const sizeClasses = {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
    };
    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={`Avatar používateľa ${name}`}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-blue-100 shadow-sm`}
            />
            );
    }
    return (
        <div
        className={`${sizeClasses[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-blue-100`}
        >
        {initials}
        </div>
    );
};

export default Avatar;