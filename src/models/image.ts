export interface ImageRead {
    image_id: number;
    image_url: string;
    file_name: string;
    file_ext: string;
    mime_type: string;
    file_size: number;
    alt_text: string | null;
    caption: string | null;
    created_timestamp: string;
    modified_timestamp: string;
    organisation_id: number | null;
    s3_key: string;
}