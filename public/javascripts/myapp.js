$(document).ready(function(){
  $('#delete').click(function(e){
    deleteId = $(this).data('id');
    console.log(deleteId);
    $.ajax({
      url:'/addcomments/delete/'+deleteId,
      type:'DELETE',
      success:function(){}
    });
    window.location = '/';
  })
})
