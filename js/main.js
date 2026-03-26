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
            description: $(this).data('desc')
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

})(jQuery);
