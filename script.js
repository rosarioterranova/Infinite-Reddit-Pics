const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
let api_url = "https://www.reddit.com/r/pics/top/.json?limit=20"
let pics = [];
let fetching = false

// Create Img Node and Add to DOM
function displayPics() {
  pics.forEach(photo => {
    const item = document.createElement('a');
    const img = document.createElement('img');
    img.setAttribute("src", photo)
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Reddit Listing API https://www.reddit.com/dev/api/
const getImages = async() =>{
  try {
    loader.hidden = false
    fetching = true
    const result = await fetch(api_url)
    const data = await result.json()
    const children = data.data.children

    pics.length = 0
    children.forEach(child =>{
      if(child.data.url && (child.data.url.endsWith(".png") || child.data.url.endsWith(".jpg"))){
        pics.push(child.data.url)
      }
    })
    loader.hidden = true
    displayPics()

    api_url += `&after=${data.data.after}` //scroll next page
    fetching = false
  } catch (error) {
    console.warn(error)
  }
} 

// Check to see if scrolling near bottom of page, Load More Pics
window.addEventListener('scroll', () => {
  if (!fetching && window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
    getImages();
  }
});

getImages();