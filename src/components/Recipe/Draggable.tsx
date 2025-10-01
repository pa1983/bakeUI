import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

// Within your component that receives `transform` from `useDraggable`:


interface DraggableProps {
    id: string;
    children: React.ReactNode;
}

const Draggable = (props: DraggableProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    }
    // above is a helper function from @dnd-kit/utilities to autmatically convert the transform object to a CSS transform string
    // const style = transform
    //     ? {
    //         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    //     }
    //     : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
};

export default Draggable;