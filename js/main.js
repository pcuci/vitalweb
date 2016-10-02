$(document).ready(function() {
    function getData() {
        return new Promise(function(fulfill, reject) {
            $('#clinical tbody').empty();
            $('#clinical tbody').append($('<tr><td colspan=5 align=center><br>Loading<br><img src="images/loading.gif"><br></td></tr>'));
            setTimeout(function() {
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
            }, 2000);
        });
    }
    function update() {
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
                    }).addClass('completed');
                } else {
                    if( buttonShown ) row = $('<tr><td></td><td>'+visit.procedure+'</td><td></td><td></td><td></td></tr>').addClass('future');
                    else {
                        row = row = $('<tr><td align=center><button>Add</button></td><td>'+visit.procedure+'</td><td></td><td></td><td></td></tr>').addClass('next');
                        buttonShown = true;                    
                        row.find('button').click(function() {
                            var title = 'Upload CCD for '+visit.procedure;
                            $('#procedure-title').text(title);
                            $('#procedure-dialog').modal('show');
                        });
                    }
                }
                $('#clinical tbody').append(row);
            });
        });
    }
    function doUpload() {
        update();
    }
    
    function showPopup(notes, title) {
        $('#notes-title').text(title);
        $('#notes').text(notes);
        $('#notes-dialog').modal('show');
    };
    $('#drop-target').on('dragenter', function() {
        $('#drop-target').css('border-style', 'solid');
    }).on('dragleave', function() {
        $('#drop-target').css('border-style', 'dashed');
    }).on('drop', function(ev) {
        ev.preventDefault();
        $('#procedure-dialog').modal('hide');
        doUpload();
    });
    var stopIt = function(e) {
        e.preventDefault();
        e.stopPropagation();        
        return false;
    }
    $(window).on("drag dragstart dragend dragover dragenter dragleave drop", stopIt);
    update();
});
