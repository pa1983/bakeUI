import {formatRelative, parseISO} from 'date-fns';

interface PropsFriendlyDate {
    date: string
    classname: string
}

const FriendlyDate = ({date, classname}:PropsFriendlyDate) => {
    const dateObject = parseISO(date);
    const formattedDate = formatRelative(dateObject, new Date());

    return (
        <time dateTime={dateObject.toISOString()} className={classname}>
            {formattedDate}
        </time>

    )
}

export default FriendlyDate;
