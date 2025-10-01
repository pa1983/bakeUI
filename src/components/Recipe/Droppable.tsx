import React from 'react';
import {useDroppable} from '@dnd-kit/core';

interface DroppableProps {
    droppableId: string;
    children: React.ReactNode;
}

const Droppable = (props: DroppableProps) => {
    const {isOver, setNodeRef} = useDroppable({
        id: props.droppableId,
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
};

export default Droppable;