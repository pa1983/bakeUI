import type {IIngredientImage} from "../../models/IIngredientImage.ts";
import '../../styles/general.css';


interface ImageListProps {
    imageLinks: IIngredientImage[]
    deleteImage: (id: number) => void
}

const ImageList = ({imageLinks, deleteImage}: ImageListProps) => {
    console.log("imageList rendering...");
    return (
            <div className="is-flex is-flex-wrap-wrap" style={{gap: '1rem'}}>
                {imageLinks.map(imageLink => (
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