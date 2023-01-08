$(document).ready(()=>{

    // *** Switch user in left-bar ***
    let userType = 'Enquirer'
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
            userType = 'Enquirer'
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
    // input message
    $('#msgForm').submit(function (e){
        // * display the input message in the conversation wrapper
        let currentDialog = $('.conversation-dialog').last()
        let convWrapper = $('.conversation-wrapper')
        let msgInput = $('#msgInput')
        // if send from the same user, append message in current dialog
        if (currentDialog.attr('data-role') === userType){
            currentDialog.find('.dialog-msg-wrapper').append('<p class="dialog-msg">'+ msgInput.val() +"</p>")
        }
        // else create a new dialog
        else{
            let dialog =
                "<div class=\"conversation-dialog dialog-" + userType.toLowerCase() + "\" data-role=\"" + userType + "\">\n" +
                "    <div class=\"dialog-portrait\">\n" +
                "        <img src=\"images/" + userType.toLowerCase() + ".jpg\" class=\"dialog-portrait-img\">\n" +
                "        <p class=\"dialog-portrait-name\">" + userType + "</p>\n" +
                "    </div>\n" +
                "    <div class=\"dialog-msg-wrapper\">\n" +
                "        <p class=\"dialog-msg\">" + msgInput.val() + "</p>\n" +
                "    </div>\n" +
                "</div>"
            convWrapper.append(dialog)
        }
        convWrapper.animate({
            scrollTop: convWrapper.prop('scrollHeight')
        }, 500)

        // * send input message to server through ajax
        e.preventDefault()
        $.ajax({
            url: '/sendMsg',
            type: 'post',
            data:{
                'user': userType,
                'message': msgInput.val()
            },
            success: function (res){
                msgInput.val('')
            },
            error: function (res){
                alert('Error')
                console.log(res)
            }
        })
    })

    // export conversation
    $('#conversation-export').click(function (){
        // extract user and messages
        let convWrapper = $('.conversation-wrapper')
        let conversation = []  // [{'user':, 'message':[]}]
        for (let i = 0; i < convWrapper.children().length; i++){
            let dialogWrapper = $(convWrapper.children()[i])
            let messageWrapper = dialogWrapper.find('.dialog-msg')
            let dialog = {'user': dialogWrapper.attr('data-role'), 'message':[]}
            for (let j = 0; j < messageWrapper.length; j ++){
                dialog.message.push($(messageWrapper[j]).text())
            }
            conversation.push(dialog)
        }
        console.log(conversation)

        // write down into json file and download
        $.ajax({
            url: '/exportConv',
            type: 'post',
            data: {
                'conversation': JSON.stringify(conversation)
            },
            success: function (res){
                // download json file
                let link=document.createElement('a');
                link.href = res.jsonFile.substr(res.jsonFile.lastIndexOf('/') + 1)
                link.download = res.jsonFile.substr(res.jsonFile.lastIndexOf('/') + 1)
                link.click()
            },
            error: function (res){
                alert('Error')
                console.log(res)
            }
        })
    })
})