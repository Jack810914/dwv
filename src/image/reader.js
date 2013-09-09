//! @namespace Main DWV namespace.
var dwv = dwv || {};
//! @namespace Image related.
dwv.image = dwv.image || {};

/**
 * Get data from an input image using a canvas.
 * @param image The image.
 * @param file The corresponding file.
 */
dwv.image.getDataFromImage = function(image)
{
    // draw the image in the canvas in order to get its data
    var canvas = document.getElementById('imageLayer');
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // get the image data
    var imageData = ctx.getImageData(0, 0, image.width, image.height);
    // remove alpha
    // TODO support passing the full image data
    var buffer = [];
    var j = 0;
    for( var i = 0; i < imageData.data.length; i+=4 ) {
        buffer[j] = imageData.data[i];
        buffer[j+1] = imageData.data[i+1];
        buffer[j+2] = imageData.data[i+2];
        j+=3;
    }
    // create dwv Image
    var imageSize = new dwv.image.Size(image.width, image.height);
    // TODO: wrong info...
    var imageSpacing = new dwv.image.Spacing(1,1);
    var sliceIndex = image.index ? image.index : 0;
    var dwvImage = new dwv.image.Image(imageSize, imageSpacing, buffer, [[0,0,sliceIndex]]);
    dwvImage.setPhotometricInterpretation("RGB");
    // view
    var view = new dwv.image.View(dwvImage);
    view.setWindowLevelMinMax();
    // properties
    var info = {};
    if( image.file )
    {
        info.fileName = { "value": image.file.name };
        info.fileType = { "value": image.file.type };
        info.fileLastModifiedDate = { "value": image.file.lastModifiedDate };
    }
    info.imageWidth = { "value": image.width };
    info.imageHeight = { "value": image.height };
    // return
    return {"view": view, "info": info};
};

/**
 * Get data from an input buffer using a DICOM parser.
 * @param buffer The input data buffer.
 */
dwv.image.getDataFromDicomBuffer = function(buffer)
{
    // DICOM parser
    var dicomParser = new dwv.dicom.DicomParser();
    // parse the buffer
    dicomParser.parse(buffer);
    var view = dicomParser.createImage();
    // return
    return {"view": view, "info": dicomParser.dicomElements};
};

