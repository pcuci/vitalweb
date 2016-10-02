$(document).ready(function() {
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
        _.each(data.data, function(visit) {
            if( visit.date !== null ) {
                var row = $('<tr><td>'+visit.date+'</td><td>'+visit.procedure+'</td><td>'+visit.provider+'</td><td>'+visit.practice+'</td><td>'+visit.specialty+'</td></tr>');
                row.click(function() {
                    var notes = visit.notes;
                    var title = visit.date+' - '+visit.procedure
                    showPopup(notes, title);
                });
            } else {
                var row = $('<tr><td></td><td>'+visit.procedure+'</td><td></td><td></td><td></td></tr>');
            }
            $('#clinical tbody').append(row);
        });
    });
});
