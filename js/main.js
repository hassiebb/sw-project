(function ($) {
    "use strict";

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.navbar-market').addClass('shadow-sm').css('background', 'rgba(255, 255, 255, 0.95)');
        } else {
            $('.navbar-market').removeClass('shadow-sm').css('background', 'rgba(255, 255, 255, 0.85)');
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'swing');
        return false;
    });

    // Reveal Animations
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };
    window.addEventListener('scroll', reveal);
    reveal(); // Initial check

    // Marketplace Interaction: Store Selected Pet
    $(document).on('click', '.pet-detail-link', function(e) {
        // Prevent clicking if it's the heart button
        if($(e.target).closest('.love-btn').length) return;

        const petData = {
            name: $(this).data('name'),
            type: $(this).data('type'),
            age: $(this).data('age'),
            breed: $(this).data('breed'),
            description: $(this).data('desc'),
            image: $(this).find('img').attr('src')
        };
        
        localStorage.setItem('selectedPet', JSON.stringify(petData));
        window.location.href = 'pet-details.html';
    });

    // Favorite/Love Toggle
    $(document).on('click', '.love-btn', function(e) {
        e.preventDefault();
        const icon = $(this).find('i');
        icon.toggleClass('far fas').toggleClass('text-accent text-danger');
        
        // Simple animation feedback
        $(this).css('transform', 'scale(1.3)');
        setTimeout(() => $(this).css('transform', 'scale(1)'), 200);
    });

    // Adoption Form Persistence
    if(window.location.pathname.includes('Adoption.html')) {
        const selectedPet = JSON.parse(localStorage.getItem('selectedPet'));
        if(selectedPet) {
            $('#pet_name').val(selectedPet.name);
            $('#animal_type').val(selectedPet.type);
        }
    }

    // Global Pagination State
    let currentPage = 1;
    const itemsPerPage = 6;

    // Marketplace Filtering & Pagination Logic
    function filterPets() {
        const selectedTypes = $('input[id^="type-"]:checked').map(function() {
            return this.id.replace('type-', '').toLowerCase();
        }).get();
        
        const activeAgeRadio = $('input[name="age"]:checked');
        const selectedAge = activeAgeRadio.length ? activeAgeRadio.attr('id').replace('age-', '') : 'all';

        // 1. Determine which items match the filters
        const matchingPets = $('.pet-item').filter(function() {
            const petCard = $(this).find('.card-market');
            const petType = (petCard.data('type') || '').toLowerCase();
            const petAgeGroup = petCard.data('age-group') || '';

            const typeMatch = selectedTypes.length === 0 || 
                             selectedTypes.includes(petType) || 
                             (selectedTypes.includes('other') && !['dog', 'cat', 'bird'].includes(petType));
            
            const ageMatch = selectedAge === 'all' || petAgeGroup === selectedAge;

            return typeMatch && ageMatch;
        });

        // 2. Hide all items and reveal matches based on pagination
        $('.pet-item').hide();
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        matchingPets.slice(startIndex, endIndex).show().addClass('reveal active');

        // 3. Update results count
        $('.text-muted b').first().text(matchingPets.length);

        // 4. Render Pagination UI
        renderPagination(matchingPets.length);
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const $pagination = $('#marketPagination');
        $pagination.empty();

        if (totalPages <= 1) return;

        // Previous
        $pagination.append(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a>
        </li>`);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            $pagination.append(`<li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`);
        }

        // Next
        $pagination.append(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a>
        </li>`);
    }

    // Pagination Click Handler
    $(document).on('click', '#marketPagination .page-link', function(e) {
        e.preventDefault();
        const newPage = parseInt($(this).data('page'));
        if (newPage && !$(this).parent().hasClass('disabled')) {
            currentPage = newPage;
            filterPets();
            $('html, body').animate({
                scrollTop: $("#petMarketGrid").offset().top - 100
            }, 600);
        }
    });

    // Apply Filters Click
    $(document).on('click', '#applyFilters', function() {
        currentPage = 1; // Reset to page 1 on new filter
        filterPets();
        if($(window).width() < 992) {
            $('html, body').animate({
                scrollTop: $("#petMarketGrid").offset().top - 100
            }, 800);
        }
    });

    // Clear Filters Click
    $(document).on('click', '#clearFilters', function() {
        $('input[id^="type-"]').prop('checked', false);
        $('#age-all').prop('checked', true);
        currentPage = 1;
        filterPets();
    });

    $(document).ready(function() {
        if(window.location.pathname.includes('pets.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const type = urlParams.get('type');
            if(type) {
                // Ensure we uncheck defaults first
                $('input[id^="type-"]').prop('checked', false);
                // singular support
                const singularType = type.endsWith('s') ? type.slice(0, -1) : type;
                $(`#type-${singularType}`).prop('checked', true);
            }
            setTimeout(filterPets, 100);
        }
    });

})(jQuery);
