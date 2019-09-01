(function () {
    var pokemonRepository = (function () {
        var repository = [];
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=50';


        function loadList() {
            return $.ajax(apiUrl, {
                dataType: 'json'
            }).then(function (item) {
                $.each(item.results, function (_index, item) {
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
            return $.ajax(url, {
                dataType: 'json'
            }).then(function (details) {
                item.imageUrl = details.sprites.front_default;
                item.height = details.height;
                item.types = Object.keys(details.types);
            }).catch(function (e) {
                console.error(e);
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

        return {
            add: add,
            getAll: getAll,
            loadList: loadList,
            loadDetails: loadDetails,
        };
    })();


    function addListItem(pokemon) {
        $listItemElement = $('<li class="list-group-item list-group-item-action"></li>');
        $button = $('<button type="button" class="btn btn-outline-info btn-lg btn-block" data-toggle="modal" data-target="#modalContent"> ' + pokemon.name + '</button>');

        $modal = $('<div class="modal-container"></div');

        $ulElement = $('<ul></ul>');

        $(".pokemon-list").append($listItemElement);
        $("#modal-container").append($modal);
        $ulElement.append($modal);
        $listItemElement.append($button);


        //$pokemonList = $('.pokemon-list'); // this variable is never use // I leeave this comment on purpose to relearn the code and check it again
        $pokemonName = $('<h1 class="row justify-content-center" </h1>');

        $pokemonName.text(pokemon.name);

        $button.click(function () {
            showDetails(pokemon);
        });
    }

    //calling details of the pokemons
    function showDetails(item) {
        pokemonRepository.loadDetails(item).then(function () {

            //var $modalContainer = $('.modalContainer');
            $('.modalContainer').empty();

            $modal = $('<div class = "modal-body"></div>');

            $nameElement = $('<h1 class="modal-title" id="ModalLabel">' + item.name + '</h1>');

            $imageElement = $('<img class = "pokemonimage">');
            $imageElement.attr('src', item.imageUrl);

            $typesElement = $('<p>' + 'height : ' + item.height + '</p>');

            $modal.append($nameElement);
            $modal.append($imageElement);
            $modal.append($typesElement);
            $('.modalContainer').append($modal);
        });
    }

    pokemonRepository.loadList().then(function () {
        // Now the data is loaded!
        $.each(pokemonRepository.getAll(), function (_index, pokemon) {
            addListItem(pokemon);
        });
    });
})();