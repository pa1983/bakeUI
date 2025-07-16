import React from 'react';
import {formatRelative, parseISO} from 'date-fns';

const FriendlyDate = ({date, classname}) => {
    const dateObject = typeof date === 'string' ? parseISO(date) : date;
    const formattedDate = formatRelative(dateObject, new Date());

    return (
        <time dateTime={dateObject.toISOString()} className={classname}>
            {formattedDate}
        </time>

    )
}

export default FriendlyDate;
