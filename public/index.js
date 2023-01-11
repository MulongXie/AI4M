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
    // archive conversation
    $('#conversation-archive').click(function (){
        let convID = $('.conversation-wrapper').attr('id')
        // save to backend
        $.ajax({
            url: '/saveConv',
            type: 'post',
            data: {
                'id': convID,
                'user': userType,
                'conversation': JSON.stringify(extractConversationText())
            },
            success: function (res){
                // if no associated card for the conversation add a new card
                if ($('.conversation-card[data-conv-target="#' + convID +'"]').length === 0){
                    addConvCard()
                }
                showRightBar()
            },
            error: function (res){
                alert('Error')
                console.log(res)
            }
        })
    })


    // *** Right-bar ***
    // click to show right bar conversation history
    function showRightBar(){
        let right = $('#right-sidebar')
        let middle = $('#middle-page')
        if (!right.hasClass('hidden')){
            return
        }
        right.animate({"margin-right": '+=270'})
        right.removeClass('hidden')
        middle.animate({'width': '-=270'})
    }
    function hideRightBar(){
        let right = $('#right-sidebar')
        let middle = $('#middle-page')
        right.animate({"margin-right": '-=270'})
        right.addClass('hidden')
        middle.animate({'width': '+=270'})

    }
    function addConvCard(){
        // add conversation card in the right-side bar
        let conversation = extractConversationText()
        $('#right-sidebar').append(generateConvCard(conversation, $('.conversation-wrapper').attr('id')))
        $('.card-remove').click(function (){
            $(this).parents().closest('.conversation-card').remove()
        })
    }
    $('#conversation-history').click(() =>{
        // hide
        if (!$('#right-sidebar').hasClass('hidden')){
            hideRightBar()
        }
        // show
        else {
            showRightBar()
        }
    })
    // hide the right bar while clicking on the middle page
    $('#middle-page').click(function (){
        let right = $('#right-sidebar')
        if (! right.hasClass('hidden')){
            right.animate({"margin-right": '-=270'})
            right.addClass('hidden')
            $(this).animate({'width': '+=270'})
        }
    })
    $('.card-remove').click(function (){
        $(this).parents().closest('.conversation-card').remove()
        console.log($(this).parents().closest('.conversation-card'))
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
    function extractConversationText(){
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
        return conversation
    }
    $('#conversation-export').click(function (){
        // write down into json file and download
        $.ajax({
            url: '/saveConv',
            type: 'post',
            data: {
                'id': $('.conversation-wrapper').attr('id'),
                'user': userType,
                'conversation': JSON.stringify(extractConversationText())
            },
            success: function (res){
                // download json file
                let filePath = res.jsonFile.replace(/\\/g, '/')
                filePath = filePath.substr(filePath.lastIndexOf('/') + 1)
                let link=document.createElement('a');
                console.log(filePath)
                link.href = filePath
                link.download = filePath
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
    // middle page
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
    // right-side bar
    function generateConvCard(conversation, convID){
        console.log(conversation)
        let title = conversation[0].message
        let user = conversation[0].user
        let content = conversation[1].message
        return '<div class="conversation-card" data-conv-target="#' + convID + '">\n' +
            '    <div class="go-corner">\n' +
            '        <div class="card-remove">\n' +
            '            x\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <p class="con-card-title">' + title + '</p>\n' +
            '    <p class="con-card-subtitle">' + user + '</p>\n' +
            '    <p class="con-card-content">' + content + '</p>\n' +
            '</div>'
    }
})