$(document).ready(()=>{

    let userSelect = $('.user-icon-select')
    let userNonSelect = $('.user-icon-nonselect')
    // Slide user type while hovering
    $('.user-icon-container').hover(() =>{
        userNonSelect.css({
            'transform': 'translateX(40px)'
        })
        userSelect.css({
            'box-shadow': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
        })
    }, ()=>{
        userNonSelect.css({
            'transform': 'translateX(-35px)'
        })
        userSelect.css({
            'box-shadow': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
        })
    })

    // Switch user


})