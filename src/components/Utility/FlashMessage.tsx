import {useFlashState} from '../../contexts/FlashContext.tsx';
import styles from '../../styles/FlashMessage.module.css';

export const FlashMessage = () => {
    const {message, type, visible} = useFlashState();

    if (!visible) {
        return null;
    }

    return (
        <div className={styles.flashContainer}>
            <div className={`notification is-${type} `}>
                {message}
            </div>
        </div>
    );

};