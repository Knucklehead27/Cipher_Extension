const ong = document.getElementById("ongoing");
const tod = document.getElementById("today");
const upc = document.getElementById("upcoming");
const contestDetails = document.getElementById("contest-details");
const filterBtn = document.getElementById("filter-btn");
// var coll = document.querySelectorAll("collapsible");

let phase = "ongoing";
var platform = [];
var contestArray = [];
var ongoing = [];
var today = [];
var upcoming = [];
const filterUpdate = async () => {
  let resultArray = [];
  if (platform.length != 0) {
    if (phase == "ongoing") {
      await platform.forEach((plat) => {
        var add = [];
        add = ongoing.filter((contest) => contest.site == plat);
        resultArray.push(...add);
      });
    } else if (phase == "today") {
      await platform.forEach((plat) => {
        var add = [];
        add = today.filter((contest) => contest.site == plat);
        resultArray.push(...add);
      });
    } else {
      await platform.forEach((plat) => {
        var add = [];
        add = upcoming.filter((contest) => contest.site == plat);
        resultArray.push(...add);
      });
    }
  }
  return resultArray;
};
const display = async (result) => {
  let list = [];
  // console.log(result);
  contestDetails.innerHTML = ``;
  if(result.length == 0) {
    contestDetails.innerHTML = 
    `<div class="nothing">
    <img src="./images/icons8-meditation-64.png" alt="image" height="64px" width= "64px" style=" align-self:center">
      <h4 style = "text-align: center">No Worries</h4> 
    </div>`
  }
  else {
    let i = 0;
    await result.forEach((element) => {
      var contestIcon;
      if (element.site == "CodeForces") {
        contestIcon = "simple-icons:codeforces";
      } else if (element.site == "CodeChef") {
        contestIcon = "simple-icons:codechef";
      } else if (element.site == "LeetCode") {
        contestIcon = "simple-icons:leetcode";
      } else if (element.site == "HackerEarth") {
        contestIcon = "simple-icons:hackerearth";
      } else if (element.site == "HackerRank") {
        contestIcon = "cib:hackerrank";
      } else if (element.site == "KickStart") {
        contestIcon = "tabler:brand-kickstarter";
      } else if (element.site == "AtCoder") {
        contestIcon = "";
      } else if (element.site == "TopCoder") {
        contestIcon = "cib:topcoder";
      }
      const startTime = element.start_time.match(/\d\d:\d\d/);
      const endTime = element.end_time.match(/\d\d:\d\d/);

      var date = new Date(element.start_time);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      var startDate = day + "/" + month + "/" + year;

      date = new Date(element.end_time);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      var endDate = day + "/" + month + "/" + year;
      var contestName = element.name;
      contestDetails.innerHTML += `<details>
      <summary class="collapsible"  id="c_list${i}">
      <div class="row content-bar">
      <div class="col-2">
      <span
      class="iconify"
      data-icon=${contestIcon}
      style="color: #6ecaff"
      id="icon-size"
      ></span>
      </div>
      
      <div class="col-6">${contestName}</div>
      
      <div class="col-2">${startTime}</div>
      
      <div class="col-2">${startDate}</div>
      </div>
      </summary>
      <div class="content" id="info${i}">
      <div class="row">
      <div class="col-2">
      <a href=${element.url} target="blank">
      <img
      src="./assets/logo/link_icon.png"
      alt=""
      target="_blank"
      style="
      width: 30px;
      height: 30px;
      padding: 5px 5px 1px 0px;
      align-content: left;
                "
                />
                </a>
                </div>
                
                <div
                class="col-6"
                style="font-size: small; padding: 6px 0px 1px 0px"
                >
                ${startTime} - ${endTime}
                </div>
                
                <div
                class="col-4"
                style="font-size: small; padding: 6px 0px 1px 0px"
                >
                ${startDate} - ${endDate}
                </div>
                </div>
                </div>
                </details>`;

      i++;
    });
  }
  // console.log("Result", result);
};

const createPhase = async () => {
  ongoing = contestArray.filter((contest) => contest.status == "CODING");

  today = contestArray.filter(
    (contest) => contest.status == "BEFORE" && contest.in_24_hours == "Yes"
  );

  upcoming = contestArray.filter(
    (contest) => contest.status == "BEFORE" && contest.in_24_hours == "No"
  );
};

const fetchContest = async () => {
  try {
    const response = await axios.get("https://kontests.net/api/v1/all");
    contestArray = response.data;
    // console.log(contestArray);
  } catch (error) {
    alert(error);
  } 
};

$(async function () {
  $(".selectpicker").selectpicker();
  await fetchContest();
  await createPhase();
  display(ongoing);
});

filterBtn.addEventListener("click", async function () {
  getContestPlatform();
  if(platform.length>0){
    const result = await filterUpdate();
    display(result);
  }else{
    if (phase == "ongoing") {
      display(ongoing);
    } else if (phase == "today") {
      display(today);
    } else {
      display(upcoming);
    }
  }
});

document.getElementById("contest-platform").onchange = getContestPlatform();

function getContestPlatform() { 
  var platformHelper = [];
  for (var option of document.getElementById("contest-platform").options) {
    // console.log("hello");
    if (option.selected) {
      platformHelper.push(option.value);
    }
  }
  platform = platformHelper;
  // console.log("platform", platform);
  // return platform;
}

ong.addEventListener("click", async () => {
  ong.classList.add("after-click");
  tod.classList.remove("after-click");
  upc.classList.remove("after-click");
  phase = "ongoing";
  // console.log("platform", platform);
  if(platform.length==0){
    display(ongoing);
  }else{
    getContestPlatform();
    const result = await filterUpdate();
    display(result);
  }
});
tod.addEventListener("click", async () => {
  tod.classList.add("after-click");
  ong.classList.remove("after-click");
  upc.classList.remove("after-click");
  phase = "today";
  // console.log("platform", platform);
  if(platform.length==0){
    display(today);
  }else{
    getContestPlatform();
    const result = await filterUpdate();
    display(result);
  }
});
upc.addEventListener("click", async () => {
  upc.classList.add("after-click");
  tod.classList.remove("after-click");
  ong.classList.remove("after-click");
  phase = "upcoming";
  // console.log("platform", platform);
  if(platform.length==0){
    display(upcoming);
  }else{
    getContestPlatform();
    const result = await filterUpdate();
    display(result);
  }
});

