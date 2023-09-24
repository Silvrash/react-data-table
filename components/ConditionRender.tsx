import React from "react";
import { Separator } from "./ui/separator";
import { TableCaption } from "./ui/table";

export interface RenderProps {
    renderIf?: boolean;
    children?: React.ReactNode;
}
export type ConditionRenderProps<T = Record<string, any>> = T & RenderProps;

// eslint-disable-next-line @typescript-eslint/ban-types
function ConditionRender<P extends {}>(Component: React.ComponentType<P>) {
    return function _ConditionRender({ renderIf = true, ...props }: ConditionRenderProps<P>) {
        if (!renderIf) return null;
        return <Component {...(props as P)} />;
    };
}

export const ConditionRenderComponent: React.FC<RenderProps> = ({ renderIf = true, children }) => {
    if (!renderIf) return null;
    return <>{children}</>;
};

ConditionRender.TableCaption = ConditionRender(TableCaption);
ConditionRender.Separator = ConditionRender(Separator);
export default ConditionRender;
