image_count = 0; // tracks the number of images on the screen

images = ['images/zebra.jpg', 'images/bird.jpg', 'images/cat.jpg', 'images/squirrel.jpg']

function add_image() {
    const image = document.getElementById('image1');
    image.src = images[image_count];
    
    image_count++; // update image count

    // update div displays
    if (image_count == 1) {
        document.getElementById('one').style.display = 'block';
    }
    if (image_count >= 2 && image_count <= 4) {
        document.getElementById('one').style.display = 'none';
        document.getElementById('two').style.display = 'block';
    }
}

function remove_image() {
    alert('Not implemented yet');
}