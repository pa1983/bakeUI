const StatusIcon = ({status, id}) => {

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

    const statusIconClickHandler = () => {
        console.log(`status icon clicked for invoice id ${id}`)
        //todo -trigger a new component to display a list of status options;
        // update the database if a new status is selected
        // change the currently displayed status to match the newly selected status
    }


    return (
        //  todo - pass in onhover text to explain meaning of statuses
        // todo - implement a method of clicking on the icon to show a list of options to pick, with the currently selected status highlighted.  clicking a new one changes the processing status of the invoice id passed in.
        <div title={status.description} key={status.name}>
            <i className={`${icon_name} fa-2x`} onClick={statusIconClickHandler}></i>
            <p>{status.display_name}</p>
        </div>
    )
}

export default StatusIcon;