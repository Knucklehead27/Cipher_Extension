const codeEdi = document.getElementById('editor-content');
// To add more song, just copy the following code and paste inside the array

//   {
//     name: "Here is the music name",
//     artist: "Here is the artist name",
//     img: "image name here - remember img must be in .jpg formate and it's inside the images folder of this project folder",
//     src: "music name here - remember img must be in .mp3 formate and it's inside the songs folder of this project folder"
//   }

//paste it inside the array as more as you want music then you don't need to do any other thing

let allMusic = [
  {
    name: "Harley Bird - Home",
    artist: "Jordan Schor",
    img: "music-1",
    src: "music-1"
  },
  {
    name: "Ikson Anywhere – Ikson",
    artist: "Audio Library",
    img: "music-2",
    src: "music-2"
  },
  {
    name: "Beauz & Jvna - Crazy",
    artist: "Beauz & Jvna",
    img: "music-3",
    src: "music-3"
  },
  {
    name: "Hardwind - Want Me",
    artist: "Mike Archangelo",
    img: "music-4",
    src: "music-4"
  },
  {
    name: "Jim - Sun Goes Down",
    artist: "Jim Yosef x Roy",
    img: "music-5",
    src: "music-5"
  },
  {
    name: "Lost Sky - Vision NCS",
    artist: "NCS Release",
    img: "music-6",
    src: "music-6"
  },
  // like this paste it and remember to give comma after ending of this bracket }
  // {
  //   name: "Here is the music name",
  //   artist: "Here is the artist name",
  //   img: "image name here - remember img must be in .jpg formate and it's inside the images folder of this project folder",
  //   src: "music name here - remember img must be in .mp3 formate and it's inside the songs folder of this project folder"
  // }
];


function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
// var option = ["hello", "why"];
/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/

const fetchlist = async ()=>{
  try {
    await axios.get("https://algo-extension.herokuapp.com/algoList").then(function (response) {
      let option = response.data.list;
      // console.log(option);
      autocomplete(document.getElementById("myInput"), option);
    });
    // console.log(contestArray);
  } catch (error) {
    alert(error);
  }
}

const editorDisplay = (res)=>{
  // console.log(win);
  if(res.length>0){
    codeEdi.innerHTML = ``;
  }
  codeEdi.innerHTML += `<div class="carousel-item active">
    <div class="window" id="container1">
      <div class="window-header">
        <div class="action-buttons d-flex algo-header">
          <img src="./images/ink-96.png" class="Link">
          <p style="color:black">Algo Name</p>
          <img src="./images/icons8-copy-96.png" onclick="toDashboard()" class="copy"></div>
          <span id="custom-tooltip">copied!</sapn>
      </div>
      <div class="window-body">
        <textarea class="code-input" id="dataToCopy" readonly>
  ${res[0]}</textarea
        >
      </div>
    </div>
  </div>`;
  
  for(let i = 1; i<res.length; i++){
    codeEdi.innerHTML += `<div class="carousel-item">
    <div class="window" id="container1">
      <div class="window-header">
        <div class="action-buttons d-flex algo-header">
          <img src="./images/ink-96.png" class="Link" >
          <p style="color:black">Algo Name</p>
          <img src="./images/icons8-copy-96.png" onclick="toDashboard()" class="copy">
          <span id="custom-tooltip">copied!</sapn>
        </div>
      </div>
      <div class="window-body">
        <textarea class="code-input" id="dataToCopy" readonly>
  ${res[i]}</textarea
        >
      </div>
    </div>
  </div>`
  }
}
$(async function () {
  $(".selectpicker").selectpicker();
  await fetchlist();
  let arr = [];
  codeEdi.innerHTML = `<div class="carousel-item active">
  <div class="window" id="container1">
    <div class="window-header">
      <div class="action-buttons"></div>
    </div>
    <div class="window-body">
      <textarea class="code-input" readonly>
Search for any algorithm in the search bar 
       and if you want to contribute to our open source then please click on contribute button.</textarea
      >
    </div>
  </div>
</div>`
  // editorDisplay(arr);
  // console.log(codeEdi);
});


const bringCode = async ()=>{
  // console.log("here");
  const val = document.getElementById("myInput").value;
  if(val!=""){
    await axios.get(`https://algo-extension.herokuapp.com/algo/?filter=${val}`).then(function (response) {
        let res = response.data.algoArray;
        editorDisplay(res);
      });
    }
}
document.getElementById("submitBtn").addEventListener("click", ()=>{
  bringCode();
})

function toDashboard(){
  console.log("Working");

  let content = document.getElementById("dataToCopy");
  content.select();
  document.execCommand("copy");
  document.getElementById("custom-tooltip").style.display = "inline";
    document.execCommand("copy");
    setTimeout( function() {
        document.getElementById("custom-tooltip").style.display = "none";
    }, 1000);

}