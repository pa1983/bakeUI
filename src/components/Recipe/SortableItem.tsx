import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface SortableProps {
    id: string;
    children: React.ReactNode;
}

function SortableItem(props: SortableProps ) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes}>
            <div className="is-flex is-align-items-center">
                {/* Drag Handle: Listeners are applied here only */}
                <span {...listeners} className="p-2" style={{ cursor: 'grab', touchAction: 'none' }}>
                    <i className="fas fa-grip-vertical"></i>
                </span>
                {/* The content, which now allows interaction */}
                <div className="is-flex-grow-1">
                    {props.children}
                </div>
            </div>
        </li>
    );
}
export default SortableItem;