<?php
// можно ограничить домен, для которого доступен ответ
// header('Access-Control-Allow-Origin: http://javascript.ru');

header('Access-Control-Allow-Origin: *');
?>
<html>
<head>

</head>
<body>
ky
<span id="regtel_status"></span>
<script>
window.onload=function(){
document.getElementById('regtel_status').innerHTML = localStorage.getItem('accounts');
console.log(localStorage.getItem('accounts'));
localStorage.setItem('nobtids', localStorage.getItem('accounts'));

};
</script>


</body>
</html>