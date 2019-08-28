//Master Branch_ // https://github.com/gunt/Jquery_code_pokedex
(function () {
    var pokemonRepository = (function () {
        var repository = [];
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=50';


        // Ajax method jQuery
        function loadList() {
            return $.ajax(apiUrl, {dataType:'json'}).then(function (item) {
                $.each(item.results, function (index, item) {
                    var pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            }).catch(function (e) {
                console.error(e);
            });
        }

        function loadDetails(item) {
            var url = item.detailsUrl;
            return $.ajax(url, {dataType:'json'}).then(function (details) {
                // Now we add the details to the item
                item.imageUrl = details.sprites.front_default;
                item.height = details.height;
                item.types = Object.keys(details.types);
            }).catch(function (e) {
                console.error(e);
            });
        }

        // if not an object // not display
        function add(pokemon) {
            repository.push(pokemon);
            // if (typeof repository === 'object') {
            //     repository.push(pokemon)
            // } else {
            //     console.error('Is not an Object');
            // }
        }

        function getAll() {
            return repository;
        }

        return {
            add: add,
            getAll: getAll,
            loadList: loadList,
            loadDetails: loadDetails,
        };
    })();

    function showModal(item) {
        var $modalContainer = $('.modal-container');
        $modalContainer.empty();
        
        $modal = $('<div class = "modal-body"></div>');

        $nameElement = $('<h1 class="modal-title" id="ModalLabel">' + item.name + '</h1>');

        // pokemon image class fixed it - not recognize pokemon as item
        $imageElement = $('<img class = "pokemonimage">');
        $imageElement.attr('src', item.imageUrl);

        $typesElement = $('<p>' + 'height : ' + item.height + '</p>');

        //appending 
        // $modal.append($closeButtonElement);
        $modal.append($nameElement);
        $modal.append($imageElement);
        $modal.append($typesElement);
        $modalContainer.append($modal);
        // $modalContainer.addClass('is-visible');
    }

    function addListItem(pokemon) {
        $listItemElement = $('<div class="pokemon-list__item"></div>');
        $pokemonList = $('.pokemon-list');
        $pokemonName = $('<span></span>');
        $button = $('<button type ="button" class= "btn btn-primary" data-toggle="modal" data-target="#modalContent"</button>');

        // Append
        $listItemElement.append($button);
        $listItemElement.append($pokemonName);
        $pokemonName.text(pokemon.name);
        $pokemonList.append($listItemElement);
        $button.on('click', function () {
            showDetails(pokemon);
        });
    }

    //calling details of the pokemons
    function showDetails(item) {
        pokemonRepository.loadDetails(item).then(function () {
            //displays details in a modal
            showModal(item);
        });
    }


    //clearing all existing modal content  // jQuery major attention on classes

    


    pokemonRepository.loadList().then(function () {
        // Now the data is loaded!
        $.each(pokemonRepository.getAll(), function (index, pokemon) {
            addListItem(pokemon);
        });
    });
})();