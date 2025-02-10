import React from "react";
import { useLocation } from "react-router-dom";
import GridEditor from "../../components/GridEditor";

const LayoutSetup = () => {
    const location = useLocation();
    const { state } = location;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light-green-50">
            <h1 className="text-2xl font-bold text-light-green-600">
                {state?.mode === "update" ? "Edit Your Layout" : "Configure Your Layout"}
            </h1>
            {/* Pass state as props to GridEditor */}
            <GridEditor
                mode={state?.mode || "create"}
                initialLayout={state || null}
            />
        </div>
    );
};

export default LayoutSetup;
