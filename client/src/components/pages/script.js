window.onload = () => {
  const photo = document.getElementById("photo");
  const background = document.querySelector(".background");

  photo.onload = () => {
    const photoWidth = photo.offsetWidth;
    const photoHeight = photo.offsetHeight;

    // Adjust the background size based on the photo size
    background.style.width = `${photoWidth * 1.2}px`; // 20% larger
    background.style.height = `${photoHeight * 1.2}px`;
  };
};
