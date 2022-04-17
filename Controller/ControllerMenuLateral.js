//Abre menu
$('.btnAbrirMenu').click(function(){
    $('.menuLateral').toggleClass('exibir');
});

//Fecha menu
$('.btnFecharMenu').click(function(){
    $('.menuLateral').toggleClass('exibir');
});

//Fecha menu lateral com clique fora
const menuLateral = $('.menuLateral'); 
$(document).mouseup(e => {
    if(!menuLateral.is(e.target) && menuLateral.has(e.target).length === 0){
        menuLateral.removeClass('exibir');
    }
});