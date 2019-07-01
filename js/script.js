$(document).ready(function() {

    var agentCount = 0;
    var softCount = 0;
    var operationCount = 0;

    var jsObj = {}
    var operationOneArray = [];
    var operationTwoArray = [];
    var operationThreeArray = [];
    var softArray = [];
    var actorArray = [];
    var connectionArray = [];
    var mainActor;
    var equalCount =0;
    var contributionValue = 0;


    // DRAG AND DROP CODE
    jQuery(function($) {

        $('.workArea').droppable({
            accept: '.nav .draggable',
            drop: function(event, ui) {
                var $clone = ui.helper.clone();
                if (!$clone.is('.inside-drop-zone')) {
                    if ($clone.hasClass("softItem")) {
                        softCount++;
                    
                        $(this).append($clone.addClass('added soft' + softCount).draggable({
                            containment: '.workArea  '
                        }));
                    } else {
                        operationCount++;
                        $(this).append($clone.addClass('added operation' + operationCount).draggable({
                            containment: '.workArea'
                        }));
                    }

                }
            }
        });

        $('.nav .draggable').draggable({
            helper: 'clone'
        });
    });


    // AGENT OPTION CODE
    $(document).on("click", ".agentItem", function() {
        $('#modalWindow').modal('show');
        $('#modalWindow .modal-content').removeClass('agentModal softModal operationModal connectionModal actorModal');
        $('#modalWindow').find('.modal-content').addClass('agentModal')
    });

    $(document).on("click", ".agentModal .updateModal", function() {
        agentCount++;
        var newAgentName = $('.agentName').val();
        var newMainGoalName = $('.mainGoalName').val();
        //$('.softItem.active').addClass(newSoftName);
        $('#modalWindow').modal('hide');
        $('.workArea').append('<div class="agentWorkArea agent' + agentCount + ' '+newAgentName+ '"><p class="agentHead btn btn-primary"></p></div>');
        $(".agent" + agentCount + " .agentHead").html(newAgentName);

        $('.agent' + agentCount + '').append('<li class="mainGoalAdded added softItem agentHead mainGoal ' + newMainGoalName + '"><a>' + newMainGoalName + '</a></li>')
            // $(".agent" + agentCount + " .agentHead").html(newAgentName);

        jsObj[newAgentName] = {}
        jsObj[newAgentName].goal = [newMainGoalName];
        console.log(jsObj)
        actorArray = Object.keys(jsObj);

        console.log("actor " + actorArray)
        $('.actor-select').append('<option value=' + newAgentName + '>' + newAgentName + '</option>');
        $('.main-select').append('<option value=' + newMainGoalName + '>' + newMainGoalName + '</option>');


    });


    // SOFT OPTION CODE
    $(document).on("click", ".added.softItem", function() {
        $('.added').removeClass('active');
        $(this).addClass('active');
        $('#modalWindow').modal('show');
        $('#modalWindow .modal-content').removeClass('agentModal softModal operationModal connectionModal actorModal');
        $('#modalWindow').find('.modal-content').addClass('softModal');
    });

    $(document).on("click", ".softModal .updateModal", function() {
        var newSoftName = $('.softName').val();
        var thesoftItemCount = $('.softItem.active').attr('class').split(' ' );
       // console.log(thesoftItemCount[6]);
        $('.softItem.active').addClass(newSoftName);
        var newSoftWeight = $('.softWeight').val();
        var newSoftConnection = $('.softConnection').val();
        $('#modalWindow').modal('hide');
        $('.softItem.active a').html(newSoftName);
        if (($('.softItem.active p').length) == 0)
            $('.softItem.active').append('<p>W:<span>' + newSoftWeight + '</span></p>');
        else
            $('.softItem.active p span').html(newSoftWeight);
        $('.added').removeClass('active');

        mainActor = $('.actor-select').val();
        mainGoal = $('.main-select').val();

        var tempGoal = {
            [newSoftName]: newSoftWeight
        };

        existingGoal = jsObj[mainActor].mainGoal;
        existingGoal = {...existingGoal,
            ...tempGoal
        };
        jsObj[mainActor].mainGoal = {};
        jsObj[mainActor].mainGoal = existingGoal;

        if ($(".soft-select option[value=" + newSoftName + "]").length == 0) {
            $('.soft-select').append('<option value=' + newSoftName  + '>' + newSoftName + '</option>');
        }

        var pointOne = newSoftName;
        connect(pointOne, mainGoal);


    });

    $(document).on("click", ".softModal .btnDelete", function() {
        $('#modalWindow').modal('hide');
        $('.workArea .active').remove('.active');
    });


    // OPERATION OPTION CODE
    $(document).on("click", ".added.operationItem", function() {
        $('.added').removeClass('active');
        $(this).addClass('active');
        $('#modalWindow').modal('show');
        $('#modalWindow .modal-content').removeClass('agentModal softModal operationModal connectionModal actorModal');
        $('#modalWindow').find('.modal-content').addClass('operationModal');
    });

    $(document).on("click", ".operationModal .updateModal", function() {
        var newOperationName = $('.operationName').val();
        $('#modalWindow').modal('hide');
        $('.operationItem.active a').html(newOperationName);
        $('.operationItem.active').addClass(newOperationName);
        $('.added').removeClass('active');

        mainActor = $('.actor-select').val();
        console.log(mainActor);

        if(mainActor == actorArray[0]) {
            operationOneArray.push(newOperationName);
            jsObj[mainActor].operation = operationOneArray;    
        }
        if(mainActor == actorArray[1]) {
            operationTwoArray.push(newOperationName);
            jsObj[mainActor].operation = operationTwoArray;    
        }

        if(mainActor == actorArray[2]) {
            operationThreeArray.push(newOperationName);
            jsObj[mainActor].operation = operationThreeArray;    
        }

    

        

        console.log(jsObj);
        var leafConnection = $('.soft-select').val();
        
        
        var pointOne = newOperationName;
        for (var i = 0; i < leafConnection.length; i++) {
            if (!($('.connection-style').hasClass(pointOne + "_" + leafConnection[i]))) {

                var leafConnectionValue = $('.soft-select option[value='+leafConnection[i]+']').text();

                connect(pointOne, leafConnection[i]);
            }
        }
    });


    $(document).on("click", ".operationModal .btnDelete", function() {
        $('#modalWindow').modal('hide');
        $('.workArea .active').remove('.active');
    });


    // CONNECTION OPTION CODE
    $(document).on("click", ".connection-style", function() {
        //alert('cliked');
        $('.added').removeClass('active');
        $(this).addClass('active');
        $("#modalWindow").modal('show');
        $('#modalWindow .modal-content').removeClass('agentModal softModal operationModal connectionModal actorModal');
        $('#modalWindow').find('.modal-content').addClass('connectionModal');
    });

    $(document).on("click", ".connectionModal .updateModal", function() {
        var connectionValue = $('.connectionValue').val();
        $('#modalWindow').modal('hide');
        $('.active').css('z-index', '-100');
        $('.active').append("<div><p>" + connectionValue + "</p></div>")
        var connectionClass = $('.active').attr('class').split(' ')[0];
        $('.connection-style').removeClass('active');

        var tempConnection = {
            [connectionClass]: connectionValue
        };

        existingConnection = jsObj[mainActor].connections;

        existingConnection = {...existingConnection,
            ...tempConnection
        };
        jsObj[mainActor].connections = existingConnection;
        console.log(jsObj);
    });

    $(document).on("click", ".connectionModal .btnDelete", function() {
        $('#modalWindow').modal('hide');
        $('.workArea .active').remove('.active');
    });


    // CONNECTION CODE
    function connect(one, two) {
        oneConnect = "." + one;
        twoConnect = "." + two;

        $(oneConnect).connections({
            to: twoConnect,
            class: one + '_' + two + ' connection-style '
        });
    }


    //****************************** LOGIC *******************************//


    $('.calculateBtn').click(function() {

        // $('.added').removeClass('active');
        // $(this).addClass('active');
        $("#modalWindow").modal('show');
        $('#modalWindow .modal-content').removeClass('agentModal softModal operationModal connectionModal actorModal');
        $('#modalWindow').find('.modal-content').addClass('actorModal');

    });


    $(document).on("click", ".actorModal .updateModal", function() {
        var selectedActor = $('.actor-select').val();;
        $('#modalWindow').modal('hide');


        calculateActor(selectedActor);


    });


    function calculateActor(value) {

        var actorArray = value;
        var totalOperations = (Object.keys(jsObj[actorArray].operation).length);
        var totalGoal = (Object.keys(jsObj[actorArray].mainGoal).length)
        var operationScore = new Array(totalOperations).fill(0);
        var bestContribution = new Array(totalGoal).fill(0);
        var goalContribution = new Array(totalGoal).fill(0);
        var goalConnection = new Array(totalGoal).fill(0);
        var bestOperation;
        var preGoalScore = 0;
        var goalScore;

        for (var i = 0; i < (Object.keys(jsObj[actorArray].operation).length); i++) {

            var operation = jsObj[actorArray].operation[i];
            Object.keys(jsObj[actorArray].mainGoal).forEach(function(key, idx) {

                var systemPlanWeight = jsObj[actorArray].mainGoal[key];
                var systemPlan = key
                var connectionSyntax = operation + '_' + systemPlan;
                operationScore[i] += ((systemPlanWeight) * (jsObj[actorArray].connections[connectionSyntax]));
            });
        }
           console.log(operationScore);

        bestOperation = jsObj[actorArray].operation[(operationScore.indexOf(Math.max.apply(window, operationScore)))]
        console.log(bestOperation)

        $("." + bestOperation).addClass('chosen');
        alert("Best Operation is "+bestOperation);


        bestOperationScore = (Math.max.apply(window, operationScore)).toFixed(2);
        console.log(bestOperationScore);
        var count = 0;
        var dependancy = false;
        Object.keys(jsObj[actorArray].mainGoal).forEach(function(key, idx) {

            var systemPlanWeight = jsObj[actorArray].mainGoal[key];
            console.log(systemPlanWeight);
            var systemPlan = key
            console.log(systemPlan);

            var systemPlanCompare = systemPlan.toLowerCase();

            if($(systemPlanCompare).length > 0) {
                dependancy = true;
                equalCount = count;
                connect(systemPlanCompare,systemPlan);
            } 


            var connectionSyntax = bestOperation + '_' + systemPlan;
            bestContribution[count] = jsObj[actorArray].connections[connectionSyntax];
            count++;
        });
        //    console.log(bestContribution);

        if(!dependancy)
            {
                for (var i = 0; i < totalGoal; i++) {
                goalContribution[i] = (Math.max(Math.min((bestOperationScore * bestContribution[i]), 1), -1)).toFixed(2);
               
            }
        }
        else {
            for (var i = 0; i < totalGoal; i++) {
                if(equalCount == i) {
                    goalContribution[i] = (Math.max(Math.min(((bestOperationScore * bestContribution[i])+contributionValue), 1), -1)).toFixed(2);
                contributionValue+= goalContribution[i]
                }
                else {
                     goalContribution[i] = (Math.max(Math.min((bestOperationScore * bestContribution[i]), 1), -1)).toFixed(2);
                }
            }
         }

       
        //    console.log(goalContribution);

        var mainGoalActor = jsObj[actorArray].goal;
        var count = 0;
        Object.keys(jsObj[actorArray].mainGoal).forEach(function(key, idx) {

            var systemPlanWeight = jsObj[actorArray].mainGoal[key];
            var systemPlan = key
            var connectionSyntax = systemPlan + '_' + mainGoalActor;
            goalConnection[count] = (jsObj[actorArray].connections[connectionSyntax]);
            count++;
        });
        console.log(goalConnection);

        for (var i = 0; i < totalGoal; i++) {
            preGoalScore += goalContribution[i] * goalConnection[i]
        }
        //  console.log(preGoalScore);

        var finalScore = Math.max(Math.min(preGoalScore), 1, -1);
        console.log(preGoalScore);

    }
})