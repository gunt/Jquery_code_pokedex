//Master Branch_ // https://github.com/gunt/Jquery_code_pokedex
(function () {
    var pokemonRepository = (function () {
        var repository = [];
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=50';


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
            }).catch(function (e) {
                console.error(e);
            });
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


        // if not an object // not display
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

        function addListItem(pokemon) {
            $listItemElement = $('<listItemElement class = "pokemon-list__item">' + '<li>');
            $('ul').append($listItemElement);

            // !important/ atention to learn purpose // caused major confusion in structure index.html review
            $button = $(
                '<button class = "button">' + pokemon.name + '</button>'
            );

            $listItemElement.append($button);
            $button.on('click', function () {
                showDetails(pokemon);
            });
        }

        //calling details of the pokemons
        function showDetails(pokemon) {
            pokemonRepository.loadDetails(pokemon).then(function () {
                //displays details in a modal
                showModal(pokemon);
            });
        }


        

        

        
//clearing all existing modal content  // jQuery major attention on classes

        function showModal(item) {
            var $modalContainer =

            $('#modal-container').text('');
            $modal = $('<div class = "modal">');

            //close button
            $closeButtonElement = $('<button class = "modal-close"> Close </button>');
            $closeButtonElement.on('click', hideModal);

            $nameElement = $('<h1>' + item.name + '</h1>');

            // pokemon image class fixed it - not recognize pokemon as item
            $imageElement = $('<img class = "pokemonimage">');
            $imageElement.attr('src', item.imageUrl);

            $typesElement = $('<p>' + 'height : ' + item.height + '</p>');

            //appending 
            $modal.append($closeButtonElement);
            $modal.append($nameElement);
            $modal.append($imageElement);
            $modal.append($typesElement);
            $modalContainer.append($modal);
            $modalContainer.addClass('is-visible'); 
        }

        function hideModal() {
            $('#modal-container').removeClass('is-visible');
        }

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape' && $('#modal-container').hasClass('is-visible')) {
                hideModal();
            }
        });

        // $('#modal-container').on('click', function (event) {

        $('#modal-container').on('click', function (event) {
            if ($(event.target).closest('#modal-container').length) {
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
        };
    })();

    pokemonRepository.loadList().then(function () {
        // Now the data is loaded!
        pokemonRepository.getAll().forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    });
})();