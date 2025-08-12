import type {IIngredientImage} from "../../models/IIngredientImage.ts";
import '../../styles/general.css';


interface ImageListProps {
    imageLinks: IIngredientImage[]  // todo - fix this is wrong type - should nbe image klinks
    deleteImage: (id: number) => void
}

const ImageList = ({imageLinks, deleteImage}: ImageListProps) => {
    console.log("imageList rendering...");
    return (
        // Use Bulma's flexbox helpers to display the images in a neat row
            <div className="is-flex is-flex-wrap-wrap" style={{gap: '1rem'}}>
                {imageLinks.map(imageLink => (
                    // The fragment has been removed, and the key is now on the root element.
                    <figure key={imageLink.id} className="image is-128x128">
                        <img
                            src={imageLink.image.image_url}
                            alt="Product thumbnail"
                            className={'image-thumbnail'}
                            onDoubleClick={() => deleteImage(imageLink.id)}
                        />
                    </figure>
                ))}
            </div>
        );

}

export default ImageList;