
var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';


    // Ajax method jQuery
    function loadList() {
        return $.ajax(apiUrl).then(function (response) {
            response.results.forEach(function (item) {
                var pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function(e) {
            console.error(e);
        });
    }

    function addListItem(pokemon) {
        //creates li element in DOM

        var $listItemElement = $('<listItemElement class = "pokemon-list__item">' + '<li>');
    
        // chooses ul element & appends it in ul
        $('ul').append($listItemElement);
    
        //creates button element in DOM ,add class to it & pokemon name
        var $button = $(
          '<button class = "button">' + pokemon.name + '</button>'
        );
    
        //appends button to website as a child of li
        $listItemElement.append($button);
    
        //executes showDetails function if button is clicked
        $button.on('click', function() {
          showDetails(pokemon);
        });
      }
    
      //loads details for each pokemon by clicking on the button
      function showDetails(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function() {
          //displays details in a modal
          showModal(pokemon);
        });
      }

    function add(pokemon) {
        if (typeof repository === 'object') {
            repository.push(pokemon)
        } else {
            console.error('Is not an Object');
        }

    }

    function getAll() {
        return repository;
    }

    function loadDetails(pokemon) {
        var url = pokemon.detailsUrl;
        return $.ajax(url).then(function (response) {
            // Now we add the details to the item
            pokemon.imageUrl = response.sprites.front_default;
            pokemon.height = response.height;
            pokemon.types = Object.keys(response.types);
        }).catch(function (e) {
            console.error(e);
        });
    }

    function showModal(item) {
        var $modalContainer = $('#modal-container');
    
        //clearing all existing modal content
        $modalContainer.text('');
    
        //creating div element in DOM & adding class to div DOM element
        var $modal = $('<div class = "modal">');
    
        //close button
        var $closeButtonElement = $(
          '<button class = "modal-close"> Close </button>'
        );
    
        //event listener //close button
        $closeButtonElement.on('click', hideModal);
    
        var $nameElement = $('<h1>' + item.name + '</h1>');
    
        // adding image to modal container
        var $imageElement = $('<img class = "pokemonimage">');
        $imageElement.attr('src', item.imageUrl);
    
        // height detail
        var $typesElement = $('<p>' + 'height : ' + item.height + '</p>');
    
        //appending 
        $modal.append($closeButtonElement);
        $modal.append($nameElement);
        $modal.append($imageElement);
        $modal.append($typesElement);
        $modalContainer.append($modal);
        $modalContainer.addClass('is-visible');  //class
      }

    function hideModal() {
        var $modalContainer = $('#modal-container');
        $modalContainer.removeClass('is-visible');
    }


    window.addEventListener('keydown', (e) => {
        var $modalContainer = $('#modal-container');
        if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
            hideModal();
        }
    });


    // var closestElement = element.closest(selectors);

    var $modalContainer = $('#modal-container');
    $modalContainer.on('click', function(event){
        // Since this is also triggered when clicking INSIDE the modal container,
        // We only want to close if the user clicks directly on the overlay
        //var target = e.target;
        if ($(event.target).closest ('#modal-container').length) {
            hideModal();
        }
    });

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
        hideModal: hideModal
        //not neccersary temporary for the next task
    };
})();

pokemonRepository.loadList().then(function() {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
