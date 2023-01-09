$(document).ready(()=>{
    // *** Left-bar ***
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
    // clear conversation
    $('#conversation-clear').click(function (){
        $('.conversation-wrapper').empty('')
    })
    // tool tips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
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
            currentDialog.find('.dialog-msg-wrapper').append(addMessage(msgInput.val()))
        }
        // else create a new dialog
        else{
            convWrapper.append(addDialog(userType, msgInput.val()))
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

    // import conversation Json
    $('#importInput').change(function (event){
        alert('Import successfully')
        let reader = new FileReader()
        reader.onload = function (e){
            // read the uploaded file
            let dialogs = JSON.parse(JSON.parse(e.target.result).conversation)  //[{'user':, 'message':[]}]
            console.log(dialogs)
            // load the dialogs to the page
            let convWrapper = $('.conversation-wrapper')
            convWrapper.empty()
            for (let i = 0; i < dialogs.length; i++){
                let dialog = dialogs[i]
                convWrapper.append(addDialog(dialog.user, dialog.message[0]))
                for (let j = 1; j < dialog.message.length; j ++){
                    $('.dialog-msg-wrapper').last().append(addMessage(dialog.message[j]))
                }
            }
        }
        reader.readAsText(event.target.files[0])
        $(this).val('')
    })


    // *** Dialog rendering ***
    function addMessage(msg){
        return '<p class="dialog-msg">'+ msg +"</p>"
    }
    function addDialog(user, msg){
        return "<div class=\"conversation-dialog dialog-" + user.toLowerCase() + "\" data-role=\"" + user + "\">\n" +
            "    <div class=\"dialog-portrait\">\n" +
            "        <img src=\"images/" + user.toLowerCase() + ".jpg\" class=\"dialog-portrait-img\">\n" +
            "        <p class=\"dialog-portrait-name\">" + user + "</p>\n" +
            "    </div>\n" +
            "    <div class=\"dialog-msg-wrapper\">\n" +
            "        <p class=\"dialog-msg\">" + msg + "</p>\n" +
            "    </div>\n" +
            "</div>"
    }
})