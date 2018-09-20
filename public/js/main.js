$(document).ready(function() {
    'use strict';

    $('.delete-article').on('click', function(e) {
        var $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: function() {
                alert('Deleting Article');
                window.location.href = "/";
            },
            erorr: function(err) {
                console.log(err);
            }
        })
    })
})