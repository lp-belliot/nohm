/*global $, nohmValidations*/
$(function () {
  var updateUserList = function () {
    $.get('/User/list', function (response) {
      var $ul = $('#users');
      $ul.empty();
      $.each(response, function (index, item) {
        $ul.append('<li>' + JSON.stringify(item) + '</li>');
      });
    });
  }
  updateUserList();
  $('#refreshusers').click(updateUserList);

  $('form').submit(function (e) {
    e.preventDefault();

    var data = {};
    $('input').each(function () {
      var $this = $(this);
      data[$this.attr('name')] = $this.val();
    });
    nohmValidations.validate('User', data).then((validation) => {
      $('#errors').empty();
      if (validation.result) {
        $('form').attr('disabled', true);
        $.post('/User/create', data, function (response) {
          if (response.result === 'success') {
            updateUserList();
          } else {
            $('#errors').append('<li>Server error: ' + JSON.stringify(response.data));
          }
        });
      } else {
        $.each(validation.errors, function (index, error) {
          $('#errors').append('<li>' + index + ': ' + JSON.stringify(error));
        });
      }
    });
  });
});
