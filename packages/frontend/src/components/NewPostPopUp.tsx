import React, { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

interface PopupProps {
    onClose: () => void;
    children: React.ReactNode;
}

function NewPostPopUp({ onClose, children }: PopupProps) {
    return (
        <div>
            <Button
                onClick={onClose}
                bg="#37371f"
                fontWeight="bold"
                marginX="2"
                marginY="2"
                >
                    Cancel
            </Button>
            {children}
        </div>
    )
};

export default NewPostPopUp;