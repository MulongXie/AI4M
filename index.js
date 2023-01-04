$(document).ready(()=>{

    let userType = 'Enquire'
    // Slide user type while hovering
    $('.user-icon-container').hover(function (){
        $('.user-icon-nonselect.user-icon-expertise').css({
            'transform': 'translateX(40px)'
        })
        $('.user-icon-nonselect.user-icon-enquirer').css({
            'transform': 'translateX(115px)'
        })
    }, function (){
        $('.user-icon-nonselect.user-icon-expertise').css({
            'transform': 'translateX(-35px)'
        })
        $('.user-icon-nonselect.user-icon-enquirer').css({
            'transform': 'translateX(35px)'
        })
    })
    
    // Switch user
    $(document).on('click', '.user-icon-nonselect', function (){
        $('.user-icon-select').addClass('user-icon-nonselect')
        $('.user-icon-select').removeClass('user-icon-select')

        $(this).addClass('user-icon-select')
        $(this).removeClass('user-icon-nonselect')
        if ($(this).hasClass('user-icon-expertise')){
            $(this).css({
                'transform': 'translateX(-35px)'
            })
            userType = 'Expertise'
        }
        else if ($(this).hasClass('user-icon-enquirer')){
            $(this).css({
                'transform': 'translateX(35px)'
            })
            userType = 'Enquire'
        }
        $('.user-role').text(userType)
    })

    // click to show right bar conversation history
    $('#conversation-history').click(() =>{
        let right = $('#right-sidebar')
        let middle = $('#middle-page')

        if (! right.hasClass('hidden')){
            right.animate({"margin-right": '-=270'})
            right.addClass('hidden')
            middle.animate({'width': '+=270'})
        }
        else {
            right.animate({"margin-right": '+=270'})
            right.removeClass('hidden')
            middle.animate({'width': '-=270'})
        }
    })
})