import { Dispatch, FunctionComponent, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

// Define the type for the context data
export type ModalContextData = {
    loginModalVisibility: boolean;
    setLoginModalVisibility: Dispatch<SetStateAction<boolean>>
    signupModalVisibility: boolean;
    setSignupModalVisibility: Dispatch<SetStateAction<boolean>>
};

// Create a context with the specified data type
const ModalContext = createContext<ModalContextData | undefined>(undefined);

// Create a provider component that takes children as props
type ModalProviderProps = {
    children: ReactNode;
};

const ModalProvider: FunctionComponent<ModalProviderProps> = ({ children }) => {

    const [loginModalVisibility, setLoginModalVisibility] = useState(false);
    const [signupModalVisibility, setSignupModalVisibility] = useState(false);

    // Define the values you want to share
    const sharedData: ModalContextData = {
        loginModalVisibility,
        setLoginModalVisibility,
        signupModalVisibility,
        setSignupModalVisibility
    };

    return (
        <ModalContext.Provider value={sharedData}>
            {children}
        </ModalContext.Provider>
    );
};

export { ModalProvider, ModalContext };

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModalContext must be used within an AppProvider");
    }
    return context;
}