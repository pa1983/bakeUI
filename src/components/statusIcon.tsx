const StatusIcon = ({status}) => {

    const statusMap = {
        'processing': "fa-solid fa-spinner",
        'archived': "fa-solid fa-box-archive",
        'draft': "fa-solid fa-eye",
        'failed': "fa-solid fa-triangle-exclamation",
        'received_ok': "fa-solid fa-clipboard-check",
        'received_query': "fa-solid fa-clipboard-question",
        'validated': "fa-solid fa-check",
        'default': "fa-solid fa-questione"
    };
    const icon_name = statusMap[status.name] || statusMap['default'];


    return (
        //  todo - pass in onhover text to explain meaning of statuses
        // todo - pass in invoice ID to allow for changing the status
        <div title={status.description} key={status.name}>
            <i className={`${icon_name} fa-2x`}></i>
            <p>{status.display_name}</p>
        </div>
    )
}

export default StatusIcon;