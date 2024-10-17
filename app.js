const searchApiEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const randomApiEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const lookupApiEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

document.addEventListener('DOMContentLoaded', loadRandomCocktails);
document.getElementById('search-btn').addEventListener('click', searchCocktail);
document.getElementById('closeModal').addEventListener('click', closeModal)

function openModal() {
    const modal = document.getElementById('cocktailModal');
    modal.classList.remove('hidden'); // Show the modal
}

function closeModal() {
    const modal = document.getElementById('cocktailModal');
    modal.classList.add('hidden'); // Hide the modal
}


        async function loadRandomCocktails() {
            const cocktails = [];

            for (let i = 0; i < 12; i++) {
                try {
                    const response = await fetch(randomApiEndpoint);
                    const data = await response.json();
                    if (data.drinks) {
                        cocktails.push(data.drinks[0]);
                    }
                } catch (error) {
                    console.error('Error fetching random cocktail:', error);
                }
            }
            displayCocktails(cocktails);
        }

        // Search cocktails based on user input
        async function searchCocktail() {
            const query = document.getElementById('searchInput').value.trim();
            if (query === '') {
                alert('Please enter a search term!');
                return;
            }

            try {
                const response = await fetch(`${searchApiEndpoint}${query}`);
                const data = await response.json();
                if (data.drinks) {
                    displayCocktails(data.drinks);
                } else {
                    document.getElementById('cocktail-list').innerHTML = '';
                    document.getElementById('noCocktail').style.display = 'block';
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
        // Function to fetch a cocktail recipe by its ID
function fetchCocktailRecipe(cocktailId) {
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.drinks && data.drinks.length > 0) {
                const cocktail = data.drinks[0];
                displayRecipeModal(cocktail);  // Pass the cocktail data to display in the modal
            } else {
                console.error('No cocktail found');
            }
        })
        .catch(error => {
            console.error('Error fetching cocktail recipe:', error);
        });
}


        // Display cocktails in the UI
        function displayCocktails(cocktails) {
            document.getElementById('noCocktail').style.display = 'none';
            const cocktailList = document.getElementById('cocktail-list');
            cocktailList.innerHTML = '';

            cocktails.forEach(cocktail => {
                const cocktailDiv = document.createElement('div');
                cocktailDiv.classList.add('meal-box', 'border', 'border-gray-700', 'rounded-xl');

                cocktailDiv.innerHTML = `
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="rounded h-[200px] w-full object-cover" />
                    <div class="p-3">
                        <h2 class="heading text-lg font-bold">${cocktail.strDrink}</h2>
                        <p class="tags my-3"><span>${cocktail.strCategory || 'No Category'}</span>, <span>${cocktail.strAlcoholic}</span></p>
                        <button class="btn bg-orange-400" onclick="fetchCocktailRecipe(${cocktail.idDrink})">View Full Recipe</button>
                    </div>
                `;

                cocktailList.appendChild(cocktailDiv);
            });
        }

        // Fetch and display the full recipe of a cocktail
// Function to extract ingredients and their measurements
        function getIngredients(cocktail) {
          const ingredients = [];
          
          // Loop over 15 possible ingredients
          for (let i = 1; i <= 15; i++) {
               const ingredient = cocktail[`strIngredient${i}`];
               const measure = cocktail[`strMeasure${i}`];
               
               // If the ingredient exists, add it to the ingredients array
               if (ingredient) {
                    ingredients.push(`${measure ? measure : ''} ${ingredient}`);
               }
          }
          
          return ingredients;
          }


        // Display the recipe details in a modal
// Function to display the recipe modal
     // Function to display the recipe modal
function displayRecipeModal(cocktailData) {
    const titleElement = document.getElementById('modal-title');
    const bodyElement = document.getElementById('modal-body');
    
    // Set the title and body content
    titleElement.textContent = cocktailData.strDrink;
    bodyElement.innerHTML = `
        <img src="${cocktailData.strDrinkThumb}" alt="Cocktail Image" class="w-32 h-32 object-cover mx-auto mb-4">
        <p>${cocktailData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>${getIngredients(cocktailData)}</ul>
    `;
    
    openModal(); // Call to show the modal
}
