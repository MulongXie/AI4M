$(document).ready(()=>{

    // *** Switch user in left-bar ***
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
            'transform': 'translateX(-37px)'
        })
        $('.user-icon-nonselect.user-icon-enquirer').css({
            'transform': 'translateX(37px)'
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
                'transform': 'translateX(-37px)'
            })
            userType = 'Expertise'
        }
        else if ($(this).hasClass('user-icon-enquirer')){
            $(this).css({
                'transform': 'translateX(37px)'
            })
            userType = 'Enquire'
        }
        $('.user-role').text(userType)
    })


    // *** Click to show the right-bar ***
    // click to show right bar conversation history
    $('#conversation-history').click(() =>{
        let right = $('#right-sidebar')
        let middle = $('#middle-page')
        // hide
        if (! right.hasClass('hidden')){
            right.animate({"margin-right": '-=270'})
            right.addClass('hidden')
            middle.animate({'width': '+=270'})
        }
        // show
        else {
            right.animate({"margin-right": '+=270'})
            right.removeClass('hidden')
            middle.animate({'width': '-=270'})
        }
    })
    // hide the right bar while clicking on the middle page
    $('#middle-page').click(function (){
        let right = $('#right-sidebar')
        let middle = $('#middle-page')
        if (! right.hasClass('hidden')){
            right.animate({"margin-right": '-=270'})
            right.addClass('hidden')
            middle.animate({'width': '+=270'})
        }
    })


    // *** conversation transmission ***
    $('#msgForm').submit(function (e){
        e.preventDefault()
        $.ajax({
            url: '/sendMsg',
            type: 'post',
            data: $(this).serialize(),
            success: function (res){
                console.log(res)
            },
            error: function (res){
                alert('Error')
                console.log(res)
            }
        })
    })
})