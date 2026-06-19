// utils/prepareImagesForApi.ts

type ImageInput = {
    file?: File | null;
    serverId?: number;
    color?: string | null;
    is_blur?: boolean | number;
    markedForDelete?: boolean;
};


export function prepareImagesForApi(images: ImageInput[]) {
    const formData = new FormData();

    let newIndex = 0;

    images.forEach((img) => {
        // حذف
        if (img.markedForDelete && img.serverId) {
            formData.append("old_images_to_delete[]", img.serverId.toString());
            return;
        }

        // صورة جديدة
        if (img.file) {
            formData.append(`images[${newIndex}][file]`, img.file);

            if (img.color) {
                formData.append(`images[${newIndex}][color]`, img.color);
            }

            formData.append(
                `images[${newIndex}][is_blur]`,
                img.is_blur ? "1" : "0"
            );

            newIndex++;
            return;
        }

        // تعديل صورة قديمة
        if (img.serverId) {
            formData.append(
                `image_updates[${img.serverId}][id]`,
                img.serverId.toString()
            );

            formData.append(
                `image_updates[${img.serverId}][color]`,
                img.color || ""
            );

            formData.append(
                `image_updates[${img.serverId}][is_blur]`,
                img.is_blur ? "1" : "0"
            );
        }
    });

    return formData;
}