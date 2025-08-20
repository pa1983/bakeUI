import type { InvoiceStatus } from "../../models/invoice.ts";

type StatusIconProps = {
    status?: InvoiceStatus;
    id: number;
};

// Define the possible status names as a specific type.
type StatusName = 'processing' | 'archived' | 'draft' | 'failed' | 'received_ok' | 'received_query' | 'validated' | 'default';

// Use the Record utility type to create a strongly-typed map.
const statusMap: Record<StatusName, string> = {
    'processing': "fa-solid fa-spinner",
    'archived': "fa-solid fa-box-archive",
    'draft': "fa-solid fa-eye",
    'failed': "fa-solid fa-triangle-exclamation",
    'received_ok': "fa-solid fa-clipboard-check",
    'received_query': "fa-solid fa-clipboard-question",
    'validated': "fa-solid fa-check",
    'default': "fa-solid fa-question"
};

const StatusIcon = ({ status, id }: StatusIconProps) => {

    // Default to the 'default' icon.
    let icon_name = statusMap['default'];

    if (status) {
        // Assert that status.name is one of the keys of our map.
        const statusName = status.name as StatusName;
        // This lookup is now type-safe.
        icon_name = statusMap[statusName] || statusMap['default'];
    }

    const statusIconClickHandler = () => {
        console.log(`status icon clicked for invoice id ${id}`);
    };

    return (
        <div title={status?.description || 'No status description'} key={status?.name || 'default'}>
            <i className={`${icon_name} fa-2x`} onClick={statusIconClickHandler}></i>
            {/* Conditionally render the display name to prevent errors if status is undefined */}
            {status && <p>{status.display_name}</p>}
        </div>
    );
};

export default StatusIcon;