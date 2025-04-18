"use client"
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '../context/ModalContext';
import { AuthProvider } from '../context/AuthContext';

type Props = {
    children?: React.ReactNode
}

const GlobalProvider = ({ children }: Props) => {
    return (
        <AuthProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AuthProvider>
    );
};

export default GlobalProvider;