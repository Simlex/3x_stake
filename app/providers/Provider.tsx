"use client"
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '../context/ModalContext';

type Props = {
    children?: React.ReactNode
}

const GlobalProvider = ({ children }: Props) => {
    return (
        <SessionProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </SessionProvider>
    );
};

export default GlobalProvider;