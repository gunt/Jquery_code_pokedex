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

        // function addListItem pokemon //button // append
        function addListItem(pokemon) {
            var $listItemElement = $('<listItemElement class = "pokemon-list__item">' + '<li>');
            $('ul').append($listItemElement);

            // !important/ atention to learn purpose // caused major confusion in structure index.html review
            var $button = $(
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

        //clearing all existing modal content  // jQuery major attention on classes
        function showModal(item) {
            var $modalContainer = $('#modal-container');

            //$ ('#modal-container').on('showMOdal', function(item){

            //$('modalContainer').on('click', function (event) {


            //$('#modal-container').on('click', function (event) {
            $modalContainer.text('');
            var $modal = $('<div class = "modal">');

            //close button
            var $closeButtonElement = $(
                '<button class = "modal-close"> Close </button>'
            );
            $closeButtonElement.on('click', hideModal);

            var $nameElement = $('<h1>' + item.name + '</h1>');

            // pokemon image class fixed it - not recognize pokemon as item
            var $imageElement = $('<img class = "pokemonimage">');
            $imageElement.attr('src', item.imageUrl);


            var $typesElement = $('<p>' + 'height : ' + item.height + '</p>');

            //appending 
            $modal.append($closeButtonElement);
            $modal.append($nameElement);
            $modal.append($imageElement);
            $modal.append($typesElement);
            $modalContainer.append($modal);
            $modalContainer.addClass('is-visible'); //class
        }


        //$('.notification').addClass('bright-red').delay(300).removeClass('bright-red')
        // Use the syntax $.fn.myFunction=function(){}

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


        $(document).ready(function(){
            $.fn.myFunction = function(){ 
                alert('You have successfully defined the function!'); 
            }
            $(".call-btn").click(function(){
                $.fn.myFunction();
            });
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