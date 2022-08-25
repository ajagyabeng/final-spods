/*GLOBAL VARIABLES*/
var currentItem = 4; // items already displayed when page loads
var sliceStart = 4; // it must always correspond with currentItem

// ------------------FUNCTIONS---------------------------------------------------
function loadPodcastListData() {
  /* fetches podcasts from server and renders the numner of podcasts (from the parameters) to the homepage */
  fetch("/load-home-data")
    .then((data) => {
      return data.json();
    })
    .then((completedata) => {
      const episode_list = completedata.podcasts;
      createPodcastItem(episode_list);
    });
}

function createPodcastItem(data, numPodcastsToDisplay) {
  /* creates podcast item to be added to the webpage at the podcast list section */
  let episodeData = "";
  data.forEach((episode) => {
    episodeData += `<div class="podcast" data-id="${episode.id}">
          <a href="/podcast/${episode.id}" id="podcast-item">
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

  /*Return number of loaded podcasts after sorting or searching if any*/
  let podcasts = [
    ...document.querySelectorAll(
      ".content-section .podcast_main_container .podcast"
    ),
  ];
  console.log(podcasts);
  for (var i = 0; i < numPodcastsToDisplay; i++) {
    podcasts
      .slice(sliceStart, podcasts.length)
      [i].setAttribute("style", "display: contents;");
  }
}

// function appendPodcastItem(data) {
//   /* adds the items fetched from the load more button to be displayed */
//   data.forEach((episode) => {
//     const podcastNode = document.createElement("div");
//     podcastNode.classList.add("podcast");
//     const episodeData = `
//           <a href="/podcast/${episode.id}" data-id="${episode.id}" id="podcast-item">
//             <img src="${episode.img_url}" alt="" width="160px" height="160px" class="me-5" id="episode-img">
//             <div class="">
//               <p id="episode-num" class="text-size-md grey-body-text mb-0">${episode.episode}</p>
//               <h4 id="episode-title">${episode.title}</h4>
//               <p id="episode-descr" class="grey-body-text mb-0">${episode.description}</p>
//               <div class="podcast-item-bottom">
//                 <button class="listen-btn"><img src="/static/img/Vector.png" alt="" class="listen-img">LISTEN</button>
//                 <p id="episode-date" class="grey-body-text ms-3 pt-3">${episode.date_added}
//                 </p>
//               </div>
//             </div>
//           </a>
//         `;
//     const podcastContainer = document.querySelector(".podcast_main_container");
//     podcastNode.innerHTML = episodeData;
//     podcastContainer.appendChild(podcastNode);
//   });
// }

function returnNumberOfLoadedPodcasts() {
  let displayedPodcasts = document.querySelectorAll(".podcast[style]");
  let numToDisplay = 0; // number of items to display when more items have been loaded on the page
  if (displayedPodcasts.length > 0) {
    numToDisplay = displayedPodcasts.length;
    // console.log(numToDisplay);
  }
  return numToDisplay;
}

function sortPodcasts(e) {
  /* sorts podcast in descending order(newest to oldest) */
  const sortValue = e.target.getAttribute("data-sort-value");
  fetch(`/sort-podcasts?sort_by=${sortValue}`)
    .then((data) => {
      return data.json();
    })
    .then((completedata) => {
      const episode_list = completedata.podcasts;
      createPodcastItem(episode_list, returnNumberOfLoadedPodcasts());
    });
}
/*---------------------END OF FUNCTIONS-------------------------------*/

/*------------------------------ON PAGE LOAD--------------------------------*/
loadPodcastListData();

/*---------------------LOAD MORE FUNCTIONALITY-------------------------------*/
let loadMoreBtn = document.getElementById("load-more");
let loopEndValue = 0;
loadMoreBtn.addEventListener("click", () => {
  let podcasts = [
    ...document.querySelectorAll(
      ".content-section .podcast_main_container .podcast"
    ),
  ];

  /*Check for number of items left in podcasts list to set limit of the loop*/
  if (podcasts.length - currentItem >= 4) {
    loopEndValue = 4;
  } else {
    loopEndValue = podcasts.length - currentItem;
  }
  /*------------------------end of check-------------------------------*/

  for (var i = currentItem; i < currentItem + loopEndValue; i++) {
    podcasts[i].setAttribute("style", "display: contents;");
  }
  currentItem += 4;

  if (currentItem >= podcasts.length) {
    loadMoreBtn.style.display = "none";
  }
});
/*-----------------END OF LOAD MORE FUNCTIONALITY---------------------------------*/

/*-----------------------LIVE SEARCH FUNCTIONALITY-----------------------------*/
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchItem);

const search = document.querySelector('input[type="search"]');
search.addEventListener("focus", () => {
  let displayedPodcasts = document.querySelectorAll(".podcast[style]");
  // console.log(displayedPodcasts);
  var numToDisplay = 0;
  if (displayedPodcasts.length > 0) {
    numToDisplay = displayedPodcasts.length;
    // console.log(numToDisplay);
  }
});

async function searchItem(e) {
  /* fetches and displays the podcast that match the search input */
  podcastName = searchInput.value;
  console.log(podcastName);
  if (podcastName != "") {
    // check if a search keyword was entered.
    const response = await fetch(`/search?podcast=${podcastName}`);
    const data = await response.json();
    createPodcastItem(data.podcasts);
  } else {
    // check if a sort button has been selected and return podcast list in that order
    var sortButtonGroups = document.querySelectorAll(".sort-btn");
    for (i = 0; i < sortButtonGroups.length; i++) {
      if (sortButtonGroups[i].classList.contains("is-checked")) {
        const sortValue = sortButtonGroups[i].getAttribute("data-sort-value");
        fetch(`/sort-podcasts?sort_by=${sortValue}`)
          .then((data) => {
            return data.json();
          })
          .then((completedata) => {
            const episode_list = completedata.podcasts;
            createPodcastItem(episode_list, numToDisplay);
          });
      }
    }
  }
}
/*----------------------END OF LIVE SEARCH FUNCTIONALITY-----------------------------*/

/*-------------------------SORT FUNCTIONALITY----------------------------------------*/
const sortPodcastEpisodes = document.querySelector(".sort-by-button-group");
sortPodcastEpisodes.addEventListener("click", sortPodcasts);

// change is-checked class on buttons (snippet from isotope)
var buttonGroups = document.querySelectorAll(".button-group");
for (var i = 0; i < buttonGroups.length; i++) {
  buttonGroups[i].addEventListener("click", onButtonGroupClick);
}
function onButtonGroupClick(event) {
  var button = event.target;
  button.parentNode.querySelector(".is-checked").classList.remove("is-checked");
  button.classList.add("is-checked");
}
/*--------------------END OF SORT FUNCTIONALITY---------------------------*/
