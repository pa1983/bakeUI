import useAlert from "../../contexts/CustomAlertContext.tsx"

function MoreInfo({message}) {
    // todo - add a default prop for type == info, use to colour an icon in the message.
    // allow danger, warning, info - change the icon displayed and colour to allow more descriptive info display
    const {showAlert} = useAlert();
    const moreInfo = (event) => {
        // when element is clicked for more info, display a modal containing the description text.
        // todo  Maybe get working from hover rather than click?

        const description: string = event.currentTarget.title;
        console.log(description);
        showAlert(description);
    }

    return (
        <i onClick={moreInfo} className="fa-solid fa-circle-question"
           title={message}></i>
    )
}
export default MoreInfo;