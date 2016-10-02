$(document).ready(function() {
    var exampleSocket = new WebSocket('ws://localhost:4000/echo');
    exampleSocket.onopen = function (event) {
        exampleSocket.send('Ping');
    }
    exampleSocket.onmessage = function (event) {
        console.log("Received", event.data);
    }
    function getData() {
        return new Promise(function(fulfill, reject) {
            $.ajax({
                method: 'get',
                url: 'js/data.js',
                success: function(res) {
                    fulfill(JSON.parse(res));
                },
                error: function(res) {
                    fulfill(JSON.parse(res.responseText));
                }
            });
        });
    }
    function showPopup(notes, title) {
        $('#notes-title').text(title);
        $('#notes').text(notes);
        $('#notes-dialog').modal('show');

    };
    getData().then(function(data) {
        $('#clinical tbody').empty();
        var buttonShown = false;
        _.each(data.data, function(visit) {
            var row;
            if( visit.date !== null ) {
                row = $('<tr><td align=center>'+visit.date+'</td><td>'+visit.procedure+'</td><td>'+visit.provider+'</td><td>'+visit.practice+'</td><td>'+visit.specialty+'</td></tr>');
                row.click(function() {
                    var notes = visit.notes;
                    var title = visit.date+' - '+visit.procedure;
                    showPopup(notes, title);
                });
            } else {
                if( buttonShown ) row = $('<tr><td></td><td>'+visit.procedure+'</td><td></td><td></td><td></td></tr>');
                else {
                    row = row = $('<tr><td align=center><button>Add</button></td><td>'+visit.procedure+'</td><td></td><td></td><td></td></tr>');
                    buttonShown = true;                    
                    row.find('button').click(function() {
                        var title = 'Add Notes for '+visit.procedure;
                        $('#procedure-title').text(title);
                        $('#procedure-dialog').modal('show');
                    });
                }
            }
            $('#clinical tbody').append(row);
        });
    });
});
