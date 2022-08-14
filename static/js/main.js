// ------------------FUNCTIONS---------------------------------------------------
function loadPodcastListData(start, end) {
  /* fetches podcasts from server and renders the numner of podcasts (from the parameters) to the homepage */
  fetch("/load-home-data")
    .then((data) => {
      // console.log(data)
      return data.json();
    })
    .then((completedata) => {
      const episode_list = completedata.podcasts;
      createPodcastItem(loadPodcasts(episode_list, start, end));
    });
}

function loadMorePodcasts(start, end) {
/* function to load data for appending when load more button is clicked */
  fetch("/load-home-data")
    .then((data) => {
      // console.log(data)
      return data.json();
    })
    .then((completedata) => {
      const episode_list = completedata.podcasts;
      appendPodcastItem(loadPodcasts(episode_list, start, end));
    });
}

function loadPodcasts(data, start, end) {
  /* slices an array from start to end and return items in the array */
  return data.slice(start, end);
}

function createPodcastItem(data) {
  /* creates podcast item to be added to the webpage at the podcast list section */
  let episodeData = "";
  data.forEach((episode) => {
    episodeData += `<div class="podcast">
          <a href="/podcast/${episode.id}" data-id="${episode.id}" id="podcast-item">
            <img src="${episode.img_url}" alt="" width="160px" height="160px" class="me-5" id="episode-img">
            <div class="">
              <p id="episode-num" class="text-size-md grey-body-text mb-0">${episode.episode}</p>
              <h4 id="episode-title">${episode.title}</h4>
              <p id="episode-descr" class="grey-body-text mb-0">${episode.description}</p>
              <div class="podcast-item-bottom">
                <button class="listen-btn"><img src="/static/img/Vector.png" alt="" class="listen-img">LISTEN</button>
                <p id="episode-date" class="grey-body-text ms-3 pt-3">${episode.date_added}
                </p>
              </div>
            </div>
          </a>
        </div>`;
    document.querySelector(".podcast_main_container").innerHTML = episodeData;
  });
}

function appendPodcastItem(data) {
  /* adds the items fetched from the load more button to be displayed */
  data.forEach((episode) => {
    const podcastNode = document.createElement("div")
    podcastNode.classList.add('podcast')
    const episodeData = `
          <a href="/podcast/${episode.id}" data-id="${episode.id}" id="podcast-item">
            <img src="${episode.img_url}" alt="" width="160px" height="160px" class="me-5" id="episode-img">
            <div class="">
              <p id="episode-num" class="text-size-md grey-body-text mb-0">${episode.episode}</p>
              <h4 id="episode-title">${episode.title}</h4>
              <p id="episode-descr" class="grey-body-text mb-0">${episode.description}</p>
              <div class="podcast-item-bottom">
                <button class="listen-btn"><img src="/static/img/Vector.png" alt="" class="listen-img">LISTEN</button>
                <p id="episode-date" class="grey-body-text ms-3 pt-3">${episode.date_added}
                </p>
              </div>
            </div>
          </a>
        `;
    const podcastContainer = document.querySelector(".podcast_main_container")
    podcastNode.innerHTML = episodeData
    podcastContainer.appendChild(podcastNode)
    
  });
}

function sortPodcasts(e) {
  /* sorts podcast in descending order(newest to oldest) */
  e.preventDefault()
  // console.log(e)
  fetch('/load-newest')
    .then((data) => {
      return data.json()
    })
    .then((completedata) => {
      const episode_list = completedata.podcasts;
      createPodcastItem(loadPodcasts(episode_list, start, end))
    })
}
//-----------------------------------END OF FUNCTIONS--------------------------------------------

// Code to load more
const loadMoreBtn = document.getElementById("load-more");
let buttonClickCount = 0
let start = 0
let end = 4
loadMoreBtn.addEventListener("click", function(e) {
  buttonClickCount += 1
  if(buttonClickCount < 4) {
    start += 4
    end += 4
    loadMorePodcasts(start, end)
  }else {
    loadMorePodcasts(16, 18)
    const parent = loadMoreBtn.parentNode;
    parent.removeChild(loadMoreBtn)
  }

});

// function call is executed on page load.
loadPodcastListData(5, 9);

// Code for search function
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keyup", searchItem);

async function searchItem(e) {
  /* fetches and displays the podcast that match the search input */
  console.log(e);
  podcastName = searchInput.value;
  if (podcastName) {
    const response = await fetch(`/search?podcast=${podcastName}`);
    const data = await response.json();
    console.log(data.podcasts);
    createPodcastItem(data.podcasts);
  } else {
    loadPodcastListData(5, 9);
  }
}

// Code to sort podcast display to newest or oldest
const sortNewest = document.querySelector('.newest')
const sortOldest = document.querySelector('.oldest')
sortNewest.addEventListener('click', sortPodcasts);
sortOldest.addEventListener('click', function(e) {
  e.preventDefault()
  loadPodcastListData(0, 4);
})
