$(document).ready(()=>{

    // Slide user type while hovering
    $('.user-icon-container').hover(() =>{
        $('.user-icon-nonselect').css({
            'transform': 'translateX(40px)'
        })
        $('.user-icon-select').css({
            'box-shadow': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
        })
    }, ()=>{
        $('.user-icon-nonselect').css({
            'transform': 'translateX(-35px)'
        })
        $('.user-icon-select').css({
            'box-shadow': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
        })
    })

    // Switch user
    $('.user-icon-nonselect').click(() => {
    })

    $('#conversation-history').click(() =>{
        let right = $('#right-sidebar')
        let chat = $('#chat_container')


        if (right.is(':visible')){
            chat.addClass('col-10')
            chat.removeClass('col-8')
            right.hide()
        }
        else {
            chat.addClass('col-8')
            chat.removeClass('col-10')
            right.show()
        }
    })
})