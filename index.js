$(document).ready(()=>{
    // *** Switch user ***
    $('.user-icon-container').hover(() =>{
        $('.user-icon-nonselect').css({
            'transform': 'translateX(40px)'
        })
    }, ()=>{
        $('.user-icon-nonselect').css({
            'transform': 'translateX(-35px)'
        })
    })


})