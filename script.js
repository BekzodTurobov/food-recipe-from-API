"use strict";

const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

const selected = document.querySelector(".selected");
const selectCategory = document.querySelector(".select-category");
const downBtn = document.querySelector(".down-icon");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

// EVENT LISTENERS
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
selectCategory.addEventListener("click", openCategoryList);
optionsContainer.addEventListener("click", selectFoodCategory);
document.addEventListener("click", openSelectOption);

recipeCloseBtn.addEventListener("click", () =>
  mealDetailsContent.parentElement.classList.remove("showRecipe")
);
// ////////////////////////////////////
// HANDLE KEYDOWN

document.addEventListener("keydown", function (e) {
  if (
    e.key === "Enter" &&
    document.querySelector(".search-control").value.trim()
  ) {
    getMealList();
  }

  if (
    e.key === "Escape" &&
    mealDetailsContent.parentElement.classList.contains("showRecipe")
  ) {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
  }
});
// /////////////////////////////////////////
// LOAD SPINNER
const loader = document.createElement("div");

function showSpinner() {
  loader.innerHTML = `<div class="loader"><div></div><div></div><div></div><div></div></div>`;

  document.body.insertAdjacentHTML("afterbegin", loader.innerHTML);
}

function hideSpinner() {
  document.body.firstElementChild.remove();
}
// OR👇 (PS:inlude CSS part)

// function showSpinner() {
//   loader.className = "loader";
//   document.body.prepend(loader);
// }

// function hideSpinner() {
//   loader.remove();
// }

// showSpinner();
// window.addEventListener("load", () => {
//   hideSpinner();
// });
// ////////////////////////////////////////
// MAIN FUNCTIONS (FETCH API)

// ///////////////////////////////////////
// GET MEAL LIST
function getMealList() {
  let searchInputTxt = document.querySelector(".search-control").value.trim();

  showSpinner();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      renderList(data);
      hideSpinner();
    });

  selected.innerHTML = "Select food category";
  document.querySelector(".search-control").value = "";
}

// ///////////////////////////////////////
// GET MEAL RECIPE
function getMealRecipe(e) {
  e.preventDefault();

  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;

    showSpinner();
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        mealRecipeModal(data.meals);
        hideSpinner();
      });
  }
}

// ///////////////////////////////////////
// MEAL RECIPE MODAL
function mealRecipeModal(meal) {
  meal = meal[0];
  let html = `<h2 class = "recipe-title">${meal.strMeal}</h2>
  <p class = "recipe-category">${meal.strCategory}</p>
  <div class = "recipe-instruct">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    
  </div>
  <div class = "recipe-meal-img">
    <img src = "${meal.strMealThumb}" alt = "">
  </div>
  <div class = "recipe-link">
    <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
  </div>`;

  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

// ////////////////////////////////////////
// OPEN CATEGORY LIST

function openCategoryList() {
  // showSpinner();

  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((res) => res.json())
    .then((data) => {
      // hideSpinner();

      let html = "";
      if (data.categories) {
        data.categories.forEach((category) => {
          html += ` <div class="option">
          <div class="category" data-id="${category.strCategory}">${category.strCategory}</div>
          </div> `;
        });
        //
      }
      optionsContainer.innerHTML = html;
    });
}

// ////////////////////////////////////////
// SELECT THE CATEGORY

function selectFoodCategory(e) {
  const foodCategory = e.target.dataset.id;

  if (e.target.classList.contains("category")) {
    showSpinner();

    fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${foodCategory}`
    )
      .then((res) => res.json())
      .then((data) => {
        renderList(data);
        hideSpinner();
      });

    selected.innerHTML = foodCategory;
  }
}

// ///////////////////////////////////////
// RENDER FOOD LIST
function renderList(data) {
  let html = "";
  if (data.meals) {
    data.meals.forEach((meal) => {
      html += ` 
                <div class = "meal-item" data-id = "${meal.idMeal}">
                    <div class = "meal-img">
                        <img src = "${meal.strMealThumb}" alt = "food">
                    </div>
                    <div class = "meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href = "#" class = "recipe-btn">Get Recipe</a>
                    </div>
                </div>`;
    });
    mealList.classList.remove("notFound");
  } else {
    html = "Sorry, we didn't find any meal!";
    mealList.classList.add("notFound");
  }

  mealList.innerHTML = html;
}

// ////////////////////////////////////
// OPEN SELECT BOX

function openSelectOption(e) {
  if (e.target.closest(".select-category")) {
    optionsContainer.classList.toggle("active");
    downBtn.classList.toggle("up");
  } else if (!e.target.closest(".select-category")) {
    optionsContainer.classList.remove("active");
    downBtn.classList.remove("up");
  }
}

optionsList.forEach((o) => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
    downBtn.classList.remove("up");
  });
});
