$(document).ready(()=>{
    const questions = ["What is your role on the AI4M project?",
        "Which industry sector is your AI4M project targeted at?",
        "Which business areas does your AI4M project target?",
        "What types of AI system are you developing?"]

    const options = [["Lead", "Technician", "Consultant", "Client"],
        ["Health", "Mining", "Mining", "Law", "Finance", "Agribusiness", "Cyber Security", "Education", "Defence", "Infrastructure", "Manufacturing", "R&D or Innovation", "Environment"],
        ["Accounting and finance", "Customer service", "Human resources", "IT", "Legal, risk and compliance", "Supply chain", "Marketing", "Research and development", "Sales", "Strategy", "Other"],
        ["Recognition systems", "Language processing", "Automated decision making", "Recommender systems", "Computer vision", "Other"]]

    // ***********
    // Initial loading
    // ***********
    createNewConvWrapper()
    loadAllConvToCards()


    // ***********
    // Left-bar
    // ***********
    // tool tips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    // Slide user type while hovering
    let userType = 'Enquirer'
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
    function toggleExpertisePage(slideDelay=300){
        let chatPage = $('.chat-page')
        let expertisePage = $('.enquires-page-expertise')
        if (expertisePage.is(':visible')){
            expertisePage.slideUp(slideDelay)
            setTimeout(()=>{chatPage.slideDown()}, slideDelay)
        }
        else{
            chatPage.slideUp(slideDelay)
            setTimeout(()=>{expertisePage.slideDown()}, slideDelay)
        }
    }
    function toggleLeftOpts(slideDelay=300){
        let optEnquirer = $('.opts-enquirer')
        let optExpertise = $('.opts-expertise')
        if (optExpertise.is(':visible')){
            optExpertise.slideUp(slideDelay)
            setTimeout(()=>{optEnquirer.slideDown()}, slideDelay)
        }
        else{
            optEnquirer.slideUp(slideDelay)
            setTimeout(()=>{optExpertise.slideDown()}, slideDelay)
        }
    }
    $(document).on('click', '.user-icon-nonselect', function (){
        // switch user icon on the left nav bar
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
        // switch user page
        toggleExpertisePage(300)
        toggleLeftOpts(300)
    })
    // new conversation
    $('#conversation-new').click(function (){
        archiveConversation(true)
    })
    $('#check-enquire').click(function (){
        $('.chat-page').slideUp(300)
        setTimeout(()=>{$('.enquires-page-expertise').slideDown()}, 300)
    })
    // import conversation from file
    $('#importInput').change(function (event){
        alert('Import successfully')
        let reader = new FileReader()
        reader.onload = function (e){
            // read the uploaded file
            let conversation = JSON.parse(JSON.parse(e.target.result).conversation)  //[{'user':, 'message':[]}]
            loadConvInWrapper(conversation)
        }
        reader.readAsText(event.target.files[0])
        $(this).val('')
    })


    // ***********
    // Right-bar
    // ***********
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


    // ***********
    // conversation card
    // ***********
    // remove card and delete conversation file on the backend
    $(document).on('click', '.card-remove', function (){
        let card = $(this).parents().closest('.conversation-card')
        $.ajax({
            url: '/removeConv',
            type: 'post',
            data: {
                id: card.attr('data-conv-target')
            },
            success:function (){
                card.remove()
            },
            error: function (res){
                alert('Error when deleting conversation')
                console.log(res)
            }
        })
    })
    // stop firing the parent's onclick while clicking on the child element
    $(document).on('click', '.conversation-card .card-remove', function (e){
        e.stopPropagation()
    })
    // click the conv card to fetch the conversation
    $(document).on('click', '.conversation-card', function (){
        $.ajax({
            url: '/readConv',
            type: 'post',
            data: {
                'id': $(this).attr('data-conv-target'),
                'user': userType,
                'conversation': JSON.stringify(extractConversationText())
            },
            success: function (res){
                // @res: {conversation:[{user:, message:[]}], id:, user:}
                generateConversationWrap(res)
                // hide the expertise page
                if(userType === 'Expertise'){
                    $('.enquires-page-expertise').slideUp(300)
                    setTimeout(()=>{$('.chat-page').slideDown()}, 300)
                }
                $('.input-wrapper').slideDown('fast')
            },
            error: function (res){
                alert('Error')
                console.log(res)
            }
        })
    })
    // load all conversations stored on the backend to cards
    function loadAllConvToCards(){
        $.ajax({
            url: '/loadAllConv',
            type: 'post',
            success: function (res){
                // @ res.conv: [{id:'conv-1234', user:, conversation:[]}]
                res.convs.forEach(function (conv){
                    generateConvCard(JSON.parse(conv.conversation), conv.id)
                })
            },
            error: function (res){
                alert('Error while loading conversation to cards')
                console.log(res)
            }
        })
    }


    // ***********
    // conversation transmission
    // ***********
    // input message
    $('#msgForm').submit(function (e){
        // * display the input message in the conversation wrapper
        let currentDialog = $('.conversation-dialog').last()
        let convWrapper = $('.conversation-wrapper')
        let msgInput = $('#msgInput')
        // if send from the same user, append message in current dialog
        if (currentDialog.attr('data-role') === userType){
            currentDialog.find('.dialog-msg-wrapper').append(generateMessage(msgInput.val()))
        }
        // else create a new dialog
        else{
            convWrapper.append(generateDialog(userType, msgInput.val()))
        }
        convWrapper.animate({
            scrollTop: convWrapper.prop('scrollHeight')
        }, 500)
        // wait for response
        let message = msgInput.val()
        msgInput.val('')
        msgInput.attr('disabled','disabled')

        // * send input message to server through ajax
        e.preventDefault()
        $.ajax({
            url: '/sendMsg',
            type: 'post',
            data:{
                'user': userType,
                'message': message
            },
            success: function (res){
                if (res.code === -1){
                    alert("Connection to Server Error")
                }
                else {
                    // add the answer to the webpage
                    convWrapper.append(generateDialog('Expertise', res.answer))
                    convWrapper.animate({
                        scrollTop: convWrapper.prop('scrollHeight')
                    }, 500)

                    // update the conversation file on the backend
                    $.ajax({
                        url: '/saveConv',
                        type: 'post',
                        data: {
                            'id': convWrapper.attr('id'),
                            'user': userType,
                            'conversation': JSON.stringify(extractConversationText())
                        },
                        success: function (res){
                            generateConvCard(extractConversationText(), $('.conversation-wrapper').attr('id'))
                        },
                        error: function (res){
                            alert('Error in updating backend file')
                            console.log(res)
                        }
                    })
                }
                msgInput.removeAttr('disabled')
            },
            error: function (res){
                alert('Error in sending message')
                console.log(res)
                msgInput.removeAttr('disabled')
            }
        })
    })
    // export conversation
    $('.conversation-export').click(function (){
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
    // archive conversation
    function archiveConversation(updateConvWrapper=false){
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
                if ($('.conversation-card[data-conv-target="' + convID +'"]').length === 0){
                    // if successfully add card, show the right side bar
                    generateConvCard(extractConversationText(), $('.conversation-wrapper').attr('id'))
                }
                showRightBar()
                if (updateConvWrapper){
                    createNewConvWrapper()
                }
            },
            error: function (res){
                alert('Error')
                console.log(res)
            }
        })
    }


    // ***********
    // conversation content
    // ***********
    // load and present the conversation on the middle page convWrapper
    // @param conversation: {'questions':[{'q':, 'a':}], 'dialogs':[{'user':, 'message':[]}]}
    function loadConvInWrapper(conversation){
        // load the dialogs to the page
        let convWrapper = $('.conversation-wrapper')
        convWrapper.empty()
        for (let i = 0; i < conversation.length; i++){
            let dialog = conversation[i]
            convWrapper.append(generateDialog(dialog.user, dialog.message[0]))
            for (let j = 1; j < dialog.message.length; j ++){
                $('.dialog-msg-wrapper').last().append(generateMessage(dialog.message[j]))
            }
        }
    }
    // extract the pre-questions and the user dialogs as json data
    // @return conversation: {'questions':[{'q':, 'a':}], 'dialogs':[{'user':, 'message':[]}]}
    function extractConversationText(){
        // console.log({'question':extractPreQuestions(), 'dialogs':[extractDialogs()]})
        return  {'questions':extractPreQuestions(), 'dialogs':extractDialogs()}
    }
    // extract the pre-questions as json data
    // @return questions: {'questions':[{'q':, 'a':}]}
    function extractPreQuestions(){
        let questions = []
        let questionWrapper = $('.dialog-question>.dialog-msg-wrapper')
        let questionElements = questionWrapper.find('.msg-question')
        for (let i = 0; i < questionElements.length; i++){
            let question = $(questionElements[i])
            let options = $('[data-question-target=' + question.attr('id') + ']')
            let selectedOption = options.find('.option-active')
            if (selectedOption.length > 0){
                questions.push({'q':question.text(), 'a':selectedOption.text()})
            }
        }
        return questions
    }
    // extract the user dialogs as json data
    // @return questions: {'dialogs':[{'user':, 'message':[]}]}
    function extractDialogs(){
        let dialogs = []
        let convWrapper = $('.conversation-wrapper')
        for (let i = 1; i < convWrapper.children().length; i++){
            let dialogWrapper = $(convWrapper.children()[i])
            let message = dialogWrapper.find('.dialog-msg')
            let dialog = {'user': dialogWrapper.attr('data-role'), 'message':[]}
            for (let j = 0; j < message.length; j ++){
                dialog.message.push($(message[j]).text())
            }
            dialogs.push(dialog)
        }
        return dialogs
    }
    $('#btn-test').click(extractConversationText)


    // ***********
    // Dialog rendering
    // ***********
    // middle page
    function createNewConvWrapper(){
        $('.conversation-wrapper').remove()
        let convID = Date.now()
        let convWrapperHTML = '<div id="conv-' + convID + '" class="conversation-wrapper">' +
            '<div class="conversation-dialog dialog-question" data-role="Expertise">' +
            '    <div class="dialog-portrait">' +
            '         <img src="images/expertise.jpg" class="dialog-portrait-img">' +
            '          <p class="dialog-portrait-name">Expertise</p>' +
            '    </div>' +
            '    <div class="dialog-msg-wrapper">' +
            '    </div>' +
            '</div>' +
            '</div>'
        $('.chat-page').append(convWrapperHTML)
        askQuestion(0)
    }
    function generateMessage(msg){
        return '<p class="dialog-msg">'+ msg +"</p>"
    }
    function generateDialog(user, msg){
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
    function generateConversationWrap(convInfo){
        //@convInfo: {conversation:[{user:, message:[]}], id:, user:}
        let convWrapperHTML = '<div id="' + convInfo.id + '" class="conversation-wrapper"></div>'
        $('.conversation-wrapper').remove()
        $('.chat-page').append(convWrapperHTML)
        loadConvInWrapper(JSON.parse(convInfo.conversation))
    }
    // right-side bar
    // generate brief of the conversation into card
    // @param conversation: {'questions':[{'q':, 'a':}], 'dialogs':[{'user':, 'message':[]}]}
    function generateConvCard(conversation, convID){
        console.log(conversation)
        // remove existing card
        $('.conversation-card[data-conv-target="' + convID +'"]').remove()
        // generate new conv card
        let title = conversation.dialogs[0].message
        let user = conversation.questions[0].a
        let content = conversation.dialogs[1].message
        console.log(conversation.dialogs[0])
        // if (conversation.length > 1) content = conversation[1].message
        let cardHTML = '<div class="conversation-card" data-conv-target="' + convID + '">\n' +
            '    <div class="go-corner">\n' +
            '        <div class="card-remove">\n' +
            '            x\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <p class="con-card-title">' + title + '</p>\n' +
            '    <p class="con-card-subtitle">' + user + '</p>\n' +
            '    <p class="con-card-content">' + content + '</p>\n' +
            '</div>'
        $('#right-sidebar').append(cardHTML)
        $('.enquire-wrapper').append(cardHTML)
    }


    // ***********
    // Chatbot
    // ***********
    $(document).on('click','.option', function (){
        let questionTarget = $(this).parents().closest('.msg-option').attr('data-question-target')
        let questionNo = parseInt(questionTarget.substr(questionTarget.lastIndexOf('-') + 1))
        // remove all shown later questions
        for (let i = questionNo + 1; i < questions.length; i++){
            $('#question-' + i).remove()
            $('[data-question-target=question-' + i + ']').remove()
        }
        // popup the next question
        let userInputWrapper = $('.input-wrapper')
        if (questionNo < questions.length - 1){
            askQuestion(questionNo + 1)
            userInputWrapper.slideUp('fast')

        }
        else if (userInputWrapper.is(':hidden')){
            userInputWrapper.slideDown("fast")
        }
        // set the clicked option as active
        $(this).siblings().removeClass('option-active')
        $(this).addClass('option-active')
    })
    function askQuestion(questionNo){
        let msgWrapper = $('.dialog-msg-wrapper')
        let question = questions[questionNo]
        let opts = options[questionNo]
        let HTMLquestion = '<p id="question-' + questionNo + '" class="dialog-msg msg-question">' + question + '</p>\n'
        let HTMLoptions = '<div class="msg-option" data-question-target="question-' + questionNo + '"> </div>\n'
        let optionWrapper = $(HTMLoptions)
        for (let i = 0; i < opts.length; i ++){
            optionWrapper.append('<p class="option" data-opt-no="' + i + '">' + opts[i] + '</p>')
        }
        msgWrapper.append(HTMLquestion)
        msgWrapper.append(optionWrapper)
    }
})